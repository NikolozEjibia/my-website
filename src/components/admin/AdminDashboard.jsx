import { useState, useEffect, useMemo } from 'react';
import { tickets as ticketsApi, users as usersApi, comments as commentsApi, auth as authApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';
import { useLang } from '../../context/LangContext';

const STATUS_LABELS = { open: 'Open', 'in-progress': 'In Progress', closed: 'Closed' };

// ── Create Agent Modal ────────────────────────────────────────────
function CreateAgentModal({ onClose, onCreated }) {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState('agent');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await usersApi.create({ name, email, password, role });
      onCreated(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(44,44,42,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'white', borderRadius: 16, padding: '32px 28px',
        width: 380, boxShadow: '0 8px 40px rgba(44,44,42,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 500 }}>ახალი Support / Agent</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888780' }}>✕</button>
        </div>

        {error && (
          <div style={{ background: '#FCEBEB', border: '1px solid #F09595', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: '#A32D2D', marginBottom: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'სახელი გვარი', val: name, set: setName, type: 'text', ph: 'Giorgi Beridze' },
            { label: 'Email',        val: email, set: setEmail, type: 'email', ph: 'giorgi@company.com' },
            { label: 'პაროლი',       val: password, set: setPassword, type: 'password', ph: 'მინ. 6 სიმბოლო' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#444441', display: 'block', marginBottom: 5 }}>{f.label}</label>
              <input
                type={f.type} required value={f.val} onChange={e => f.set(e.target.value)}
                placeholder={f.ph}
                style={{ width: '100%', padding: '9px 12px', fontSize: 14, border: '1px solid #D3D1C7', borderRadius: 9, background: '#FAFAF8', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444441', display: 'block', marginBottom: 5 }}>როლი</label>
            <select value={role} onChange={e => setRole(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', fontSize: 14, border: '1px solid #D3D1C7', borderRadius: 9, background: '#FAFAF8', outline: 'none', boxSizing: 'border-box' }}>
              <option value="agent">Agent (Support)</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '10px', fontSize: 14, fontWeight: 500,
            background: loading ? '#B5D4F4' : '#185FA5', color: 'white',
            border: 'none', borderRadius: 9, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'იქმნება...' : 'შექმნა'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────
function Sidebar({ stats, activeNav, onNav, agents, onCreateAgent, onBack, onDeleteAgent }) {
  const { logout } = useAuth();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <svg viewBox="0 0 16 16"><path d="M8 1L1 5v6l7 4 7-4V5L8 1zm0 2.1 5 2.86V11L8 13.9 3 11V5.96L8 3.1z"/></svg>
        </div>
        <div>
          <div className="sidebar-logo-text">HelpDesk IQ</div>
          <div className="sidebar-logo-sub">ADMIN PANEL</div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Main</div>
        {[
          { id: 'all',        icon: '🎫', label: 'All Tickets',   badge: stats?.total },
          { id: 'open',       icon: '📬', label: 'Open',          badge: stats?.open,        badgeClass: stats?.open > 0 ? 'red' : '' },
          { id: 'progress',   icon: '⚡', label: 'In Progress',   badge: stats?.progress },
          { id: 'closed',     icon: '✅', label: 'Closed' },
          { id: 'unassigned', icon: '👤', label: 'Unassigned',    badge: stats?.unassigned },
          { id: 'high',       icon: '🔴', label: 'High Priority', badge: stats?.highPriority },
                    { id: 'reports', icon: '📊', label: 'Reports', badge: null },
        ].map(item => (
          <button key={item.id} className={`sidebar-link${activeNav === item.id ? ' active' : ''}`} onClick={() => onNav(item.id)}>
            <span className="sidebar-link-icon">{item.icon}</span>
            {item.label}
            {item.badge > 0 && (
              <span className={`sidebar-badge${item.badgeClass ? ' ' + item.badgeClass : ''}`}>{item.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Team</div>
        {agents.map(a => (
          <div key={a.id} className="agent-row" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="agent-avatar" style={{ background: '#185FA5' }}>{a.avatar || a.name.slice(0,2).toUpperCase()}</div>
            <span className="agent-name" style={{ flex: 1 }}>{a.name}</span>
            <span style={{ fontSize: 10, color: '#B4B2A9', background: '#F5F3EE', padding: '1px 6px', borderRadius: 4 }}>{a.role}</span>
            <button
              onClick={() => onDeleteAgent(a.id, a.name)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F09595', fontSize: 14, padding: '2px 4px', lineHeight: 1 }}
              title="წაშლა"
            >✕</button>
          </div>
        ))}
        <button className="sidebar-link" style={{ marginTop: 8, color: 'var(--blue-600)' }} onClick={onCreateAgent}>
          <span className="sidebar-link-icon">➕</span> Support-ის დამატება
        </button>
      </div>

      <div style={{ padding: '12px 10px', marginTop: 'auto', borderTop: '1px solid rgba(68,68,65,0.08)' }}>
        <button className="sidebar-link" onClick={onBack} style={{ color: 'var(--gray-600)' }}>
          <span className="sidebar-link-icon">←</span> User Portal
        </button>
        <button className="sidebar-link" onClick={() => { logout(); onBack(); }} style={{ color: 'var(--red-600)' }}>
          <span className="sidebar-link-icon">🚪</span> გასვლა
        </button>
      </div>
    </aside>
  );
}
// ── Reporting View ────────────────────────────────────────────────
function ReportingView({ onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    ticketsApi.stats().then(s => { setData(s); setLoading(false); });
  }, []);

  const periodLabels = { day: 'დღეს', week: 'კვირაში', month: 'თვეში' };

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#888780', fontFamily: 'DM Sans, sans-serif' }}>იტვირთება...</div>
  );

  const cats = data?.byCategory || [];
  const total = cats.reduce((s, c) => s + c.count, 0) || 1;

  const colors = { WiFi:'#185FA5', Hardware:'#0F6E56', Software:'#BA7517', Account:'#A32D2D', Printer:'#5F5E5A', Other:'#888780' };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(44,44,42,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#F5F3EE', borderRadius: 16, width: '90%', maxWidth: 680,
        maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 8px 40px rgba(44,44,42,0.18)',
      }}>
        {/* Header */}
        <div style={{ background: 'white', padding: '20px 24px', borderRadius: '16px 16px 0 0', borderBottom: '1px solid rgba(68,68,65,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>📊 Reporting & Analytics</div>
            <div style={{ fontSize: 12, color: '#888780', marginTop: 2 }}>Ticket სტატისტიკა</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888780' }}>✕</button>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Stats overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { label: 'სულ', val: data.total,    color: '#185FA5', bg: '#E6F1FB' },
              { label: 'ღია',  val: data.open,     color: '#BA7517', bg: '#FAEEDA' },
              { label: 'პროცესი', val: data.progress, color: '#BA7517', bg: '#FAEEDA' },
              { label: 'დახურული', val: data.closed,  color: '#0F6E56', bg: '#E1F5EE' },
            ].map(s => (
              <div key={s.label} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(68,68,65,0.08)' }}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 300, color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', border: '1px solid rgba(68,68,65,0.08)' }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>კატეგორიების განაწილება</div>
            {cats.map(c => (
              <div key={c.category} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                  <span>{c.category}</span>
                  <span style={{ color: '#888780' }}>{c.count} ({Math.round(c.count/total*100)}%)</span>
                </div>
                <div style={{ height: 6, background: '#F5F3EE', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round(c.count/total*100)}%`, background: colors[c.category] || '#185FA5', borderRadius: 3, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
            {cats.length === 0 && <div style={{ color: '#888780', fontSize: 13 }}>მონაცემები არ არის</div>}
          </div>

          {/* Resolution rate */}
          <div style={{ background: 'white', borderRadius: 12, padding: '18px 20px', border: '1px solid rgba(68,68,65,0.08)' }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>გადაჭრის მაჩვენებელი</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ width: 80, height: 80, transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F5F3EE" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0F6E56" strokeWidth="3"
                    strokeDasharray={`${Math.round(data.closed/Math.max(data.total,1)*100)} 100`}
                    strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, color: '#0F6E56' }}>
                  {Math.round(data.closed/Math.max(data.total,1)*100)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#444441', marginBottom: 4 }}>
                  <strong>{data.closed}</strong> ticket გადაჭრილია <strong>{data.total}</strong>-დან
                </div>
                <div style={{ fontSize: 12, color: '#888780' }}>
                  {data.unassigned} ticket მინიჭების გარეშეა
                </div>
                <div style={{ fontSize: 12, color: '#888780' }}>
                  {data.highPriority} მაღალი პრიორიტეტის ticket-ი ღიაა
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
function StatusBadge({ status }) {
  const cls = status === 'in-progress' ? 'progress' : status;
  return <span className={`badge ${cls}`}><span className="badge-dot" />{STATUS_LABELS[status]}</span>;
}

function PriorityBadge({ priority }) {
  const labels = { high: 'High', med: 'Medium', low: 'Low' };
  return <span className={`priority-badge ${priority}`}>{labels[priority]}</span>;
}

// ── Detail panel ──────────────────────────────────────────────────
function DetailPanel({ ticket, onClose, onUpdate, agents }) {
  const [localStatus,   setLocalStatus]   = useState(ticket.status);
  const [localAssignee, setLocalAssignee] = useState(ticket.assignee?.id || '');
  const [commentList,   setCommentList]   = useState(ticket.comments || []);
  const [newComment,    setNewComment]    = useState('');
  const [saving,        setSaving]        = useState(false);

  async function changeStatus(s) {
    setLocalStatus(s);
    await ticketsApi.update(ticket.id, { status: s });
    onUpdate(ticket.id, { status: s });
  }

  async function changeAssignee(val) {
    setLocalAssignee(val);
    await ticketsApi.update(ticket.id, { assignee_id: val ? Number(val) : null });
    const ag = agents.find(a => String(a.id) === String(val));
    onUpdate(ticket.id, { assignee: ag || null });
  }

  async function addComment() {
    if (!newComment.trim()) return;
    setSaving(true);
    try {
      const data = await commentsApi.add(ticket.id, newComment.trim());
      setCommentList(c => [...c, data.comment]);
      setNewComment('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="detail-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="detail-panel">
        <div className="detail-header">
          <div style={{ flex: 1 }}>
            <p className="detail-title">{ticket.title}</p>
            <div className="detail-meta-row">
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#888780' }}>{ticket.ref}</span>
              <StatusBadge status={localStatus} />
              <PriorityBadge priority={ticket.priority} />
              <span className={`via-badge ${ticket.via}`}>{ticket.via === 'wizard' ? '🔧 wizard' : '✍️ direct'}</span>
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>✕</button>
        </div>

        <div className="detail-body">
          {/* Requester info */}
          {(ticket.requesterName || ticket.requesterDepartment) && (
            <div className="detail-section">
              <div className="detail-section-label">მომთხოვნი</div>
              <div style={{ background: '#F5F3EE', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>
                  👤 {ticket.requesterName || '—'}
                </div>
                <div style={{ fontSize: 12, color: '#888780' }}>
                  🏢 {ticket.requesterDepartment || '—'}
                </div>
              </div>
            </div>
          )}

          {ticket.description && (
            <div className="detail-section">
              <div className="detail-section-label">Description</div>
              <p style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6 }}>{ticket.description}</p>
            </div>
          )}

          <div className="detail-section">
            <div className="detail-section-label">Details</div>
            {[
              ['Category', ticket.category],
              ['Created',  ticket.createdAt?.slice(0, 16).replace('T', ' ')],
              ['Updated',  ticket.updatedAt?.slice(0, 16).replace('T', ' ')],
            ].map(([l, v]) => (
              <div className="detail-field" key={l}>
                <span className="detail-field-label">{l}</span>
                <span className="detail-field-value">{v}</span>
              </div>
            ))}
          </div>

          <div className="detail-section">
            <div className="detail-section-label">Status</div>
            <div className="detail-status-btns">
              {['open', 'in-progress', 'closed'].map(s => {
                const activeClass = localStatus === s ? `active-${s === 'in-progress' ? 'progress' : s}` : '';
                return (
                  <button key={s} className={`status-btn ${activeClass}`} onClick={() => changeStatus(s)}>
                    {STATUS_LABELS[s]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-section-label">Assigned to</div>
            <select className="detail-assign-select" value={localAssignee} onChange={e => changeAssignee(e.target.value)}>
              <option value="">— Unassigned</option>
              {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.role})</option>)}
            </select>
          </div>

          <div className="detail-section">
            <div className="detail-section-label">Comments ({commentList.length})</div>
            {commentList.length > 0 && (
              <div className="comment-list">
                {commentList.map(c => (
                  <div key={c.id} className="comment-item">
                    <div className="comment-meta">
                      <span className="comment-author">{c.user?.name}</span>
                      <span className="comment-time">{c.createdAt?.slice(11, 16)}</span>
                    </div>
                    <p className="comment-text">{c.body}</p>
                  </div>
                ))}
              </div>
            )}
            <textarea className="comment-input" placeholder="Add a note…" value={newComment} onChange={e => setNewComment(e.target.value)} />
            <button className="btn-sm btn-sm-primary" onClick={addComment} disabled={saving}>
              {saving ? '...' : 'Add comment'}
            </button>
<div style={{ marginTop: 16 }}>
  <button
    onClick={async () => {
      if (!confirm(`წაიშალოს ticket ${ticket.ref}?`)) return;
      try {
        await ticketsApi.delete(ticket.id);
        onClose();
      } catch (err) {
        alert('შეცდომა: ' + err.message);
      }
    }}
    style={{
      width: '100%', padding: '9px', fontSize: 13, fontWeight: 500,
      background: '#FCEBEB', color: '#A32D2D',
      border: '1px solid #F09595', borderRadius: 9, cursor: 'pointer',
    }}
  >
    🗑 Ticket-ის წაშლა
  </button>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function AdminDashboard({ onBack }) {
  const [tickets,      setTickets]      = useState([]);
  const [stats,        setStats]        = useState(null);
  const [agents,       setAgents]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [selected,     setSelected]     = useState(null);
  const [activeNav,    setActiveNav]    = useState('all');
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [catFilter,    setCatFilter]    = useState('');
  const [prioFilter,   setPrioFilter]   = useState('');
  const [showCreate,   setShowCreate]   = useState(false);
    const [showReports, setShowReports] = useState(false);

  async function loadData() {
  try {
    const [ticketData, statsData, agentData] = await Promise.all([
      user?.role === 'agent'
        ? ticketsApi.list({ assignee: 'me' })
        : ticketsApi.list(),
      ticketsApi.stats(),
      usersApi.agents(),
    ]);
    setTickets(ticketData.tickets || []);
    setStats(statsData);
    setAgents(agentData.users || []);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => { loadData(); }, []);

  function updateTicket(id, patch) {
    setTickets(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));
    if (selected?.id === id) setSelected(t => ({ ...t, ...patch }));
  }

  async function openDetail(ticket) {
    const data = await ticketsApi.get(ticket.id);
    setSelected(data.ticket);
  }

  const navFiltered = useMemo(() => tickets.filter(t => {
    if (activeNav === 'open')       return t.status === 'open';
    if (activeNav === 'progress')   return t.status === 'in-progress';
    if (activeNav === 'closed')     return t.status === 'closed';
    if (activeNav === 'unassigned') return !t.assignee;
    if (activeNav === 'high')       return t.priority === 'high';
    return true;
  }), [tickets, activeNav]);

  const displayed = useMemo(() => navFiltered.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || (t.ref||'').toLowerCase().includes(q) || (t.requesterName||'').toLowerCase().includes(q);
    const matchStatus = !statusFilter || t.status === statusFilter;
    const matchCat    = !catFilter    || t.category === catFilter;
    const matchPrio   = !prioFilter   || t.priority === prioFilter;
    return matchSearch && matchStatus && matchCat && matchPrio;
  }), [navFiltered, search, statusFilter, catFilter, prioFilter]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F3EE', fontFamily: 'DM Sans, sans-serif', color: '#888780' }}>
      იტვირთება...
    </div>
  );

  return (
    <div className="admin-shell">
      <Sidebar
        stats={stats} activeNav={activeNav} onNav={(id) => { if (id === 'reports') setShowReports(true); else setActiveNav(id); }}
        agents={agents} onCreateAgent={() => setShowCreate(true)}
        onBack={onBack}
        onDeleteAgent={async (id, name) => {
          if (!confirm(`წაშალოთ ${name}?`)) return;
          try {
            await usersApi.delete(id);
            setAgents(prev => prev.filter(x => x.id !== id));
          } catch (err) {
            alert('შეცდომა: ' + err.message);
          }
        }}
      />

      <div className="admin-main">
        <div className="admin-topbar">
          <span className="admin-topbar-title">
            {user?.role === 'agent' ? 'My Tickets' : { all:'All Tickets', open:'Open', progress:'In Progress', closed:'Closed', unassigned:'Unassigned', high:'High Priority' }[activeNav]
          </span>
          <div className="admin-topbar-spacer" />
          <input className="admin-search" placeholder="Search tickets or names…" value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn-sm btn-sm-primary" onClick={loadData} style={{ marginLeft: 8 }}>↻</button>
          <div className="topbar-avatar">IT</div>
{(() => {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-toggle" style={{ marginLeft: 8 }}>
      <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
      <span className="lang-sep">|</span>
      <button className={`lang-btn${lang === 'ka' ? ' active' : ''}`} onClick={() => setLang('ka')}>ქარ</button>
    </div>
  );
})()}
        </div>

        <div className="admin-content">
          <div className="stats-grid">
            {[
              { label: 'Total tickets',  val: stats?.total    || 0, cls: 'blue'  },
              { label: 'Open',           val: stats?.open     || 0, cls: 'amber' },
              { label: 'In progress',    val: stats?.progress || 0, cls: 'amber' },
              { label: 'Resolved',       val: stats?.closed   || 0, cls: 'teal'  },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-card-label">{s.label}</div>
                <div className={`stat-card-val ${s.cls}`}>{s.val}</div>
              </div>
            ))}
          </div>

          <div className="section-card">
            <div className="section-header">
              <span className="section-header-title">{displayed.length} ticket{displayed.length !== 1 ? 's' : ''}</span>
              <div className="section-header-spacer" />
              <div className="filter-row">
                <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="">All statuses</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
                <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                  <option value="">All categories</option>
                  {['WiFi','Hardware','Software','Account','Printer','Other'].map(c => <option key={c}>{c}</option>)}
                </select>
                <select className="filter-select" value={prioFilter} onChange={e => setPrioFilter(e.target.value)}>
                  <option value="">All priorities</option>
                  <option value="high">High</option>
                  <option value="med">Medium</option>
                  <option value="low">Low</option>
                </select>
                {(statusFilter || catFilter || prioFilter || search) && (
                  <button className="filter-btn" onClick={() => { setStatusFilter(''); setCatFilter(''); setPrioFilter(''); setSearch(''); }}>Clear ✕</button>
                )}
              </div>
            </div>

            <table className="tickets-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>ID</th>
                  <th>Title</th>
                  <th style={{ width: 130 }}>მომთხოვნი</th>
                  <th style={{ width: 80 }}>დეპარტ.</th>
                  <th style={{ width: 110 }}>Status</th>
                  <th style={{ width: 90 }}>Priority</th>
                  <th style={{ width: 150 }}>Assigned to</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length > 0 ? displayed.map(t => (
                  <tr key={t.id} onClick={() => openDetail(t)}>
                    <td className="ticket-id-cell">{t.ref}</td>
                    <td className="ticket-title-cell">
                      <div className="ticket-title">{t.title}</div>
                      <div className="ticket-meta">{t.category} · {t.createdAt?.slice(0,10)}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{t.requesterName || '—'}</td>
                    <td style={{ fontSize: 12, color: '#888780' }}>{t.requesterDepartment || '—'}</td>
                    <td><StatusBadge status={t.status} /></td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="assignee-cell">
                        {t.assignee && (
                          <div className="agent-avatar" style={{ width: 22, height: 22, fontSize: 9, background: '#185FA5' }}>
                            {t.assignee.avatar || t.assignee.name?.slice(0,2)}
                          </div>
                        )}
                        <select className="assign-select" value={t.assignee?.id || ''}
                          onChange={async e => {
                            const val = e.target.value;
                            await ticketsApi.update(t.id, { assignee_id: val ? Number(val) : null });
                            const ag = agents.find(a => String(a.id) === String(val));
                            updateTicket(t.id, { assignee: ag || null });
                          }}>
                          <option value="">Unassigned</option>
                          {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7}><div className="table-empty">No tickets found.</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <DetailPanel ticket={selected} agents={agents} onClose={() => setSelected(null)} onUpdate={updateTicket} />
      )}

      {showCreate && (
        <CreateAgentModal
          onClose={() => setShowCreate(false)}
          onCreated={newAgent => setAgents(a => [...a, newAgent])}
        />
      )}
{showReports && <ReportingView onClose={() => setShowReports(false)} />}
{/* Mobile bottom nav */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          {[
            { id: 'all',      icon: '🎫', label: 'ყველა' },
            { id: 'open',     icon: '📬', label: 'ღია' },
            { id: 'progress', icon: '⚡', label: 'პროცესი' },
            { id: 'closed',   icon: '✅', label: 'დახ.' },
          ].map(item => (
            <button key={item.id} className={`mobile-nav-btn${activeNav === item.id ? ' active' : ''}`} onClick={() => setActiveNav(item.id)}>
              <span className="mnb-icon">{item.icon}</span>
              <span className="mnb-label">{item.label}</span>
            </button>
          ))}
          <button className="mobile-nav-btn" onClick={() => setShowCreate(true)}>
            <span className="mnb-icon">➕</span>
            <span className="mnb-label">Support</span>
          </button>
          <button className="mobile-nav-btn" onClick={() => { logout(); onBack(); }}>
            <span className="mnb-icon">🚪</span>
            <span className="mnb-label">გასვლა</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

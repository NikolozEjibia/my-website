import { useState, useEffect, useMemo } from 'react';
import { tickets as ticketsApi, users as usersApi, comments as commentsApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

const STATUS_LABELS = { open: 'Open', 'in-progress': 'In Progress', closed: 'Closed' };

// ── Sidebar ───────────────────────────────────────────────────────
function Sidebar({ stats, activeNav, onNav, agents }) {
  const { user, logout } = useAuth();
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
          { id: 'closed',     icon: '✅', label: 'Closed',        badge: null },
          { id: 'unassigned', icon: '👤', label: 'Unassigned',    badge: stats?.unassigned },
          { id: 'high',       icon: '🔴', label: 'High Priority', badge: stats?.highPriority },
        ].map(item => (
          <button key={item.id} className={`sidebar-link${activeNav === item.id ? ' active' : ''}`} onClick={() => onNav(item.id)}>
            <span className="sidebar-link-icon">{item.icon}</span>
            {item.label}
            {item.badge != null && item.badge > 0 && (
              <span className={`sidebar-badge${item.badgeClass ? ' ' + item.badgeClass : ''}`}>{item.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div className="sidebar-agents">
        <div className="sidebar-agents-label">Team</div>
        {agents.map(a => (
          <div key={a.id} className="agent-row">
            <div className="agent-avatar" style={{ background: '#185FA5' }}>{a.avatar || a.name.slice(0,2).toUpperCase()}</div>
            <span className="agent-name">{a.name}</span>
          </div>
        ))}
        <button className="sidebar-link" style={{ marginTop: 8, color: 'var(--red-600)' }} onClick={logout}>
          <span className="sidebar-link-icon">🚪</span> გასვლა
        </button>
      </div>
    </aside>
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
              ['Submitted by', ticket.user?.name || '—'],
              ['Created', ticket.createdAt?.slice(0, 16).replace('T', ' ')],
              ['Updated', ticket.updatedAt?.slice(0, 16).replace('T', ' ')],
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
              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
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
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function AdminDashboard() {
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

  async function loadData() {
    try {
      const [ticketData, statsData, agentData] = await Promise.all([
        ticketsApi.list(),
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
    // load with comments
    const data = await ticketsApi.get(ticket.id);
    setSelected(data.ticket);
  }

  // nav filter
  const navFiltered = useMemo(() => tickets.filter(t => {
    if (activeNav === 'open')       return t.status === 'open';
    if (activeNav === 'progress')   return t.status === 'in-progress';
    if (activeNav === 'closed')     return t.status === 'closed';
    if (activeNav === 'unassigned') return !t.assignee;
    if (activeNav === 'high')       return t.priority === 'high';
    return true;
  }), [tickets, activeNav]);

  // search + filters
  const displayed = useMemo(() => navFiltered.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || (t.ref||'').toLowerCase().includes(q);
    const matchStatus = !statusFilter || t.status === statusFilter;
    const matchCat    = !catFilter    || t.category === catFilter;
    const matchPrio   = !prioFilter   || t.priority === prioFilter;
    return matchSearch && matchStatus && matchCat && matchPrio;
  }), [navFiltered, search, statusFilter, catFilter, prioFilter]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F3EE', fontFamily: 'DM Sans, sans-serif', color: '#888780' }}>
        იტვირთება...
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <Sidebar stats={stats} activeNav={activeNav} onNav={setActiveNav} agents={agents} />

      <div className="admin-main">
        <div className="admin-topbar">
          <span className="admin-topbar-title">
            {{ all:'All Tickets', open:'Open', progress:'In Progress', closed:'Closed', unassigned:'Unassigned', high:'High Priority' }[activeNav]}
          </span>
          <div className="admin-topbar-spacer" />
          <input className="admin-search" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn-sm btn-sm-primary" onClick={loadData} style={{ marginLeft: 8 }}>↻ Refresh</button>
          <div className="topbar-avatar" title="Admin">IT</div>
        </div>

        <div className="admin-content">
          {/* Stats */}
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

          {/* Table */}
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
                  <th style={{ width: 120 }}>Status</th>
                  <th style={{ width: 90 }}>Priority</th>
                  <th style={{ width: 150 }}>Assigned to</th>
                  <th style={{ width: 90 }}>Source</th>
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
                    <td><StatusBadge status={t.status} /></td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="assignee-cell">
                        {t.assignee && (
                          <div className="agent-avatar" style={{ width: 22, height: 22, fontSize: 9, background: '#185FA5' }}>
                            {t.assignee.avatar || t.assignee.name?.slice(0,2)}
                          </div>
                        )}
                        <select className="assign-select"
                          value={t.assignee?.id || ''}
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
                    <td><span className={`via-badge ${t.via}`}>{t.via === 'wizard' ? '🔧 wizard' : '✍️ direct'}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan={6}><div className="table-empty">No tickets found.</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <DetailPanel ticket={selected} agents={agents} onClose={() => setSelected(null)} onUpdate={updateTicket} />
      )}
    </div>
  );
}

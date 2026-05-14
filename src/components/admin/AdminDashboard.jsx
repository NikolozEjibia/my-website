import { useState, useMemo } from 'react';
import { AGENTS, INITIAL_TICKETS } from '../../data/tickets';
import '../../styles/admin.css';

// ── helpers ────────────────────────────────────────────────────────
const STATUS_LABELS = { open: 'Open', 'in-progress': 'In Progress', closed: 'Closed' };
const CATEGORIES    = ['WiFi', 'Hardware', 'Software', 'Account', 'Printer', 'Other'];
const PRIORITIES    = ['high', 'med', 'low'];

function agent(id) { return AGENTS.find(a => a.id === id) || null; }

// ── Sidebar ────────────────────────────────────────────────────────
function Sidebar({ tickets, activeNav, onNav }) {
  const open   = tickets.filter(t => t.status === 'open').length;
  const inProg = tickets.filter(t => t.status === 'in-progress').length;

  const agentLoads = AGENTS.map(a => ({
    ...a,
    count: tickets.filter(t => t.assignee === a.id && t.status !== 'closed').length,
  }));

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
          { id: 'all',      icon: '🎫', label: 'All Tickets', badge: tickets.length },
          { id: 'open',     icon: '📬', label: 'Open',        badge: open,   badgeClass: open   > 0 ? 'red' : '' },
          { id: 'progress', icon: '⚡', label: 'In Progress', badge: inProg, badgeClass: '' },
          { id: 'closed',   icon: '✅', label: 'Closed',      badge: null },
        ].map(item => (
          <button
            key={item.id}
            className={`sidebar-link${activeNav === item.id ? ' active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            {item.label}
            {item.badge != null && (
              <span className={`sidebar-badge${item.badgeClass ? ' ' + item.badgeClass : ''}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Views</div>
        {[
          { id: 'unassigned', icon: '👤', label: 'Unassigned' },
          { id: 'high',       icon: '🔴', label: 'High Priority' },
        ].map(item => (
          <button
            key={item.id}
            className={`sidebar-link${activeNav === item.id ? ' active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="sidebar-agents">
        <div className="sidebar-agents-label">Team</div>
        {agentLoads.map(a => (
          <div key={a.id} className="agent-row">
            <div className="agent-avatar" style={{ background: a.color }}>{a.avatar}</div>
            <span className="agent-name">{a.name}</span>
            {a.count > 0 && <span className="agent-count">{a.count}</span>}
          </div>
        ))}
      </div>
    </aside>
  );
}

// ── Status badge ───────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cls = status === 'in-progress' ? 'progress' : status;
  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" />
      {STATUS_LABELS[status]}
    </span>
  );
}

// ── Priority badge ─────────────────────────────────────────────────
function PriorityBadge({ priority }) {
  const labels = { high: 'High', med: 'Medium', low: 'Low' };
  return <span className={`priority-badge ${priority}`}>{labels[priority]}</span>;
}

// ── Ticket detail panel ────────────────────────────────────────────
const DEMO_COMMENTS = {
  '#TK-0046': [
    { author: 'Giorgi M.', time: '10:05', text: 'Checked the printer — paper jam cleared. Waiting for user to confirm print works.' },
    { author: 'System',    time: '10:30', text: 'Status updated to In Progress.' },
  ],
  '#TK-0045': [
    { author: 'Ana K.',    time: '10:55', text: 'Confirmed Outlook issue. Running Exchange sync repair. Will update shortly.' },
  ],
};

function DetailPanel({ ticket, onClose, onUpdate, agents }) {
  const [localStatus,   setLocalStatus]   = useState(ticket.status);
  const [localAssignee, setLocalAssignee] = useState(ticket.assignee || '');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(DEMO_COMMENTS[ticket.id] || []);

  function save(field, val) {
    if (field === 'status')   { setLocalStatus(val);   onUpdate(ticket.id, { status:   val }); }
    if (field === 'assignee') { setLocalAssignee(val); onUpdate(ticket.id, { assignee: val || null }); }
  }

  function addComment() {
    if (!comment.trim()) return;
    setComments(c => [...c, { author: 'You (Admin)', time: 'Just now', text: comment.trim() }]);
    setComment('');
  }

  const ag = agent(localAssignee);

  return (
    <div className="detail-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="detail-panel">
        <div className="detail-header">
          <div style={{ flex: 1 }}>
            <p className="detail-title">{ticket.title}</p>
            <div className="detail-meta-row">
              <span className="ticket-id-cell">{ticket.id}</span>
              <StatusBadge status={localStatus} />
              <PriorityBadge priority={ticket.priority} />
              <span className={`via-badge ${ticket.via}`}>{ticket.via === 'wizard' ? '🔧 wizard' : '✍️ direct'}</span>
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>✕</button>
        </div>

        <div className="detail-body">
          {/* Details */}
          <div className="detail-section">
            <div className="detail-section-label">Details</div>
            {[
              ['Category', ticket.category],
              ['Created',  ticket.created],
              ['Updated',  ticket.updated],
              ['Source',   ticket.via === 'wizard' ? 'Troubleshooting wizard' : 'Direct submission'],
            ].map(([l, v]) => (
              <div className="detail-field" key={l}>
                <span className="detail-field-label">{l}</span>
                <span className="detail-field-value">{v}</span>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="detail-section">
            <div className="detail-section-label">Status</div>
            <div className="detail-status-btns">
              {['open', 'in-progress', 'closed'].map(s => {
                const activeClass = localStatus === s ? `active-${s === 'in-progress' ? 'progress' : s}` : '';
                return (
                  <button key={s} className={`status-btn ${activeClass}`} onClick={() => save('status', s)}>
                    {STATUS_LABELS[s]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assign */}
          <div className="detail-section">
            <div className="detail-section-label">Assigned to</div>
            <select
              className="detail-assign-select"
              value={localAssignee}
              onChange={e => save('assignee', e.target.value)}
            >
              <option value="">— Unassigned</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Comments */}
          <div className="detail-section">
            <div className="detail-section-label">Comments ({comments.length})</div>
            {comments.length > 0 && (
              <div className="comment-list">
                {comments.map((c, i) => (
                  <div key={i} className="comment-item">
                    <div className="comment-meta">
                      <span className="comment-author">{c.author}</span>
                      <span className="comment-time">{c.time}</span>
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
            <textarea
              className="comment-input"
              placeholder="Add a note or update…"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button className="btn-sm btn-sm-primary" onClick={addComment}>Add comment</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main table row ─────────────────────────────────────────────────
function TicketRow({ ticket, onSelect, onAssign, agents }) {
  const ag = agent(ticket.assignee);
  return (
    <tr onClick={() => onSelect(ticket)}>
      <td className="ticket-id-cell">{ticket.id}</td>
      <td className="ticket-title-cell">
        <div className="ticket-title">{ticket.title}</div>
        <div className="ticket-meta">{ticket.category} · {ticket.created}</div>
      </td>
      <td><StatusBadge status={ticket.status} /></td>
      <td><PriorityBadge priority={ticket.priority} /></td>
      <td onClick={e => e.stopPropagation()}>
        <div className="assignee-cell">
          {ag && (
            <div className="agent-avatar" style={{ width: 22, height: 22, fontSize: 9, background: ag.color }}>
              {ag.avatar}
            </div>
          )}
          <select
            className="assign-select"
            value={ticket.assignee || ''}
            onChange={e => onAssign(ticket.id, e.target.value || null)}
          >
            <option value="">Unassigned</option>
            {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      </td>
      <td>
        <span className={`via-badge ${ticket.via}`}>
          {ticket.via === 'wizard' ? '🔧 wizard' : '✍️ direct'}
        </span>
      </td>
    </tr>
  );
}

// ── Root AdminDashboard ────────────────────────────────────────────
export default function AdminDashboard() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [activeNav, setActiveNav]       = useState('all');
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [catFilter, setCatFilter]       = useState('');
  const [prioFilter, setPrioFilter]     = useState('');
  const [selected, setSelected]         = useState(null);

  // stats
  const stats = useMemo(() => ({
    total:    tickets.length,
    open:     tickets.filter(t => t.status === 'open').length,
    progress: tickets.filter(t => t.status === 'in-progress').length,
    closed:   tickets.filter(t => t.status === 'closed').length,
  }), [tickets]);

  // nav → filter mapping
  const navFiltered = useMemo(() => {
    return tickets.filter(t => {
      if (activeNav === 'open')       return t.status === 'open';
      if (activeNav === 'progress')   return t.status === 'in-progress';
      if (activeNav === 'closed')     return t.status === 'closed';
      if (activeNav === 'unassigned') return !t.assignee;
      if (activeNav === 'high')       return t.priority === 'high';
      return true;
    });
  }, [tickets, activeNav]);

  // filters + search
  const displayed = useMemo(() => {
    return navFiltered.filter(t => {
      const q = search.toLowerCase();
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.id.includes(q) || t.category.toLowerCase().includes(q);
      const matchStatus = !statusFilter || t.status === statusFilter;
      const matchCat    = !catFilter    || t.category === catFilter;
      const matchPrio   = !prioFilter   || t.priority === prioFilter;
      return matchSearch && matchStatus && matchCat && matchPrio;
    });
  }, [navFiltered, search, statusFilter, catFilter, prioFilter]);

  function updateTicket(id, patch) {
    setTickets(ts => ts.map(t => t.id === id ? { ...t, ...patch, updated: 'Just now' } : t));
    if (selected?.id === id) setSelected(t => ({ ...t, ...patch }));
  }

  const navTitles = {
    all: 'All Tickets', open: 'Open Tickets', progress: 'In Progress',
    closed: 'Closed', unassigned: 'Unassigned', high: 'High Priority',
  };

  return (
    <div className="admin-shell">
      <Sidebar tickets={tickets} activeNav={activeNav} onNav={setActiveNav} />

      <div className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <span className="admin-topbar-title">{navTitles[activeNav]}</span>
          <div className="admin-topbar-spacer" />
          <input
            className="admin-search"
            placeholder="Search tickets…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="topbar-avatar">IT</div>
        </div>

        <div className="admin-content">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-label">Total tickets</div>
              <div className="stat-card-val blue">{stats.total}</div>
              <div className="stat-card-sub">All time</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Open</div>
              <div className="stat-card-val amber">{stats.open}</div>
              <div className="stat-card-sub">Awaiting response</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">In progress</div>
              <div className="stat-card-val amber">{stats.progress}</div>
              <div className="stat-card-sub">Being handled</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Resolved</div>
              <div className="stat-card-val teal">{stats.closed}</div>
              <div className="stat-card-sub">Closed tickets</div>
            </div>
          </div>

          {/* Tickets table */}
          <div className="section-card">
            <div className="section-header">
              <span className="section-header-title">
                {displayed.length} ticket{displayed.length !== 1 ? 's' : ''}
              </span>
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
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="filter-select" value={prioFilter} onChange={e => setPrioFilter(e.target.value)}>
                  <option value="">All priorities</option>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                </select>
                {(statusFilter || catFilter || prioFilter || search) && (
                  <button className="filter-btn" onClick={() => { setStatusFilter(''); setCatFilter(''); setPrioFilter(''); setSearch(''); }}>
                    Clear ✕
                  </button>
                )}
              </div>
            </div>

            <table className="tickets-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>ID</th>
                  <th>Title</th>
                  <th style={{ width: 110 }}>Status</th>
                  <th style={{ width: 90 }}>Priority</th>
                  <th style={{ width: 160 }}>Assigned to</th>
                  <th style={{ width: 90 }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length > 0
                  ? displayed.map(t => (
                      <TicketRow
                        key={t.id}
                        ticket={t}
                        agents={AGENTS}
                        onSelect={setSelected}
                        onAssign={(id, val) => updateTicket(id, { assignee: val })}
                      />
                    ))
                  : (
                    <tr>
                      <td colSpan={6}>
                        <div className="table-empty">No tickets match your filters.</div>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail slide-over */}
      {selected && (
        <DetailPanel
          ticket={selected}
          agents={AGENTS}
          onClose={() => setSelected(null)}
          onUpdate={updateTicket}
        />
      )}
    </div>
  );
}

import { useState, useCallback } from 'react';
import { categories, flows } from '../data/flows';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import { tickets as ticketsApi } from '../api/client';
import '../styles/portal.css';

function detectCat(text) {
  const lower = text.toLowerCase();
  for (const cat of categories) {
    if (cat.keywords.some(k => lower.includes(k))) return cat.id;
  }
  return null;
}

// ── Language toggle ───────────────────────────────────────────────
function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-toggle">
      <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
      <span className="lang-sep">|</span>
      <button className={`lang-btn${lang === 'ka' ? ' active' : ''}`} onClick={() => setLang('ka')}>ქარ</button>
    </div>
  );
}

// ── Top nav ───────────────────────────────────────────────────────
function TopNav({ view, onSwitch }) {
  const { t } = useLang();
  const { user, logout } = useAuth();
  return (
    <nav className="topnav">
      <a className="topnav-logo" href="#">
        <div className="logo-mark">
          <svg viewBox="0 0 16 16"><path d="M8 1L1 5v6l7 4 7-4V5L8 1zm0 2.1 5 2.86V11L8 13.9 3 11V5.96L8 3.1z"/></svg>
        </div>
        <span className="logo-text">HelpDesk IQ</span>
        <span className="logo-badge">BETA</span>
      </a>
      <div className="topnav-spacer" />
      <button className={`topnav-link${view === 'portal' ? ' active' : ''}`} onClick={() => onSwitch('portal')}>{t('nav_portal')}</button>
      <button className={`topnav-link${view === 'status' ? ' active' : ''}`} onClick={() => onSwitch('status')}>{t('nav_tickets')}</button>
      {(user?.role === 'admin' || user?.role === 'agent') && (
        <button className="topnav-link" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)', border: '1px solid var(--blue-100)' }}
          onClick={() => window.__goTo?.('admin')}>{t('nav_admin')}</button>
      )}
      <button className="topnav-link" onClick={logout} style={{ color: 'var(--gray-400)' }}>
        {user?.name} · გასვლა
      </button>
      <LangToggle />
    </nav>
  );
}

// ── Portal form ───────────────────────────────────────────────────
function PortalForm({ onStartWizard, onDirectTicket }) {
  const { t } = useLang();
  const [text, setText] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);
  const [detectedCat, setDetectedCat] = useState(null);

  const handleTextChange = useCallback(e => {
    const val = e.target.value;
    setText(val);
    const d = detectCat(val);
    setDetectedCat(d);
    if (d && !selectedCat) setSelectedCat(d);
  }, [selectedCat]);

  return (
    <>
      <div className="hero">
        <div className="hero-eyebrow">{t('hero_eyebrow')}</div>
        <h1>{t('hero_title1')}<strong>{t('hero_title2')}</strong>{t('hero_title3')}</h1>
        <p className="hero-sub">{t('hero_sub')}</p>
      </div>
      <div className="portal-main">
        <div className="card">
          <div className="card-header">
            <div className="card-icon">✍️</div>
            <div>
              <div className="card-title">{t('form_desc_label')}</div>
              <div className="card-subtitle">{t('form_section_title')}</div>
            </div>
          </div>
          <div className="card-body">
            <textarea className="form-textarea" placeholder={t('form_desc_placeholder')} value={text} onChange={handleTextChange} />
            {detectedCat && (
              <div className="detect-hint">
                🔍 {t('form_detected')} <strong>{t(categories.find(c => c.id === detectedCat)?.labelKey)}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon">🗂</div>
            <div>
              <div className="card-title">{t('form_cat_label')}</div>
              <div className="card-subtitle">{t('form_cat_sub')}</div>
            </div>
          </div>
          <div className="card-body">
            <div className="cat-grid">
              {categories.map(cat => (
                <button key={cat.id} className={`cat-pill${selectedCat === cat.id ? ' active' : ''}`} onClick={() => setSelectedCat(cat.id)}>
                  <span className="cat-pill-icon">{cat.icon}</span>
                  <span className="cat-pill-label">{t(cat.labelKey)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => onStartWizard(selectedCat || 'other', text)}>
            🔧 {t('form_btn_wizard')}
          </button>
          <button className="btn btn-ghost" onClick={() => onDirectTicket(selectedCat || 'other', text)}>
            {t('form_btn_direct')}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Wizard ────────────────────────────────────────────────────────
function WizardView({ category, problemText, onBack, onCreateTicket, onResolved }) {
  const { t, lang } = useLang();
  const flow    = flows[category] || flows.other;
  const catInfo = categories.find(c => c.id === category) || categories[5];

  const [stepId,  setStepId]  = useState('s0');
  const [result,  setResult]  = useState(null);
  const [history, setHistory] = useState([]);

  const currentStep = flow.steps.find(s => s.id === stepId);
  const stepIndex   = flow.steps.findIndex(s => s.id === stepId);
  const total       = flow.steps.length;
  const progress    = result ? 100 : Math.round(((stepIndex + 1) / (total + 1)) * 100);

  const q      = step => lang === 'ka' ? (step.q_ka   || step.q)     : step.q;
  const rTitle = r    => lang === 'ka' ? (r.title_ka  || r.title)    : r.title;
  const rDesc  = r    => lang === 'ka' ? (r.desc_ka   || r.desc)     : r.desc;

  function answer(yes) {
    const next = yes ? currentStep.yes : currentStep.no;
    setHistory(h => [...h, { a: yes ? t('wizard_yes') : t('wizard_no'), q: q(currentStep) }]);
    if (flow.results[next]) setResult(flow.results[next]);
    else setStepId(next);
  }

  return (
    <>
      <div className="hero">
        <div className="hero-eyebrow">{t('wizard_eyebrow')}</div>
        <h1>{catInfo.icon}&nbsp;<strong>{t(catInfo.labelKey)}</strong></h1>
        <p className="hero-sub">{t('wizard_sub')}</p>
      </div>
      <div className="portal-main">
        <div className="card">
          <div className="wizard-progress">
            <div className="wizard-progress-meta">
              <span className={result ? '' : 'wizard-progress-label'}>
                {result ? t('wizard_result') : `${t('wizard_step')} ${stepIndex + 1} ${t('wizard_of')} ${total}`}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="progress-track"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
          </div>

          {history.length > 0 && (
            <div className="step-trail">
              {history.map((h, i) => (
                <span key={i} className="step-crumb">{h.a === t('wizard_yes') ? '✓' : '✗'} {h.q.slice(0, 32)}…</span>
              ))}
            </div>
          )}

          <div className="wizard-body">
            {!result ? (
              <>
                <p className="wizard-question">{q(currentStep)}</p>
                <div className="wizard-answer-grid">
                  <button className="answer-btn answer-yes" onClick={() => answer(true)}>✓ {t('wizard_yes')}</button>
                  <button className="answer-btn answer-no"  onClick={() => answer(false)}>✕ {t('wizard_no')}</button>
                </div>
              </>
            ) : (
              <>
                <div className={`result-card ${result.success ? 'success' : 'escalate'}`}>
                  <div className="result-icon">{result.success ? '✅' : '⚠️'}</div>
                  <div className={`result-title ${result.success ? 'success' : 'escalate'}`}>{rTitle(result)}</div>
                  <p className="result-desc">{rDesc(result)}</p>
                </div>
                {result.success ? (
                  <div className="btn-row">
                    <button className="btn btn-success-ghost" onClick={onResolved}>{t('wizard_solved')}</button>
                    <button className="btn btn-ghost" onClick={() => onCreateTicket(problemText, category, 'wizard')}>{t('wizard_notworking')}</button>
                  </div>
                ) : (
                  <div className="btn-row">
                    <button className="btn btn-primary" onClick={() => onCreateTicket(problemText, category, 'wizard')}>{t('wizard_create')}</button>
                    <button className="btn btn-ghost" onClick={onBack}>{t('wizard_back')}</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {!result && (
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={onBack}>{t('wizard_backform')}</button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Success screen ────────────────────────────────────────────────
function SuccessView({ ticketRef, onReset }) {
  const { t } = useLang();
  return (
    <>
      <div className="hero" style={{ paddingBottom: 0 }} />
      <div className="portal-main">
        <div className="card">
          <div className="success-screen">
            <div className="success-icon-wrap">✓</div>
            <h2 className="success-title">{t('success_title')}</h2>
            <p className="success-desc">{t('success_desc')}</p>
            <div className="ticket-id-badge">🎫 {ticketRef}</div>
            <p className="success-desc" style={{ fontSize: 12, color: '#B4B2A9' }}>{t('success_save')}</p>
            <div className="btn-row" style={{ justifyContent: 'center', marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={onReset}>{t('success_another')}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Resolved screen ───────────────────────────────────────────────
function ResolvedView({ onReset }) {
  const { t } = useLang();
  return (
    <>
      <div className="hero" style={{ paddingBottom: 0 }} />
      <div className="portal-main">
        <div className="card">
          <div className="success-screen">
            <div className="success-icon-wrap" style={{ background: '#E1F5EE', borderColor: '#9FE1CB' }}>🎉</div>
            <h2 className="success-title">{t('resolved_title')}</h2>
            <p className="success-desc">{t('resolved_desc')}</p>
            <div className="btn-row" style={{ justifyContent: 'center', marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={onReset}>{t('resolved_btn')}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── My Tickets ────────────────────────────────────────────────────
function StatusView() {
  const { t, lang } = useLang();
  const [myTickets, setMyTickets] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useState(() => {
    ticketsApi.list().then(data => {
      setMyTickets(data.tickets || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statusLabel = { open: t('ticket_submitted'), 'in-progress': t('ticket_inprogress'), closed: t('ticket_resolved') };
  const steps = [t('ticket_submitted'), t('ticket_assigned'), t('ticket_inprogress'), t('ticket_resolved')];

  return (
    <>
      <div className="hero">
        <div className="hero-eyebrow">{t('tickets_eyebrow')}</div>
        <h1>{t('tickets_title1')}<strong>{t('tickets_title2')}</strong></h1>
        <p className="hero-sub">{t('tickets_sub')}</p>
      </div>
      <div className="portal-main">
        {loading && <div style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>იტვირთება...</div>}
        {!loading && myTickets.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)', fontSize: 14 }}>
            ჯერ ტიკეტი არ გაქვს გაგზავნილი.
          </div>
        )}
        {myTickets.map(ticket => {
          const activeIdx = ticket.status === 'closed' ? 4 : ticket.status === 'in-progress' ? 2 : 1;
          return (
            <div className="card" key={ticket.id} style={{ marginBottom: 12 }}>
              <div className="card-header">
                <div className="card-icon" style={{ fontSize: 14 }}>🎫</div>
                <div style={{ flex: 1 }}>
                  <div className="card-title">{ticket.title}</div>
                  <div className="card-subtitle" style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{ticket.ref}</span>
                    <span>·</span><span>{ticket.category}</span>
                    <span>·</span><span>{statusLabel[ticket.status]}</span>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ paddingTop: 16 }}>
                {steps.map((s, i) => {
                  const done   = i < activeIdx;
                  const active = i === activeIdx - 1 && ticket.status !== 'closed';
                  const future = i >= activeIdx && ticket.status !== 'closed';
                  const dotCls = done || ticket.status === 'closed' ? 'done' : active ? 'active' : 'future';
                  return (
                    <div className="status-row" key={s}>
                      <div className="status-dot-col">
                        <div className={`status-dot ${dotCls}`} />
                        {i < steps.length - 1 && <div className="status-connector" />}
                      </div>
                      <div>
                        <div className={`status-label${future ? ' future' : ''}`}>{s}</div>
                        {(done || active) && (
                          <div className="status-time">{i === 0 ? ticket.createdAt?.slice(0,10) : '—'}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Root ──────────────────────────────────────────────────────────
export default function UserPortal() {
  const [navView,  setNavView]  = useState('portal');
  const [screen,   setScreen]   = useState('form');
  const [wizCat,   setWizCat]   = useState(null);
  const [wizText,  setWizText]  = useState('');
  const [ticketRef, setTicketRef] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleCreateTicket(text, category, via = 'direct') {
    setSubmitting(true);
    try {
      const data = await ticketsApi.create({
        title:    text || `${category} issue`,
        description: text,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        priority: 'med',
        via,
      });
      setTicketRef(data.ticket.ref);
      setScreen('success');
    } catch (err) {
      alert('შეცდომა: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleStartWizard(cat, text) {
    setWizCat(cat);
    setWizText(text);
    setScreen('wizard');
  }

  function handleReset() {
    setScreen('form');
    setWizCat(null);
    setWizText('');
    setTicketRef('');
  }

  return (
    <div className="app-shell">
      <TopNav view={navView} onSwitch={v => { setNavView(v); if (v === 'portal') handleReset(); }} />
      {submitting && (
        <div style={{ position: 'fixed', top: 60, left: 0, right: 0, background: '#185FA5', color: 'white', textAlign: 'center', padding: 10, fontSize: 13, zIndex: 999 }}>
          ⏳ ტიკეტი იქმნება...
        </div>
      )}
      {navView === 'status' ? (
        <StatusView />
      ) : (
        <>
          {screen === 'form'     && <PortalForm onStartWizard={handleStartWizard} onDirectTicket={(cat, text) => handleCreateTicket(text, cat, 'direct')} />}
          {screen === 'wizard'   && <WizardView category={wizCat} problemText={wizText} onBack={handleReset} onCreateTicket={handleCreateTicket} onResolved={() => setScreen('resolved')} />}
          {screen === 'success'  && <SuccessView ticketRef={ticketRef} onReset={handleReset} />}
          {screen === 'resolved' && <ResolvedView onReset={handleReset} />}
        </>
      )}
    </div>
  );
}

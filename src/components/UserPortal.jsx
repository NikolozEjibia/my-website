import { useState, useCallback } from 'react';
import { categories, flows } from '../data/flows';
import { useLang } from '../context/LangContext';
import { tickets as ticketsApi } from '../api/client';
import '../styles/portal.css';

const DEPARTMENTS = ['IT', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations', 'Other'];

function detectCat(text) {
  const lower = text.toLowerCase();
  for (const cat of categories) {
    if (cat.keywords.some(k => lower.includes(k))) return cat.id;
  }
  return null;
}

// ── Lang toggle ───────────────────────────────────────────────────
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
function TopNav({ onAdminClick, userName }) {
  const { t } = useLang();
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
      {userName && (
        <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>👤 {userName}</span>
      )}
      <button
        className="topnav-link"
        style={{ background: 'var(--blue-50)', color: 'var(--blue-600)', border: '1px solid var(--blue-100)' }}
        onClick={onAdminClick}
      >
        🔐 Admin
      </button>
      <LangToggle />
    </nav>
  );
}

// ── User Registration Form ────────────────────────────────────────
function UserRegForm({ onEnter }) {
  const { lang } = useLang();
  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [department,  setDepartment]  = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !department) return;
    onEnter({ firstName: firstName.trim(), lastName: lastName.trim(), department });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F3EE', fontFamily: 'var(--font-sans)' }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: '40px 36px',
        width: 420, border: '1px solid rgba(68,68,65,0.10)',
        boxShadow: '0 4px 24px rgba(44,44,42,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, background: '#185FA5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="white">
              <path d="M8 1L1 5v6l7 4 7-4V5L8 1zm0 2.1 5 2.86V11L8 13.9 3 11V5.96L8 3.1z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>HelpDesk IQ</div>
            <div style={{ fontSize: 11, color: '#888780' }}>IT Support Portal</div>
          </div>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 6, letterSpacing: -0.02 }}>
          {lang === 'ka' ? 'მოგესალმებით!' : 'Welcome!'}
        </h2>
        <p style={{ fontSize: 13, color: '#888780', marginBottom: 24 }}>
          {lang === 'ka' ? 'გაგრძელებისთვის შეავსეთ თქვენი ინფორმაცია' : 'Please fill in your details to continue'}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#444441', display: 'block', marginBottom: 5 }}>
                {lang === 'ka' ? 'სახელი' : 'First name'}
              </label>
              <input
                required value={firstName} onChange={e => setFirstName(e.target.value)}
                placeholder={lang === 'ka' ? 'სახელი' : 'John'}
                style={{ width: '100%', padding: '9px 12px', fontSize: 14, border: '1px solid #D3D1C7', borderRadius: 9, background: '#FAFAF8', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#444441', display: 'block', marginBottom: 5 }}>
                {lang === 'ka' ? 'გვარი' : 'Last name'}
              </label>
              <input
                required value={lastName} onChange={e => setLastName(e.target.value)}
                placeholder={lang === 'ka' ? 'გვარი' : 'Doe'}
                style={{ width: '100%', padding: '9px 12px', fontSize: 14, border: '1px solid #D3D1C7', borderRadius: 9, background: '#FAFAF8', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444441', display: 'block', marginBottom: 5 }}>
              {lang === 'ka' ? 'დეპარტამენტი' : 'Department'}
            </label>
            <select
              required value={department} onChange={e => setDepartment(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', fontSize: 14, border: '1px solid #D3D1C7', borderRadius: 9, background: '#FAFAF8', outline: 'none', boxSizing: 'border-box', color: department ? '#2C2C2A' : '#B4B2A9' }}
            >
              <option value="" disabled>{lang === 'ka' ? 'აირჩიეთ დეპარტამენტი' : 'Select department'}</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <button type="submit" style={{
            width: '100%', padding: '11px', fontSize: 14, fontWeight: 500,
            background: '#185FA5', color: 'white', border: 'none', borderRadius: 9, cursor: 'pointer',
          }}>
            {lang === 'ka' ? 'გაგრძელება →' : 'Continue →'}
          </button>
        </form>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <LangToggle />
          <button
            type="button"
            onClick={() => window.__showAdminLogin?.() || document.dispatchEvent(new CustomEvent('showAdminLogin'))}
            style={{
              background: 'none', border: '1px solid #D3D1C7',
              borderRadius: 8, padding: '5px 12px',
              fontSize: 12, color: '#888780', cursor: 'pointer',
            }}
          >
            🔐 Admin / Support
          </button>
        </div>
      </div>
    </div>
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

  const q      = step => lang === 'ka' ? (step.q_ka   || step.q)    : step.q;
  const rTitle = r    => lang === 'ka' ? (r.title_ka  || r.title)   : r.title;
  const rDesc  = r    => lang === 'ka' ? (r.desc_ka   || r.desc)    : r.desc;

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

// ── Success ───────────────────────────────────────────────────────
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

// ── Resolved ──────────────────────────────────────────────────────
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

// ── Root ──────────────────────────────────────────────────────────
export default function UserPortal({ onAdminClick, loggedInUser }) {
  // if agent/admin is logged in, skip reg form
  const [userInfo, setUserInfo] = useState(
    loggedInUser
      ? { firstName: loggedInUser.name, lastName: '', department: 'IT' }
      : null
  );
  const [screen,     setScreen]     = useState('form');
  const [wizCat,     setWizCat]     = useState(null);
  const [wizText,    setWizText]    = useState('');
  const [ticketRef,  setTicketRef]  = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleCreateTicket(text, category, via = 'direct') {
    if (!text || !text.trim()) {
      alert(via === 'direct' ? 'პრობლემის აღწერა შეიყვანეთ' : '');
      return;
    }
    setSubmitting(true);
    try {
      const data = await ticketsApi.createGuest({
        title:       text.trim().slice(0, 120) || `${category} issue`,
        description: text.trim(),
        category:    category.charAt(0).toUpperCase() + category.slice(1),
        priority:    'med',
        via,
        requester_name:       userInfo.lastName
          ? `${userInfo.firstName} ${userInfo.lastName}`
          : userInfo.firstName,
        requester_department: userInfo.department,
      });
      setTicketRef(data.ticket.ref);
      setScreen('success');
    } catch (err) {
      alert('შეცდომა: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleStartWizard(cat, text) { setWizCat(cat); setWizText(text); setScreen('wizard'); }
  function handleReset() { setScreen('form'); setWizCat(null); setWizText(''); setTicketRef(''); }

  if (!userInfo) {
    return <UserRegForm onEnter={setUserInfo} />;
  }

  const userName = userInfo.lastName
    ? `${userInfo.firstName} ${userInfo.lastName}`
    : userInfo.firstName;

  return (
    <div className="app-shell">
      <TopNav onAdminClick={onAdminClick} userName={userName} />
      {submitting && (
        <div style={{ position: 'fixed', top: 60, left: 0, right: 0, background: '#185FA5', color: 'white', textAlign: 'center', padding: 10, fontSize: 13, zIndex: 999 }}>
          ⏳ ტიკეტი იქმნება...
        </div>
      )}
      {screen === 'form'     && <PortalForm onStartWizard={handleStartWizard} onDirectTicket={(cat, text) => handleCreateTicket(text, cat, 'direct')} />}
      {screen === 'wizard'   && <WizardView category={wizCat} problemText={wizText} onBack={handleReset} onCreateTicket={handleCreateTicket} onResolved={() => setScreen('resolved')} />}
      {screen === 'success'  && <SuccessView ticketRef={ticketRef} onReset={handleReset} />}
      {screen === 'resolved' && <ResolvedView onReset={handleReset} />}
    </div>
  );
}

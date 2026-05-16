import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginModal({ onClose, onSuccess }) {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'admin' && user.role !== 'agent') {
        setError('თქვენ არ გაქვთ ადმინის წვდომა');
        return;
      }
      onSuccess(user);
    } catch (err) {
      setError(err.message || 'შესვლა ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(44,44,42,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'white', borderRadius: 16, padding: '36px 32px',
        width: 360, boxShadow: '0 8px 40px rgba(44,44,42,0.18)',
        border: '1px solid rgba(68,68,65,0.10)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, background: '#185FA5', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M8 1L1 5v6l7 4 7-4V5L8 1zm0 2.1 5 2.86V11L8 13.9 3 11V5.96L8 3.1z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Admin Panel</div>
              <div style={{ fontSize: 11, color: '#888780' }}>HelpDesk IQ</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 18, color: '#888780', lineHeight: 1,
          }}>✕</button>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>ადმინის შესვლა</h2>
        <p style={{ fontSize: 13, color: '#888780', marginBottom: 20 }}>
          ადმინ პანელზე წვდომისთვის შედით
        </p>

        {error && (
          <div style={{
            background: '#FCEBEB', border: '1px solid #F09595',
            borderRadius: 8, padding: '10px 14px', fontSize: 13,
            color: '#A32D2D', marginBottom: 14,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444441', display: 'block', marginBottom: 5 }}>
              Email
            </label>
            <input
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@email.com"
              style={{
                width: '100%', padding: '9px 12px', fontSize: 14,
                border: '1px solid #D3D1C7', borderRadius: 9,
                background: '#FAFAF8', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444441', display: 'block', marginBottom: 5 }}>
              პაროლი
            </label>
            <input
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '9px 12px', fontSize: 14,
                border: '1px solid #D3D1C7', borderRadius: 9,
                background: '#FAFAF8', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '10px', fontSize: 14, fontWeight: 500,
            background: loading ? '#B5D4F4' : '#185FA5', color: 'white',
            border: 'none', borderRadius: 9, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'მიმდინარეობს...' : 'შესვლა'}
          </button>
        </form>
      </div>
    </div>
  );
}

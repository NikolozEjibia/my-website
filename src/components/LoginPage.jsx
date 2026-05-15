import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onSuccess }) {
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
      onSuccess(user);
    } catch (err) {
      setError(err.message || 'შესვლა ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#F5F3EE',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: '40px 36px',
        width: 380, border: '1px solid rgba(68,68,65,0.10)',
        boxShadow: '0 4px 24px rgba(44,44,42,0.07)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 36, height: 36, background: '#185FA5', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
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
          შესვლა
        </h2>
        <p style={{ fontSize: 13, color: '#888780', marginBottom: 24 }}>
          გაგრძელებისთვის შედით თქვენს ანგარიშზე
        </p>

        {error && (
          <div style={{
            background: '#FCEBEB', border: '1px solid #F09595',
            borderRadius: 8, padding: '10px 14px', fontSize: 13,
            color: '#A32D2D', marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444441', display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="თქვენი email მისამართი"
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                border: '1px solid #D3D1C7', borderRadius: 10,
                background: '#FAFAF8', color: '#2C2C2A', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444441', display: 'block', marginBottom: 6 }}>
              პაროლი
            </label>
            <input
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                border: '1px solid #D3D1C7', borderRadius: 10,
                background: '#FAFAF8', color: '#2C2C2A', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '11px', fontSize: 14, fontWeight: 500,
              background: loading ? '#B5D4F4' : '#185FA5', color: 'white',
              border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'მიმდინარეობს...' : 'შესვლა'}
          </button>
        </form>

        {/* Demo hint */}
        <div style={{
          marginTop: 20, padding: '12px 14px', background: '#F5F3EE',
          borderRadius: 8, fontSize: 12, color: '#888780',
        }}>
          <div style={{ fontWeight: 500, marginBottom: 4, color: '#5F5E5A' }}>Demo ანგარიშები:</div>
          <div>👤 user@helpdesk.io / user123</div>
          <div>🛠 admin@helpdesk.io / admin123</div>
        </div>
      </div>
    </div>
  );
}

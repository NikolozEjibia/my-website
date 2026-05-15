import { useState } from 'react';
import { LangProvider } from './context/LangContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import UserPortal from './components/UserPortal';
import AdminDashboard from './components/admin/AdminDashboard';

function AppInner() {
  const { user, loading, logout } = useAuth();
  const [route, setRoute] = useState(
    window.location.hash === '#/admin' ? 'admin' : 'portal'
  );

  function goTo(r) {
    window.location.hash = r === 'admin' ? '#/admin' : '#/portal';
    setRoute(r);
  }
  window.__goTo   = goTo;
  window.__logout = logout;

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#F5F3EE',
        fontFamily: 'DM Sans, sans-serif', color: '#888780', fontSize: 14,
      }}>
        იტვირთება...
      </div>
    );
  }

  // not logged in → show login
  if (!user) {
    return <LoginPage onSuccess={(u) => {
      // after login, route by role
      if (u.role === 'admin' || u.role === 'agent') goTo('admin');
      else goTo('portal');
    }} />;
  }

  // admin/agent → admin dashboard
  if (route === 'admin' && (user.role === 'admin' || user.role === 'agent')) {
    return <AdminDashboard />;
  }

  // regular user → portal
  return <UserPortal />;
}

export default function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <AppInner />
      </LangProvider>
    </AuthProvider>
  );
}

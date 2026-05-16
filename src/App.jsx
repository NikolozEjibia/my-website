import { useState } from 'react';
import { LangProvider } from './context/LangContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import UserPortal from './components/UserPortal';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';

function AppInner() {
  const { user, logout } = useAuth();
  const [route, setRoute] = useState(
    window.location.hash === '#/admin' ? 'admin' : 'portal'
  );
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  function goTo(r) {
    window.location.hash = r === 'admin' ? '#/admin' : '#/portal';
    setRoute(r);
  }

  window.__goTo   = goTo;
  window.__logout = () => { logout(); goTo('portal'); };

  if (route === 'admin' && user && (user.role === 'admin' || user.role === 'agent')) {
    return <AdminDashboard onBack={() => goTo('portal')} />;
  }

  return (
    <>
      <UserPortal
        onAdminClick={() => setShowAdminLogin(true)}
        loggedInUser={user && (user.role === 'admin' || user.role === 'agent') ? user : null}
      />
      {showAdminLogin && (
        <AdminLoginModal
          onClose={() => setShowAdminLogin(false)}
          onSuccess={(u) => {
            setShowAdminLogin(false);
            goTo('admin');
          }}
        />
      )}
    </>
  );
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

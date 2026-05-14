import { useState } from 'react';
import UserPortal from './components/UserPortal';
import AdminDashboard from './components/admin/AdminDashboard';
import { LangProvider } from './context/LangContext';

export default function App() {
  const [route, setRoute] = useState(
    window.location.hash === '#/admin' ? 'admin' : 'portal'
  );

  function goTo(r) {
    window.location.hash = r === 'admin' ? '#/admin' : '#/portal';
    setRoute(r);
  }

  window.__goTo = goTo;

  return (
    <LangProvider>
      {route === 'admin' ? <AdminDashboard /> : <UserPortal />}
    </LangProvider>
  );
}

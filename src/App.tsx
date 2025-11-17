 
import AppShell from './components/AppShell';
import Login from './pages/Login';
import Clientes from './pages/Clientes';
import SIN from './pages/SIN';
import Comprimir from './pages/Comprimir';
import Configuracion from './pages/Configuracion';
import ToastStack from './components/ToastStack';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const { isAuthenticated, activeTab } = useAppStore();
  const showTab = isAuthenticated ? activeTab : 'Login';

  return (
    <div id="app-content">
      <AppShell />
      {showTab === 'Login' && <Login />}
      {showTab === 'Clientes' && <Clientes />}
      {showTab === 'SIN' && <SIN />}
      {showTab === 'Comprimir' && <Comprimir />}
      {showTab === 'Configuración' && <Configuracion />}
      <ToastStack />
    </div>
  );
}

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClientProvider } from './context/ClientContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ToastContainer from './components/notifications/ToastContainer';
import ConfirmDialog from './components/notifications/ConfirmDialog';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { confirmDialog } = useNotification();

  return (
    <>
      {isAuthenticated ? <Dashboard /> : <Login />}
      <ToastContainer />
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ClientProvider>
          <AppContent />
        </ClientProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

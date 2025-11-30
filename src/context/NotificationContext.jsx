import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState(null);

    // Toast notifications
    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        const toast = { id, message, type, duration };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showSuccess = useCallback((message, duration) => {
        return showToast(message, 'success', duration);
    }, [showToast]);

    const showError = useCallback((message, duration) => {
        return showToast(message, 'error', duration);
    }, [showToast]);

    const showInfo = useCallback((message, duration) => {
        return showToast(message, 'info', duration);
    }, [showToast]);

    const showWarning = useCallback((message, duration) => {
        return showToast(message, 'warning', duration);
    }, [showToast]);

    // Confirm dialog
    const confirm = useCallback((message, title = 'Confirmar') => {
        return new Promise((resolve) => {
            setConfirmDialog({
                title,
                message,
                onConfirm: () => {
                    setConfirmDialog(null);
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmDialog(null);
                    resolve(false);
                }
            });
        });
    }, []);

    const value = {
        toasts,
        showToast,
        removeToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        confirm,
        confirmDialog
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

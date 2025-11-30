import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import Toast from './Toast';

const ToastContainer = () => {
    const { toasts, removeToast } = useNotification();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            <div className="flex flex-col gap-2 pointer-events-auto">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </div>
    );
};

export default ToastContainer;

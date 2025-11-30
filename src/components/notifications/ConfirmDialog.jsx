import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };

        const handleEnter = (e) => {
            if (e.key === 'Enter') {
                onConfirm();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('keydown', handleEnter);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('keydown', handleEnter);
        };
    }, [onConfirm, onCancel]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slide-up">
                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b border-slate-200">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-slate-600">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-slate-200">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;

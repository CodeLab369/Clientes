import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, FileText } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const AnnotationsModal = ({ isOpen, onClose, clientId, clientName, annotations, onAddAnnotation, onDeleteAnnotation }) => {
    const [newAnnotation, setNewAnnotation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showError, confirm } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newAnnotation.trim()) {
            showError('Por favor ingrese una anotación');
            return;
        }

        setIsSubmitting(true);

        const annotationData = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            texto: newAnnotation.trim(),
            fecha: new Date().toISOString(),
        };

        await onAddAnnotation(annotationData);
        setNewAnnotation('');
        setIsSubmitting(false);
    };

    const handleDelete = async (annotationId) => {
        const confirmed = await confirm('¿Está seguro de eliminar esta anotación?', 'Confirmar Eliminación');
        if (confirmed) {
            await onDeleteAnnotation(annotationId);
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Anotaciones</h2>
                        {clientName && (
                            <p className="text-sm text-slate-600 mt-1">Cliente: {clientName}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Existing Annotations */}
                    {annotations && annotations.length > 0 ? (
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Anotaciones ({annotations.length})
                            </h3>
                            <div className="space-y-2">
                                {annotations.map((annotation) => (
                                    <div
                                        key={annotation.id}
                                        className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-slate-800 whitespace-pre-wrap break-words">
                                                    {annotation.texto}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-2">
                                                    {formatDate(annotation.fecha)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(annotation.id)}
                                                className="p-1.5 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                                                title="Eliminar anotación"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p>No hay anotaciones aún</p>
                        </div>
                    )}

                    {/* Add New Annotation Form */}
                    <div className="pt-4 border-t border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-700 mb-3">Nueva Anotación</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <textarea
                                value={newAnnotation}
                                onChange={(e) => setNewAnnotation(e.target.value)}
                                placeholder="Escriba su anotación aquí..."
                                className="input-field min-h-[100px] resize-y"
                                disabled={isSubmitting}
                            />
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newAnnotation.trim()}
                                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-4 h-4" />
                                    {isSubmitting ? 'Guardando...' : 'Agregar Anotación'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 btn-secondary"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnnotationsModal;

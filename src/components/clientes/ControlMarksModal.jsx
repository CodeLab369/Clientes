import React, { useState, useEffect } from 'react';
import { X, Plus, Tag, Trash2, Edit2, Check } from 'lucide-react';

const ControlMarksModal = ({ isOpen, onClose, onSave, clientId, clientName, currentMarks = [] }) => {
    const [globalMarks, setGlobalMarks] = useState([]);
    const [selectedMarks, setSelectedMarks] = useState([]);
    const [isCreatingMark, setIsCreatingMark] = useState(false);
    const [editingMarkId, setEditingMarkId] = useState(null);
    const [newMark, setNewMark] = useState({ nombre: '', color: '#3B82F6', submarcas: [] });
    const [newSubmarca, setNewSubmarca] = useState('');

    // Colores predefinidos para las marcas
    const colors = [
        { name: 'Azul', value: '#3B82F6' },
        { name: 'Verde', value: '#10B981' },
        { name: 'Rojo', value: '#EF4444' },
        { name: 'Amarillo', value: '#F59E0B' },
        { name: 'Púrpura', value: '#8B5CF6' },
        { name: 'Rosa', value: '#EC4899' },
        { name: 'Índigo', value: '#6366F1' },
        { name: 'Naranja', value: '#F97316' },
    ];

    // Cargar marcas globales del localStorage
    useEffect(() => {
        const stored = localStorage.getItem('controlMarks');
        if (stored) {
            setGlobalMarks(JSON.parse(stored));
        }
    }, []);

    // Cargar marcas seleccionadas del cliente
    useEffect(() => {
        if (isOpen && currentMarks) {
            setSelectedMarks(currentMarks);
        }
    }, [isOpen, currentMarks]);

    // Guardar marcas globales en localStorage
    const saveGlobalMarks = (marks) => {
        localStorage.setItem('controlMarks', JSON.stringify(marks));
        setGlobalMarks(marks);
    };

    // Crear nueva marca
    const handleCreateMark = () => {
        if (!newMark.nombre.trim()) return;

        const mark = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            nombre: newMark.nombre.trim(),
            color: newMark.color,
            submarcas: newMark.submarcas,
        };

        saveGlobalMarks([...globalMarks, mark]);
        setNewMark({ nombre: '', color: '#3B82F6', submarcas: [] });
        setIsCreatingMark(false);
    };

    // Actualizar marca existente
    const handleUpdateMark = () => {
        if (!newMark.nombre.trim()) return;

        const updatedMarks = globalMarks.map(mark =>
            mark.id === editingMarkId
                ? { ...mark, nombre: newMark.nombre.trim(), color: newMark.color, submarcas: newMark.submarcas }
                : mark
        );

        saveGlobalMarks(updatedMarks);
        setEditingMarkId(null);
        setNewMark({ nombre: '', color: '#3B82F6', submarcas: [] });
    };

    // Eliminar marca
    const handleDeleteMark = (markId) => {
        if (window.confirm('¿Estás seguro de eliminar esta marca? Se eliminará de todos los clientes.')) {
            saveGlobalMarks(globalMarks.filter(mark => mark.id !== markId));
            // Eliminar de seleccionadas también
            setSelectedMarks(selectedMarks.filter(sm => sm.marcaId !== markId));
        }
    };

    // Iniciar edición de marca
    const handleEditMark = (mark) => {
        setEditingMarkId(mark.id);
        setNewMark({
            nombre: mark.nombre,
            color: mark.color,
            submarcas: [...mark.submarcas],
        });
        setIsCreatingMark(true);
    };

    // Añadir submarca
    const handleAddSubmarca = () => {
        if (!newSubmarca.trim()) return;

        const submarca = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            nombre: newSubmarca.trim(),
        };

        setNewMark({
            ...newMark,
            submarcas: [...newMark.submarcas, submarca],
        });
        setNewSubmarca('');
    };

    // Eliminar submarca
    const handleDeleteSubmarca = (submarcaId) => {
        setNewMark({
            ...newMark,
            submarcas: newMark.submarcas.filter(sm => sm.id !== submarcaId),
        });
    };

    // Toggle selección de marca/submarca
    const toggleMarkSelection = (marcaId, submarcaId = null) => {
        const exists = selectedMarks.find(
            sm => sm.marcaId === marcaId && sm.submarcaId === submarcaId
        );

        if (exists) {
            setSelectedMarks(selectedMarks.filter(
                sm => !(sm.marcaId === marcaId && sm.submarcaId === submarcaId)
            ));
        } else {
            setSelectedMarks([...selectedMarks, { marcaId, submarcaId }]);
        }
    };

    // Verificar si está seleccionada
    const isSelected = (marcaId, submarcaId = null) => {
        return selectedMarks.some(
            sm => sm.marcaId === marcaId && sm.submarcaId === submarcaId
        );
    };

    // Guardar y cerrar
    const handleSave = () => {
        onSave(selectedMarks);
        onClose();
    };

    // Cancelar creación/edición
    const handleCancelEdit = () => {
        setIsCreatingMark(false);
        setEditingMarkId(null);
        setNewMark({ nombre: '', color: '#3B82F6', submarcas: [] });
        setNewSubmarca('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Marcas de Control</h2>
                        <p className="text-sm text-slate-600 mt-1">Cliente: {clientName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Gestión de Marcas Globales */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-800">Marcas Disponibles</h3>
                                {!isCreatingMark && (
                                    <button
                                        onClick={() => setIsCreatingMark(true)}
                                        className="btn-primary text-sm flex items-center gap-1 py-1 px-3"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Nueva Marca
                                    </button>
                                )}
                            </div>

                            {/* Formulario de creación/edición */}
                            {isCreatingMark && (
                                <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <h4 className="font-semibold text-slate-700 mb-3">
                                        {editingMarkId ? 'Editar Marca' : 'Nueva Marca'}
                                    </h4>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="label">Nombre de la Marca</label>
                                            <input
                                                type="text"
                                                value={newMark.nombre}
                                                onChange={(e) => setNewMark({ ...newMark, nombre: e.target.value })}
                                                className="input-field"
                                                placeholder="Ej: Prioridad Alta"
                                            />
                                        </div>

                                        <div>
                                            <label className="label">Color</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {colors.map(color => (
                                                    <button
                                                        key={color.value}
                                                        type="button"
                                                        onClick={() => setNewMark({ ...newMark, color: color.value })}
                                                        className={`h-10 rounded-lg border-2 transition-all ${newMark.color === color.value
                                                                ? 'border-slate-800 scale-110'
                                                                : 'border-slate-200 hover:border-slate-400'
                                                            }`}
                                                        style={{ backgroundColor: color.value }}
                                                        title={color.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="label">Submarcas (opcional)</label>
                                            <div className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={newSubmarca}
                                                    onChange={(e) => setNewSubmarca(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubmarca())}
                                                    className="input-field flex-1"
                                                    placeholder="Nombre de submarca"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddSubmarca}
                                                    className="btn-primary px-3"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {newMark.submarcas.length > 0 && (
                                                <div className="space-y-1">
                                                    {newMark.submarcas.map(submarca => (
                                                        <div
                                                            key={submarca.id}
                                                            className="flex items-center justify-between p-2 bg-white rounded border border-slate-200"
                                                        >
                                                            <span className="text-sm text-slate-700">{submarca.nombre}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteSubmarca(submarca.id)}
                                                                className="p-1 hover:bg-red-100 rounded transition-colors"
                                                            >
                                                                <Trash2 className="w-3 h-3 text-red-600" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={editingMarkId ? handleUpdateMark : handleCreateMark}
                                                className="btn-primary flex-1"
                                            >
                                                {editingMarkId ? 'Actualizar' : 'Crear'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="btn-secondary flex-1"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Lista de marcas globales */}
                            <div className="space-y-2">
                                {globalMarks.length === 0 ? (
                                    <p className="text-slate-500 text-sm text-center py-8">
                                        No hay marcas creadas. Crea tu primera marca.
                                    </p>
                                ) : (
                                    globalMarks.map(mark => (
                                        <div
                                            key={mark.id}
                                            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded"
                                                        style={{ backgroundColor: mark.color }}
                                                    />
                                                    <span className="font-medium text-slate-800">{mark.nombre}</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleEditMark(mark)}
                                                        className="p-1 hover:bg-blue-100 rounded transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="w-3 h-3 text-blue-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMark(mark.id)}
                                                        className="p-1 hover:bg-red-100 rounded transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-3 h-3 text-red-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            {mark.submarcas && mark.submarcas.length > 0 && (
                                                <div className="ml-6 space-y-1">
                                                    {mark.submarcas.map(submarca => (
                                                        <div
                                                            key={submarca.id}
                                                            className="text-sm text-slate-600"
                                                        >
                                                            • {submarca.nombre}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Asignación de Marcas al Cliente */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Marcas Asignadas</h3>

                            {globalMarks.length === 0 ? (
                                <p className="text-slate-500 text-sm text-center py-8">
                                    Crea marcas primero para poder asignarlas.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {globalMarks.map(mark => (
                                        <div
                                            key={mark.id}
                                            className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                                        >
                                            {/* Marca principal */}
                                            <button
                                                onClick={() => toggleMarkSelection(mark.id, null)}
                                                className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${isSelected(mark.id, null)
                                                        ? 'bg-white border-2'
                                                        : 'bg-transparent border-2 border-transparent hover:bg-white/50'
                                                    }`}
                                                style={{
                                                    borderColor: isSelected(mark.id, null) ? mark.color : 'transparent'
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded"
                                                        style={{ backgroundColor: mark.color }}
                                                    />
                                                    <span className="font-medium text-slate-800">{mark.nombre}</span>
                                                </div>
                                                {isSelected(mark.id, null) && (
                                                    <Check className="w-5 h-5" style={{ color: mark.color }} />
                                                )}
                                            </button>

                                            {/* Submarcas */}
                                            {mark.submarcas && mark.submarcas.length > 0 && (
                                                <div className="ml-6 mt-2 space-y-1">
                                                    {mark.submarcas.map(submarca => (
                                                        <button
                                                            key={submarca.id}
                                                            onClick={() => toggleMarkSelection(mark.id, submarca.id)}
                                                            className={`w-full flex items-center justify-between p-2 rounded-lg transition-all text-sm ${isSelected(mark.id, submarca.id)
                                                                    ? 'bg-white border-2'
                                                                    : 'bg-transparent border-2 border-transparent hover:bg-white/50'
                                                                }`}
                                                            style={{
                                                                borderColor: isSelected(mark.id, submarca.id) ? mark.color : 'transparent'
                                                            }}
                                                        >
                                                            <span className="text-slate-700">• {submarca.nombre}</span>
                                                            {isSelected(mark.id, submarca.id) && (
                                                                <Check className="w-4 h-4" style={{ color: mark.color }} />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Resumen de selección */}
                            {selectedMarks.length > 0 && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm font-medium text-blue-800 mb-2">
                                        Marcas seleccionadas: {selectedMarks.length}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMarks.map(sm => {
                                            const mark = globalMarks.find(m => m.id === sm.marcaId);
                                            const submarca = sm.submarcaId
                                                ? mark?.submarcas.find(sub => sub.id === sm.submarcaId)
                                                : null;

                                            return (
                                                <span
                                                    key={`${sm.marcaId}-${sm.submarcaId || 'main'}`}
                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                                                    style={{ backgroundColor: mark?.color }}
                                                >
                                                    {mark?.nombre}
                                                    {submarca && ` - ${submarca.nombre}`}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="flex-1 btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 btn-primary"
                    >
                        Guardar Marcas
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ControlMarksModal;

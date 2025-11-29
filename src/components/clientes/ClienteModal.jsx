import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ClienteModal = ({ isOpen, onClose, onSave, client, mode = 'create' }) => {
    const [formData, setFormData] = useState({
        nit: '',
        correo: '',
        contraseña: '',
        razonSocial: '',
        tipoContribuyente: '',
        tipoEntidad: '',
        contacto: '',
        administracion: '',
        facturacion: '',
        regimen: '',
        actividad: '',
        direccion: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (client && (mode === 'edit' || mode === 'view')) {
            setFormData({
                nit: client.nit || '',
                correo: client.correo || '',
                contraseña: client.contraseña || '',
                razonSocial: client.razonSocial || '',
                tipoContribuyente: client.tipoContribuyente || '',
                tipoEntidad: client.tipoEntidad || '',
                contacto: client.contacto || '',
                administracion: client.administracion || '',
                facturacion: client.facturacion || '',
                regimen: client.regimen || '',
                actividad: client.actividad || '',
                direccion: client.direccion || '',
            });
        } else if (mode === 'create') {
            setFormData({
                nit: '',
                correo: '',
                contraseña: '',
                razonSocial: '',
                tipoContribuyente: '',
                tipoEntidad: '',
                contacto: '',
                administracion: '',
                facturacion: '',
                regimen: '',
                actividad: '',
                direccion: '',
            });
        }
        setErrors({});
    }, [client, mode, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.nit.trim()) newErrors.nit = 'NIT es requerido';
        if (!formData.correo.trim()) newErrors.correo = 'Correo es requerido';
        if (!formData.razonSocial.trim()) newErrors.razonSocial = 'Razón Social es requerida';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'view') {
            onClose();
            return;
        }

        if (validate()) {
            onSave(formData);
            onClose();
        }
    };

    if (!isOpen) return null;

    const isViewMode = mode === 'view';
    const title = mode === 'create' ? 'Agregar Cliente' : mode === 'edit' ? 'Editar Cliente' : 'Ver Cliente';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 animate-slide-up">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-slate-500" />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* NIT/CUR/CI */}
                            <div>
                                <label htmlFor="nit" className="label">
                                    NIT/CUR/CI <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="nit"
                                    name="nit"
                                    type="text"
                                    value={formData.nit}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`input-field ${errors.nit ? 'border-red-500' : ''} ${isViewMode ? 'bg-slate-50' : ''}`}
                                    placeholder="Ej: 1234567890"
                                />
                                {errors.nit && <p className="text-red-500 text-sm mt-1">{errors.nit}</p>}
                            </div>

                            {/* Correo */}
                            <div>
                                <label htmlFor="correo" className="label">
                                    Correo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="correo"
                                    name="correo"
                                    type="email"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`input-field ${errors.correo ? 'border-red-500' : ''} ${isViewMode ? 'bg-slate-50' : ''}`}
                                    placeholder="ejemplo@correo.com"
                                />
                                {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo}</p>}
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label htmlFor="contraseña" className="label">
                                    Contraseña
                                </label>
                                <input
                                    id="contraseña"
                                    name="contraseña"
                                    type={isViewMode ? "text" : "password"}
                                    value={formData.contraseña}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`input-field ${isViewMode ? 'bg-slate-50' : ''}`}
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Razón Social */}
                            <div>
                                <label htmlFor="razonSocial" className="label">
                                    Razón Social <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="razonSocial"
                                    name="razonSocial"
                                    type="text"
                                    value={formData.razonSocial}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`input-field ${errors.razonSocial ? 'border-red-500' : ''} ${isViewMode ? 'bg-slate-50' : ''}`}
                                    placeholder="Nombre de la empresa"
                                />
                                {errors.razonSocial && <p className="text-red-500 text-sm mt-1">{errors.razonSocial}</p>}
                            </div>

                            {/* Tipo de Contribuyente */}
                            <div>
                                <label htmlFor="tipoContribuyente" className="label">
                                    Tipo de Contribuyente
                                </label>
                                <input
                                    id="tipoContribuyente"
                                    name="tipoContribuyente"
                                    type="text"
                                    value={formData.tipoContribuyente}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`input-field ${isViewMode ? 'bg-slate-50' : ''}`}
                                    placeholder="Ej: Persona Natural"
                                />
                            </div>

                            {/* Tipo de Entidad */}
                            <div>
                                <label htmlFor="tipoEntidad" className="label">
                                    Tipo de Entidad
                                </label>
                                <input
                                    id="tipoEntidad"
                                    name="tipoEntidad"
                                    type="text"
                                    value={formData.tipoEntidad}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`input-field ${isViewMode ? 'bg-slate-50' : ''}`}
                                    placeholder="Ej: SRL, SA"
                                />
                            </div>

                            {/* Contacto */}
                            <div>
                                <label htmlFor="contacto" className="label">
                                    Contacto
                                </label>
                                <input
                                    id="contacto"
                                    name="contacto"
                                    type="text"
                                    value={formData.contacto}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`input-field ${isViewMode ? 'bg-slate-50' : ''}`}
                                    placeholder="Teléfono o nombre de contacto"
                                />
                            </div>

                            {/* Administración */}
                            <div>
                                <label htmlFor="administracion" className="label">
                                    Administración
                                </label>
                                <input
                                    id="administracion"
                                    name="administracion"
                                    type="text"
                                    value={formData.administracion}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`input-field ${isViewMode ? 'bg-slate-50' : ''}`}
                                    placeholder="Información administrativa"
                                />
                            </div>

                            {/* Facturación */}
                            <div>
                                <label htmlFor="facturacion" className="label">
                                    Facturación
                                </label>
                                <input
                                    id="facturacion"
                                    name="facturacion"
                                    type="text"
                                    value={formData.facturacion}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`input-field ${isViewMode ? 'bg-slate-50' : ''}`}
                                    placeholder="Información de facturación"
                                />
                            </div>

                            {/* Régimen */}
                            <div>
                                <label htmlFor="regimen" className="label">
                                    Régimen
                                </label>
                                <input
                                    id="regimen"
                                    name="regimen"
                                    type="text"
                                    value={formData.regimen}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`input-field ${isViewMode ? 'bg-slate-50' : ''}`}
                                    placeholder="Régimen tributario"
                                />
                            </div>

                            {/* Actividad */}
                            <div>
                                <label htmlFor="actividad" className="label">
                                    Actividad
                                </label>
                                <input
                                    id="actividad"
                                    name="actividad"
                                    type="text"
                                    value={formData.actividad}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    className={`input-field ${isViewMode ? 'bg-slate-50' : ''}`}
                                    placeholder="Actividad económica"
                                />
                            </div>

                            {/* Dirección */}
                            <div className="md:col-span-2">
                                <label htmlFor="direccion" className="label">
                                    Dirección
                                </label>
                                <textarea
                                    id="direccion"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    rows="3"
                                    className={`input-field ${isViewMode ? 'bg-slate-50' : ''}`}
                                    placeholder="Dirección completa"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-6 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn-secondary"
                        >
                            {isViewMode ? 'Cerrar' : 'Cancelar'}
                        </button>
                        {!isViewMode && (
                            <button
                                type="submit"
                                className="flex-1 btn-primary"
                            >
                                {mode === 'create' ? 'Agregar' : 'Guardar Cambios'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClienteModal;

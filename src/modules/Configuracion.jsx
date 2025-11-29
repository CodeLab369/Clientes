import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Configuracion = () => {
    const { credentials, updateCredentials } = useAuth();
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleUpdateUsername = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!newUsername.trim()) {
            setMessage({ type: 'error', text: 'El nombre de usuario no puede estar vacío' });
            return;
        }

        updateCredentials(newUsername, null);
        setMessage({ type: 'success', text: 'Usuario actualizado correctamente' });
        setNewUsername('');

        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!newPassword || !confirmPassword) {
            setMessage({ type: 'error', text: 'Por favor, complete todos los campos' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
            return;
        }

        if (newPassword.length < 4) {
            setMessage({ type: 'error', text: 'La contraseña debe tener al menos 4 caracteres' });
            return;
        }

        updateCredentials(null, newPassword);
        setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
        setNewPassword('');
        setConfirmPassword('');

        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    return (
        <div className="animate-slide-up max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Configuración</h1>
                <p className="text-slate-600">Administra las credenciales de acceso al sistema</p>
            </div>

            {/* Message Alert */}
            {message.text && (
                <div
                    className={`mb-6 px-4 py-3 rounded-lg animate-fade-in ${message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                >
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            {message.type === 'success' ? (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            ) : (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            )}
                        </svg>
                        {message.text}
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Current Credentials Card */}
                <div className="card bg-gradient-to-br from-primary-50 to-white border-primary-200">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Credenciales Actuales
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Usuario:</p>
                            <p className="text-lg font-semibold text-slate-800 bg-white px-4 py-2 rounded-lg">
                                {credentials.username}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Contraseña:</p>
                            <p className="text-lg font-semibold text-slate-800 bg-white px-4 py-2 rounded-lg">
                                {'•'.repeat(credentials.password.length)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Change Username Card */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Cambiar Usuario
                    </h2>
                    <form onSubmit={handleUpdateUsername} className="space-y-4">
                        <div>
                            <label htmlFor="newUsername" className="label">
                                Nuevo Usuario
                            </label>
                            <input
                                id="newUsername"
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="input-field"
                                placeholder="Ingrese el nuevo usuario"
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full">
                            Actualizar Usuario
                        </button>
                    </form>
                </div>

                {/* Change Password Card */}
                <div className="card md:col-span-2">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Cambiar Contraseña
                    </h2>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="newPassword" className="label">
                                    Nueva Contraseña
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="input-field"
                                    placeholder="Ingrese la nueva contraseña"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="label">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field"
                                    placeholder="Confirme la nueva contraseña"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary">
                            Actualizar Contraseña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Configuracion;

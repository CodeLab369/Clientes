import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Por favor, complete todos los campos');
            return;
        }

        const success = login(username, password);
        if (!success) {
            setError('Usuario o contraseña incorrectos');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-slate-50 to-primary-100">
            <div className="w-full max-w-md animate-slide-up">
                <div className="card shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Bienvenido</h1>
                        <p className="text-slate-600">Gestión de Clientes</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="label">
                                Usuario
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                placeholder="Ingrese su usuario"
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="label">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="Ingrese su contraseña"
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in">
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn-primary w-full">
                            Iniciar Sesión
                        </button>
                    </form>

                    {/* Footer hint */}
                    <div className="mt-6 text-center text-xs text-slate-500">
                        <p>Credenciales por defecto: Nestor / 1005</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

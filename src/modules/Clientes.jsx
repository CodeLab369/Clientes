import React from 'react';
import ClienteTable from '../components/clientes/ClienteTable';

const Clientes = () => {
    return (
        <div className="animate-slide-up">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Clientes</h1>
                <p className="text-slate-600">Gestión de clientes del sistema</p>
            </div>

            <ClienteTable />
        </div>
    );
};

export default Clientes;

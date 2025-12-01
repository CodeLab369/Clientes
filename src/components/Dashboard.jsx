import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Clientes from '../modules/Clientes';
import Unir from '../modules/Unir';
import Comprimir from '../modules/Comprimir';
import Configuracion from '../modules/Configuracion';

const Dashboard = () => {
    const [currentModule, setCurrentModule] = useState('clientes');

    const renderModule = () => {
        switch (currentModule) {
            case 'clientes':
                return <Clientes />;
            case 'unir':
                return <Unir />;
            case 'comprimir':
                return <Comprimir />;
            case 'configuracion':
                return <Configuracion />;
            default:
                return <Clientes />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar currentModule={currentModule} onModuleChange={setCurrentModule} />

            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="p-6 lg:p-8 animate-fade-in">
                    {renderModule()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

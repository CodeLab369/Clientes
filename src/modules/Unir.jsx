import React from 'react';
import MergedPDFTable from '../components/unir/MergedPDFTable';

const Unir = () => {
    return (
        <div className="animate-slide-up">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Unir PDFs</h1>
                <p className="text-slate-600">Fusiona PDFs de diferentes clientes en un solo documento</p>
            </div>

            <MergedPDFTable />
        </div>
    );
};

export default Unir;

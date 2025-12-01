import React, { useState, useMemo } from 'react';
import { Plus, Eye, Download, Trash2, FileText } from 'lucide-react';
import { useMergedPDFs } from '../../context/MergedPDFContext';
import { useNotification } from '../../context/NotificationContext';
import { formatFileSize } from '../../utils/fileUtils';
import MergePDFModal from './MergePDFModal';
import MergedPDFViewerModal from './MergedPDFViewerModal';

const MergedPDFTable = () => {
    const { mergedPDFs, addMergedPDF, deleteMergedPDF } = useMergedPDFs();
    const { showSuccess, showConfirm } = useNotification();

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [mergeModal, setMergeModal] = useState(false);
    const [viewerModal, setViewerModal] = useState({ isOpen: false, pdf: null });

    // Pagination
    const totalPages = Math.ceil(mergedPDFs.length / rowsPerPage);
    const paginatedPDFs = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return mergedPDFs.slice(start, start + rowsPerPage);
    }, [mergedPDFs, currentPage, rowsPerPage]);

    // Reset to page 1 when rowsPerPage changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [rowsPerPage]);

    const handleMerge = (mergedPDF) => {
        addMergedPDF(mergedPDF);
        showSuccess('PDF fusionado creado exitosamente');
    };

    const handleView = (pdf) => {
        setViewerModal({ isOpen: true, pdf });
    };

    const handleDownload = (pdf) => {
        const link = document.createElement('a');
        link.href = pdf.contenido;
        link.download = pdf.nombre;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccess('Descarga iniciada');
    };

    const handleDelete = async (pdf) => {
        const confirmed = await showConfirm(
            'Eliminar PDF fusionado',
            `¿Estás seguro de que deseas eliminar "${pdf.nombre}"? Esta acción no se puede deshacer.`
        );

        if (confirmed) {
            deleteMergedPDF(pdf.id);
            showSuccess('PDF fusionado eliminado');
        }
    };

    return (
        <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex justify-end">
                <button
                    onClick={() => setMergeModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Fusionar PDFs
                </button>
            </div>

            {/* Table */}
            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Tamaño
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Fecha de Creación
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Clientes Incluidos
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Archivos
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {mergedPDFs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-12 text-center">
                                        <FileText className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                                        <p className="text-slate-500 mb-2">No hay PDFs fusionados</p>
                                        <p className="text-sm text-slate-400">
                                            Haz clic en "Fusionar PDFs" para crear tu primer documento fusionado
                                        </p>
                                    </td>
                                </tr>
                            ) : paginatedPDFs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                                        No hay resultados en esta página
                                    </td>
                                </tr>
                            ) : (
                                paginatedPDFs.map((pdf) => (
                                    <tr key={pdf.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                                                <span className="text-sm font-medium text-slate-900 truncate">
                                                    {pdf.nombre}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {formatFileSize(pdf.tamaño)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {new Date(pdf.fechaCreacion).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {pdf.clientesIncluidos && pdf.clientesIncluidos.length > 0 ? (
                                                    pdf.clientesIncluidos.slice(0, 2).map((cliente, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
                                                        >
                                                            {cliente}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-slate-400">-</span>
                                                )}
                                                {pdf.clientesIncluidos && pdf.clientesIncluidos.length > 2 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                        +{pdf.clientesIncluidos.length - 2} más
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {pdf.cantidadArchivos || 0} archivo{pdf.cantidadArchivos !== 1 ? 's' : ''}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleView(pdf)}
                                                    className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors group"
                                                    title="Ver PDF"
                                                >
                                                    <Eye className="w-4 h-4 text-slate-600 group-hover:text-purple-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(pdf)}
                                    </tr>
                                            ))
                            )}
                                        </tbody>
                                    </table>
                </div>

                        {/* Pagination */}
                        {mergedPDFs.length > 0 && (
                            <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-600">Filas por página:</span>
                                    <select
                                        value={rowsPerPage}
                                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                        className="input-field py-1 px-2 text-sm"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-600">
                                        Mostrando {((currentPage - 1) * rowsPerPage) + 1} - {Math.min(currentPage * rowsPerPage, mergedPDFs.length)} de {mergedPDFs.length}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                </div>

                {/* Modals */}
                <MergePDFModal
                    isOpen={mergeModal}
                    onClose={() => setMergeModal(false)}
                    onMerge={handleMerge}
                />

                <MergedPDFViewerModal
                    isOpen={viewerModal.isOpen}
                    onClose={() => setViewerModal({ isOpen: false, pdf: null })}
                    pdf={viewerModal.pdf}
                />
            </div>
            );
};

            export default MergedPDFTable;

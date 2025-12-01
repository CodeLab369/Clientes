import React, { useState, useMemo } from 'react';
import { Plus, Eye, Download, Trash2, FileText } from 'lucide-react';
import { useMergedPDFs } from '../../context/MergedPDFContext';
                    </table >
                </div >

    {/* Pagination */ }
{
    mergedPDFs.length > 0 && (
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
    )
}
            </div >

    {/* Modals */ }
    < MergePDFModal
isOpen = { mergeModal }
onClose = {() => setMergeModal(false)}
onMerge = { handleMerge }
    />

    <MergedPDFViewerModal
        isOpen={viewerModal.isOpen}
        onClose={() => setViewerModal({ isOpen: false, pdf: null })}
        pdf={viewerModal.pdf}
    />
        </div >
    );
};

export default MergedPDFTable;

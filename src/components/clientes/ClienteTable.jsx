import React, { useState, useMemo } from 'react';
import { Plus, Search, Copy, Edit, Eye, Upload, Trash2, Check, FileText } from 'lucide-react';
import { useClients } from '../../context/ClientContext';
import { useNotification } from '../../context/NotificationContext';
import ClienteModal from './ClienteModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import FileUploadModal from './FileUploadModal';
import AnnotationsModal from './AnnotationsModal';

const ClienteTable = () => {
    const {
        clients,
        addClient,
        updateClient,
        deleteClient,
        addFileToClient,
        searchClients,
        filterByNitLastDigit,
        addAnnotationToClient,
        deleteAnnotationFromClient,
        getClientAnnotations
    } = useClients();
    const { showError } = useNotification();

    const [searchTerm, setSearchTerm] = useState('');
    const [nitFilter, setNitFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [modalState, setModalState] = useState({ isOpen: false, mode: 'create', client: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, client: null });
    const [uploadModal, setUploadModal] = useState({ isOpen: false, client: null });
    const [annotationsModal, setAnnotationsModal] = useState({ isOpen: false, client: null });

    const [copiedField, setCopiedField] = useState(null);

    // Filter and search clients
    const filteredClients = useMemo(() => {
        let result = clients;

        // Apply NIT filter
        if (nitFilter !== '') {
            result = filterByNitLastDigit(nitFilter);
        }

        // Apply search
        if (searchTerm) {
            result = result.filter(client =>
                client.nit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.razonSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.contacto?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return result;
    }, [clients, searchTerm, nitFilter, filterByNitLastDigit]);

    // Pagination
    const totalPages = Math.ceil(filteredClients.length / rowsPerPage);
    const paginatedClients = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredClients.slice(start, start + rowsPerPage);
    }, [filteredClients, currentPage, rowsPerPage]);

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, nitFilter, rowsPerPage]);

    const handleAddClient = () => {
        setModalState({ isOpen: true, mode: 'create', client: null });
    };

    const handleEditClient = (client) => {
        setModalState({ isOpen: true, mode: 'edit', client });
    };

    const handleViewClient = (client) => {
        setModalState({ isOpen: true, mode: 'view', client });
    };

    const handleSaveClient = (formData) => {
        if (modalState.mode === 'create') {
            addClient(formData);
        } else if (modalState.mode === 'edit') {
            updateClient(modalState.client.id, formData);
        }
    };

    const handleDeleteClick = (client) => {
        setDeleteModal({ isOpen: true, client });
    };

    const handleConfirmDelete = () => {
        if (deleteModal.client) {
            deleteClient(deleteModal.client.id);
            setDeleteModal({ isOpen: false, client: null });
        }
    };

    const handleUploadClick = (client) => {
        setUploadModal({ isOpen: true, client });
    };

    const handleFileUpload = async (files) => {
        if (uploadModal.client) {
            files.forEach(file => {
                addFileToClient(uploadModal.client.id, file);
            });
        }
    };

    const handleAnnotationsClick = (client) => {
        setAnnotationsModal({ isOpen: true, client });
    };

    const handleAddAnnotation = async (annotationData) => {
        if (annotationsModal.client) {
            await addAnnotationToClient(annotationsModal.client.id, annotationData);
        }
    };

    const handleDeleteAnnotation = async (annotationId) => {
        if (annotationsModal.client) {
            await deleteAnnotationFromClient(annotationsModal.client.id, annotationId);
        }
    };


    const copyToClipboard = (text) => {
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }

        // Fallback for mobile devices and older browsers
        return new Promise((resolve, reject) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.width = '2em';
            textarea.style.height = '2em';
            textarea.style.padding = '0';
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.boxShadow = 'none';
            textarea.style.background = 'transparent';
            textarea.setAttribute('readonly', '');

            document.body.appendChild(textarea);

            // Select text for mobile
            if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
                const range = document.createRange();
                range.selectNodeContents(textarea);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                textarea.setSelectionRange(0, 999999);
            } else {
                textarea.select();
            }

            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                if (successful) {
                    resolve();
                } else {
                    reject(new Error('Copy command failed'));
                }
            } catch (err) {
                document.body.removeChild(textarea);
                reject(err);
            }
        });
    };

    const handleCopyNit = async (client) => {
        try {
            await copyToClipboard(client.nit);
            setCopiedField(`${client.id}-nit`);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            showError('No se pudo copiar. Por favor, intenta de nuevo.');
        }
    };

    const handleCopyEmail = async (client) => {
        try {
            await copyToClipboard(client.correo);
            setCopiedField(`${client.id}-email`);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            showError('No se pudo copiar. Por favor, intenta de nuevo.');
        }
    };

    const handleCopyPassword = async (client) => {
        try {
            await copyToClipboard(client.contraseña);
            setCopiedField(`${client.id}-password`);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            showError('No se pudo copiar. Por favor, intenta de nuevo.');
        }
    };

    return (
        <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por NIT, correo, razón social..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10 w-full"
                        />
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <select
                        value={nitFilter}
                        onChange={(e) => setNitFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Todos los NIT</option>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                            <option key={digit} value={digit}>NIT terminado en {digit}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleAddClient}
                        className="btn-primary whitespace-nowrap flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Agregar Cliente
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">NIT</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Razón Social</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Correo</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Contacto</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Archivos</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {paginatedClients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                                        No se encontraron clientes
                                    </td>
                                </tr>
                            ) : (
                                paginatedClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-slate-900 font-medium">{client.nit}</td>
                                        <td className="px-4 py-3 text-sm text-slate-900">{client.razonSocial}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{client.correo}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{client.contacto || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                                                {client.archivos?.length || 0} archivo(s)
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleCopyNit(client)}
                                                    className="p-1.5 hover:bg-green-100 rounded-lg transition-colors group relative"
                                                    title="Copiar NIT"
                                                >
                                                    {copiedField === `${client.id}-nit` ? (
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-slate-600 group-hover:text-green-600" />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => handleCopyEmail(client)}
                                                    className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors group relative"
                                                    title="Copiar Correo"
                                                >
                                                    {copiedField === `${client.id}-email` ? (
                                                        <Check className="w-4 h-4 text-blue-600" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => handleCopyPassword(client)}
                                                    className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors group relative"
                                                    title="Copiar Contraseña"
                                                >
                                                    {copiedField === `${client.id}-password` ? (
                                                        <Check className="w-4 h-4 text-purple-600" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-slate-600 group-hover:text-purple-600" />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => handleEditClient(client)}
                                                    className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors group"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
                                                </button>

                                                <button
                                                    onClick={() => handleViewClient(client)}
                                                    className="p-1.5 hover:bg-purple-100 rounded-lg transition-colors group"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4 text-slate-600 group-hover:text-purple-600" />
                                                </button>

                                                <button
                                                    onClick={() => handleUploadClick(client)}
                                                    className="p-1.5 hover:bg-yellow-100 rounded-lg transition-colors group"
                                                    title="Subir archivos"
                                                >
                                                    <Upload className="w-4 h-4 text-slate-600 group-hover:text-yellow-600" />
                                                </button>

                                                <button
                                                    onClick={() => handleAnnotationsClick(client)}
                                                    className="p-1.5 hover:bg-indigo-100 rounded-lg transition-colors group"
                                                    title="Anotaciones"
                                                >
                                                    <FileText className="w-4 h-4 text-slate-600 group-hover:text-indigo-600" />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteClick(client)}
                                                    className="p-1.5 hover:bg-red-100 rounded-lg transition-colors group"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4 text-slate-600 group-hover:text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredClients.length > 0 && (
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
                                Mostrando {((currentPage - 1) * rowsPerPage) + 1} - {Math.min(currentPage * rowsPerPage, filteredClients.length)} de {filteredClients.length}
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
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ClienteModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, mode: 'create', client: null })}
                onSave={handleSaveClient}
                client={modalState.client}
                mode={modalState.mode}
            />

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, client: null })}
                onConfirm={handleConfirmDelete}
                clientName={deleteModal.client?.razonSocial}
            />

            <FileUploadModal
                isOpen={uploadModal.isOpen}
                onClose={() => setUploadModal({ isOpen: false, client: null })}
                onUpload={handleFileUpload}
                clientName={uploadModal.client?.razonSocial}
                clientId={uploadModal.client?.id}
            />

            <AnnotationsModal
                isOpen={annotationsModal.isOpen}
                onClose={() => setAnnotationsModal({ isOpen: false, client: null })}
                clientId={annotationsModal.client?.id}
                clientName={annotationsModal.client?.razonSocial}
                annotations={annotationsModal.client ? getClientAnnotations(annotationsModal.client.id) : []}
                onAddAnnotation={handleAddAnnotation}
                onDeleteAnnotation={handleDeleteAnnotation}
            />
        </div>
    );
};

export default ClienteTable;

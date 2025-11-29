import React, { useState, useEffect } from 'react';
import { X, Upload, File, Trash2 } from 'lucide-react';
import { fileToBase64, formatFileSize, generateFileId } from '../../utils/fileUtils';
import { useClients } from '../../context/ClientContext';

const FileUploadModal = ({ isOpen, onClose, onUpload, clientName, clientId }) => {
    const { getClientFiles, deleteFileFromClient } = useClients();

    const [files, setFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [año, setAño] = useState(new Date().getFullYear().toString());
    const [periodo, setPeriodo] = useState('');
    const [uploading, setUploading] = useState(false);

    // Fetch existing files when year/period changes
    useEffect(() => {
        if (clientId && año && periodo) {
            const files = getClientFiles(clientId, { año, periodo });
            setExistingFiles(files);
        } else {
            setExistingFiles([]);
        }
    }, [clientId, año, periodo, getClientFiles]);


    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);

        const processedFiles = await Promise.all(
            selectedFiles.map(async (file) => {
                const base64 = await fileToBase64(file);
                return {
                    id: generateFileId(),
                    nombre: file.name,
                    tamaño: file.size,
                    tipo: file.type,
                    contenido: base64,
                    fecha: new Date().toISOString(),
                };
            })
        );

        setFiles([...files, ...processedFiles]);

        // Reset the file input so the same files can be selected again if needed
        e.target.value = '';
    };

    const removeFile = (id) => {
        setFiles(files.filter(f => f.id !== id));
    };

    const handleDeleteExistingFile = async (fileId) => {
        if (window.confirm('¿Está seguro de eliminar este archivo?')) {
            await deleteFileFromClient(clientId, fileId);
            // Refresh existing files
            const updatedFiles = getClientFiles(clientId, { año, periodo });
            setExistingFiles(updatedFiles);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            alert('Por favor seleccione al menos un archivo');
            return;
        }

        if (!año || !periodo) {
            alert('Por favor complete año y periodo');
            return;
        }

        setUploading(true);

        // Add año and periodo to each file
        const filesWithMetadata = files.map(file => ({
            ...file,
            año,
            periodo,
        }));

        await onUpload(filesWithMetadata);

        setUploading(false);
        setFiles([]);
        setAño(new Date().getFullYear().toString());
        setPeriodo('');
        onClose();
    };

    const handleClose = () => {
        setFiles([]);
        setAño(new Date().getFullYear().toString());
        setPeriodo('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full animate-slide-up">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Subir Archivos</h2>
                            {clientName && (
                                <p className="text-sm text-slate-600 mt-1">Cliente: {clientName}</p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-slate-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {/* Year and Period */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="año" className="label">
                                    Año <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="año"
                                    type="number"
                                    value={año}
                                    onChange={(e) => setAño(e.target.value)}
                                    className="input-field"
                                    placeholder="2024"
                                    min="2000"
                                    max="2100"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="periodo" className="label">
                                    Periodo <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="periodo"
                                    value={periodo}
                                    onChange={(e) => setPeriodo(e.target.value)}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Enero">Enero</option>
                                    <option value="Febrero">Febrero</option>
                                    <option value="Marzo">Marzo</option>
                                    <option value="Abril">Abril</option>
                                    <option value="Mayo">Mayo</option>
                                    <option value="Junio">Junio</option>
                                    <option value="Julio">Julio</option>
                                    <option value="Agosto">Agosto</option>
                                    <option value="Septiembre">Septiembre</option>
                                    <option value="Octubre">Octubre</option>
                                    <option value="Noviembre">Noviembre</option>
                                    <option value="Diciembre">Diciembre</option>
                                </select>
                            </div>
                        </div>

                        {/* Existing Files */}
                        {existingFiles.length > 0 && (
                            <div className="space-y-2">
                                <p className="label">Archivos Existentes ({existingFiles.length})</p>
                                <div className="max-h-48 overflow-y-auto space-y-2">
                                    {existingFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <File className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-slate-800 truncate">
                                                        {file.nombre}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {formatFileSize(file.tamaño)} • {file.año} - {file.periodo}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteExistingFile(file.id)}
                                                className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* File Upload Area */}
                        <div>
                            <label className="label">Archivos</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                <p className="text-slate-600 mb-2">
                                    Arrastra archivos aquí o haz clic para seleccionar
                                </p>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-600 transition-colors"
                                >
                                    Seleccionar Archivos
                                </label>
                            </div>
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="space-y-2">
                                <p className="label">Nuevos Archivos a Subir ({files.length})</p>
                                <div className="max-h-48 overflow-y-auto space-y-2">
                                    {files.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <File className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-slate-800 truncate">
                                                        {file.nombre}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {formatFileSize(file.tamaño)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(file.id)}
                                                className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-6 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 btn-secondary"
                            disabled={uploading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-primary"
                            disabled={uploading || files.length === 0}
                        >
                            {uploading ? 'Subiendo...' : `Subir ${files.length} archivo(s)`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FileUploadModal;

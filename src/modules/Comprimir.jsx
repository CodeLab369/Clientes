import React, { useState, useMemo } from 'react';
import { Download, FileArchive, File, Calendar, User, Users } from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { useNotification } from '../context/NotificationContext';
import { compressFiles } from '../utils/compressionUtils';
import { formatFileSize, sortPeriods } from '../utils/fileUtils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { base64ToBlob } from '../utils/fileUtils';

const Comprimir = () => {
    const { clients, getClientFiles, getAllClientFiles } = useClients();
    const { showError, showSuccess } = useNotification();

    const [selectedClient, setSelectedClient] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [compressing, setCompressing] = useState(false);

    const isAllClients = selectedClient === 'ALL';

    // Get unique years from all files
    const availableYears = useMemo(() => {
        const years = new Set();
        clients.forEach(client => {
            client.archivos?.forEach(file => {
                if (file.año) years.add(file.año);
            });
        });
        return Array.from(years).sort((a, b) => b.localeCompare(a));
    }, [clients]);

    // Get unique periods from selected client and year
    const availablePeriods = useMemo(() => {
        if (!selectedClient) return [];

        const periods = new Set();

        if (isAllClients) {
            // Get periods from all clients
            clients.forEach(client => {
                client.archivos?.forEach(file => {
                    if (!selectedYear || file.año === selectedYear) {
                        if (file.periodo) periods.add(file.periodo);
                    }
                });
            });
        } else {
            // Get periods from specific client
            const client = clients.find(c => c.id === selectedClient);
            if (client) {
                client.archivos?.forEach(file => {
                    if (!selectedYear || file.año === selectedYear) {
                        if (file.periodo) periods.add(file.periodo);
                    }
                });
            }
        }

        return sortPeriods(Array.from(periods));
    }, [clients, selectedClient, selectedYear, isAllClients]);

    // Get filtered files
    const filteredData = useMemo(() => {
        if (!selectedClient) return { files: [], clientsData: [] };

        const filters = {};
        if (selectedYear) filters.año = selectedYear;
        if (selectedPeriod) filters.periodo = selectedPeriod;

        if (isAllClients) {
            // Get files from all clients
            const clientsData = getAllClientFiles(filters);
            const allFiles = clientsData.flatMap(cd => cd.files);
            return { files: allFiles, clientsData };
        } else {
            // Get files from specific client
            const files = getClientFiles(selectedClient, filters);
            return { files, clientsData: [] };
        }
    }, [selectedClient, selectedYear, selectedPeriod, getClientFiles, getAllClientFiles, isAllClients]);

    const selectedClientData = useMemo(() => {
        return clients.find(c => c.id === selectedClient);
    }, [clients, selectedClient]);

    const handleCompress = async () => {
        if (filteredData.files.length === 0) {
            showError('No hay archivos para comprimir');
            return;
        }

        setCompressing(true);

        try {
            if (isAllClients) {
                // Compress files from all clients with folder structure
                const zip = new JSZip();

                filteredData.clientsData.forEach(({ client, files }) => {
                    const folderName = client.razonSocial.replace(/[/\\?%*:|"<>]/g, '_');

                    files.forEach(file => {
                        const blob = base64ToBlob(file.contenido, file.tipo || 'application/octet-stream');
                        zip.file(`${folderName}/${file.nombre}`, blob);
                    });
                });

                const yearPart = selectedYear ? `_${selectedYear}` : '';
                const periodPart = selectedPeriod ? `_${selectedPeriod}` : '';
                const zipName = `Todos_los_clientes${yearPart}${periodPart}.zip`;

                const content = await zip.generateAsync({
                    type: 'blob',
                    compression: 'DEFLATE',
                    compressionOptions: {
                        level: 9
                    }
                });

                saveAs(content, zipName);
                showSuccess('Archivos comprimidos y descargados exitosamente');
            } else {
                // Compress files from single client (existing behavior)
                const clientName = selectedClientData?.razonSocial || 'cliente';
                const yearPart = selectedYear ? `_${selectedYear}` : '';
                const periodPart = selectedPeriod ? `_${selectedPeriod}` : '';
                const zipName = `${clientName}${yearPart}${periodPart}.zip`.replace(/\s+/g, '_');

                const result = await compressFiles(filteredData.files, zipName);

                if (result.success) {
                    showSuccess('Archivos comprimidos y descargados exitosamente');
                } else {
                    showError('Error al comprimir archivos: ' + result.message);
                }
            }
        } catch (error) {
            console.error('Error compressing files:', error);
            showError('Error al comprimir archivos');
        }

        setCompressing(false);
    };

    const totalSize = useMemo(() => {
        return filteredData.files.reduce((sum, file) => sum + (file.tamaño || 0), 0);
    }, [filteredData.files]);

    return (
        <div className="animate-slide-up">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Comprimir Archivos</h1>
                <p className="text-slate-600">Selecciona un cliente o todos los clientes y filtra por año y periodo para comprimir archivos</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Filters Panel */}
                <div className="lg:col-span-1">
                    <div className="card space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <FileArchive className="w-5 h-5 text-primary-600" />
                            Filtros
                        </h2>

                        {/* Client Selector */}
                        <div>
                            <label htmlFor="client" className="label flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Cliente <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="client"
                                value={selectedClient}
                                onChange={(e) => {
                                    setSelectedClient(e.target.value);
                                    setSelectedYear('');
                                    setSelectedPeriod('');
                                }}
                                className="input-field"
                            >
                                <option value="">Seleccionar cliente...</option>
                                <option value="ALL">📦 Todos los clientes</option>
                                <option disabled>──────────</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.razonSocial} ({client.nit})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Year Selector */}
                        <div>
                            <label htmlFor="year" className="label flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Año
                            </label>
                            <select
                                id="year"
                                value={selectedYear}
                                onChange={(e) => {
                                    setSelectedYear(e.target.value);
                                    setSelectedPeriod('');
                                }}
                                className="input-field"
                                disabled={!selectedClient}
                            >
                                <option value="">Todos los años</option>
                                {availableYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        {/* Period Selector */}
                        <div>
                            <label htmlFor="period" className="label">
                                Periodo
                            </label>
                            <select
                                id="period"
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="input-field"
                                disabled={!selectedClient}
                            >
                                <option value="">Todos los periodos</option>
                                {availablePeriods.map(period => (
                                    <option key={period} value={period}>{period}</option>
                                ))}
                            </select>
                        </div>

                        {/* Summary */}
                        {selectedClient && (
                            <div className="pt-4 border-t border-slate-200 space-y-2">
                                {isAllClients && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Clientes incluidos:</span>
                                        <span className="font-semibold text-slate-900">{filteredData.clientsData.length}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Archivos encontrados:</span>
                                    <span className="font-semibold text-slate-900">{filteredData.files.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Tamaño total:</span>
                                    <span className="font-semibold text-slate-900">{formatFileSize(totalSize)}</span>
                                </div>
                            </div>
                        )}

                        {/* Compress Button */}
                        <button
                            onClick={handleCompress}
                            disabled={!selectedClient || filteredData.files.length === 0 || compressing}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            {compressing ? 'Comprimiendo...' : 'Comprimir y Descargar'}
                        </button>
                    </div>
                </div>

                {/* Files List Panel */}
                <div className="lg:col-span-2">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <File className="w-5 h-5 text-primary-600" />
                            Archivos ({filteredData.files.length})
                        </h2>

                        {!selectedClient ? (
                            <div className="text-center py-12">
                                <FileArchive className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">Selecciona un cliente para ver sus archivos</p>
                            </div>
                        ) : filteredData.files.length === 0 ? (
                            <div className="text-center py-12">
                                <File className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">No hay archivos con los filtros seleccionados</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {isAllClients ? (
                                    // Group by client when showing all clients
                                    filteredData.clientsData.map(({ client, files }) => (
                                        <div key={client.id} className="mb-4">
                                            <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-primary-50 rounded-lg">
                                                <Users className="w-4 h-4 text-primary-600" />
                                                <span className="font-semibold text-primary-900">{client.razonSocial}</span>
                                                <span className="text-xs text-primary-600">({files.length} archivo{files.length !== 1 ? 's' : ''})</span>
                                            </div>
                                            <div className="space-y-2 ml-4">
                                                {files.map((file) => (
                                                    <div
                                                        key={file.id}
                                                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <File className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-sm font-medium text-slate-800 truncate">
                                                                    {file.nombre}
                                                                </p>
                                                                <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                                                    <span>{formatFileSize(file.tamaño)}</span>
                                                                    <span>•</span>
                                                                    <span>{file.año}</span>
                                                                    <span>•</span>
                                                                    <span>{file.periodo}</span>
                                                                    <span>•</span>
                                                                    <span>{new Date(file.fecha).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // Show flat list for single client
                                    filteredData.files.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <File className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-slate-800 truncate">
                                                        {file.nombre}
                                                    </p>
                                                    <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                                        <span>{formatFileSize(file.tamaño)}</span>
                                                        <span>•</span>
                                                        <span>{file.año}</span>
                                                        <span>•</span>
                                                        <span>{file.periodo}</span>
                                                        <span>•</span>
                                                        <span>{new Date(file.fecha).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Card */}
            {!selectedClient && (
                <div className="mt-6 card bg-gradient-to-br from-primary-50 to-white border-primary-200">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <FileArchive className="w-6 h-6 text-primary-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-2">¿Cómo funciona?</h3>
                            <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
                                <li>Selecciona un cliente específico o "Todos los clientes"</li>
                                <li>Opcionalmente filtra por año y/o periodo</li>
                                <li>Revisa los archivos que se incluirán en la compresión</li>
                                <li>Haz clic en "Comprimir y Descargar" para generar el archivo ZIP</li>
                            </ol>
                            <p className="text-xs text-slate-500 mt-3">
                                💡 Al seleccionar "Todos los clientes", los archivos se organizarán en carpetas por cliente dentro del ZIP.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Comprimir;

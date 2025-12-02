import React, { useState, useMemo } from 'react';
import { X, FileText, Plus, Minus } from 'lucide-react';
import { useClients } from '../../context/ClientContext';
import { useNotification } from '../../context/NotificationContext';
import { mergePDFs, generateMergedFileName, sortPeriods } from '../../utils/fileUtils';

const MergePDFModal = ({ isOpen, onClose, onMerge }) => {
    const { clients } = useClients();
    const { showSuccess, showError } = useNotification();

    const [selectedYear, setSelectedYear] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [mergedFileName, setMergedFileName] = useState('');
    const [isMerging, setIsMerging] = useState(false);

    // Get available years and periods from all client files
    const { years, periods } = useMemo(() => {
        const yearsSet = new Set();
        const periodsSet = new Set();

        clients.forEach(client => {
            if (client.archivos && client.archivos.length > 0) {
                client.archivos.forEach(file => {
                    if (file.año) yearsSet.add(file.año);
                    if (file.periodo) periodsSet.add(file.periodo);
                });
            }
        });

        return {
            years: Array.from(yearsSet).sort((a, b) => b - a),
            periods: sortPeriods(Array.from(periodsSet))
        };
    }, [clients]);

    // Get filtered client files based on year and period
    const filteredClientFiles = useMemo(() => {
        const result = [];

        clients.forEach(client => {
            if (!client.archivos || client.archivos.length === 0) return;

            let files = client.archivos.filter(file =>
                file.tipo === 'application/pdf' || file.nombre.toLowerCase().endsWith('.pdf')
            );

            if (selectedYear) {
                files = files.filter(file => file.año === selectedYear);
            }

            if (selectedPeriod) {
                files = files.filter(file => file.periodo === selectedPeriod);
            }

            if (files.length > 0) {
                result.push({
                    client,
                    files
                });
            }
        });

        return result;
    }, [clients, selectedYear, selectedPeriod]);

    const handleFileToggle = (clientId, file) => {
        const fileKey = `${clientId}-${file.id}`;
        const isSelected = selectedFiles.some(sf => sf.key === fileKey);

        if (isSelected) {
            setSelectedFiles(selectedFiles.filter(sf => sf.key !== fileKey));
        } else {
            setSelectedFiles([...selectedFiles, {
                key: fileKey,
                clientId,
                clientName: filteredClientFiles.find(cf => cf.client.id === clientId)?.client.razonSocial,
                file
            }]);
        }
    };

    const handleSelectAllFromClient = (clientId, files) => {
        const clientFiles = files.map(file => ({
            key: `${clientId}-${file.id}`,
            clientId,
            clientName: filteredClientFiles.find(cf => cf.client.id === clientId)?.client.razonSocial,
            file
        }));

        const allSelected = clientFiles.every(cf =>
            selectedFiles.some(sf => sf.key === cf.key)
        );

        if (allSelected) {
            // Deselect all from this client
            setSelectedFiles(selectedFiles.filter(sf => sf.clientId !== clientId));
        } else {
            // Select all from this client
            const otherFiles = selectedFiles.filter(sf => sf.clientId !== clientId);
            setSelectedFiles([...otherFiles, ...clientFiles]);
        }
    };

    const handleMerge = async () => {
        if (selectedFiles.length === 0) {
            showError('Selecciona al menos un archivo PDF');
            return;
        }

        if (!mergedFileName.trim()) {
            showError('Ingresa un nombre para el archivo fusionado');
            return;
        }

        setIsMerging(true);

        try {
            // Extract just the file objects
            const filesToMerge = selectedFiles.map(sf => sf.file);

            // Validate files
            if (!filesToMerge || filesToMerge.length === 0) {
                throw new Error('No hay archivos válidos para fusionar');
            }

            // Merge PDFs with error handling
            let mergedContent;
            try {
                mergedContent = await mergePDFs(filesToMerge);
            } catch (mergeError) {
                console.error('Error in mergePDFs:', mergeError);
                throw new Error('Error al procesar los archivos PDF. Verifica que sean PDFs válidos.');
            }

            if (!mergedContent) {
                throw new Error('El contenido fusionado está vacío');
            }

            // Calculate total size (approximate)
            const totalSize = selectedFiles.reduce((sum, sf) => sum + (sf.file.tamaño || 0), 0);

            // Get unique client names
            const clientNames = [...new Set(selectedFiles.map(sf => sf.clientName))];

            // Create merged PDF object
            const mergedPDF = {
                nombre: mergedFileName.endsWith('.pdf') ? mergedFileName : `${mergedFileName}.pdf`,
                contenido: mergedContent,
                tamaño: totalSize,
                clientesIncluidos: clientNames,
                cantidadArchivos: selectedFiles.length
            };

            // Call onMerge and handle any errors from it
            try {
                await onMerge(mergedPDF);
                showSuccess('PDFs fusionados exitosamente');
                handleClose();
            } catch (saveError) {
                console.error('Error saving merged PDF:', saveError);
                throw new Error('Error al guardar el PDF fusionado');
            }
        } catch (error) {
            console.error('Error merging PDFs:', error);
            const errorMessage = error.message || 'Error al fusionar los PDFs. Intenta de nuevo.';
            showError(errorMessage);
            setIsMerging(false);
        }
    };

    const handleClose = () => {
        setSelectedYear('');
        setSelectedPeriod('');
        setSelectedFiles([]);
        setMergedFileName('');
        setIsMerging(false);
        onClose();
    };

    // Auto-generate filename when files are selected
    React.useEffect(() => {
        if (selectedFiles.length > 0 && !mergedFileName) {
            const clientNames = [...new Set(selectedFiles.map(sf => sf.clientName))];
            const autoName = generateMergedFileName(clientNames);
            setMergedFileName(autoName);
        }
    }, [selectedFiles, mergedFileName]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800">Fusionar PDFs</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        disabled={isMerging}
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Año
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="input-field w-full"
                                disabled={isMerging}
                            >
                                <option value="">Todos los años</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Período
                            </label>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="input-field w-full"
                                disabled={isMerging}
                            >
                                <option value="">Todos los períodos</option>
                                {periods.map(period => (
                                    <option key={period} value={period}>{period}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* File Selection */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        Selecciona archivos PDF ({selectedFiles.length} seleccionados)
                    </h3>

                    {filteredClientFiles.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                            <p>No hay archivos PDF disponibles con los filtros seleccionados</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredClientFiles.map(({ client, files }) => {
                                const allSelected = files.every(file =>
                                    selectedFiles.some(sf => sf.key === `${client.id}-${file.id}`)
                                );

                                return (
                                    <div key={client.id} className="border border-slate-200 rounded-lg overflow-hidden">
                                        <div className="bg-slate-50 px-4 py-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-semibold text-slate-800">{client.razonSocial}</h4>
                                                <span className="text-sm text-slate-600">
                                                    ({files.length} PDF{files.length !== 1 ? 's' : ''})
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleSelectAllFromClient(client.id, files)}
                                                className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                                                disabled={isMerging}
                                            >
                                                {allSelected ? (
                                                    <>
                                                        <Minus className="w-4 h-4" />
                                                        Deseleccionar todos
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-4 h-4" />
                                                        Seleccionar todos
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className="divide-y divide-slate-200">
                                            {files.map(file => {
                                                const isSelected = selectedFiles.some(
                                                    sf => sf.key === `${client.id}-${file.id}`
                                                );

                                                return (
                                                    <label
                                                        key={file.id}
                                                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${isSelected ? 'bg-primary-50' : ''
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => handleFileToggle(client.id, file)}
                                                            className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                                                            disabled={isMerging}
                                                        />
                                                        <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-slate-800 truncate">
                                                                {file.nombre}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {file.año} - {file.periodo}
                                                            </p>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 bg-slate-50">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nombre del archivo fusionado
                        </label>
                        <input
                            type="text"
                            value={mergedFileName}
                            onChange={(e) => setMergedFileName(e.target.value)}
                            placeholder="Ingresa un nombre para el PDF fusionado"
                            className="input-field w-full"
                            disabled={isMerging}
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={handleClose}
                            className="btn-secondary"
                            disabled={isMerging}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleMerge}
                            className="btn-primary"
                            disabled={selectedFiles.length === 0 || !mergedFileName.trim() || isMerging}
                        >
                            {isMerging ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Fusionando...
                                </>
                            ) : (
                                `Fusionar ${selectedFiles.length} archivo${selectedFiles.length !== 1 ? 's' : ''}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MergePDFModal;

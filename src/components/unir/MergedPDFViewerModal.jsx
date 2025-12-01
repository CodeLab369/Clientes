import React, { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import { formatFileSize, downloadFile } from '../../utils/fileUtils';

const MergedPDFViewerModal = ({ isOpen, onClose, pdf }) => {
    const [zoom, setZoom] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const zoomLevels = [25, 50, 75, 100, 125, 150, 200];

    const handleZoomIn = () => {
        const currentIndex = zoomLevels.indexOf(zoom);
        if (currentIndex < zoomLevels.length - 1) {
            setZoom(zoomLevels[currentIndex + 1]);
        }
    };

    const handleZoomOut = () => {
        const currentIndex = zoomLevels.indexOf(zoom);
        if (currentIndex > 0) {
            setZoom(zoomLevels[currentIndex - 1]);
        }
    };

    const handleDownload = () => {
        downloadFile(pdf);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    if (!isOpen || !pdf) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
            <div
                className={`bg-white rounded-xl shadow-2xl flex flex-col animate-slide-up transition-all duration-300 ${isFullscreen ? 'w-full h-full' : 'max-w-6xl w-full h-[90vh]'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-slate-800 truncate">{pdf.nombre}</h2>
                        <p className="text-sm text-slate-600">
                            {formatFileSize(pdf.tamaño)} • {new Date(pdf.fechaCreacion).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 ml-4">
                        {/* Zoom Controls */}
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={handleZoomOut}
                                disabled={zoom === zoomLevels[0]}
                                className="p-2 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Reducir zoom"
                            >
                                <ZoomOut className="w-4 h-4 text-slate-700" />
                            </button>

                            <select
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="px-2 py-1 bg-white border border-slate-300 rounded text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {zoomLevels.map(level => (
                                    <option key={level} value={level}>{level}%</option>
                                ))}
                            </select>

                            <button
                                onClick={handleZoomIn}
                                disabled={zoom === zoomLevels[zoomLevels.length - 1]}
                                className="p-2 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Aumentar zoom"
                            >
                                <ZoomIn className="w-4 h-4 text-slate-700" />
                            </button>
                        </div>

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                        >
                            {isFullscreen ? (
                                <Minimize2 className="w-5 h-5 text-slate-700" />
                            ) : (
                                <Maximize2 className="w-5 h-5 text-slate-700" />
                            )}
                        </button>

                        {/* Download Button */}
                        <button
                            onClick={handleDownload}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                            title="Descargar archivo"
                        >
                            <Download className="w-5 h-5 text-green-600" />
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Cerrar"
                        >
                            <X className="w-5 h-5 text-red-600" />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 overflow-auto bg-slate-100 p-4">
                    <div
                        className="mx-auto bg-white shadow-lg"
                        style={{
                            width: `${zoom}%`,
                            minHeight: '100%'
                        }}
                    >
                        <iframe
                            src={pdf.contenido}
                            className="w-full h-full min-h-[800px]"
                            title={pdf.nombre}
                            style={{ border: 'none' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MergedPDFViewerModal;

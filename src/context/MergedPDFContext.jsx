import React, { createContext, useContext, useState, useEffect } from 'react';

const MergedPDFContext = createContext(null);

export const useMergedPDFs = () => {
    const context = useContext(MergedPDFContext);
    if (!context) {
        throw new Error('useMergedPDFs must be used within a MergedPDFProvider');
    }
    return context;
};

export const MergedPDFProvider = ({ children }) => {
    const [mergedPDFs, setMergedPDFs] = useState(() => {
        const stored = localStorage.getItem('mergedPDFs');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('mergedPDFs', JSON.stringify(mergedPDFs));
    }, [mergedPDFs]);

    const addMergedPDF = (pdfData) => {
        const newPDF = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            ...pdfData,
            fechaCreacion: new Date().toISOString(),
        };
        setMergedPDFs([...mergedPDFs, newPDF]);
        return newPDF;
        import React, { createContext, useContext, useState, useEffect } from 'react';

        const MergedPDFContext = createContext(null);

        export const useMergedPDFs = () => {
            const context = useContext(MergedPDFContext);
            if (!context) {
                throw new Error('useMergedPDFs must be used within a MergedPDFProvider');
            }
            return context;
        };

        export const MergedPDFProvider = ({ children }) => {
            const [mergedPDFs, setMergedPDFs] = useState(() => {
                const stored = localStorage.getItem('mergedPDFs');
                return stored ? JSON.parse(stored) : [];
            });

            useEffect(() => {
                localStorage.setItem('mergedPDFs', JSON.stringify(mergedPDFs));
            }, [mergedPDFs]);

            const addMergedPDF = (pdfData) => {
                const newPDF = {
                    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                    ...pdfData,
                    fechaCreacion: new Date().toISOString(),
                };
                setMergedPDFs([...mergedPDFs, newPDF]);
                return newPDF;
            };

            const deleteMergedPDF = (id) => {
                setMergedPDFs(mergedPDFs.filter(pdf => pdf.id !== id));
            };

            const clearAllMergedPDFs = () => {
                setMergedPDFs([]);
            };

            const getMergedPDFById = (id) => {
                return mergedPDFs.find(pdf => pdf.id === id);
            };

            const value = {
                mergedPDFs,
                addMergedPDF,
                deleteMergedPDF,
                clearAllMergedPDFs,
                getMergedPDFById,
            };

            return <MergedPDFContext.Provider value={value}>{children}</MergedPDFContext.Provider>;
        };

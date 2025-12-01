// File conversion utilities

export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const base64ToBlob = (base64, mimeType) => {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeType });
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const validateFileType = (file, allowedTypes = []) => {
    if (allowedTypes.length === 0) return true;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    return allowedTypes.includes(fileExtension);
};

export const generateFileId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.contenido;
    link.download = file.nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// PDF Merging utilities
export const base64ToArrayBuffer = (base64) => {
    const binaryString = atob(base64.split(',')[1]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

export const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return 'data:application/pdf;base64,' + btoa(binary);
};

export const mergePDFs = async (pdfFiles) => {
    const { PDFDocument } = await import('pdf-lib');

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();

    // Iterate through each PDF file
    for (const file of pdfFiles) {
        // Convert base64 to ArrayBuffer
        const pdfBytes = base64ToArrayBuffer(file.contenido);

        // Load the PDF
        const pdf = await PDFDocument.load(pdfBytes);

        // Copy all pages from the current PDF
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

        // Add each page to the merged PDF
        copiedPages.forEach((page) => {
            mergedPdf.addPage(page);
        });
    }

    // Serialize the merged PDF to bytes
    const mergedPdfBytes = await mergedPdf.save();

    // Convert to base64
    return arrayBufferToBase64(mergedPdfBytes);
};

export const generateMergedFileName = (clientNames) => {
    const timestamp = new Date().toISOString().split('T')[0];
    if (clientNames.length === 1) {
        return `${clientNames[0]}_${timestamp}.pdf`;
    } else if (clientNames.length === 2) {
        return `${clientNames[0]}_${clientNames[1]}_${timestamp}.pdf`;
    } else {
        return `Fusionado_${clientNames.length}_clientes_${timestamp}.pdf`;
    }
};

// Period sorting utility
export const sortPeriods = (periods) => {
    const monthOrder = {
        'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4,
        'Mayo': 5, 'Junio': 6, 'Julio': 7, 'Agosto': 8,
        'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12
    };

    return periods.sort((a, b) => {
        const orderA = monthOrder[a] || 999;
        const orderB = monthOrder[b] || 999;
        return orderA - orderB;
    });
};


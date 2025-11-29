import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { base64ToBlob } from './fileUtils';

export const compressFiles = async (files, zipName = 'archivos.zip', folderPath = '') => {
    try {
        const zip = new JSZip();

        // Add each file to the ZIP
        files.forEach((file) => {
            const blob = base64ToBlob(file.contenido, file.tipo || 'application/octet-stream');
            const filePath = folderPath ? `${folderPath}/${file.nombre}` : file.nombre;
            zip.file(filePath, blob);
        });

        // Generate the ZIP file
        const content = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9
            }
        });

        // Trigger download
        saveAs(content, zipName);

        return { success: true, message: 'Archivos comprimidos exitosamente' };
    } catch (error) {
        console.error('Error compressing files:', error);
        return { success: false, message: 'Error al comprimir archivos' };
    }
};

export const getCompressionProgress = (current, total) => {
    return Math.round((current / total) * 100);
};

import imageCompression from 'browser-image-compression';

/**
 * Compress an image file before upload
 * Target: Max 1200px width, 85% quality
 */
export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        initialQuality: 0.85
    };

    try {
        console.log('[COMPRESSION] Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
        const compressedFile = await imageCompression(file, options);
        console.log('[COMPRESSION] Compressed file size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
        return compressedFile;
    } catch (error) {
        console.error('[COMPRESSION] Failed to compress image:', error);
        // Fallback: return original file if compression fails
        return file;
    }
}

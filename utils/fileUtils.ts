/**
 * Converts a Blob object (like an image file) to a Base64 encoded string.
 * @param blob The Blob or File object to convert.
 * @returns A Promise that resolves with the Base64 string.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                // The result includes the data URL prefix (e.g., "data:image/jpeg;base64,"), 
                // which might need to be stripped depending on the use case.
                // For simplicity here, we return the full string.
                resolve(reader.result);
            } else {
                reject(new Error('FileReader result is not a string'));
            }
        };
        reader.readAsDataURL(blob);
    });
};

/**
 * Validates a file based on allowed types and maximum size.
 * @param file The file to validate.
 * @param allowedTypes An array of allowed MIME types (e.g., ['image/jpeg', 'image/png']).
 * @param maxSizeInMB The maximum allowed file size in megabytes.
 * @returns An object with `isValid` boolean and an `error` message string if invalid.
 */
export const validateFile = (file: File, allowedTypes: string[], maxSizeInMB: number): { isValid: boolean, error?: string } => {
    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: `Tipo de archivo no válido. Permitidos: ${allowedTypes.join(', ')}`,
        };
    }

    if (file.size > maxSizeInMB * 1024 * 1024) {
        return {
            isValid: false,
            error: `El archivo es demasiado grande. El tamaño máximo es ${maxSizeInMB}MB.`,
        };
    }

    return { isValid: true };
};

// services/hostingUploadService.ts

/**
 * Uploads an image file to the hosting server via the /api/upload endpoint.
 * @param file The image File object to upload.
 * @returns A promise that resolves with the public URL of the uploaded image.
 * @throws An error if the upload fails or the server returns an error.
 */
export const uploadImageToHosting = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        // En un entorno de desarrollo, podrías necesitar la URL completa: 'http://localhost:3001/api/upload'
        // Para producción, una ruta relativa suele ser suficiente.
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            // Intenta obtener un mensaje de error más detallado del cuerpo de la respuesta
            const errorData = await response.json().catch(() => ({ error: 'Error desconocido del servidor.' }));
            throw new Error(`Error en la subida: ${response.statusText} - ${errorData.error || 'No se pudo obtener más información.'}`);
        }

        const result = await response.json();

        if (!result.imageUrl) {
            throw new Error('La respuesta del servidor no incluyó una URL de imagen.');
        }

        return result.imageUrl;
    } catch (error) {
        console.error('Error detallado al subir la imagen:', error);
        // Re-lanza el error para que el componente que llama pueda manejarlo y mostrar un mensaje al usuario.
        throw error;
    }
};

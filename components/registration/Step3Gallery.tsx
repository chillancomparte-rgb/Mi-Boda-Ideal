import React from 'react';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { UploadCloudIcon } from '../icons/UploadCloudIcon';

interface Step3GalleryProps {
    nextStep: () => void;
    prevStep: () => void;
    handleGalleryChange: (index: number, value: string) => void;
    values: { gallery: string[] };
}

const Step3Gallery: React.FC<Step3GalleryProps> = ({ nextStep, prevStep, handleGalleryChange, values }) => {
    const continueStep = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation: at least one image URL should be provided.
        if (values.gallery.some(url => url.trim() !== '')) {
            nextStep();
        } else {
            alert('Por favor, añade al menos una URL de imagen a tu galería.');
        }
    };

    return (
        <form onSubmit={continueStep} className="animate-fade-in">
            <div className="text-center mb-8">
                <UploadCloudIcon className="w-16 h-16 mx-auto text-brand-primary mb-4" />
                <h2 className="text-2xl font-serif font-bold text-brand-dark">3. Muestra tu Trabajo</h2>
                <p className="text-brand-dark opacity-80 mt-2 max-w-xl mx-auto">
                    Añade URLs de imágenes que representen tu servicio. Una buena galería es clave para atraer clientes.
                    Por ahora, solo puedes añadir URLs. ¡Pronto habilitaremos la subida directa de archivos!
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                {values.gallery.map((url, index) => (
                    <div key={index}>
                        <label htmlFor={`gallery-${index}`} className="block text-sm font-medium text-brand-dark mb-1">
                            Imagen {index + 1}
                        </label>
                        <input
                            type="url"
                            id={`gallery-${index}`}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={url}
                            onChange={(e) => handleGalleryChange(index, e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-between">
                <button onClick={prevStep} type="button" className="flex items-center text-sm font-semibold text-brand-dark hover:text-brand-primary transition-colors">
                    <ArrowLeftIcon className="h-4 w-4 mr-2"/>
                    Volver
                </button>
                <button type="submit" className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent transition-colors">
                    Siguiente
                </button>
            </div>
        </form>
    );
};

export default Step3Gallery;

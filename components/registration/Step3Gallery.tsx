import React from 'react';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { UploadCloudIcon } from '../icons/UploadCloudIcon';

interface Step3GalleryProps {
    nextStep: () => void;
    prevStep: () => void;
    handleGalleryChange: (index: number, value: string) => void;
    values: any;
}

const Step3Gallery: React.FC<Step3GalleryProps> = ({ nextStep, prevStep, handleGalleryChange, values }) => {
    
    const continueStep = (e: React.FormEvent) => {
        e.preventDefault();
        const filledImages = values.gallery.filter((url: string) => url.trim() !== '').length;
        if (filledImages >= 10) {
            nextStep();
        } else {
            alert(`Necesitas agregar al menos 10 fotografías. Llevas ${filledImages}.`);
        }
    };

    return (
        <form onSubmit={continueStep} className="animate-fade-in">
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-2">3. Tu Galería de Fotos</h2>
            <p className="text-brand-dark opacity-80 mb-6">Muestra lo mejor de tu trabajo. Sube un mínimo de 10 fotografías. Por ahora, puedes pegar enlaces a imágenes.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                {values.gallery.map((url: string, index: number) => (
                    <div key={index} className="aspect-square relative group bg-gray-100 rounded-md overflow-hidden border-2 border-dashed border-gray-300">
                        {url ? (
                            <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <UploadCloudIcon className="w-8 h-8"/>
                                <span className="text-xs mt-1">Foto {index + 1}</span>
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder="Pega la URL de la imagen aquí"
                            value={url}
                            onChange={(e) => handleGalleryChange(index, e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 text-white text-xs p-2 focus:opacity-100"
                        />
                    </div>
                ))}
            </div>
            
            <div className="flex justify-between items-center">
                <button onClick={prevStep} type="button" className="flex items-center text-sm font-semibold text-brand-dark hover:text-brand-primary transition-colors">
                    <ArrowLeftIcon className="h-4 w-4 mr-2"/>
                    Volver
                </button>
                <button type="submit" className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent transition-colors">
                    Finalizar y Enviar a Revisión
                </button>
            </div>
        </form>
    );
};

export default Step3Gallery;

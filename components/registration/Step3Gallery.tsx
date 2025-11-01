import React, { useState, useRef } from 'react';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { UploadCloudIcon } from '../icons/UploadCloudIcon';
import { uploadImageToHosting } from '../../services/hostingUploadService';
import Spinner from '../Spinner';
import { TrashIcon } from '../icons/TrashIcon';


interface Step3GalleryProps {
    nextStep: () => void;
    prevStep: () => void;
    addGalleryImage: (url: string) => void;
    removeGalleryImage: (index: number) => void;
    values: { gallery: string[] };
}

const Step3Gallery: React.FC<Step3GalleryProps> = ({ nextStep, prevStep, addGalleryImage, removeGalleryImage, values }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const continueStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (values.gallery.length > 0) {
            nextStep();
        } else {
            alert('Por favor, añade al menos una imagen a tu galería.');
        }
    };
    
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const imageUrl = await uploadImageToHosting(file);
            addGalleryImage(imageUrl);
        } catch (error) {
            alert("Error al subir la imagen. Por favor, inténtalo de nuevo.");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={continueStep} className="animate-fade-in">
            <div className="text-center mb-8">
                <UploadCloudIcon className="w-16 h-16 mx-auto text-brand-primary mb-4" />
                <h2 className="text-2xl font-serif font-bold text-brand-dark">3. Muestra tu Trabajo</h2>
                <p className="text-brand-dark opacity-80 mt-2 max-w-xl mx-auto">
                    Sube las mejores imágenes que representen tu servicio. Una buena galería es clave para atraer clientes. (Máx. 10 imágenes)
                </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {values.gallery.map((url, index) => (
                    <div key={index} className="relative group w-full aspect-square">
                        <img src={url} alt={`Galería ${index + 1}`} className="w-full h-full object-cover rounded-md shadow-sm" />
                        <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Eliminar imagen"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                
                {values.gallery.length < 10 && (
                     <div className="w-full aspect-square">
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden"/>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="w-full h-full border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-brand-primary hover:text-brand-primary transition-colors disabled:opacity-50"
                        >
                            {isUploading ? <Spinner /> : (
                                <>
                                    <UploadCloudIcon className="w-10 h-10" />
                                    <span className="text-xs font-semibold mt-1">Añadir Imagen</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
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

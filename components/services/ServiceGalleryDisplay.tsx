import React from 'react';
import { User } from '../../types';

interface ServiceGalleryDisplayProps {
    gallery: string[];
    currentUser: User | null;
}

const ServiceGalleryDisplay: React.FC<ServiceGalleryDisplayProps> = ({ gallery, currentUser }) => {
    const isAuthenticated = !!currentUser;
    const imagesToShow = isAuthenticated ? gallery : gallery.slice(0, 5);

    if (!gallery || gallery.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <h4 className="text-xl font-bold text-brand-dark mb-4">Galería de Imágenes</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagesToShow.map((imageUrl, index) => (
                    <div key={index} className="aspect-w-1 aspect-h-1">
                        <img src={imageUrl} alt={`Galería ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                    </div>
                ))}
            </div>
            {!isAuthenticated && gallery.length > 5 && (
                <div className="mt-4 text-center text-gray-500">
                    Inicia sesión para ver la galería completa ({gallery.length} fotos).
                </div>
            )}
        </div>
    );
};

export default ServiceGalleryDisplay;
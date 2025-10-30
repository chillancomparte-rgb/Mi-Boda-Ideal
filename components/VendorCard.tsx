import React from 'react';
import type { Vendor } from '../types';
import { StarIcon } from './icons/StarIcon';
import { HeartIcon } from './icons/HeartIcon';
import { MapPinIcon } from './icons/MapPinIcon';

interface VendorCardProps {
    vendor: Vendor;
    onVendorSelect: (vendor: Vendor) => void;
    isFavorite: boolean;
    onToggleFavorite: (vendor: Vendor) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onVendorSelect, isFavorite, onToggleFavorite }) => {
    
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evita que se dispare el onVendorSelect
        onToggleFavorite(vendor);
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 w-full relative flex flex-col">
            <div className="relative">
                <button
                    onClick={handleFavoriteClick}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-colors duration-200 ${isFavorite ? 'bg-red-500 text-white' : 'bg-white bg-opacity-70 text-gray-700 hover:text-red-500'}`}
                    aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                >
                    <HeartIcon className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                {vendor.isPremium && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        PREMIUM
                    </div>
                )}
                <img className="w-full h-48 object-cover" src={vendor.imageUrl} alt={vendor.name} />
            </div>
            <button
                onClick={() => onVendorSelect(vendor)}
                className="text-left w-full flex flex-col flex-grow"
            >
                <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif font-bold text-brand-dark pr-2">{vendor.name}</h3>
                        <div className="flex items-center bg-yellow-400 text-white text-sm font-bold px-2 py-1 rounded shrink-0 ml-2">
                            <StarIcon className="w-4 h-4 mr-1" />
                            <span>{vendor.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <div className="flex items-center text-brand-dark opacity-70 text-sm mb-2">
                        <MapPinIcon className="w-4 h-4 mr-1 shrink-0" />
                        <span>{vendor.city}</span>
                    </div>
                    <p className="text-brand-dark opacity-90 text-sm mb-4 h-16 overflow-hidden">
                        {vendor.description}
                    </p>
                    <div className="mt-auto">
                        <p className="text-lg font-semibold text-brand-dark text-right mb-3">
                            Desde: ${vendor.startingPrice.toLocaleString('es-CL')}
                        </p>
                        <span
                            className="inline-block w-full text-center bg-brand-primary text-white font-bold py-2 px-4 rounded-full hover:bg-brand-accent transition-colors duration-300"
                        >
                            Ver Perfil
                        </span>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default VendorCard;
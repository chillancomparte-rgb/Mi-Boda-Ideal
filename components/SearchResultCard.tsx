import React from 'react';
import type { Vendor } from '../types';
import { StarIcon } from './icons/StarIcon';
import { HeartIcon } from './icons/HeartIcon';
import { MapPinIcon } from './icons/MapPinIcon';

interface SearchResultCardProps {
    vendor: Vendor;
    onVendorSelect: (vendor: Vendor) => void;
    isFavorite: boolean;
    onToggleFavorite: (vendor: Vendor) => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ vendor, onVendorSelect, isFavorite, onToggleFavorite }) => {
    
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(vendor);
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-brand-primary flex flex-col md:flex-row">
            <div className="md:w-1/3 flex-shrink-0">
                <img 
                    src={vendor.imageUrl} 
                    alt={vendor.name} 
                    className="w-full h-48 md:h-full object-cover cursor-pointer"
                    onClick={() => onVendorSelect(vendor)}
                />
            </div>
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                        {vendor.isPremium && (
                            <span className="text-xs font-bold text-yellow-600 bg-yellow-100 py-1 px-2 rounded-full inline-block mb-1">
                                PROVEEDOR PREMIUM
                            </span>
                        )}
                        <h3 
                            className="text-2xl font-serif font-bold text-brand-dark hover:text-brand-primary cursor-pointer"
                            onClick={() => onVendorSelect(vendor)}
                        >
                            {vendor.name}
                        </h3>
                    </div>
                    <div className="flex items-center bg-yellow-400 text-white text-sm font-bold px-2 py-1 rounded shrink-0 ml-4">
                        <StarIcon className="w-4 h-4 mr-1" />
                        <span>{vendor.rating.toFixed(1)}</span>
                    </div>
                </div>

                <div className="flex items-center text-brand-dark opacity-70 text-sm mb-3">
                    <MapPinIcon className="w-4 h-4 mr-1 shrink-0" />
                    <span>{vendor.city}</span>
                </div>

                <p className="text-brand-dark opacity-80 my-2 text-sm flex-grow h-20 overflow-hidden">
                    {vendor.description}
                </p>

                <div className="mt-auto flex flex-col sm:flex-row gap-3 items-center pt-4 border-t border-gray-100">
                    <button 
                        onClick={() => onVendorSelect(vendor)} 
                        className="w-full sm:w-auto flex-grow text-center bg-brand-primary text-white font-bold py-2 px-4 rounded-full hover:bg-brand-accent transition-colors duration-300"
                    >
                        Ver Perfil
                    </button>
                    <button 
                        onClick={handleFavoriteClick} 
                        className={`w-full sm:w-auto flex-grow flex items-center justify-center font-semibold py-2 px-4 rounded-full border-2 transition-colors duration-300 ${
                            isFavorite 
                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                                : 'bg-white border-gray-300 text-brand-dark hover:bg-gray-50'
                        }`}
                    >
                        <HeartIcon className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                        {isFavorite ? 'Guardado' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchResultCard;

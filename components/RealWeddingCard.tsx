import React from 'react';
import type { RealWedding } from '../types';
import { CameraIcon } from './icons/CameraIcon';

interface RealWeddingCardProps {
    wedding: RealWedding;
}

const RealWeddingCard: React.FC<RealWeddingCardProps> = ({ wedding }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300">
            <img 
                src={wedding.photos[0]} 
                alt={`Matrimonio de ${wedding.name}`}
                className="w-full h-48 object-cover" 
            />
            <div className="p-2 grid grid-cols-3 gap-1 bg-gray-50">
                {wedding.photos.slice(1, 4).map((photo, index) => (
                     <img 
                        key={index} 
                        src={photo} 
                        alt={`Foto ${index + 1} de ${wedding.name}`} 
                        className="w-full h-20 object-cover rounded-sm"
                    />
                ))}
            </div>
             <div className="p-4">
                <h3 className="text-lg font-serif font-bold text-brand-dark">{wedding.name}</h3>
                <div className="flex items-center text-sm text-brand-dark opacity-70 mt-1">
                    <CameraIcon className="h-4 w-4 mr-2"/>
                    <span>{wedding.photos.length} fotos · {wedding.location}</span>
                </div>
            </div>
        </div>
    );
};

export default RealWeddingCard;
import React from 'react';
import type { Inspiration } from '../types';

interface InspirationCardProps {
    item: Inspiration;
    onSelect: (item: Inspiration) => void;
}

const InspirationCard: React.FC<InspirationCardProps> = ({ item, onSelect }) => {
    const imageUrl = `https://source.unsplash.com/featured/400x533/?${encodeURIComponent(item.imageSearchTerms)}`;

    return (
        <button
            onClick={() => onSelect(item)}
            aria-label={`Ver inspiración: ${item.title}`}
            className="relative group block w-full overflow-hidden rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-brand-primary focus:ring-opacity-50 text-left"
            style={{ aspectRatio: '3 / 4' }}
        >
            <img 
                src={imageUrl} 
                alt={item.title} 
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col justify-end p-4">
                <span className="text-sm bg-brand-primary text-white py-1 px-2 rounded-full self-start mb-2">{item.category}</span>
                <h3 className="text-white font-serif text-lg font-bold">{item.title}</h3>
            </div>
        </button>
    );
};

export default InspirationCard;
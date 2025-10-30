import React from 'react';
import type { Inspiration } from '../types';
import SeoMeta from '../components/SeoMeta';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';

interface InspirationDetailPageProps {
    item: Inspiration;
    onBack: () => void;
}

const InspirationDetailPage: React.FC<InspirationDetailPageProps> = ({ item, onBack }) => {
    // Generate 4 unique, relevant image URLs for the gallery
    const galleryImageUrls = Array.from({ length: 4 }, (_, index) => 
        `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(item.imageSearchTerms)}&sig=${index}`
    );

    return (
        <div className="bg-white">
            <SeoMeta 
                title={`${item.title} | Inspiración de Boda`}
                description={item.description}
            />
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <button onClick={onBack} className="flex items-center text-brand-dark opacity-80 hover:opacity-100 font-semibold mb-6">
                        <ChevronLeftIcon className="h-5 w-5 mr-2"/>
                        Volver a la Galería de Inspiración
                    </button>

                    <span className="text-brand-primary font-semibold">{item.category}</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mt-2 mb-4">{item.title}</h1>
                    <p className="text-lg text-brand-dark opacity-90 mb-8">{item.description}</p>
                    
                    <h2 className="text-2xl font-serif font-bold text-brand-dark border-b pb-2 mb-6">Galería de Imágenes</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {galleryImageUrls.map((url, index) => (
                            <a 
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={index} 
                                className="block overflow-hidden rounded-lg shadow-md group"
                            >
                                <img 
                                    src={url} 
                                    alt={`${item.title} - imagen ${index + 1}`} 
                                    loading="lazy"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspirationDetailPage;
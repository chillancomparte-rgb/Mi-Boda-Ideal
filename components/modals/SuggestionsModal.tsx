import React from 'react';
import type { Page, WeddingInfo } from '../../types';
import { XIcon } from '../icons/XIcon';
import { CATEGORY_DETAILS } from '../../constants';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface SuggestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    info: WeddingInfo;
    navigate: (page: Page, data?: any, category?: string) => void;
}

const SuggestionsModal: React.FC<SuggestionsModalProps> = ({ isOpen, onClose, info, navigate }) => {
    if (!isOpen) return null;

    const categoryToPage = (category: string): Page => {
        const pageString = category.toLowerCase().replace(/ y | & /g, '-').replace(/ /g, '-');
        // Handle common variations
        if (pageString === 'fotografia') return 'photographers';
        if (pageString === 'musica') return 'music-dj';
        if (pageString === 'celebracion') return 'event-halls';
        return pageString as Page;
    }

    const handleCategoryClick = (category: string) => {
        const page = categoryToPage(category);
        navigate(page, undefined, category);
        onClose();
    };
    
    const handleViewMore = () => {
        navigate('vendors');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-6 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-brand-dark">¡Hola, {info.userName}! Busquemos a tus proveedores.</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
                        <XIcon className="h-6 w-6" />
                    </button>
                </header>

                <div className="px-6 pb-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <p className="font-semibold text-brand-dark">Elige una categoría</p>
                        <button onClick={handleViewMore} className="text-sm font-semibold text-red-500 hover:text-red-700">
                            Ver más proveedores
                        </button>
                    </div>

                    <div className="space-y-3">
                        {info.services.map(service => {
                            const details = CATEGORY_DETAILS[service];
                            if (!details) return null;

                            return (
                                <button
                                    key={service}
                                    onClick={() => handleCategoryClick(service)}
                                    className="w-full group flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-brand-primary transition-all duration-200 text-left"
                                >
                                    <div className="w-12 h-12 flex items-center justify-center bg-brand-secondary rounded-lg mr-4 text-brand-primary">
                                        {React.cloneElement(details.icon, { className: "h-7 w-7" })}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-brand-dark flex items-center">{service} <ArrowRightIcon className="h-4 w-4 ml-1 text-red-500"/></h3>
                                        <p className="text-sm text-brand-dark opacity-70">{details.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                         {info.services.length === 0 && (
                            <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                                <p className="text-brand-dark">No has seleccionado ningún servicio.</p>
                                <p className="text-sm text-brand-dark opacity-70 mt-2">
                                    Edita la información de tu boda para seleccionar los servicios que necesitas y te daremos sugerencias personalizadas.
                                </p>
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuggestionsModal;
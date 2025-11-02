import React, { useState, useEffect } from 'react';
import type { Page } from '../../types';
import { XIcon } from '../icons/XIcon';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import { WeddingRingIcon } from '../icons/WeddingRingIcon';

const genericImages = [
    'https://images.unsplash.com/photo-1587271407752-dea50566478a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1515934751635-becd7866dabc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1517457375823-140ee5160016?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1518050947974-cba8c79fea2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
];

interface RoleSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    navigate: (page: Page) => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onClose, navigate }) => {
    const [currentImage, setCurrentImage] = useState('');

    useEffect(() => {
        if (isOpen) {
            const randomIndex = Math.floor(Math.random() * genericImages.length);
            setCurrentImage(genericImages[randomIndex]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSelectRole = (rolePage: Page) => {
        navigate(rolePage);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col md:flex-row overflow-hidden">
                {/* Image Section */}
                <div className="md:w-1/2 bg-cover bg-center h-48 md:h-auto" style={{ backgroundImage: `url('${currentImage}')` }}>
                    {/* Optional: Add an overlay or text on the image */}
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-brand-dark">¿Cómo quieres registrarte?</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XIcon className="h-6 w-6"/></button>
                        </div>
                        <p className="text-brand-dark opacity-80 mb-6">Elige la opción que mejor se adapte a ti para empezar a planificar o hacer crecer tu negocio.</p>

                        <div className="space-y-4 mb-6">
                            <button
                                onClick={() => handleSelectRole('client-registration')}
                                className="w-full flex items-center justify-center py-3 px-4 bg-brand-primary text-white font-bold rounded-md hover:bg-brand-accent transition-colors text-lg"
                            >
                                <WeddingRingIcon className="h-6 w-6 mr-2"/>
                                Registro como Novio/Novia
                            </button>
                            <button
                                onClick={() => handleSelectRole('registration')}
                                className="w-full flex items-center justify-center py-2 px-4 border border-brand-primary text-brand-primary font-bold rounded-md hover:bg-brand-primary hover:text-white transition-colors text-sm"
                            >
                                <BriefcaseIcon className="h-5 w-5 mr-2"/>
                                Registro como Proveedor
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionModal;

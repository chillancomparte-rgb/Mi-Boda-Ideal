

import React from 'react';
import { WeddingRingIcon } from './icons/WeddingRingIcon';
import type { Page } from '../types';

interface FooterProps {
    navigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center">
                         <WeddingRingIcon className="h-8 w-8 text-brand-primary" />
                         <span className="ml-2 text-2xl font-serif font-bold text-brand-dark">Mi Boda Ideal</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
                        <p className="text-brand-dark opacity-70 text-center">
                            © {new Date().getFullYear()} Mi Boda Ideal. Todos los derechos reservados.
                        </p>
                         <button 
                            onClick={() => navigate('admin')}
                            className="text-brand-dark opacity-70 hover:opacity-100 hover:text-brand-primary font-semibold transition-colors"
                        >
                            Acceso Administrador
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
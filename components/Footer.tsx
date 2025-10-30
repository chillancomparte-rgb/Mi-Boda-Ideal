
import React from 'react';
import { WeddingRingIcon } from './icons/WeddingRingIcon';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                         <WeddingRingIcon className="h-8 w-8 text-brand-primary" />
                         <span className="ml-2 text-2xl font-serif font-bold text-brand-dark">Mi Boda Ideal</span>
                    </div>
                    <p className="text-brand-dark opacity-70 text-center md:text-right">
                        © {new Date().getFullYear()} Mi Boda Ideal. Todos los derechos reservados. <br />
                        Planificando momentos inolvidables.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
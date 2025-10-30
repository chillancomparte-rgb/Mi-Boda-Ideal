
import React from 'react';
import { CrownIcon } from './icons/CrownIcon';

const PremiumFeatureLock: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-brand-secondary to-brand-primary text-white p-6 rounded-lg shadow-lg text-center">
            <div className="mb-4">
                <CrownIcon className="h-12 w-12 mx-auto text-yellow-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">Desbloquea tu Potencial</h3>
            <p className="text-sm opacity-90 mb-6">
                Accede a analíticas avanzadas, promoción destacada y más herramientas para hacer crecer tu negocio.
            </p>
            <button className="bg-white text-brand-primary hover:bg-gray-100 font-bold py-2 px-6 rounded-full w-full transition-transform duration-300 transform hover:scale-105">
                Actualizar a Premium
            </button>
        </div>
    );
};

export default PremiumFeatureLock;

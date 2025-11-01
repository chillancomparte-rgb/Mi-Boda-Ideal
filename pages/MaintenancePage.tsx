import React from 'react';
import SeoMeta from '../components/SeoMeta';
import { WeddingRingIcon } from '../components/icons/WeddingRingIcon';

const MaintenancePage: React.FC = () => {
    return (
        <>
            <SeoMeta 
                title="Sitio en Construcción | Mi Boda Ideal"
                description="Estamos preparando algo especial. Volveremos muy pronto con novedades para tu boda."
            />
            <div 
                className="relative min-h-screen flex items-center justify-center text-center text-white bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1600&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-brand-dark bg-opacity-60 backdrop-blur-sm"></div>
                <div className="relative z-10 p-8">
                    <div className="mb-8">
                        <WeddingRingIcon className="h-24 w-24 mx-auto text-white opacity-90 animate-pulse" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg">
                        Estamos preparando algo especial
                    </h1>
                    <p className="text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto">
                        Nuestro sitio web está en construcción para ofrecerte la mejor experiencia en la planificación de tu boda.
                        <br />
                        ¡Vuelve muy pronto!
                    </p>
                </div>
            </div>
        </>
    );
};

export default MaintenancePage;
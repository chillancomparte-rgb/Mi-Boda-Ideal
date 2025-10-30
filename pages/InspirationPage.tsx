import React, { useState, useEffect } from 'react';
import type { Inspiration } from '../types';
import { generateInspirationStream } from '../services/geminiService';
import InspirationCard from '../components/InspirationCard';
import Spinner from '../components/Spinner';
import SeoMeta from '../components/SeoMeta';

interface InspirationPageProps {
    onInspirationSelect: (item: Inspiration) => void;
}

const InspirationPage: React.FC<InspirationPageProps> = ({ onInspirationSelect }) => {
    const [inspirationItems, setInspirationItems] = useState<Inspiration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInspiration = async () => {
            setIsLoading(true);
            setError(null);
            setInspirationItems([]); // Clear previous items for new stream
            try {
                const stream = generateInspirationStream();
                let firstItemLoaded = false;
                for await (const item of stream) {
                    if (!firstItemLoaded) {
                        setIsLoading(false); // Stop spinner after first item arrives
                        firstItemLoaded = true;
                    }
                    setInspirationItems(prev => [...prev, item]);
                }
                if (!firstItemLoaded) { // Handle cases where stream is empty
                     setIsLoading(false);
                }
            } catch (err) {
                setError("No se pudo cargar la inspiración. Inténtalo de nuevo.");
                console.error(err);
                setIsLoading(false);
            }
        };

        fetchInspiration();
    }, []);

    return (
        <div className="container mx-auto px-6 py-12">
            <SeoMeta 
                title="Inspiración para tu Boda | Mi Boda Ideal"
                description="Explora miles de ideas y fotos para la decoración, vestidos, pasteles y más. Encuentra la inspiración perfecta para cada detalle de tu boda."
            />
            <div className="text-center mb-12">
                <h1 className="text-5xl font-serif font-bold text-brand-dark">Galería de Inspiración</h1>
                <p className="text-lg text-brand-dark opacity-80 mt-4 max-w-2xl mx-auto">Encuentra ideas para cada detalle y crea la boda que siempre has imaginado.</p>
            </div>

            {isLoading ? (
                <Spinner />
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                    {inspirationItems.map((item) => (
                        <div key={item.id} className="break-inside-avoid">
                           <InspirationCard item={item} onSelect={onInspirationSelect} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InspirationPage;
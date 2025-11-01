import React, { useState, useEffect } from 'react';
import type { Inspiration } from '../types';
import { getInspiration } from '../services/mockDataService';
import InspirationCard from '../components/InspirationCard';
import Spinner from '../components/Spinner';
import SeoMeta from '../components/SeoMeta';
import { generateInspiration, AIInspirationResponse } from '../services/geminiService';
import { SparklesIcon } from '../components/icons/SparklesIcon';

interface InspirationPageProps {
    onInspirationSelect: (item: Inspiration) => void;
}

const AIInspirationStudio: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState<AIInspirationResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Por favor, describe tu idea.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult(null);
        const response = await generateInspiration(prompt);
        if (response) {
            setResult(response);
        } else {
            setError('No pudimos generar ideas esta vez. ¡Inténtalo de nuevo!');
        }
        setIsLoading(false);
    };

    return (
        <section className="mb-16 bg-gradient-to-br from-brand-secondary via-white to-white p-8 rounded-2xl shadow-lg">
            <div className="text-center max-w-2xl mx-auto">
                <SparklesIcon className="h-12 w-12 mx-auto text-brand-primary mb-2" />
                <h2 className="text-3xl font-serif font-bold text-brand-dark">Estudio de Inspiración con IA</h2>
                <p className="text-brand-dark opacity-80 mt-2 mb-6">¿Tienes una idea pero no sabes por dónde empezar? Descríbela y dejaremos que la magia ocurra.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ej: 'Boda rústica en el campo con toques vintage'"
                        className="flex-grow p-3 border border-gray-300 rounded-full shadow-sm text-center focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100">
                        {isLoading ? 'Creando Magia...' : 'Generar Ideas'}
                    </button>
                </div>
                 {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </div>
            {isLoading && <div className="mt-8"><Spinner /></div>}
            {result && (
                <div className="mt-10 animate-fade-in max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-inner">
                    <h3 className="text-2xl font-serif font-bold text-brand-dark text-center mb-6">{result.themeTitle}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-brand-dark mb-3">Paleta de Colores</h4>
                            <div className="flex flex-wrap gap-3">
                                {result.colorPalette.map(color => (
                                    <div key={color.hex} className="text-center">
                                        <div className="w-16 h-16 rounded-full shadow-md mb-1 border" style={{ backgroundColor: color.hex }}></div>
                                        <p className="text-xs text-brand-dark font-medium">{color.name}</p>
                                        <p className="text-xs text-brand-dark opacity-70">{color.hex}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-8">
                            <div>
                                <h4 className="font-bold text-brand-dark mb-3">Ideas de Decoración</h4>
                                <ul className="list-disc list-inside space-y-2 text-sm text-brand-dark opacity-90">
                                    {result.decorIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-brand-dark mb-3">Estilos de Vestido</h4>
                                <ul className="list-disc list-inside space-y-2 text-sm text-brand-dark opacity-90">
                                    {result.dressStyle.map((style, i) => <li key={i}>{style}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};


const InspirationPage: React.FC<InspirationPageProps> = ({ onInspirationSelect }) => {
    const [inspirationItems, setInspirationItems] = useState<Inspiration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInspiration = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const items = await getInspiration();
                setInspirationItems(items);
            } catch (err) {
                setError("No se pudo cargar la inspiración. Inténtalo de nuevo.");
                console.error(err);
            } finally {
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

            <AIInspirationStudio />

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

import React, { useState, useEffect } from 'react';
import type { Vendor, FAQItem } from '../types';
import SeoMeta from '../components/SeoMeta';
import { HeartIcon } from '../components/icons/HeartIcon';
import { StarIcon } from '../components/icons/StarIcon';
import { MapPinIcon } from '../components/icons/MapPinIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { ChatIcon } from '../components/icons/ChatIcon';
import { PhoneIcon } from '../components/icons/PhoneIcon';
import { MOCK_REVIEWS } from '../constants';
import VendorReviews from '../components/vendor/VendorReviews';
import VendorCard from '../components/VendorCard';
import Accordion from '../components/Accordion';
import { getVendorFAQs, getSimilarVendors } from '../services/mockDataService';


interface VendorProfilePageProps {
    vendor: Vendor;
    onBack: () => void;
    favorites: Vendor[];
    onToggleFavorite: (vendor: Vendor) => void;
    onVendorSelect: (vendor: Vendor) => void;
}

const VendorProfilePage: React.FC<VendorProfilePageProps> = ({ vendor, onBack, favorites, onToggleFavorite, onVendorSelect }) => {
    const isFavorite = favorites.some(fav => fav.name === vendor.name);
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);
    const [similarVendors, setSimilarVendors] = useState<Vendor[]>([]);

    useEffect(() => {
        const fetchFaqs = async () => {
            setIsLoadingFaqs(true);
            try {
                const generatedFaqs = await getVendorFAQs(vendor.name, vendor.category);
                setFaqs(generatedFaqs);
            } catch(e) {
                console.error("Failed to fetch FAQs", e);
            } finally {
                setIsLoadingFaqs(false);
            }
        };

        const fetchSimilarVendors = async () => {
            const similar = await getSimilarVendors(vendor);
            setSimilarVendors(similar);
        };

        fetchFaqs();
        fetchSimilarVendors();
    }, [vendor]);


    const handleFavoriteClick = () => {
        onToggleFavorite(vendor);
    };

    return (
        <div>
            <SeoMeta 
                title={`${vendor.name} - ${vendor.category} en ${vendor.city}`}
                description={vendor.description}
            />
            {/* Hero Section */}
            <div className="relative h-[40vh] md:h-[50vh] bg-gray-200">
                 <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
                    <button onClick={onBack} className="absolute top-8 left-6 flex items-center bg-white bg-opacity-80 hover:bg-opacity-100 text-brand-dark font-semibold py-2 px-4 rounded-full text-sm transition-colors">
                        <ArrowLeftIcon className="h-4 w-4 mr-2"/>
                        Volver
                    </button>
                    <span className="text-white font-semibold bg-brand-primary py-1 px-3 rounded-full self-start mb-2">{vendor.category}</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-lg">{vendor.name}</h1>
                    <div className="flex items-center mt-2 text-white">
                        <div className="flex items-center bg-yellow-400 text-white text-sm font-bold px-2 py-1 rounded">
                            <StarIcon className="w-4 h-4 mr-1" />
                            <span>{vendor.rating.toFixed(1)}</span>
                        </div>
                        <span className="mx-2">·</span>
                        <div className="flex items-center">
                            <MapPinIcon className="w-5 h-5 mr-1" />
                            <span>{vendor.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        <section id="descripcion" className="mb-12">
                             <h2 className="text-2xl font-serif font-bold text-brand-dark border-b pb-2 mb-4">Sobre {vendor.name}</h2>
                             <p className="text-brand-dark opacity-90 leading-relaxed">{vendor.description}</p>
                        </section>
                        
                        <section id="galeria" className="mb-12">
                            <h2 className="text-2xl font-serif font-bold text-brand-dark border-b pb-2 mb-4">Galería de Fotos</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <img 
                                        key={i}
                                        src={`https://source.unsplash.com/featured/400x300/?${encodeURIComponent(vendor.category)}&sig=${i}`}
                                        alt={`Galería de ${vendor.name} - ${i+1}`}
                                        className="w-full h-40 object-cover rounded-lg shadow-md"
                                    />
                                ))}
                            </div>
                        </section>
                        
                        <section id="faq" className="mb-12">
                             <h2 className="text-2xl font-serif font-bold text-brand-dark border-b pb-2 mb-4">Preguntas Frecuentes</h2>
                             {isLoadingFaqs ? (
                                <p className="text-brand-dark opacity-70">Cargando preguntas frecuentes...</p>
                             ) : faqs.length > 0 ? (
                                <div className="space-y-4">
                                    {faqs.map(faq => (
                                        <Accordion key={faq.question} title={faq.question}>
                                            <p className="text-brand-dark opacity-80">{faq.answer}</p>
                                        </Accordion>
                                    ))}
                                </div>
                             ) : (
                                 <p className="text-brand-dark opacity-70">No hay preguntas frecuentes disponibles por el momento.</p>
                             )}
                        </section>

                        <section id="opiniones">
                             <VendorReviews reviews={MOCK_REVIEWS} />
                        </section>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <aside className="lg:sticky top-28 self-start">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 mb-8">
                             <p className="text-lg font-semibold text-brand-dark text-center mb-1">
                                Desde: <span className="text-3xl font-bold text-brand-primary">${vendor.startingPrice.toLocaleString('es-CL')}</span>
                            </p>
                            <p className="text-xs text-brand-dark opacity-70 text-center mb-4">Los precios pueden variar según la fecha y servicios.</p>
                            <div className="space-y-3">
                                 <button className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-full hover:bg-brand-accent transition-colors flex items-center justify-center">
                                    <ChatIcon className="h-5 w-5 mr-2" />
                                    Solicitar Presupuesto
                                </button>
                                 <button className="w-full bg-white border-2 border-brand-primary text-brand-primary font-bold py-3 px-4 rounded-full hover:bg-brand-light transition-colors flex items-center justify-center">
                                    <PhoneIcon className="h-5 w-5 mr-2" />
                                    Ver Teléfono
                                </button>
                                <button
                                    onClick={handleFavoriteClick}
                                    className={`w-full border-2 font-bold py-3 px-4 rounded-full transition-colors flex items-center justify-center ${isFavorite ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-white border-gray-300 text-brand-dark hover:bg-gray-50'}`}
                                >
                                    <HeartIcon className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                                    {isFavorite ? 'Guardado en Favoritos' : 'Guardar en Favoritos'}
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
                
                {similarVendors.length > 0 && (
                    <section id="similares" className="mt-16 pt-12 border-t">
                        <h2 className="text-3xl font-serif font-bold text-brand-dark mb-8 text-center">Proveedores Similares</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {similarVendors.map(v => (
                                <VendorCard 
                                    key={v.name}
                                    vendor={v}
                                    onVendorSelect={onVendorSelect}
                                    isFavorite={favorites.some(fav => fav.name === v.name)}
                                    onToggleFavorite={onToggleFavorite}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default VendorProfilePage;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Vendor } from '../types';
import { generateVendorsStream } from '../services/geminiService';
import VendorCard from '../components/VendorCard';
import Spinner from '../components/Spinner';
import SeoMeta from '../components/SeoMeta';
import { VENDOR_CATEGORIES, CHILE_REGIONS } from '../constants';
import { SearchIcon } from '../components/icons/SearchIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';

type SearchStep = 'SELECT_CATEGORY' | 'SELECT_REGION' | 'SHOW_RESULTS';

interface VendorsPageProps {
    onVendorSelect: (vendor: Vendor) => void;
    initialCategory?: string;
    initialRegion?: string | null;
    onRegionSelect: (region: string) => void;
    favorites: Vendor[];
    onToggleFavorite: (vendor: Vendor) => void;
}

const VendorsPage: React.FC<VendorsPageProps> = ({ onVendorSelect, initialCategory, initialRegion, onRegionSelect, favorites, onToggleFavorite }) => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(initialRegion);
    
    const [step, setStep] = useState<SearchStep>(() => {
        if (!initialCategory) return 'SELECT_CATEGORY';
        if (initialRegion) return 'SHOW_RESULTS';
        return 'SELECT_REGION';
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchVendors = useCallback(async (category: string, location: string, isLoadMore = false) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        
        if (isLoadMore) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
            setVendors([]);
        }
        setError(null);
        
        try {
            const existingNames = isLoadMore ? vendors.map(v => v.name) : [];
            const vendorStream = generateVendorsStream(category, location, existingNames);
            for await (const vendor of vendorStream) {
                 if (abortControllerRef.current.signal.aborted) break;
                 setVendors(prev => [...prev, vendor]);
            }
        } catch (err) {
             if (err instanceof Error && err.name !== 'AbortError') {
                setError("No se pudieron cargar los proveedores. Inténtalo de nuevo más tarde.");
                console.error(err);
             }
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [vendors]);

    useEffect(() => {
        setSelectedCategory(initialCategory);
        setSelectedLocation(initialRegion);
        if (!initialCategory) {
            setStep('SELECT_CATEGORY');
        } else {
            setStep(initialRegion ? 'SHOW_RESULTS' : 'SELECT_REGION');
        }
    }, [initialCategory, initialRegion]);

    useEffect(() => {
        if (step === 'SHOW_RESULTS' && selectedCategory && selectedLocation) {
            fetchVendors(selectedCategory, selectedLocation);
        }
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        }
    }, [step, selectedCategory, selectedLocation, fetchVendors]);
    
    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setStep('SELECT_REGION');
    };
    
    const handleRegionSelect = (region: string) => {
        setSelectedLocation(region);
        onRegionSelect(region); // Persist selection
        setStep('SHOW_RESULTS');
    };

    const handleBackToCategorySelect = () => {
        setStep('SELECT_CATEGORY');
        setSelectedLocation(null);
    }
    
    const handleSearchFromBar = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCategory && selectedLocation) {
             onRegionSelect(selectedLocation);
             fetchVendors(selectedCategory, selectedLocation);
        }
    };

    const handleLoadMore = () => {
        if (selectedCategory && selectedLocation) {
            fetchVendors(selectedCategory, selectedLocation, true);
        }
    };
    
    const renderContent = () => {
        switch (step) {
            case 'SELECT_CATEGORY':
                return (
                    <div className="text-center my-12 animate-fade-in">
                        <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-3xl mx-auto">
                            <h2 className="text-4xl font-serif font-bold text-brand-dark mb-6">¿Qué estás buscando?</h2>
                            <p className="text-brand-dark opacity-80 mb-8 max-w-lg mx-auto">Selecciona una categoría para empezar a encontrar los proveedores perfectos para tu boda.</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {VENDOR_CATEGORIES.map(cat => (
                                    <button 
                                        key={cat} 
                                        onClick={() => handleCategorySelect(cat)} 
                                        className="bg-white border border-brand-secondary text-brand-accent hover:bg-brand-secondary hover:border-brand-primary font-semibold py-2 px-5 rounded-full transition-all duration-200 transform hover:scale-105"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            
            case 'SELECT_REGION':
                return (
                    <div className="text-center my-12 animate-fade-in">
                        <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-4xl mx-auto">
                            <h2 className="text-4xl font-serif font-bold text-brand-dark mb-2">¿En qué región deseas buscar?</h2>
                            <p className="text-brand-dark opacity-80 mb-8">Has seleccionado: <span className="font-bold text-brand-primary">{selectedCategory}</span></p>
                            <div className="flex flex-wrap justify-center gap-4 mb-8">
                                {CHILE_REGIONS.map(reg => (
                                    <button
                                        key={reg}
                                        onClick={() => handleRegionSelect(reg)}
                                        className="bg-gray-100 text-brand-dark text-center p-4 border border-gray-200 rounded-lg hover:bg-brand-light hover:border-brand-primary transition-colors duration-200 font-medium"
                                    >
                                        {reg}
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleBackToCategorySelect} className="flex items-center mx-auto text-sm text-brand-dark opacity-80 hover:opacity-100 font-semibold">
                                <ArrowLeftIcon className="h-4 w-4 mr-2"/>
                                Volver a elegir categoría
                            </button>
                        </div>
                    </div>
                );

            case 'SHOW_RESULTS':
                return (
                    <>
                        {error && <p className="text-center text-red-500 my-8">{error}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {vendors.map((vendor, index) => (
                                <VendorCard 
                                    key={`${vendor.name}-${index}`} 
                                    vendor={vendor} 
                                    onVendorSelect={onVendorSelect}
                                    isFavorite={favorites.some(fav => fav.name === vendor.name)}
                                    onToggleFavorite={onToggleFavorite}
                                />
                            ))}
                        </div>
                        {isLoading && (
                             <div className="col-span-full mt-8">
                                 <Spinner />
                                 <p className="text-center text-brand-dark opacity-80 mt-2">Buscando los mejores proveedores para ti...</p>
                             </div>
                        )}
                        {!isLoading && vendors.length > 0 && (
                            <div className="text-center mt-12">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                    className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent transition-colors disabled:bg-gray-400 flex items-center justify-center mx-auto"
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                            Cargando...
                                        </>
                                    ) : (
                                        'Cargar más proveedores'
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )
        }
    }


    return (
        <div className="container mx-auto px-6 py-12">
            <SeoMeta 
                title="Proveedores para tu Boda | Mi Boda Ideal"
                description="Encuentra los mejores proveedores para tu boda en Chile. Busca fotógrafos, salones, banquetes y más. Compara y contacta a profesionales de confianza."
            />
            
            {step !== 'SHOW_RESULTS' && (
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-serif font-bold text-brand-dark">Encuentra tus Proveedores Ideales</h1>
                    <p className="text-lg text-brand-dark opacity-80 mt-4 max-w-2xl mx-auto">Busca y filtra para encontrar los profesionales perfectos que harán tu día inolvidable.</p>
                </div>
            )}
            
            {step === 'SHOW_RESULTS' && selectedCategory && selectedLocation && (
                <form onSubmit={handleSearchFromBar} className="bg-white p-6 rounded-lg shadow-md mb-10 flex flex-col md:flex-row gap-4 items-center sticky top-20 z-40 animate-fade-in-down">
                    <div className="flex-1 w-full md:w-auto">
                        <label htmlFor="category" className="block text-sm font-medium text-brand-dark mb-1">Categoría</label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        >
                            {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 w-full md:w-auto">
                        <label htmlFor="location" className="block text-sm font-medium text-brand-dark mb-1">Región</label>
                        <select
                            id="location"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        >
                            {CHILE_REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                        </select>
                    </div>
                    <div className="w-full md:w-auto pt-6">
                         <button type="submit" className="w-full md:w-auto bg-brand-primary text-white font-bold py-2 px-8 rounded-md hover:bg-brand-accent transition-colors flex items-center justify-center">
                            <SearchIcon className="h-5 w-5 mr-2" />
                            Buscar
                        </button>
                    </div>
                </form>
            )}

            {renderContent()}
        </div>
    );
};

export default VendorsPage;
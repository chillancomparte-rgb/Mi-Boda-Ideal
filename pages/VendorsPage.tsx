import React, { useState, useEffect } from 'react';
import type { Vendor } from '../types';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import SeoMeta from '../components/SeoMeta';
import { VENDOR_CATEGORIES, CHILE_REGIONS } from '../constants';
import { SearchIcon } from '../components/icons/SearchIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import SearchResultCard from '../components/SearchResultCard';
import RelatedSearches from '../components/RelatedSearches';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { ErrorIcon } from '../components/icons/ErrorIcon';

type SearchStep = 'SELECT_CATEGORY' | 'SELECT_REGION' | 'SHOW_RESULTS';
const PAGE_SIZE = 10;

interface VendorsPageProps {
    onVendorSelect: (vendor: Vendor) => void;
    initialCategory?: string;
    initialRegion?: string | null;
    onRegionSelect: (region: string) => void;
    favorites: Vendor[];
    onToggleFavorite: (vendor: Vendor) => void;
}

const VendorsPage: React.FC<VendorsPageProps> = ({ onVendorSelect, initialCategory, initialRegion, onRegionSelect, favorites, onToggleFavorite }) => {
    const [allVendors, setAllVendors] = useState<Vendor[]>([]);
    const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
    const [displayedStandardVendors, setDisplayedStandardVendors] = useState<Vendor[]>([]);
    const [visibleStandardCount, setVisibleStandardCount] = useState<number>(PAGE_SIZE);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(initialRegion || null);
    
    const getInitialStep = (): SearchStep => {
        if (initialCategory) {
            return initialRegion ? 'SHOW_RESULTS' : 'SELECT_REGION';
        }
        return 'SELECT_CATEGORY';
    };
    const [step, setStep] = useState<SearchStep>(getInitialStep());

    useEffect(() => {
        const fetchVendors = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const vendorsCollectionRef = collection(db, 'vendors');
                // Solo obtenemos los proveedores que han sido aprobados
                const q = query(vendorsCollectionRef, where("status", "==", "Aprobado"));
                const vendorsSnapshot = await getDocs(q);
                const vendorsList = vendorsSnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Mapeamos y proveemos valores por defecto para que coincida con el tipo Vendor
                    return {
                        id: doc.id,
                        name: data.name || 'Sin Nombre',
                        category: data.category || 'Sin Categoría',
                        location: data.location || 'Sin Ubicación',
                        city: data.location || 'Sin Ciudad', // Usamos location como fallback
                        rating: data.rating || 4.5, // Default rating
                        description: data.description || 'Descripción no disponible.', // Default description
                        imageUrl: data.imageUrl || `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(data.category || 'wedding')}`, // Default image
                        startingPrice: data.startingPrice || 100000, // Default price
                        isPremium: data.isPremium || false,
                    } as Vendor;
                });
                setAllVendors(vendorsList);
            } catch (err) {
                setError("No se pudieron cargar los proveedores. Inténtalo de nuevo más tarde.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVendors();
    }, []);

    useEffect(() => {
        if (isLoading || !selectedCategory || !selectedLocation) return;

        setVisibleStandardCount(PAGE_SIZE); // Reset pagination on new search

        const results = allVendors.filter(v => 
            v.category === selectedCategory && v.location.includes(selectedLocation)
        );
        setFilteredVendors(results);
        
        if (selectedCategory && selectedLocation) {
            setStep('SHOW_RESULTS');
        }

    }, [allVendors, selectedCategory, selectedLocation, isLoading]);
    
    useEffect(() => {
        const standardVendors = filteredVendors.filter(v => !v.isPremium);
        setDisplayedStandardVendors(standardVendors.slice(0, visibleStandardCount));
    }, [filteredVendors, visibleStandardCount]);

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
        setSelectedCategory(null);
    };

    const handleSearchFromBar = (e: React.FormEvent) => {
        e.preventDefault();
        // The filtering is handled by the useEffect hook. This just ensures the step is correct.
        setStep('SHOW_RESULTS');
    };
    
    const NoResultsFound: React.FC = () => (
        <div className="text-center my-12 bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <ErrorIcon className="h-16 w-16 mx-auto text-brand-primary mb-4" />
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-2">No hemos encontrado resultados</h3>
            <p className="text-brand-dark opacity-80 mb-6 mx-auto">
                Actualmente no tenemos proveedores de <strong>{selectedCategory}</strong> en la región de <strong>{selectedLocation}</strong>.
            </p>
            <button
                onClick={handleBackToCategorySelect}
                className="inline-flex items-center justify-center bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent transition-transform transform hover:scale-105"
            >
                Realizar otra búsqueda
            </button>
        </div>
    );

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
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Volver a elegir categoría
                            </button>
                        </div>
                    </div>
                );

            case 'SHOW_RESULTS':
                if (isLoading) return <Spinner />;
                if (error) return <p className="text-center text-red-500">{error}</p>;

                const premiumVendors = filteredVendors.filter(v => v.isPremium);
                const allStandardVendors = filteredVendors.filter(v => !v.isPremium);

                const relatedSearches = [
                    `${selectedCategory} en ${CHILE_REGIONS.find(r => r !== selectedLocation && r.startsWith('Metro')) || 'Valparaíso'}`,
                    `${VENDOR_CATEGORIES.find(c => c !== selectedCategory && c.startsWith('Deco')) || 'Decoración'} en ${selectedLocation}`,
                    `Precios de ${selectedCategory} en Chile`
                ];

                return (
                    <div className="animate-fade-in">
                        <p className="text-sm text-brand-dark opacity-70 mb-6">
                            Mostrando {filteredVendors.length} resultados para <strong>{selectedCategory}</strong> en <strong>{selectedLocation}</strong>.
                        </p>

                        {filteredVendors.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-8 space-y-6">
                                    {premiumVendors.length > 0 && (
                                        <section>
                                            <h2 className="text-xl font-serif font-bold text-brand-dark mb-4 flex items-center">
                                                <SparklesIcon className="h-5 w-5 mr-2 text-yellow-500"/> Recomendaciones Premium
                                            </h2>
                                            <div className="space-y-6">
                                                {premiumVendors.map(vendor => (
                                                    <SearchResultCard
                                                        key={vendor.id || vendor.name}
                                                        vendor={vendor}
                                                        onVendorSelect={onVendorSelect}
                                                        isFavorite={favorites.some(fav => fav.name === vendor.name)}
                                                        onToggleFavorite={onToggleFavorite}
                                                    />
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {displayedStandardVendors.length > 0 && (
                                        <section className={premiumVendors.length > 0 ? 'pt-6 border-t mt-6' : ''}>
                                            <h2 className="text-xl font-serif font-bold text-brand-dark mb-4">
                                                Opciones Populares
                                            </h2>
                                            <div className="space-y-6">
                                                {displayedStandardVendors.map(vendor => (
                                                    <SearchResultCard
                                                        key={vendor.id || vendor.name}
                                                        vendor={vendor}
                                                        onVendorSelect={onVendorSelect}
                                                        isFavorite={favorites.some(fav => fav.name === vendor.name)}
                                                        onToggleFavorite={onToggleFavorite}
                                                    />
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {allStandardVendors.length > displayedStandardVendors.length && (
                                        <div className="text-center mt-8">
                                            <button
                                                onClick={() => setVisibleStandardCount(prev => prev + PAGE_SIZE)}
                                                className="inline-flex items-center justify-center bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent transition-transform transform hover:scale-105"
                                            >
                                                Cargar más resultados
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                <aside className="lg:col-span-4 lg:sticky top-40 self-start space-y-8">
                                    <RelatedSearches searches={relatedSearches} />
                                </aside>
                            </div>
                        ) : (
                           <NoResultsFound />
                        )}
                    </div>
                );
        }
    };

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
                <form onSubmit={handleSearchFromBar} className="bg-white p-6 rounded-lg shadow-md mb-10 flex flex-col md:flex-row gap-4 items-center sticky top-[76px] z-40 animate-fade-in-down">
                    <div className="flex-1 w-full md:w-auto">
                        <label htmlFor="category" className="block text-sm font-medium text-brand-dark mb-1">Categoría</label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setFilteredVendors([]); // Clear results to force refilter
                            }}
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
                             onChange={(e) => {
                                setSelectedLocation(e.target.value);
                                onRegionSelect(e.target.value);
                                setFilteredVendors([]); // Clear results to force refilter
                            }}
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
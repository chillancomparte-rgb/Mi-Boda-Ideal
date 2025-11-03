import React, { useState, useEffect, useContext } from 'react';
import type { Vendor, Service, Page } from '../types';
import SeoMeta from '../components/SeoMeta';
import { HeartIcon } from '../components/icons/HeartIcon';
import { StarIcon } from '../components/icons/StarIcon';
import { MapPinIcon } from '../components/icons/MapPinIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { ChatIcon } from '../components/icons/ChatIcon';
import { PhoneIcon } from '../components/icons/PhoneIcon';
import { CrownIcon } from '../components/icons/CrownIcon';
import { getVendor, getServices } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';
import QuoteRequestModal from '../components/modals/QuoteRequestModal';
import VendorReviews from '../components/vendor/VendorReviews';

// Importar el nuevo modal de reseñas
import ReviewModal from '../components/modals/ReviewModal';

interface VendorProfilePageProps {
    vendorId: string;
    onBack: () => void;
}

const VendorProfilePage: React.FC<VendorProfilePageProps> = ({ vendorId, onBack }) => {
    const { user, loading: authLoading } = useAuth();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [showQuoteRequestModal, setShowQuoteRequestModal] = useState(false);
    const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<Service | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false); // Nuevo estado para el modal de reseñas
    const [refreshReviews, setRefreshReviews] = useState(false); // Estado para refrescar las reseñas

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const fetchedVendor = await getVendor(vendorId);
                if (fetchedVendor) {
                    setVendor(fetchedVendor);
                    const fetchedServices = await getServices(vendorId);
                    setServices(fetchedServices);
                }
            } catch (error) {
                console.error("Error fetching vendor data: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [vendorId, refreshReviews]); // Añadir refreshReviews como dependencia

    if (isLoading) {
        return <Spinner />;
    }

    if (!vendor) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-3xl font-bold text-gray-800">Proveedor no encontrado</h1>
                <button onClick={onBack} className="mt-4 text-brand-primary hover:underline">Volver a la lista de proveedores</button>
            </div>
        );
    }

    const handleRequestQuote = (service: Service) => {
        if (!user) {
            alert("Debes iniciar sesión para solicitar un presupuesto.");
            // Aquí podrías redirigir al login o abrir un modal de autenticación
            return;
        }
        setSelectedServiceForQuote(service);
        setShowQuoteRequestModal(true);
    };

    const handleViewPhone = () => {
        if (!user) {
            alert("Debes iniciar sesión para ver el teléfono de contacto.");
            return;
        }
        setShowContactInfo(true);
    };

    const ratingDisplay = vendor.averageRating ? vendor.averageRating.toFixed(1) : 'N/A';
    const reviewCountDisplay = vendor.reviewCount ? `(${vendor.reviewCount} reseñas)` : '(Sin reseñas)';

    return (
        <div>
            <SeoMeta
                title={`${vendor.name} - ${vendor.category} en ${vendor.location}`}
                description={vendor.description || `Perfil de ${vendor.name}, ${vendor.category} para bodas.`}
            />
            {/* Hero Section */}
            <div className="relative h-[40vh] md:h-[50vh] bg-gray-200">
                 <img src={vendor.logoUrl || 'https://via.placeholder.com/1200x800'} alt={vendor.name} className="w-full h-full object-cover"/>
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
                            <span>{ratingDisplay}</span>
                        </div>
                        <span className="mx-2">·</span>
                        <div className="flex items-center">
                            <MapPinIcon className="w-5 h-5 mr-1" />
                            <span>{vendor.location}</span>
                        </div>
                         {vendor.isPremium && (
                            <div className="ml-4 flex items-center text-yellow-400">
                                <CrownIcon className="w-5 h-5 mr-1" />
                                <span className="text-sm font-semibold">Premium</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        {vendor.description && (
                            <section id="descripcion" className="mb-12">
                                 <h2 className="text-2xl font-serif font-bold text-brand-dark border-b pb-2 mb-4">Sobre {vendor.name}</h2>
                                 <p className="text-brand-dark opacity-90 leading-relaxed">{vendor.description}</p>
                            </section>
                        )}

                        {/* Sección de Servicios del Proveedor */}
                        {services.length > 0 && (
                            <section id="servicios" className="mb-12">
                                <h2 className="text-2xl font-serif font-bold text-brand-dark border-b pb-2 mb-4">Servicios Ofrecidos por {vendor.name}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {services.map(service => (
                                        <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                                            {service.images && service.images.length > 0 && (
                                                <img
                                                    src={service.images[0]}
                                                    alt={service.name}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            )}
                                            <div className="p-5">
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                                                <p className="text-gray-600 text-sm mb-3">{service.description.substring(0, 100)}...</p>
                                                <div className="flex items-center text-gray-700 text-base mb-3">
                                                    <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                                    <span>{service.averageRating ? service.averageRating.toFixed(1) : 'N/A'} {service.reviewCount ? `(${service.reviewCount})` : '(0)'}</span>
                                                </div>
                                                <p className="text-brand-primary text-lg font-bold mb-4">Desde ${service.price.toLocaleString('es-CL')}</p>
                                                <button
                                                    onClick={() => handleRequestQuote(service)} // Pasar el servicio al handler
                                                    className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-full hover:bg-brand-accent transition-colors"
                                                >
                                                    Solicitar Presupuesto
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Sección de Reseñas */}
                        <section id="opiniones" className="mb-12">
                             <h2 className="text-2xl font-serif font-bold text-brand-dark border-b pb-2 mb-4">Lo que dicen de {vendor.name} {reviewCountDisplay}</h2>
                             <VendorReviews vendorId={vendor.id} /> {/* Integrar el componente VendorReviews */}
                        </section>

                    </div>

                    {/* Right Column (Sidebar) */}
                    <aside className="lg:sticky top-28 self-start">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 mb-8">
                             <p className="text-lg font-semibold text-brand-dark text-center mb-1">
                                Contacto
                            </p>
                            <p className="text-xs text-brand-dark opacity-70 text-center mb-4">Conéctate con {vendor.name}</p>
                            <div className="space-y-3">
                                 <button
                                    onClick={() => handleRequestQuote(services[0])} // Asumiendo que se puede solicitar presupuesto para el primer servicio o un servicio general
                                    disabled={!user || services.length === 0}
                                    className={`w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-full transition-colors flex items-center justify-center ${!user || services.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-accent'}`}
                                >
                                    <ChatIcon className="h-5 w-5 mr-2" />
                                    Solicitar Presupuesto
                                </button>
                                 <button
                                    onClick={handleViewPhone}
                                    disabled={!user}
                                    className={`w-full bg-white border-2 border-brand-primary text-brand-primary font-bold py-3 px-4 rounded-full transition-colors flex items-center justify-center ${!user ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-light'}`}
                                >
                                    <PhoneIcon className="h-5 w-5 mr-2" />
                                    {showContactInfo ? vendor.phone || 'No disponible' : 'Ver Teléfono'}
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {selectedServiceForQuote && (
                <QuoteRequestModal
                    isOpen={showQuoteRequestModal}
                    onClose={() => setShowQuoteRequestModal(false)}
                    vendorId={vendor.id}
                    service={selectedServiceForQuote}
                />
            )}
        </div>
    );
};

export default VendorProfilePage;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, limit } from 'firebase/firestore';
import { HomeIcon } from '../components/icons/HomeIcon';
import { StoreIcon } from '../components/icons/StoreIcon';
import { InboxIcon } from '../components/icons/InboxIcon';
import { BriefcaseIcon } from '../components/icons/BriefcaseIcon';
import { SettingsIcon } from '../components/icons/SettingsIcon';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { InvoiceIcon } from '../components/icons/InvoiceIcon';
import { GraduationCapIcon } from '../components/icons/GraduationCapIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { CameraIcon } from '../components/icons/CameraIcon';
import DashboardHome from '../components/vendor/DashboardHome';
import VendorProfile from '../components/vendor/VendorProfile';
import VendorMessages from '../components/vendor/VendorMessages';
import VendorServices from '../components/vendor/VendorServices';
import VendorBilling from '../components/vendor/VendorBilling';
import VendorCampus from '../components/vendor/VendorCampus';
import VendorSettings from '../components/vendor/VendorSettings';
import ServiceModal from '../components/vendor/ServiceModal';
import SeoMeta from '../components/SeoMeta';
import type { Page } from '../types';
import PremiumFeatureLock from '../components/PremiumFeatureLock';

import VendorGallery from '../components/vendor/VendorGallery';

import ServicePublicationPage from './ServicePublicationPage';

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    locations: string[];
}

type VendorPage = 'dashboard' | 'profile' | 'messages' | 'services' | 'billing' | 'campus' | 'settings' | 'gallery' | 'service-publication';

interface VendorDashboardPageProps {
    navigate: (page: Page) => void;
}

const VendorDashboardPage: React.FC<VendorDashboardPageProps> = ({ navigate }) => {
    const { user } = useAuth();
    const [activePage, setActivePage] = useState<VendorPage>('dashboard');
    const [isPremiumUser, setIsPremiumUser] = useState(false);
    const [vendorId, setVendorId] = useState<string | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState<Service | null>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [vendorName, setVendorName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    
        useEffect(() => {
        const fetchVendor = async () => {
            if (!user) return;
            const vendorsQuery = query(collection(db, 'vendors'), where("uid", "==", user.uid), limit(1));
            const vendorSnapshot = await getDocs(vendorsQuery);
            if (!vendorSnapshot.empty) {
                const vendorDoc = vendorSnapshot.docs[0];
                const vendorData = vendorDoc.data();
                setVendorId(vendorDoc.id);
                setIsPremiumUser(vendorData.isPremium || false);
                setVendorName(vendorData.name || '');
                setCompanyName(vendorData.companyName || '');
                setLogoUrl(vendorData.logoUrl || '');
            }
        };
        fetchVendor();
    }, [user]);

    const openModal = (service: Service | null = null) => {
        setCurrentService(service);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentService(null);
    };

    const handleSave = async (serviceData: Omit<Service, 'id'>) => {
        if (!vendorId) return;
        setIsSaving(true);
        const servicesCollectionRef = collection(db, 'vendors', vendorId, 'services');

        try {
            if (currentService) {
                const serviceDocRef = doc(servicesCollectionRef, currentService.id);
                await updateDoc(serviceDocRef, serviceData);
                setServices(services.map(s => s.id === currentService.id ? { id: s.id, ...serviceData } : s));
            } else {
                const newDocRef = await addDoc(servicesCollectionRef, serviceData);
                setServices([...services, { id: newDocRef.id, ...serviceData }]);
            }
            closeModal();
        } catch (error) {
            console.error("Error saving service:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleViewPublication = (serviceId: string) => {
        setSelectedServiceId(serviceId);
        setActivePage('service-publication');
    };

    const menuItems: { id: VendorPage, label: string; icon: React.ReactElement }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
        { id: 'profile', label: 'Mi Perfil', icon: <StoreIcon className="h-5 w-5" /> },
        { id: 'gallery', label: 'Galería', icon: <CameraIcon className="h-5 w-5" /> },
        { id: 'messages', label: 'Mensajes', icon: <InboxIcon className="h-5 w-5" /> },
        { id: 'services', label: 'Servicios', icon: <BriefcaseIcon className="h-5 w-5" /> },
        { id: 'billing', label: 'Facturación', icon: <InvoiceIcon className="h-5 w-5" /> },
        { id: 'campus', label: 'Campus', icon: <GraduationCapIcon className="h-5 w-5" /> },
        { id: 'settings', label: 'Configuración', icon: <SettingsIcon className="h-5 w-5" /> },
    ];

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <DashboardHome isPremiumUser={isPremiumUser} />;
            case 'profile':
                return <VendorProfile />;
            case 'gallery':
                return <VendorGallery />;
            case 'messages':
                return <VendorMessages />;
            case 'services':
                return <VendorServices openModal={openModal} services={services} setServices={setServices} vendorId={vendorId} onViewPublication={handleViewPublication} />;
            case 'billing':
                return <VendorBilling />;
            case 'campus':
                return isPremiumUser ? <VendorCampus /> : <PremiumFeatureLock />;
            case 'settings':
                return <VendorSettings />;
            case 'service-publication':
                return <ServicePublicationPage vendorId={vendorId!} serviceId={selectedServiceId!} onBack={() => setActivePage('services')} />;
            default:
                return <DashboardHome isPremiumUser={isPremiumUser}/>;
        }
    };

    return (
        <div className="bg-brand-light min-h-screen">
             <SeoMeta 
                title="Área de Empresa | Mi Boda Ideal"
                description="Gestiona tu perfil de proveedor, responde a mensajes, actualiza tus servicios y haz crecer tu negocio de bodas con nuestras herramientas para empresas."
            />
            <div className="flex">
                <aside className="w-64 bg-white shadow-md min-h-screen hidden md:flex flex-col">
                    <div className="p-6 text-center">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                        ) : (
                            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                                <StoreIcon className="h-12 w-12 text-gray-400" />
                            </div>
                        )}
                        <h1 className="text-xl font-semibold text-brand-dark">{companyName || 'Mi Empresa'}</h1>
                    </div>
                    <nav className="mt-6">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActivePage(item.id)}
                                className={`w-full flex items-center py-3 px-6 text-brand-dark opacity-80 hover:bg-brand-light hover:text-brand-primary transition-colors duration-200 text-left ${
                                    activePage === item.id ? 'bg-brand-light text-brand-primary opacity-100 border-r-4 border-brand-primary' : ''
                                }`}
                            >
                                {item.icon}
                                <span className="mx-4 font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="mt-auto p-6">
                         <button
                            onClick={() => navigate('home')}
                            className="w-full flex items-center justify-center py-3 px-6 text-brand-dark bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-left"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                            <span className="mx-3 font-semibold">Volver al Sitio Principal</span>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 p-6 md:p-10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-brand-dark">{`Bienvenido de nuevo, ${vendorName.split(' ')[0] || ''}!`}</h2>
                        {activePage === 'services' && (
                            <button onClick={() => openModal()} className="bg-brand-primary hover:bg-brand-accent text-white font-bold py-2 px-4 rounded-full flex items-center transition-transform duration-300 transform hover:scale-105">
                                <PlusCircleIcon className="h-5 w-5 mr-2" />
                                Añadir Servicio
                            </button>
                        )}
                    </div>
                    
                    {renderContent()}

                </main>
            </div>
            {isModalOpen && 
                <ServiceModal 
                    service={currentService} 
                    onClose={closeModal} 
                    onSave={handleSave} 
                    isSaving={isSaving}
                />
            }
        </div>
    );
};

export default VendorDashboardPage;
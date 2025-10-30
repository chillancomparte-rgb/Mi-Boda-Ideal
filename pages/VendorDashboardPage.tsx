import React, { useState } from 'react';
import { HomeIcon } from '../components/icons/HomeIcon';
import { StoreIcon } from '../components/icons/StoreIcon';
import { InboxIcon } from '../components/icons/InboxIcon';
import { BriefcaseIcon } from '../components/icons/BriefcaseIcon';
import { SettingsIcon } from '../components/icons/SettingsIcon';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { InvoiceIcon } from '../components/icons/InvoiceIcon';
import { GraduationCapIcon } from '../components/icons/GraduationCapIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import DashboardHome from '../components/vendor/DashboardHome';
import VendorProfile from '../components/vendor/VendorProfile';
import VendorMessages from '../components/vendor/VendorMessages';
import VendorServices from '../components/vendor/VendorServices';
import VendorBilling from '../components/vendor/VendorBilling';
import VendorCampus from '../components/vendor/VendorCampus';
import VendorSettings from '../components/vendor/VendorSettings';
import SeoMeta from '../components/SeoMeta';
import type { Page } from '../types';

type VendorPage = 'dashboard' | 'profile' | 'messages' | 'services' | 'billing' | 'campus' | 'settings';

interface VendorDashboardPageProps {
    navigate: (page: Page) => void;
}

const VendorDashboardPage: React.FC<VendorDashboardPageProps> = ({ navigate }) => {
    const [activePage, setActivePage] = useState<VendorPage>('dashboard');

    const menuItems: { id: VendorPage, label: string; icon: React.ReactElement }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
        { id: 'profile', label: 'Mi Perfil', icon: <StoreIcon className="h-5 w-5" /> },
        { id: 'messages', label: 'Mensajes', icon: <InboxIcon className="h-5 w-5" /> },
        { id: 'services', label: 'Servicios', icon: <BriefcaseIcon className="h-5 w-5" /> },
        { id: 'billing', label: 'Facturación', icon: <InvoiceIcon className="h-5 w-5" /> },
        { id: 'campus', label: 'Campus', icon: <GraduationCapIcon className="h-5 w-5" /> },
        { id: 'settings', label: 'Configuración', icon: <SettingsIcon className="h-5 w-5" /> },
    ];

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <DashboardHome />;
            case 'profile':
                return <VendorProfile />;
            case 'messages':
                return <VendorMessages />;
            case 'services':
                return <VendorServices />;
            case 'billing':
                return <VendorBilling />;
            case 'campus':
                return <VendorCampus />;
            case 'settings':
                return <VendorSettings />;
            default:
                return <DashboardHome />;
        }
    };

    return (
        <div className="bg-brand-light min-h-screen">
             <SeoMeta 
                title="Área de Empresa | Mi Boda Ideal"
                description="Gestiona tu perfil de proveedor, responde a mensajes, actualiza tus servicios y haz crecer tu negocio de bodas con nuestras herramientas para empresas."
            />
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md min-h-screen hidden md:flex flex-col">
                    <div>
                        <div className="p-6">
                            <h1 className="text-2xl font-serif font-bold text-brand-dark">Área de Empresa</h1>
                            <p className="text-sm text-brand-dark opacity-70">Fotografía "El Lente Mágico"</p>
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
                    </div>
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

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-brand-dark">Bienvenido de nuevo, Carlos!</h2>
                        <button className="bg-brand-primary hover:bg-brand-accent text-white font-bold py-2 px-4 rounded-full flex items-center transition-transform duration-300 transform hover:scale-105">
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            Añadir Servicio
                        </button>
                    </div>
                    
                    {renderContent()}

                </main>
            </div>
        </div>
    );
};

export default VendorDashboardPage;
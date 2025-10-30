import React, { useState, useEffect } from 'react';
import ChecklistTool from '../components/tools/ChecklistTool';
import BudgetTool from '../components/tools/BudgetTool';
import GuestListTool from '../components/tools/GuestListTool';
import { ListIcon } from '../components/icons/ListIcon';
import { DollarIcon } from '../components/icons/DollarIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import SeoMeta from '../components/SeoMeta';
import type { Page, Vendor, WeddingInfo } from '../types';
import { HeartIcon } from '../components/icons/HeartIcon';
import { EyeIcon } from '../components/icons/EyeIcon';
import { MapPinIcon } from '../components/icons/MapPinIcon';
import WeddingInfoForm from '../components/tools/WeddingInfoForm';
import WeddingSummary from '../components/tools/WeddingSummary';
import SuggestionsModal from '../components/modals/SuggestionsModal';

type Tool = 'checklist' | 'budget' | 'guestlist';

const LOCAL_STORAGE_KEY = 'miBodaIdealWeddingInfo';

interface ToolsPageProps {
    favorites: Vendor[];
    visitedVendors: Vendor[];
    onVendorSelect: (vendor: Vendor) => void;
    onToggleFavorite: (vendor: Vendor) => void;
    navigate: (page: Page, data?: any, category?: string) => void;
    region: string | null;
}

const ToolsPage: React.FC<ToolsPageProps> = ({ favorites, visitedVendors, onVendorSelect, onToggleFavorite, navigate, region }) => {
    const [activeTool, setActiveTool] = useState<Tool>('checklist');
    const [weddingInfo, setWeddingInfo] = useState<WeddingInfo | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    useEffect(() => {
        try {
            const savedInfo = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedInfo) {
                setWeddingInfo(JSON.parse(savedInfo));
            } else {
                 const defaultWeddingInfo: WeddingInfo = {
                    userName: 'Novia/o',
                    userRole: 'Novia',
                    partnerName: 'Pareja',
                    partnerRole: 'Novio',
                    commune: 'Tu Comuna',
                    budget: 5000000,
                    guests: 100,
                    services: ["Fotógrafos", "Salones de eventos", "Banquetes"],
                };
                setWeddingInfo(defaultWeddingInfo);
            }
        } catch (error) {
            console.error("Error reading wedding info from localStorage", error);
             const defaultWeddingInfo: WeddingInfo = {
                userName: 'Novia/o',
                userRole: 'Novia',
                partnerName: 'Pareja',
                partnerRole: 'Novio',
                commune: 'Tu Comuna',
                budget: 5000000,
                guests: 100,
                services: ["Fotógrafos", "Salones de eventos", "Banquetes"],
            };
            setWeddingInfo(defaultWeddingInfo);
        }
    }, []);

    const handleSaveWeddingInfo = (info: WeddingInfo) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(info));
        setWeddingInfo(info);
        setIsEditing(false); // Salir del modo de edición
    };

    const handleEditWeddingInfo = () => {
        setIsEditing(true);
    };

    const renderTool = () => {
        switch (activeTool) {
            case 'checklist':
                return <ChecklistTool />;
            case 'budget':
                return <BudgetTool />;
            case 'guestlist':
                return <GuestListTool />;
            default:
                return <ChecklistTool />;
        }
    };

    const toolButtons = [
        { id: 'checklist' as Tool, label: 'Checklist', icon: <ListIcon className="h-5 w-5 mr-2" /> },
        { id: 'budget' as Tool, label: 'Presupuesto', icon: <DollarIcon className="h-5 w-5 mr-2" /> },
        { id: 'guestlist' as Tool, label: 'Invitados', icon: <UsersIcon className="h-5 w-5 mr-2" /> },
    ];
    
    const VendorListItem: React.FC<{ vendor: Vendor; isFavorite?: boolean }> = ({ vendor, isFavorite }) => (
        <div className="flex items-center space-x-4">
            <img 
                src={vendor.imageUrl} 
                alt={vendor.name} 
                className="w-16 h-16 rounded-md object-cover cursor-pointer"
                onClick={() => onVendorSelect(vendor)}
            />
            <div className="flex-1 min-w-0">
                <p 
                    className="text-sm font-bold text-brand-dark truncate cursor-pointer hover:underline"
                    onClick={() => onVendorSelect(vendor)}
                >
                    {vendor.name}
                </p>
                <p className="text-xs text-brand-dark opacity-70 flex items-center">
                    <MapPinIcon className="w-3 h-3 mr-1"/>
                    {vendor.city}
                </p>
            </div>
            {isFavorite !== undefined && (
                 <button onClick={() => onToggleFavorite(vendor)} className="text-gray-400 hover:text-red-500">
                    <HeartIcon className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
                 </button>
            )}
        </div>
    );

    return (
        <div className="bg-brand-light">
             <SeoMeta 
                title="Mi Panel de Boda | Mi Boda Ideal"
                description="Organiza tu boda fácilmente con nuestras herramientas: checklist de tareas, gestor de presupuesto y lista de invitados. Todo lo que necesitas en un solo lugar."
            />

            {/* Hero Section */}
            <section
                className="relative py-20 bg-cover bg-center flex items-center justify-center text-center text-white"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1600&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative z-10 px-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 drop-shadow-md">Mi Panel de Boda</h1>
                    {weddingInfo && <p className="text-xl md:text-2xl">{weddingInfo.userName} & {weddingInfo.partnerName}</p>}
                </div>
            </section>
            
            <div className="container mx-auto px-6 py-12 -mt-16 relative z-20">
                
                {weddingInfo && !isEditing ? (
                    <WeddingSummary 
                        info={weddingInfo}
                        onEdit={handleEditWeddingInfo}
                        onShowSuggestions={() => setIsCategoryModalOpen(true)}
                    />
                ) : (
                    <WeddingInfoForm onSave={handleSaveWeddingInfo} initialInfo={weddingInfo} />
                )}

                {weddingInfo && !isEditing && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                        {/* Main Content: Tools */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                                <div className="flex flex-col sm:flex-row gap-4 border-b border-gray-200 pb-4 mb-6">
                                    {toolButtons.map(button => (
                                        <button
                                            key={button.id}
                                            onClick={() => setActiveTool(button.id)}
                                            className={`flex-1 flex items-center justify-center px-4 py-3 text-left font-semibold rounded-lg transition-all duration-200 text-sm sm:text-base ${
                                                activeTool === button.id
                                                    ? 'bg-brand-primary text-white shadow-md'
                                                    : 'bg-gray-100 text-brand-dark hover:bg-brand-secondary'
                                            }`}
                                        >
                                            {button.icon}
                                            {button.label}
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    {renderTool()}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Favorites & History */}
                        <aside className="space-y-8">
                            {/* Favorites Card */}
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-xl font-serif font-bold text-brand-dark mb-4 flex items-center"><HeartIcon className="h-5 w-5 mr-2 text-brand-primary"/>Proveedores Favoritos</h3>
                                {favorites.length > 0 ? (
                                    <div className="space-y-4">
                                        {favorites.map(vendor => <VendorListItem key={vendor.name} vendor={vendor} isFavorite={true} />)}
                                    </div>
                                ) : (
                                    <p className="text-sm text-brand-dark opacity-70">Aún no tienes favoritos. ¡Explora y guarda los que más te gusten!</p>
                                )}
                            </div>

                            {/* History Card */}
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-xl font-serif font-bold text-brand-dark mb-4 flex items-center"><EyeIcon className="h-5 w-5 mr-2 text-brand-primary"/>Visitados Recientemente</h3>
                                {visitedVendors.length > 0 ? (
                                    <div className="space-y-4">
                                        {visitedVendors.map(vendor => <VendorListItem key={vendor.name} vendor={vendor} />)}
                                    </div>
                                ) : (
                                    <p className="text-sm text-brand-dark opacity-70">Tu historial de visitas aparecerá aquí.</p>
                                )}
                            </div>
                        </aside>
                    </div>
                )}
            </div>
            {weddingInfo && (
                 <SuggestionsModal 
                    isOpen={isCategoryModalOpen}
                    onClose={() => setIsCategoryModalOpen(false)}
                    info={weddingInfo}
                    navigate={navigate}
                 />
            )}
        </div>
    );
};

export default ToolsPage;
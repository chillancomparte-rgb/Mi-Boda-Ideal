import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VendorsPage from './pages/VendorsPage';
import InspirationPage from './pages/InspirationPage';
import InspirationDetailPage from './pages/InspirationDetailPage';
import ToolsPage from './pages/ToolsPage';
import CommunityPage from './pages/CommunityPage';
import VendorDashboardPage from './pages/VendorDashboardPage';
import VendorProfilePage from './pages/VendorProfilePage';
import RegistrationPage from './pages/RegistrationPage';
import ClientRegistrationPage from './pages/ClientRegistrationPage';
import AdminPage from './pages/AdminPage';
import AuthModal from './components/modals/AuthModal';
import RoleSelectionModal from './components/modals/RoleSelectionModal';
import { getVendor } from './services/firebase'; // Importar getVendor de nuestro servicio
import type { Page, Vendor, Inspiration } from './types'; // Eliminar AdminVendor
import { VENDOR_CATEGORIES } from './constants';
import { useAuth } from './hooks/useAuth';
import Spinner from './components/Spinner';
import { getGeneralSettings, initializeDefaultSettings } from './services/configService';
import { GeneralSettings } from './types/config';
import MaintenancePage from './pages/MaintenancePage';
import GeneralAnnouncement from './components/GeneralAnnouncement';
import UserAnnouncement from './components/UserAnnouncement';


const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [selectedInspiration, setSelectedInpiration] = useState<Inspiration | null>(null);
    const [currentCategory, setCurrentCategory] = useState<string>('');
    const [persistentRegion, setPersistentRegion] = useState<string | null>(null);
    const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null);
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [showGeneralAnnouncement, setShowGeneralAnnouncement] = useState(true);
    const [showUserAnnouncement, setShowUserAnnouncement] = useState(true);
    const [showRoleSelectionModal, setShowRoleSelectionModal] = useState(false);

    const [authModalState, setAuthModalState] = useState({ isOpen: false, view: 'login' as 'login' | 'signup' });

    const { user, loading: authLoading } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isVendor = user?.role === 'vendor';
    const isCouple = user?.role === 'user';

    const navigate = useCallback((page: Page, data?: Vendor | Inspiration, category?: string) => { // Eliminar AdminVendor del tipo de data
        let path = '/';
        if (page === 'vendor-profile' && data && 'name' in data) { // 'name' es una propiedad común de Vendor
            setSelectedVendor(data as Vendor); // Asegurarse de que sea tipo Vendor
            setSelectedInpiration(null);
            path = `/vendor/${data.id}`;
        } else if (page === 'inspiration-detail' && data && 'imageSearchTerms' in data) {
            setSelectedInpiration(data as Inspiration);
            setSelectedVendor(null);
            path = `/inspiration/${data.id}`;
        } else if (page === 'admin') {
            path = '/admin';
        } else if (page === 'vendorDashboard') {
            path = '/vendor-dashboard';
        } else if (page === 'tools') {
            path = '/tools';
        } else if (page === 'registration') {
            path = '/register-vendor';
        } else if (page === 'client-registration') {
            path = '/register-client';
        } else if (page === 'home') {
            path = '/';
        } else {
            path = `/${page}`;
        }

        window.history.pushState({ page, data, category }, '', path);
        setCurrentCategory(category || '');
        setCurrentPage(page);
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchSettingsAndInitialize = async () => {
            await initializeDefaultSettings();
            const settings = await getGeneralSettings();
            setGeneralSettings(settings);
            setSettingsLoading(false);
        };
        fetchSettingsAndInitialize();

        const handlePopState = (event: PopStateEvent) => {
            if (event.state) {
                setCurrentPage(event.state.page);
                setSelectedVendor(event.state.data && 'name' in event.state.data ? event.state.data : null); // Usar 'name' para verificar Vendor
                setSelectedInpiration(event.state.data && 'imageSearchTerms' in event.state.data ? event.state.data : null);
                setCurrentCategory(event.state.category || '');
            } else {
                // Fallback if state is null (e.g., initial load or external navigation)
                const path = window.location.pathname;
                if (path.startsWith('/vendor/')) {
                    const vendorId = path.split('/')[2];
                    const fetchVendor = async () => {
                        try {
                            const vendorData = await getVendor(vendorId); // Usar la función getVendor
                            if (vendorData) {
                                setSelectedVendor(vendorData);
                                setCurrentPage('vendor-profile');
                            } else {
                                setCurrentPage('home');
                            }
                        } catch (error) {
                            console.error("Error fetching vendor from URL: ", error);
                            setCurrentPage('home');
                        }
                    };
                    fetchVendor();
                } else if (path.startsWith('/inspiration/')) {
                    // Similar logic for inspiration detail if needed
                    setCurrentPage('inspiration'); // Fallback for now
                } else if (path === '/admin') {
                    setCurrentPage('admin');
                } else if (path === '/vendor-dashboard') {
                    setCurrentPage('vendorDashboard');
                } else if (path === '/tools') {
                    setCurrentPage('tools');
                } else if (path === '/register-vendor') {
                    setCurrentPage('registration');
                } else if (path === '/register-client') {
                    setCurrentPage('client-registration');
                } else {
                    setCurrentPage('home');
                }
            }
        };

        window.addEventListener('popstate', handlePopState);

        // Initial load check
        if (window.history.state) {
            handlePopState({ state: window.history.state } as PopStateEvent);
        } else {
            handlePopState({ state: null } as PopStateEvent);
        }

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    const openAuthModal = (view: 'login' | 'signup') => {
        setAuthModalState({ isOpen: true, view });
    };
    const closeAuthModal = () => {
        setAuthModalState({ isOpen: false, view: 'login' });
    };

    const handleSignupClick = () => {
        setShowRoleSelectionModal(true); // Abrir el modal de selección de rol
    };
    const closeRoleSelectionModal = () => {
        setShowRoleSelectionModal(false);
    };

    const [favorites, setFavorites] = useState<Vendor[]>(() => {
        try {
            const savedFavorites = localStorage.getItem('miBodaIdealFavorites');
            return savedFavorites ? JSON.parse(savedFavorites) : [];
        } catch (error) {
            return [];
        }
    });

    const [visitedVendors, setVisitedVendors] = useState<Vendor[]>(() => {
        try {
            const savedVisited = localStorage.getItem('miBodaIdealVisited');
            return savedVisited ? JSON.parse(savedVisited) : [];
        } catch (error) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('miBodaIdealFavorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('miBodaIdealVisited', JSON.stringify(visitedVendors));
    }, [visitedVendors]);

    useEffect(() => {
        const savedRegion = localStorage.getItem('miBodaIdealRegion');
        if (savedRegion) {
            setPersistentRegion(savedRegion);
        }
    }, []);

    const handleRegionSelect = (region: string) => {
        setPersistentRegion(region);
        localStorage.setItem('miBodaIdealRegion', region);
    };

    const toggleFavorite = (vendor: Vendor) => {
        setFavorites(prev => {
            const isFavorited = prev.some(v => v.id === vendor.id); // Usar vendor.id para comparar
            if (isFavorited) {
                return prev.filter(v => v.id !== vendor.id);
            } else {
                return [...prev, vendor];
            }
        });
    };

    const handleVendorSelect = (vendor: Vendor) => {
        setVisitedVendors(prev => {
            const newHistory = [vendor, ...prev.filter(v => v.id !== vendor.id)]; // Usar vendor.id para comparar
            return newHistory.slice(0, 10);
        });
        navigate('vendor-profile', vendor);
    };

    const handleInspirationSelect = (item: Inspiration) => {
        navigate('inspiration-detail', item);
    };

    // --- RENDER LOGIC ---

    // 1. Master Loading State: Wait for authentication and settings to resolve.
    if (authLoading || settingsLoading) {
        return <div className="flex min-h-screen items-center justify-center"><Spinner /></div>;
    }

    // 2. Maintenance Mode Check
    if (generalSettings?.maintenanceMode && !isAdmin) {
        return <MaintenancePage />;
    }

    // 3. Page Component Selection with Route Protection
    let pageComponent;

    // A small component to render while we trigger a safe redirection.
    const Redirecting: React.FC = () => {
        useEffect(() => {
            navigate('home');
        }, [navigate]);
        return <div className="flex min-h-screen items-center justify-center"><Spinner /></div>;
    };

    const isVendorSubPage = VENDOR_CATEGORIES.map(c => c.toLowerCase().replace(/ y | & /g, '-').replace(/ /g, '-')).includes(currentPage);
    const vendorPageProps = {
        onVendorSelect: handleVendorSelect,
        initialCategory: currentCategory,
        initialRegion: persistentRegion,
        onRegionSelect: handleRegionSelect,
        favorites: favorites,
        onToggleFavorite: toggleFavorite,
    };

    if (isVendorSubPage) {
        pageComponent = <VendorsPage key={currentPage} {...vendorPageProps} />;
    } else {
        switch (currentPage) {
            case 'home':
                pageComponent = <HomePage navigate={navigate} />;
                break;
            case 'admin':
                pageComponent = isAdmin ? <AdminPage navigate={navigate} /> : <Redirecting />;
                break;
            case 'vendorDashboard':
                pageComponent = (isVendor || isAdmin) ? <VendorDashboardPage navigate={navigate} /> : <Redirecting />;
                break;
            case 'tools':
                pageComponent = (isCouple || isAdmin) ? <ToolsPage favorites={favorites} visitedVendors={visitedVendors} onVendorSelect={handleVendorSelect} onToggleFavorite={toggleFavorite} navigate={navigate} region={persistentRegion} /> : <Redirecting />;
                break;
            case 'vendors':
                pageComponent = <VendorsPage {...vendorPageProps} />;
                break;
            case 'inspiration':
                pageComponent = <InspirationPage onInspirationSelect={handleInspirationSelect} />;
                break;
            case 'inspiration-detail':
                pageComponent = selectedInspiration ? <InspirationDetailPage item={selectedInspiration} onBack={() => navigate('inspiration')} /> : <Redirecting />;
                break;
            case 'community':
                pageComponent = <CommunityPage />;
                break;
            case 'vendor-profile':
                // Pasar vendorId en lugar del objeto vendor completo
                pageComponent = selectedVendor ? <VendorProfilePage vendorId={selectedVendor.id} onBack={() => navigate('vendors', undefined, currentCategory)} /> : <Redirecting />;
                break;
            case 'registration':
                pageComponent = <RegistrationPage navigate={navigate} />;
                break;
            case 'client-registration':
                pageComponent = <ClientRegistrationPage navigate={navigate} />;
                break;
            default:
                pageComponent = <HomePage navigate={navigate} />;
                break;
        }
    }


    // 4. Render the chosen component within the correct layout
    if (currentPage === 'admin' && isAdmin) {
        // Admin page has its own full-screen layout
        return pageComponent;
    }

    // Standard layout for all other pages
    return (
        <div className="flex flex-col min-h-screen bg-brand-light font-sans">
            {generalSettings?.generalAnnouncement && showGeneralAnnouncement && (
                <GeneralAnnouncement message={generalSettings.generalAnnouncement} onClose={() => setShowGeneralAnnouncement(false)} />
            )}
            {generalSettings && (generalSettings.vendorAnnouncement || generalSettings.clientAnnouncement) && showUserAnnouncement && (
                <UserAnnouncement
                    vendorMessage={generalSettings.vendorAnnouncement}
                    clientMessage={generalSettings.clientAnnouncement}
                    onClose={() => setShowUserAnnouncement(false)}
                />
            )}
            <Header navigate={navigate} currentPage={currentPage} onLoginClick={() => openAuthModal('login')} onSignupClick={handleSignupClick}/>
            <main className="flex-grow">
                {pageComponent}
            </main>
            <Footer navigate={navigate} />
            <AuthModal isOpen={authModalState.isOpen} onClose={closeAuthModal} initialView={authModalState.view} />
            <RoleSelectionModal isOpen={showRoleSelectionModal} onClose={closeRoleSelectionModal} navigate={navigate} />
        </div>
    );
};

export default App;
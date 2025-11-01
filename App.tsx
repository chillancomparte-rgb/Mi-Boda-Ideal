import React, { useState, useEffect } from 'react';
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
import AdminPage from './pages/AdminPage';
import AuthModal from './components/modals/AuthModal'; // Importar el modal
import type { Page, Vendor, Inspiration } from './types';
import { VENDOR_CATEGORIES } from './constants';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [selectedInspiration, setSelectedInspiration] = useState<Inspiration | null>(null);
    const [currentCategory, setCurrentCategory] = useState<string>('');
    const [persistentRegion, setPersistentRegion] = useState<string | null>(null);
    
    // Auth Modal State
    const [authModalState, setAuthModalState] = useState({ isOpen: false, view: 'login' as 'login' | 'signup' });

    const openAuthModal = (view: 'login' | 'signup') => {
        setAuthModalState({ isOpen: true, view });
    };
    const closeAuthModal = () => {
        setAuthModalState({ isOpen: false, view: 'login' });
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
            const isFavorited = prev.some(v => v.name === vendor.name);
            if (isFavorited) {
                return prev.filter(v => v.name !== vendor.name);
            } else {
                return [...prev, vendor];
            }
        });
    };

    const navigate = (page: Page, data?: Vendor | Inspiration, category?: string) => {
        if (page === 'vendor-profile' && data && 'startingPrice' in data) {
            setSelectedVendor(data);
            setSelectedInspiration(null);
        } else if (page === 'inspiration-detail' && data && 'imageSearchTerms' in data) {
            setSelectedInspiration(data);
            setSelectedVendor(null);
        } else {
            setSelectedVendor(null);
            setSelectedInspiration(null);
        }

        setCurrentCategory(category || '');
        
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleVendorSelect = (vendor: Vendor) => {
        setVisitedVendors(prev => {
            const newHistory = [vendor, ...prev.filter(v => v.name !== vendor.name)];
            return newHistory.slice(0, 10); // Keep last 10 visited
        });
        navigate('vendor-profile', vendor);
    };

    const handleInspirationSelect = (item: Inspiration) => {
        navigate('inspiration-detail', item);
    };

    const renderPage = () => {
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
            return <VendorsPage key={currentPage} {...vendorPageProps} />;
        }

        switch (currentPage) {
            case 'home':
                return <HomePage navigate={navigate} />;
            case 'vendors':
                return <VendorsPage {...vendorPageProps} />;
            case 'inspiration':
                return <InspirationPage onInspirationSelect={handleInspirationSelect} />;
            case 'inspiration-detail':
                return selectedInspiration ? <InspirationDetailPage item={selectedInspiration} onBack={() => navigate('inspiration')} /> : <InspirationPage onInspirationSelect={handleInspirationSelect}/>;
            case 'tools':
                return <ToolsPage 
                            favorites={favorites} 
                            visitedVendors={visitedVendors} 
                            onVendorSelect={handleVendorSelect}
                            onToggleFavorite={toggleFavorite}
                            navigate={navigate}
                            region={persistentRegion}
                        />;
            case 'community':
                return <CommunityPage />;
            case 'vendor-profile':
                return selectedVendor ? <VendorProfilePage vendor={selectedVendor} onBack={() => navigate('vendors', undefined, currentCategory)} favorites={favorites} onToggleFavorite={toggleFavorite} onVendorSelect={handleVendorSelect} /> : <VendorsPage {...vendorPageProps} />;
            case 'registration': // This is now for vendors only
                return <RegistrationPage navigate={navigate} />;
            default:
                return <HomePage navigate={navigate} />;
        }
    };
    
    // El panel de proveedor y de admin tienen su propio layout.
    if (currentPage === 'vendorDashboard') {
        return <VendorDashboardPage navigate={navigate} />;
    }
    if (currentPage === 'admin') {
        return <AdminPage navigate={navigate} />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-brand-light font-sans">
            <Header navigate={navigate} currentPage={currentPage} onLoginClick={() => openAuthModal('login')} onSignupClick={() => openAuthModal('signup')}/>
            <main className="flex-grow">
                {renderPage()}
            </main>
            <Footer />
            <AuthModal 
                isOpen={authModalState.isOpen}
                onClose={closeAuthModal}
                initialView={authModalState.view}
            />
        </div>
    );
};

export default App;
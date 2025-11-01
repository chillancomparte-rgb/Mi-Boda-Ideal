

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
import AdminPage from './pages/AdminPage';
import AuthModal from './components/modals/AuthModal';
import type { Page, Vendor, Inspiration } from './types';
import { VENDOR_CATEGORIES } from './constants';
import { useAuth } from './hooks/useAuth';
import Spinner from './components/Spinner';


const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [selectedInspiration, setSelectedInspiration] = useState<Inspiration | null>(null);
    const [currentCategory, setCurrentCategory] = useState<string>('');
    const [persistentRegion, setPersistentRegion] = useState<string | null>(null);
    
    const [authModalState, setAuthModalState] = useState({ isOpen: false, view: 'login' as 'login' | 'signup' });

    const { user, loading: authLoading } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isVendor = user?.role === 'vendor';
    const isCouple = user?.role === 'user';

    const navigate = useCallback((page: Page, data?: Vendor | Inspiration, category?: string) => {
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
    }, []);

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

    const handleVendorSelect = (vendor: Vendor) => {
        setVisitedVendors(prev => {
            const newHistory = [vendor, ...prev.filter(v => v.name !== vendor.name)];
            return newHistory.slice(0, 10);
        });
        navigate('vendor-profile', vendor);
    };

    const handleInspirationSelect = (item: Inspiration) => {
        navigate('inspiration-detail', item);
    };
    
    // --- RENDER LOGIC ---

    // 1. Master Loading State: Wait for authentication to resolve.
    if (authLoading) {
        return <div className="flex min-h-screen items-center justify-center"><Spinner /></div>;
    }

    // 2. Page Component Selection with Route Protection
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
                pageComponent = selectedVendor ? <VendorProfilePage vendor={selectedVendor} onBack={() => navigate('vendors', undefined, currentCategory)} favorites={favorites} onToggleFavorite={toggleFavorite} onVendorSelect={handleVendorSelect} /> : <Redirecting />;
                break;
            case 'registration':
                pageComponent = <RegistrationPage navigate={navigate} />;
                break;
            default:
                pageComponent = <HomePage navigate={navigate} />;
                break;
        }
    }


    // 3. Render the chosen component within the correct layout
    if (currentPage === 'admin' && isAdmin) {
        // Admin page has its own full-screen layout
        return pageComponent;
    }
    
    // Standard layout for all other pages
    return (
        <div className="flex flex-col min-h-screen bg-brand-light font-sans">
            <Header navigate={navigate} currentPage={currentPage} onLoginClick={() => openAuthModal('login')} onSignupClick={() => openAuthModal('signup')}/>
            <main className="flex-grow">
                {pageComponent}
            </main>
            <Footer navigate={navigate} />
            <AuthModal isOpen={authModalState.isOpen} onClose={closeAuthModal} initialView={authModalState.view} />
        </div>
    );
};

export default App;
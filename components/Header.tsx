import React from 'react';
import type { Page } from '../types';
import { useAuth } from '../hooks/useAuth';
import { WeddingRingIcon } from './icons/WeddingRingIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { VENDOR_CATEGORIES } from '../constants';
import { HeartIcon } from './icons/HeartIcon';
import { UserIcon } from './icons/UserIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import Spinner from './Spinner';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { ListIcon } from './icons/ListIcon';

interface HeaderProps {
    navigate: (page: Page, vendor?: any, category?: string) => void;
    currentPage: Page;
    onLoginClick: () => void;
    onSignupClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ navigate, currentPage, onLoginClick, onSignupClick }) => {
    const { user, loading, logOut } = useAuth();

    const handleLogout = async () => {
        await logOut();
        navigate('home');
    };

    const categoryToPage = (category: string): Page => {
        return category.toLowerCase().replace(/ y | & /g, '-').replace(/ /g, '-') as Page;
    }

    const navLinks = [
        {
            label: 'Proveedores',
            page: 'vendors' as Page,
            dropdown: VENDOR_CATEGORIES.map(cat => ({ label: cat, page: categoryToPage(cat) }))
        },
        {
            label: 'Novia',
            page: 'inspiration' as Page,
            dropdown: [
                { label: 'Vestidos de Novia', page: 'bride-dresses' as Page },
                { label: 'Accesorios', page: 'bride-accessories' as Page },
                { label: 'Zapatos de Novia', page: 'bride-shoes' as Page },
                { label: 'Belleza y Maquillaje', page: 'beauty-makeup' as Page },
                { label: 'Lencería', page: 'lingerie' as Page },
            ]
        },
        {
            label: 'Novio',
            page: 'groom-inspiration' as Page,
            dropdown: [
                { label: 'Trajes de Novio', page: 'groom-suits' as Page },
            ]
        },
        {
            label: 'Inspiración',
            page: 'inspiration' as Page,
        },
        {
            label: 'Herramientas',
            page: 'tools' as Page,
        },
        {
            label: 'Comunidad',
            page: 'community' as Page,
        }
    ];

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => navigate('home')}
                >
                    <WeddingRingIcon className="h-8 w-8 text-brand-primary" />
                    <span className="ml-2 text-2xl font-serif font-bold text-brand-dark">Mi Boda Ideal</span>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map(link => (
                        <div key={link.label} className="group relative">
                            <button
                                onClick={() => navigate(link.page, undefined, link.dropdown ? link.dropdown[0].label : undefined)}
                                className={`flex items-center text-base font-medium transition-colors duration-300 pb-2 ${currentPage === link.page || link.dropdown?.some(d => d.page === currentPage) ? 'text-brand-primary' : 'text-brand-dark hover:text-brand-primary'
                                    }`}
                            >
                                {link.label}
                                {link.dropdown && <ChevronDownIcon className="h-4 w-4 ml-1" />}
                            </button>
                            {link.dropdown && (
                                <div className="absolute left-0 pt-2 w-64 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-10">
                                    <div className="py-2 bg-white rounded-md shadow-lg">
                                        {link.dropdown.map(item => (
                                            <a
                                                key={item.label}
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); navigate(item.page, undefined, item.label); }}
                                                className="block px-4 py-2 text-sm text-brand-dark hover:bg-brand-light hover:text-brand-primary"
                                            >
                                                {item.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
                <div className="hidden md:flex items-center space-x-6">
                     <button className="text-brand-dark hover:text-brand-primary" title="Mis Favoritos">
                        <HeartIcon className="h-6 w-6" />
                    </button>
                    <div className="group relative">
                        <button
                            className="text-brand-dark hover:text-brand-primary font-semibold py-2 px-4 rounded-full text-sm transition-colors flex items-center border border-transparent hover:bg-gray-50"
                        >
                            <UserIcon className="h-5 w-5 mr-2" />
                            {loading ? '...' : (user ? 'Hola!' : 'Mi Cuenta')}
                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                        </button>
                        <div className="absolute right-0 pt-2 w-60 bg-white rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-10">
                             {loading ? (
                                <div className="p-4"><Spinner /></div>
                            ) : user ? (
                                <div className="py-2 bg-white rounded-md">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-bold text-brand-dark truncate">{user.email}</p>
                                    </div>
                                    {user.role === 'user' && (
                                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('tools'); }} className="block w-full text-left px-4 py-2 text-sm text-brand-dark hover:bg-brand-secondary hover:text-brand-primary">
                                            Mi Panel de Boda
                                        </a>
                                    )}
                                    {user.role === 'vendor' && (
                                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('vendorDashboard'); }} className="block w-full text-left px-4 py-2 text-sm text-brand-dark hover:bg-brand-secondary hover:text-brand-primary">
                                            Panel de Proveedor
                                        </a>
                                    )}
                                     {user.role === 'admin' && (
                                        <>
                                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('admin'); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-brand-dark hover:bg-brand-secondary hover:text-brand-primary">
                                                <ShieldIcon className="h-4 w-4 mr-2" />
                                                Panel de Administrador
                                            </a>
                                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('tools'); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-brand-dark hover:bg-brand-secondary hover:text-brand-primary">
                                                <ListIcon className="h-4 w-4 mr-2" />
                                                Panel de Boda (Cliente)
                                            </a>
                                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('vendorDashboard'); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-brand-dark hover:bg-brand-secondary hover:text-brand-primary">
                                                <BriefcaseIcon className="h-4 w-4 mr-2" />
                                                Panel de Proveedor
                                            </a>
                                        </>
                                    )}
                                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700">
                                        <LogoutIcon className="h-4 w-4 mr-2" />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            ) : (
                                <div className="py-2 bg-white rounded-md">
                                    <div className="px-4 py-2">
                                        <p className="text-sm font-bold text-brand-dark">Parejas</p>
                                        <p className="text-xs text-brand-dark opacity-70">Planifica tu boda soñada</p>
                                    </div>
                                    <button onClick={onLoginClick} className="block w-full text-left px-4 py-2 text-sm text-brand-dark hover:bg-brand-secondary hover:text-brand-primary">
                                        Iniciar Sesión
                                    </button>
                                    <div className="border-t my-2 mx-4"></div>
                                    <div className="px-4 py-2">
                                        <p className="text-sm font-bold text-brand-dark">Proveedores</p>
                                        <p className="text-xs text-brand-dark opacity-70">Gestiona tu negocio</p>
                                    </div>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="block w-full text-left px-4 py-2 text-sm text-brand-dark hover:bg-brand-secondary hover:text-brand-primary">
                                        Acceder a mi Panel
                                    </a>
                                    <div className="px-4 pt-2 pb-1">
                                        <button onClick={onSignupClick} className="block w-full text-center bg-brand-primary text-white py-2 text-sm font-bold rounded-md hover:bg-brand-accent transition-colors">
                                            Regístrate gratis
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
import React from 'react';
import type { Page } from '../../types';
import { WeddingRingIcon } from '../icons/WeddingRingIcon';
import { DashboardIcon } from '../icons/DashboardIcon';
import { StoreIcon } from '../icons/StoreIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { FileTextIcon } from '../icons/FileTextIcon';
import { ImageIcon } from '../icons/ImageIcon';

type AdminView = 'dashboard' | 'providers' | 'users' | 'content' | 'hero-slider';

interface AdminSidebarProps {
    currentView: AdminView;
    setCurrentView: (view: AdminView) => void;
    navigate: (page: Page) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, setCurrentView, navigate }) => {
    
    const navItems = [
        { id: 'dashboard' as AdminView, label: 'Dashboard', icon: <DashboardIcon className="h-5 w-5" /> },
        { id: 'providers' as AdminView, label: 'Proveedores', icon: <StoreIcon className="h-5 w-5" /> },
        { id: 'users' as AdminView, label: 'Usuarios', icon: <UsersIcon className="h-5 w-5" /> },
        { id: 'content' as AdminView, label: 'Contenido', icon: <FileTextIcon className="h-5 w-5" /> },
        { id: 'hero-slider' as AdminView, label: 'Hero Principal', icon: <ImageIcon className="h-5 w-5" /> },
    ];

    return (
        <aside className="w-64 bg-white text-gray-800 flex flex-col shadow-lg">
            <div className="h-16 flex items-center justify-center border-b">
                <WeddingRingIcon className="h-8 w-8 text-brand-primary" />
                <span className="ml-2 text-xl font-serif font-bold text-brand-dark">Admin Panel</span>
            </div>
            <nav className="flex-1 px-4 py-4">
                <ul>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => setCurrentView(item.id)}
                                className={`w-full flex items-center px-4 py-2 my-1 rounded-lg transition-colors duration-200 ${
                                    currentView === item.id 
                                    ? 'bg-brand-primary text-white shadow' 
                                    : 'hover:bg-brand-light hover:text-brand-primary'
                                }`}
                            >
                                {item.icon}
                                <span className="ml-3 font-medium">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t">
                <button
                    onClick={() => navigate('home')}
                    className="w-full flex items-center justify-center py-2 px-4 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Volver al Sitio
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
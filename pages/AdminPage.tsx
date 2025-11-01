import React, { useState } from 'react';
import type { Page } from '../types';
import SeoMeta from '../components/SeoMeta';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProviders from '../components/admin/AdminProviders';
import AdminUsers from '../components/admin/AdminUsers';
import AdminHeader from '../components/admin/AdminHeader';
import AdminContent from '../components/admin/AdminContent';

type AdminView = 'dashboard' | 'providers' | 'users' | 'content';

interface AdminPageProps {
    navigate: (page: Page) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ navigate }) => {
    const [currentView, setCurrentView] = useState<AdminView>('dashboard');

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'providers':
                return <AdminProviders />;
            case 'users':
                return <AdminUsers />;
            case 'content':
                return <AdminContent />;
            default:
                return <AdminDashboard />;
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
             <SeoMeta 
                title="Panel de Administrador | Mi Boda Ideal"
                description="Gestión centralizada de la plataforma Mi Boda Ideal. Controle usuarios, proveedores y contenido."
            />
            <AdminSidebar currentView={currentView} setCurrentView={setCurrentView} navigate={navigate} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
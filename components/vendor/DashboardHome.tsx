import React from 'react';
import { EyeIcon } from '../icons/EyeIcon';
import { MessageSquareIcon } from '../icons/MessageSquareIcon';
import { InboxIcon } from '../icons/InboxIcon';
import { InfoIcon } from '../icons/InfoIcon';
import PremiumFeatureLock from '../PremiumFeatureLock';

const DashboardHome: React.FC = () => {
    const stats = [
        { label: 'Visitas al Perfil (30d)', value: '1,280', icon: <EyeIcon className="h-8 w-8 text-blue-500" />, trend: '+15%' },
        { label: 'Nuevos Mensajes (7d)', value: '24', icon: <MessageSquareIcon className="h-8 w-8 text-green-500" />, trend: '+5%' },
        { label: 'Solicitudes de Presupuesto', value: '8', icon: <InboxIcon className="h-8 w-8 text-yellow-500" />, trend: '-2%' },
        { label: 'Tasa de Conversión', value: '12.5%', icon: <InfoIcon className="h-8 w-8 text-purple-500" />, trend: '+1.2%' },
    ];

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-dark opacity-70">{stat.label}</p>
                            <p className="text-3xl font-bold text-brand-dark">{stat.value}</p>
                            <p className={`text-sm font-semibold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{stat.trend}</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full">
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Premium Features section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-brand-dark mb-4">Actividad Reciente</h3>
                    {/* Placeholder for activity feed */}
                    <p className="text-brand-dark opacity-80">No hay actividad reciente.</p>
                </div>
                <div className="lg:col-span-1">
                     <PremiumFeatureLock />
                </div>
            </div>
        </>
    );
};

export default DashboardHome;
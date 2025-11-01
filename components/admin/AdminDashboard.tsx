import React from 'react';
import KpiCard from './KpiCard';
import { UsersIcon } from '../icons/UsersIcon';
import { StoreIcon } from '../icons/StoreIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { DollarIcon } from '../icons/DollarIcon';

const recentActivities = [
    { type: 'vendor', name: 'Fotografía "El Lente Mágico"', time: 'hace 2 horas' },
    { type: 'user', name: 'Laura Jiménez', time: 'hace 5 horas' },
    { type: 'vendor', name: 'Casona de Eventos La Reina', time: 'hace 1 día' },
    { type: 'user', name: 'Carlos Soto', time: 'hace 2 días' },
    { type: 'user', name: 'Ana Morales', time: 'hace 2 días' },
];

const AdminDashboard: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="Total Usuarios" value="1,452" icon={<UsersIcon />} trend="+12.5%" trendDirection="up" />
                <KpiCard title="Total Proveedores" value="387" icon={<StoreIcon />} trend="+5.2%" trendDirection="up" />
                <KpiCard title="Nuevos Registros (Mes)" value="98" icon={<PlusCircleIcon />} trend="-2.1%" trendDirection="down" />
                <KpiCard title="Ingresos (Mes)" value="$8,540,000" icon={<DollarIcon />} trend="+20.1%" trendDirection="up" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Recent Activity */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Actividad Reciente</h2>
                    <ul className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <li key={index} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${activity.type === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                    {activity.type === 'user' ? <UsersIcon className="h-5 w-5"/> : <StoreIcon className="h-5 w-5"/>}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{activity.name} se ha registrado.</p>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Placeholder for Charts */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Crecimiento de Usuarios</h2>
                    <div className="h-80 bg-gray-200 rounded-md flex items-center justify-center">
                        <p className="text-gray-500">Gráfico de líneas próximamente</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
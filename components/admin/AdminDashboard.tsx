import React, { useState, useEffect } from 'react';
import KpiCard from './KpiCard';
import { UsersIcon } from '../icons/UsersIcon';
import { StoreIcon } from '../icons/StoreIcon';
import { DollarIcon } from '../icons/DollarIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { db } from '../../services/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import type { AdminUser, AdminVendor } from '../../types';
import Spinner from '../Spinner';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        users: 0,
        vendors: 0,
        pendingVendors: 0,
    });
    const [recentActivity, setRecentActivity] = useState<(AdminUser | AdminVendor)[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch stats
                const usersCollection = collection(db, 'users');
                const vendorsCollection = collection(db, 'vendors');

                const usersSnapshot = await getDocs(usersCollection);
                const vendorsSnapshot = await getDocs(vendorsCollection);

                const allVendors = vendorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AdminVendor[];
                const pendingCount = allVendors.filter(v => v.status === 'Pendiente').length;

                setStats({
                    users: usersSnapshot.size,
                    vendors: vendorsSnapshot.size,
                    pendingVendors: pendingCount,
                });

                // Fetch recent activity
                const recentUsersQuery = query(usersCollection, orderBy('registeredDate', 'desc'), limit(3));
                const recentVendorsQuery = query(vendorsCollection, orderBy('registeredDate', 'desc'), limit(3));

                const recentUsersSnapshot = await getDocs(recentUsersQuery);
                const recentVendorsSnapshot = await getDocs(recentVendorsQuery);

                const recentUsers = recentUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'user' })) as (AdminUser & {type: 'user'})[];
                const recentVendors = recentVendorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'vendor' })) as (AdminVendor & {type: 'vendor'})[];
                
                const combinedActivity = [...recentUsers, ...recentVendors]
                    .sort((a, b) => new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime())
                    .slice(0, 5);

                setRecentActivity(combinedActivity);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const kpis = [
        { title: "Total Usuarios", value: stats.users.toString(), icon: <UsersIcon />, trend: "", trendDirection: 'up' as const },
        { title: "Total Proveedores", value: stats.vendors.toString(), icon: <StoreIcon />, trend: "", trendDirection: 'up' as const },
        { title: "Ingresos (Mes)", value: "$0", icon: <DollarIcon />, trend: "N/A", trendDirection: 'down' as const },
        { title: "Proveedores Pendientes", value: stats.pendingVendors.toString(), icon: <CheckCircleIcon />, trend: "", trendDirection: 'up' as const }
    ];

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard General</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpis.map(kpi => (
                    <KpiCard 
                        key={kpi.title}
                        title={kpi.title}
                        value={kpi.value}
                        icon={kpi.icon}
                        trend={kpi.trend}
                        trendDirection={kpi.trendDirection}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Actividad Reciente</h2>
                    {recentActivity.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {recentActivity.map(activity => (
                                <li key={activity.id} className="py-3 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        {'status' in activity
                                            ? `Nuevo proveedor "${activity.name}" se ha registrado.`
                                            : `Nuevo usuario "${activity.name}" se ha registrado.`
                                        }
                                    </p>
                                     <span className="text-xs text-gray-400">{new Date(activity.registeredDate).toLocaleDateString()}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No hay actividad reciente.</p>
                    )}
                </div>
                 <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Acciones Rápidas</h2>
                    <div className="space-y-3">
                        <button className="w-full text-left bg-brand-light hover:bg-brand-secondary text-brand-dark font-medium py-2 px-4 rounded-lg">Aprobar Proveedores</button>
                        <button className="w-full text-left bg-brand-light hover:bg-brand-secondary text-brand-dark font-medium py-2 px-4 rounded-lg">Ver Reportes</button>
                        <button className="w-full text-left bg-brand-light hover:bg-brand-secondary text-brand-dark font-medium py-2 px-4 rounded-lg">Enviar Notificación</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
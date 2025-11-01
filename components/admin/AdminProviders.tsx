import React, { useState, useMemo, useEffect } from 'react';
import type { AdminVendor, VendorStatus } from '../../types';
import { SearchIcon } from '../icons/SearchIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import { CrownIcon } from '../icons/CrownIcon';
import Spinner from '../Spinner';
// MOCK DATA - Reemplazar con la llamada a Firebase cuando esté conectada
const MOCK_ADMIN_VENDORS: AdminVendor[] = [
    { id: 'v001', name: 'Momentos Inolvidables Fotografía', category: 'Fotógrafos', location: 'Metropolitana de Santiago', email: 'contacto@momentos.cl', registeredDate: '2024-03-15', status: 'Aprobado', isPremium: false },
    { id: 'v002', name: 'Casona de Eventos La Reina', category: 'Salones de eventos', location: 'Metropolitana de Santiago', email: 'eventos@casonalareina.com', registeredDate: '2024-03-12', status: 'Aprobado', isPremium: true },
    { id: 'v003', name: 'Fiesta Total DJ', category: 'Música y DJ', location: 'Metropolitana de Santiago', email: 'dj@fiestatotal.cl', registeredDate: '2024-04-01', status: 'Pendiente', isPremium: false },
    { id: 'v004', name: 'Gastronomía de Reyes', category: 'Banquetes', location: 'Metropolitana de Santiago', email: 'contacto@reyes.cl', registeredDate: '2024-02-20', status: 'Aprobado', isPremium: true },
    { id: 'v005', name: 'Flores del Jardín Secreto', category: 'Floristerías', location: 'Valparaíso', email: 'flores@jardinsecreto.cl', registeredDate: '2024-04-05', status: 'Pendiente', isPremium: false },
    { id: 'v006', name: 'Atelier Blanco Puro', category: 'Vestidos de novia', location: 'Metropolitana de Santiago', email: 'novias@blancopuro.com', registeredDate: '2024-01-10', status: 'Rechazado', isPremium: false },
];

const ITEMS_PER_PAGE = 10;

const AdminProviders: React.FC = () => {
    const [vendors, setVendors] = useState<AdminVendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof AdminVendor, direction: 'ascending' | 'descending' } | null>(null);

    useEffect(() => {
        const fetchVendors = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Simulación de fetch
                await new Promise(resolve => setTimeout(resolve, 500));
                // En un caso real, aquí iría la llamada a Firebase.
                // const vendorsCollectionRef = collection(db, 'vendors');
                // const vendorSnapshot = await getDocs(vendorsCollectionRef);
                // const vendorsList = vendorSnapshot.docs.map(doc => ({...}));
                setVendors(MOCK_ADMIN_VENDORS);
            } catch (err) {
                console.error("Error fetching vendors:", err);
                setError("No se pudieron cargar los proveedores.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchVendors();
    }, []);

    const handleStatusChange = (id: string, newStatus: VendorStatus) => {
        setVendors(vendors.map(v => v.id === id ? { ...v, status: newStatus } : v));
    };
    
    const handleTogglePremium = (id: string) => {
        setVendors(vendors.map(v => v.id === id ? { ...v, isPremium: !v.isPremium } : v));
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar a este proveedor? Esta acción no se puede deshacer.')) {
            setVendors(vendors.filter(v => v.id !== id));
        }
    };


    const filteredVendors = useMemo(() => {
        if (!searchTerm) return vendors;
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return vendors.filter(vendor =>
            (vendor.name && vendor.name.toLowerCase().includes(lowercasedSearchTerm)) ||
            (vendor.email && vendor.email.toLowerCase().includes(lowercasedSearchTerm)) ||
            (vendor.category && vendor.category.toLowerCase().includes(lowercasedSearchTerm))
        );
    }, [searchTerm, vendors]);

    const sortedVendors = useMemo(() => {
        let sortableItems = [...filteredVendors];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                // Handle boolean sorting for isPremium
                if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
                    if (aVal === bVal) return 0;
                    return sortConfig.direction === 'ascending' ? (aVal ? 1 : -1) : (bVal ? 1 : -1);
                }
                
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return sortConfig.direction === 'ascending' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                }

                return 0;
            });
        }
        return sortableItems;
    }, [filteredVendors, sortConfig]);
    
    const paginatedVendors = sortedVendors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(sortedVendors.length / ITEMS_PER_PAGE);

    const requestSort = (key: keyof AdminVendor) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getStatusChip = (status: AdminVendor['status']) => {
        switch (status) {
            case 'Aprobado': return 'bg-green-100 text-green-800';
            case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
            case 'Rechazado': return 'bg-red-100 text-red-800';
        }
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Proveedores</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar proveedor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-sm bg-gray-100 border-transparent rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <Spinner />
                ) : error ? (
                    <p className="text-center text-red-500 py-8">{error}</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('name')}>Nombre</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('category')}>Categoría</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('registeredDate')}>Fecha Registro</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('status')}>Estado</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('isPremium')}>Premium</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedVendors.map(vendor => (
                                        <tr key={vendor.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{vendor.name}</div>
                                                <div className="text-sm text-gray-500">{vendor.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.registeredDate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChip(vendor.status)}`}>
                                                    {vendor.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {vendor.isPremium && <CrownIcon className="h-5 w-5 text-yellow-500 mx-auto" />}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {vendor.status === 'Pendiente' && (
                                                    <>
                                                        <button onClick={() => handleStatusChange(vendor.id, 'Aprobado')} className="text-green-600 hover:text-green-900 mr-2" title="Aprobar"><CheckCircleIcon className="h-5 w-5"/></button>
                                                        <button onClick={() => handleStatusChange(vendor.id, 'Rechazado')} className="text-red-600 hover:text-red-900" title="Rechazar"><XCircleIcon className="h-5 w-5"/></button>
                                                    </>
                                                )}
                                                 {vendor.status === 'Aprobado' && (
                                                    <button onClick={() => handleTogglePremium(vendor.id)} className="text-yellow-500 hover:text-yellow-700 mr-2" title={vendor.isPremium ? "Quitar Premium" : "Hacer Premium"}><CrownIcon className="h-5 w-5"/></button>
                                                )}
                                                <button className="text-indigo-600 hover:text-indigo-900 ml-2" title="Ver"><EyeIcon className="h-5 w-5"/></button>
                                                <button className="text-gray-600 hover:text-gray-900 ml-2" title="Editar"><EditIcon className="h-5 w-5"/></button>
                                                <button onClick={() => handleDelete(vendor.id)} className="text-red-600 hover:text-red-900 ml-2" title="Eliminar"><TrashIcon className="h-5 w-5"/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Paginación */}
                        <div className="py-3 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> a <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, sortedVendors.length)}</span> de <span className="font-medium">{sortedVendors.length}</span> resultados
                            </div>
                            <div className="flex-1 flex justify-end">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Anterior</button>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Siguiente</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminProviders;
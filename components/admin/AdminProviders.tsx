import React, { useState, useMemo, useEffect } from 'react';
import type { AdminVendor, VendorStatus } from '../../types';
import { db } from '../../services/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { CrownIcon } from '../icons/CrownIcon';
import { EditIcon } from '../icons/EditIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import Spinner from '../Spinner';
import { XIcon } from '../icons/XIcon';
import { VENDOR_CATEGORIES, CHILE_REGIONS } from '../../constants';


const AdminProviders: React.FC = () => {
    const [vendors, setVendors] = useState<AdminVendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<VendorStatus | 'Todos'>('Todos');
    const [categoryFilter, setCategoryFilter] = useState<string>('Todas');
    const [regionFilter, setRegionFilter] = useState<string>('Todas');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<AdminVendor | null>(null);
    const [formData, setFormData] = useState<Partial<AdminVendor>>({});

    const fetchVendors = async () => {
        setIsLoading(true);
        try {
            const vendorsCollection = collection(db, 'vendors');
            const vendorsSnapshot = await getDocs(vendorsCollection);
            const vendorsList = vendorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AdminVendor[];
            setVendors(vendorsList);
        } catch (error) {
            console.error("Error fetching vendors: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const filteredVendors = useMemo(() => {
        return vendors.filter(vendor => {
            const statusMatch = filter === 'Todos' || vendor.status === filter;
            const categoryMatch = categoryFilter === 'Todas' || vendor.category === categoryFilter;
            const regionMatch = regionFilter === 'Todas' || vendor.location === regionFilter;
            return statusMatch && categoryMatch && regionMatch;
        });
    }, [vendors, filter, categoryFilter, regionFilter]);

    const handleOpenModal = (vendor: AdminVendor | null = null) => {
        setEditingVendor(vendor);
        setFormData(vendor ? { ...vendor } : { name: '', email: '', phone: '', category: VENDOR_CATEGORIES[0], location: CHILE_REGIONS[0], status: 'Pendiente', isPremium: false });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingVendor(null);
        setFormData({});
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            alert("Nombre y email son requeridos.");
            return;
        }

        try {
            if (editingVendor) {
                // Update existing vendor
                const vendorDoc = doc(db, 'vendors', editingVendor.id);
                await updateDoc(vendorDoc, formData);
            } else {
                // Create new vendor
                await addDoc(collection(db, 'vendors'), { ...formData, registeredDate: new Date().toISOString() });
            }
            fetchVendors(); // Refresh data
            handleCloseModal();
        } catch (error) {
            console.error("Error saving vendor: ", error);
            alert("Ocurrió un error al guardar.");
        }
    };
    
    const handleStatusChange = async (id: string, newStatus: VendorStatus) => {
        const vendorDoc = doc(db, 'vendors', id);
        try {
            await updateDoc(vendorDoc, { status: newStatus });
            setVendors(vendors.map(v => v.id === id ? { ...v, status: newStatus } : v));
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };

    const togglePremiumStatus = async (id: string, currentStatus: boolean | undefined) => {
        const vendorDoc = doc(db, 'vendors', id);
        try {
            const newPremiumStatus = !currentStatus;
            await updateDoc(vendorDoc, { isPremium: newPremiumStatus });
            setVendors(vendors.map(v => v.id === id ? { ...v, isPremium: newPremiumStatus } : v));
        } catch (error) {
            console.error("Error toggling premium status: ", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este proveedor? Esta acción es irreversible.')) {
            const vendorDoc = doc(db, 'vendors', id);
            try {
                await deleteDoc(vendorDoc);
                setVendors(vendors.filter(v => v.id !== id));
            } catch (error) {
                console.error("Error deleting vendor: ", error);
            }
        }
    };

    const StatusBadge: React.FC<{ status: VendorStatus }> = ({ status }) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
        switch (status) {
            case 'Aprobado': return <span className={`${baseClasses} bg-green-100 text-green-800`}>Aprobado</span>;
            case 'Pendiente': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pendiente</span>;
            case 'Rechazado': return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rechazado</span>;
        }
    };

    const filterTabs: (VendorStatus | 'Todos')[] = ['Todos', 'Pendiente', 'Aprobado', 'Rechazado'];
    const filterSelectStyle = "w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary";
    const modalInputStyle = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary";

    return (
        <div className="bg-white p-6 rounded-lg shadow animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestionar Proveedores</h1>
                <button onClick={() => handleOpenModal()} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent flex items-center">
                    <PlusCircleIcon className="h-5 w-5 mr-2"/>
                    Añadir Proveedor
                </button>
            </div>
            
            <div className="flex border-b mb-4">
                {filterTabs.map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setFilter(tab)}
                        className={`py-2 px-4 text-sm font-medium transition-colors ${filter === tab ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab} ({tab === 'Todos' ? vendors.length : vendors.filter(v => v.status === tab).length})
                    </button>
                ))}
            </div>
            
            <div className="flex gap-4 mb-4">
                <div>
                    <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                        id="categoryFilter"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={filterSelectStyle}
                    >
                        <option value="Todas">Todas las categorías</option>
                        {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="regionFilter" className="block text-sm font-medium text-gray-700 mb-1">Región</label>
                    <select
                        id="regionFilter"
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className={filterSelectStyle}
                    >
                        <option value="Todas">Todas las regiones</option>
                        {CHILE_REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                    </select>
                </div>
            </div>

            {isLoading ? <Spinner /> : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Registro</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredVendors.map(vendor => (
                                <tr key={vendor.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                                        <div className="text-sm text-gray-500">{vendor.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.phone || 'No ingresado'}</td>
                                     <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {vendor.isPremium && <CrownIcon className="h-5 w-5 text-yellow-500" />}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(vendor.registeredDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={vendor.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-3">
                                            {vendor.status === 'Pendiente' && (
                                                <>
                                                    <button onClick={() => handleStatusChange(vendor.id, 'Aprobado')} className="text-green-600 hover:text-green-900" title="Aprobar"><CheckCircleIcon className="h-5 w-5"/></button>
                                                    <button onClick={() => handleStatusChange(vendor.id, 'Rechazado')} className="text-red-600 hover:text-red-900" title="Rechazar"><XCircleIcon className="h-5 w-5"/></button>
                                                </>
                                            )}
                                            <button onClick={() => togglePremiumStatus(vendor.id, vendor.isPremium)} className={vendor.isPremium ? "text-yellow-500 hover:text-yellow-700" : "text-gray-400 hover:text-yellow-500"} title={vendor.isPremium ? "Quitar Premium" : "Hacer Premium"}>
                                                <CrownIcon className="h-5 w-5"/>
                                            </button>
                                            <button onClick={() => handleOpenModal(vendor)} className="text-gray-400 hover:text-blue-600" title="Editar"><EditIcon className="h-5 w-5"/></button>
                                            <button onClick={() => handleDelete(vendor.id)} className="text-gray-400 hover:text-red-700" title="Eliminar"><TrashIcon className="h-5 w-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingVendor ? 'Editar Proveedor' : 'Añadir Proveedor'}</h2>
                            <button onClick={handleCloseModal}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800"/></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className={modalInputStyle} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" name="email" value={formData.email || ''} onChange={handleFormChange} className={modalInputStyle} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                    <input type="tel" name="phone" value={formData.phone || ''} onChange={handleFormChange} className={modalInputStyle} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                    <select name="category" value={formData.category || ''} onChange={handleFormChange} className={modalInputStyle}>
                                        {VENDOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                                     <select name="location" value={formData.location || ''} onChange={handleFormChange} className={modalInputStyle}>
                                        {CHILE_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                                    <select name="status" value={formData.status || ''} onChange={handleFormChange} className={modalInputStyle}>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Aprobado">Aprobado</option>
                                        <option value="Rechazado">Rechazado</option>
                                    </select>
                                </div>
                                <div className="flex items-center pt-6 md:col-span-2">
                                    <input type="checkbox" id="isPremium" name="isPremium" checked={formData.isPremium || false} onChange={handleFormChange} className="h-4 w-4 text-brand-primary rounded" />
                                    <label htmlFor="isPremium" className="ml-2 block text-sm font-medium text-gray-700">Es Premium</label>
                                </div>
                            </div>
                            <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
                                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProviders;
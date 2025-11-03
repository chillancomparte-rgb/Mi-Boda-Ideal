import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db } from '../../services/firebase';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import type { AdminVendor, Page, Vendor, Inspiration, Service } from '../../types';
import Spinner from '../Spinner';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { XIcon } from '../icons/XIcon';
import { VENDOR_CATEGORIES, CHILE_REGIONS } from '../../constants';
import { uploadImageToHosting } from '../../services/hostingUploadService';
import { CrownIcon } from '../icons/CrownIcon'; // Importar CrownIcon

// FIX: La interface se movió aquí para estar junto al componente
interface VendorFormData extends Partial<AdminVendor> {
    description?: string;
}

const AdminVendors: React.FC<{ navigate: (page: Page, data?: Vendor | Inspiration | AdminVendor | Service, category?: string) => void }> = ({ navigate }) => {
    
    // --- ESTADO Y FUNCIONES ---
    const [vendors, setVendors] = useState<AdminVendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('Todas');
    const [regionFilter, setRegionFilter] = useState<string>('Todas');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<AdminVendor | null>(null);
    const [formData, setFormData] = useState<VendorFormData>({});

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // <--- ESTE ES EL 'isUploading' QUE DA ERROR
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [selectedVendorContact, setSelectedVendorContact] = useState<AdminVendor | null>(null);
    const [activeTab, setActiveTab] = useState('company'); 
    const [showServicesModal, setShowServicesModal] = useState(false);
    const [selectedVendorForServices, setSelectedVendorForServices] = useState<AdminVendor | null>(null);


    const fetchVendors = async () => {
        setIsLoading(true);
        try {
            const vendorsCollectionRef = collection(db, 'vendors');
            const vendorsSnapshot = await getDocs(vendorsCollectionRef);
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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingVendor(null);
        setFormData({});
        fetchVendors();
    };

    const handleOpenContactModal = (vendor: AdminVendor) => {
        setSelectedVendorContact(vendor);
        setIsContactModalOpen(true);
    };

    // FIX: Faltaba esta función
    const handleCloseContactModal = () => {
        setIsContactModalOpen(false);
        setSelectedVendorContact(null);
    };

    const handleOpenModal = (vendor: AdminVendor | null = null) => {
        setEditingVendor(vendor);
        setFormData(vendor ? { ...vendor } : {
            name: '',
            email: '',
            companyEmail: '',
            category: VENDOR_CATEGORIES[0],
            location: CHILE_REGIONS[0],
            phone: '',
            description: '',
            contactPersonName: '',
            contactPersonLastName: '',
            contactPersonRut: '',
            contactPersonPhone: '',
            contactPersonEmail: '',
            facebookUrl: '',
            instagramUrl: '',
            websiteUrl: '',
            status: 'Pendiente',
            isPremium: false,
        });
        setActiveTab('company');
        setIsModalOpen(true);
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.category) {
            alert("Nombre, email y categoría son requeridos.");
            return;
        }

        setIsSaving(true);
        try {
            if (editingVendor) {
                const vendorDoc = doc(db, 'vendors', editingVendor.id);
                // FIX: Usamos {...formData} para evitar el error de tipo de Firebase
                await updateDoc(vendorDoc, { ...formData } as Partial<AdminVendor>);
            } else {
                await addDoc(collection(db, 'vendors'), { ...formData, registeredDate: new Date().toISOString() });
            }
            fetchVendors();
            handleCloseModal();
        } catch (error: any) {
            console.error("Error saving vendor: ", error);
            alert(`Ocurrió un error al guardar: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredVendors = useMemo(() => {
        return vendors.filter(vendor => {
            const searchMatch = vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                vendor.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const categoryMatch = categoryFilter === 'Todas' || vendor.category === categoryFilter;
            const regionMatch = regionFilter === 'Todas' || vendor.location === regionFilter;
            return searchMatch && categoryMatch && regionMatch;
        });
    }, [vendors, searchTerm, categoryFilter, regionFilter]);

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
            const vendorDoc = doc(db, 'vendors', id);
            try {
                await deleteDoc(vendorDoc);
                setVendors(vendors.filter(v => v.id !== id));
            } catch (error) {
                console.error("Error deleting vendor: ", error);
            }
        }
    };

    // FIX: Las constantes de estilos se mueven aquí, antes del 'return'
    const searchInputStyle = "w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary";
    const modalInputStyle = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-brand-primary focus:border-brand-primary";

    // --- INICIO DEL JSX (RETURN) ---
    return (
        <div className="bg-white p-6 rounded-lg shadow animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestionar Proveedores</h1>
                <button onClick={() => handleOpenModal()} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent flex items-center">
                    <PlusCircleIcon className="h-5 w-5 mr-2"/>
                    Añadir Proveedor
                </button>
            </div>

            {/* --- FILTROS --- */}
            <div className="flex gap-4 mb-6">
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className={searchInputStyle}
                >
                    <option value="Todas">Todas las Categorías</option>
                    {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className={searchInputStyle}
                >
                    <option value="Todas">Todas las Regiones</option>
                    {CHILE_REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                </select>
            </div>

            {/* --- BÚSQUEDA --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center md:items-end">
                <div className="w-full md:flex-grow">
                    <label htmlFor="vendorSearch" className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar por nombre o email
                    </label>
                    <input
                        id="vendorSearch"
                        type="text"
                        placeholder="Escribe para buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={searchInputStyle}
                    />
                </div>
            </div>

            {/* --- TABLA --- */}
            {isLoading ? <Spinner /> : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Región</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono Empresa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredVendors.map(vendor => (
                                <tr key={vendor.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={vendor.logoUrl || 'https://via.placeholder.com/150'} alt={vendor.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 flex items-center">
                                                    {vendor.name}
                                                    {vendor.isPremium && <CrownIcon className="h-5 w-5 text-yellow-500 ml-2" />}
                                                </div>
                                                <div className="text-sm text-gray-500">{vendor.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{vendor.category || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.location || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.phone || 'No ingresado'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.status === 'Aprobado' ? 'bg-green-100 text-green-800' : vendor.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                            {vendor.status || 'Pendiente'}
                                        </span>
                                    </td>
                                    {/* FIX: Faltaba esta celda de "Acciones" */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleOpenModal(vendor)} className="text-brand-primary hover:text-brand-accent mr-3" title="Editar">
                                            <EditIcon className="h-5 w-5"/>
                                        </button>
                                        <button onClick={() => navigate('vendor-profile', vendor)} className="text-gray-400 hover:text-green-600 mr-3" title="Ver Perfil">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleOpenContactModal(vendor)} className="text-blue-500 hover:text-blue-700 mr-3" title="Ver Contacto">
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                          </svg>
                                        </button>
                                        <button onClick={() => handleDelete(vendor.id)} className="text-red-600 hover:text-red-800" title="Eliminar">
                                            <TrashIcon className="h-5 w-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- MODAL DE EDICIÓN/CREACIÓN --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingVendor ? 'Editar Proveedor' : 'Añadir Proveedor'}</h2>
                            <button onClick={handleCloseModal}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800"/></button>
                        </div>
                        <div className="flex border-b border-gray-200">
                            <button
                                className={`py-2 px-4 text-sm font-medium ${activeTab === 'company' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('company')}
                            >
                                Información de la Empresa
                            </button>
                            <button
                                className={`py-2 px-4 text-sm font-medium ${activeTab === 'contact' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('contact')}
                            >
                                Datos del Contacto
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                                {activeTab === 'company' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
                                            <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className={modalInputStyle} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email de la Empresa</label>
                                            <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className={modalInputStyle} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                            <select name="category" value={formData.category || ''} onChange={handleInputChange} className={modalInputStyle} required>
                                                {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Región</label>
                                            <select name="location" id="location" value={formData.location || ''} onChange={handleInputChange} className={modalInputStyle}>
                                                {CHILE_REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Teléfono de la Empresa</label>
                                            <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} className={modalInputStyle} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
                                            <input type="url" name="facebookUrl" value={formData.facebookUrl || ''} onChange={handleInputChange} className={modalInputStyle} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
                                            <input type="url" name="instagramUrl" value={formData.instagramUrl || ''} onChange={handleInputChange} className={modalInputStyle} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Sitio Web URL</label>
                                            <input type="url" name="websiteUrl" value={formData.websiteUrl || ''} onChange={handleInputChange} className={modalInputStyle} />
                                        </div>
                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Estado del Proveedor</label>
                                                <select name="status" value={formData.status || 'Pendiente'} onChange={handleInputChange} className={modalInputStyle}>
                                                    <option value="Pendiente">Pendiente</option>
                                                    <option value="Aprobado">Aprobado</option>
                                                    <option value="Rechazado">Rechazado</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center mt-6">
                                                <input
                                                    type="checkbox"
                                                    name="isPremium"
                                                    id="isPremium"
                                                    checked={formData.isPremium || false}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, isPremium: e.target.checked }))}
                                                    className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                                                />
                                                <label htmlFor="isPremium" className="ml-2 block text-sm font-medium text-gray-700">Es Premium</label>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                            <textarea name="description" rows={4} value={formData.description || ''} onChange={handleInputChange} className={modalInputStyle}></textarea>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'contact' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nombre Contacto</label>
                                            <input type="text" name="contactPersonName" value={formData.contactPersonName || ''} onChange={handleInputChange} className={modalInputStyle} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Apellido Contacto</label>
                                            <input type="text" name="contactPersonLastName" value={formData.contactPersonLastName || ''} onChange={handleInputChange} className={modalInputStyle} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">RUT Contacto</label>
                                            <input type="text" name="contactPersonRut" value={formData.contactPersonRut || ''} onChange={handleInputChange} className={modalInputStyle} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Teléfono Contacto</label>
                                            <input type="tel" name="contactPersonPhone" value={formData.contactPersonPhone || ''} onChange={handleInputChange} className={modalInputStyle} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Email Contacto</label>
                                            <input type="email" name="contactPersonEmail" value={formData.contactPersonEmail || ''} onChange={handleInputChange} className={modalInputStyle} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
                                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
                                <button type="submit" disabled={isSaving || isUploading} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent disabled:bg-gray-400">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL DE DETALLES DE CONTACTO --- */}
            {isContactModalOpen && selectedVendorContact && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Datos de Contacto Personal</h2>
                            <button onClick={handleCloseContactModal}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800"/></button>
                        </div>
                        <div className="p-6 space-y-3">
                            <p><strong>Nombre:</strong> {selectedVendorContact.contactPersonName || 'N/A'}</p>
                            <p><strong>Apellido:</strong> {selectedVendorContact.contactPersonLastName || 'N/A'}</p>
                            <p><strong>RUT:</strong> {selectedVendorContact.contactPersonRut || 'N/A'}</p>
                            <p><strong>Email:</strong> {selectedVendorContact.contactPersonEmail || 'N/A'}</p>
                            <p><strong>Teléfono:</strong> {selectedVendorContact.contactPersonPhone || 'N/A'}</p>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-end">
                            <button type="button" onClick={handleCloseContactModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

        </div> // <-- FIX: Este es el </div> de cierre principal que faltaba
    );
};

export default AdminVendors;
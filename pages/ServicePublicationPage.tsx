import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import { VENDOR_CATEGORIES, CHILE_REGIONS } from '../constants';
import { Service, AdminVendor } from '../types';
import ServiceDisplay from '../components/services/ServiceDisplay';

interface ServicePublicationPageProps {
    vendorId: string;
    serviceId: string;
    onBack: () => void;
}

const ServicePublicationPage: React.FC<ServicePublicationPageProps> = ({ vendorId, serviceId, onBack }) => {
    const { user } = useAuth();
    const [service, setService] = useState<Service | null>(null);
    const [vendor, setVendor] = useState<AdminVendor | null>(null);
    const [formData, setFormData] = useState<Partial<Service>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Cargar datos del servicio
                const serviceDocRef = doc(db, 'vendors', vendorId, 'services', serviceId);
                const serviceDocSnap = await getDoc(serviceDocRef);
                if (serviceDocSnap.exists()) {
                    const serviceData = { id: serviceDocSnap.id, ...serviceDocSnap.data() } as Service;
                    setService(serviceData);
                    setFormData({ ...serviceData, category: serviceData.category || [], locations: serviceData.locations || [] });
                }

                // Cargar datos del proveedor
                const vendorDocRef = doc(db, 'vendors', vendorId);
                const vendorDocSnap = await getDoc(vendorDocRef);
                if (vendorDocSnap.exists()) {
                    setVendor(vendorDocSnap.data() as AdminVendor);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [vendorId, serviceId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.name === 'price' ? parseFloat(e.target.value) || 0 : e.target.value,
        });
    };

    const handleCategoryChange = (cat: string) => {
        const currentCategories = formData.category || [];
        const newCategories = currentCategories.includes(cat)
            ? currentCategories.filter(c => c !== cat)
            : [...currentCategories, cat];
        setFormData({ ...formData, category: newCategories });
    };

    const handleLocationChange = (location: string) => {
        const currentLocations = formData.locations || [];
        const newLocations = currentLocations.includes(location)
            ? currentLocations.filter(l => l !== location)
            : [...currentLocations, location];
        setFormData({ ...formData, locations: newLocations });
    };

    const handleSelectAllRegions = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setFormData({ ...formData, locations: CHILE_REGIONS });
        } else {
            setFormData({ ...formData, locations: [] });
        }
    };

    const handleSaveChanges = async (updatedService: Partial<Service>) => {
        setIsSaving(true);
        try {
            const serviceDocRef = doc(db, 'vendors', vendorId, 'services', serviceId);
            await updateDoc(serviceDocRef, updatedService);
            setService(prevService => prevService ? { ...prevService, ...updatedService as Service } : null);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating service:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (!service || !vendor) {
        return <div>Servicio o Proveedor no encontrado</div>;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-brand-dark">Publicación de Servicio</h3>
                <button onClick={onBack} className="text-brand-primary hover:underline">Volver a Servicios</button>
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Servicio</label>
                        <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categorías</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {VENDOR_CATEGORIES.map(cat => (
                                <label key={cat} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={(formData.category || []).includes(cat)}
                                        onChange={() => handleCategoryChange(cat)}
                                        className="rounded text-brand-primary focus:ring-brand-primary"
                                    />
                                    <span className="text-sm">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea name="description" id="description" rows={5} value={formData.description || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio (CLP)</label>
                        <input type="number" name="price" id="price" value={formData.price || 0} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Regiones de Operación</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <label className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer font-bold">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAllRegions}
                                    checked={(formData.locations || []).length === CHILE_REGIONS.length}
                                    className="rounded text-brand-primary focus:ring-brand-primary"
                                />
                                <span className="text-sm">Todo Chile</span>
                            </label>
                            {CHILE_REGIONS.map(reg => (
                                <label key={reg} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={(formData.locations || []).includes(reg)}
                                        onChange={() => handleLocationChange(reg)}
                                        className="rounded text-brand-primary focus:ring-brand-primary"
                                    />
                                    <span className="text-sm">{reg}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button onClick={() => handleSaveChanges(formData)} disabled={isSaving} className="bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-brand-accent disabled:bg-gray-400">
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            ) : (
                <ServiceDisplay
                    service={service}
                    vendor={vendor}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleSaveChanges}
                    onCancelEdit={() => setIsEditing(false)}
                    currentUser={user}
                />
            )}
        </div>
    );
};

export default ServicePublicationPage;
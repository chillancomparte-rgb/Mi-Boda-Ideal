import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc, query, collection, where, getDocs, limit, addDoc } from 'firebase/firestore';
import type { AdminVendor } from '../../types';
import Spinner from '../Spinner';
import { VENDOR_CATEGORIES, CHILE_REGIONS } from '../../constants';
import { uploadImageToHosting } from '../../services/hostingUploadService';
import { CameraIcon } from '../icons/CameraIcon';

// Extend the form data type
interface VendorFormData extends Partial<Omit<AdminVendor, 'location'>> {
    description?: string;
    logoUrl?: string;
    locations?: string[];
    companyName?: string;
}

const VendorProfile: React.FC = () => {
    const { user } = useAuth();
    const [vendorData, setVendorData] = useState<AdminVendor | null>(null);
    const [formData, setFormData] = useState<VendorFormData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchVendorData = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const vendorsQuery = query(collection(db, 'vendors'), where("uid", "==", user.uid), limit(1));
                const vendorSnapshot = await getDocs(vendorsQuery);

                if (!vendorSnapshot.empty) {
                    const vendorDoc = vendorSnapshot.docs[0];
                    const data = { id: vendorDoc.id, ...vendorDoc.data() } as AdminVendor;
                    setVendorData(data);
                    setFormData({
                        ...data,
                        locations: Array.isArray(data.locations) ? data.locations : [],
                    });
                } else {
                    setVendorData(null); 
                    setFormData({
                        name: user.displayName || '',
                        email: user.email || '',
                        locations: [],
                        phone: '',
                        description: '',
                    });
                }
            } catch (error) {
                console.error("Error fetching vendor profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVendorData();
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleLogoUpload(e.target.files[0]);
        }
    };

    const handleLogoUpload = async (file: File) => {
        if (!vendorData?.id) return;
        setIsUploading(true);
        try {
            const imageUrl = await uploadImageToHosting(file);
            setFormData({ ...formData, logoUrl: imageUrl });
            await updateDoc(doc(db, 'vendors', vendorData.id), { logoUrl: imageUrl });
            setSuccessMessage('Logo actualizado!');
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSaving(true);
        try {
            if (vendorData?.id) {
                await updateDoc(doc(db, 'vendors', vendorData.id), { ...formData });
            } else {
                const newVendorRef = await addDoc(collection(db, 'vendors'), {
                    ...formData,
                    uid: user.uid,
                    email: user.email,
                    registeredDate: new Date().toISOString(),
                    status: 'pending',
                    isPremium: false,
                });
                setVendorData({ id: newVendorRef.id, ...formData } as AdminVendor);
            }
            setSuccessMessage('¡Perfil actualizado con éxito!');
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) return <Spinner />;

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-6">Mi Perfil de Proveedor</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Company Data Section */}
                <section>
                    <h4 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Datos de la Empresa</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div className="md:col-span-1 flex flex-col items-center">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed flex items-center justify-center">
                                {formData.logoUrl ? (
                                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400">Logo</span>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploading} />
                                    {!isUploading && <CameraIcon className="h-8 w-8 text-white" />}
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
                                <input type="text" name="companyName" id="companyName" value={formData.companyName || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                    </div>
                    <div className="mt-6">
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
                    <div className="mt-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción General</label>
                        <textarea name="description" id="description" rows={4} value={formData.description || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                </section>

                {/* Contact Data Section */}
                <section>
                    <h4 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Datos de Contacto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre de Contacto</label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email de Contacto</label>
                            <input type="email" name="email" id="email" value={formData.email || ''} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                </section>
                
                <div className="flex justify-end items-center gap-4 pt-4 border-t">
                    {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
                    <button type="submit" disabled={isSaving || isUploading} className="bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-brand-accent disabled:bg-gray-400">
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorProfile;

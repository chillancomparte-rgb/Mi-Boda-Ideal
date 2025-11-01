import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc, query, collection, where, getDocs, limit } from 'firebase/firestore';
import type { AdminVendor } from '../../types';
import Spinner from '../Spinner';
import { VENDOR_CATEGORIES, CHILE_REGIONS } from '../../constants';
import { uploadImageToHosting } from '../../services/hostingUploadService';
import { UploadCloudIcon } from '../icons/UploadCloudIcon';
import { TrashIcon } from '../icons/TrashIcon';

// Extend the form data type to include gallery
interface VendorFormData extends Partial<AdminVendor> {
    gallery?: string[];
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
            if (!user || !user.email) return;

            setIsLoading(true);
            try {
                const vendorsQuery = query(collection(db, 'vendors'), where("email", "==", user.email), limit(1));
                const vendorSnapshot = await getDocs(vendorsQuery);

                if (!vendorSnapshot.empty) {
                    const vendorDoc = vendorSnapshot.docs[0];
                    const data = { id: vendorDoc.id, ...vendorDoc.data() } as AdminVendor;
                    // Ensure gallery is always an array
                    if (!data.gallery) {
                        data.gallery = [];
                    }
                    setVendorData(data);
                    setFormData(data);
                } else {
                    console.log("No vendor profile found for this user.");
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const imageUrl = await uploadImageToHosting(file);
            const currentGallery = formData.gallery || [];
            setFormData(prev => ({ ...prev, gallery: [...currentGallery, imageUrl] }));
        } catch (error) {
            alert("Error al subir la imagen. Inténtalo de nuevo.");
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleDeleteImage = (imgUrl: string) => {
        if (window.confirm("¿Seguro que quieres eliminar esta imagen?")) {
            setFormData(prev => ({
                ...prev,
                gallery: (prev.gallery || []).filter(url => url !== imgUrl)
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vendorData) return;

        setIsSaving(true);
        setSuccessMessage('');
        try {
            const vendorDocRef = doc(db, 'vendors', vendorData.id);
            await updateDoc(vendorDocRef, formData);
            setSuccessMessage('¡Perfil actualizado con éxito!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return <Spinner />;
    }

    if (!vendorData) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4">Mi Perfil</h3>
                <p className="text-gray-600">No se ha encontrado un perfil de proveedor asociado a esta cuenta.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-6">Mi Perfil de Proveedor</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info Section */}
                <section>
                     <h4 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Información Básica</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email de Contacto</label>
                            <input type="email" name="email" id="email" value={formData.email || ''} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                            <select name="category" id="category" value={formData.category || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Región</label>
                            <select name="location" id="location" value={formData.location || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                {CHILE_REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                </section>

                {/* Description Section */}
                <section>
                    <h4 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Descripción</h4>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Describe tu Servicio</label>
                        <textarea name="description" id="description" rows={4} value={(formData as any).description || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                </section>
                
                {/* Gallery Section */}
                <section>
                    <h4 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Galería de Imágenes</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {(formData.gallery || []).map((url, index) => (
                            <div key={index} className="relative group">
                                <img src={url} alt={`Galería ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(url)}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                         <div className="w-full h-32">
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden"/>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-full h-full border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-brand-primary hover:text-brand-primary transition-colors disabled:opacity-50"
                            >
                                {isUploading ? <Spinner /> : <><UploadCloudIcon className="w-8 h-8" /><span className="text-xs mt-1">Añadir Imagen</span></>}
                            </button>
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

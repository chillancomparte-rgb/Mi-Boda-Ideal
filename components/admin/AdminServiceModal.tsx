import React, { useState, useEffect } from 'react';
import { XIcon } from '../icons/XIcon';
import { Service } from '../../types';
import { VENDOR_CATEGORIES, CHILE_REGIONS } from '../../constants'; // Asumiendo que estas constantes son relevantes para servicios
import { db } from '../../services/firebase';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import Spinner from '../Spinner';

interface AdminServiceModalProps {
    vendorId: string;
    service?: Service | null; // Si se pasa un servicio, es para editar
    onClose: () => void;
    onSaveSuccess: () => void;
}

const AdminServiceModal: React.FC<AdminServiceModalProps> = ({ vendorId, service, onClose, onSaveSuccess }) => {
    const [formData, setFormData] = useState<Partial<Service>>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (service) {
            setFormData(service);
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                category: [],
                locations: [],
                gallery: [],
            });
        }
    }, [service]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData(prev => ({ ...prev, category: selectedOptions }));
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData(prev => ({ ...prev, locations: selectedOptions }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.name || !formData.description || !formData.price || formData.category?.length === 0 || formData.locations?.length === 0) {
            alert('Por favor, completa todos los campos obligatorios.');
            setIsLoading(false);
            return;
        }

        try {
            if (service && service.id) {
                // Editar servicio existente
                const serviceRef = doc(db, 'vendors', vendorId, 'services', service.id);
                await setDoc(serviceRef, formData, { merge: true });
            } else {
                // Añadir nuevo servicio
                await addDoc(collection(db, 'vendors', vendorId, 'services'), formData);
            }
            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving service:', error);
            alert('Error al guardar el servicio.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">{service ? 'Editar Servicio' : 'Añadir Servicio'}</h2>
                    <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800"/></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6">
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre del Servicio</label>
                            <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Precio</label>
                            <input type="number" name="price" value={formData.price || 0} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Categorías (selecciona una o varias)</label>
                            <select multiple name="category" value={formData.category || []} onChange={handleCategoryChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm h-24" required>
                                {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ubicaciones (selecciona una o varias)</label>
                            <select multiple name="locations" value={formData.locations || []} onChange={handleLocationChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm h-24" required>
                                {CHILE_REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                            </select>
                        </div>
                        {/* TODO: Implementar gestión de galería de imágenes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Galería de Imágenes (URLs)</label>
                            <textarea name="gallery" value={formData.gallery?.join('\n') || ''} onChange={(e) => setFormData(prev => ({ ...prev, gallery: e.target.value.split('\n') }))} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="Introduce URLs de imágenes, una por línea"></textarea>
                        </div>
                    </div>
                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent disabled:bg-gray-400">
                            {isLoading ? <Spinner /> : (service ? 'Guardar Cambios' : 'Añadir Servicio')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminServiceModal;

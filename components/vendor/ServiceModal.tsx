import React, { useState, useEffect } from 'react'; // Añadir useEffect
import { XIcon } from '../icons/XIcon';
import { VENDOR_CATEGORIES, CHILE_REGIONS } from '../../constants';
import { Service } from '../../types';
import { uploadImageToHosting } from '../../services/hostingUploadService'; // Importar el servicio de subida

interface ServiceModalProps {
    service: Service | null;
    onClose: () => void;
    onSave: (service: Omit<Service, 'id'>, newImages: File[]) => Promise<void>; // Modificar onSave para aceptar nuevas imágenes
    isSaving: boolean;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onSave, isSaving }) => {
    const [formData, setFormData] = useState<Omit<Service, 'id'>>(() => service ? { ...service, locations: service.locations || [], category: service.category || [] } : {
        name: '',
        description: '',
        price: 0,
        category: [],
        locations: [],
        images: [], // Inicializar images
    });
    const [newImages, setNewImages] = useState<File[]>([]); // Estado para las nuevas imágenes a subir
    const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Estado para las previsualizaciones de imágenes

    useEffect(() => {
        // Cuando el servicio cambia (ej. al abrir el modal para editar), actualizar las previsualizaciones
        if (service && service.images) {
            setImagePreviews(service.images);
        } else {
            setImagePreviews([]);
        }
        setNewImages([]); // Limpiar nuevas imágenes al cambiar de servicio
    }, [service]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...filesArray]);

            // Generar previsualizaciones para las nuevas imágenes
            filesArray.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemoveImage = (indexToRemove: number, isNewImage: boolean) => {
        if (isNewImage) {
            setNewImages(prev => prev.filter((_, index) => index !== indexToRemove));
            // También remover de las previsualizaciones si es una imagen nueva
            setImagePreviews(prev => prev.filter((_, index) => index !== (formData.images?.length || 0) + indexToRemove));
        } else {
            // Si es una imagen existente, la marcamos para eliminar o la quitamos de la lista
            setFormData(prev => ({
                ...prev,
                images: prev.images?.filter((_, index) => index !== indexToRemove) || [],
            }));
            setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, newImages); // Pasar también las nuevas imágenes
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 m-4 max-w-2xl w-full animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xl font-bold text-brand-dark">{service ? 'Editar Servicio' : 'Añadir Servicio'}</h4>
                    <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Servicio</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
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
                        <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio (CLP)</label>
                        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes del Servicio</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand-primary hover:file:bg-brand-primary hover:file:text-white"
                        />
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {imagePreviews.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img src={image} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index, index >= (service?.images?.length || 0))}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <XIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
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
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent disabled:bg-gray-400">{isSaving ? 'Guardando...' : 'Guardar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ServiceModal;
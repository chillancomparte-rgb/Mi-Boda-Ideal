import React, { useState } from 'react';
import type { WeddingInfo } from '../../types';
import { VENDOR_CATEGORIES } from '../../constants';
import { PartyPopperIcon } from '../icons/PartyPopperIcon';

interface WeddingInfoFormProps {
    onSave: (info: WeddingInfo) => void;
    initialInfo?: WeddingInfo | null;
}

const WeddingInfoForm: React.FC<WeddingInfoFormProps> = ({ onSave, initialInfo }) => {
    const [formData, setFormData] = useState({
        userName: initialInfo?.userName || '',
        userRole: initialInfo?.userRole || 'Novia',
        partnerName: initialInfo?.partnerName || '',
        partnerRole: initialInfo?.partnerRole || 'Novio',
        budget: initialInfo?.budget?.toString() || '',
        guests: initialInfo?.guests?.toString() || '',
        commune: initialInfo?.commune || '',
        services: new Set(initialInfo?.services || []),
    });

    const isEditing = !!initialInfo;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleService = (service: string) => {
        setFormData(prev => {
            const newSet = new Set(prev.services);
            if (newSet.has(service)) {
                newSet.delete(service);
            } else {
                newSet.add(service);
            }
            return { ...prev, services: newSet };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.budget || !formData.guests || formData.services.size === 0 || !formData.userName || !formData.commune) {
            alert('Por favor, completa todos los campos requeridos para continuar.');
            return;
        }
        onSave({
            userName: formData.userName,
            userRole: formData.userRole,
            partnerName: formData.partnerName,
            partnerRole: formData.partnerRole,
            budget: parseInt(formData.budget, 10),
            guests: parseInt(formData.guests, 10),
            commune: formData.commune,
            services: Array.from(formData.services),
        });
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <div className="text-center mb-6">
                {!isEditing && <PartyPopperIcon className="h-16 w-16 mx-auto text-brand-primary mb-2" />}
                <h2 className="text-3xl font-serif font-bold text-brand-dark">{isEditing ? 'Edita los Datos de tu Boda' : '¡Bienvenida a tu Panel de Boda!'}</h2>
                <p className="text-brand-dark opacity-80 mt-2 max-w-xl mx-auto">{isEditing ? 'Actualiza la información de tu matrimonio.' : 'Cuéntanos un poco sobre tu gran día para darte las mejores herramientas y recomendaciones.'}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Sobre nosotros</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-dark mb-1">Tu Nombre</label>
                            <div className="flex">
                                <input type="text" name="userName" value={formData.userName} onChange={handleChange} className="w-full p-3 border rounded-l-md" required />
                                <select name="userRole" value={formData.userRole} onChange={handleChange} className="p-3 border-l-0 border bg-gray-50 rounded-r-md">
                                    <option>Novia</option>
                                    <option>Novio</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-dark mb-1">Nombre de tu Pareja</label>
                            <div className="flex">
                                <input type="text" name="partnerName" value={formData.partnerName} onChange={handleChange} placeholder="Nombre" className="w-full p-3 border rounded-l-md" />
                                <select name="partnerRole" value={formData.partnerRole} onChange={handleChange} className="p-3 border-l-0 border bg-gray-50 rounded-r-md">
                                    <option value="">Seleccionar</option>
                                    <option>Novia</option>
                                    <option>Novio</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Sobre el matrimonio</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="guests" className="block text-sm font-medium text-brand-dark mb-1">N° de invitados</label>
                            <input type="number" name="guests" id="guests" value={formData.guests} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-brand-dark mb-1">Presupuesto Aprox.</label>
                            <input type="number" name="budget" id="budget" value={formData.budget} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="commune" className="block text-sm font-medium text-brand-dark mb-1">Comuna</label>
                            <input type="text" name="commune" id="commune" value={formData.commune} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" required />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-brand-dark mb-2">Servicios que necesitan</label>
                    <div className="flex flex-wrap gap-3">
                        {VENDOR_CATEGORIES.slice(0, 12).map(service => (
                            <button
                                key={service}
                                type="button"
                                onClick={() => toggleService(service)}
                                className={`font-semibold py-2 px-4 rounded-full transition-all duration-200 text-sm ${
                                    formData.services.has(service)
                                        ? 'bg-brand-primary text-white scale-105 shadow-md'
                                        : 'bg-brand-light text-brand-dark hover:bg-brand-secondary'
                                }`}
                            >
                                {service}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <button type="submit" className="bg-brand-primary text-white font-bold py-3 px-10 rounded-full hover:bg-brand-accent transition-transform transform hover:scale-105">
                        {isEditing ? 'Guardar Cambios' : 'Guardar y Empezar a Planificar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WeddingInfoForm;
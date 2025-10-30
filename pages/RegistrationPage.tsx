import React, { useState } from 'react';
import SeoMeta from '../components/SeoMeta';
import type { Page, WeddingInfo } from '../types';

interface RegistrationPageProps {
    navigate: (page: Page) => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ navigate }) => {
    const [formData, setFormData] = useState({
        userName: 'Víctor González',
        userRole: 'Novio',
        partnerName: '',
        partnerRole: '',
        guests: '150',
        budget: '3200000',
        commune: 'El Carmen, Ñuble',
        services: new Set<string>([
            'Celebración', 'Banquete', 'Fotografía', 'Video', 'Música', 'Auto de matrimonio', 
            'Invitaciones', 'Recuerdos', 'Novia y Accesorios', 'Luna de Miel'
        ]),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (service: string) => {
        setFormData(prev => {
            const newServices = new Set(prev.services);
            if (newServices.has(service)) {
                newServices.delete(service);
            } else {
                newServices.add(service);
            }
            return { ...prev, services: newServices };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const weddingInfo: WeddingInfo = {
            userName: formData.userName,
            userRole: formData.userRole,
            partnerName: formData.partnerName,
            partnerRole: formData.partnerRole,
            guests: parseInt(formData.guests, 10) || 0,
            budget: parseInt(formData.budget, 10) || 0,
            commune: formData.commune,
            services: Array.from(formData.services),
        };

        localStorage.setItem('miBodaIdealWeddingInfo', JSON.stringify(weddingInfo));
        navigate('tools');
    };
    
    const serviceCategories = [
        "Celebración", "Banquete", "Fotografía", "Video", "Música", "Auto de matrimonio",
        "Invitaciones", "Recuerdos", "Novia y Accesorios", "Luna de Miel", "Flores y Decoración", "Animación",
        "Wedding Planner", "Torta", "Novio y Accesorios", "Belleza y Salud", "Joyería", "Otros"
    ].slice(0, 18); // Show 18 categories to match the layout

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
             <SeoMeta 
                title="Completa tu Perfil | Mi Boda Ideal"
                description="Un paso más para empezar a planificar tu boda soñada. Ingresa los datos básicos de tu matrimonio."
            />
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full flex overflow-hidden animate-fade-in-down">
                {/* Left side */}
                <div className="hidden md:flex flex-col justify-between p-10 bg-[#fdf6f2] relative md:w-[33.3333%]">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-brand-dark mb-4 leading-tight">Un paso más...<br />¡y listo!</h1>
                        <p className="text-brand-dark opacity-80">
                            Ten al día tu organizador rellenando los datos básicos sobre tu matrimonio.
                        </p>
                    </div>
                     <img 
                        src="https://storage.googleapis.com/aistudio-hosting/general/8145eda8-c573-4560-b6f4-d50d1a499b25.png"
                        alt="Reloj despertador vintage con flores" 
                        className="w-full max-w-[200px] h-auto"
                    />
                </div>

                {/* Right side - Form */}
                <div className="p-8 w-full md:w-[66.6667%]">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-xl font-bold text-brand-dark mb-4">Sobre nosotros</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">YO SOY...</label>
                                <div className="flex">
                                    <input type="text" name="userName" value={formData.userName} onChange={handleChange} className="w-full p-2 border-b-2 border-gray-200 bg-white text-brand-dark focus:border-brand-primary outline-none" required />
                                    <select name="userRole" value={formData.userRole} onChange={handleChange} className="p-2 border-b-2 border-gray-200 bg-white focus:border-brand-primary outline-none">
                                        <option>Novio</option>
                                        <option>Novia</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">MI PAREJA ES...</label>
                                <div className="flex">
                                    <input type="text" name="partnerName" value={formData.partnerName} onChange={handleChange} placeholder="Nombre" className="w-full p-2 border-b-2 border-gray-200 bg-white text-brand-dark focus:border-brand-primary outline-none" />
                                    <select name="partnerRole" value={formData.partnerRole} onChange={handleChange} className="p-2 border-b-2 border-gray-200 bg-white focus:border-brand-primary outline-none">
                                        <option value="">Seleccionar</option>
                                        <option>Novio</option>
                                        <option>Novia</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-brand-dark mb-4">Sobre mi matrimonio</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">N° DE INVITADOS</label>
                                <input type="number" name="guests" value={formData.guests} onChange={handleChange} className="w-full p-2 border-b-2 border-gray-200 bg-white text-brand-dark focus:border-brand-primary outline-none" required />
                            </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">PRESUPUESTO APROXIMADO</label>
                                <div className="relative">
                                     <span className="absolute inset-y-0 left-0 flex items-center text-gray-500">$</span>
                                     <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="w-full p-2 pl-4 border-b-2 border-gray-200 bg-white text-brand-dark focus:border-brand-primary outline-none" required />
                                </div>
                            </div>
                             <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">COMUNA</label>
                                <input type="text" name="commune" value={formData.commune} onChange={handleChange} className="w-full p-2 border-b-2 border-gray-200 bg-white text-brand-dark focus:border-brand-primary outline-none" required />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-brand-dark mb-4">Selecciona los proveedores que necesitas</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 mb-8">
                            {serviceCategories.map(service => (
                                <label key={service} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.services.has(service)}
                                        onChange={() => handleCheckboxChange(service)}
                                        className="h-4 w-4 rounded text-green-600 focus:ring-green-500 border-gray-300"
                                    />
                                    <span className="text-sm text-brand-dark">{service}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="bg-red-500 text-white font-bold py-2 px-8 rounded hover:bg-red-600 transition-colors">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;
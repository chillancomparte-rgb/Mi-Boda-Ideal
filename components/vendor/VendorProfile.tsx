import React, { useState } from 'react';
import { PhoneIcon } from '../icons/PhoneIcon';
import { MailIcon } from '../icons/MailIcon';
import { EditIcon } from '../icons/EditIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';

const VENDOR_CATEGORIES = ["Salones de eventos", "Fotógrafos", "Banquetes", "Música y DJ", "Vestidos de novia", "Decoración", "Floristerías"];

interface VendorProfileData {
    companyName: string;
    category: string;
    description: string;
    phone: string;
    email: string;
    gallery: string[];
}

const initialProfileData: VendorProfileData = {
    companyName: 'Fotografía "El Lente Mágico"',
    category: 'Fotógrafos',
    description: 'Capturamos los momentos más especiales de tu gran día con un enfoque artístico y profesional. Nuestra pasión es contar tu historia de amor a través de imágenes que perdurarán para siempre. Ofrecemos paquetes personalizados para adaptarnos a tus necesidades.',
    phone: '+56 9 1234 5678',
    email: 'contacto@lentemagico.cl',
    gallery: [
        'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=400&h=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&h=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1532712938310-34cb39825785?q=80&w=400&h=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd51622?q=80&w=400&h=300&auto=format&fit=crop',
    ]
};

const VendorProfile: React.FC = () => {
    const [profile, setProfile] = useState<VendorProfileData>(initialProfileData);
    const [isSaved, setIsSaved] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        console.log("Perfil guardado:", profile);
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-6">Editar Perfil de la Empresa</h3>
            
            <form onSubmit={handleSave} className="space-y-8">
                {/* Información de la Empresa */}
                <div className="p-6 border border-gray-200 rounded-lg">
                    <h4 className="text-lg font-semibold text-brand-dark mb-4">Información de la Empresa</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-brand-dark mb-1">Nombre de la Empresa</label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                value={profile.companyName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-brand-dark mb-1">Categoría</label>
                            <select
                                id="category"
                                name="category"
                                value={profile.category}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                            >
                                {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Descripción */}
                 <div className="p-6 border border-gray-200 rounded-lg">
                    <h4 className="text-lg font-semibold text-brand-dark mb-4">Sobre tu negocio</h4>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-brand-dark mb-1">Descripción para tu perfil público</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={5}
                            value={profile.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>

                {/* Información de Contacto */}
                <div className="p-6 border border-gray-200 rounded-lg">
                    <h4 className="text-lg font-semibold text-brand-dark mb-4">Información de Contacto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phone" className="flex items-center text-sm font-medium text-brand-dark mb-1">
                                <PhoneIcon className="h-4 w-4 mr-2 text-gray-400"/> Teléfono
                            </label>
                            <input type="tel" id="phone" name="phone" value={profile.phone} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="flex items-center text-sm font-medium text-brand-dark mb-1">
                                <MailIcon className="h-4 w-4 mr-2 text-gray-400"/> Correo Electrónico
                            </label>
                            <input type="email" id="email" name="email" value={profile.email} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>
                </div>
                
                 {/* Galería de Fotos */}
                <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-brand-dark">Galería de Fotos</h4>
                        <button type="button" className="text-sm text-brand-primary hover:underline flex items-center font-medium">
                            <EditIcon className="h-4 w-4 mr-1"/> Editar Galería
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {profile.gallery.map((url, index) => (
                            <img key={index} src={url} alt={`Foto de galería ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                        ))}
                         <button type="button" className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50">
                            <PlusCircleIcon className="h-8 w-8 mb-1"/>
                            <span className="text-sm">Añadir Foto</span>
                        </button>
                    </div>
                </div>


                {/* Guardar Cambios */}
                <div className="flex items-center justify-end gap-4">
                     {isSaved && <p className="text-green-600 font-semibold transition-opacity duration-300">¡Cambios guardados con éxito!</p>}
                    <button type="submit" className="bg-brand-primary hover:bg-brand-accent text-white font-bold py-2 px-8 rounded-md transition-colors duration-300">
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorProfile;
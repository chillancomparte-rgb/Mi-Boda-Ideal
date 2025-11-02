// FORZANDO ACTUALIZACION
import React, { useState, useRef } from 'react';
import { CHILE_REGIONS, VENDOR_CATEGORIES } from '../../constants';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { UploadCloudIcon } from '../icons/UploadCloudIcon';
// import { uploadImageToHosting } from '../../services/hostingUploadService'; // <-- Este import no se usa, lo comenté.
import Spinner from '../Spinner';

// --- FIX: INTERFACE CORREGIDA ---
// Se añadieron TODOS los campos (de cliente y vendedor) y se hicieron opcionales.
interface Step2ContactValues {
    // Campos de Vendedor
    companyName?: string;
    companyEmail?: string;
    category?: string;
    description?: string;
    websiteUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    logoUrl?: string;
    
    // Campos de Cliente
    name?: string;
    email?: string; // 'email' es usado por el cliente
    weddingDate?: string;

    // Campos Compartidos
    location?: string;
    phone?: string;
}

interface Step2ContactProps {
    nextStep: () => void;
    prevStep: () => void;
    handleChange: (input: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleLogoUpload?: (file: File) => Promise<void>;
    values: Step2ContactValues; // <-- Ahora este tipo es correcto
    isUploadingLogo?: boolean;
    isClientRegistration?: boolean;
}

const Step2Contact: React.FC<Step2ContactProps> = ({ nextStep, prevStep, handleChange, handleLogoUpload, values, isUploadingLogo, isClientRegistration }) => {
    const logoFileInputRef = useRef<HTMLInputElement>(null);

    const continueStep = (e: React.FormEvent) => {
        e.preventDefault();

        if (isClientRegistration) {
            // FIX: La validación estaba usando 'values.name' y 'values.email' que no estaban en el tipo.
            // Ahora la validación se hace en Step1Account, así que solo avanzamos.
            nextStep();
        } else {
            // Validación de Vendedor
            const { companyName, companyEmail, category, location, phone, description } = values;
            const isValid = companyName && companyEmail && category && location && phone && description;

            if (isValid) {
                nextStep();
            } else {
                alert('Por favor, completa todos los campos obligatorios de la empresa.');
            }
        }
    };

    return (
        <form onSubmit={continueStep} className="animate-fade-in">
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">
                {isClientRegistration ? '2. Tu Información de Contacto' : '2. Información de tu Empresa'}
            </h2>
            
            {isClientRegistration ? (
                // --- FORMULARIO DE CLIENTE ---
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-brand-dark mb-1">Tu Nombre</label>
                        <input
                            type="text"
                            id="name"
                            value={values.name || ''} // <-- FIX: Añadido '|| ""' por si es undefined
                            onChange={handleChange('name')}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-1">Tu Email</label>
                        <input
                            type="email"
                            id="email"
                            value={values.email || ''} // <-- FIX: Añadido '|| ""'
                            onChange={handleChange('email')}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-brand-dark mb-1">Tu Teléfono</label>
                        <input
                            type="tel"
                            id="phone"
                            value={values.phone || ''} // <-- FIX: Añadido '|| ""'
                            onChange={handleChange('phone')}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-brand-dark mb-1">Tu Región</label>
                        <select
                            id="location"
                            value={values.location || ''} // <-- FIX: Añadido '|| ""'
                            onChange={handleChange('location')}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                            required
                        >
                            <option value="">Selecciona una región</option> {/* Buena práctica */}
                            {CHILE_REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="weddingDate" className="block text-sm font-medium text-brand-dark mb-1">Fecha de tu Boda</label>
                        <input
                            type="date"
                            id="weddingDate"
                            value={values.weddingDate || ''} // <-- FIX: Añadido '|| ""'
                            onChange={handleChange('weddingDate')}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                </div>
            ) : (
                // --- FORMULARIO DE VENDEDOR ---
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-brand-dark mb-1">Nombre de la Empresa</label>
                        <input
                            type="text"
                            id="companyName"
                            value={values.companyName || ''}
                            onChange={handleChange('companyName')}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="companyEmail" className="block text-sm font-medium text-brand-dark mb-1">Email de la Empresa</label>
                        <input
                            type="email"
                            id="companyEmail"
                            value={values.companyEmail || ''}
                            onChange={handleChange('companyEmail')}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-brand-dark mb-1">Categoría Principal</label>
                        <select
                            id="category"
                            value={values.category || ''}
                            onChange={handleChange('category')}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                            required
                        >
                            <option value="">Selecciona una categoría</option> {/* Buena práctica */}
                            {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-brand-dark mb-1">Ciudad / Región</label>
                        <select
                            id="location"
                            value={values.location || ''}
                            onChange={handleChange('location')}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                            required
                        >
                            <option value="">Selecciona una región</option> {/* Buena práctica */}
                            {CHILE_REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-brand-dark mb-1">Teléfono de la Empresa</label>
                        <input
                            type="tel"
                            id="phone"
                            value={values.phone || ''}
                            onChange={handleChange('phone')}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-brand-dark mb-1">Describe tu Servicio</label>
                        <textarea
                            id="description"
                            value={values.description || ''}
                            onChange={handleChange('description')}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="websiteUrl" className="block text-sm font-medium text-brand-dark mb-1">Página Web (Opcional)</label>
                        <input
                            type="url"
                            id="websiteUrl"
                            value={values.websiteUrl || ''}
                            onChange={handleChange('websiteUrl')}
                            placeholder="https://tuempresa.cl"
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="facebookUrl" className="block text-sm font-medium text-brand-dark mb-1">Facebook (Opcional)</label>
                        <input
                            type="url"
                            id="facebookUrl"
                            value={values.facebookUrl || ''}
                            onChange={handleChange('facebookUrl')}
                            placeholder="https://facebook.com/tuempresa"
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="instagramUrl" className="block text-sm font-medium text-brand-dark mb-1">Instagram (Opcional)</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">@</span>
                            <input
                                type="text"
                                id="instagramUrl"
                                value={values.instagramUrl || ''}
                                onChange={handleChange('instagramUrl')}
                                placeholder="tuempresa"
                                className="w-full p-3 pl-7 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="logoUpload" className="block text-sm font-medium text-brand-dark mb-1">Logo de la Empresa (Opcional)</label>
                        <input type="file" id="logoUpload" ref={logoFileInputRef} onChange={(e) => e.target.files && handleLogoUpload && handleLogoUpload(e.target.files[0])} accept="image/*" className="hidden"/>
                        <button
                            type="button"
                            onClick={() => logoFileInputRef.current?.click()}
                            disabled={isUploadingLogo}
                            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-brand-primary hover:text-brand-primary transition-colors disabled:opacity-50"
                        >
                            {isUploadingLogo ? <Spinner /> : (
                                <>
                                    <UploadCloudIcon className="w-8 h-8" />
                                    <span className="text-xs font-semibold mt-1">Subir Logo</span>
                                </>
                            )}
                        </button>
                        {values.logoUrl && (
                            <div className="mt-4 text-center">
                                <p className="text-sm text-brand-dark opacity-80 mb-2">Logo Actual:</p>
                                <img src={values.logoUrl} alt="Logo de la Empresa" className="max-w-xs max-h-32 mx-auto object-contain rounded-md" />
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <div className="flex justify-between">
                <button onClick={prevStep} type="button" className="flex items-center text-sm font-semibold text-brand-dark hover:text-brand-primary transition-colors">
                    <ArrowLeftIcon className="h-4 w-4 mr-2"/>
                    Volver
                </button>
                <button type="submit" className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent transition-colors">
                    Siguiente
                </button>
            </div>
        </form>
    );
};

export default Step2Contact;
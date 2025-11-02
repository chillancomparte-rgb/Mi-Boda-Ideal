import React, { useState, useRef } from 'react';
import { CHILE_REGIONS, VENDOR_CATEGORIES } from '../../constants';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { UploadCloudIcon } from '../icons/UploadCloudIcon';
import { uploadImageToHosting } from '../../services/hostingUploadService';
import Spinner from '../Spinner';

interface Step2ContactValues {
    companyName?: string;
    companyEmail?: string;
    category?: string;
    location?: string;
    phone?: string;
    description?: string;
    websiteUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    logoUrl?: string;
}

interface Step2ContactProps {
    nextStep: () => void;
    prevStep: () => void;
    handleChange: (input: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleLogoUpload?: (file: File) => Promise<void>;
    values: Step2ContactValues;
    isUploadingLogo?: boolean;
    isClientRegistration?: boolean;
}

const Step2Contact: React.FC<Step2ContactProps> = ({ nextStep, prevStep, handleChange, handleLogoUpload, values, isUploadingLogo, isClientRegistration }) => {
    const logoFileInputRef = useRef<HTMLInputElement>(null);

    const continueStep = (e: React.FormEvent) => {
        e.preventDefault();

        if (isClientRegistration) {
            // No validation needed for client registration in this step, as it's handled in Step1Account
            nextStep();
        } else {
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-brand-dark mb-1">Tu Nombre</label>
                        <input
                            type="text"
                            id="name"
                            value={values.name}
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
                            value={values.email}
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
                            value={values.phone}
                            onChange={handleChange('phone')}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-brand-dark mb-1">Tu Región</label>
                        <select
                            id="location"
                            value={values.location}
                            onChange={handleChange('location')}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                            required
                        >
                            {CHILE_REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="weddingDate" className="block text-sm font-medium text-brand-dark mb-1">Fecha de tu Boda</label>
                        <input
                            type="date"
                            id="weddingDate"
                            value={values.weddingDate}
                            onChange={handleChange('weddingDate')}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                </div>
            ) : (
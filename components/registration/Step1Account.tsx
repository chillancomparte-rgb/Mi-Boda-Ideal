import React from 'react';

interface Step1AccountProps {
    nextStep: () => void;
    handleChange: (input: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    values: any; // Will be a subset of RegistrationFormData or ClientRegistrationFormData
    isClientRegistration?: boolean;
}

const Step1Account: React.FC<Step1AccountProps> = ({ nextStep, handleChange, values, isClientRegistration }) => {
    const continueStep = (e: React.FormEvent) => {
        e.preventDefault();
        let isValid = false;

        if (isClientRegistration) {
            isValid = values.name && values.email && values.password && values.password.length >= 6;
        } else {
            isValid = values.contactPersonName && values.contactPersonLastName && values.contactPersonRut && values.contactPersonPhone && values.contactPersonEmail && values.password && values.password.length >= 6;
        }

        if (isValid) {
            nextStep();
        } else {
            alert('Por favor, completa todos los campos. La contraseña debe tener al menos 6 caracteres.');
        }
    };

    return (
        <form onSubmit={continueStep} className="animate-fade-in">
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">
                {isClientRegistration ? '1. Crea tu Cuenta' : '1. Datos Personales del Contacto'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {isClientRegistration ? (
                    <>
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
                            <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                value={values.email}
                                onChange={handleChange('email')}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                                required
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label htmlFor="contactPersonName" className="block text-sm font-medium text-brand-dark mb-1">Nombre</label>
                            <input
                                type="text"
                                id="contactPersonName"
                                value={values.contactPersonName}
                                onChange={handleChange('contactPersonName')}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="contactPersonLastName" className="block text-sm font-medium text-brand-dark mb-1">Apellido</label>
                            <input
                                type="text"
                                id="contactPersonLastName"
                                value={values.contactPersonLastName}
                                onChange={handleChange('contactPersonLastName')}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="contactPersonRut" className="block text-sm font-medium text-brand-dark mb-1">RUT</label>
                            <input
                                type="text"
                                id="contactPersonRut"
                                value={values.contactPersonRut}
                                onChange={handleChange('contactPersonRut')}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="contactPersonPhone" className="block text-sm font-medium text-brand-dark mb-1">Número de Contacto</label>
                            <input
                                type="tel"
                                id="contactPersonPhone"
                                value={values.contactPersonPhone}
                                onChange={handleChange('contactPersonPhone')}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="contactPersonEmail" className="block text-sm font-medium text-brand-dark mb-1">Correo Electrónico (para iniciar sesión)</label>
                            <input
                                type="email"
                                id="contactPersonEmail"
                                value={values.contactPersonEmail}
                                onChange={handleChange('contactPersonEmail')}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                                required
                            />
                        </div>
                    </>
                )}
                 <div>
                    <label htmlFor="password" className="block text-sm font-medium text-brand-dark mb-1">Crea una Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={values.password}
                        onChange={handleChange('password')}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                        minLength={6}
                        required
                    />
                </div>
            </div>
            <div className="flex justify-end items-center mt-6">
                <button type="submit" className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent transition-colors">
                    Siguiente
                </button>
            </div>
        </form>
    );
};

export default Step1Account;

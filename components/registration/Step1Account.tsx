import React from 'react';
import { VENDOR_CATEGORIES } from '../../constants';

interface Step1AccountProps {
    nextStep: () => void;
    handleChange: (input: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    values: any;
}

const Step1Account: React.FC<Step1AccountProps> = ({ nextStep, handleChange, values }) => {
    const continueStep = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (values.companyName && values.email && values.password.length >= 6) {
            nextStep();
        } else {
            alert('Por favor, completa todos los campos. La contraseña debe tener al menos 6 caracteres.');
        }
    };

    return (
        <form onSubmit={continueStep} className="animate-fade-in">
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">1. Información de tu Empresa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-brand-dark mb-1">Nombre de la Empresa</label>
                    <input
                        type="text"
                        id="companyName"
                        value={values.companyName}
                        onChange={handleChange('companyName')}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-brand-dark mb-1">Categoría Principal</label>
                    <select
                        id="category"
                        value={values.category}
                        onChange={handleChange('category')}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                        required
                    >
                        {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-1">Correo Electrónico de Contacto</label>
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
            <div className="flex justify-end">
                <button type="submit" className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent transition-colors">
                    Siguiente
                </button>
            </div>
        </form>
    );
};

export default Step1Account;
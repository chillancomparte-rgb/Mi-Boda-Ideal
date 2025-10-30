import React from 'react';
import { CHILE_REGIONS } from '../../constants';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';

interface Step2ContactProps {
    nextStep: () => void;
    prevStep: () => void;
    handleChange: (input: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    values: any;
}

const Step2Contact: React.FC<Step2ContactProps> = ({ nextStep, prevStep, handleChange, values }) => {
    const continueStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (values.phone && values.city) {
            nextStep();
        } else {
            alert('Por favor, completa el teléfono y la ciudad.');
        }
    };

    return (
        <form onSubmit={continueStep} className="animate-fade-in">
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">2. Información de Contacto y Ubicación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-brand-dark mb-1">Teléfono</label>
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
                    <label htmlFor="city" className="block text-sm font-medium text-brand-dark mb-1">Ciudad / Región</label>
                    <select
                        id="city"
                        value={values.city}
                        onChange={handleChange('city')}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                        required
                    >
                        {CHILE_REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="website" className="block text-sm font-medium text-brand-dark mb-1">Página Web (Opcional)</label>
                    <input
                        type="url"
                        id="website"
                        value={values.website}
                        onChange={handleChange('website')}
                        placeholder="https://tuempresa.cl"
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                    />
                </div>
                 <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-brand-dark mb-1">Instagram (Opcional)</label>
                    <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">@</span>
                         <input
                            type="text"
                            id="instagram"
                            value={values.instagram}
                            onChange={handleChange('instagram')}
                            placeholder="tuempresa"
                            className="w-full p-3 pl-7 border border-gray-300 rounded-md shadow-sm bg-white text-brand-dark focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                </div>
            </div>
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
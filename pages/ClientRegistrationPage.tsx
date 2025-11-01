import React, { useState } from 'react';
import SeoMeta from '../components/SeoMeta';
import type { Page } from '../types';
import { WeddingRingIcon } from '../components/icons/WeddingRingIcon';
import RegistrationProgress from '../components/registration/RegistrationProgress';
import Step1Account from '../components/registration/Step1Account'; // This will be adapted for clients
import Step2Contact from '../components/registration/Step2Contact'; // This will be adapted for clients
import Step3Gallery from '../components/registration/Step3Gallery'; // Not needed for clients
import Step4Confirmation from '../components/registration/Step4Confirmation'; // This will be adapted for clients

interface ClientRegistrationPageProps {
    navigate: (page: Page) => void;
}

const ClientRegistrationPage: React.FC<ClientRegistrationPageProps> = ({ navigate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        location: '',
        weddingDate: '',
        phone: '',
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleChange = (input: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [input]: e.target.value });
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1Account nextStep={nextStep} handleChange={handleChange} values={formData} isClientRegistration={true} />;
            case 2:
                return <Step2Contact nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={formData} isClientRegistration={true} />;
            case 3: // Confirmation for clients
                return <Step4Confirmation values={formData} navigate={navigate} isClientRegistration={true} />;
            default:
                return <div>Paso no encontrado</div>;
        }
    };
    
    return (
        <div className="min-h-screen bg-brand-light flex flex-col items-center py-10 px-4">
             <SeoMeta 
                title="Regístrate como Cliente | Mi Boda Ideal"
                description="Regístrate para planificar tu boda ideal y encontrar los mejores proveedores."
            />
            
            <div 
                className="flex items-center cursor-pointer mb-8"
                onClick={() => navigate('home')}
            >
                <WeddingRingIcon className="h-8 w-8 text-brand-primary" />
                <span className="ml-2 text-2xl font-serif font-bold text-brand-dark">Mi Boda Ideal</span>
            </div>

            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
                <div className="p-8 border-b">
                    <RegistrationProgress currentStep={step} />
                </div>
                <div className="p-8">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default ClientRegistrationPage;

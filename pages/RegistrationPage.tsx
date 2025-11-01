import React, { useState } from 'react';
import SeoMeta from '../components/SeoMeta';
import type { Page } from '../types';
import { WeddingRingIcon } from '../components/icons/WeddingRingIcon';
import RegistrationProgress from '../components/registration/RegistrationProgress';
import Step1Account from '../components/registration/Step1Account';
import Step2Contact from '../components/registration/Step2Contact';
import Step3Gallery from '../components/registration/Step3Gallery';
import Step4Confirmation from '../components/registration/Step4Confirmation';

interface RegistrationPageProps {
    navigate: (page: Page) => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ navigate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        category: 'Fotógrafos',
        email: '',
        password: '',
        phone: '',
        city: 'Metropolitana de Santiago',
        website: '',
        instagram: '',
        gallery: [] as string[] // Changed to dynamic array
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleChange = (input: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [input]: e.target.value });
    };
    
    const addGalleryImage = (url: string) => {
        if (formData.gallery.length >= 10) {
            alert("Puedes añadir un máximo de 10 imágenes.");
            return;
        }
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };


    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1Account nextStep={nextStep} handleChange={handleChange} values={formData} />;
            case 2:
                return <Step2Contact nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={formData} />;
            case 3:
                return <Step3Gallery nextStep={nextStep} prevStep={prevStep} addGalleryImage={addGalleryImage} removeGalleryImage={removeGalleryImage} values={formData} />;
            case 4:
                return <Step4Confirmation values={formData} navigate={navigate} />;
            default:
                return <div>Paso no encontrado</div>;
        }
    };
    
    return (
        <div className="min-h-screen bg-brand-light flex flex-col items-center py-10 px-4">
             <SeoMeta 
                title="Regístrate como Proveedor | Mi Boda Ideal"
                description="Únete a nuestra comunidad de profesionales de bodas y haz crecer tu negocio. Regístrate gratis."
            />
            
            <div 
                className="flex items-center cursor-pointer mb-8"
                onClick={() => navigate('home')}
            >
                <WeddingRingIcon className="h-8 w-8 text-brand-primary" />
                <span className="ml-2 text-2xl font-serif font-bold text-brand-dark">Mi Boda Ideal para Empresas</span>
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

export default RegistrationPage;

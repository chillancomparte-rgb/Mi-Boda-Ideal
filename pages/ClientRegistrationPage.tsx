import React, { useState } from 'react';
import SeoMeta from '../components/SeoMeta';
import type { Page } from '../types';
import { WeddingRingIcon } from '../components/icons/WeddingRingIcon';
import RegistrationProgress from '../components/registration/RegistrationProgress';
import Step1Account from '../components/registration/Step1Account'; // This will be adapted for clients
import Step2Contact from '../components/registration/Step2Contact'; // This will be adapted for clients
import Step4Confirmation from '../components/registration/Step4Confirmation'; // This will be adapted for clients
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface ClientRegistrationFormData {
    name: string;
    email: string;
    password: string;
    location: string;
    weddingDate: string;
    phone: string;
}

interface ClientRegistrationPageProps {
    navigate: (page: Page) => void;
}

const ClientRegistrationPage: React.FC<ClientRegistrationPageProps> = ({ navigate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<ClientRegistrationFormData>({
        name: '',
        email: '',
        password: '',
        location: '',
        weddingDate: '',
        phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleChange = (input: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [input]: e.target.value });
    };

    const submitClientRegistration = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // 1. Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const firebaseUser = userCredential.user;

            // 2. Save client data to Firestore
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                id: firebaseUser.uid,
                email: formData.email,
                name: formData.name,
                role: 'user', // Client role
                registeredDate: new Date().toISOString(),
                location: formData.location,
                weddingDate: formData.weddingDate,
                phone: formData.phone,
                avatarUrl: null, // Clients don't have a logo, maybe a default avatar
                registrationType: 'email',
            });

            setIsRegistrationSuccessful(true);
        } catch (error: any) {
            console.error("Error during client registration:", error);
            setSubmitError(error.message || 'Ocurrió un error desconocido durante el registro.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1Account nextStep={nextStep} handleChange={handleChange} values={formData} isClientRegistration={true} />;
            case 2:
                return <Step2Contact nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={formData} isClientRegistration={true} />;
            case 3: // Confirmation for clients
                return <Step4Confirmation 
                            values={formData} 
                            navigate={navigate} 
                            submitRegistration={submitClientRegistration} 
                            isSubmitting={isSubmitting} 
                            submitError={submitError} 
                            isRegistrationSuccessful={isRegistrationSuccessful} 
                            isClientRegistration={true} 
                        />;
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

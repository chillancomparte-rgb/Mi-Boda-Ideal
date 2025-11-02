import React, { useState } from 'react';
import SeoMeta from '../components/SeoMeta';
import type { Page } from '../types';
import { WeddingRingIcon } from '../components/icons/WeddingRingIcon';
import RegistrationProgress from '../components/registration/RegistrationProgress';
import Step1Account from '../components/registration/Step1Account';
import Step2Contact from '../components/registration/Step2Contact';
import Step3Gallery from '../components/registration/Step3Gallery';
import Step4Confirmation from '../components/registration/Step4Confirmation';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore';
import { uploadImageToHosting } from '../../services/hostingUploadService';

interface RegistrationFormData {
    contactPersonName: string;
    contactPersonLastName: string;
    contactPersonRut: string;
    contactPersonPhone: string;
    contactPersonEmail: string;
    password: string;
    companyName: string;
    companyEmail: string;
    category: string;
    location: string;
    phone: string;
    description: string;
    websiteUrl: string;
    instagramUrl: string;
    facebookUrl: string;
    logoUrl?: string; // Nuevo campo para el logo
    gallery: string[];
}

interface RegistrationPageProps {
    navigate: (page: Page) => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ navigate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<RegistrationFormData>({
        contactPersonName: '',
        contactPersonLastName: '',
        contactPersonRut: '',
        contactPersonPhone: '',
        contactPersonEmail: '',
        password: '',
        companyName: '',
        companyEmail: '',
        category: 'Fotógrafos',
        location: 'Metropolitana de Santiago',
        phone: '',
        description: '',
        websiteUrl: '',
        facebookUrl: '',
        instagramUrl: '',
        gallery: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false); // Nuevo estado para la carga del logo

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleChange = (input: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

    const handleLogoUpload = async (file: File) => {
        setIsUploadingLogo(true);
        try {
            const imageUrl = await uploadImageToHosting(file);
            setFormData(prev => ({ ...prev, logoUrl: imageUrl }));
        } catch (error) {
            alert("Error al subir el logo. Por favor, inténtalo de nuevo.");
            console.error(error);
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const submitRegistration = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // 1. Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, formData.contactPersonEmail, formData.password);
            const firebaseUser = userCredential.user;

            // 2. Save vendor data to Firestore
            await setDoc(doc(db, 'vendors', firebaseUser.uid), {
                id: firebaseUser.uid,
                name: formData.companyName,
                email: formData.companyEmail, // Email de la empresa
                category: formData.category,
                location: formData.location,
                phone: formData.phone, // Teléfono de la empresa
                description: formData.description,
                websiteUrl: formData.websiteUrl,
                instagramUrl: formData.instagramUrl,
                facebookUrl: formData.facebookUrl,
                gallery: formData.gallery,
                registeredDate: new Date().toISOString(),
                status: 'Pendiente', // Default status for new vendors
                isPremium: false,
                logoUrl: formData.logoUrl || null, // Usar el logo subido
                registrationType: 'email',
                // Datos personales del contacto (admin-only)
                contactPersonName: formData.contactPersonName,
                contactPersonLastName: formData.contactPersonLastName,
                contactPersonRut: formData.contactPersonRut,
                contactPersonPhone: formData.contactPersonPhone,
                contactPersonEmail: formData.contactPersonEmail, // Email del contacto personal
            });

            // 3. Also create a user entry in the 'users' collection for role management
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                id: firebaseUser.uid,
                email: formData.contactPersonEmail,
                name: formData.contactPersonName + ' ' + formData.contactPersonLastName,
                role: 'vendor',
                registeredDate: new Date().toISOString(),
                avatarUrl: formData.logoUrl || null, // Usar el logo como avatar del usuario
                registrationType: 'email',
            });

            setIsRegistrationSuccessful(true); // Set success state
            // nextStep(); // No longer needed here, Step4Confirmation will handle display
        } catch (error: any) {
            console.error("Error during vendor registration:", error);
            if (error.code === 'auth/email-already-in-use') {
                setSubmitError('Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza un correo diferente.');
            } else {
                setSubmitError(error.message || 'Ocurrió un error desconocido durante el registro.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1Account nextStep={nextStep} handleChange={handleChange} values={{
                    contactPersonName: formData.contactPersonName,
                    contactPersonLastName: formData.contactPersonLastName,
                    contactPersonRut: formData.contactPersonRut,
                    contactPersonPhone: formData.contactPersonPhone,
                    contactPersonEmail: formData.contactPersonEmail,
                    password: formData.password,
                }} />;
            case 2:
                return <Step2Contact nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} handleLogoUpload={handleLogoUpload} values={{
                    companyName: formData.companyName,
                    companyEmail: formData.companyEmail,
                    category: formData.category,
                    location: formData.location,
                    phone: formData.phone,
                    description: formData.description,
                    websiteUrl: formData.websiteUrl,
                    instagramUrl: formData.instagramUrl,
                    facebookUrl: formData.facebookUrl,
                    logoUrl: formData.logoUrl,
                }} isUploadingLogo={isUploadingLogo} />;
            case 3:
                return <Step3Gallery nextStep={nextStep} prevStep={prevStep} addGalleryImage={addGalleryImage} removeGalleryImage={removeGalleryImage} values={{ gallery: formData.gallery }} />;
            case 4:
                return <Step4Confirmation values={formData} navigate={navigate} submitRegistration={submitRegistration} isSubmitting={isSubmitting} submitError={submitError} isRegistrationSuccessful={isRegistrationSuccessful} />;
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

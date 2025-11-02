import React from 'react';
import type { Page } from '../../types';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import Spinner from '../Spinner';

interface Step4ConfirmationProps {
    values: any; // Will be RegistrationFormData
    navigate: (page: Page) => void;
    submitRegistration: () => Promise<void>;
    isSubmitting: boolean;
    submitError: string | null;
    isRegistrationSuccessful: boolean; // New prop
}

const Step4Confirmation: React.FC<Step4ConfirmationProps> = ({ values, navigate, submitRegistration, isSubmitting, submitError, isRegistrationSuccessful }) => {
    const { 
        contactPersonName, contactPersonLastName, contactPersonRut, contactPersonPhone, contactPersonEmail, 
        companyName, companyEmail, category, location, phone, description, websiteUrl, instagramUrl, facebookUrl, gallery
    } = values;

    return (
        <div className="text-center animate-fade-in py-8">
            {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {submitError}</span>
                </div>
            )}

            {!isRegistrationSuccessful ? (
                <>
                    <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">
                        Confirma tu Registro de Proveedor
                    </h2>
                    <p className="text-brand-dark opacity-80 max-w-lg mx-auto mb-8">
                        Por favor, revisa la información antes de confirmar.
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                        *Todos los datos ingresados pueden ser modificados posteriormente en tu perfil personal.
                    </p>

                    <div className="text-left max-w-2xl mx-auto mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
                        <h3 className="text-xl font-bold text-brand-dark mb-4">Datos Personales del Contacto</h3>
                        <p><strong>Nombre:</strong> {contactPersonName} {contactPersonLastName}</p>
                        <p><strong>RUT:</strong> {contactPersonRut}</p>
                        <p><strong>Teléfono:</strong> {contactPersonPhone}</p>
                        <p><strong>Email (Login):</strong> {contactPersonEmail}</p>

                        <h3 className="text-xl font-bold text-brand-dark mt-6 mb-4">Información de la Empresa</h3>
                        <p><strong>Nombre Empresa:</strong> {companyName}</p>
                        <p><strong>Email Empresa:</strong> {companyEmail}</p>
                        <p><strong>Categoría:</strong> {category}</p>
                        <p><strong>Ubicación:</strong> {location}</p>
                        <p><strong>Teléfono Empresa:</strong> {phone}</p>
                        <p><strong>Descripción:</strong> {description}</p>
                        {websiteUrl && <p><strong>Web:</strong> <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">{websiteUrl}</a></p>}
                        {facebookUrl && <p><strong>Facebook:</strong> <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">{facebookUrl}</a></p>}
                        {instagramUrl && <p><strong>Instagram:</strong> <a href={`https://instagram.com/${instagramUrl}`} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">@{instagramUrl}</a></p>}
                        {values.logoUrl && (
                            <div className="mt-4">
                                <strong>Logo:</strong>
                                <img src={values.logoUrl} alt="Logo de la empresa" className="w-32 h-32 object-contain rounded-md mt-2" />
                            </div>
                        )}
                        {gallery.length > 0 && (
                            <div className="mt-4">
                                <strong>Galería ({gallery.length} imágenes):</strong>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    {gallery.map((url, index) => (
                                        <img key={index} src={url} alt={`Galería ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {!isSubmitting && !submitError && (
                        <button
                            onClick={submitRegistration}
                            className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent transition-colors"
                            disabled={isSubmitting}
                        >
                            Confirmar y Registrar
                        </button>
                    )}
                    {isSubmitting && (
                        <div className="flex justify-center items-center mt-8">
                            <Spinner />
                            <span className="ml-2 text-brand-dark">Registrando...</span>
                        </div>
                    )}
                    {submitError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                            <strong className="font-bold">Error:</strong>
                            <span className="block sm:inline"> {submitError}</span>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">
                        ¡Felicitaciones, {companyName}!
                    </h2>
                    <p className="text-brand-dark opacity-80 max-w-lg mx-auto mb-8">
                        Tu perfil ha sido enviado y está en proceso de revisión. Nuestro equipo lo verificará en las próximas 24-48 horas. Recibirás una notificación por correo electrónico una vez que tu perfil esté activo en la plataforma.
                    </p>
                    <button
                        onClick={() => navigate('home')}
                        className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent transition-colors"
                    >
                        Volver a la Página Principal
                    </button>
                </>
            )}
        </div>
    );
};

export default Step4Confirmation;
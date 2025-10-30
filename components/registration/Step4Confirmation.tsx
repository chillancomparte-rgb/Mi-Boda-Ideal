import React from 'react';
import type { Page } from '../../types';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface Step4ConfirmationProps {
    values: any;
    navigate: (page: Page) => void;
}

const Step4Confirmation: React.FC<Step4ConfirmationProps> = ({ values, navigate }) => {
    return (
        <div className="text-center animate-fade-in py-8">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">¡Felicitaciones, {values.companyName}!</h2>
            <p className="text-brand-dark opacity-80 max-w-lg mx-auto mb-8">
                Tu perfil ha sido enviado y está en proceso de revisión. Nuestro equipo lo verificará en las próximas 24-48 horas.
                Recibirás una notificación por correo electrónico una vez que tu perfil esté activo en la plataforma.
            </p>
            <button
                onClick={() => navigate('home')}
                className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accent transition-colors"
            >
                Volver a la Página Principal
            </button>
        </div>
    );
};

export default Step4Confirmation;

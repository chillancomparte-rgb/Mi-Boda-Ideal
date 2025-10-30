import React from 'react';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface RegistrationProgressProps {
    currentStep: number;
}

const RegistrationProgress: React.FC<RegistrationProgressProps> = ({ currentStep }) => {
    const steps = [
        "Cuenta",
        "Contacto",
        "Galería",
        "Finalizado"
    ];

    return (
        <div className="w-full px-4 sm:px-0">
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isActive = currentStep === stepNumber;

                    return (
                        <React.Fragment key={step}>
                            <div className="flex items-center relative">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                                    isActive ? 'bg-brand-primary text-white scale-110' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {isCompleted ? <CheckCircleIcon className="w-6 h-6"/> : <span className="font-bold">{stepNumber}</span>}
                                </div>
                                <div className={`absolute top-0 -ml-10 text-center mt-12 w-32 text-xs font-medium uppercase ${isActive ? 'text-brand-primary' : 'text-gray-500'}`}>
                                    {step}
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${isCompleted ? 'border-green-500' : 'border-gray-200'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default RegistrationProgress;

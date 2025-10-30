import React from 'react';
import type { WeddingInfo } from '../../types';
import { DollarIcon } from '../icons/DollarIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { EditIcon } from '../icons/EditIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface WeddingSummaryProps {
    info: WeddingInfo;
    onEdit: () => void;
    onShowSuggestions: () => void;
}

const WeddingSummary: React.FC<WeddingSummaryProps> = ({ info, onEdit, onShowSuggestions }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in-down">
            <div className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-2 text-center sm:text-left">
                <div className="mb-2 sm:mb-0">
                    <p className="font-bold text-brand-dark text-lg">{info.userName} & {info.partnerName}</p>
                    <p className="text-xs text-brand-dark opacity-70">{info.commune}</p>
                </div>
                <div className="flex items-center">
                    <DollarIcon className="h-5 w-5 mr-2 text-green-500" />
                    <div>
                        <p className="text-xs text-brand-dark opacity-70">Presupuesto</p>
                        <p className="font-bold text-brand-dark">${info.budget.toLocaleString('es-CL')}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                        <p className="text-xs text-brand-dark opacity-70">Invitados</p>
                        <p className="font-bold text-brand-dark">{info.guests}</p>
                    </div>
                </div>
                 <button onClick={onEdit} className="flex items-center text-xs text-brand-dark opacity-70 hover:opacity-100 font-medium">
                    <EditIcon className="h-4 w-4 mr-1"/>
                    Editar
                </button>
            </div>
            <button 
                onClick={onShowSuggestions}
                className="bg-gradient-to-r from-brand-primary to-pink-400 text-white font-bold py-3 px-6 rounded-full flex items-center shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Ver Proveedores Sugeridos
            </button>
        </div>
    );
};

export default WeddingSummary;
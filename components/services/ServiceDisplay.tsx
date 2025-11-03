import React from 'react';
import { Service, Vendor, User } from '../../types';
import PhotographyServiceDisplay from './PhotographyServiceDisplay';
import { GenericServiceDisplay } from './GenericServiceDisplay';

interface ServiceDisplayProps {
    service: Service;
    vendor: Vendor;
    isEditing: boolean;
    onEdit: () => void;
    onSave: (updatedService: Partial<Service>) => void;
    onCancelEdit: () => void;
    currentUser: User | null;
}

const ServiceDisplay: React.FC<ServiceDisplayProps> = ({ service, vendor, isEditing, onEdit, onSave, onCancelEdit, currentUser }) => {
    const renderSpecificDisplay = () => {
        if (service.category.includes('Fotógrafos')) {
            return <PhotographyServiceDisplay service={service} vendor={vendor} currentUser={currentUser} />;
        }
        return <GenericServiceDisplay service={service} vendor={vendor} currentUser={currentUser} />;
    };

    return (
        <div>
            {!isEditing && (
                <div className="flex justify-end mb-4">
                    <button onClick={onEdit} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent">
                        Editar Servicio
                    </button>
                </div>
            )}

            {renderSpecificDisplay()}

            {isEditing && (
                <div className="flex justify-end space-x-4 pt-4">
                    <button onClick={onCancelEdit} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button onClick={() => onSave(service)} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent">
                        Guardar Cambios
                    </button>
                </div>
            )}
        </div>
    );
};

export default ServiceDisplay;
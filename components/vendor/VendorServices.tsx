import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getServices, deleteService } from '../../services/firebase'; // Importar getServices y deleteService de firebase.ts
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { TrashIcon } from '../icons/TrashIcon';
import Spinner from '../Spinner';
import { MapPinIcon } from '../icons/MapPinIcon';
import { Service } from '../../types';

interface VendorServicesProps {
    openModal: (service?: Service | null) => void;
    services: Service[];
    setServices: React.Dispatch<React.SetStateAction<Service[]>>;
    vendorId: string | null;
    onViewPublication: (serviceId: string) => void;
}

const VendorServices: React.FC<VendorServicesProps> = ({ openModal, services, setServices, vendorId, onViewPublication }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            if (!vendorId) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                // Usar la función getServices de firebase.ts
                const fetchedServices = await getServices(vendorId);
                setServices(fetchedServices);
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, [vendorId, setServices]);

    const handleDelete = async (id: string) => {
        if (!vendorId) return;
        try {
            // Usar la función deleteService de firebase.ts
            await deleteService(vendorId, id);
            setServices(services.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-brand-dark">Mis Servicios</h3>
                <button
                    onClick={() => openModal()}
                    className="bg-brand-primary text-white font-bold py-2 px-4 rounded-full hover:bg-brand-accent transition-colors flex items-center"
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Añadir Servicio
                </button>
            </div>

            {services.length === 0 && !isLoading ? (
                <p className="text-gray-500">Aún no has añadido ningún servicio. ¡Haz clic en "Añadir Servicio" para empezar!</p>
            ) : (
                <div className="space-y-4">
                    {services.map(service => (
                        <div key={service.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-semibold bg-brand-accent text-white px-2 py-1 rounded-full">
    {
        Array.isArray(service.category)
            ? service.category.filter(item => typeof item === 'string').join(', ')
            : (typeof service.category === 'string' ? service.category : 'Categoría no especificada')
    }
</span>
                                    <h4 className="font-bold text-lg text-brand-dark mt-2">{service.name}</h4>
                                    <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                                </div>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                    <button onClick={() => onViewPublication(service.id)} className="text-gray-500 hover:text-brand-primary p-2">
                                        <EyeIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleDelete(service.id)} className="text-gray-500 hover:text-red-600 p-2">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-end mt-2 pt-2 border-t">
                                <div className="flex items-center text-sm text-gray-500">
                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                    {service.locations && service.locations.length > 0 ? service.locations.join(', ') : 'Sin especificar'}
                                </div>
                                <p className="text-brand-primary font-semibold text-lg">Desde ${service.price.toLocaleString('es-CL')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VendorServices;
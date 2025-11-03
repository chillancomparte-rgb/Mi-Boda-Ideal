import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Vendor, Service } from '../../types';
import Spinner from '../Spinner';
import { XIcon } from '../icons/XIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon'; // Importar PlusCircleIcon
import AdminServiceModal from './AdminServiceModal'; // Importar el nuevo modal

interface AdminVendorServicesModalProps {
    vendor: Vendor;
    onClose: () => void;
    onViewService: (serviceId: string) => void; // To view the service publication
    // onEditService: (service: Service) => void; // Ya no se pasa directamente, se maneja internamente
}

const AdminVendorServicesModal: React.FC<AdminVendorServicesModalProps> = ({ vendor, onClose, onViewService }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false); // Nuevo estado para el modal de servicio
    const [editingService, setEditingService] = useState<Service | null>(null); // Nuevo estado para el servicio a editar

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const servicesCollectionRef = collection(db, 'vendors', vendor.id, 'services');
            const servicesSnapshot = await getDocs(servicesCollectionRef);
            const servicesList = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
            setServices(servicesList);
        } catch (error) {
            console.error("Error fetching vendor services:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [vendor.id]);

    const handleDeleteService = async (serviceId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
            try {
                await deleteDoc(doc(db, 'vendors', vendor.id, 'services', serviceId));
                setServices(services.filter(s => s.id !== serviceId));
            } catch (error) {
                console.error("Error deleting service:", error);
            }
        }
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setIsServiceModalOpen(true);
    };

    const handleAddService = () => {
        setEditingService(null); // Para asegurar que es un nuevo servicio
        setIsServiceModalOpen(true);
    };

    const handleCloseServiceModal = () => {
        setIsServiceModalOpen(false);
        setEditingService(null);
    };

    const handleServiceSaveSuccess = () => {
        fetchServices(); // Recargar la lista de servicios
        handleCloseServiceModal();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Servicios de {vendor.name}</h2>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleAddService} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent flex items-center">
                            <PlusCircleIcon className="h-5 w-5 mr-2"/>
                            Añadir Servicio
                        </button>
                        <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800"/></button>
                    </div>
                </div>
                <div className="p-6 flex-grow overflow-y-auto">
                    {isLoading ? (
                        <Spinner />
                    ) : services.length === 0 ? (
                        <p className="text-gray-500">Este proveedor aún no tiene servicios registrados.</p>
                    ) : (
                        <div className="space-y-4">
                            {services.map(service => (
                                <div key={service.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg text-brand-dark">{service.name}</h3>
                                        <p className="text-sm text-gray-600">{service.category.join(', ')}</p>
                                        <p className="text-sm text-gray-500">${service.price.toLocaleString('es-CL')}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => onViewService(service.id)} className="text-gray-400 hover:text-green-600" title="Ver Publicación">
                                            <EyeIcon className="h-5 w-5"/>
                                        </button>
                                        <button onClick={() => handleEditService(service)} className="text-gray-400 hover:text-blue-600" title="Editar Servicio">
                                            <EditIcon className="h-5 w-5"/>
                                        </button>
                                        <button onClick={() => handleDeleteService(service.id)} className="text-gray-400 hover:text-red-700" title="Eliminar Servicio">
                                            <TrashIcon className="h-5 w-5"/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-6 border-t bg-gray-50 flex justify-end">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cerrar</button>
                </div>
            </div>

            {isServiceModalOpen && (
                <AdminServiceModal
                    vendorId={vendor.id}
                    service={editingService}
                    onClose={handleCloseServiceModal}
                    onSaveSuccess={handleServiceSaveSuccess}
                />
            )}
        </div>
    );
};

export default AdminVendorServicesModal;

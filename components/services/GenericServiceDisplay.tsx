import React from 'react';
import { Service, AdminVendor, User } from '../../types';
import { MapPinIcon } from '../icons/MapPinIcon';
import ServiceGalleryDisplay from './ServiceGalleryDisplay';

interface GenericServiceDisplayProps {
    service: Service;
    vendor: AdminVendor;
    currentUser: User | null;
}

export const GenericServiceDisplay: React.FC<GenericServiceDisplayProps> = ({ service, vendor, currentUser }) => {
    const isAuthenticated = !!currentUser;

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4">{service.name}</h3>
            <p className="text-gray-600 text-sm mt-1">Categorías: {service.category.join(', ')}</p>
            <p className="text-gray-700 mb-4">{service.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {service.locations && service.locations.length > 0 ? service.locations.join(', ') : 'Sin especificar'}
            </div>
            <p className="text-brand-primary font-semibold text-xl mb-4">Precio desde: ${service.price.toLocaleString('es-CL')}</p>

            {/* Información del Proveedor */}
            <div className="border-t pt-4 mt-4">
                <h4 className="text-xl font-bold text-brand-dark mb-4">Información del Proveedor</h4>
                <div className="flex items-center space-x-4">
                    {vendor.logoUrl ? (
                        <img src={vendor.logoUrl} alt="Logo Proveedor" className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">Logo</div>
                    )}
                    <div>
                        <p className="font-bold text-lg">{vendor.name}</p>
                        <p className="text-gray-600">{vendor.email}</p>
                        {isAuthenticated && vendor.phone && <p className="text-gray-600">Teléfono: {vendor.phone}</p>}
                        {!isAuthenticated && (
                            <p className="text-gray-500">Inicia sesión para ver el teléfono</p>
                        )}
                    </div>
                </div>
                {isAuthenticated && (
                    <div className="mt-4">
                        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Solicitar Presupuesto</button>
                        <button className="ml-2 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600">Guardar a Favoritos</button>
                        <button className="ml-2 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">Ver Perfil del Proveedor</button>
                    </div>
                )}
                {!isAuthenticated && (
                    <div className="mt-4 text-gray-500">
                        Inicia sesión para solicitar presupuesto, guardar a favoritos o ver el perfil completo del proveedor.
                    </div>
                )}
            </div>

            {/* Galería de Imágenes del Servicio */}
            {service.gallery && service.gallery.length > 0 && (
                <ServiceGalleryDisplay gallery={service.gallery} currentUser={currentUser} />
            )}
        </div>
    );
};

export default GenericServiceDisplay;
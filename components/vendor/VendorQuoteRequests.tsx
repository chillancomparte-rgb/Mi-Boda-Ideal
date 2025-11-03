import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getQuoteRequests, updateQuoteRequest } from '../../services/firebase';
import type { QuoteRequest } from '../../types';
import Spinner from '../Spinner';
import { CheckCircleIcon, XCircleIcon, EyeIcon } from '../icons/index'; // Asumiendo que tienes estos iconos

const VendorQuoteRequests: React.FC = () => {
    const { user } = useAuth();
    const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuoteRequests = async () => {
            if (!user || !user.uid) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                // Asumiendo que el user.uid del proveedor es el vendorId
                const fetchedRequests = await getQuoteRequests(undefined, user.uid);
                setQuoteRequests(fetchedRequests);
            } catch (err) {
                console.error("Error fetching quote requests:", err);
                setError("No se pudieron cargar las solicitudes de cotización.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuoteRequests();
    }, [user]);

    const handleUpdateStatus = async (requestId: string, newStatus: QuoteRequest['status']) => {
        try {
            await updateQuoteRequest(requestId, { status: newStatus });
            setQuoteRequests(prevRequests =>
                prevRequests.map(req => (req.id === requestId ? { ...req, status: newStatus } : req))
            );
        } catch (error) {
            console.error("Error updating quote request status:", error);
            alert("Hubo un error al actualizar el estado de la solicitud.");
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-6">Solicitudes de Cotización</h3>

            {quoteRequests.length === 0 ? (
                <p className="text-gray-500">No tienes solicitudes de cotización pendientes.</p>
            ) : (
                <div className="space-y-4">
                    {quoteRequests.map(request => (
                        <div key={request.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-sm text-gray-600">Cliente: <span className="font-semibold">{request.clientId}</span></p> {/* TODO: Mostrar nombre real del cliente */}
                                    <p className="text-sm text-gray-600">Servicio: <span className="font-semibold">{request.serviceId}</span></p> {/* TODO: Mostrar nombre real del servicio */}
                                    <p className="text-sm text-gray-600">Fecha Evento: <span className="font-semibold">{request.eventDate || 'No especificada'}</span></p>
                                    <p className="text-sm text-gray-600">Mensaje: <span className="italic">"{request.message}"</span></p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        request.status === 'responded' ? 'bg-blue-100 text-blue-800' :
                                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {request.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 border-t pt-3 mt-3">
                                <button
                                    onClick={() => handleUpdateStatus(request.id, 'responded')}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
                                    disabled={request.status === 'responded' || request.status === 'accepted' || request.status === 'rejected'}
                                >
                                    Marcar como Respondido
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(request.id, 'accepted')}
                                    className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 disabled:opacity-50"
                                    disabled={request.status === 'accepted' || request.status === 'rejected'}
                                >
                                    Aceptar
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(request.id, 'rejected')}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 disabled:opacity-50"
                                    disabled={request.status === 'accepted' || request.status === 'rejected'}
                                >
                                    Rechazar
                                </button>
                                {/* TODO: Botón para ver detalles del servicio o cliente */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VendorQuoteRequests;

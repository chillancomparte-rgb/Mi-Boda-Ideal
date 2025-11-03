import React, { useState, useContext } from 'react';
import { XIcon } from '../icons/XIcon';
import { AuthContext } from '../../contexts/AuthContext';
import { addQuoteRequest } from '../../services/firebase';
import type { Service } from '../../types';

interface QuoteRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    vendorId: string;
    service: Service; // Pasar el servicio completo para mostrar detalles
}

const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({ isOpen, onClose, vendorId, service }) => {
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !user.uid) {
            alert("Debes iniciar sesión para solicitar un presupuesto.");
            return;
        }
        if (!message.trim()) {
            alert("Por favor, escribe un mensaje para el proveedor.");
            return;
        }

        setIsSubmitting(true);
        setSubmitSuccess(null);

        try {
            await addQuoteRequest({
                clientId: user.uid,
                vendorId: vendorId,
                serviceId: service.id,
                message: message,
                eventDate: eventDate || undefined, // Opcional
            });
            setSubmitSuccess(true);
            setMessage('');
            setEventDate('');
            // onClose(); // Podrías cerrar el modal automáticamente o dejar que el usuario lo cierre
        } catch (error) {
            console.error("Error submitting quote request: ", error);
            setSubmitSuccess(false);
            alert("Hubo un error al enviar tu solicitud. Inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Solicitar Presupuesto para {service.name}</h2>
                    <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800"/></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <p className="text-gray-700">Estás a punto de solicitar un presupuesto a <span className="font-semibold">{service.name}</span> de este proveedor.</p>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Tu Mensaje al Proveedor</label>
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                                placeholder="Describe tus necesidades, fecha del evento, etc."
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Fecha del Evento (Opcional)</label>
                            <input
                                type="date"
                                id="eventDate"
                                name="eventDate"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                        {submitSuccess === true && (
                            <p className="text-green-600 font-semibold">¡Solicitud enviada con éxito! El proveedor se pondrá en contacto contigo pronto.</p>
                        )}
                        {submitSuccess === false && (
                            <p className="text-red-600 font-semibold">Error al enviar la solicitud. Por favor, inténtalo de nuevo.</p>
                        )}
                    </div>
                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={isSubmitting || !user} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent disabled:bg-gray-400">
                            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuoteRequestModal;
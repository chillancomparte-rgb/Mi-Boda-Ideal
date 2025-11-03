import React, { useState, useContext } from 'react';
import { XIcon } from '../icons/XIcon';
import { StarIcon } from '../icons/StarIcon';
import { AuthContext } from '../../contexts/AuthContext';
import { addReview } from '../../services/firebase';
import type { Service } from '../../types'; // Podría ser para un servicio específico o para el proveedor

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    vendorId: string;
    serviceId?: string; // Opcional, si la reseña es para un servicio específico
    onReviewSubmitted: () => void; // Callback para refrescar las reseñas
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, vendorId, serviceId, onReviewSubmitted }) => {
    const { user } = useContext(AuthContext);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !user.uid) {
            alert("Debes iniciar sesión para dejar una reseña.");
            return;
        }
        if (rating === 0) {
            alert("Por favor, selecciona una calificación.");
            return;
        }
        if (!comment.trim()) {
            alert("Por favor, escribe un comentario para tu reseña.");
            return;
        }

        setIsSubmitting(true);
        setSubmitSuccess(null);

        try {
            await addReview({
                clientId: user.uid,
                vendorId: vendorId,
                serviceId: serviceId,
                rating: rating,
                comment: comment,
            });
            setSubmitSuccess(true);
            setRating(0);
            setComment('');
            onReviewSubmitted(); // Notificar al componente padre que la reseña fue enviada
            // onClose(); // Podrías cerrar el modal automáticamente
        } catch (error) {
            console.error("Error submitting review: ", error);
            setSubmitSuccess(false);
            alert("Hubo un error al enviar tu reseña. Inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Dejar una Reseña</h2>
                    <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800"/></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tu Calificación</label>
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <React.Fragment key={star}> {/* Mover la key aquí */}
                                        <StarIcon
                                            className={`h-8 w-8 cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                            onClick={() => setRating(star)}
                                            fill="currentColor"
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Tu Comentario</label>
                            <textarea
                                id="comment"
                                name="comment"
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                                placeholder="Comparte tu experiencia..."
                                required
                            ></textarea>
                        </div>
                        {submitSuccess === true && (
                            <p className="text-green-600 font-semibold">¡Reseña enviada con éxito! Gracias por tu opinión.</p>
                        )}
                        {submitSuccess === false && (
                            <p className="text-red-600 font-semibold">Error al enviar la reseña. Por favor, inténtalo de nuevo.</p>
                        )}
                    </div>
                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={isSubmitting || !user} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-accent disabled:bg-gray-400">
                            {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
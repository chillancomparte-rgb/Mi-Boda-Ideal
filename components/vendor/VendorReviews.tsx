import React, { useEffect, useState } from 'react';
import { Review } from '../../types';
import { getReviews } from '../../services/firebase';
import Spinner from '../Spinner';
import { StarIcon } from '../icons/StarIcon';

interface VendorReviewsProps {
    vendorId: string;
}

const VendorReviews: React.FC<VendorReviewsProps> = ({ vendorId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedReviews = await getReviews(vendorId);
                setReviews(fetchedReviews);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setError("No se pudieron cargar las reseñas.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [vendorId]);

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    if (reviews.length === 0) {
        return <div className="text-gray-600 text-center py-4">Este proveedor aún no tiene reseñas.</div>;
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <div className="flex items-center mb-3">
                        <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon
                                    key={i}
                                    className={`w-5 h-5 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                    fill="currentColor"
                                />
                            ))}
                        </div>
                        <span className="ml-3 text-gray-800 font-semibold">{review.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                    <div className="text-sm text-gray-500">
                        <p>Por: {review.clientId} {/* TODO: Obtener el nombre real del cliente */}</p>
                        <p>Fecha: {new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VendorReviews;

import React from 'react';
import { StarIcon } from '../icons/StarIcon';

interface Review {
    author: string;
    rating: number;
    comment: string;
}

interface VendorReviewsProps {
    reviews: Review[];
}

const VendorReviews: React.FC<VendorReviewsProps> = ({ reviews }) => {

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <StarIcon
                        key={i}
                        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-2xl font-serif font-bold text-brand-dark border-b pb-2 mb-6">Opiniones de Parejas</h2>
            <div className="space-y-8">
                {reviews.map((review, index) => (
                    <div key={index} className="flex items-start">
                        <div className="w-12 h-12 rounded-full bg-brand-secondary flex items-center justify-center font-bold text-brand-primary mr-4 shrink-0">
                            {review.author.charAt(0)}
                        </div>
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center mb-1">
                                <p className="font-bold text-brand-dark mr-3">{review.author}</p>
                                {renderStars(review.rating)}
                            </div>
                            <p className="text-brand-dark opacity-90">{review.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendorReviews;
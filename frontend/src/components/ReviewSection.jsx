import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, User, AlertCircle } from 'lucide-react';
import reviewService from '../services/reviewService';
import { formatDate } from '../utils/formatDate';
import { cn } from '../lib/utils';

const ReviewSection = ({ equipmentId, userBookingId, onReviewAdded }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [equipmentId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await reviewService.getEquipmentReviews(equipmentId);
            setReviews(data.reviews || []);
            setAverageRating(data.averageRating || 0);
            setTotalReviews(data.totalReviews || 0);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await reviewService.createReview({
                equipment_id: equipmentId,
                booking_id: userBookingId,
                rating: formData.rating,
                comment: formData.comment
            });

            setFormData({ rating: 5, comment: '' });
            setShowForm(false);
            await fetchReviews();
            onReviewAdded?.();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={cn(
                            'w-4 h-4',
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        )}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Rating Summary */}
            <div className="bg-gradient-to-br from-agro-50 to-green-50 rounded-3xl p-8 border border-agro-100">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Customer Reviews</h3>
                        <p className="text-sm text-gray-600">{totalReviews} reviews from verified renters</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black text-agro-600">{averageRating.toFixed(1)}</div>
                        <div className="flex gap-1 mt-2 justify-end">
                            {renderStars(Math.round(averageRating))}
                        </div>
                    </div>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => r.rating === rating).length;
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                        return (
                            <div key={rating} className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-600 w-8">{rating}★</span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-gray-600 w-8 text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Write Review Button */}
            {userBookingId && !showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-agro-600 hover:bg-agro-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                    <MessageSquare className="w-5 h-5" />
                    Share Your Experience
                </button>
            )}

            {/* Review Form */}
            {showForm && (
                <form onSubmit={handleSubmitReview} className="bg-white border-2 border-agro-100 rounded-3xl p-8 space-y-6">
                    <h4 className="text-lg font-black text-gray-900">Write a Review</h4>

                    {error && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Rating Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={cn(
                                            'w-8 h-8 cursor-pointer',
                                            star <= formData.rating
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-gray-300'
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                        <textarea
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            placeholder="Share your experience with this equipment..."
                            rows="4"
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-agro-600 hover:bg-agro-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to review!</div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-agro-200 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-agro-100 flex items-center justify-center text-agro-600 font-bold">
                                        {review.user_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{review.user_name}</p>
                                        <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
                                    </div>
                                </div>
                                <div>{renderStars(review.rating)}</div>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;

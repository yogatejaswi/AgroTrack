import Review from '../models/reviewModel.js';

export const createReview = async (req, res) => {
    try {
        const { equipment_id, booking_id, rating, comment } = req.body;
        const user_id = req.user.id;

        if (!equipment_id || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating or equipment ID' });
        }

        const review = await Review.create({
            user_id,
            equipment_id,
            booking_id,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEquipmentReviews = async (req, res) => {
    try {
        const { equipmentId } = req.params;
        const reviews = await Review.getByEquipmentId(equipmentId);
        const ratingData = await Review.getAverageRating(equipmentId);

        res.json({
            reviews,
            averageRating: ratingData.average_rating || 0,
            totalReviews: ratingData.total_reviews || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await Review.getByUserId(userId);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating' });
        }

        const review = await Review.update(id, { rating, comment });
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        await Review.delete(id);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

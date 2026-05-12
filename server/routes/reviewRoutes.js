import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createReview,
    getEquipmentReviews,
    getUserReviews,
    updateReview,
    deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

// Public routes
router.get('/equipment/:equipmentId', getEquipmentReviews);

// Protected routes
router.post('/', protect, createReview);
router.get('/user/my-reviews', protect, getUserReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;

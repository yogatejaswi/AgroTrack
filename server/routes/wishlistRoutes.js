import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    addToWishlist,
    removeFromWishlist,
    getUserWishlist,
    checkWishlist
} from '../controllers/wishlistController.js';

const router = express.Router();

// Protected routes
router.post('/', protect, addToWishlist);
router.delete('/:equipment_id', protect, removeFromWishlist);
router.get('/', protect, getUserWishlist);
router.get('/check/:equipment_id', protect, checkWishlist);

export default router;

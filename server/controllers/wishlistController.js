import Wishlist from '../models/wishlistModel.js';

export const addToWishlist = async (req, res) => {
    try {
        const { equipment_id } = req.body;
        const user_id = req.user.id;

        if (!equipment_id) {
            return res.status(400).json({ message: 'Equipment ID is required' });
        }

        const result = await Wishlist.addToWishlist(user_id, equipment_id);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { equipment_id } = req.params;
        const user_id = req.user.id;

        await Wishlist.removeFromWishlist(user_id, equipment_id);
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserWishlist = async (req, res) => {
    try {
        const user_id = req.user.id;
        const wishlist = await Wishlist.getUserWishlist(user_id);
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const checkWishlist = async (req, res) => {
    try {
        const { equipment_id } = req.params;
        const user_id = req.user.id;

        const isInWishlist = await Wishlist.isInWishlist(user_id, equipment_id);
        res.json({ isInWishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

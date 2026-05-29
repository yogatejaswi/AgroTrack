import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    equipment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

// Ensure unique combination of user and equipment
wishlistSchema.index({ user_id: 1, equipment_id: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;

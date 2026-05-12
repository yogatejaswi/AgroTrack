import api from './api';

const wishlistService = {
    addToWishlist: async (equipmentId) => {
        const response = await api.post('/wishlist', { equipment_id: equipmentId });
        return response.data;
    },

    removeFromWishlist: async (equipmentId) => {
        const response = await api.delete(`/wishlist/${equipmentId}`);
        return response.data;
    },

    getUserWishlist: async () => {
        const response = await api.get('/wishlist');
        return response.data;
    },

    checkWishlist: async (equipmentId) => {
        const response = await api.get(`/wishlist/check/${equipmentId}`);
        return response.data;
    }
};

export default wishlistService;

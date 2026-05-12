import api from './api';

const reviewService = {
    createReview: async (data) => {
        const response = await api.post('/reviews', data);
        return response.data;
    },

    getEquipmentReviews: async (equipmentId) => {
        const response = await api.get(`/reviews/equipment/${equipmentId}`);
        return response.data;
    },

    getUserReviews: async () => {
        const response = await api.get('/reviews/user/my-reviews');
        return response.data;
    },

    updateReview: async (id, data) => {
        const response = await api.put(`/reviews/${id}`, data);
        return response.data;
    },

    deleteReview: async (id) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    }
};

export default reviewService;

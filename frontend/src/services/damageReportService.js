import api from './api';

const damageReportService = {
    createDamageReport: async (data) => {
        const response = await api.post('/damage-reports', data);
        return response.data;
    },

    getDamageReportsByBooking: async (bookingId) => {
        const response = await api.get(`/damage-reports/booking/${bookingId}`);
        return response.data;
    },

    getDamageReportsByEquipment: async (equipmentId) => {
        const response = await api.get(`/damage-reports/equipment/${equipmentId}`);
        return response.data;
    },

    updateDamageReportStatus: async (id, status, resolutionNotes) => {
        const response = await api.put(`/damage-reports/${id}/status`, {
            status,
            resolution_notes: resolutionNotes
        });
        return response.data;
    },

    getAllDamageReports: async () => {
        const response = await api.get('/damage-reports');
        return response.data;
    }
};

export default damageReportService;

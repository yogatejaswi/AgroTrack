import pool from '../config/db.js';

const DamageReport = {
    create: async (data) => {
        const { booking_id, equipment_id, user_id, report_type, description, severity, images_url, status = 'pending' } = data;
        
        const [result] = await pool.query(
            'INSERT INTO damage_reports (booking_id, equipment_id, user_id, report_type, description, severity, images_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [booking_id, equipment_id, user_id, report_type, description, severity, images_url, status]
        );
        return { id: result.insertId, ...data };
    },

    getByBookingId: async (bookingId) => {
        const [rows] = await pool.query(
            `SELECT dr.*, u.name as reported_by, e.name as equipment_name 
             FROM damage_reports dr
             JOIN users u ON dr.user_id = u.id
             JOIN equipment e ON dr.equipment_id = e.id
             WHERE dr.booking_id = ?`,
            [bookingId]
        );
        return rows;
    },

    getByEquipmentId: async (equipmentId) => {
        const [rows] = await pool.query(
            `SELECT dr.*, u.name as reported_by, b.id as booking_id 
             FROM damage_reports dr
             JOIN users u ON dr.user_id = u.id
             JOIN bookings b ON dr.booking_id = b.id
             WHERE dr.equipment_id = ?
             ORDER BY dr.created_at DESC`,
            [equipmentId]
        );
        return rows;
    },

    updateStatus: async (id, status, resolution_notes) => {
        await pool.query(
            'UPDATE damage_reports SET status = ?, resolution_notes = ? WHERE id = ?',
            [status, resolution_notes, id]
        );
        return { id, status };
    },

    getAll: async () => {
        const [rows] = await pool.query(
            `SELECT dr.*, u.name as reported_by, e.name as equipment_name 
             FROM damage_reports dr
             JOIN users u ON dr.user_id = u.id
             JOIN equipment e ON dr.equipment_id = e.id
             ORDER BY dr.created_at DESC`
        );
        return rows;
    }
};

export default DamageReport;

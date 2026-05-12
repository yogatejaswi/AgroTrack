import pool from '../config/db.js';

const Review = {
    create: async (data) => {
        const { user_id, equipment_id, booking_id, rating, comment } = data;
        
        const [result] = await pool.query(
            'INSERT INTO reviews (user_id, equipment_id, booking_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
            [user_id, equipment_id, booking_id, rating, comment]
        );
        return { id: result.insertId, ...data };
    },

    getByEquipmentId: async (equipmentId) => {
        const [rows] = await pool.query(
            `SELECT r.*, u.name as user_name 
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.equipment_id = ?
             ORDER BY r.created_at DESC`,
            [equipmentId]
        );
        return rows;
    },

    getAverageRating: async (equipmentId) => {
        const [rows] = await pool.query(
            'SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews FROM reviews WHERE equipment_id = ?',
            [equipmentId]
        );
        return rows[0];
    },

    getByUserId: async (userId) => {
        const [rows] = await pool.query(
            `SELECT r.*, e.name as equipment_name 
             FROM reviews r
             JOIN equipment e ON r.equipment_id = e.id
             WHERE r.user_id = ?
             ORDER BY r.created_at DESC`,
            [userId]
        );
        return rows;
    },

    update: async (id, data) => {
        const { rating, comment } = data;
        await pool.query(
            'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
            [rating, comment, id]
        );
        return { id, ...data };
    },

    delete: async (id) => {
        await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
        return { id };
    }
};

export default Review;

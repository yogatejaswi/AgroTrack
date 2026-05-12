import pool from '../config/db.js';

const Wishlist = {
    addToWishlist: async (userId, equipmentId) => {
        // Check if already in wishlist
        const [existing] = await pool.query(
            'SELECT id FROM wishlist WHERE user_id = ? AND equipment_id = ?',
            [userId, equipmentId]
        );

        if (existing.length > 0) {
            return { id: existing[0].id, user_id: userId, equipment_id: equipmentId, message: 'Already in wishlist' };
        }

        const [result] = await pool.query(
            'INSERT INTO wishlist (user_id, equipment_id) VALUES (?, ?)',
            [userId, equipmentId]
        );
        return { id: result.insertId, user_id: userId, equipment_id: equipmentId };
    },

    removeFromWishlist: async (userId, equipmentId) => {
        await pool.query(
            'DELETE FROM wishlist WHERE user_id = ? AND equipment_id = ?',
            [userId, equipmentId]
        );
        return { user_id: userId, equipment_id: equipmentId };
    },

    getUserWishlist: async (userId) => {
        const [rows] = await pool.query(
            `SELECT e.*, w.id as wishlist_id 
             FROM wishlist w
             JOIN equipment e ON w.equipment_id = e.id
             WHERE w.user_id = ?
             ORDER BY w.created_at DESC`,
            [userId]
        );
        return rows;
    },

    isInWishlist: async (userId, equipmentId) => {
        const [rows] = await pool.query(
            'SELECT id FROM wishlist WHERE user_id = ? AND equipment_id = ?',
            [userId, equipmentId]
        );
        return rows.length > 0;
    }
};

export default Wishlist;

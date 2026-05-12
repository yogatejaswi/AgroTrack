import Equipment from '../models/equipmentModel.js';
import pool from '../config/db.js';


export const getEquipment = async (req, res) => {
    try {
        const { keyword, isAdmin, ownerId } = req.query;
        let sql = 'SELECT * FROM equipment';
        let params = [];
        let conditions = [];

        if (keyword) {
            conditions.push('(name LIKE ? OR category LIKE ? OR type LIKE ?)');
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }

        // If ownerId is provided, only fetch that owner's equipment
        if (ownerId) {
            conditions.push('(owner_id = ? OR owner_id IS NULL)');
            params.push(ownerId);
        } else if (isAdmin !== 'true') {
            // If not admin and no ownerId, only fetch available equipment for the marketplace
            // Handle both BOOLEAN (1) and ENUM ('available') column types
            conditions.push('(availability_status = "available" OR availability_status = "Available" OR availability_status = 1)');
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY created_at DESC';

        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.getById(req.params.id);
        if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.create({
            ...req.body,
            owner_id: req.user.id
        });
        res.status(201).json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.update(req.params.id, req.body);
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEquipment = async (req, res) => {
    try {
        await Equipment.delete(req.params.id);
        res.json({ message: 'Equipment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const assignEquipmentToUser = async (req, res) => {
    try {
        const { equipmentId, userId } = req.body;

        if (!equipmentId || !userId) {
            return res.status(400).json({ message: 'equipmentId and userId are required' });
        }

        // Verify equipment exists
        const [equipment] = await pool.query('SELECT id FROM equipment WHERE id = ?', [equipmentId]);
        if (equipment.length === 0) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        // Verify user exists
        const [user] = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update equipment owner
        await pool.query('UPDATE equipment SET owner_id = ? WHERE id = ?', [userId, equipmentId]);

        res.json({ message: 'Equipment assigned successfully', equipmentId, userId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

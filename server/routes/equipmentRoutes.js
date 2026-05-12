import express from 'express';
import {
    getEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    assignEquipmentToUser
} from '../controllers/equipmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEquipment);
router.get('/:id', getEquipmentById);
router.post('/', protect, createEquipment);
router.put('/:id', protect, admin, updateEquipment);
router.delete('/:id', protect, admin, deleteEquipment);
router.post('/assign', protect, admin, assignEquipmentToUser);

export default router;

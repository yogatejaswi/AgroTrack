import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createDamageReport,
    getDamageReportsByBooking,
    getDamageReportsByEquipment,
    updateDamageReportStatus,
    getAllDamageReports
} from '../controllers/damageReportController.js';

const router = express.Router();

// Protected routes
router.post('/', protect, createDamageReport);
router.get('/booking/:booking_id', protect, getDamageReportsByBooking);
router.get('/equipment/:equipment_id', protect, getDamageReportsByEquipment);
router.put('/:id/status', protect, updateDamageReportStatus);

// Admin route
router.get('/', protect, getAllDamageReports);

export default router;

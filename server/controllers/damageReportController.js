import DamageReport from '../models/damageReportModel.js';

export const createDamageReport = async (req, res) => {
    try {
        const { booking_id, equipment_id, report_type, description, severity, images_url } = req.body;
        const user_id = req.user.id;

        if (!booking_id || !equipment_id || !report_type || !severity) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (!['pre-rental', 'post-rental', 'damage-claim'].includes(report_type)) {
            return res.status(400).json({ message: 'Invalid report type' });
        }

        if (!['low', 'medium', 'high', 'critical'].includes(severity)) {
            return res.status(400).json({ message: 'Invalid severity level' });
        }

        const report = await DamageReport.create({
            booking_id,
            equipment_id,
            user_id,
            report_type,
            description,
            severity,
            images_url
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDamageReportsByBooking = async (req, res) => {
    try {
        const { booking_id } = req.params;
        const reports = await DamageReport.getByBookingId(booking_id);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDamageReportsByEquipment = async (req, res) => {
    try {
        const { equipment_id } = req.params;
        const reports = await DamageReport.getByEquipmentId(equipment_id);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDamageReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, resolution_notes } = req.body;

        if (!['pending', 'investigating', 'resolved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const report = await DamageReport.updateStatus(id, status, resolution_notes);
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllDamageReports = async (req, res) => {
    try {
        const reports = await DamageReport.getAll();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

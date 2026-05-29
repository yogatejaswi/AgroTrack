import mongoose from 'mongoose';

const damageReportSchema = new mongoose.Schema({
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    equipment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    report_type: {
        type: String,
        enum: ['damage', 'missing_parts', 'malfunction'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true,
    },
    images_url: {
        type: [String],
    },
    status: {
        type: String,
        enum: ['pending', 'under_review', 'resolved', 'rejected'],
        default: 'pending',
    },
    resolution_notes: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

const DamageReport = mongoose.model('DamageReport', damageReportSchema);

export default DamageReport;

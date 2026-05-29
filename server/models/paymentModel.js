import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    payment_id: {
        type: String,
        unique: true,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    total_amount: {
        type: Number,
        required: true,
    },
    payment_method: {
        type: String,
        enum: ['credit_card', 'debit_card', 'upi', 'net_banking'],
        required: true,
    },
    payment_status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    },
    transaction_id: {
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

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;

import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expires_at: {
        type: Date,
        required: true,
        index: { expires: 0 }, // Auto-delete after expiration
    },
    is_used: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;

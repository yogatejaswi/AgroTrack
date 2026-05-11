import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';
import { register, login, getProfile, sendResetOtp, verifyResetOtp, resetPassword, sendLoginOtp, verifyLoginOtp } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

// Password Reset Routes
router.post('/send-reset-otp', sendResetOtp);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

// OTP Login Routes
router.post('/send-login-otp', sendLoginOtp);
router.post('/verify-login-otp', verifyLoginOtp);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_failed' }),
    (req, res) => {
        const token = jwt.sign({ id: req.user.id, role: req.user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const user = encodeURIComponent(JSON.stringify({
            id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role, token
        }));
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/auth/google/success?user=${user}`);
    }
);

export default router;

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from './db.js';

// Only initialize Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const name = profile.displayName;

            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

            if (rows.length > 0) {
                return done(null, rows[0]);
            }

            // Auto-register new Google user
            const [result] = await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, 'google-oauth', 'farmer']
            );
            const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            return done(null, newUser[0]);
        } catch (err) {
            return done(err, null);
        }
    }));
}

export default passport;

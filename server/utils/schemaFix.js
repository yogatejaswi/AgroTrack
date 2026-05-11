import pool from '../config/db.js';

export const fixMobileColumn = async () => {
    try {
        console.log('🔄 Checking database schema...');

        // Fix users table columns
        await pool.query(`
            ALTER TABLE users 
            MODIFY COLUMN name VARCHAR(100),
            MODIFY COLUMN email VARCHAR(100),
            MODIFY COLUMN mobile_number VARCHAR(15),
            MODIFY COLUMN password VARCHAR(255),
            MODIFY COLUMN role VARCHAR(20) DEFAULT 'farmer'
        `);
        console.log('✅ Users table schema aligned.');

        // Ensure equipment table columns
        // (Just basic check for common issues, like availability_status)
        await pool.query(`
            ALTER TABLE equipment 
            MODIFY COLUMN availability_status ENUM('available', 'unavailable') DEFAULT 'available'
        `);
        
        // Add owner_id column if it doesn't exist
        try {
            await pool.query(`
                ALTER TABLE equipment 
                ADD COLUMN owner_id INT,
                ADD FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
            `);
            console.log('✅ Added owner_id column to equipment table.');
        } catch (err) {
            // Column might already exist, that's fine
            if (!err.message.includes('Duplicate column')) {
                console.warn('⚠️ Could not add owner_id column:', err.message);
            }
        }
        
        console.log('✅ Equipment table schema aligned.');

        // Ensure bookings table schema
        await pool.query(`
            ALTER TABLE bookings 
            MODIFY COLUMN status VARCHAR(20) DEFAULT 'pending',
            MODIFY COLUMN payment_status VARCHAR(20) DEFAULT 'pending'
        `);
        console.log('✅ Bookings table schema aligned.');

    } catch (error) {
        console.error('❌ Error during schema alignment:', error.message);
    }
};

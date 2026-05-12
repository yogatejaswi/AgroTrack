import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const ensureAdminExists = async () => {
    try {
        // First admin account
        const adminEmail1 = 'viveklawrence11@gmail.com';
        const existingAdmin1 = await User.findByEmail(adminEmail1);

        if (!existingAdmin1) {
            console.log('👷 Admin account missing. Creating default admin...');

            // Password 'viveks' will be hashed inside User.create
            await User.create(
                'Vivek Lawrence',
                adminEmail1,
                'viveks',
                'admin',
                '9876543210'
            );

            console.log('✅ Default admin account created successfully.');
        } else {
            console.log('✅ Admin account already exists.');
        }

        // Second admin account
        const adminEmail2 = 'yogatejaswi@gmail.com';
        const existingAdmin2 = await User.findByEmail(adminEmail2);

        if (!existingAdmin2) {
            console.log('👷 Creating additional admin account...');

            // Password 'yoga' will be hashed inside User.create
            await User.create(
                'Yoga Tejaswi',
                adminEmail2,
                'yoga',
                'admin',
                '9876543211'
            );

            console.log('✅ Additional admin account created successfully.');
        } else {
            console.log('✅ Admin account yogatejaswi@gmail.com already exists.');
        }
    } catch (error) {
        console.error('❌ Error initializing admin account:', error.message);
    }
};

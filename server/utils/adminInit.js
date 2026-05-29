import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const ensureAdminExists = async () => {
    try {
        // First admin account
        const adminEmail1 = 'viveklawrence11@gmail.com';
        const existingAdmin1 = await User.findOne({ email: adminEmail1 });

        if (!existingAdmin1) {
            console.log('👷 Admin account missing. Creating default admin...');

            try {
                const hashedPassword1 = await bcrypt.hash('viveks', 10);
                await User.create({
                    name: 'Vivek Lawrence',
                    email: adminEmail1,
                    password: hashedPassword1,
                    role: 'admin',
                    mobile_number: '9876543210'
                });
                console.log('✅ Default admin account created successfully.');
            } catch (err) {
                console.error('Error creating admin1:', err.message);
            }
        } else {
            console.log('✅ Admin account already exists.');
        }

        // Second admin account
        const adminEmail2 = 'yogatejaswi@gmail.com';
        const existingAdmin2 = await User.findOne({ email: adminEmail2 });

        if (!existingAdmin2) {
            console.log('👷 Creating additional admin account...');

            try {
                const hashedPassword2 = await bcrypt.hash('yoga', 10);
                await User.create({
                    name: 'Yoga Tejaswi',
                    email: adminEmail2,
                    password: hashedPassword2,
                    role: 'admin',
                    mobile_number: '9876543211'
                });
                console.log('✅ Additional admin account created successfully.');
            } catch (err) {
                console.error('Error creating admin2:', err.message);
            }
        } else {
            console.log('✅ Admin account yogatejaswi@gmail.com already exists.');
        }
    } catch (error) {
        console.error('❌ Error initializing admin account:', error.message);
    }
};

import './config/env.js'; // Load environment variables
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import User from './models/userModel.js';
import Equipment from './models/equipmentModel.js';
import Booking from './models/bookingModel.js';
import Payment from './models/paymentModel.js';
import Review from './models/reviewModel.js';
import OTP from './models/otpModel.js';
import Notification from './models/notificationModel.js';
import Wishlist from './models/wishlistModel.js';
import DamageReport from './models/damageReportModel.js';

// MySQL Connection Pool
const mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB || 'agrotrack',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// MongoDB Connection
const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Map to store MySQL ID to MongoDB ObjectId conversions
const idMap = {
    users: {},
    equipment: {},
    bookings: {},
    payments: {},
    reviews: {},
    otps: {},
    notifications: {},
    wishlists: {},
    damageReports: {}
};

// Migrate Users
const migrateUsers = async () => {
    try {
        console.log('\n🔄 Migrating Users...');
        const connection = await mysqlPool.getConnection();
        const [users] = await connection.query('SELECT * FROM users');
        connection.release();

        if (users.length === 0) {
            console.log('ℹ️  No users to migrate');
            return;
        }

        for (const user of users) {
            try {
                const newUser = new User({
                    name: user.name,
                    email: user.email,
                    password: user.password, // Already hashed in MySQL
                    role: user.role || 'farmer',
                    mobile_number: user.mobile_number,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                });

                const savedUser = await newUser.save();
                idMap.users[user.id] = savedUser._id;
                console.log(`✅ Migrated user: ${user.email}`);
            } catch (error) {
                // Ignore duplicate key errors for users that already exist
                if (error.code === 11000) {
                    console.log(`ℹ️  User ${user.email} already exists in MongoDB`);
                    // Try to find existing user and map the ID
                    const existingUser = await User.findOne({ email: user.email });
                    if (existingUser) {
                        idMap.users[user.id] = existingUser._id;
                    }
                } else {
                    console.error(`❌ Error migrating user ${user.email}:`, error.message);
                }
            }
        }

        console.log(`✅ Users migration completed. Total: ${users.length}`);
    } catch (error) {
        console.error('❌ Error during users migration:', error.message);
    }
};

// Migrate Equipment
const migrateEquipment = async () => {
    try {
        console.log('\n🔄 Migrating Equipment...');
        const connection = await mysqlPool.getConnection();
        const [equipment] = await connection.query('SELECT * FROM equipment');
        connection.release();

        if (equipment.length === 0) {
            console.log('ℹ️  No equipment to migrate');
            return;
        }

        // Get first admin user as default owner
        const firstAdmin = Object.values(idMap.users)[0];

        for (const item of equipment) {
            try {
                const newEquipment = new Equipment({
                    name: item.name,
                    category: item.category,
                    price_per_day: item.price_per_day,
                    location: item.location || 'Not Specified',
                    description: item.description,
                    image_url: item.image_url,
                    owner_id: idMap.users[item.owner_id] || firstAdmin,
                    availability_status: item.availability_status || 'available',
                    created_at: item.created_at,
                    updated_at: item.updated_at
                });

                const savedEquipment = await newEquipment.save();
                idMap.equipment[item.id] = savedEquipment._id;
                console.log(`✅ Migrated equipment: ${item.name}`);
            } catch (error) {
                console.error(`❌ Error migrating equipment ${item.name}:`, error.message);
            }
        }

        console.log(`✅ Equipment migration completed. Total: ${equipment.length}`);
    } catch (error) {
        console.error('❌ Error during equipment migration:', error.message);
    }
};

// Migrate Bookings
const migrateBookings = async () => {
    try {
        console.log('\n🔄 Migrating Bookings...');
        const connection = await mysqlPool.getConnection();
        const [bookings] = await connection.query('SELECT * FROM bookings');
        connection.release();

        if (bookings.length === 0) {
            console.log('ℹ️  No bookings to migrate');
            return;
        }

        // Get first user and equipment as fallback
        const firstUser = Object.values(idMap.users)[0];
        const firstEquipment = Object.values(idMap.equipment)[0];

        for (const booking of bookings) {
            try {
                // Map payment status values
                let paymentStatus = booking.payment_status || 'pending';
                if (paymentStatus === 'paid') paymentStatus = 'completed';
                if (paymentStatus === 'unpaid') paymentStatus = 'pending';

                const newBooking = new Booking({
                    user_id: idMap.users[booking.user_id] || firstUser,
                    equipment_id: idMap.equipment[booking.equipment_id] || firstEquipment,
                    start_date: booking.start_date,
                    end_date: booking.end_date,
                    total_cost: booking.total_cost,
                    status: booking.status || 'pending',
                    payment_status: paymentStatus,
                    created_at: booking.created_at,
                    updated_at: booking.updated_at
                });

                const savedBooking = await newBooking.save();
                idMap.bookings[booking.id] = savedBooking._id;
                console.log(`✅ Migrated booking: ID ${booking.id}`);
            } catch (error) {
                console.error(`❌ Error migrating booking ${booking.id}:`, error.message);
            }
        }

        console.log(`✅ Bookings migration completed. Total: ${bookings.length}`);
    } catch (error) {
        console.error('❌ Error during bookings migration:', error.message);
    }
};

// Migrate Payments
const migratePayments = async () => {
    try {
        console.log('\n🔄 Migrating Payments...');
        const connection = await mysqlPool.getConnection();
        const [payments] = await connection.query('SELECT * FROM payments');
        connection.release();

        if (payments.length === 0) {
            console.log('ℹ️  No payments to migrate');
            return;
        }

        for (const payment of payments) {
            try {
                const newPayment = new Payment({
                    payment_id: payment.payment_id,
                    user_id: idMap.users[payment.user_id],
                    booking_id: idMap.bookings[payment.booking_id],
                    total_amount: payment.total_amount,
                    payment_method: payment.payment_method,
                    payment_status: payment.payment_status || 'pending',
                    transaction_id: payment.transaction_id,
                    created_at: payment.created_at,
                    updated_at: payment.updated_at
                });

                const savedPayment = await newPayment.save();
                idMap.payments[payment.id] = savedPayment._id;
                console.log(`✅ Migrated payment: ${payment.payment_id}`);
            } catch (error) {
                console.error(`❌ Error migrating payment ${payment.payment_id}:`, error.message);
            }
        }

        console.log(`✅ Payments migration completed. Total: ${payments.length}`);
    } catch (error) {
        console.error('❌ Error during payments migration:', error.message);
    }
};

// Migrate Reviews
const migrateReviews = async () => {
    try {
        console.log('\n🔄 Migrating Reviews...');
        const connection = await mysqlPool.getConnection();
        const [reviews] = await connection.query('SELECT * FROM reviews');
        connection.release();

        if (reviews.length === 0) {
            console.log('ℹ️  No reviews to migrate');
            return;
        }

        for (const review of reviews) {
            try {
                const newReview = new Review({
                    user_id: idMap.users[review.user_id],
                    equipment_id: idMap.equipment[review.equipment_id],
                    booking_id: idMap.bookings[review.booking_id],
                    rating: review.rating,
                    comment: review.comment,
                    created_at: review.created_at,
                    updated_at: review.updated_at
                });

                const savedReview = await newReview.save();
                idMap.reviews[review.id] = savedReview._id;
                console.log(`✅ Migrated review: ID ${review.id}`);
            } catch (error) {
                console.error(`❌ Error migrating review ${review.id}:`, error.message);
            }
        }

        console.log(`✅ Reviews migration completed. Total: ${reviews.length}`);
    } catch (error) {
        console.error('❌ Error during reviews migration:', error.message);
    }
};

// Migrate OTPs
const migrateOTPs = async () => {
    try {
        console.log('\n🔄 Migrating OTPs...');
        const connection = await mysqlPool.getConnection();
        const [otps] = await connection.query('SELECT * FROM otps WHERE expires_at > NOW()');
        connection.release();

        if (otps.length === 0) {
            console.log('ℹ️  No valid OTPs to migrate');
            return;
        }

        for (const otp of otps) {
            try {
                const newOTP = new OTP({
                    email: otp.email,
                    otp: otp.otp,
                    expires_at: otp.expires_at,
                    is_used: otp.is_used || false,
                    created_at: otp.created_at
                });

                const savedOTP = await newOTP.save();
                idMap.otps[otp.id] = savedOTP._id;
                console.log(`✅ Migrated OTP for: ${otp.email}`);
            } catch (error) {
                console.error(`❌ Error migrating OTP for ${otp.email}:`, error.message);
            }
        }

        console.log(`✅ OTPs migration completed. Total: ${otps.length}`);
    } catch (error) {
        console.error('❌ Error during OTPs migration:', error.message);
    }
};

// Migrate Notifications
const migrateNotifications = async () => {
    try {
        console.log('\n🔄 Migrating Notifications...');
        const connection = await mysqlPool.getConnection();
        const [notifications] = await connection.query('SELECT * FROM notifications');
        connection.release();

        if (notifications.length === 0) {
            console.log('ℹ️  No notifications to migrate');
            return;
        }

        // Get first user as fallback
        const firstUser = Object.values(idMap.users)[0];

        for (const notification of notifications) {
            try {
                const newNotification = new Notification({
                    user_id: idMap.users[notification.user_id] || firstUser,
                    message: notification.message,
                    type: notification.type || 'info',
                    is_read: notification.is_read || false,
                    created_at: notification.created_at
                });

                const savedNotification = await newNotification.save();
                idMap.notifications[notification.id] = savedNotification._id;
                console.log(`✅ Migrated notification: ID ${notification.id}`);
            } catch (error) {
                console.error(`❌ Error migrating notification ${notification.id}:`, error.message);
            }
        }

        console.log(`✅ Notifications migration completed. Total: ${notifications.length}`);
    } catch (error) {
        console.error('❌ Error during notifications migration:', error.message);
    }
};

// Migrate Wishlists
const migrateWishlists = async () => {
    try {
        console.log('\n🔄 Migrating Wishlists...');
        const connection = await mysqlPool.getConnection();
        const [wishlists] = await connection.query('SELECT * FROM wishlist');
        connection.release();

        if (wishlists.length === 0) {
            console.log('ℹ️  No wishlist items to migrate');
            return;
        }

        for (const wishlist of wishlists) {
            try {
                const newWishlist = new Wishlist({
                    user_id: idMap.users[wishlist.user_id],
                    equipment_id: idMap.equipment[wishlist.equipment_id],
                    created_at: wishlist.created_at
                });

                const savedWishlist = await newWishlist.save();
                idMap.wishlists[wishlist.id] = savedWishlist._id;
                console.log(`✅ Migrated wishlist item: ID ${wishlist.id}`);
            } catch (error) {
                console.error(`❌ Error migrating wishlist ${wishlist.id}:`, error.message);
            }
        }

        console.log(`✅ Wishlists migration completed. Total: ${wishlists.length}`);
    } catch (error) {
        console.error('❌ Error during wishlists migration:', error.message);
    }
};

// Migrate Damage Reports
const migrateDamageReports = async () => {
    try {
        console.log('\n🔄 Migrating Damage Reports...');
        const connection = await mysqlPool.getConnection();
        const [reports] = await connection.query('SELECT * FROM damage_reports');
        connection.release();

        if (reports.length === 0) {
            console.log('ℹ️  No damage reports to migrate');
            return;
        }

        for (const report of reports) {
            try {
                const newReport = new DamageReport({
                    booking_id: idMap.bookings[report.booking_id],
                    equipment_id: idMap.equipment[report.equipment_id],
                    user_id: idMap.users[report.user_id],
                    report_type: report.report_type,
                    description: report.description,
                    severity: report.severity,
                    images_url: report.images_url ? JSON.parse(report.images_url) : [],
                    status: report.status || 'pending',
                    resolution_notes: report.resolution_notes,
                    created_at: report.created_at,
                    updated_at: report.updated_at
                });

                const savedReport = await newReport.save();
                idMap.damageReports[report.id] = savedReport._id;
                console.log(`✅ Migrated damage report: ID ${report.id}`);
            } catch (error) {
                console.error(`❌ Error migrating damage report ${report.id}:`, error.message);
            }
        }

        console.log(`✅ Damage Reports migration completed. Total: ${reports.length}`);
    } catch (error) {
        console.error('❌ Error during damage reports migration:', error.message);
    }
};

// Main Migration Function
const runMigration = async () => {
    try {
        console.log('🚀 Starting MySQL to MongoDB Migration...\n');

        // Connect to MongoDB
        await connectMongoDB();

        // Run migrations in order (respecting foreign key dependencies)
        await migrateUsers();
        await migrateEquipment();
        await migrateBookings();
        await migratePayments();
        await migrateReviews();
        await migrateOTPs();
        await migrateNotifications();
        await migrateWishlists();
        await migrateDamageReports();

        console.log('\n✅ Migration completed successfully!');
        console.log('\n📊 Migration Summary:');
        console.log(`   Users: ${Object.keys(idMap.users).length}`);
        console.log(`   Equipment: ${Object.keys(idMap.equipment).length}`);
        console.log(`   Bookings: ${Object.keys(idMap.bookings).length}`);
        console.log(`   Payments: ${Object.keys(idMap.payments).length}`);
        console.log(`   Reviews: ${Object.keys(idMap.reviews).length}`);
        console.log(`   OTPs: ${Object.keys(idMap.otps).length}`);
        console.log(`   Notifications: ${Object.keys(idMap.notifications).length}`);
        console.log(`   Wishlists: ${Object.keys(idMap.wishlists).length}`);
        console.log(`   Damage Reports: ${Object.keys(idMap.damageReports).length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
};

// Run the migration
runMigration();

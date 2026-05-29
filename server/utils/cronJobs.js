import cron from 'node-cron';
import Booking from '../models/bookingModel.js';
import Equipment from '../models/equipmentModel.js';
import { createSystemNotification } from '../controllers/notificationController.js';

export const startCronJobs = () => {
    // Run every day at midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
        console.log('⏳ Running daily status check for bookings and equipment...');

        try {
            // Find bookings that have passed their end_date and are still confirmed
            const expiredBookings = await Booking.find({
                status: 'confirmed',
                end_date: { $lt: new Date() }
            });

            if (expiredBookings.length === 0) {
                console.log('✅ No expired bookings found. Check complete.');
                return;
            }

            console.log(`Found ${expiredBookings.length} expired bookings to process.`);

            for (const booking of expiredBookings) {
                // 1. Mark booking as completed
                booking.status = 'completed';
                await booking.save();

                // 2. Mark equipment as available
                await Equipment.findByIdAndUpdate(
                    booking.equipment_id,
                    { availability_status: 'available' }
                );

                // 3. Notify user
                await createSystemNotification(
                    booking.user_id,
                    `Your booking for equipment ID ${booking.equipment_id} has concluded. Thank you for using AgroTrack!`,
                    'success'
                );
            }
            console.log('✅ Daily status check complete.');

        } catch (error) {
            console.error('❌ Error in automated status check:', error);
        }
    });
};

import pool from '../config/db.js';

export const getAdminStats = async (req, res) => {
    try {
        // Get total counts
        const [totalEquipmentResult] = await pool.query('SELECT COUNT(*) as count FROM equipment');
        const [totalUsersResult] = await pool.query('SELECT COUNT(*) as count FROM users');
        const [totalBookingsResult] = await pool.query('SELECT COUNT(*) as count FROM bookings WHERE status IN ("pending", "confirmed")');
        const [revenueResult] = await pool.query('SELECT SUM(total_cost) as total FROM bookings WHERE status IN ("pending", "confirmed")');
        const [availableEquipmentResult] = await pool.query('SELECT COUNT(*) as count FROM equipment WHERE availability_status = "available" OR availability_status = 1');
        const [unavailableEquipmentResult] = await pool.query('SELECT COUNT(*) as count FROM equipment WHERE availability_status = "unavailable" OR availability_status = 0');

        // Get equipment list
        const [equipmentList] = await pool.query('SELECT id, name, category, price_per_day, availability_status FROM equipment LIMIT 10');

        // Get monthly data for charts
        const [monthlyData] = await pool.query(
            `SELECT 
                DATE_FORMAT(created_at, '%b') as month,
                SUM(total_cost) as revenue,
                COUNT(*) as bookings
             FROM bookings 
             WHERE status IN ('pending', 'confirmed') 
             GROUP BY DATE_FORMAT(created_at, '%Y-%m')
             ORDER BY created_at DESC
             LIMIT 6`
        );

        res.json({
            totalUsers: totalUsersResult[0].count,
            totalEquipment: totalEquipmentResult[0].count,
            totalBookings: totalBookingsResult[0].count,
            totalRevenue: revenueResult[0].total || 0,
            availableEquipment: availableEquipmentResult[0].count,
            unavailableEquipment: unavailableEquipmentResult[0].count,
            equipmentList: equipmentList.map(eq => ({
                id: eq.id,
                name: eq.name,
                category: eq.category,
                price_per_day: eq.price_per_day,
                availabilityStatus: eq.availability_status === 'available' || eq.availability_status === 1 ? 'available' : 'unavailable'
            })),
            monthlyData: monthlyData.reverse()
        });
    } catch (error) {
        console.error("Admin stats fetch failed:", error);
        res.status(500).json({ message: "Analytics fetch failed" });
    }
};

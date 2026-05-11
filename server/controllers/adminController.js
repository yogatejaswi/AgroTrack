import pool from '../config/db.js';

export const getDashboardAnalytics = async (req, res) => {
    try {
        const [users] = await pool.query("SELECT COUNT(*) as total FROM users");
        const [bookings] = await pool.query("SELECT COUNT(*) as total FROM bookings");
        const [equipment] = await pool.query("SELECT COUNT(*) as total FROM equipment");
        const [revenue] = await pool.query("SELECT SUM(total_cost) as total FROM bookings WHERE status = 'confirmed'");
        const [availEqResult] = await pool.query('SELECT COUNT(*) as total FROM equipment WHERE availability_status = "available" OR availability_status = 1');
        const [unavailEqResult] = await pool.query('SELECT COUNT(*) as total FROM equipment WHERE availability_status = "unavailable" OR availability_status = 0');

        // Get monthly data for charts - generate last 6 months
        const [monthlyData] = await pool.query(`
            SELECT 
                DATE_FORMAT(created_at, '%b') as month, 
                COALESCE(SUM(total_cost), 0) as revenue,
                COUNT(id) as bookings
            FROM bookings 
            WHERE status IN ('pending', 'confirmed') 
            GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b')
            ORDER BY DATE_FORMAT(created_at, '%Y-%m') DESC 
            LIMIT 12
        `);

        // Ensure we have at least some data for charts
        const chartData = monthlyData.length > 0 ? monthlyData.reverse() : [
            { month: 'Jan', revenue: 0, bookings: 0 },
            { month: 'Feb', revenue: 0, bookings: 0 },
            { month: 'Mar', revenue: 0, bookings: 0 }
        ];

        const [equipmentList] = await pool.query(`
            SELECT 
                id, 
                name, 
                category, 
                'Admin' as owner, 
                availability_status as availabilityStatus 
            FROM equipment
            ORDER BY created_at DESC
        `);

        res.json({
            totalUsers: users[0].total,
            totalBookings: bookings[0].total,
            totalEquipment: equipment[0].total,
            totalRevenue: revenue[0].total || 0,
            availableEquipment: availEqResult[0].total,
            unavailableEquipment: unavailEqResult[0].total,
            monthlyData: chartData,
            equipmentList
        });
    } catch (error) {
        console.error("Analytics fetch failed:", error);
        res.status(500).json({ message: "Analytics fetch failed" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT id, name, email, mobile_number, role, created_at 
            FROM users 
            ORDER BY created_at DESC
        `);
        res.json(users);
    } catch (error) {
        console.error("Fetch users failed:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

export const getAllPayments = async (req, res) => {
    try {
        const [payments] = await pool.query(`
            SELECT 
                p.id, 
                p.booking_id, 
                p.total_amount, 
                p.payment_status as status, 
                p.created_at,
                u.name as payer_name
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN users u ON b.user_id = u.id
            ORDER BY p.created_at DESC
        `);
        res.json(payments);
    } catch (error) {
        console.error("Fetch payments failed:", error);
        res.status(500).json({ message: "Failed to fetch payments" });
    }
};

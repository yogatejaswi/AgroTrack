import pool from '../config/db.js';

/**
 * Migration script to assign owner_id to equipment
 * This helps identify which user owns which equipment
 */
export const migrateEquipmentOwners = async () => {
    try {
        console.log('🔄 Starting equipment owner migration...');

        // Get all equipment without owner_id
        const [equipmentWithoutOwner] = await pool.query(
            'SELECT id, name FROM equipment WHERE owner_id IS NULL'
        );

        if (equipmentWithoutOwner.length === 0) {
            console.log('✅ All equipment already has owner_id assigned.');
            return;
        }

        console.log(`Found ${equipmentWithoutOwner.length} equipment items without owner_id`);

        // Get the first admin user (or any user) to assign as owner
        const [users] = await pool.query(
            'SELECT id FROM users WHERE role = "admin" LIMIT 1'
        );

        if (users.length === 0) {
            console.warn('⚠️ No admin user found. Skipping migration.');
            return;
        }

        const adminId = users[0].id;

        // Assign all equipment without owner to the admin
        for (const equipment of equipmentWithoutOwner) {
            await pool.query(
                'UPDATE equipment SET owner_id = ? WHERE id = ?',
                [adminId, equipment.id]
            );
            console.log(`✅ Assigned equipment "${equipment.name}" (ID: ${equipment.id}) to admin user (ID: ${adminId})`);
        }

        console.log('✅ Equipment owner migration completed successfully.');
    } catch (error) {
        console.error('❌ Error during equipment owner migration:', error.message);
    }
};

/**
 * Assign a specific equipment to a user
 */
export const assignEquipmentToUser = async (equipmentId, userId) => {
    try {
        const [result] = await pool.query(
            'UPDATE equipment SET owner_id = ? WHERE id = ?',
            [userId, equipmentId]
        );

        if (result.affectedRows === 0) {
            throw new Error('Equipment not found');
        }

        console.log(`✅ Equipment ${equipmentId} assigned to user ${userId}`);
        return { success: true, equipmentId, userId };
    } catch (error) {
        console.error('❌ Error assigning equipment:', error.message);
        throw error;
    }
};

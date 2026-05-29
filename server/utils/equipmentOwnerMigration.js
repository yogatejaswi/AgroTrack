import Equipment from '../models/equipmentModel.js';
import User from '../models/userModel.js';

/**
 * Migration script to assign owner_id to equipment
 * This helps identify which user owns which equipment
 */
export const migrateEquipmentOwners = async () => {
    try {
        console.log('🔄 Starting equipment owner migration...');

        // Get all equipment without owner_id
        const equipmentWithoutOwner = await Equipment.find({ owner_id: null });

        if (equipmentWithoutOwner.length === 0) {
            console.log('✅ All equipment already has owner_id assigned.');
            return;
        }

        console.log(`Found ${equipmentWithoutOwner.length} equipment items without owner_id`);

        // Get the first admin user (or any user) to assign as owner
        const adminUser = await User.findOne({ role: 'admin' });

        if (!adminUser) {
            console.warn('⚠️ No admin user found. Skipping migration.');
            return;
        }

        // Assign all equipment without owner to the admin
        for (const equipment of equipmentWithoutOwner) {
            equipment.owner_id = adminUser._id;
            await equipment.save();
            console.log(`✅ Assigned equipment "${equipment.name}" (ID: ${equipment._id}) to admin user (ID: ${adminUser._id})`);
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
        const equipment = await Equipment.findByIdAndUpdate(
            equipmentId,
            { owner_id: userId },
            { new: true }
        );

        if (!equipment) {
            throw new Error('Equipment not found');
        }

        console.log(`✅ Equipment ${equipmentId} assigned to user ${userId}`);
        return { success: true, equipmentId, userId };
    } catch (error) {
        console.error('❌ Error assigning equipment:', error.message);
        throw error;
    }
};

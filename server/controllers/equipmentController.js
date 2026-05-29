import Equipment from '../models/equipmentModel.js';
import User from '../models/userModel.js';

export const getEquipment = async (req, res) => {
    try {
        const { keyword } = req.query;
        let query = {};

        if (keyword) {
            query = {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { category: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } }
                ]
            };
        }

        // Only fetch available equipment for marketplace
        query.availability_status = 'available';

        const equipment = await Equipment.find(query)
            .populate('owner_id', 'name email mobile_number')
            .sort({ created_at: -1 });

        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id)
            .populate('owner_id', 'name email mobile_number');
        
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }
        
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createEquipment = async (req, res) => {
    try {
        const equipment = new Equipment({
            ...req.body,
            owner_id: req.user.id
        });

        const savedEquipment = await equipment.save();
        res.status(201).json(savedEquipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndDelete(req.params.id);

        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        res.json({ message: 'Equipment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const assignEquipmentToUser = async (req, res) => {
    try {
        const { equipmentId, userId } = req.body;

        if (!equipmentId || !userId) {
            return res.status(400).json({ message: 'equipmentId and userId are required' });
        }

        // Verify equipment exists
        const equipment = await Equipment.findById(equipmentId);
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update equipment owner
        equipment.owner_id = userId;
        await equipment.save();

        res.json({ message: 'Equipment assigned successfully', equipmentId, userId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

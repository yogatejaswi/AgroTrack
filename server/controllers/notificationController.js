import Notification from '../models/notificationModel.js';

export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user_id: req.user.id })
            .sort({ created_at: -1 })
            .limit(50);
        
        const unreadCount = await Notification.countDocuments({
            user_id: req.user.id,
            is_read: false
        });

        res.json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(
            id,
            { is_read: true },
            { new: true }
        );
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSystemNotification = async (userId, message, type = 'info') => {
    try {
        const notification = new Notification({
            user_id: userId,
            message,
            type
        });
        await notification.save();
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
};

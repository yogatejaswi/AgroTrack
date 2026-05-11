export const isEquipmentManager = (user) => ['admin', 'owner'].includes(user?.role);

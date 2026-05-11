export const isEquipmentManager = (user) => ['admin', 'owner', 'farmer'].includes(user?.role);

export const isAdmin = (user) => user?.role === 'admin';

export const getManagerLabel = (user) => {
    if (user?.role === 'owner') return 'Owner';
    if (user?.role === 'admin') return 'Administrator';
    return 'Farmer';
};

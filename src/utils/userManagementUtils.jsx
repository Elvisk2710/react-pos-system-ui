export const getRoleDisplay = (role) => {
    const roles = {
        admin: { label: 'Admin', color: 'purple' },
        inventory_manager: { label: 'Inventory Manager', color: 'blue' },
        cashier: { label: 'Cashier', color: 'green' }
    };
    return roles[role] || { label: role, color: 'gray' };
};

export const sortUsers = (users, { key, direction }) => {
    return [...users].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });
};

export const filterUsers = (users, { searchTerm, roleFilter }) => {
    return users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });
};
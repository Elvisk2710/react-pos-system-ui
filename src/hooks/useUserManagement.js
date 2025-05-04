import { useState, useEffect } from 'react';
import { sortUsers, filterUsers } from '../utils/userManagementUtils';

export const useUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                // Simulate API call
                setTimeout(() => {
                    setUsers([
                        {
                            id: 1,
                            name: 'Admin User',
                            email: 'admin@example.com',
                            role: 'admin',
                            avatar: '/avatars/admin.png',
                            lastLogin: '2023-05-15T10:30:00',
                            permissions: {
                                inventory: true,
                                sales: true,
                                reporting: true,
                                userManagement: true
                            }
                        },
                        {
                            id: 2,
                            name: 'Inventory Manager',
                            email: 'inventory@example.com',
                            role: 'inventory_manager',
                            avatar: '/avatars/inventory.png',
                            lastLogin: '2023-05-14T09:15:00',
                            permissions: {
                                inventory: true,
                                sales: false,
                                reporting: true,
                                userManagement: false
                            }
                        },
                        {
                            id: 3,
                            name: 'Cashier 1',
                            email: 'cashier1@example.com',
                            role: 'cashier',
                            avatar: '/avatars/cashier1.png',
                            lastLogin: '2023-05-15T08:45:00',
                            permissions: {
                                inventory: false,
                                sales: true,
                                reporting: false,
                                userManagement: false
                            }
                        }
                    ]);
                    setLoading(false);
                }, 1000);
            } catch (err) {
                setError('Failed to load users. Please try again.');
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = sortUsers(users, sortConfig);
    const filteredUsers = filterUsers(sortedUsers, { searchTerm, roleFilter });

    return {
        users,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        roleFilter,
        setRoleFilter,
        sortConfig,
        requestSort,
        filteredUsers,
        setUsers
    };
};
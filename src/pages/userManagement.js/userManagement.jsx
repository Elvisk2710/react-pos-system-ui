import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    IconButton,
    Input,
    Select,
    Option,
    Chip,
    Tooltip,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Spinner,
    Alert,
    Avatar
} from "@material-tailwind/react";
import {
    PencilIcon,
    TrashIcon,
    UserPlusIcon,
    EyeIcon,
    FunnelIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    MagnifyingGlassIcon,
    XMarkIcon
} from "@heroicons/react/24/solid";

const UserManagement = ({ currentUser }) => {
    // State management
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'cashier',
        password: '',
        confirmPassword: '',
        permissions: {
            inventory: false,
            sales: false,
            reporting: false,
            userManagement: false
        }
    });

    // Sample user data - in a real app, this would come from an API
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

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;

        if (name in formData.permissions) {
            setFormData({
                ...formData,
                permissions: {
                    ...formData.permissions,
                    [name]: checked
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleRoleChange = (value) => {
        // Set default permissions based on role
        let permissions = {
            inventory: value === 'admin' || value === 'inventory_manager',
            sales: value === 'admin' || value === 'cashier',
            reporting: value === 'admin' || value === 'inventory_manager',
            userManagement: value === 'admin'
        };

        setFormData({
            ...formData,
            role: value,
            permissions
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate form
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        // In a real app, this would be an API call
        if (editMode) {
            // Update existing user
            setUsers(users.map(user =>
                user.id === currentUserId ? { ...user, ...formData } : user
            ));
        } else {
            // Add new user
            const newUser = {
                id: users.length + 1,
                ...formData,
                avatar: `/avatars/default.png`,
                lastLogin: new Date().toISOString()
            };
            setUsers([...users, newUser]);
        }

        // Reset form and close dialog
        resetForm();
        setOpenDialog(false);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            role: 'cashier',
            password: '',
            confirmPassword: '',
            permissions: {
                inventory: false,
                sales: false,
                reporting: false,
                userManagement: false
            }
        });
        setEditMode(false);
        setCurrentUserId(null);
        setError(null);
    };

    // User actions
    const editUser = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
            confirmPassword: '',
            permissions: user.permissions
        });
        setEditMode(true);
        setCurrentUserId(user.id);
        setOpenDialog(true);
    };

    const deleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    // Sorting and filtering
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredUsers = sortedUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Role display helper
    const getRoleDisplay = (role) => {
        const roles = {
            admin: { label: 'Admin', color: 'purple' },
            inventory_manager: { label: 'Inventory Manager', color: 'blue' },
            cashier: { label: 'Cashier', color: 'green' }
        };
        return roles[role] || { label: role, color: 'gray' };
    };

    return (
        <Card className="min-h-screen">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            User Management
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Manage system users and permissions
                        </Typography>
                    </div>
                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                        <Button
                            className="flex items-center gap-3"
                            color="blue"
                            size="sm"
                            onClick={() => {
                                resetForm();
                                setOpenDialog(true);
                            }}
                            disabled={!currentUser.permissions?.userManagement}
                        >
                            <UserPlusIcon className="h-4 w-4" />
                            Add User
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                {/* Search and Filter */}
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Input
                            label="Search users..."
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <IconButton
                                variant="text"
                                className="!absolute right-1 top-1 rounded-full"
                                onClick={() => setSearchTerm('')}
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </IconButton>
                        )}
                    </div>
                    <Select
                        label="Filter by role"
                        value={roleFilter}
                        onChange={(value) => setRoleFilter(value)}
                        className="min-w-[200px]"
                    >
                        <Option value="all">All Roles</Option>
                        <Option value="admin">Admin</Option>
                        <Option value="inventory_manager">Inventory Manager</Option>
                        <Option value="cashier">Cashier</Option>
                    </Select>
                </div>

                {/* Error Display */}
                {error && (
                    <Alert color="red" className="mb-4">
                        {error}
                    </Alert>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner className="h-8 w-8" />
                    </div>
                ) : (
                    /* Users Table */
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            User
                                        </Typography>
                                    </th>
                                    <th
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 cursor-pointer"
                                        onClick={() => requestSort('email')}
                                    >
                                        <div className="flex items-center gap-1">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                Email
                                            </Typography>
                                            {sortConfig.key === 'email' && (
                                                sortConfig.direction === 'asc' ?
                                                    <ArrowUpIcon className="h-4 w-4" /> :
                                                    <ArrowDownIcon className="h-4 w-4" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Role
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Permissions
                                        </Typography>
                                    </th>
                                    <th
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 cursor-pointer"
                                        onClick={() => requestSort('lastLogin')}
                                    >
                                        <div className="flex items-center gap-1">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                Last Login
                                            </Typography>
                                            {sortConfig.key === 'lastLogin' && (
                                                sortConfig.direction === 'asc' ?
                                                    <ArrowUpIcon className="h-4 w-4" /> :
                                                    <ArrowDownIcon className="h-4 w-4" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Actions
                                        </Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="even:bg-blue-gray-50/50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar src={user.avatar} alt={user.name} size="sm" />
                                                    <Typography variant="small" color="blue-gray" className="font-bold">
                                                        {user.name}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {user.email}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Chip
                                                    variant="gradient"
                                                    color={getRoleDisplay(user.role).color}
                                                    value={getRoleDisplay(user.role).label}
                                                    className="text-xs py-0.5 px-2"
                                                />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.permissions.inventory && (
                                                        <Chip value="Inventory" className="text-xs py-0.5 px-2" />
                                                    )}
                                                    {user.permissions.sales && (
                                                        <Chip value="POS" className="text-xs py-0.5 px-2" />
                                                    )}
                                                    {user.permissions.reporting && (
                                                        <Chip value="Reports" className="text-xs py-0.5 px-2" />
                                                    )}
                                                    {user.permissions.userManagement && (
                                                        <Chip value="Users" className="text-xs py-0.5 px-2" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {new Date(user.lastLogin).toLocaleString()}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <Tooltip content="View Details">
                                                        <IconButton variant="text" color="blue-gray">
                                                            <EyeIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {currentUser.permissions?.userManagement && (
                                                        <>
                                                            <Tooltip content="Edit User">
                                                                <IconButton
                                                                    variant="text"
                                                                    color="blue-gray"
                                                                    onClick={() => editUser(user)}
                                                                >
                                                                    <PencilIcon className="h-4 w-4" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip content="Delete User">
                                                                <IconButton
                                                                    variant="text"
                                                                    color="red"
                                                                    onClick={() => deleteUser(user.id)}
                                                                    disabled={user.id === currentUser.id}
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-4 text-center">
                                            <Typography color="gray" className="font-normal">
                                                No users found matching your criteria
                                            </Typography>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardBody>

            {/* Add/Edit User Dialog */}
            <Dialog open={openDialog} handler={() => setOpenDialog(!openDialog)}>
                <DialogHeader>{editMode ? 'Edit User' : 'Add New User'}</DialogHeader>
                <DialogBody divider>
                    <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        <Select
                            label="Role"
                            value={formData.role}
                            onChange={handleRoleChange}
                            required
                        >
                            <Option value="admin">Admin</Option>
                            <Option value="inventory_manager">Inventory Manager</Option>
                            <Option value="cashier">Cashier</Option>
                        </Select>

                        {!editMode && (
                            <>
                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!editMode}
                                    minLength="8"
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required={!editMode}
                                />
                            </>
                        )}

                        <div className="pt-2">
                            <Typography variant="small" className="font-medium text-blue-gray-700 mb-2">
                                Permissions
                            </Typography>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Checkbox
                                        name="inventory"
                                        checked={formData.permissions.inventory}
                                        onChange={handleInputChange}
                                        disabled={formData.role === 'admin'}
                                    />
                                    <Typography variant="small" className="ml-2">
                                        Inventory Management
                                    </Typography>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        name="sales"
                                        checked={formData.permissions.sales}
                                        onChange={handleInputChange}
                                        disabled={formData.role === 'admin'}
                                    />
                                    <Typography variant="small" className="ml-2">
                                        Point of Sale
                                    </Typography>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        name="reporting"
                                        checked={formData.permissions.reporting}
                                        onChange={handleInputChange}
                                        disabled={formData.role === 'admin'}
                                    />
                                    <Typography variant="small" className="ml-2">
                                        Reporting
                                    </Typography>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        name="userManagement"
                                        checked={formData.permissions.userManagement}
                                        onChange={handleInputChange}
                                        disabled={formData.role === 'admin'}
                                    />
                                    <Typography variant="small" className="ml-2">
                                        User Management
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => {
                            setOpenDialog(false);
                            resetForm();
                        }}
                        className="mr-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        type="submit"
                        form="user-form"
                    >
                        {editMode ? 'Update User' : 'Create User'}
                    </Button>
                </DialogFooter>
            </Dialog>
        </Card>
    );
};

export default UserManagement;
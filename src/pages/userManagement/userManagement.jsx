import React, { useState, useContext } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Spinner,
    Alert, Tabs, TabsHeader, Tab, TabsBody, TabPanel
} from "@material-tailwind/react";
import { AuthContext } from '@/context/AuthContext';
import { useUserManagement } from '@/hooks/useUserManagement';
import {
    UserTable,
    UserForm,
    UserFilters,
    UserActions
} from '@/components/userManagement';
import AlertPopUp from '@/components/Alert';
import initialFormState from './constants';
import { capitalize } from 'lodash';
import AuditLogPage from '@/components/userManagement/AuditLogPage';

const UserManagement = () => {
    const { user } = useContext(AuthContext);
    const {
        users,
        loading,
        error: fetchError,
        searchTerm,
        setSearchTerm,
        roleFilter,
        setRoleFilter,
        sortConfig,
        requestSort,
        filteredUsers,
        setUsers
    } = useUserManagement();

    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [userId, setUserId] = useState(null);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState(
        initialFormState
    );
    const [activeTab, setActiveTab] = React.useState("users");

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
        if (formData.password !== formData.confirmPassword) {
            setFormError("Passwords don't match");
            return;
        }

        if (editMode) {
            setUsers(users.map(user =>
                user.id === userId ? { ...user, ...formData } : user
            ));
        } else {
            const newUser = {
                id: users.length + 1,
                ...formData,
                avatar: `/avatars/default.png`,
                lastLogin: new Date().toISOString()
            };
            setUsers([...users, newUser]);
        }

        resetForm();
        setOpenDialog(false);
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setEditMode(false);
        setUserId(null);
        setFormError(null);
    };

    const editUser = (user) => {
        setFormData({
            ...initialFormState,
            ...user, // This will override any matching fields from initial state
            address: {
                ...initialFormState.address,
                ...(user.address || {})
            },
            bankDetails: {
                ...initialFormState.bankDetails,
                ...(user.bankDetails || {})
            },
            permissions: {
                ...initialFormState.permissions,
                ...(user.permissions || {})
            }
        });
        setEditMode(true);
        setUserId(user.id);
        setOpenDialog(true);
    };

    const deleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    const tabs = [
        {
            label: "User Management",
            value: "users",
            content: (
                <>
                    <div className="mb-4 p-4 bg-white rounded-lg shadow">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 basis-[60%]">
                                <UserFilters
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    roleFilter={roleFilter}
                                    setRoleFilter={setRoleFilter}
                                />
                            </div>
                            <UserActions
                                onAddUser={() => {
                                    resetForm();
                                    setOpenDialog(true);
                                }}
                                hasUserManagementPermission={user.permissions?.userManagement}
                            />
                        </div>
                    </div>
                    <Card className="mt-4">
                        <CardHeader
                            floated={false}
                            shadow={false}
                            color="transparent"
                            className="m-0 flex items-center justify-between p-4"
                        >
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-1">
                                    User Management
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="flex items-center gap-1 font-normal text-blue-gray-600"
                                >
                                    <strong>{capitalize(user.name)}</strong>: {capitalize(user.roles[0])}
                                </Typography>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {fetchError && (
                                <AlertPopUp message={fetchError} alertOpen={true} type={"error"} />
                            )}

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <Spinner className="h-8 w-8" />
                                </div>
                            ) : (
                                <UserTable
                                    users={filteredUsers}
                                    sortConfig={sortConfig}
                                    requestSort={requestSort}
                                    userId={user.id}
                                    onEditUser={editUser}
                                    onDeleteUser={deleteUser}
                                    hasUserManagementPermission={user.permissions?.userManagement}
                                />
                            )}
                        </CardBody>
                    </Card>
                </>

            ),
        },
        {
            label: "Audit Logs",
            value: "audit",
            content: (
                <Card className="mt-4">
                    <CardBody>
                        <AuditLogPage /> {/* Your audit log component */}
                    </CardBody>
                </Card>
            ),
        },
        // {
        //     label: "Roles & Permissions",
        //     value: "roles",
        //     content: (
        //         <Card className="mt-4">
        //             <CardBody>
        //                 <RolesPermissionsSection /> {/* Your roles/permissions component */}
        //             </CardBody>
        //         </Card>
        //     ),
        // },
    ];

    return (
        <div className="mt-2 flex-1 overflow-auto scrollbar-hide">
            <Tabs value={activeTab} onChange={setActiveTab}>
                <TabsHeader className="bg-transparent z-0" indicatorProps={{
                    className: "bg-blue-500/10 shadow-none ",
                }}>
                    {tabs.map(({ label, value }) => (
                        <Tab
                            key={value}
                            value={value}
                            className={`${activeTab === value ? "text-blue-500" : ""} z-0`}
                        >
                            {label}
                        </Tab>
                    ))}
                </TabsHeader>
                <TabsBody animate={{
                    initial: { y: 250 },
                    mount: { y: 0 },
                    unmount: { y: 250 },
                }}>
                    {tabs.map(({ value, content }) => (
                        <TabPanel key={value} value={value} className="p-0">
                            {content}
                        </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>
            {/* User Form Dialog (shared across tabs) */}
            <UserForm
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    resetForm();
                }}
                onSubmit={handleSubmit}
                formData={formData}
                onInputChange={handleInputChange}
                onRoleChange={handleRoleChange}
                editMode={editMode}
                error={formError}
            />
        </div>
    );
};

export default UserManagement;
import React from 'react';
import {
    Drawer,
    Typography,
    Avatar,
    Chip,
    Button,
    IconButton
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { getRoleDisplay } from '../../utils/userManagementUtils';

const UserDetailsDrawer = ({
    user,
    open,
    handleOpen,
    hasUserManagementPermission,
    onEditUser
}) => {
    if (!user) return null;

    return (
        <Drawer 
            open={open} 
            onClose={handleOpen}
            placement="right"
            className="p-4"
            size={400}
        >
            <div className="mb-6 flex items-center justify-between">
                <Typography variant="h5" color="blue-gray">
                    User Details
                </Typography>
                <IconButton 
                    variant="text" 
                    color="blue-gray" 
                    onClick={handleOpen}
                >
                    <XMarkIcon className="h-5 w-5" />
                </IconButton>
            </div>

            <div className="flex flex-col gap-6">
                {/* User Header */}
                <div className="flex items-center gap-4">
                    {/* <Avatar src={user.avatar} alt={user.name} size="xl" /> */}
                    <div>
                        <Typography variant="h4" color="blue-gray">
                            {user.name}
                        </Typography>
                        <Typography color="gray" className="font-medium">
                            {user.email}
                        </Typography>
                    </div>
                </div>

                {/* Basic Information */}
                <div>
                    <Typography variant="h6" color="blue-gray" className="mb-3">
                        Basic Information
                    </Typography>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Role
                            </Typography>
                            <Chip
                                variant="gradient"
                                color={getRoleDisplay(user.role).color}
                                value={getRoleDisplay(user.role).label}
                                className="w-fit mt-1"
                            />
                        </div>
                        <div>
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Status
                            </Typography>
                            <Chip
                                variant="gradient"
                                color={user.isActive ? "green" : "red"}
                                value={user.isActive ? "Active" : "Inactive"}
                                className="w-fit mt-1"
                            />
                        </div>
                    </div>
                </div>

                {/* Permissions */}
                <div>
                    <Typography variant="h6" color="blue-gray" className="mb-3">
                        Permissions
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                        {user.permissions.inventory && (
                            <Chip value="Inventory Management" className="text-sm" />
                        )}
                        {user.permissions.sales && (
                            <Chip value="Point of Sale" className="text-sm" />
                        )}
                        {user.permissions.reporting && (
                            <Chip value="Reporting" className="text-sm" />
                        )}
                        {user.permissions.userManagement && (
                            <Chip value="User Management" className="text-sm" />
                        )}
                    </div>
                </div>

                {/* Activity */}
                <div>
                    <Typography variant="h6" color="blue-gray" className="mb-3">
                        Activity
                    </Typography>
                    <div className="grid grid-cols-1 gap-3">
                        <div>
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Last Login
                            </Typography>
                            <Typography variant="small" className="mt-1">
                                {new Date(user.lastLogin).toLocaleString()}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Account Created
                            </Typography>
                            <Typography variant="small" className="mt-1">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-8 flex justify-between gap-2">
                <Button 
                    variant="outlined" 
                    color="gray" 
                    onClick={handleOpen}
                    fullWidth
                >
                    Close
                </Button>
                {hasUserManagementPermission && (
                    <Button
                        color="blue"
                        onClick={() => {
                            onEditUser(user);
                            handleOpen();
                        }}
                        fullWidth
                    >
                        Edit User
                    </Button>
                )}
            </div>
        </Drawer>
    );
};

export default UserDetailsDrawer;
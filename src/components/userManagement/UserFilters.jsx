import React from 'react';
import {
    Input,
    Select,
    Option,
    IconButton
} from "@material-tailwind/react";
import {
    MagnifyingGlassIcon,
    XMarkIcon
} from "@heroicons/react/24/solid";

const UserFilters = ({ 
    searchTerm, 
    setSearchTerm, 
    roleFilter, 
    setRoleFilter 
}) => {
    return (
        <div className=" flex flex-col md:flex-row gap-4">
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
    );
};

export default UserFilters;
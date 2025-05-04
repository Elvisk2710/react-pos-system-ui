import React from 'react';
import {
    Typography,
    IconButton,
    Avatar,
    Chip,
    Tooltip,
    Button
} from "@material-tailwind/react";
import {
    PencilIcon,
    TrashIcon,
    EyeIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowLeftIcon
} from "@heroicons/react/24/solid";
import { getRoleDisplay } from '../../utils/userManagementUtils';

const UserTable = ({
    users,
    sortConfig,
    requestSort,
    currentUserId,
    onEditUser,
    onDeleteUser,
    hasUserManagementPermission
}) => {
    const className = "py-2 px-6 text-left";
    const [activePage, setActivePage] = React.useState(1);
    const rowsPerPage = 8;

    // Calculate pagination data
    const indexOfLastRow = activePage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = users.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(users.length / rowsPerPage);

    const getItemProps = (index) => ({
        variant: activePage === index ? "filled" : "text",
        color: "gray",
        onClick: () => setActivePage(index),
        className: "rounded-full",
    });

    const next = () => {
        if (activePage === totalPages) return;
        setActivePage(activePage + 1);
    };

    const prev = () => {
        if (activePage === 1) return;
        setActivePage(activePage - 1);
    };

    // Generate page numbers to display (max 5 visible at a time)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, activePage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] table-auto">
                <thead>
                    <tr>
                        <th className={className}>
                            <Typography
                                variant="small"
                                className="font-normal leading-none opacity-70"
                            >
                                User
                            </Typography>
                        </th>
                        <th
                            className="border-b p-4 cursor-pointer"
                            onClick={() => requestSort('email')}
                        >
                            <div className="flex items-center gap-1">
                                <Typography
                                    variant="small"
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
                        <th className={className}>
                            <Typography
                                variant="small"
                                className="font-normal leading-none opacity-70"
                            >
                                Role
                            </Typography>
                        </th>
                        <th className={className}>
                            <Typography
                                variant="small"
                                className="font-normal leading-none opacity-70"
                            >
                                Permissions
                            </Typography>
                        </th>
                        <th
                            className="border-b p-4 cursor-pointer"
                            onClick={() => requestSort('lastLogin')}
                        >
                            <div className="flex items-center gap-1">
                                <Typography
                                    variant="small"
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
                        <th className={className}>
                            <Typography
                                variant="small"
                                className="font-normal leading-none opacity-70"
                            >
                                Actions
                            </Typography>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id} className="">
                                <td className={className}>
                                    <div className="flex items-center gap-3">
                                        {/* <Avatar src={user.avatar} alt={user.name} size="sm" /> */}
                                        <Typography variant="small" color="blue-gray" className="font-bold">
                                            {user.name}
                                        </Typography>
                                    </div>
                                </td>
                                <td className={className}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {user.email}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <Chip
                                        variant="gradient"
                                        color={getRoleDisplay(user.role).color}
                                        value={getRoleDisplay(user.role).label}
                                        className="text-xs py-0.5 px-2"
                                    />
                                </td>
                                <td className={className}>
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
                                <td className={className}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {new Date(user.lastLogin).toLocaleString()}
                                    </Typography>
                                </td>
                                <td className={className}>
                                    <div className="flex gap-2">
                                        <Tooltip content="View Details">
                                            <IconButton variant="text" color="blue-gray">
                                                <EyeIcon className="h-4 w-4" />
                                            </IconButton>
                                        </Tooltip>
                                        {hasUserManagementPermission && (
                                            <>
                                                <Tooltip content="Edit User">
                                                    <IconButton
                                                        variant="text"
                                                        onClick={() => onEditUser(user)}
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip content="Delete User">
                                                    <IconButton
                                                        variant="text"
                                                        color="red"
                                                        onClick={() => onDeleteUser(user.id)}
                                                        disabled={user.id === currentUserId}
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

            {/* Circular Pagination */}
            {users.length > rowsPerPage && (
                <div className="flex items-center justify-between p-4 border-t border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Page {activePage} of {totalPages}
                    </Typography>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="text"
                            className="flex items-center gap-2 rounded-full"
                            onClick={prev}
                            disabled={activePage === 1}
                        >
                            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
                        </Button>
                        <div className="flex items-center gap-2">
                            {getPageNumbers().map(page => (
                                <IconButton key={page} {...getItemProps(page)}>
                                    {page}
                                </IconButton>
                            ))}
                        </div>
                        <Button
                            variant="text"
                            className="flex items-center gap-2 rounded-full"
                            onClick={next}
                            disabled={activePage === totalPages}
                        >
                            Next
                            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;
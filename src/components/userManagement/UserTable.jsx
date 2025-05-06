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
  ArrowLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from "@heroicons/react/24/solid";
import { getRoleDisplay } from '../../utils/userManagementUtils';
import UserDetailsModal from './UserDetails';

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
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);

  // Calculate pagination data
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLastRow = activePage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = users.slice(indexOfFirstRow, indexOfLastRow);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setActivePage(page);
  };

  // Generate visible page numbers
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, activePage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Always show first page
    if (startPage > 1) {
      visiblePages.push(1);
      if (startPage > 2) {
        visiblePages.push('...');
      }
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        visiblePages.push('...');
      }
      visiblePages.push(totalPages);
    }

    return visiblePages;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] table-auto">
        <thead>
          <tr>
            <th className={className}>
              <Typography variant="small" className="font-normal leading-none opacity-70">
                User
              </Typography>
            </th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => requestSort('email')}
            >
              <div className="flex items-center gap-1">
                <Typography variant="small" className="font-normal leading-none opacity-70">
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
              <Typography variant="small" className="font-normal leading-none opacity-70">
                Role
              </Typography>
            </th>
            <th className={className}>
              <Typography variant="small" className="font-normal leading-none opacity-70">
                Permissions
              </Typography>
            </th>
            <th
              className="border-b p-4 cursor-pointer"
              onClick={() => requestSort('lastLogin')}
            >
              <div className="flex items-center gap-1">
                <Typography variant="small" className="font-normal leading-none opacity-70">
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
              <Typography variant="small" className="font-normal leading-none opacity-70">
                Actions
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((user) => (
              <tr key={user.id} className="hover:bg-blue-gray-50">
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
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        onClick={() => {
                          setSelectedUser(user);
                          setDetailsModalOpen(true);
                        }}
                      >
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

      {/* Enhanced Pagination */}
      {totalItems > rowsPerPage && (
        <div className="flex items-center justify-between p-4 border-t border-blue-gray-50">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Showing {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, totalItems)} of {totalItems} users
          </Typography>
          
          <div className="flex items-center gap-2">
            <IconButton
              variant="text"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={activePage === 1}
            >
              <ChevronDoubleLeftIcon className="h-4 w-4" />
            </IconButton>
            
            <IconButton
              variant="text"
              size="sm"
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage === 1}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </IconButton>

            {getVisiblePages().map((page, index) => (
              page === '...' ? (
                <IconButton key={`ellipsis-${index}`} variant="text" size="sm" disabled>
                  ...
                </IconButton>
              ) : (
                <IconButton
                  key={page}
                  variant={activePage === page ? "filled" : "text"}
                  color={activePage === page ? "blue" : "gray"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </IconButton>
              )
            ))}

            <IconButton
              variant="text"
              size="sm"
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === totalPages}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </IconButton>
            
            <IconButton
              variant="text"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={activePage === totalPages}
            >
              <ChevronDoubleRightIcon className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      )}

      <UserDetailsModal
        user={selectedUser}
        open={detailsModalOpen}
        handleOpen={() => setDetailsModalOpen(!detailsModalOpen)}
        hasUserManagementPermission={hasUserManagementPermission}
        onEditUser={onEditUser}
      />
    </div>
  );
};

export default UserTable;
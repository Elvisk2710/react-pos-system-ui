import React from 'react';
import {
  Typography,
  Chip,
  Tooltip,
  Button,
  IconButton
} from "@material-tailwind/react";
import {
  EyeIcon,
  DocumentArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from "@heroicons/react/24/solid";
import { formatDateTime } from '../../utils/dateUtils';

const ActivityLogTable = ({ logs, onViewDetails, onExport }) => {
  const getActionColor = (actionType) => {
    const colors = {
      CREATE: 'green',
      UPDATE: 'blue',
      DELETE: 'red',
      LOGIN: 'purple',
      LOGOUT: 'amber'
    };
    return colors[actionType] || 'gray';
  };

  const [activePage, setActivePage] = React.useState(1);
  const rowsPerPage = 8;
  
  // Calculate pagination data
  const totalItems = logs.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLastRow = activePage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = logs.slice(indexOfFirstRow, indexOfLastRow);

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
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5">Activity Logs</Typography>
        <Button
          variant="outlined"
          color="blue"
          className="flex items-center gap-2"
          onClick={onExport}
        >
          <DocumentArrowDownIcon className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <table className="w-full min-w-[640px] table-auto">
        <thead>
          <tr>
            <th className="py-3 px-5 text-left">Timestamp</th>
            <th className="py-3 px-5 text-left">User</th>
            <th className="py-3 px-5 text-left">Action</th>
            <th className="py-3 px-5 text-left">Entity</th>
            <th className="py-3 px-5 text-left">Details</th>
            <th className="py-3 px-5 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((log, index) => (
            <tr key={`${log.id}-${index}`} className="hover:bg-blue-gray-50">
              <td className="py-3 px-5">
                {formatDateTime(log.timestamp)}
              </td>
              <td className="py-3 px-5">
                <Typography variant="small">{log.userName}</Typography>
                <Typography variant="small" color="gray">{log.userEmail}</Typography>
              </td>
              <td className="py-3 px-5">
                <Chip
                  color={getActionColor(log.actionType)}
                  value={log.actionType}
                  className="capitalize"
                />
              </td>
              <td className="py-3 px-5 capitalize">{log.entityType}</td>
              <td className="py-3 px-5">
                <Typography variant="small" className="truncate max-w-xs">
                  {log.description}
                </Typography>
              </td>
              <td className="py-3 px-5">
                <Tooltip content="View Details">
                  <IconButton variant="text" onClick={() => onViewDetails(log)}>
                    <EyeIcon className="h-4 w-4" />
                  </IconButton>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Enhanced Pagination */}
      {totalItems > rowsPerPage && (
        <div className="flex items-center justify-between p-4 border-t border-blue-gray-50">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Showing {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, totalItems)} of {totalItems} entries
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
    </div>
  );
};

export default ActivityLogTable;
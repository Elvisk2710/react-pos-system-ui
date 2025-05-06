import React from 'react';
import {
  Drawer,
  Typography,
  Button,
  Badge,
  IconButton
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { formatDateTime } from '../../utils/dateUtils';

const LogDetailsDrawer = ({ log, open, handleClose }) => {
  if (!log) return null;

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      placement="right"
      size={500}
      className="p-4 z-[9999] fixed"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Typography variant="h4">Activity Log Details</Typography>
          <Typography color="gray" className="font-normal">
            {formatDateTime(log.timestamp)}
          </Typography>
        </div>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={handleClose}
        >
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </div>

      <div className="flex flex-col gap-6">
        {/* User Section */}
        <div>
          <Typography variant="h6" color="blue-gray" className="mb-3">
            User Information
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="small" className="font-bold text-gray-600">
                Name
              </Typography>
              <Typography>{log.userName}</Typography>
            </div>
            <div>
              <Typography variant="small" className="font-bold text-gray-600">
                Email
              </Typography>
              <Typography>{log.userEmail}</Typography>
            </div>
            <div>
              <Typography variant="small" className="font-bold text-gray-600">
                IP Address
              </Typography>
              <Typography>{log.ipAddress || 'Not recorded'}</Typography>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div>
          <Typography variant="h6" color="blue-gray" className="mb-3">
            Action Details
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="small" className="font-bold text-gray-600">
                Action Type
              </Typography>
              <Badge color={getActionColor(log.actionType)} className="w-fit">
                {log.actionType}
              </Badge>
            </div>
            <div>
              <Typography variant="small" className="font-bold text-gray-600">
                Entity Type
              </Typography>
              <Typography className="capitalize">{log.entityType}</Typography>
            </div>
            <div>
              <Typography variant="small" className="font-bold text-gray-600">
                Entity ID
              </Typography>
              <Typography>{log.entityId || 'N/A'}</Typography>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <Typography variant="h6" color="blue-gray" className="mb-3">
            Description
          </Typography>
          <Typography className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
            {log.description}
          </Typography>
        </div>

        {/* Changes */}
        {log.changes && (
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Detailed Changes
            </Typography>
            <div className="bg-gray-50 p-3 rounded">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(log.changes, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={handleClose}
          fullWidth
        >
          Close Details
        </Button>
      </div>
    </Drawer>
  );
};

// Color mapping for action types
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

export default LogDetailsDrawer;
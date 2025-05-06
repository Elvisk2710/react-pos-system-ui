import React, { useState } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Button,
  Input,
  Select,
  Option,
  Textarea
} from "@material-tailwind/react";
// import { DatePicker } from '@mui/x-date-pickers';

const ExportLogsDialog = ({ open, handleClose, onExport }) => {
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null
  });
  const [exportFormat, setExportFormat] = useState('csv');
  const [filters, setFilters] = useState({
    actionTypes: [],
    entityTypes: []
  });

  const handleExport = () => {
    const params = {
      format: exportFormat,
      ...dateRange,
      ...filters
    };
    onExport(params);
    handleClose();
  };

  return (
    <Dialog open={open} handler={handleClose} size="sm">
      <DialogHeader>Export Activity Logs</DialogHeader>
      <DialogBody divider>
        <div className="space-y-4">
          <div>
            <Typography variant="small" className="mb-2 font-bold">
              Date Range
            </Typography>
            <div className="flex gap-2">
              {/* <DatePicker
                label="Start Date"
                value={dateRange.start}
                onChange={(date) => setDateRange({...dateRange, start: date})}
                className="w-full"
              />
              <DatePicker
                label="End Date"
                value={dateRange.end}
                onChange={(date) => setDateRange({...dateRange, end: date})}
                className="w-full"
              /> */}
            </div>
          </div>

          <div>
            <Typography variant="small" className="mb-2 font-bold">
              Export Format
            </Typography>
            <Select
              label="Format"
              value={exportFormat}
              onChange={(val) => setExportFormat(val)}
            >
              <Option value="csv">CSV</Option>
              <Option value="excel">Excel</Option>
              <Option value="json">JSON</Option>
            </Select>
          </div>

          <div>
            <Typography variant="small" className="mb-2 font-bold">
              Filter by Action Type (Optional)
            </Typography>
            <Select
              label="Action Types"
              multiple
              onChange={(values) => setFilters({...filters, actionTypes: values})}
            >
              <Option value="CREATE">Create</Option>
              <Option value="UPDATE">Update</Option>
              <Option value="DELETE">Delete</Option>
              <Option value="LOGIN">Login</Option>
              <Option value="LOGOUT">Logout</Option>
            </Select>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={handleClose} className="mr-2">
          Cancel
        </Button>
        <Button color="blue" onClick={handleExport}>
          Export
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ExportLogsDialog;
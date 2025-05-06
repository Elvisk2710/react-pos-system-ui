import React from "react";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Typography, Button
} from "@material-tailwind/react";
import { CheckIcon, PrinterIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

const ReceiptDialog = ({ 
  open, 
  handler, 
  total, 
  paymentMethod, 
  changeDue 
}) => {
  return (
    <Dialog open={open} handler={handler}>
      <DialogHeader>Sale Completed</DialogHeader>
      <DialogBody>
        <div className="text-center mb-4">
          <CheckIcon className="h-12 w-12 text-black-500 mx-auto" />
          <Typography variant="h5" className="mt-2">
            Transaction #TXN-{Math.floor(Math.random() * 10000)}
          </Typography>
          <Typography variant="small" className="text-blue-gray-500">
            {new Date().toLocaleString()}
          </Typography>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <Typography>Total Amount:</Typography>
            <Typography className="font-bold">
              ${total.toFixed(2)}
            </Typography>
          </div>
          <div className="flex justify-between">
            <Typography>Payment Method:</Typography>
            <Typography className="capitalize">
              {paymentMethod}
            </Typography>
          </div>
          {changeDue > 0 && (
            <div className="flex justify-between">
              <Typography>Change Due:</Typography>
              <Typography>${changeDue.toFixed(2)}</Typography>
            </div>
          )}
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button
          variant="outlined"
          color="blue-gray"
          className="flex items-center gap-2"
        >
          <PrinterIcon className="h-5 w-5" />
          Print Receipt
        </Button>
        <Button
          variant="outlined"
          color="blue-gray"
          className="flex items-center gap-2"
        >
          <EnvelopeIcon className="h-5 w-5" />
          Email Receipt
        </Button>
        <Button color="black" onClick={() => handler(false)}>
          Done
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ReceiptDialog;  

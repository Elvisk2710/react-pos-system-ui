import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Typography, Button } from "@material-tailwind/react";
import { CheckIcon } from "@heroicons/react/24/outline";

const RefundSuccessDialog = ({ open, handler, refundData }) => {
  return (
    <Dialog open={open} handler={handler}>
      <DialogHeader>Refund Processed Successfully</DialogHeader>
      <DialogBody>
        <div className="space-y-4">
          <div className="flex justify-between">
            <Typography variant="small">Refund ID:</Typography>
            <Typography variant="small" className="font-semibold">
              {refundData?.refundId}
            </Typography>
          </div>
          <div className="flex justify-between">
            <Typography variant="small">Date:</Typography>
            <Typography variant="small">
              {new Date(refundData?.date).toLocaleString()}
            </Typography>
          </div>
          <div className="flex justify-between">
            <Typography variant="small">Amount Refunded:</Typography>
            <Typography variant="lead" className="font-bold text-green-600">
              ${refundData?.amount.toFixed(2)}
            </Typography>
          </div>
          <div className="flex justify-between">
            <Typography variant="small">Payment Method:</Typography>
            <Typography variant="small" className="capitalize">
              {refundData?.transactions[0]?.paymentMethod}
            </Typography>
          </div>
          {refundData?.reason && (
            <div>
              <Typography variant="small">Reason:</Typography>
              <Typography variant="small" className="italic">
                {refundData.reason}
              </Typography>
            </div>
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          color="green"
          onClick={() => handler(false)}
          className="flex items-center gap-2"
        >
          <CheckIcon className="h-5 w-5" />
          Done
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default RefundSuccessDialog;  

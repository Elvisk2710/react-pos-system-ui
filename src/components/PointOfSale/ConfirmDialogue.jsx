import React from "react";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Typography, Button, Input, Select, Option
} from "@material-tailwind/react";

const ConfirmDialog = ({
  open,
  handler,
  totals,
  discount,
  setDiscount,
  handleFinishTransaction
}) => {
  return (
    <Dialog open={open} handler={handler}>
      <DialogHeader>Confirm Order</DialogHeader>
      <DialogBody>
        <div className="space-y-4">
          <Typography>
            Subtotal: <strong>${totals.subtotal.toFixed(2)}</strong>
          </Typography>

          {discount.applied && (
            <Typography className="text-black-600">
              Discount: -<strong>${totals.discountAmount.toFixed(2)}</strong>
              {discount.type === "percentage" && ` (${discount.value}%)`}
              <Button
                variant="text"
                color="red"
                size="sm"
                className="ml-2"
                onClick={() => setDiscount({
                  applied: false,
                  type: "percentage",
                  value: 0,
                  code: "",
                  manualDiscountValue: 0
                })}
              >
                Remove
              </Button>
            </Typography>
          )}

          <Typography variant="h6">
            Total: <strong>${totals.total.toFixed(2)}</strong>
          </Typography>

          {!discount.applied && (
            <div className="mt-4 space-y-4">
              <Typography className="font-semibold text-gray-700">
                Apply Discount:
              </Typography>

              <div className="flex gap-2 mb-3">
                <Button
                  variant={discount.type === "percentage" && !discount.code ? 'filled' : 'outlined'}
                  color="black"
                  size="sm"
                  className="flex-1"
                  onClick={() => setDiscount(prev => ({
                    ...prev,
                    type: "percentage",
                    code: "",
                    manualDiscountValue: prev.type === "percentage" ? prev.manualDiscountValue : 10
                  }))}
                >
                  Percentage
                </Button>
                <Button
                  variant={discount.type === "fixed" && !discount.code ? 'filled' : 'outlined'}
                  color="black"
                  size="sm"
                  className="flex-1"
                  onClick={() => setDiscount(prev => ({
                    ...prev,
                    type: "fixed",
                    code: "",
                    manualDiscountValue: prev.type === "fixed" ? prev.manualDiscountValue : 5
                  }))}
                >
                  Fixed Amount
                </Button>
                <Button
                  variant={discount.type === "code" ? 'filled' : 'outlined'}
                  color="black"
                  size="sm"
                  className="flex-1"
                  onClick={() => setDiscount(prev => ({
                    ...prev,
                    type: "code",
                    code: prev.code || "",
                    manualDiscountValue: 0
                  }))}
                >
                  Discount Code
                </Button>
              </div>

              {discount.type === "code" ? (
                <div className="flex gap-2">
                  <Input
                    label="Discount Code"
                    value={discount.code}
                    onChange={(e) => setDiscount(prev => ({
                      ...prev,
                      code: e.target.value
                    }))}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    variant="gradient"
                    color="black"
                    onClick={() => setDiscount(prev => ({
                      ...prev,
                      applied: true
                    }))}
                    disabled={!discount.code.trim()}
                    className="h-[44px]"
                  >
                    Apply
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 items-end">
                  <Input
                    label={discount.type === "percentage" ? 'Discount Percentage' : 'Discount Amount'}
                    value={discount.manualDiscountValue || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (discount.type === "percentage") {
                        if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                          setDiscount(prev => ({
                            ...prev,
                            manualDiscountValue: value
                          }));
                        }
                      } else {
                        if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= totals.subtotal)) {
                          setDiscount(prev => ({
                            ...prev,
                            manualDiscountValue: value
                          }));
                        }
                      }
                    }}
                    type="number"
                    min={0}
                    max={discount.type === "percentage" ? 100 : totals.subtotal}
                    icon={discount.type === "percentage" ? <span>%</span> : <span>$</span>}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    variant="gradient"
                    color="black"
                    onClick={() => {
                      const value = parseFloat(discount.manualDiscountValue);
                      if (!isNaN(value) && value > 0) {
                        setDiscount(prev => ({
                          ...prev,
                          applied: true,
                          value: value,
                          manualDiscountValue: value
                        }));
                      }
                    }}
                    disabled={
                      !discount.manualDiscountValue ||
                      parseFloat(discount.manualDiscountValue) <= 0 ||
                      (discount.type === "percentage" && parseFloat(discount.manualDiscountValue) > 100)
                    }
                    className="h-[44px]"
                  >
                    Apply
                  </Button>
                </div>
              )}

              {discount.type !== "percentage" && !discount.code && (
                <Typography variant="small" className="text-gray-500 mt-1">
                  Maximum discount: ${totals.subtotal.toFixed(2)}
                </Typography>
              )}
            </div>
          )}
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between">
        <Button
          variant="text"
          onClick={() => handler(false)}
        >
          Cancel
        </Button>
        <Button
          color="black"
          onClick={() => {
            handler(false);
            handleFinishTransaction(totals.total);
          }}
        >
          Confirm Purchase
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDialog;  

import React from "react";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Typography, Card, CardHeader, CardBody,
  List, ListItem, ListItemPrefix, ListItemSuffix,
  Input, Select, Option, Button, Checkbox
} from "@material-tailwind/react";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";

const RefundDialog = ({
  open,
  handler,
  transactions,
  selectedItems,
  toggleItem,
  filter,
  setFilter,
  reason,
  setReason,
  calculateAmount,
  processRefund
}) => {
  return (
    <Dialog open={open} handler={handler} size="xl">
      <DialogHeader>Process Refund</DialogHeader>
      <DialogBody className="overflow-y-auto max-h-[70vh]">
        <div className="space-y-6">
          <div className="bg-blue-gray-50/50 p-4 rounded-lg">
            <Typography variant="h6" className="mb-3">Filter Transactions</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Date Range"
                type="date"
                onChange={(e) => setFilter({ ...filter, dateRange: e.target.value })}
              />
              <Input
                label="Product Name"
                value={filter.productName}
                onChange={(e) => setFilter({ ...filter, productName: e.target.value })}
              />
              <Input
                label="SKU"
                value={filter.sku}
                onChange={(e) => setFilter({ ...filter, sku: e.target.value })}
              />
              <Select
                label="Category"
                value={filter.category}
                onChange={(value) => setFilter({ ...filter, category: value })}
              >
                <Option value="">All Categories</Option>
                {[...new Set(transactions.flatMap(txn => txn.items.map(item => item.category)))].map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Typography variant="h6" className="mb-2">Select Transactions to Refund</Typography>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map(txn => (
                  <Card key={txn.id} className="border border-blue-gray-100">
                    <CardHeader
                      floated={false}
                      shadow={false}
                      color="transparent"
                      className="p-4 flex justify-between items-center bg-blue-gray-50/50"
                    >
                      <div>
                        <Typography variant="small">Transaction #{txn.id}</Typography>
                        <Typography variant="small" color="blue-gray">
                          {new Date(txn.date).toLocaleString()} • {txn.paymentMethod}
                        </Typography>
                      </div>
                      <Typography variant="lead">${txn.total.toFixed(2)}</Typography>
                    </CardHeader>
                    <CardBody className="p-4">
                      <List>
                        {txn.items.map(item => (
                          <ListItem key={`${txn.id}-${item.id}`} className="px-2 py-1">
                            <ListItemPrefix className="mr-2">
                              <Checkbox
                                checked={selectedItems.includes(`${txn.id}-${item.id}`)}
                                onChange={() => toggleItem(txn.id, item.id)}
                                ripple={false}
                              />
                            </ListItemPrefix>
                            <div className="flex-1">
                              <Typography variant="small" className="font-semibold">
                                {item.name}
                              </Typography>
                              <Typography variant="small" className="text-blue-gray-600">
                                ${item.price.toFixed(2)} × {item.quantity}
                              </Typography>
                            </div>
                            <ListItemSuffix>
                              <Typography variant="small" className="font-bold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </Typography>
                            </ListItemSuffix>
                          </ListItem>
                        ))}
                      </List>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-blue-gray-400">
                  <ShoppingBagIcon className="h-12 w-12 mx-auto mb-2" />
                  <Typography>No transactions match your filters</Typography>
                </div>
              )}
            </div>
          </div>

          <div>
            <Typography variant="h6" className="mb-2">Refund Details</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" className="block mb-1">Refund Amount</Typography>
                <Typography variant="h4" className="font-bold">
                  ${calculateAmount().toFixed(2)}
                </Typography>
              </div>
              <div>
                <Input
                  label="Reason for Refund (Optional)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between">
        <Button
          variant="text"
          color="red"
          onClick={() => {
            handler(false);
          }}
        >
          Cancel
        </Button>
        <Button
          color="green"
          onClick={processRefund}
          disabled={selectedItems.length === 0}
        >
          Process Refund
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default RefundDialog;  

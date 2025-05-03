import React from "react";
import {
  Typography, Card, CardHeader, CardBody,
  List, ListItem, ListItemSuffix, Badge,
  CardFooter, Button, IconButton
} from "@material-tailwind/react";
import { ShoppingCartIcon, ShoppingBagIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

const Cart = ({ cart, updateQuantity, totals, setOpenConfirmModal }) => {
  return (
    <Card className="border border-blue-gray-100 shadow-sm flex flex-col h-full">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 p-6 flex items-center justify-between"
      >
        <Typography variant="h6">
          <ShoppingCartIcon className="inline h-5 w-5 mr-2" />
          Shopping Cart
        </Typography>
        <Badge content={cart.length} />
      </CardHeader>

      <CardBody className="pt-0 flex-1 overflow-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-blue-gray-400">
            <ShoppingBagIcon className="h-12 w-12 mb-2" />
            <Typography className="text-center">Cart is empty</Typography>
          </div>
        ) : (
          <List>
            {cart.map((item) => (
              <ListItem key={item.id} className="py-1 px-2">
                <div className="flex-1">
                  <Typography variant="small" className="font-semibold">
                    {item.name}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-600">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </Typography>
                </div>
                <ListItemSuffix className="flex items-center gap-2">
                  <IconButton
                    variant="text"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </IconButton>
                  <span className="text-sm">{item.quantity}</span>
                  <IconButton
                    variant="text"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </IconButton>
                </ListItemSuffix>
              </ListItem>
            ))}
          </List>
        )}
      </CardBody>

      <CardFooter className="pt-0">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Typography>Subtotal:</Typography>
            <Typography>${totals.subtotal.toFixed(2)}</Typography>
          </div>
          <div className="flex justify-between">
            <Typography>Discount:</Typography>
            <Typography className="text-red-500">
              -${totals.discountAmount.toFixed(2)}
            </Typography>
          </div>
          <div className="flex justify-between border-t border-blue-gray-100 pt-2">
            <Typography variant="lead" className="font-bold">
              Total:
            </Typography>
            <Typography variant="lead" className="font-bold">
              ${totals.total.toFixed(2)}
            </Typography>
          </div>

          <Button
            color="black"
            className="w-full mt-4"
            onClick={() => setOpenConfirmModal(true)}
            disabled={cart.length === 0}
          >
            Finish Transaction
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}; 
export default Cart;  // Add this line at the bottom

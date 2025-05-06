import React from "react";
import { Card, CardBody, Typography, Chip } from "@material-tailwind/react";
import StockProgressBar from "./StockProgressBar";
const ProductCard = ({ product, addToCart }) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => addToCart(product)}
    >
      <CardBody className="p-4">
        <div className="flex justify-between items-start">
          <Typography variant="h6" className="truncate">
            {product.name}
          </Typography>
          <Chip
            value={product.category}
            color="blue"
            className="text-xs"
          />
        </div>
        <Typography variant="small" className="text-blue-gray-600">
          SKU: {product.sku}
        </Typography>
        <Typography variant="lead" className="mt-2 font-bold">
          ${product.price.toFixed(2)}
        </Typography>
        <StockProgressBar
          stock={product.stock}
          threshold={10}
        />
        <Typography variant="small" className="text-blue-gray-500">
          {product.stock} in stock
        </Typography>
      </CardBody>
    </Card>
  );
};

export default ProductCard;  

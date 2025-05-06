import React from "react";
import {
  Card, CardHeader, CardBody,
  Typography, Input, Chip, Button
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import ProductCard from "./ProductCard";

const ProductList = ({
  products,
  selectedCategory,
  searchTerm,
  setSearchTerm,
  changeCategory,
  addToCart,
  setOpenRefundModal,
  handleSearch,
  filteredProducts
}) => {
  return (
    <Card className="flex-1 overflow-auto xl:col-span-3 border border-blue-gray-100 shadow-sm h-full">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 flex flex-col items-start p-6 gap-4"
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Products
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
              <strong>{products.length}</strong> products available
            </Typography>
          </div>
          <div className="flex gap-2">
            <Input
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full flex items-center gap-2 h-14">
          <div className="flex-1 flex gap-2 overflow-y-auto py-2 scrollbar-hide">
            <Chip
              value="All"
              onClick={() => changeCategory("")}
              className="cursor-pointer h-10 flex-shrink-0"
              color={!selectedCategory ? "blue" : "gray"}
              variant={!selectedCategory ? "filled" : "outlined"}
            />
            {[...new Set(products.map(p => p.category))].map(category => (
              <Chip
                key={category}
                value={category}
                onClick={() => changeCategory(category)}
                className="cursor-pointer whitespace-nowrap h-10 flex-shrink-0"
                color={selectedCategory === category ? "blue" : "gray"}
                variant={selectedCategory === category ? "filled" : "outlined"}
              />
            ))}
          </div>

          <div className="w-auto flex-shrink-0 pl-2">
            <Button
              variant="text"
              color="red"
              className="h-10"
              onClick={() => setOpenRefundModal(true)}
            >
              Process Refund
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default ProductList;  

import React from "react";
import {
    Typography,
    IconButton,
    Button,
    Input,
    Select,
    Option,
  
    Drawer,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
    TagIcon,
    ArrowPathIcon,
    ArrowsUpDownIcon
} from "@heroicons/react/24/solid";

const BulkActionsPanel = ({
    selectedCount,
    onClose,
    onPriceUpdate,
    onStockUpdate,
    onCategoryChange,
    onStatusChange,
    open
}) => {
    const [price, setPrice] = React.useState("");
    const [stock, setStock] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [status, setStatus] = React.useState("");

    return (
        <Drawer
            open={open}
            onClose={onClose}
            placement="right"
            className="p-4 bg-white"
            size={500}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Typography variant="h5" color="blue-gray">
                        Bulk Actions ({selectedCount} items selected)
                    </Typography>
                    <IconButton variant="text" color="blue-gray" onClick={onClose}>
                        <XMarkIcon className="h-5 w-5" />
                    </IconButton>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto space-y-6">
                    {/* Price Update */}
                    <div className="space-y-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                            Price Update
                        </Typography>
                        <div className="flex gap-2">
                            <Input
                                label="New Price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                icon={<TagIcon className="h-4 w-4" />}
                                containerProps={{ className: "min-w-[72px]" }}
                            />
                            <Button
                                variant="gradient"
                                color="blue"
                                onClick={() => {
                                    onPriceUpdate(parseFloat(price));
                                    setPrice("");
                                }}
                                disabled={!price}
                                className="shrink-0"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>

                    {/* Stock Adjustment */}
                    <div className="space-y-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                            Stock Adjustment
                        </Typography>
                        <div className="flex gap-2">
                            <Input
                                label="Stock Value"
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                icon={<ArrowPathIcon className="h-4 w-4" />}
                                containerProps={{ className: "min-w-[72px]" }}
                            />
                            <Button
                                variant="gradient"
                                color="amber"
                                onClick={() => {
                                    onStockUpdate(parseInt(stock));
                                    setStock("");
                                }}
                                disabled={!stock}
                                className="shrink-0"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>

                    {/* Category Change */}
                    <div className="space-y-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                            Category Change
                        </Typography>
                        <div className="flex gap-2">
                            <Select
                                label="Select Category"
                                value={category}
                                onChange={(value) => setCategory(value)}
                                className="min-w-[150px]"
                            >
                                <Option value="electronics">Electronics</Option>
                                <Option value="clothing">Clothing</Option>
                                <Option value="food">Food</Option>
                                <Option value="home">Home Goods</Option>
                            </Select>
                            <Button
                                variant="gradient"
                                color="purple"
                                onClick={() => {
                                    onCategoryChange(category);
                                    setCategory("");
                                }}
                                disabled={!category}
                                className="shrink-0"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>

                    {/* Status Change */}
                    <div className="space-y-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                            Status Change
                        </Typography>
                        <div className="flex gap-2">
                            <Select
                                label="Select Status"
                                value={status}
                                onChange={(value) => setStatus(value)}
                                className="min-w-[150px]"
                            >
                                <Option value="in_stock">In Stock</Option>
                                <Option value="low_stock">Low Stock</Option>
                                <Option value="out_of_stock">Out of Stock</Option>
                            </Select>
                            <Button
                                variant="gradient"
                                color="green"
                                onClick={() => {
                                    onStatusChange(status);
                                    setStatus("");
                                }}
                                disabled={!status}
                                className="shrink-0"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-4">
                    <Button
                        variant="gradient"
                        color="red"
                        fullWidth
                        onClick={() => {
                            onBulkDelete();
                            handleClose();
                        }}
                    >
                        Delete Selected Items
                    </Button>
                </div>
            </div>
        </Drawer>
    );
};

export default BulkActionsPanel
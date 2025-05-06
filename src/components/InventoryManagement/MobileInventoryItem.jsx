import React from "react";
import {
    Typography,
    Chip,
    IconButton
} from "@material-tailwind/react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export const MobileInventoryItem = ({ product, canEdit, onView, onEdit, onDelete }) => {
    return (
        <div className="border-b py-4">
            <div className="flex justify-between">
                <Typography variant="h6">{product.name}</Typography>
                <Chip
                    value={product.status === "in_stock" ? "In Stock" : "Low Stock"}
                    color={product.status === "in_stock" ? "green" : "red"}
                    size="sm"
                />
            </div>
            <Typography variant="small">SKU: {product.sku}</Typography>
            <Typography variant="small">Price: ${product.price.toFixed(2)}</Typography>
            <Typography variant="small">Stock: {product.stock}</Typography>
            <div className="flex gap-2 mt-2">
                <IconButton size="sm" onClick={() => onView(product)}>
                    <EyeIcon className="h-4 w-4" />
                </IconButton>
                {canEdit && (
                    <>
                        <IconButton size="sm" onClick={() => onEdit(product)}>
                            <PencilIcon className="h-4 w-4" />
                        </IconButton>
                        <IconButton size="sm" color="red" onClick={() => onDelete(product)}>
                            <TrashIcon className="h-4 w-4" />
                        </IconButton>
                    </>
                )}
            </div>
        </div>
    );
};

export default MobileInventoryItem;
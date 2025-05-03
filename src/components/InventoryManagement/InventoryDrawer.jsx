import React, { useState } from "react";
import {
    Drawer,
    Typography,
    Avatar,
    IconButton,
    Tabs,
    TabsHeader,
    Tab,
    Chip,
    Progress,
    Accordion,
    AccordionHeader,
    AccordionBody,
    Button
} from "@material-tailwind/react";
import {
    XMarkIcon,
    ClockIcon as ClockIconOutline
} from "@heroicons/react/24/solid";

const InventoryDrawer = ({
    open,
    onClose,
    product,
    canEdit,
    onEdit,
    auditLog
}) => {
    const [activeTab, setActiveTab] = useState("details");

    if (!product) return null;

    return (
        <Drawer
            open={open}
            onClose={onClose}
            placement="right"
            size={500}
            className="p-6 overflow-y-auto"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Typography variant="h5" color="blue-gray">
                    Product Details
                </Typography>
                <IconButton variant="text" onClick={onClose}>
                    <XMarkIcon className="h-5 w-5" />
                </IconButton>
            </div>

            {/* Avatar and Name */}
            <div className="flex flex-col items-center mb-6">
                <Avatar
                    src={product.img}
                    alt={product.name}
                    size="xxl"
                    variant="rounded"
                    className="h-40 w-40 rounded-lg object-cover mb-4"
                />
                <Typography variant="h4" className="mb-1">
                    {product.name}
                </Typography>
                <Typography variant="h6" color="blue-gray">
                    {product.sku}
                </Typography>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} className="mb-6">
                <TabsHeader>
                    <Tab value="details" onClick={() => setActiveTab("details")}>
                        Details
                    </Tab>
                    <Tab value="inventory" onClick={() => setActiveTab("inventory")}>
                        Inventory
                    </Tab>
                    <Tab value="custom" onClick={() => setActiveTab("custom")}>
                        Custom Fields
                    </Tab>
                </TabsHeader>
            </Tabs>

            {/* Tab Content */}
            {activeTab === "details" && (
                <div className="space-y-4">
                    {[
                        ["Category", product.category],
                        ["Price", `$${product.price.toFixed(2)}`],
                        ["Cost", product.cost ? `$${product.cost.toFixed(2)}` : "N/A"],
                        ["Supplier", product.supplier || "N/A"],
                        ["Barcode", product.barcode || "N/A"]
                    ].map(([label, value], index) => (
                        <div key={index} className="flex justify-between">
                            <Typography variant="small" className="text-blue-gray-500">
                                {label}
                            </Typography>
                            <Typography variant="small" className="font-medium">
                                {value}
                            </Typography>
                        </div>
                    ))}
                    <div>
                        <Typography variant="small" className="text-blue-gray-500 mb-1">
                            Description
                        </Typography>
                        <Typography variant="small" className="font-medium">
                            {product.description || "No description available"}
                        </Typography>
                    </div>
                </div>
            )}

            {activeTab === "inventory" && (
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Typography variant="small" className="text-blue-gray-500">
                            Current Stock
                        </Typography>
                        <Typography variant="small" className="font-medium">
                            {product.stock} units
                        </Typography>
                    </div>
                    <div className="flex justify-between">
                        <Typography variant="small" className="text-blue-gray-500">
                            Low Stock Threshold
                        </Typography>
                        <Typography variant="small" className="font-medium">
                            {product.threshold} units
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="small" className="text-blue-gray-500 mb-1">
                            Stock Status
                        </Typography>
                        <Chip
                            variant="gradient"
                            color={product.status === "in_stock" ? "green" : "red"}
                            value={product.status === "in_stock" ? "In Stock" : "Low Stock"}
                            className="w-fit"
                        />
                    </div>
                    <div>
                        <Typography variant="small" className="text-blue-gray-500 mb-1">
                            Stock Level
                        </Typography>
                        <Progress
                            value={(product.stock / (product.threshold * 2)) * 100}
                            variant="gradient"
                            color={
                                product.stock <= product.threshold
                                    ? "red"
                                    : product.stock <= product.threshold * 2
                                        ? "amber"
                                        : "green"
                            }
                            className="h-2"
                        />
                    </div>
                </div>
            )}

            {activeTab === "custom" && (
                <div className="space-y-4">
                    {Object.entries(product.customFields || {}).length > 0 ? (
                        Object.entries(product.customFields).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                                <Typography variant="small" className="text-blue-gray-500 capitalize">
                                    {key}
                                </Typography>
                                <Typography variant="small" className="font-medium">
                                    {value}
                                </Typography>
                            </div>
                        ))
                    ) : (
                        <Typography variant="small" className="text-blue-gray-500">
                            No custom fields defined for this product
                        </Typography>
                    )}
                </div>
            )}

            {/* Buttons */}
            <div className="mt-6 flex gap-2">
                {canEdit && (
                    <Button
                        fullWidth
                        color="blue"
                        onClick={() => {
                            onClose();
                            onEdit();
                        }}
                    >
                        Edit Product
                    </Button>
                )}
                <Button fullWidth variant="outlined" onClick={onClose}>
                    Close
                </Button>
            </div>

            {/* Audit Log */}
            <div className="mt-6">
                <Accordion open={activeTab === "audit"}>
                    <AccordionHeader onClick={() => setActiveTab("audit")}>
                        <div className="flex items-center gap-2">
                            <ClockIconOutline className="h-5 w-5" />
                            <Typography variant="h6">Audit Log</Typography>
                        </div>
                    </AccordionHeader>
                    <AccordionBody>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {auditLog
                                .filter(
                                    (log) =>
                                        log.action.includes(product?.id) ||
                                        log.action.includes(product?.name)
                                )
                                .map((log, index) => (
                                    <div key={index} className="border-b pb-2">
                                        <Typography variant="small" className="font-medium">
                                            {log.action}
                                        </Typography>
                                        <Typography variant="small" className="text-blue-gray-500">
                                            {new Date(log.timestamp).toLocaleString()} by {log.user}
                                        </Typography>
                                    </div>
                                ))}
                        </div>
                    </AccordionBody>
                </Accordion>
            </div>
        </Drawer>
    );
};

export default InventoryDrawer;

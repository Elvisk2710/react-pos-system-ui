import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Checkbox,
  Chip,
  Progress,
  IconButton,
  Tooltip,
  Badge,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { 
  XMarkIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from "@heroicons/react/24/outline";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/solid";
import { getStockStatusColor, getStockStatusLabel } from "../../utils/inventoryUtils";
import {
  ArrowUpTrayIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import BulkActionsPanel from "./BulkActionsPanel";
import AlertPopUp from "../Alert";

const InventoryTable = ({
  products,
  loading,
  error,
  lowStockAlert,
  canEdit,
  selectedProducts,
  onSelect,
  onSelectAll,
  onView,
  onEdit,
  handleBulkAction,
  openBulkUpload,
  setOpenBulkUpload,
  bulkUploadProgress,
  bulkUploadStatus,
  openSeasonalManagement,
  setOpenSeasonalManagement,
  onBulkDelete,
  onBulkPriceUpdate,
  onBulkStockUpdate,
  onBulkCategoryChange,
  onBulkStatusChange
}) => {
  const className = "py-2 px-6 text-left";
  const [showBulkActions, setShowBulkActions] = React.useState(false);
  const [activePage, setActivePage] = React.useState(1);
  const rowsPerPage = 8;

  const handleBulkClose = () => {
    setShowBulkActions(false);
  };

  // Calculate pagination data
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLastRow = activePage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = products.slice(indexOfFirstRow, indexOfLastRow);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setActivePage(page);
  };

  // Generate visible page numbers
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, activePage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Always show first page
    if (startPage > 1) {
      visiblePages.push(1);
      if (startPage > 2) {
        visiblePages.push('...');
      }
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        visiblePages.push('...');
      }
      visiblePages.push(totalPages);
    }

    return visiblePages;
  };

  return (
    <>
      <BulkActionsPanel
        open={showBulkActions}
        selectedCount={selectedProducts.length}
        onClose={handleBulkClose}
        onDelete={onBulkDelete}
        onPriceUpdate={onBulkPriceUpdate}
        onStockUpdate={onBulkStockUpdate}
        onCategoryChange={onBulkCategoryChange}
        onStatusChange={onBulkStatusChange}
      />
      
      <Card className="overflow-hidden border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-4"
        >
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Product Inventory
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <strong>{products.length}</strong> products in inventory
              {lowStockAlert && (
                <Badge color="red" className="ml-2">
                  {products.filter(p => p.status === "low_stock").length} low stock
                </Badge>
              )}
            </Typography>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedProducts.length > 0 && (
              <Button
                variant="outlined"
                size="sm"
                color="blue"
                onClick={() => setShowBulkActions(true)}
                className="flex items-center gap-2"
              >
                <ArrowUpTrayIcon className="h-4 w-4" />
                Bulk Actions ({selectedProducts.length})
              </Button>
            )}
            <Button
              variant="outlined"
              size="sm"
              color="blue"
              onClick={() => setOpenBulkUpload(true)}
              className="flex items-center gap-2"
            >
              <ArrowUpTrayIcon className="h-4 w-4" />
              Bulk Upload
            </Button>
            <Button
              variant="gradient"
              size="sm"
              color="black"
              onClick={() => setOpenSeasonalManagement(true)}
              className="flex items-center gap-2"
            >
              <SparklesIcon className="h-4 w-4" />
              Seasonal Edits
            </Button>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? (
            <div className="flex justify-center p-6">
              <Spinner className="h-8 w-8" />
            </div>
          ) : error ? (
            <AlertPopUp message={error} alertOpen={true} type={"error"} />
          ) : (
            <>
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    <th className={className}>
                      <Checkbox
                        checked={selectedProducts.length === products.length && products.length > 0}
                        indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onSelectAll(products.map(p => p.id));
                          } else {
                            onSelectAll([]);
                          }
                        }}
                      />
                    </th>
                    {["product", "sku", "category", "price", "stock", "status"].map(
                      (el) => (
                        <th
                          key={el}
                          className={className}
                        >
                          <Typography
                            variant="small"
                            className="text-[11px] font-medium uppercase text-blue-gray-400"
                          >
                            {el}
                          </Typography>
                        </th>
                      )
                    )}
                    <th className={className}>
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        actions
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.length > 0 ? (
                    currentRows.map(product => (
                      <tr key={product.id} className="hover:bg-blue-gray-50">
                        <td className={className}>
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                onSelect(product.id);
                              } else {
                                onSelect(product.id, true);
                              }
                            }}
                          />
                        </td>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {product.name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {product.sku}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color="blue"
                            value={product.category}
                            className="text-xs py-0.5 px-2"
                          />
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            ${product.price.toFixed(2)}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {product.stock} units
                            </Typography>
                            <Progress
                              value={(product.stock / (product.threshold * 2)) * 100}
                              variant="gradient"
                              color={getStockStatusColor(product.stock, product.threshold)}
                              className="h-1"
                            />
                          </div>
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={getStockStatusColor(product.stock, product.threshold)}
                            value={getStockStatusLabel(product.status, product.stock)}
                            className="text-xs py-0.5 px-2"
                          />
                        </td>
                        <td className={className}>
                          <div className="flex gap-2">
                            <Tooltip content="View Details">
                              <IconButton
                                variant="text"
                                color="blue-gray"
                                onClick={() => onView(product)}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            {canEdit && (
                              <Tooltip content="Edit Product">
                                <IconButton
                                  variant="text"
                                  color="blue-gray"
                                  onClick={() => onEdit(product)}
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-4 text-center">
                        <Typography color="gray" className="font-normal">
                          No products found
                        </Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Enhanced Pagination */}
              {totalItems > rowsPerPage && (
                <div className="flex items-center justify-between p-4 border-t border-blue-gray-50">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    Showing {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, totalItems)} of {totalItems} products
                  </Typography>
                  
                  <div className="flex items-center gap-2">
                    <IconButton
                      variant="text"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={activePage === 1}
                    >
                      <ChevronDoubleLeftIcon className="h-4 w-4" />
                    </IconButton>
                    
                    <IconButton
                      variant="text"
                      size="sm"
                      onClick={() => handlePageChange(activePage - 1)}
                      disabled={activePage === 1}
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                    </IconButton>

                    {getVisiblePages().map((page, index) => (
                      page === '...' ? (
                        <IconButton key={`ellipsis-${index}`} variant="text" size="sm" disabled>
                          ...
                        </IconButton>
                      ) : (
                        <IconButton
                          key={page}
                          variant={activePage === page ? "filled" : "text"}
                          color={activePage === page ? "blue" : "gray"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </IconButton>
                      )
                    ))}

                    <IconButton
                      variant="text"
                      size="sm"
                      onClick={() => handlePageChange(activePage + 1)}
                      disabled={activePage === totalPages}
                    >
                      <ArrowRightIcon className="h-4 w-4" />
                    </IconButton>
                    
                    <IconButton
                      variant="text"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={activePage === totalPages}
                    >
                      <ChevronDoubleRightIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default InventoryTable;
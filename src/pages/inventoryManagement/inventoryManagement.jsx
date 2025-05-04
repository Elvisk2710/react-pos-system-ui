import React, { useState, useContext } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
  Badge,
  Drawer,
  Popover,
  PopoverHandler,
  PopoverContent,
  Select,
  Option,
  Slider,
  Input,
  Spinner,
  List,
  ListItem
} from "@material-tailwind/react";
import {
  PlusIcon,
  ArrowUpTrayIcon,
  QrCodeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon
} from "@heroicons/react/24/solid";
import { AuthContext } from "@/context/AuthContext.jsx";
import { MobileView } from "react-device-detect";
import { useInventory } from "@/hooks/useInventory";
import { filterProducts } from "../../utils/inventoryUtils";
import { isMobile } from "react-device-detect";
import {
  BarcodeScanner,
  InventoryTable,
  MobileInventoryItem,
  InventoryForm,
  InventoryDrawer,
  BulkUploadComponent,
  SeasonalEditsComponent
} from '../../components/InventoryManagement';
import inventoryTableData from "./mockData";
import AlertPopUp from "@/components/Alert";

export function InventoryManagement() {
  const { user } = useContext(AuthContext);
  const {
    products,
    loading,
    error,
    lowStockAlert,
    auditLog,
    addProduct,
    updateProduct,
    deleteProduct,
    logAuditAction
  } = useInventory(inventoryTableData);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const [bulkUploadStatus, setBulkUploadStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: [],
    stockStatus: "",
    priceRange: [0, 100]
  });
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [scanningBarcode, setScanningBarcode] = useState(false);
  const [selectedBulkAction, setSelectedBulkAction] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [openSeasonalManagement, setOpenSeasonalManagement] = useState(false);

  const canEdit = user?.roles?.some(role =>
    ["admin", "inventory_manager"].includes(role)
  );

  const filteredProducts = filterProducts(products, filters, searchQuery, selectedSeason);

  const handleBarcodeScanned = (barcode) => {
    setScanningBarcode(false);
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      setSelectedProduct(product);
      setOpenDrawer(true);
    } else {
      <AlertPopUp message={`Product with barcode ${barcode} not found`} alertOpen={true} type={"error"} />
    }
  };

  const handleBulkAction = () => {
    if (selectedProducts.length === 0) return;
    // Placeholder logic
    logAuditAction(`Performed bulk action: ${selectedBulkAction}`, user);
    setSelectedProducts([]);
    setSelectedBulkAction("");
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setOpenDrawer(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      await deleteProduct(product.id);
      logAuditAction(`Deleted product: ${product.name}`, user);
    }
  };

  const handleSelectProduct = (productId, remove = false) => {
    if (remove) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSelectAllProducts = (productIds) => {
    setSelectedProducts(productIds);
  };

  return (
    <div className="mt-2 flex-1 overflow-auto scrollbar-hide">
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Search Products"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setOpenModal(true)} icon={<PlusIcon className="h-4 w-4" />}>
            Add Product
          </Button>
          <Button onClick={() => setScanningBarcode(true)} icon={<QrCodeIcon className="h-4 w-4" />}>
            Scan Barcode
          </Button>
        </div>
      </div>

      {scanningBarcode && (
        <BarcodeScanner onDetected={handleBarcodeScanned} onClose={() => setScanningBarcode(false)} />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-12 w-12" />
        </div>
      ) : (
        <>
          {isMobile ? (
            filteredProducts.map(product => (
              <MobileInventoryItem
                key={product.id}
                product={product}
                onView={handleViewProduct}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                canEdit={canEdit}
              />
            ))
          ) : (
            <InventoryTable
              products={filteredProducts}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              canEdit={canEdit}
              selectedProducts={selectedProducts}
              onSelect={handleSelectProduct}
              onSelectAll={handleSelectAllProducts}
              openBulkUpload={openBulkUpload}
              bulkUploadFile={bulkUploadFile}
              bulkUploadProgress={bulkUploadProgress}
              bulkUploadStatus={bulkUploadStatus}
              setOpenBulkUpload={setOpenBulkUpload}
              handleBulkAction={handleBulkAction}
              setBulkUploadFile={setBulkUploadFile}
              setBulkUploadProgress={setBulkUploadProgress}
              setBulkUploadStatus={setBulkUploadStatus}
              setSelectedSeason={setSelectedSeason}
              openSeasonalManagement={openSeasonalManagement}
              setOpenSeasonalManagement={setOpenSeasonalManagement}
            />
          )}
        </>

      )}

      {openDrawer && selectedProduct && (
        <InventoryDrawer
          open={openDrawer}
          product={selectedProduct}
          onClose={() => setOpenDrawer(false)}
          auditLog={[]}
        />
      )}

      {openModal && (
        <Dialog open={openModal} handler={() => setOpenModal(false)} size="lg">
          <DialogHeader>{selectedProduct ? "Edit Product" : "Add Product"}</DialogHeader>
          <DialogBody>
            <InventoryForm
              product={selectedProduct}
              onSave={(data) => {
                selectedProduct ? updateProduct(data) : addProduct(data);
                logAuditAction(`${selectedProduct ? "Updated" : "Added"} product: ${data.name}`, user);
                setOpenModal(false);
                setSelectedProduct(null);
              }}
            />
          </DialogBody>
        </Dialog>
      )}

      <BulkUploadComponent open={openBulkUpload} onClose={() => setOpenBulkUpload(false)} />
      <SeasonalEditsComponent
        open={openSeasonalManagement}
        onClose={() => setOpenSeasonalManagement(false)}
        products={products}
        selectedSeasonalProducts={selectedProducts}
        onSeasonalUpdate={(updates) => {
          console.log("Applying seasonal updates:", updates);
          // Your update logic here
        }}
        seasons={["Summer", "Winter", "Spring", "Fall"]} // Optional custom seasons
      />
    </div>
  );
}

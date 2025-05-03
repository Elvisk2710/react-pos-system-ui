import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
  Input,
  Select,
  Option,
  Textarea,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
  Chip,
  Badge,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { AuthContext } from "@/context/AuthContext.jsx";

// Mock data
const inventoryTableData = [
  {
    id: "1",
    img: "/img/products/coffee.jpg",
    name: "Premium Coffee",
    sku: "COF-001",
    category: "Beverages",
    price: 4.99,
    stock: 42,
    threshold: 10,
    status: "in_stock",
    customFields: { size: "12oz", roast: "Medium" },
  },
  {
    id: "2",
    img: "/img/products/tea.jpg",
    name: "Organic Tea",
    sku: "TEA-001",
    category: "Beverages",
    price: 3.99,
    stock: 8,
    threshold: 5,
    status: "low_stock",
    customFields: { size: "16oz", type: "Green" },
  },
];

export function InventoryManagement() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lowStockAlert, setLowStockAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const canEdit = user?.roles?.some(role =>
    ["admin", "inventory_manager"].includes(role)
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // In a real app, replace with actual API call
        setProducts(inventoryTableData);
        checkLowStock(inventoryTableData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const checkLowStock = (productsList) => {
    const lowStockItems = productsList.filter(
      product => product.stock <= product.threshold
    );
    setLowStockAlert(lowStockItems.length > 0);
  };

  const handleAddProduct = async (product) => {
    try {
      // Replace with actual API call
      const newProduct = {
        ...product,
        id: Math.random().toString(36).substr(2, 9),
        img: "/img/products/default.jpg",
        status: product.stock > product.threshold ? "in_stock" : "low_stock"
      };
      setProducts([...products, newProduct]);
      checkLowStock([...products, newProduct]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleUpdateProduct = async (product) => {
    try {
      // Replace with actual API call
      const updatedProducts = products.map(p =>
        p.id === product.id ? {
          ...product,
          status: product.stock > product.threshold ? "in_stock" : "low_stock"
        } : p
      );
      setProducts(updatedProducts);
      checkLowStock(updatedProducts);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      // Replace with actual API call
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      checkLowStock(updatedProducts);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return (
    <div className="mt-2 flex-1 overflow-auto scrollbar-hide">
      <div className="mb-4">
        <Card className="overflow-hidden border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Product Inventory
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>{products.length}</strong> products in inventory
              </Typography>
            </div>
            {canEdit && (
              <Button
                color="blue"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  setSelectedProduct(null);
                  setOpenModal(true);
                }}
              >
                <PlusIcon className="h-4 w-4" />
                Add Product
              </Button>
            )}
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            {loading ? (
              <Typography className="p-6">Loading...</Typography>
            ) : error ? (
              <Alert color="red" className="m-6">
                {error}
              </Alert>
            ) : (
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["product", "sku", "category", "price", "stock", "status"].map(
                      (el) => (
                        <th
                          key={el}
                          className="border-b border-blue-gray-50 py-3 px-6 text-left"
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
                    {canEdit && (
                      <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          actions
                        </Typography>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {products.map(
                    ({ id, name, sku, category, price, stock, threshold, status }, key) => {
                      const className = `py-3 px-5 ${key === products.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                        }`;

                      return (
                        <tr key={id}>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-bold"
                              >
                                {name}
                              </Typography>
                            </div>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              className="text-xs font-medium text-blue-gray-600"
                            >
                              {sku}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              variant="gradient"
                              color="blue"
                              value={category}
                              className="text-xs py-0.5 px-2"
                            />
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              className="text-xs font-medium text-blue-gray-600"
                            >
                              ${price.toFixed(2)}
                            </Typography>
                          </td>
                          <td className={className}>
                            <div className="w-10/12">
                              <Typography
                                variant="small"
                                className="mb-1 block text-xs font-medium text-blue-gray-600"
                              >
                                {stock} units
                              </Typography>
                              <Progress
                                value={(stock / (threshold * 2)) * 100}
                                variant="gradient"
                                color={
                                  stock <= threshold
                                    ? "red"
                                    : stock <= threshold * 2
                                      ? "amber"
                                      : "green"
                                }
                                className="h-1"
                              />
                            </div>
                          </td>
                          <td className={className}>
                            <Chip
                              variant="gradient"
                              color={status === "in_stock" ? "green" : "red"}
                              value={status === "in_stock" ? "In Stock" : "Low Stock"}
                              className="text-xs py-0.5 px-2"
                            />
                          </td>
                          {canEdit && (
                            <td className={className}>
                              <div className="flex gap-2">
                                <Tooltip content="Edit Product">
                                  <IconButton
                                    variant="text"
                                    color="blue-gray"
                                    onClick={() => {
                                      setSelectedProduct(products.find(p => p.id === id));
                                      setOpenModal(true);
                                    }}
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip content="Delete Product">
                                  <IconButton
                                    variant="text"
                                    color={deleteConfirm === id ? "red" : "blue-gray"}
                                    onClick={() => {
                                      if (deleteConfirm === id) {
                                        handleDeleteProduct(id);
                                        setDeleteConfirm(null);
                                      } else {
                                        setDeleteConfirm(id);
                                      }
                                    }}
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Product Form Modal */}
      <Dialog open={openModal} handler={() => setOpenModal(false)} size="lg">
        <DialogHeader>
          {selectedProduct ? "Edit Product" : "Add New Product"}
        </DialogHeader>
        <DialogBody>
          <ProductForm
            product={selectedProduct}
            onClose={() => setOpenModal(false)}
            onSubmit={async (formData) => {
              if (selectedProduct) {
                await handleUpdateProduct(formData);
              } else {
                await handleAddProduct(formData);
              }
              setOpenModal(false);
            }}
          />
        </DialogBody>
      </Dialog>
    </div>
  );
}

const ProductForm = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(
    product || {
      name: "",
      sku: "",
      category: "",
      price: 0,
      stock: 0,
      threshold: 5,
      image: null,
      imagePreview: product?.img || "",
      customFields: {}
    }
  );
  const [customFieldKey, setCustomFieldKey] = useState("");
  const [customFieldValue, setCustomFieldValue] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: ""
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCustomFieldAdd = () => {
    if (customFieldKey && customFieldValue) {
      setFormData({
        ...formData,
        customFields: {
          ...formData.customFields,
          [customFieldKey]: customFieldValue
        }
      });
      setCustomFieldKey("");
      setCustomFieldValue("");
    }
  };

  const handleCustomFieldRemove = (key) => {
    const newCustomFields = { ...formData.customFields };
    delete newCustomFields[key];
    setFormData({ ...formData, customFields: newCustomFields });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="SKU"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          required
        />
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={(value) => setFormData({ ...formData, category: value })}
        >
          <Option value="Beverages">Beverages</Option>
          <Option value="Food">Food</Option>
          <Option value="Merchandise">Merchandise</Option>
          <Option value="Other">Other</Option>
        </Select>
        <Input
          label="Price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
        <Input
          label="Stock Level"
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          min="0"
          required
        />
        <Input
          label="Low Stock Threshold"
          type="number"
          name="threshold"
          value={formData.threshold}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="mb-4">
        <Typography variant="h6" className="mb-2">
          Custom Fields
        </Typography>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Field Name"
            value={customFieldKey}
            onChange={(e) => setCustomFieldKey(e.target.value)}
          />
          <Input
            placeholder="Field Value"
            value={customFieldValue}
            onChange={(e) => setCustomFieldValue(e.target.value)}
          />
          <Button size="sm" onClick={handleCustomFieldAdd}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(formData.customFields).map(([key, value]) => (
            <Chip
              key={key}
              value={`${key}: ${value}`}
              onClose={() => handleCustomFieldRemove(key)}
            />
          ))}
        </div>
      </div>
      {/* Image Upload Section */}
      <div className="md:col-span-2 flex flex-col items-center gap-4">
        {formData.imagePreview ? (
          <div className="relative">
            <Avatar
              src={formData.imagePreview}
              alt="Product preview"
              size="xxl"
              className="h-40 w-40 rounded-lg object-cover"
            />
            <IconButton
              color="red"
              size="sm"
              className="!absolute top-0 right-0 rounded-full"
              onClick={removeImage}
            >
              <TrashIcon className="h-4 w-4" />
            </IconButton>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-full">
            <Typography variant="small" className="mb-2">
              Product Image
            </Typography>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              id="product-image-upload"
            />
            <label
              htmlFor="product-image-upload"
              className="cursor-pointer bg-blue-gray-50 hover:bg-blue-gray-100 px-4 py-2 rounded-md transition-colors"
            >
              Choose an image
            </label>
          </div>
        )}
      </div>
      <br />
      <div className="flex justify-end gap-2">
        <Button variant="text" color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" color="blue">
          {product ? "Update" : "Add"} Product
        </Button>
      </div>
    </form>
  );
};

export default InventoryManagement;
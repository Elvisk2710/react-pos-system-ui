import React, { useState, useEffect, useRef } from "react";
import {
    Input,
    Select,
    Option,
    Button,
    IconButton,
    Avatar,
    Typography,
    Alert
} from "@material-tailwind/react";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/solid";

const InventoryForm = ({ product, onClose, onSubmit }) => {
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
    const [customFieldsInputs, setCustomFieldsInputs] = useState([]);
    const fileInputRef = useRef(null);
    const [alertOpen, setAlertOpen] = useState(false);

    useEffect(() => {
        if (product?.customFields) {
            const inputs = Object.entries(product.customFields).map(([key, value]) => ({
                key,
                value
            }));
            setCustomFieldsInputs(inputs);
        }
    }, [product]);

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

    const handleAddCustomField = () => {
        const hasEmptyField = customFieldsInputs.some(
            (field) => field.key.trim() === '' || field.value.trim() === ''
        );

        if (hasEmptyField) {
            setAlertOpen(true);
            return;
        } else {
            setCustomFieldsInputs([...customFieldsInputs, { key: '', value: '' }]);
        }
    };

    const handleCustomFieldChange = (index, field, value) => {
        const updatedInputs = [...customFieldsInputs];
        updatedInputs[index][field] = value;
        setCustomFieldsInputs(updatedInputs);
    };

    const handleRemoveCustomField = (index) => {
        const updatedInputs = [...customFieldsInputs];
        updatedInputs.splice(index, 1);
        setCustomFieldsInputs(updatedInputs);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const customFieldsObj = {};
        customFieldsInputs.forEach(field => {
            if (field.key && field.value) {
                customFieldsObj[field.key] = field.value;
            }
        });

        onSubmit({
            ...formData,
            customFields: customFieldsObj
        });
    };

    return (
        <>
            <Alert
                variant="gradient"
                open={alertOpen}
                icon={<Icon />}
                action={
                    <Button
                        variant="text"
                        color="white"
                        size="sm"
                        className="!absolute top-3 right-3"
                        onClick={() => setAlertOpen(false)}
                    >
                        Close
                    </Button>
                }
            >
                Please complete the existing custom fields before adding a new one.
            </Alert>

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

                    {customFieldsInputs.map((field, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <Input
                                placeholder="Field Name"
                                value={field.key}
                                onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)}
                            />
                            <Input
                                placeholder="Field Value"
                                value={field.value}
                                onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                            />
                            <IconButton
                                variant="outlined"
                                color="red"
                                size="sm"
                                onClick={() => handleRemoveCustomField(index)}
                            >
                                <TrashIcon className="h-4 w-4" />
                            </IconButton>
                        </div>
                    ))}

                    <Button
                        variant="outlined"
                        color="blue"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={handleAddCustomField}
                        type="button"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Add Custom Field
                    </Button>
                </div>

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
                    <Button variant="text" color="gray" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" color="blue">
                        {product ? "Update" : "Add"} Product
                    </Button>
                </div>
            </form>
        </>
    );
};

function Icon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
        >
            <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default InventoryForm;
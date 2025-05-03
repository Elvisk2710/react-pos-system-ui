import React from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
    Input,
    Progress,
    Alert,
    IconButton
} from "@material-tailwind/react";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";

const BulkUploadComponent = ({
    open,
    onClose,
    onUpload,
    uploadProgress,
    uploadStatus,
    allowedFileTypes = ['.csv', '.xlsx'],
    maxFileSize = 5 // in MB
}) => {
    const [file, setFile] = React.useState(null);
    const [error, setError] = React.useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        // Validate file type
        const fileExt = selectedFile.name.split('.').pop().toLowerCase();
        if (!allowedFileTypes.includes(`.${fileExt}`)) {
            setError(`Invalid file type. Allowed types: ${allowedFileTypes.join(', ')}`);
            return;
        }

        // Validate file size
        if (selectedFile.size > maxFileSize * 1024 * 1024) {
            setError(`File too large. Maximum size: ${maxFileSize}MB`);
            return;
        }

        setFile(selectedFile);
        setError(null);
    };

    const handleUpload = () => {
        if (!file) {
            setError("Please select a file first");
            return;
        }
        onUpload(file);
    };

    const handleClose = () => {
        setFile(null);
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} handler={handleClose} size="md">
            <DialogHeader className="flex justify-between items-center">
                <div>Bulk Upload Products</div>
                <IconButton variant="text" onClick={handleClose}>
                    <XMarkIcon className="h-5 w-5" />
                </IconButton>
            </DialogHeader>

            <DialogBody>
                {/* Required Fields Info */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <Typography variant="h6" color="blue-gray" className="mb-2">
                        Required CSV/XLSX Format
                    </Typography>
                    <Typography variant="small" className="text-blue-gray-700">
                        Your file must include these columns (case-sensitive):
                    </Typography>
                    <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                        <li><strong>name</strong> - Product name (string, required)</li>
                        <li><strong>sku</strong> - Unique SKU (string, required)</li>
                        <li><strong>category</strong> - Product category (string)</li>
                        <li><strong>price</strong> - Unit price (number, ≥0)</li>
                        <li><strong>stock</strong> - Current stock (integer, ≥0)</li>
                        <li><strong>threshold</strong> - Low stock threshold (integer)</li>
                        <li><strong>status</strong> - "in_stock", "low_stock", or "out_of_stock"</li>
                    </ul>
                    <Typography variant="small" className="mt-2 text-blue-gray-700">
                        <strong>Note:</strong> First row should be headers. Empty rows will be skipped.
                    </Typography>
                </div>

                {/* File Upload Section */}
                <div className="space-y-4">
                    <div
                        className="relative border-2 border-dashed border-blue-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
                        onClick={() => document.getElementById('file-upload').click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept={allowedFileTypes.join(',')}
                            onChange={handleFileChange}
                        />

                        <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="p-4 bg-blue-50 rounded-full">
                                <ArrowUpTrayIcon className="h-10 w-10 text-blue-500" />
                            </div>

                            <Typography variant="h6" color="blue-gray">
                                Drag & drop files here or click to browse
                            </Typography>

                            <Typography variant="small" color="blue-gray" className="mt-1">
                                Supported formats: {allowedFileTypes.join(', ')} (Max {maxFileSize}MB)
                            </Typography>

                            {file && (
                                <div className="mt-4 p-2 bg-green-50 rounded-md inline-flex items-center">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                    <Typography variant="small" color="green">
                                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </div>

                    {file && (
                        <div className="p-3 border border-green-500 rounded-lg bg-green-50">
                            <Typography variant="small" color="green">
                                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                            </Typography>
                        </div>
                    )}

                    {error && (
                        <Alert color="red" className="mt-2">
                            {error}
                        </Alert>
                    )}

                    {uploadStatus?.message && (
                        <Alert color={uploadStatus.success ? "green" : "red"}>
                            {uploadStatus.message}
                        </Alert>
                    )}

                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <Progress value={uploadProgress} color="blue" />
                    )}
                </div>
            </DialogBody>

            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={handleClose}
                    className="mr-1"
                >
                    Cancel
                </Button>
                <Button
                    variant="gradient"
                    color="green"
                    onClick={handleUpload}
                    disabled={!file || uploadProgress > 0}
                    className="flex items-center gap-2"
                >
                    <ArrowUpTrayIcon className="h-4 w-4" />
                    {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : "Upload"}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default BulkUploadComponent;
import React from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
    Input,
    Select,
    Option,
    Chip,
    IconButton,
    Tooltip
} from "@material-tailwind/react";
import { 
    SparklesIcon,
    XMarkIcon,
    CalendarIcon,
    ClockIcon,
    TagIcon,
    ArrowsUpDownIcon
} from "@heroicons/react/24/solid";

const SeasonalEditsComponent = ({
    open,
    onClose,
    products,
    selectedSeasonalProducts,
    onSeasonalUpdate,
    seasons = ["Summer", "Winter", "Spring", "Fall", "Holiday"]
}) => {
    const [selectedSeason, setSelectedSeason] = React.useState(seasons[0]);
    const [priceAdjustment, setPriceAdjustment] = React.useState("");
    const [adjustmentType, setAdjustmentType] = React.useState("percentage");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");

    const handleSubmit = () => {
        const updates = {
            season: selectedSeason,
            adjustment: {
                value: parseFloat(priceAdjustment),
                type: adjustmentType
            },
            dateRange: {
                start: startDate,
                end: endDate
            }
        };
        onSeasonalUpdate(updates);
        onClose();
    };

    return (
        <Dialog open={open} handler={onClose} size="lg">
            <DialogHeader className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-amber-500" />
                    <span>Seasonal Product Management</span>
                </div>
                <IconButton variant="text" onClick={onClose}>
                    <XMarkIcon className="h-5 w-5" />
                </IconButton>
            </DialogHeader>

            <DialogBody className="space-y-6">
                {/* Selected Products Preview */}
                <div>
                    <Typography variant="h6" color="blue-gray" className="mb-2">
                        Selected Products ({selectedSeasonalProducts.length})
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                        {selectedSeasonalProducts.slice(0, 5).map(product => (
                            <Chip
                                key={product.id}
                                value={product.name}
                                className="text-xs truncate max-w-[120px]"
                            />
                        ))}
                        {selectedSeasonalProducts.length > 5 && (
                            <Chip
                                value={`+${selectedSeasonalProducts.length - 5} more`}
                                className="text-xs"
                            />
                        )}
                    </div>
                </div>

                {/* Season Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Typography variant="small" className="mb-2 font-medium">
                            Select Season
                        </Typography>
                        <Select
                            label="Season"
                            value={selectedSeason}
                            onChange={(value) => setSelectedSeason(value)}
                            icon={<SparklesIcon className="h-4 w-4" />}
                        >
                            {seasons.map(season => (
                                <Option key={season} value={season}>
                                    {season}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {/* Date Range */}
                    <div>
                        <Typography variant="small" className="mb-2 font-medium">
                            Seasonal Duration
                        </Typography>
                        <div className="flex gap-2">
                            <Tooltip content="Start Date">
                                <Input
                                    type="date"
                                    label="Start Date"
                                    icon={<CalendarIcon className="h-4 w-4" />}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Tooltip>
                            <Tooltip content="End Date">
                                <Input
                                    type="date"
                                    label="End Date"
                                    icon={<CalendarIcon className="h-4 w-4" />}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Tooltip>
                        </div>
                    </div>
                </div>

                {/* Price Adjustment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Typography variant="small" className="mb-2 font-medium">
                            Price Adjustment
                        </Typography>
                        <div className="flex gap-2">
                            <Select
                                label="Adjustment Type"
                                value={adjustmentType}
                                onChange={(value) => setAdjustmentType(value)}
                                className="min-w-[120px]"
                                icon={<ArrowsUpDownIcon className="h-4 w-4" />}
                            >
                                <Option value="percentage">Percentage</Option>
                                <Option value="fixed">Fixed Amount</Option>
                            </Select>
                            <Input
                                label={adjustmentType === "percentage" ? "Percentage (%)" : "Amount ($)"}
                                type="number"
                                value={priceAdjustment}
                                onChange={(e) => setPriceAdjustment(e.target.value)}
                                icon={<TagIcon className="h-4 w-4" />}
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <Typography variant="small" className="mb-2 font-medium">
                            Adjustment Preview
                        </Typography>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            {priceAdjustment ? (
                                <Typography variant="small">
                                    {adjustmentType === "percentage" ? (
                                        <span>Prices will be {priceAdjustment >= 0 ? "increased" : "decreased"} by <strong>{Math.abs(priceAdjustment)}%</strong></span>
                                    ) : (
                                        <span>Prices will be {priceAdjustment >= 0 ? "increased" : "decreased"} by <strong>${Math.abs(priceAdjustment).toFixed(2)}</strong></span>
                                    )}
                                </Typography>
                            ) : (
                                <Typography variant="small" className="text-blue-gray-500">
                                    No adjustment specified
                                </Typography>
                            )}
                        </div>
                    </div>
                </div>
            </DialogBody>

            <DialogFooter>
                <Button variant="text" color="red" onClick={onClose} className="mr-1">
                    Cancel
                </Button>
                <Button
                    variant="gradient"
                    color="green"
                    onClick={handleSubmit}
                    disabled={!selectedSeason || !startDate || !endDate}
                    className="flex items-center gap-2"
                >
                    <SparklesIcon className="h-4 w-4" />
                    Apply Seasonal Changes
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default SeasonalEditsComponent;
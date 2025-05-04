import React, { useState } from 'react';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option,
    Typography,
    Checkbox,
    Button,
    Stepper,
    Step,
    Textarea
} from "@material-tailwind/react";
import {
    UserCircleIcon,
    IdentificationIcon,
    HomeIcon,
    BanknotesIcon,
    LockClosedIcon
} from "@heroicons/react/24/solid";

const UserForm = ({
    open,
    onClose,
    onSubmit,
    formData,
    onInputChange,
    onRoleChange,
    editMode,
    error
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(true);

    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    const steps = [
        {
            name: "Personal Info",
            icon: UserCircleIcon,
            fields: (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={onInputChange}
                            required
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onInputChange}
                        required
                    />
                    <Input
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={onInputChange}
                    />
                    <Input
                        label="Date of Birth"
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={onInputChange}
                    />
                </>
            )
        },
        {
            name: "Address",
            icon: HomeIcon,
            fields: (
                <>
                    <Input
                        label="Street Address"
                        name="address.street"
                        value={formData.address?.street || ''}
                        onChange={onInputChange}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="City"
                            name="address.city"
                            value={formData.address?.city || ''}
                            onChange={onInputChange}
                        />
                        <Input
                            label="State/Province"
                            name="address.state"
                            value={formData.address?.state || ''}
                            onChange={onInputChange}
                        />
                        <Input
                            label="Postal Code"
                            name="address.postalCode"
                            value={formData.address?.postalCode || ''}
                            onChange={onInputChange}
                        />
                    </div>
                    <Select
                        label="Country"
                        name="address.country"
                        value={formData.address?.country || ''}
                        onChange={(value) => onInputChange({ target: { name: 'address.country', value } })}
                    >
                        <Option value="US">United States</Option>
                        <Option value="UK">United Kingdom</Option>
                        <Option value="CA">Canada</Option>
                        <Option value="AU">Australia</Option>
                        <Option value="IN">India</Option>
                        {/* Add more countries as needed */}
                    </Select>
                </>
            )
        },
        {
            name: "Banking",
            icon: BanknotesIcon,
            fields: (
                <>
                    <Input
                        label="Bank Name"
                        name="bankDetails.bankName"
                        value={formData.bankDetails?.bankName || ''}
                        onChange={onInputChange}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Account Number"
                            name="bankDetails.accountNumber"
                            value={formData.bankDetails?.accountNumber || ''}
                            onChange={onInputChange}
                        />
                        <Input
                            label="Account Type"
                            name="bankDetails.accountType"
                            value={formData.bankDetails?.accountType || ''}
                            onChange={onInputChange}
                        />
                    </div>
                    <Input
                        label="Routing Number (US) / Sort Code (UK)"
                        name="bankDetails.routingNumber"
                        value={formData.bankDetails?.routingNumber || ''}
                        onChange={onInputChange}
                    />
                    <Input
                        label="IBAN (International)"
                        name="bankDetails.iban"
                        value={formData.bankDetails?.iban || ''}
                        onChange={onInputChange}
                    />
                </>
            )
        },
        {
            name: "Employment",
            icon: IdentificationIcon,
            fields: (
                <>
                    <Select
                        label="Role"
                        value={formData.role}
                        onChange={onRoleChange}
                        required
                    >
                        <Option value="admin">Admin</Option>
                        <Option value="inventory_manager">Inventory Manager</Option>
                        <Option value="cashier">Cashier</Option>
                        <Option value="accountant">Accountant</Option>
                        <Option value="manager">Manager</Option>
                    </Select>
                    <Input
                        label="Employee ID"
                        name="employeeId"
                        value={formData.employeeId || ''}
                        onChange={onInputChange}
                    />
                    <Input
                        label="Date Hired"
                        type="date"
                        name="dateHired"
                        value={formData.dateHired || ''}
                        onChange={onInputChange}
                    />
                    <Select
                        label="Employment Type"
                        name="employmentType"
                        value={formData.employmentType || ''}
                        onChange={(value) => onInputChange({ target: { name: 'employmentType', value } })}
                    >
                        <Option value="full_time">Full Time</Option>
                        <Option value="part_time">Part Time</Option>
                        <Option value="contract">Contract</Option>
                        <Option value="temporary">Temporary</Option>
                    </Select>
                    <Textarea
                        label="Notes"
                        name="notes"
                        value={formData.notes || ''}
                        onChange={onInputChange}
                    />
                </>
            )
        },
        {
            name: "Security",
            icon: LockClosedIcon,
            fields: (
                <>
                    {!editMode && (
                        <>
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={onInputChange}
                                required={!editMode}
                                minLength="8"
                            />
                            <Input
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={onInputChange}
                                required={!editMode}
                            />
                        </>
                    )}
                    <div className="pt-2">
                        <Typography variant="small" className="font-medium text-blue-gray-700 mb-2">
                            Permissions
                        </Typography>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Checkbox
                                    name="permissions.inventory"
                                    checked={formData.permissions.inventory}
                                    onChange={onInputChange}
                                    disabled={formData.role === 'admin'}
                                />
                                <Typography variant="small" className="ml-2">
                                    Inventory Management
                                </Typography>
                            </div>
                            <div className="flex items-center">
                                <Checkbox
                                    name="permissions.sales"
                                    checked={formData.permissions.sales}
                                    onChange={onInputChange}
                                    disabled={formData.role === 'admin'}
                                />
                                <Typography variant="small" className="ml-2">
                                    Point of Sale
                                </Typography>
                            </div>
                            <div className="flex items-center">
                                <Checkbox
                                    name="permissions.reporting"
                                    checked={formData.permissions.reporting}
                                    onChange={onInputChange}
                                    disabled={formData.role === 'admin'}
                                />
                                <Typography variant="small" className="ml-2">
                                    Reporting
                                </Typography>
                            </div>
                            <div className="flex items-center">
                                <Checkbox
                                    name="permissions.userManagement"
                                    checked={formData.permissions.userManagement}
                                    onChange={onInputChange}
                                    disabled={formData.role === 'admin'}
                                />
                                <Typography variant="small" className="ml-2">
                                    User Management
                                </Typography>
                            </div>
                            <div className="flex items-center">
                                <Checkbox
                                    name="permissions.financial"
                                    checked={formData.permissions.financial}
                                    onChange={onInputChange}
                                    disabled={formData.role === 'admin'}
                                />
                                <Typography variant="small" className="ml-2">
                                    Financial Access
                                </Typography>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    ];

    return (
        <Dialog open={open} handler={onClose} size="lg" className='p-6'>
            <DialogHeader>
                <div className="w-full">
                    <Stepper
                        activeStep={activeStep}
                        isLastStep={(value) => setIsLastStep(value)}
                        isFirstStep={(value) => setIsFirstStep(value)}
                    >
                        {steps.map((step, index) => (
                            <Step
                                key={index}
                                onClick={() => setActiveStep(index)}
                                className="cursor-pointer"
                            >
                                <step.icon className="h-5 w-5" />
                            </Step>
                        ))}
                    </Stepper>
                </div>
            </DialogHeader>
            <DialogBody className="h-[30rem] overflow-y-auto">
            <Typography className="hidden sm:block text-lg" color='black'>
                    {steps[activeStep].name}
                </Typography>
                <br />
                <form id="user-form" onSubmit={onSubmit} className="space-y-4">
                    {error && (
                        <div className="text-red-500 text-sm mb-4">{error}</div>
                    )}
                    {steps[activeStep].fields}
                </form>
            </DialogBody>
            <DialogFooter className="flex justify-between">
                <Button
                    variant="text"
                    color="blue-gray"
                    onClick={handlePrev}
                    disabled={isFirstStep}
                >
                    Back
                </Button>
                <div className="flex gap-2">
                    {!isLastStep ? (
                        <Button
                            color="blue"
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            variant="gradient"
                            color="green"
                            type="submit"
                            form="user-form"
                        >
                            {editMode ? 'Update User' : 'Create User'}
                        </Button>
                    )}
                    <Button
                        variant="text"
                        color="red"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </DialogFooter>
        </Dialog>
    );
};

export default UserForm;
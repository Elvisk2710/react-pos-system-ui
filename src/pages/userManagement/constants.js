const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    },
    bankDetails: {
        bankName: '',
        accountNumber: '',
        accountType: '',
        routingNumber: '',
        iban: ''
    },
    employeeId: '',
    dateHired: '',
    employmentType: '',
    notes: '',
    role: 'cashier',
    password: '',
    confirmPassword: '',
    permissions: {
        inventory: false,
        sales: false,
        reporting: false,
        userManagement: false,
        financial: false
    }
};

export default initialFormState;
import React from "react";
import { debounce } from 'lodash';
// Import components
import {
    Cart,
    ProductCard,
    ProductList,
    RefundDialog,
    RefundSuccessDialog,
    ReceiptDialog,
    ConfirmDialog,
    StockProgressBar
} from '../../components/PointOfSale';

// Import utilities
import {
    getUniqueCategories,
    calculateTotals,
    filterRefundTransactions,
    calculateRefundAmount
} from '../../utils';
import { capitalizeWords } from "@/utils/text";
import AlertPopUp from "@/components/Alert";

export function PointOfSale() {
    const [cart, setCart] = React.useState([]);
    const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
    const [products] = React.useState([
        { id: "1", name: "Premium Coffee", sku: "COF-001", category: "Beverages", price: 4.99, stock: 42 },
        { id: "2", name: "Organic Tea", sku: "TEA-001", category: "Beverages", price: 3.99, stock: 15 },
        { id: "3", name: "Chocolate Croissant", sku: "BAK-001", category: "Bakery", price: 2.99, stock: 28 },
        { id: "4", name: "Premium Coffee", sku: "COF-001", category: "Beverages", price: 4.99, stock: 42 },
        { id: "5", name: "Organic Tea", sku: "TEA-001", category: "Beverages", price: 3.99, stock: 11 },
        { id: "6", name: "Chocolate Croissant", sku: "BAK-001", category: "Bakery", price: 2.99, stock: 28 },
        { id: "7", name: "Premium Coffee", sku: "COF-001", category: "Beverages", price: 4.99, stock: 42 },
        { id: "8", name: "Organic Tea", sku: "TEA-001", category: "Beverages", price: 3.99, stock: 0 },
        { id: "9", name: "Chocolate Croissant", sku: "BAK-001", category: "Bakery", price: 2.99, stock: 28 },
    ]);
    const [selectedCategory, setSelectedCategory] = React.useState("");
    const [searchTerm, setSearchTerm] = React.useState("");
    const [payment, setPayment] = React.useState({ method: "cash", amount: 0 });
    const [openReceipt, setOpenReceipt] = React.useState(false);
    const [openRefundModal, setOpenRefundModal] = React.useState(false);
    const [refundTransactions, setRefundTransactions] = React.useState([
        {
            id: "TXN-1001",
            date: "2023-05-15T10:30:00",
            customer: "John Smith",
            items: [
                {
                    id: "1",
                    name: "Premium Coffee",
                    sku: "COF-001",
                    category: "Beverages",
                    price: 4.99,
                    quantity: 2
                },
                {
                    id: "3",
                    name: "Chocolate Croissant",
                    sku: "BAK-001",
                    category: "Bakery",
                    price: 2.99,
                    quantity: 1
                }
            ],
            total: 12.97,
            paymentMethod: "credit",
            status: "completed"
        },
        {
            id: "TXN-1002",
            date: "2023-05-14T16:45:00",
            customer: "Sarah Johnson",
            items: [
                {
                    id: "2",
                    name: "Organic Tea",
                    sku: "TEA-001",
                    category: "Beverages",
                    price: 3.99,
                    quantity: 3
                }
            ],
            total: 11.97,
            paymentMethod: "cash",
            status: "completed"
        },
        {
            id: "TXN-1003",
            date: "2023-05-13T09:15:00",
            customer: "Michael Brown",
            items: [
                {
                    id: "4",
                    name: "Premium Coffee",
                    sku: "COF-001",
                    category: "Beverages",
                    price: 4.99,
                    quantity: 1
                },
                {
                    id: "6",
                    name: "Chocolate Croissant",
                    sku: "BAK-001",
                    category: "Bakery",
                    price: 2.99,
                    quantity: 2
                }
            ],
            total: 10.97,
            paymentMethod: "debit",
            status: "completed"
        },
        {
            id: "TXN-1004",
            date: "2023-05-12T14:20:00",
            customer: "Emily Davis",
            items: [
                {
                    id: "5",
                    name: "Organic Tea",
                    sku: "TEA-001",
                    category: "Beverages",
                    price: 3.99,
                    quantity: 1
                },
                {
                    id: "3",
                    name: "Chocolate Croissant",
                    sku: "BAK-001",
                    category: "Bakery",
                    price: 2.99,
                    quantity: 1
                }
            ],
            total: 6.98,
            paymentMethod: "cash",
            status: "completed"
        },
        {
            id: "TXN-1005",
            date: "2023-05-11T11:05:00",
            customer: "David Wilson",
            items: [
                {
                    id: "1",
                    name: "Premium Coffee",
                    sku: "COF-001",
                    category: "Beverages",
                    price: 4.99,
                    quantity: 3
                }
            ],
            total: 14.97,
            paymentMethod: "credit",
            status: "completed"
        }
    ]);
    const [selectedRefundItems, setSelectedRefundItems] = React.useState([]);
    const [refundReason, setRefundReason] = React.useState("");
    const [openRefundSuccessModal, setOpenRefundSuccessModal] = React.useState(false);
    const [refundSuccessData, setRefundSuccessData] = React.useState(null);
    const [filteredProducts, setFilteredProducts] = React.useState(products);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertType, setAlertType] = React.useState("");
    const [alertMessage, setAlertMessage] = React.useState("");
    const [refundFilter, setRefundFilter] = React.useState({
        dateRange: '',
        productName: '',
        sku: '',
        category: ''
    });
    const [discount, setDiscount] = React.useState({
        applied: false,
        type: "percentage",
        value: 0,
        code: "",
        manualDiscountValue: 0
    });
    // Calculate totals
    const totals = calculateTotals(cart, discount);
    const changeDue = payment.amount - totals.total;

    // Cart functions
    const addToCart = (product) => {
        if (product.stock != 0) {
            setCart(prev => {
                const existing = prev.find(item => item.id === product.id);
                return existing
                    ? prev.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                    : [...prev, { ...product, quantity: 1 }];
            });
        } else {
            callAlert(capitalizeWords("Sorry Item Is Out Of Stock"))
        }
    };

    const callAlert = (message) => {
        setAlertMessage(message)
        setAlertType("error")
        setOpenAlert(true)
    }

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) {
            setCart(prev => prev.filter(item => item.id !== id));
            return;
        }
        setCart(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    // Transaction functions
    const handleFinishTransaction = () => {
        console.log("Transaction completed:", cart);
        setOpenReceipt(true);
    };

    const completeSale = () => {
        setOpenReceipt(true);
        setCart([]);
        setPayment(prev => ({ ...prev, amount: 0 }));
    };

    const toggleRefundItem = (txnId, itemId) => {
        setSelectedRefundItems(prev => {
            const itemKey = `${txnId}-${itemId}`;
            if (prev.includes(itemKey)) {
                return prev.filter(i => i !== itemKey);
            } else {
                return [...prev, itemKey];
            }
        });
    };

    const processRefund = () => {
        const refundAmount = calculateRefundAmount(refundTransactions, selectedRefundItems);
        const refundData = {
            refundId: `REF-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toISOString(),
            amount: refundAmount,
            transactions: refundTransactions.filter(txn =>
                txn.items.some(item => selectedRefundItems.includes(`${txn.id}-${item.id}`))
            ),
            items: selectedRefundItems,
            reason: refundReason
        };

        // In a real app, you would call your refund API here
        console.log("Processing refund:", refundData);

        setRefundSuccessData(refundData);
        setOpenRefundSuccessModal(true);
        setOpenRefundModal(false);
        setSelectedRefundItems([]);
        setRefundReason("");
    };

    const debouncedSearch = React.useCallback(
        debounce((term) => {
            if (!term.trim() || term == null || term == "") {
                setFilteredProducts(products);
                return;
            }

            const searchTerms = term.toLowerCase().split(' ');

            const results = products.filter(product => {
                const productValues = Object.values(product).join(' ').toLowerCase();
                return searchTerms.every(st => productValues.includes(st));
            });

            setFilteredProducts(results);
        }, 300),
        [products]
    );

    const handleSearch = (term) => {
        setSearchTerm(term);
        debouncedSearch(term);
    };

    const changeCategory = (category) => {
        setSearchTerm(category);
        debouncedSearch(category);
        setSelectedCategory(category)
    }
    // Filter refund transactions
    const filteredRefundTransactions = filterRefundTransactions(refundTransactions, refundFilter);

    return (
        <div className="mt-2 flex-1 overflow-auto scrollbar-hide">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 h-full">
                {/* Products Section */}
                <ProductList
                    filteredProducts={filteredProducts}
                    products={products} // Pass the filtered products
                    selectedCategory={selectedCategory}
                    searchTerm={searchTerm}
                    handleSearch={handleSearch}
                    setSearchTerm={setSearchTerm}
                    changeCategory={changeCategory}
                    addToCart={addToCart}
                    setOpenRefundModal={setOpenRefundModal}
                />

                {/* Cart Section */}
                <Cart
                    cart={cart}
                    updateQuantity={updateQuantity}
                    totals={totals}
                    setOpenConfirmModal={setOpenConfirmModal}
                />
            </div>

            {/* Dialogs */}
            <ConfirmDialog
                open={openConfirmModal}
                handler={setOpenConfirmModal}
                totals={totals}
                discount={discount}
                setDiscount={setDiscount}
                handleFinishTransaction={handleFinishTransaction}
            />

            <ReceiptDialog
                open={openReceipt}
                handler={setOpenReceipt}
                total={totals.total}
                paymentMethod={payment.method}
                changeDue={changeDue}
            />

            <RefundDialog
                open={openRefundModal}
                handler={setOpenRefundModal}
                transactions={filteredRefundTransactions}
                selectedItems={selectedRefundItems}
                toggleItem={toggleRefundItem}
                filter={refundFilter}
                setFilter={setRefundFilter}
                reason={refundReason}
                setReason={setRefundReason}
                calculateAmount={() => calculateRefundAmount(refundTransactions, selectedRefundItems)}
                processRefund={processRefund}
            />

            <RefundSuccessDialog
                open={openRefundSuccessModal}
                handler={setOpenRefundSuccessModal}
                refundData={refundSuccessData}
            />
            <AlertPopUp message={alertMessage} alertOpen={openAlert} type={alertType} />
        </div>
    );
}

export default PointOfSale;
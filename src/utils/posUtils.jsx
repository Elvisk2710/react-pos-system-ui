export const getUniqueCategories = (products) => {
    if (!products || !Array.isArray(products)) return [];
    
    try {
      const categories = products
        .map(product => product?.category)
        .filter(Boolean);
      return [...new Set(categories)];
    } catch (error) {
      console.error("Error extracting categories:", error);
      return [];
    }
  };
  
  export const calculateTotals = (cart, discount) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
    let discountAmount = 0;
    if (discount.applied) {
      discountAmount = discount.type === "percentage"
        ? subtotal * (discount.value / 100)
        : Math.min(discount.value, subtotal);
    }
  
    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  };
  
  export const filterRefundTransactions = (transactions, filter) => {
    return transactions.filter(txn => {
      if (filter.dateRange) {
        const txnDate = new Date(txn.date);
        const [start, end] = filter.dateRange.split(' to ');
        if (start && new Date(start) > txnDate) return false;
        if (end && new Date(end) < txnDate) return false;
      }
      
      if (filter.productName && 
          !txn.items.some(item => 
            item.name.toLowerCase().includes(filter.productName.toLowerCase())
          )) {
        return false;
      }
      
      if (filter.sku && 
          !txn.items.some(item => 
            item.sku.toLowerCase().includes(filter.sku.toLowerCase())
          )) {
        return false;
      }
      
      if (filter.category && 
          !txn.items.some(item => 
            item.category === filter.category
          )) {
        return false;
      }
      
      return true;
    });
  };
  
  export const calculateRefundAmount = (transactions, selectedItems) => {
    return transactions.reduce((total, txn) => {
      const txnItems = txn.items.filter(item =>
        selectedItems.includes(`${txn.id}-${item.id}`)
      );
      return total + txnItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, 0);
  };
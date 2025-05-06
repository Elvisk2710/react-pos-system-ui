import { useState, useEffect } from "react";

export const useInventory = (initialProducts = []) => {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lowStockAlert, setLowStockAlert] = useState(false);
  const [auditLog, setAuditLog] = useState([]);

  const checkLowStock = (productsList) => {
    const lowStockItems = productsList.filter(
      product => product.stock <= product.threshold
    );
    setLowStockAlert(lowStockItems.length > 0);
  };

  const logAuditAction = (action, user, isError = false) => {
    setAuditLog(prev => [{
      timestamp: new Date().toISOString(),
      action,
      user: user?.email || "System",
      isError
    }, ...prev.slice(0, 99)]);
  };

  const addProduct = async (product) => {
    try {
      const newProduct = {
        ...product,
        id: Math.random().toString(36).substr(2, 9),
        img: "/img/products/default.jpg",
        status: product.stock > product.threshold ? "in_stock" : "low_stock"
      };
      setProducts(prev => [...prev, newProduct]);
      checkLowStock([...products, newProduct]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateProduct = async (product) => {
    try {
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

  const deleteProduct = async (id) => {
    try {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      checkLowStock(updatedProducts);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    products,
    loading,
    error,
    lowStockAlert,
    auditLog,
    setProducts,
    setLoading,
    setError,
    checkLowStock,
    logAuditAction,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
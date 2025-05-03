export const filterProducts = (products, filters, searchQuery, selectedSeason) => {
  return products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filters.category.length === 0 ||
      filters.category.includes(product.category);

    const matchesStockStatus =
      !filters.stockStatus ||
      (filters.stockStatus === "low" && product.status === "low_stock") ||
      (filters.stockStatus === "in_stock" && product.status === "in_stock");

    const matchesPriceRange =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];

    const matchesSeason =
      selectedSeason === "All" ||
      (product.seasonal?.isSeasonal && product.seasonal.season === selectedSeason);

    return matchesSearch && matchesCategory && matchesStockStatus &&
      matchesPriceRange && matchesSeason;
  });
};

export const getStockStatusColor = (stock, threshold) => {
  if (stock <= threshold) return "red";
  if (stock <= threshold * 2) return "amber";
  return "green";
};

export const getStockStatusLabel = (status, stock) => {
  let stockStatus;
  if (status == "in_stock") {
    stockStatus = "In Stock"
  } else if (stock == 0) {
    stockStatus = "No Stock";
  } else {
    stockStatus = "Low Stock";
  }
  return stockStatus
};
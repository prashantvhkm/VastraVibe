import React, { useState, useEffect } from "react";

// Product Form Component
const ProductForm = ({ product, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (product && isEditing) {
      setFormData(product);
    }
  }, [product, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-danger">
                {isEditing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onEdit, onDelete }) => {
  const getStockBadge = (stock) => {
    if (stock === 0)
      return <span className="badge bg-danger">Out of Stock</span>;
    if (stock < 10) return <span className="badge bg-warning">Low Stock</span>;
    return <span className="badge bg-success">In Stock</span>;
  };

  return (
    <div className="col-xl-3 col-lg-4 col-md-6">
      <div className="card product-card shadow-sm border-0 h-100">
        <div className="position-relative">
          <img
            src={product.image || "/api/placeholder/300/200"}
            className="card-img-top"
            alt={product.name}
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="position-absolute top-0 end-0 m-2">
            {getStockBadge(product.stock)}
          </div>
        </div>
        <div className="card-body d-flex flex-column">
          <h6 className="card-title text-truncate">{product.name}</h6>
          <p className="card-text small text-muted mb-2">{product.category}</p>
          <p className="card-text small text-muted flex-grow-1">
            {product.description || "No description available"}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <span className="h6 text-danger mb-0">₹{product.price}</span>
            <small className="text-muted">Stock: {product.stock}</small>
          </div>
        </div>
        <div className="card-footer bg-white border-0">
          <div className="btn-group w-100">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => onEdit(product)}
            >
              <i className="fas fa-edit me-1"></i>Edit
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(product.id)}
            >
              <i className="fas fa-trash me-1"></i>Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Products Component
const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // Mock data
  const mockProducts = [
    {
      id: 1,
      name: "Men's Cotton Kurta",
      category: "Men",
      price: 799,
      stock: 45,
      description: "Comfortable cotton kurta for men",
      image: "https://via.placeholder.com/300x200?text=Men's+Kurta",
    },
    {
      id: 2,
      name: "Women's Silk Saree",
      category: "Women",
      price: 2499,
      stock: 23,
      description: "Elegant silk saree with embroidery",
      image: "https://via.placeholder.com/300x200?text=Women's+Saree",
    },
    {
      id: 3,
      name: "Kids T-Shirt",
      category: "Kids",
      price: 399,
      stock: 67,
      description: "Comfortable cotton t-shirt for kids",
      image: "https://via.placeholder.com/300x200?text=Kids+T-Shirt",
    },
    {
      id: 4,
      name: "Leather Wallet",
      category: "Accessories",
      price: 599,
      stock: 8,
      description: "Genuine leather wallet",
      image: "https://via.placeholder.com/300x200?text=Leather+Wallet",
    },
    {
      id: 5,
      name: "Men's Jeans",
      category: "Men",
      price: 1299,
      stock: 34,
      description: "Slim fit denim jeans",
      image: "https://via.placeholder.com/300x200?text=Men's+Jeans",
    },
    {
      id: 6,
      name: "Women's Handbag",
      category: "Women",
      price: 1799,
      stock: 0,
      description: "Fashionable women's handbag",
      image: "https://via.placeholder.com/300x200?text=Women's+Handbag",
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? { ...productData, id: editingProduct.id }
            : product
        )
      );
    } else {
      // Add new product
      const newProduct = {
        ...productData,
        id: Math.max(...products.map((p) => p.id), 0) + 1,
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { class: "table-danger", text: "Out of Stock" };
    if (stock < 10) return { class: "table-warning", text: "Low Stock" };
    return { class: "", text: "In Stock" };
  };

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-danger">All Products</h3>
          <div className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </div>
        </div>
        <div className="card shadow-sm">
          <div className="card-body">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="placeholder-glow mb-3">
                <span
                  className="placeholder col-12"
                  style={{ height: "50px" }}
                ></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header with Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-danger mb-1">All Products</h3>
          <p className="text-muted mb-0">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
        <button className="btn btn-danger" onClick={handleAddProduct}>
          <i className="fas fa-plus me-2"></i>
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="fas fa-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <div className="btn-group w-100">
            <button
              className={`btn btn-outline-secondary ${
                viewMode === "table" ? "active" : ""
              }`}
              onClick={() => setViewMode("table")}
            >
              <i className="fas fa-table me-2"></i>Table
            </button>
            <button
              className={`btn btn-outline-secondary ${
                viewMode === "grid" ? "active" : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <i className="fas fa-grid me-2"></i>Grid
            </button>
          </div>
        </div>
      </div>

      {/* Products Table/Grid */}
      {viewMode === "table" ? (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <tr key={product.id} className={stockStatus.class}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="rounded me-3"
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <div className="fw-semibold">{product.name}</div>
                            <small className="text-muted">
                              {product.description}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {product.category}
                        </span>
                      </td>
                      <td className="fw-semibold text-danger">
                        ₹{product.price}
                      </td>
                      <td>{product.stock}</td>
                      <td>
                        <span
                          className={`badge ${
                            stockStatus.text === "In Stock"
                              ? "bg-success"
                              : stockStatus.text === "Low Stock"
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                        >
                          {stockStatus.text}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditProduct(product)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No products found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      ) : (
        // Grid View
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-12 text-center py-5">
              <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No products found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelForm}
          isEditing={!!editingProduct}
        />
      )}
    </div>
  );
};

export default Products;

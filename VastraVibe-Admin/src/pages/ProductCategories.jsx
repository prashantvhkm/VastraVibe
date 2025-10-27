import React, { useState, useEffect } from "react";

// Category Form Component
const CategoryForm = ({ category, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
    image: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category && isEditing) {
      setFormData({
        name: category.name,
        description: category.description || "",
        status: category.status || "Active",
        image: category.image || "",
      });
    }
  }, [category, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (formData.name.length > 50) {
      newErrors.name = "Category name must be less than 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEditing ? "Edit Category" : "Add New Category"}
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
                <div className="col-12">
                  <label className="form-label">
                    Category Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter category name"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter category description (optional)"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-md-6">
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

                {formData.image && (
                  <div className="col-12">
                    <label className="form-label">Image Preview</label>
                    <div className="border rounded p-2 text-center">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: "100px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
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
                {isEditing ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ category, onEdit, onDelete, onViewProducts }) => {
  const getStatusBadge = (status) => {
    return status === "Active" ? (
      <span className="badge bg-success">Active</span>
    ) : (
      <span className="badge bg-secondary">Inactive</span>
    );
  };

  return (
    <div className="col-xl-3 col-lg-4 col-md-6">
      <div
        className={`card category-card shadow-sm border-0 h-100 ${
          category.status === "Inactive" ? "opacity-75" : ""
        }`}
      >
        <div className="position-relative">
          <img
            src={
              category.image ||
              `/api/placeholder/300/200?text=${encodeURIComponent(
                category.name
              )}`
            }
            className="card-img-top"
            alt={category.name}
            style={{ height: "120px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/300x120/DC3545/FFFFFF?text=${encodeURIComponent(
                category.name
              )}`;
            }}
          />
          <div className="position-absolute top-0 end-0 m-2">
            {getStatusBadge(category.status)}
          </div>
        </div>
        <div className="card-body d-flex flex-column">
          <h6 className="card-title mb-2">{category.name}</h6>
          {category.description && (
            <p className="card-text small text-muted flex-grow-1">
              {category.description}
            </p>
          )}
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Products:</small>
              <span className="badge bg-danger rounded-pill">
                {category.productCount}
              </span>
            </div>
            <button
              className="btn btn-outline-primary btn-sm w-100 mb-2"
              onClick={() => onViewProducts(category)}
            >
              View Products
            </button>
          </div>
        </div>
        <div className="card-footer bg-white border-0">
          <div className="btn-group w-100">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => onEdit(category)}
            >
              <i className="fas fa-edit me-1"></i>Edit
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(category.id)}
              disabled={category.productCount > 0}
              title={
                category.productCount > 0
                  ? "Cannot delete category with products"
                  : "Delete category"
              }
            >
              <i className="fas fa-trash me-1"></i>Delete
            </button>
          </div>
          {category.productCount > 0 && (
            <small className="text-muted d-block mt-1 text-center">
              {category.productCount} product(s)
            </small>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Product Category Component
const ProductCategory = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [sortBy, setSortBy] = useState("name"); // 'name', 'products', 'status'

  // Mock data with more realistic categories
  const mockCategories = [
    {
      id: 1,
      name: "Men",
      description: "Men's clothing and accessories",
      status: "Active",
      productCount: 20,
      image: "https://via.placeholder.com/300x120/DC3545/FFFFFF?text=Men",
    },
    {
      id: 2,
      name: "Women",
      description: "Women's fashion and accessories",
      status: "Active",
      productCount: 30,
      image: "https://via.placeholder.com/300x120/DC3545/FFFFFF?text=Women",
    },
    {
      id: 3,
      name: "Kids",
      description: "Children's clothing and toys",
      status: "Active",
      productCount: 15,
      image: "https://via.placeholder.com/300x120/DC3545/FFFFFF?text=Kids",
    },
    {
      id: 4,
      name: "Electronics",
      description: "Electronic gadgets and devices",
      status: "Active",
      productCount: 25,
      image:
        "https://via.placeholder.com/300x120/DC3545/FFFFFF?text=Electronics",
    },
    {
      id: 5,
      name: "Home & Kitchen",
      description: "Home appliances and kitchenware",
      status: "Active",
      productCount: 18,
      image:
        "https://via.placeholder.com/300x120/DC3545/FFFFFF?text=Home+Kitchen",
    },
    {
      id: 6,
      name: "Sports",
      description: "Sports equipment and activewear",
      status: "Inactive",
      productCount: 0,
      image: "https://via.placeholder.com/300x120/DC3545/FFFFFF?text=Sports",
    },
    {
      id: 7,
      name: "Books",
      description: "Books and educational materials",
      status: "Active",
      productCount: 42,
      image: "https://via.placeholder.com/300x120/DC3545/FFFFFF?text=Books",
    },
    {
      id: 8,
      name: "Beauty",
      description: "Cosmetics and personal care",
      status: "Active",
      productCount: 28,
      image: "https://via.placeholder.com/300x120/DC3545/FFFFFF?text=Beauty",
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchCategories = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCategories(mockCategories);
      setFilteredCategories(mockCategories);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = categories;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.description &&
            category.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (category) => category.status === statusFilter
      );
    }

    // Sort categories
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "products":
          return b.productCount - a.productCount;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredCategories(filtered);
  }, [searchTerm, statusFilter, sortBy, categories]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);

    if (category.productCount > 0) {
      alert(
        "Cannot delete category that contains products. Please move or delete the products first."
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    }
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      // Update existing category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat
        )
      );
    } else {
      // Add new category
      const newCategory = {
        ...categoryData,
        id: Math.max(...categories.map((cat) => cat.id), 0) + 1,
        productCount: 0,
      };
      setCategories((prev) => [...prev, newCategory]);
    }
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleViewProducts = (category) => {
    console.log(`Viewing products for category: ${category.name}`);
    // Navigate to products page with category filter
    // navigate(`/products?category=${category.name}`);
  };

  const getTotalProducts = () => {
    return categories.reduce((total, cat) => total + cat.productCount, 0);
  };

  const getActiveCategories = () => {
    return categories.filter((cat) => cat.status === "Active").length;
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-danger">Product Categories</h3>
          <div className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </div>
        </div>
        <div className="row">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="col-md-6 col-lg-3 mb-3">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="placeholder-glow">
                    <span className="placeholder col-8 mb-2"></span>
                    <span className="placeholder col-6"></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header with Stats */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-danger mb-1">Product Categories</h3>
          <p className="text-muted mb-0">
            Manage your product categories and organization
          </p>
        </div>
        <button className="btn btn-danger" onClick={handleAddCategory}>
          <i className="fas fa-plus me-2"></i>
          Add Category
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 bg-light">
            <div className="card-body text-center">
              <h5 className="text-muted">Total Categories</h5>
              <h3 className="text-danger fw-bold">{categories.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-light">
            <div className="card-body text-center">
              <h5 className="text-muted">Active Categories</h5>
              <h3 className="text-success fw-bold">{getActiveCategories()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-light">
            <div className="card-body text-center">
              <h5 className="text-muted">Total Products</h5>
              <h3 className="text-primary fw-bold">{getTotalProducts()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-light">
            <div className="card-body text-center">
              <h5 className="text-muted">Avg. Products/Category</h5>
              <h3 className="text-warning fw-bold">
                {categories.length > 0
                  ? Math.round(getTotalProducts() / categories.length)
                  : 0}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="fas fa-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="products">Sort by Product Count</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
        <div className="col-md-2">
          <div className="btn-group w-100">
            <button
              className={`btn btn-outline-secondary ${
                viewMode === "list" ? "active" : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              <i className="fas fa-list me-1"></i>List
            </button>
            <button
              className={`btn btn-outline-secondary ${
                viewMode === "grid" ? "active" : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <i className="fas fa-grid me-1"></i>Grid
            </button>
          </div>
        </div>
      </div>

      {/* Categories List/Grid */}
      {viewMode === "list" ? (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className={
                      category.status === "Inactive" ? "table-secondary" : ""
                    }
                  >
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="rounded me-3"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/40x40/DC3545/FFFFFF?text=${category.name.charAt(
                              0
                            )}`;
                          }}
                        />
                        <div className="fw-semibold">{category.name}</div>
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">
                        {category.description || "No description"}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-danger rounded-pill">
                        {category.productCount}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          category.status === "Active"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditCategory(category)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={category.productCount > 0}
                          title={
                            category.productCount > 0
                              ? "Cannot delete category with products"
                              : "Delete category"
                          }
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleViewProducts(category)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCategories.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No categories found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
              <button className="btn btn-danger" onClick={handleAddCategory}>
                <i className="fas fa-plus me-2"></i>
                Add Your First Category
              </button>
            </div>
          )}
        </div>
      ) : (
        // Grid View
        <div className="row g-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              onViewProducts={handleViewProducts}
            />
          ))}
          {filteredCategories.length === 0 && (
            <div className="col-12 text-center py-5">
              <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No categories found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
              <button className="btn btn-danger" onClick={handleAddCategory}>
                <i className="fas fa-plus me-2"></i>
                Add Your First Category
              </button>
            </div>
          )}
        </div>
      )}

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSaveCategory}
          onCancel={handleCancelForm}
          isEditing={!!editingCategory}
        />
      )}
    </div>
  );
};

export default ProductCategory;

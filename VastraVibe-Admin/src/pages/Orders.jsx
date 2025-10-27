import React, { useState, useEffect } from "react";

// Order Status Badge Component
const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: { class: "bg-warning", icon: "fas fa-clock" },
    Confirmed: { class: "bg-info", icon: "fas fa-check-circle" },
    Processing: { class: "bg-primary", icon: "fas fa-cog" },
    Shipped: { class: "bg-secondary", icon: "fas fa-shipping-fast" },
    Delivered: { class: "bg-success", icon: "fas fa-box-open" },
    Cancelled: { class: "bg-danger", icon: "fas fa-times-circle" },
    Refunded: { class: "bg-dark", icon: "fas fa-undo" },
  };

  const config = statusConfig[status] || statusConfig["Pending"];

  return (
    <span
      className={`badge ${config.class} d-flex align-items-center justify-content-center`}
      style={{ minWidth: "100px" }}
    >
      <i className={`${config.icon} me-1`}></i>
      {status}
    </span>
  );
};

// Order Details Modal
const OrderDetailsModal = ({ order, onClose, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const statusOptions = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Refunded",
  ];

  const handleStatusUpdate = () => {
    onStatusUpdate(order.id, selectedStatus);
    onClose();
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order Details - {order.orderId}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <h6 className="text-muted">Customer Information</h6>
                <p className="mb-1">
                  <strong>{order.customer.name}</strong>
                </p>
                <p className="mb-1">{order.customer.email}</p>
                <p className="mb-1">{order.customer.phone}</p>
                <p className="mb-0">{order.shippingAddress}</p>
              </div>
              <div className="col-md-6">
                <h6 className="text-muted">Order Information</h6>
                <p className="mb-1">
                  <strong>Order Date:</strong> {order.orderDate}
                </p>
                <p className="mb-1">
                  <strong>Status:</strong>{" "}
                  <OrderStatusBadge status={order.status} />
                </p>
                <p className="mb-1">
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                <p className="mb-0">
                  <strong>Payment Status:</strong>
                  <span
                    className={`badge ${
                      order.paymentStatus === "Paid"
                        ? "bg-success"
                        : "bg-warning"
                    } ms-1`}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
            </div>

            <h6 className="text-muted mb-3">Order Items</h6>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="rounded me-2"
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <div className="fw-semibold">{item.name}</div>
                            <small className="text-muted">
                              {item.category}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>₹{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end">
                      <strong>Subtotal:</strong>
                    </td>
                    <td>
                      <strong>₹{calculateTotal(order.items)}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end">
                      <strong>Shipping:</strong>
                    </td>
                    <td>
                      <strong>₹{order.shippingCost}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end">
                      <strong>Total:</strong>
                    </td>
                    <td>
                      <strong className="text-danger">
                        ₹{order.totalAmount}
                      </strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="row mt-4">
              <div className="col-md-8">
                <label className="form-label">
                  <strong>Update Order Status</strong>
                </label>
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button
                  className="btn btn-danger w-100"
                  onClick={handleStatusUpdate}
                  disabled={selectedStatus === order.status}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button type="button" className="btn btn-outline-danger">
              <i className="fas fa-print me-2"></i>
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Card Component for Grid View
const OrderCard = ({ order, onViewDetails, onStatusUpdate }) => {
  return (
    <div className="col-xl-4 col-lg-6 col-md-6">
      <div className="card order-card shadow-sm border-0 h-100">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 text-danger fw-bold">{order.orderId}</h6>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="card-body">
          <div className="mb-3">
            <strong className="text-muted">Customer:</strong>
            <div className="fw-semibold">{order.customer.name}</div>
            <small className="text-muted">{order.customer.email}</small>
          </div>

          <div className="mb-3">
            <strong className="text-muted">Order Date:</strong>
            <div>{order.orderDate}</div>
          </div>

          <div className="mb-3">
            <strong className="text-muted">Items:</strong>
            <div>
              {order.items.slice(0, 2).map((item, index) => (
                <div key={index} className="d-flex justify-content-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              {order.items.length > 2 && (
                <small className="text-muted">
                  +{order.items.length - 2} more items
                </small>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center border-top pt-2">
            <strong className="text-danger">Total: ₹{order.totalAmount}</strong>
            <small
              className={`badge ${
                order.paymentStatus === "Paid" ? "bg-success" : "bg-warning"
              }`}
            >
              {order.paymentStatus}
            </small>
          </div>
        </div>
        <div className="card-footer bg-white border-0">
          <div className="btn-group w-100">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => onViewDetails(order)}
            >
              <i className="fas fa-eye me-1"></i>View
            </button>
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => onStatusUpdate(order.id, "Delivered")}
              disabled={
                order.status === "Delivered" || order.status === "Cancelled"
              }
            >
              <i className="fas fa-check me-1"></i>Complete
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onStatusUpdate(order.id, "Cancelled")}
              disabled={
                order.status === "Cancelled" || order.status === "Delivered"
              }
            >
              <i className="fas fa-times me-1"></i>Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Orders Component
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [sortBy, setSortBy] = useState("date"); // 'date', 'total', 'status'

  // Mock data
  const mockOrders = [
    {
      id: 1,
      orderId: "#ORD001",
      customer: {
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91 98765 43210",
      },
      status: "Delivered",
      orderDate: "28 Oct 2025",
      totalAmount: 2999,
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
      shippingAddress: "123 Main Street, Mumbai, Maharashtra 400001",
      shippingCost: 50,
      items: [
        {
          name: "Women's Silk Saree",
          category: "Women",
          price: 2499,
          quantity: 1,
          image: "https://via.placeholder.com/100x100?text=Saree",
        },
        {
          name: "Earrings Set",
          category: "Accessories",
          price: 450,
          quantity: 1,
          image: "https://via.placeholder.com/100x100?text=Earrings",
        },
      ],
    },
    {
      id: 2,
      orderId: "#ORD002",
      customer: {
        name: "Rahul Kumar",
        email: "rahul.kumar@email.com",
        phone: "+91 87654 32109",
      },
      status: "Processing",
      orderDate: "27 Oct 2025",
      totalAmount: 1598,
      paymentMethod: "UPI",
      paymentStatus: "Paid",
      shippingAddress: "456 Park Avenue, Delhi 110001",
      shippingCost: 40,
      items: [
        {
          name: "Men's Cotton Kurta",
          category: "Men",
          price: 799,
          quantity: 2,
          image: "https://via.placeholder.com/100x100?text=Kurta",
        },
      ],
    },
    {
      id: 3,
      orderId: "#ORD003",
      customer: {
        name: "Anita Patel",
        email: "anita.patel@email.com",
        phone: "+91 76543 21098",
      },
      status: "Shipped",
      orderDate: "26 Oct 2025",
      totalAmount: 3499,
      paymentMethod: "Debit Card",
      paymentStatus: "Paid",
      shippingAddress: "789 Gandhi Road, Bangalore 560001",
      shippingCost: 60,
      items: [
        {
          name: "Kids T-Shirt Pack",
          category: "Kids",
          price: 399,
          quantity: 3,
          image: "https://via.placeholder.com/100x100?text=Kids+T-Shirt",
        },
        {
          name: "Toys Set",
          category: "Kids",
          price: 899,
          quantity: 2,
          image: "https://via.placeholder.com/100x100?text=Toys",
        },
      ],
    },
    {
      id: 4,
      orderId: "#ORD004",
      customer: {
        name: "Vikram Singh",
        email: "vikram.singh@email.com",
        phone: "+91 65432 10987",
      },
      status: "Pending",
      orderDate: "25 Oct 2025",
      totalAmount: 1299,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      shippingAddress: "321 Lake View, Chennai 600001",
      shippingCost: 30,
      items: [
        {
          name: "Men's Jeans",
          category: "Men",
          price: 1299,
          quantity: 1,
          image: "https://via.placeholder.com/100x100?text=Jeans",
        },
      ],
    },
    {
      id: 5,
      orderId: "#ORD005",
      customer: {
        name: "Sneha Reddy",
        email: "sneha.reddy@email.com",
        phone: "+91 54321 09876",
      },
      status: "Confirmed",
      orderDate: "24 Oct 2025",
      totalAmount: 4299,
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
      shippingAddress: "654 Hillside, Hyderabad 500001",
      shippingCost: 70,
      items: [
        {
          name: "Designer Handbag",
          category: "Women",
          price: 3499,
          quantity: 1,
          image: "https://via.placeholder.com/100x100?text=Handbag",
        },
        {
          name: "Sunglasses",
          category: "Accessories",
          price: 800,
          quantity: 1,
          image: "https://via.placeholder.com/100x100?text=Sunglasses",
        },
      ],
    },
    {
      id: 6,
      orderId: "#ORD006",
      customer: {
        name: "Amit Verma",
        email: "amit.verma@email.com",
        phone: "+91 43210 98765",
      },
      status: "Cancelled",
      orderDate: "23 Oct 2025",
      totalAmount: 899,
      paymentMethod: "UPI",
      paymentStatus: "Refunded",
      shippingAddress: "987 Market Street, Kolkata 700001",
      shippingCost: 0,
      items: [
        {
          name: "Sports Shoes",
          category: "Sports",
          price: 899,
          quantity: 1,
          image: "https://via.placeholder.com/100x100?text=Shoes",
        },
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by date (simplified)
    if (dateFilter !== "All") {
      const today = new Date();
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderDate);
        switch (dateFilter) {
          case "Today":
            return orderDate.toDateString() === today.toDateString();
          case "This Week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case "This Month":
            return (
              orderDate.getMonth() === today.getMonth() &&
              orderDate.getFullYear() === today.getFullYear()
            );
          default:
            return true;
        }
      });
    }

    // Sort orders
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.orderDate) - new Date(a.orderDate);
        case "total":
          return b.totalAmount - a.totalAmount;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, dateFilter, sortBy, orders]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusCounts = () => {
    const counts = {
      All: orders.length,
      Pending: orders.filter((order) => order.status === "Pending").length,
      Confirmed: orders.filter((order) => order.status === "Confirmed").length,
      Processing: orders.filter((order) => order.status === "Processing")
        .length,
      Shipped: orders.filter((order) => order.status === "Shipped").length,
      Delivered: orders.filter((order) => order.status === "Delivered").length,
      Cancelled: orders.filter((order) => order.status === "Cancelled").length,
    };
    return counts;
  };

  const getTotalRevenue = () => {
    return orders
      .filter((order) => order.paymentStatus === "Paid")
      .reduce((total, order) => total + order.totalAmount, 0);
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-danger">Order Management</h3>
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
                  style={{ height: "60px" }}
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-danger mb-1">Order Management</h3>
          <p className="text-muted mb-0">
            Manage and track all customer orders
          </p>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-danger me-2">
            <i className="fas fa-download me-2"></i>
            Export
          </button>
          <button className="btn btn-danger">
            <i className="fas fa-plus me-2"></i>
            New Order
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-2">
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-3">
              <h5 className="text-muted small">Total Orders</h5>
              <h4 className="text-danger fw-bold">{statusCounts.All}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-3">
              <h5 className="text-muted small">Pending</h5>
              <h4 className="text-warning fw-bold">{statusCounts.Pending}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-3">
              <h5 className="text-muted small">Processing</h5>
              <h4 className="text-primary fw-bold">
                {statusCounts.Processing}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-3">
              <h5 className="text-muted small">Delivered</h5>
              <h4 className="text-success fw-bold">{statusCounts.Delivered}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-3">
              <h5 className="text-muted small">Revenue</h5>
              <h4 className="text-info fw-bold">
                ₹{getTotalRevenue().toLocaleString()}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-3">
              <h5 className="text-muted small">Avg. Order</h5>
              <h4 className="text-dark fw-bold">
                ₹
                {statusCounts.All > 0
                  ? Math.round(getTotalRevenue() / statusCounts.All)
                  : 0}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="fas fa-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="total">Sort by Total</option>
            <option value="status">Sort by Status</option>
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
              <i className="fas fa-table me-1"></i>Table
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

      {/* Orders Table/Grid */}
      {viewMode === "table" ? (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong className="text-danger">{order.orderId}</strong>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold">{order.customer.name}</div>
                        <small className="text-muted">
                          {order.customer.email}
                        </small>
                      </div>
                    </td>
                    <td>
                      <small>
                        {order.items.length} item(s)
                        <br />
                        <span className="text-muted">
                          {order.items[0].name}
                          {order.items.length > 1 &&
                            ` +${order.items.length - 1} more`}
                        </span>
                      </small>
                    </td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td>{order.orderDate}</td>
                    <td className="fw-semibold text-danger">
                      ₹{order.totalAmount}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          order.paymentStatus === "Paid"
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewDetails(order)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() =>
                            handleStatusUpdate(order.id, "Delivered")
                          }
                          disabled={
                            order.status === "Delivered" ||
                            order.status === "Cancelled"
                          }
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleStatusUpdate(order.id, "Cancelled")
                          }
                          disabled={
                            order.status === "Cancelled" ||
                            order.status === "Delivered"
                          }
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No orders found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      ) : (
        // Grid View
        <div className="row g-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={handleViewDetails}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
          {filteredOrders.length === 0 && (
            <div className="col-12 text-center py-5">
              <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No orders found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={handleCloseDetails}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default Orders;

import React, { useState, useEffect } from "react";

// Payment Status Badge Component
const PaymentStatusBadge = ({ status }) => {
  const statusConfig = {
    Paid: { class: "bg-success", icon: "fas fa-check-circle" },
    Pending: { class: "bg-warning", icon: "fas fa-clock" },
    Failed: { class: "bg-danger", icon: "fas fa-times-circle" },
    Refunded: { class: "bg-info", icon: "fas fa-undo" },
    "Partially Refunded": { class: "bg-primary", icon: "fas fa-exchange-alt" },
    Cancelled: { class: "bg-secondary", icon: "fas fa-ban" },
  };

  const config = statusConfig[status] || statusConfig["Pending"];

  return (
    <span
      className={`badge ${config.class} d-flex align-items-center justify-content-center`}
      style={{ minWidth: "140px" }}
    >
      <i className={`${config.icon} me-1`}></i>
      {status}
    </span>
  );
};

// Payment Method Badge Component
const PaymentMethodBadge = ({ method }) => {
  const methodConfig = {
    UPI: { class: "bg-primary", icon: "fas fa-mobile-alt" },
    "Credit Card": { class: "bg-info", icon: "fas fa-credit-card" },
    "Debit Card": { class: "bg-success", icon: "fas fa-credit-card" },
    "Net Banking": { class: "bg-warning", icon: "fas fa-university" },
    Wallet: { class: "bg-secondary", icon: "fas fa-wallet" },
    "Cash on Delivery": { class: "bg-dark", icon: "fas fa-money-bill" },
  };

  const config = methodConfig[method] || methodConfig["UPI"];

  return (
    <span className={`badge ${config.class} d-flex align-items-center`}>
      <i className={`${config.icon} me-1`}></i>
      {method}
    </span>
  );
};

// Payment Details Modal
const PaymentDetailsModal = ({
  payment,
  onClose,
  onStatusUpdate,
  onRefund,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(payment.status);

  const statusOptions = [
    "Paid",
    "Pending",
    "Failed",
    "Refunded",
    "Partially Refunded",
    "Cancelled",
  ];

  const handleStatusUpdate = () => {
    onStatusUpdate(payment.id, selectedStatus);
    onClose();
  };

  const handleFullRefund = () => {
    if (
      window.confirm(
        `Are you sure you want to refund ₹${payment.amount} to customer?`
      )
    ) {
      onRefund(payment.id, payment.amount);
      onClose();
    }
  };

  const handlePartialRefund = () => {
    const refundAmount = prompt("Enter refund amount:", payment.amount);
    if (
      refundAmount &&
      !isNaN(refundAmount) &&
      refundAmount > 0 &&
      refundAmount <= payment.amount
    ) {
      onRefund(payment.id, parseFloat(refundAmount));
      onClose();
    } else if (refundAmount) {
      alert("Please enter a valid refund amount");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              Payment Details - {payment.paymentId}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <h6 className="text-muted">Payment Information</h6>
                <table className="table table-sm table-borderless">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Payment ID:</strong>
                      </td>
                      <td>{payment.paymentId}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Order ID:</strong>
                      </td>
                      <td>{payment.orderId}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Amount:</strong>
                      </td>
                      <td className="fw-bold text-danger">₹{payment.amount}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Payment Method:</strong>
                      </td>
                      <td>
                        <PaymentMethodBadge method={payment.method} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <h6 className="text-muted">Transaction Details</h6>
                <table className="table table-sm table-borderless">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Status:</strong>
                      </td>
                      <td>
                        <PaymentStatusBadge status={payment.status} />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Date & Time:</strong>
                      </td>
                      <td>{formatDate(payment.paymentDate)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Transaction ID:</strong>
                      </td>
                      <td>
                        <code>{payment.transactionId}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Gateway:</strong>
                      </td>
                      <td>{payment.gateway}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <h6 className="text-muted">Customer Information</h6>
                <table className="table table-sm table-borderless">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Name:</strong>
                      </td>
                      <td>{payment.customer.name}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Email:</strong>
                      </td>
                      <td>{payment.customer.email}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Phone:</strong>
                      </td>
                      <td>{payment.customer.phone}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <h6 className="text-muted">Order Summary</h6>
                <table className="table table-sm table-borderless">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Items Total:</strong>
                      </td>
                      <td>₹{payment.orderSummary.itemsTotal}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Shipping:</strong>
                      </td>
                      <td>₹{payment.orderSummary.shipping}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Tax:</strong>
                      </td>
                      <td>₹{payment.orderSummary.tax}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Discount:</strong>
                      </td>
                      <td className="text-success">
                        -₹{payment.orderSummary.discount}
                      </td>
                    </tr>
                    <tr className="border-top">
                      <td>
                        <strong>Total Paid:</strong>
                      </td>
                      <td className="fw-bold text-danger">₹{payment.amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Sections */}
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">
                  <strong>Update Payment Status</strong>
                </label>
                <div className="input-group">
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
                  <button
                    className="btn btn-danger"
                    onClick={handleStatusUpdate}
                    disabled={selectedStatus === payment.status}
                  >
                    Update
                  </button>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  <strong>Refund Actions</strong>
                </label>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-warning"
                    onClick={handlePartialRefund}
                    disabled={
                      !["Paid", "Partially Refunded"].includes(payment.status)
                    }
                  >
                    <i className="fas fa-exchange-alt me-2"></i>
                    Partial Refund
                  </button>
                  <button
                    className="btn btn-outline-info"
                    onClick={handleFullRefund}
                    disabled={
                      !["Paid", "Partially Refunded"].includes(payment.status)
                    }
                  >
                    <i className="fas fa-undo me-2"></i>
                    Full Refund
                  </button>
                </div>
              </div>
            </div>

            {/* Transaction Log */}
            {payment.transactionLog && payment.transactionLog.length > 0 && (
              <div className="mt-4">
                <h6 className="text-muted">Transaction History</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-borderless">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Action</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payment.transactionLog.map((log, index) => (
                        <tr key={index}>
                          <td>{formatDate(log.timestamp)}</td>
                          <td>{log.action}</td>
                          <td>₹{log.amount}</td>
                          <td>
                            <PaymentStatusBadge status={log.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Card Component for Grid View
const PaymentCard = ({ payment, onViewDetails, onRefund }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="col-xl-4 col-lg-6 col-md-6">
      <div className="card payment-card shadow-sm border-0 h-100">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 text-danger fw-bold">{payment.paymentId}</h6>
          <PaymentStatusBadge status={payment.status} />
        </div>
        <div className="card-body">
          <div className="mb-3">
            <strong className="text-muted">Order:</strong>
            <div className="fw-semibold">{payment.orderId}</div>
          </div>

          <div className="mb-3">
            <strong className="text-muted">Customer:</strong>
            <div>{payment.customer.name}</div>
            <small className="text-muted">{payment.customer.email}</small>
          </div>

          <div className="mb-3">
            <strong className="text-muted">Payment Method:</strong>
            <div className="mt-1">
              <PaymentMethodBadge method={payment.method} />
            </div>
          </div>

          <div className="mb-3">
            <strong className="text-muted">Date:</strong>
            <div>{formatDate(payment.paymentDate)}</div>
          </div>

          <div className="d-flex justify-content-between align-items-center border-top pt-2">
            <strong className="text-danger fs-5">₹{payment.amount}</strong>
            <small className="text-muted">{payment.gateway}</small>
          </div>
        </div>
        <div className="card-footer bg-white border-0">
          <div className="btn-group w-100">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => onViewDetails(payment)}
            >
              <i className="fas fa-eye me-1"></i>View
            </button>
            <button
              className="btn btn-outline-info btn-sm"
              onClick={() => onRefund(payment.id, payment.amount)}
              disabled={
                !["Paid", "Partially Refunded"].includes(payment.status)
              }
            >
              <i className="fas fa-undo me-1"></i>Refund
            </button>
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => window.open(`/receipt/${payment.id}`, "_blank")}
            >
              <i className="fas fa-receipt me-1"></i>Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Payments Component
const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [sortBy, setSortBy] = useState("date"); // 'date', 'amount', 'status'

  // Mock data
  const mockPayments = [
    {
      id: 1,
      paymentId: "#PAY001",
      orderId: "#ORD001",
      amount: 2999,
      method: "UPI",
      status: "Paid",
      paymentDate: "2025-10-28T14:30:00",
      transactionId: "TXN001234567",
      gateway: "Razorpay",
      customer: {
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91 98765 43210",
      },
      orderSummary: {
        itemsTotal: 2949,
        shipping: 50,
        tax: 187,
        discount: 187,
      },
      transactionLog: [
        {
          timestamp: "2025-10-28T14:30:00",
          action: "Payment Initiated",
          amount: 2999,
          status: "Pending",
        },
        {
          timestamp: "2025-10-28T14:31:15",
          action: "Payment Completed",
          amount: 2999,
          status: "Paid",
        },
      ],
    },
    {
      id: 2,
      paymentId: "#PAY002",
      orderId: "#ORD002",
      amount: 1598,
      method: "Credit Card",
      status: "Paid",
      paymentDate: "2025-10-27T11:20:00",
      transactionId: "TXN001234568",
      gateway: "Stripe",
      customer: {
        name: "Rahul Kumar",
        email: "rahul.kumar@email.com",
        phone: "+91 87654 32109",
      },
      orderSummary: {
        itemsTotal: 1558,
        shipping: 40,
        tax: 98,
        discount: 98,
      },
    },
    {
      id: 3,
      paymentId: "#PAY003",
      orderId: "#ORD003",
      amount: 3499,
      method: "Debit Card",
      status: "Pending",
      paymentDate: "2025-10-26T16:45:00",
      transactionId: "TXN001234569",
      gateway: "PayU",
      customer: {
        name: "Anita Patel",
        email: "anita.patel@email.com",
        phone: "+91 76543 21098",
      },
      orderSummary: {
        itemsTotal: 3439,
        shipping: 60,
        tax: 218,
        discount: 218,
      },
    },
    {
      id: 4,
      paymentId: "#PAY004",
      orderId: "#ORD004",
      amount: 1299,
      method: "Cash on Delivery",
      status: "Pending",
      paymentDate: "2025-10-25T09:15:00",
      transactionId: "TXN001234570",
      gateway: "COD",
      customer: {
        name: "Vikram Singh",
        email: "vikram.singh@email.com",
        phone: "+91 65432 10987",
      },
      orderSummary: {
        itemsTotal: 1269,
        shipping: 30,
        tax: 78,
        discount: 78,
      },
    },
    {
      id: 5,
      paymentId: "#PAY005",
      orderId: "#ORD005",
      amount: 4299,
      method: "Net Banking",
      status: "Failed",
      paymentDate: "2025-10-24T13:20:00",
      transactionId: "TXN001234571",
      gateway: "CCAvenue",
      customer: {
        name: "Sneha Reddy",
        email: "sneha.reddy@email.com",
        phone: "+91 54321 09876",
      },
      orderSummary: {
        itemsTotal: 4229,
        shipping: 70,
        tax: 268,
        discount: 268,
      },
    },
    {
      id: 6,
      paymentId: "#PAY006",
      orderId: "#ORD006",
      amount: 899,
      method: "Wallet",
      status: "Refunded",
      paymentDate: "2025-10-23T10:30:00",
      transactionId: "TXN001234572",
      gateway: "Paytm",
      customer: {
        name: "Amit Verma",
        email: "amit.verma@email.com",
        phone: "+91 43210 98765",
      },
      orderSummary: {
        itemsTotal: 899,
        shipping: 0,
        tax: 54,
        discount: 54,
      },
      transactionLog: [
        {
          timestamp: "2025-10-23T10:30:00",
          action: "Payment Completed",
          amount: 899,
          status: "Paid",
        },
        {
          timestamp: "2025-10-24T14:20:00",
          action: "Refund Processed",
          amount: 899,
          status: "Refunded",
        },
      ],
    },
    {
      id: 7,
      paymentId: "#PAY007",
      orderId: "#ORD007",
      amount: 2299,
      method: "UPI",
      status: "Partially Refunded",
      paymentDate: "2025-10-22T15:40:00",
      transactionId: "TXN001234573",
      gateway: "Razorpay",
      customer: {
        name: "Neha Gupta",
        email: "neha.gupta@email.com",
        phone: "+91 32109 87654",
      },
      orderSummary: {
        itemsTotal: 2249,
        shipping: 50,
        tax: 143,
        discount: 143,
      },
      transactionLog: [
        {
          timestamp: "2025-10-22T15:40:00",
          action: "Payment Completed",
          amount: 2299,
          status: "Paid",
        },
        {
          timestamp: "2025-10-23T11:15:00",
          action: "Partial Refund",
          amount: 500,
          status: "Partially Refunded",
        },
      ],
    },
    {
      id: 8,
      paymentId: "#PAY008",
      orderId: "#ORD008",
      amount: 1899,
      method: "Debit Card",
      status: "Cancelled",
      paymentDate: "2025-10-21T12:25:00",
      transactionId: "TXN001234574",
      gateway: "Stripe",
      customer: {
        name: "Rajesh Nair",
        email: "rajesh.nair@email.com",
        phone: "+91 21098 76543",
      },
      orderSummary: {
        itemsTotal: 1849,
        shipping: 50,
        tax: 113,
        discount: 113,
      },
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchPayments = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
      setLoading(false);
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    let filtered = payments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.customer.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.customer.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    // Filter by method
    if (methodFilter !== "All") {
      filtered = filtered.filter((payment) => payment.method === methodFilter);
    }

    // Filter by date (simplified)
    if (dateFilter !== "All") {
      const today = new Date();
      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.paymentDate);
        switch (dateFilter) {
          case "Today":
            return paymentDate.toDateString() === today.toDateString();
          case "This Week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return paymentDate >= weekAgo;
          case "This Month":
            return (
              paymentDate.getMonth() === today.getMonth() &&
              paymentDate.getFullYear() === today.getFullYear()
            );
          default:
            return true;
        }
      });
    }

    // Sort payments
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.paymentDate) - new Date(a.paymentDate);
        case "amount":
          return b.amount - a.amount;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredPayments(filtered);
  }, [searchTerm, statusFilter, methodFilter, dateFilter, sortBy, payments]);

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedPayment(null);
  };

  const handleStatusUpdate = (paymentId, newStatus) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId ? { ...payment, status: newStatus } : payment
      )
    );
  };

  const handleRefund = (paymentId, refundAmount) => {
    setPayments((prev) =>
      prev.map((payment) => {
        if (payment.id === paymentId) {
          const newStatus =
            refundAmount === payment.amount ? "Refunded" : "Partially Refunded";
          return {
            ...payment,
            status: newStatus,
            transactionLog: [
              ...(payment.transactionLog || []),
              {
                timestamp: new Date().toISOString(),
                action:
                  refundAmount === payment.amount
                    ? "Full Refund"
                    : "Partial Refund",
                amount: refundAmount,
                status: newStatus,
              },
            ],
          };
        }
        return payment;
      })
    );
  };

  const getStatusCounts = () => {
    const counts = {
      All: payments.length,
      Paid: payments.filter((payment) => payment.status === "Paid").length,
      Pending: payments.filter((payment) => payment.status === "Pending")
        .length,
      Failed: payments.filter((payment) => payment.status === "Failed").length,
      Refunded: payments.filter((payment) => payment.status === "Refunded")
        .length,
    };
    return counts;
  };

  const getTotalRevenue = () => {
    return payments
      .filter((payment) => payment.status === "Paid")
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const getMethodCounts = () => {
    const methods = {};
    payments.forEach((payment) => {
      methods[payment.method] = (methods[payment.method] || 0) + 1;
    });
    return methods;
  };

  const statusCounts = getStatusCounts();
  const methodCounts = getMethodCounts();

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-danger">Payment Management</h3>
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
          <h3 className="fw-bold text-danger mb-1">Payment Management</h3>
          <p className="text-muted mb-0">
            Track and manage all payment transactions
          </p>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-danger me-2">
            <i className="fas fa-download me-2"></i>
            Export
          </button>
          <button className="btn btn-danger">
            <i className="fas fa-sync-alt me-2"></i>
            Sync Payments
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-2">
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-3">
              <h5 className="text-muted small">Total Payments</h5>
              <h4 className="text-danger fw-bold">{statusCounts.All}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-3">
              <h5 className="text-muted small">Successful</h5>
              <h4 className="text-success fw-bold">{statusCounts.Paid}</h4>
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
              <h5 className="text-muted small">Failed</h5>
              <h4 className="text-danger fw-bold">{statusCounts.Failed}</h4>
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
              <h5 className="text-muted small">Avg. Payment</h5>
              <h4 className="text-dark fw-bold">
                ₹
                {statusCounts.Paid > 0
                  ? Math.round(getTotalRevenue() / statusCounts.Paid)
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
              placeholder="Search payments..."
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
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
            <option value="Partially Refunded">Partially Refunded</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="All">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Wallet">Wallet</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
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
            <option value="amount">Sort by Amount</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
        <div className="col-md-1">
          <div className="btn-group w-100">
            <button
              className={`btn btn-outline-secondary ${
                viewMode === "table" ? "active" : ""
              }`}
              onClick={() => setViewMode("table")}
            >
              <i className="fas fa-table"></i>
            </button>
            <button
              className={`btn btn-outline-secondary ${
                viewMode === "grid" ? "active" : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <i className="fas fa-grid"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table/Grid */}
      {viewMode === "table" ? (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Payment ID</th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Gateway</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong className="text-danger">
                        {payment.paymentId}
                      </strong>
                    </td>
                    <td>
                      <strong>{payment.orderId}</strong>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold">
                          {payment.customer.name}
                        </div>
                        <small className="text-muted">
                          {payment.customer.email}
                        </small>
                      </div>
                    </td>
                    <td>
                      <PaymentMethodBadge method={payment.method} />
                    </td>
                    <td>
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td>
                      <small>
                        {new Date(payment.paymentDate).toLocaleDateString(
                          "en-IN"
                        )}
                        <br />
                        <span className="text-muted">
                          {new Date(payment.paymentDate).toLocaleTimeString(
                            "en-IN",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                      </small>
                    </td>
                    <td className="fw-semibold text-danger">
                      ₹{payment.amount}
                    </td>
                    <td>
                      <small className="text-muted">{payment.gateway}</small>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewDetails(payment)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() =>
                            handleRefund(payment.id, payment.amount)
                          }
                          disabled={
                            !["Paid", "Partially Refunded"].includes(
                              payment.status
                            )
                          }
                        >
                          <i className="fas fa-undo"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() =>
                            window.open(`/receipt/${payment.id}`, "_blank")
                          }
                        >
                          <i className="fas fa-receipt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPayments.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-credit-card fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No payments found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      ) : (
        // Grid View
        <div className="row g-4">
          {filteredPayments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onViewDetails={handleViewDetails}
              onRefund={handleRefund}
            />
          ))}
          {filteredPayments.length === 0 && (
            <div className="col-12 text-center py-5">
              <i className="fas fa-credit-card fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No payments found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {/* Payment Details Modal */}
      {showDetails && selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={handleCloseDetails}
          onStatusUpdate={handleStatusUpdate}
          onRefund={handleRefund}
        />
      )}
    </div>
  );
};

export default Payments;

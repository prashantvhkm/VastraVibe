import React, { useState, useEffect } from "react";

// Utility functions
const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

const TrendIndicator = ({ value, isPositive = true }) => (
  <small
    className={`d-block mt-1 ${isPositive ? "text-success" : "text-danger"}`}
  >
    <i className={`fas fa-arrow-${isPositive ? "up" : "down"} me-1`}></i>
    {Math.abs(value)}% from last month
  </small>
);

// Stat Card Component
const StatCard = ({
  title,
  value,
  color,
  icon,
  trend,
  onClick,
  loading = false,
}) => (
  <div className="col-xl-3 col-md-6">
    <div
      className={`card shadow-sm border-0 transition-all ${
        onClick ? "cursor-pointer hover-shadow" : ""
      }`}
      style={{
        transition: "all 0.3s ease",
        minHeight: "140px",
      }}
      onClick={onClick}
    >
      <div className="card-body d-flex flex-column justify-content-center">
        {loading ? (
          <div className="text-center">
            <div className="placeholder-glow">
              <h5 className="placeholder col-6 mb-3 mx-auto"></h5>
              <h3 className="placeholder col-4 mx-auto"></h3>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="d-flex justify-content-center align-items-center mb-2">
              {icon && <span className="me-2">{icon}</span>}
              <h5 className="text-muted mb-0">{title}</h5>
            </div>
            <h3 className={`text-${color} fw-bold mb-1`}>{value}</h3>
            {trend && (
              <TrendIndicator
                value={trend.value}
                isPositive={trend.isPositive}
              />
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Recent Activity Component
const RecentActivity = ({ activities, loading }) => {
  if (loading) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">Recent Activity</h5>
        </div>
        <div className="card-body">
          {[1, 2, 3].map((item) => (
            <div key={item} className="d-flex align-items-center mb-3">
              <div className="placeholder-glow w-100">
                <div className="placeholder col-8 mb-2"></div>
                <div className="placeholder col-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Recent Activity</h5>
        <small className="text-muted">View All</small>
      </div>
      <div className="card-body">
        {activities.map((activity, index) => (
          <div key={index} className="d-flex align-items-center mb-3">
            <div
              className={`badge bg-${activity.type} me-3`}
              style={{ width: "8px", height: "8px", borderRadius: "50%" }}
            ></div>
            <div className="flex-grow-1">
              <p className="mb-1 small">{activity.message}</p>
              <small className="text-muted">{activity.time}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    orders: 0,
    payments: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  // Mock data fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock data
      const mockStats = {
        totalProducts: 145,
        orders: 89,
        payments: 18750,
        users: 234,
      };

      const mockActivities = [
        {
          message: "New order #ORD-0012 received",
          time: "5 min ago",
          type: "success",
        },
        {
          message: "Payment of ₹2,500 completed",
          time: "15 min ago",
          type: "primary",
        },
        {
          message: "User john_doe registered",
          time: "30 min ago",
          type: "warning",
        },
        {
          message: "Product 'Wireless Headphones' low stock",
          time: "1 hour ago",
          type: "danger",
        },
      ];

      setStats(mockStats);
      setRecentActivities(mockActivities);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Card click handlers
  const handleProductClick = () => {
    console.log("Navigating to products page");
    // navigate('/products');
  };

  const handleOrdersClick = () => {
    console.log("Navigating to orders page");
    // navigate('/orders');
  };

  const handlePaymentsClick = () => {
    console.log("Navigating to payments page");
    // navigate('/payments');
  };

  const handleUsersClick = () => {
    console.log("Navigating to users page");
    // navigate('/users');
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-danger mb-1">Dashboard Overview</h3>
          <p className="text-muted mb-0">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          color="danger"
          icon={<i className="fas fa-box text-danger"></i>}
          trend={{ value: 12, isPositive: true }}
          onClick={handleProductClick}
          loading={loading}
        />
        <StatCard
          title="Orders"
          value={stats.orders}
          color="success"
          icon={<i className="fas fa-shopping-cart text-success"></i>}
          trend={{ value: 8, isPositive: true }}
          onClick={handleOrdersClick}
          loading={loading}
        />
        <StatCard
          title="Payments"
          value={formatCurrency(stats.payments)}
          color="primary"
          icon={<i className="fas fa-rupee-sign text-primary"></i>}
          trend={{ value: 15, isPositive: true }}
          onClick={handlePaymentsClick}
          loading={loading}
        />
        <StatCard
          title="Users"
          value={stats.users}
          color="warning"
          icon={<i className="fas fa-users text-warning"></i>}
          trend={{ value: 5, isPositive: true }}
          onClick={handleUsersClick}
          loading={loading}
        />
      </div>

      {/* Charts and Additional Sections */}
      <div className="row g-4">
        {/* Recent Activity */}
        <div className="col-lg-6">
          <RecentActivity activities={recentActivities} loading={loading} />
        </div>

        {/* Quick Actions */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center py-3">
                    <i className="fas fa-plus me-2"></i>
                    Add Product
                  </button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center py-3">
                    <i className="fas fa-chart-bar me-2"></i>
                    View Reports
                  </button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center py-3">
                    <i className="fas fa-cog me-2"></i>
                    Settings
                  </button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-outline-warning w-100 d-flex align-items-center justify-content-center py-3">
                    <i className="fas fa-bell me-2"></i>
                    Notifications
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {!loading && (
        <div className="row g-4 mt-2">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Performance Metrics</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3 border-end">
                    <h6 className="text-muted">Conversion Rate</h6>
                    <h4 className="text-success fw-bold">3.2%</h4>
                  </div>
                  <div className="col-md-3 border-end">
                    <h6 className="text-muted">Avg. Order Value</h6>
                    <h4 className="text-primary fw-bold">
                      {formatCurrency(210)}
                    </h4>
                  </div>
                  <div className="col-md-3 border-end">
                    <h6 className="text-muted">Customer Satisfaction</h6>
                    <h4 className="text-warning fw-bold">4.8/5</h4>
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-muted">Return Rate</h6>
                    <h4 className="text-danger fw-bold">2.1%</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

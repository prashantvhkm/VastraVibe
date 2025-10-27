import React, { useState, useEffect } from "react";

// Chart Components (Simplified - in real app, use libraries like Chart.js or Recharts)
const SalesChart = ({ data, timeRange }) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-0">
        <h6 className="mb-0">Sales Trend</h6>
        <small className="text-muted">{timeRange} overview</small>
      </div>
      <div className="card-body">
        <div
          className="d-flex align-items-end justify-content-between h-100"
          style={{ minHeight: "200px" }}
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="d-flex flex-column align-items-center"
              style={{ width: `${100 / data.length}%` }}
            >
              <div
                className="bg-danger rounded-top w-75 mx-auto"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  minHeight: "20px",
                }}
                title={`${item.label}: ₹${item.value.toLocaleString()}`}
              ></div>
              <small
                className="text-muted mt-1 text-center"
                style={{ fontSize: "0.7rem" }}
              >
                {item.label}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryDistributionChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-0">
        <h6 className="mb-0">Category Distribution</h6>
        <small className="text-muted">Sales by category</small>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            const colors = [
              "bg-primary",
              "bg-success",
              "bg-warning",
              "bg-info",
              "bg-danger",
              "bg-secondary",
            ];

            return (
              <div key={index} className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div
                      className={`${
                        colors[index % colors.length]
                      } rounded me-2`}
                      style={{ width: "12px", height: "12px" }}
                    ></div>
                    <span className="small">{item.name}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="small fw-semibold me-2">
                      ₹{item.value.toLocaleString()}
                    </span>
                    <span className="small text-muted">({percentage}%)</span>
                  </div>
                </div>
                <div className="progress mt-1" style={{ height: "6px" }}>
                  <div
                    className={`progress-bar ${colors[index % colors.length]}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, changeType, icon, color }) => {
  const getArrowIcon = () => {
    return changeType === "positive" ? "fa-arrow-up" : "fa-arrow-down";
  };

  const getTextColor = () => {
    return changeType === "positive" ? "text-success" : "text-danger";
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="card-title text-muted mb-2">{title}</h6>
            <h3 className={`fw-bold text-${color}`}>{value}</h3>
            {change && (
              <small className={getTextColor()}>
                <i className={`fas ${getArrowIcon()} me-1`}></i>
                {change}% from last period
              </small>
            )}
          </div>
          <div className={`bg-${color} bg-opacity-10 rounded p-3`}>
            <i className={`fas fa-${icon} text-${color} fs-4`}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportGenerator = ({ onGenerateReport, isLoading }) => {
  const [reportConfig, setReportConfig] = useState({
    reportType: "sales",
    timeRange: "last_30_days",
    format: "pdf",
    includeCharts: true,
    includeDetails: true,
  });

  const reportTypes = [
    { value: "sales", label: "Sales Report" },
    { value: "products", label: "Product Performance" },
    { value: "customers", label: "Customer Analytics" },
    { value: "inventory", label: "Inventory Report" },
    { value: "financial", label: "Financial Summary" },
  ];

  const timeRanges = [
    { value: "last_7_days", label: "Last 7 Days" },
    { value: "last_30_days", label: "Last 30 Days" },
    { value: "last_90_days", label: "Last 90 Days" },
    { value: "this_month", label: "This Month" },
    { value: "this_quarter", label: "This Quarter" },
    { value: "this_year", label: "This Year" },
    { value: "custom", label: "Custom Range" },
  ];

  const formats = [
    { value: "pdf", label: "PDF Document" },
    { value: "excel", label: "Excel Spreadsheet" },
    { value: "csv", label: "CSV File" },
  ];

  const handleGenerate = () => {
    onGenerateReport(reportConfig);
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0">
        <h6 className="mb-0">Generate Custom Report</h6>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Report Type</label>
            <select
              className="form-select"
              value={reportConfig.reportType}
              onChange={(e) =>
                setReportConfig((prev) => ({
                  ...prev,
                  reportType: e.target.value,
                }))
              }
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Time Range</label>
            <select
              className="form-select"
              value={reportConfig.timeRange}
              onChange={(e) =>
                setReportConfig((prev) => ({
                  ...prev,
                  timeRange: e.target.value,
                }))
              }
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Export Format</label>
            <select
              className="form-select"
              value={reportConfig.format}
              onChange={(e) =>
                setReportConfig((prev) => ({ ...prev, format: e.target.value }))
              }
            >
              {formats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={reportConfig.includeCharts}
                onChange={(e) =>
                  setReportConfig((prev) => ({
                    ...prev,
                    includeCharts: e.target.checked,
                  }))
                }
              />
              <label className="form-check-label">
                Include Charts & Graphs
              </label>
            </div>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={reportConfig.includeDetails}
                onChange={(e) =>
                  setReportConfig((prev) => ({
                    ...prev,
                    includeDetails: e.target.checked,
                  }))
                }
              />
              <label className="form-check-label">Include Detailed Data</label>
            </div>
          </div>

          <div className="col-12">
            <button
              className="btn btn-danger w-100"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Generating Report...
                </>
              ) : (
                <>
                  <i className="fas fa-download me-2"></i>
                  Generate & Download Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Reports Component
const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("last_30_days");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const salesData = {
    last_7_days: [
      { label: "Mon", value: 12500 },
      { label: "Tue", value: 18900 },
      { label: "Wed", value: 14200 },
      { label: "Thu", value: 21000 },
      { label: "Fri", value: 25600 },
      { label: "Sat", value: 32400 },
      { label: "Sun", value: 28700 },
    ],
    last_30_days: [
      { label: "Week 1", value: 85600 },
      { label: "Week 2", value: 92400 },
      { label: "Week 3", value: 101200 },
      { label: "Week 4", value: 118500 },
    ],
  };

  const categoryData = [
    { name: "Men's Fashion", value: 125000 },
    { name: "Women's Fashion", value: 189000 },
    { name: "Electronics", value: 85600 },
    { name: "Home & Kitchen", value: 45200 },
    { name: "Accessories", value: 32400 },
    { name: "Others", value: 18700 },
  ];

  const topProducts = [
    { name: "Men's Cotton Kurta", sales: 145, revenue: 115855, growth: 12 },
    { name: "Women's Silk Saree", sales: 98, revenue: 244902, growth: 8 },
    { name: "Wireless Headphones", sales: 76, revenue: 228000, growth: 25 },
    { name: "Designer Handbag", sales: 64, revenue: 223936, growth: 15 },
    { name: "Sports Shoes", sales: 53, revenue: 47700, growth: -5 },
  ];

  const metrics = {
    totalRevenue: { value: "₹4,87,500", change: 12.5, changeType: "positive" },
    totalOrders: { value: "1,245", change: 8.2, changeType: "positive" },
    averageOrder: { value: "₹3,915", change: 4.1, changeType: "positive" },
    conversionRate: { value: "3.2%", change: -0.5, changeType: "negative" },
    customerSatisfaction: {
      value: "4.8/5",
      change: 0.2,
      changeType: "positive",
    },
    inventoryTurnover: { value: "6.2x", change: 0.8, changeType: "positive" },
  };

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
    };

    loadData();
  }, []);

  const handleGenerateReport = async (config) => {
    setGeneratingReport(true);

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // In real app, this would generate and download the report
    alert(
      `Report generated successfully!\nType: ${config.reportType}\nFormat: ${config.format}\nTime Range: ${config.timeRange}`
    );

    setGeneratingReport(false);
  };

  const handleQuickExport = (type) => {
    alert(`Exporting ${type} report...`);
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-danger">Reports & Analytics</h3>
          <div className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </div>
        </div>
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="placeholder-glow">
                    <span className="placeholder col-8 mb-2"></span>
                    <span className="placeholder col-4"></span>
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-danger mb-1">Reports & Analytics</h3>
          <p className="text-muted mb-0">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="d-flex align-items-center">
          <select
            className="form-select me-2"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_90_days">Last 90 Days</option>
            <option value="this_month">This Month</option>
          </select>
          <button className="btn btn-outline-danger">
            <i className="fas fa-sync-alt me-2"></i>
            Refresh Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "overview" ? "active text-danger" : "text-muted"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <i className="fas fa-chart-line me-2"></i>
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "sales" ? "active text-danger" : "text-muted"
            }`}
            onClick={() => setActiveTab("sales")}
          >
            <i className="fas fa-shopping-bag me-2"></i>
            Sales
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "products" ? "active text-danger" : "text-muted"
            }`}
            onClick={() => setActiveTab("products")}
          >
            <i className="fas fa-box me-2"></i>
            Products
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "customers" ? "active text-danger" : "text-muted"
            }`}
            onClick={() => setActiveTab("customers")}
          >
            <i className="fas fa-users me-2"></i>
            Customers
          </button>
        </li>
      </ul>

      {activeTab === "overview" && (
        <>
          {/* Key Metrics */}
          <div className="row g-4 mb-4">
            <div className="col-md-4 col-lg-2">
              <MetricCard
                title="Total Revenue"
                value={metrics.totalRevenue.value}
                change={metrics.totalRevenue.change}
                changeType={metrics.totalRevenue.changeType}
                icon="rupee-sign"
                color="danger"
              />
            </div>
            <div className="col-md-4 col-lg-2">
              <MetricCard
                title="Total Orders"
                value={metrics.totalOrders.value}
                change={metrics.totalOrders.change}
                changeType={metrics.totalOrders.changeType}
                icon="shopping-cart"
                color="success"
              />
            </div>
            <div className="col-md-4 col-lg-2">
              <MetricCard
                title="Avg. Order Value"
                value={metrics.averageOrder.value}
                change={metrics.averageOrder.change}
                changeType={metrics.averageOrder.changeType}
                icon="chart-bar"
                color="primary"
              />
            </div>
            <div className="col-md-4 col-lg-2">
              <MetricCard
                title="Conversion Rate"
                value={metrics.conversionRate.value}
                change={metrics.conversionRate.change}
                changeType={metrics.conversionRate.changeType}
                icon="percent"
                color="warning"
              />
            </div>
            <div className="col-md-4 col-lg-2">
              <MetricCard
                title="Customer Satisfaction"
                value={metrics.customerSatisfaction.value}
                change={metrics.customerSatisfaction.change}
                changeType={metrics.customerSatisfaction.changeType}
                icon="star"
                color="info"
              />
            </div>
            <div className="col-md-4 col-lg-2">
              <MetricCard
                title="Inventory Turnover"
                value={metrics.inventoryTurnover.value}
                change={metrics.inventoryTurnover.change}
                changeType={metrics.inventoryTurnover.changeType}
                icon="redo"
                color="secondary"
              />
            </div>
          </div>

          {/* Charts */}
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <SalesChart
                data={salesData[timeRange]}
                timeRange={timeRange.replace(/_/g, " ")}
              />
            </div>
            <div className="col-lg-4">
              <CategoryDistributionChart data={categoryData} />
            </div>
          </div>

          {/* Quick Reports */}
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Quick Reports</h6>
                  <small className="text-muted">One-click exports</small>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <button
                        className="btn btn-outline-danger w-100 d-flex flex-column align-items-center py-3"
                        onClick={() => handleQuickExport("sales")}
                      >
                        <i className="fas fa-shopping-bag fs-2 mb-2"></i>
                        <span>Sales Report</span>
                        <small className="text-muted">PDF, Excel, CSV</small>
                      </button>
                    </div>
                    <div className="col-md-3">
                      <button
                        className="btn btn-outline-primary w-100 d-flex flex-column align-items-center py-3"
                        onClick={() => handleQuickExport("products")}
                      >
                        <i className="fas fa-box fs-2 mb-2"></i>
                        <span>Product Report</span>
                        <small className="text-muted">Top performers</small>
                      </button>
                    </div>
                    <div className="col-md-3">
                      <button
                        className="btn btn-outline-success w-100 d-flex flex-column align-items-center py-3"
                        onClick={() => handleQuickExport("customers")}
                      >
                        <i className="fas fa-users fs-2 mb-2"></i>
                        <span>Customer Report</span>
                        <small className="text-muted">Demographics</small>
                      </button>
                    </div>
                    <div className="col-md-3">
                      <button
                        className="btn btn-outline-warning w-100 d-flex flex-column align-items-center py-3"
                        onClick={() => handleQuickExport("inventory")}
                      >
                        <i className="fas fa-warehouse fs-2 mb-2"></i>
                        <span>Inventory Report</span>
                        <small className="text-muted">Stock levels</small>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "sales" && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h6 className="mb-0">Sales Performance</h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Orders</th>
                        <th>Revenue</th>
                        <th>Avg. Order Value</th>
                        <th>Growth</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Last 7 Days</td>
                        <td>189</td>
                        <td className="text-danger fw-bold">₹1,33,800</td>
                        <td>₹7,078</td>
                        <td>
                          <span className="badge bg-success">+15%</span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="fas fa-download me-1"></i>
                            Export
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>Last 30 Days</td>
                        <td>745</td>
                        <td className="text-danger fw-bold">₹4,87,500</td>
                        <td>₹6,543</td>
                        <td>
                          <span className="badge bg-success">+12%</span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="fas fa-download me-1"></i>
                            Export
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>This Quarter</td>
                        <td>2,145</td>
                        <td className="text-danger fw-bold">₹14,25,600</td>
                        <td>₹6,642</td>
                        <td>
                          <span className="badge bg-success">+18%</span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="fas fa-download me-1"></i>
                            Export
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h6 className="mb-0">Top Performing Products</h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Units Sold</th>
                        <th>Revenue</th>
                        <th>Growth</th>
                        <th>Profit Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((product, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-light rounded me-3"
                                style={{ width: "40px", height: "40px" }}
                              ></div>
                              <div>
                                <div className="fw-semibold">
                                  {product.name}
                                </div>
                                <small className="text-muted">
                                  SKU: PRD{1000 + index}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {product.name.includes("Men's")
                                ? "Men"
                                : product.name.includes("Women's")
                                ? "Women"
                                : product.name.includes("Headphones")
                                ? "Electronics"
                                : product.name.includes("Handbag")
                                ? "Accessories"
                                : "Sports"}
                            </span>
                          </td>
                          <td className="fw-semibold">{product.sales}</td>
                          <td className="text-danger fw-bold">
                            ₹{product.revenue.toLocaleString()}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                product.growth >= 0 ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {product.growth >= 0 ? "+" : ""}
                              {product.growth}%
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {Math.floor(Math.random() * 20) + 25}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "customers" && (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0">
                <h6 className="mb-0">Customer Demographics</h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-4">
                    <h4 className="text-danger fw-bold">64%</h4>
                    <small className="text-muted">Male</small>
                  </div>
                  <div className="col-4">
                    <h4 className="text-primary fw-bold">36%</h4>
                    <small className="text-muted">Female</small>
                  </div>
                  <div className="col-4">
                    <h4 className="text-success fw-bold">28%</h4>
                    <small className="text-muted">Repeat Customers</small>
                  </div>
                </div>
                <div className="mt-4">
                  <h6 className="text-muted">Top Locations</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Mumbai</span>
                    <span className="fw-semibold">24%</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Delhi</span>
                    <span className="fw-semibold">18%</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Bangalore</span>
                    <span className="fw-semibold">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0">
                <h6 className="mb-0">Customer Behavior</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>New Customers</span>
                    <span>72%</span>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-success"
                      style={{ width: "72%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Returning Customers</span>
                    <span>28%</span>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-info"
                      style={{ width: "28%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Mobile Users</span>
                    <span>68%</span>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-warning"
                      style={{ width: "68%" }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Desktop Users</span>
                    <span>32%</span>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-primary"
                      style={{ width: "32%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Report Generator */}
      <div className="row g-4 mt-4">
        <div className="col-12">
          <ReportGenerator
            onGenerateReport={handleGenerateReport}
            isLoading={generatingReport}
          />
        </div>
      </div>

      {/* Recent Reports */}
      <div className="row g-4 mt-2">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Recently Generated Reports</h6>
              <small className="text-muted">Last 7 days</small>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Report Name</th>
                      <th>Type</th>
                      <th>Generated On</th>
                      <th>Time Range</th>
                      <th>Size</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Sales_Report_Oct_2025</td>
                      <td>
                        <span className="badge bg-danger">Sales</span>
                      </td>
                      <td>28 Oct 2025, 14:30</td>
                      <td>Last 30 Days</td>
                      <td>2.4 MB</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-primary">
                            <i className="fas fa-download"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-success">
                            <i className="fas fa-share"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Product_Performance_Q3_2025</td>
                      <td>
                        <span className="badge bg-primary">Products</span>
                      </td>
                      <td>25 Oct 2025, 11:15</td>
                      <td>Q3 2025</td>
                      <td>1.8 MB</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-primary">
                            <i className="fas fa-download"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-success">
                            <i className="fas fa-share"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

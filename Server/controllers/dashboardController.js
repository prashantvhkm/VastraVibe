// controllers/dashboardController.js
const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Payment = require("../models/Payment");

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    // Get date ranges
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Execute all queries in parallel
    const [
      totalRevenue,
      todayRevenue,
      totalOrders,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      recentOrders,
    ] = await Promise.all([
      // Total revenue (all time)
      Order.aggregate([
        { $match: { "payment.status": "paid" } },
        { $group: { _id: null, total: { $sum: "$summary.total" } } },
      ]),

      // Today's revenue
      Order.aggregate([
        {
          $match: {
            "payment.status": "paid",
            createdAt: { $gte: startOfToday },
          },
        },
        { $group: { _id: null, total: { $sum: "$summary.total" } } },
      ]),

      // Total orders
      Order.countDocuments(),

      // Pending orders
      Order.countDocuments({ status: "pending" }),

      // Total products
      Product.countDocuments({ status: "active" }),

      // Low stock products
      Product.countDocuments({
        "inventory.stock": { $lte: "$inventory.lowStockThreshold" },
        status: "active",
      }),

      // Total customers
      Customer.countDocuments({ status: "active" }),

      // Recent orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("customer.userId", "name email"),
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
        totalOrders,
        pendingOrders,
        totalProducts,
        lowStockProducts,
        totalCustomers,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get sales chart data
// @route   GET /api/dashboard/sales-chart
// @access  Private
const getSalesChart = async (req, res) => {
  try {
    const { period = "30days" } = req.query;

    let startDate = new Date();
    switch (period) {
      case "7days":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          "payment.status": "paid",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$summary.total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    console.error("Sales chart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getDashboardStats,
  getSalesChart,
};

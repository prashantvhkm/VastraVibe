// routes/dashboard.js
const express = require("express");
const {
  getDashboardStats,
  getSalesChart,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/sales-chart", protect, getSalesChart);

module.exports = router;

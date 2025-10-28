// routes/products.js
const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(protect, getProducts)
  .post(protect, authorize("admin", "manager"), createProduct);

router
  .route("/:id")
  .get(protect, getProduct)
  .put(protect, authorize("admin", "manager"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct);

router.put(
  "/:id/inventory",
  protect,
  authorize("admin", "manager"),
  updateInventory
);

module.exports = router;

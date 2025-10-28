// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
    },
    description: String,
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: String,
    price: {
      regular: {
        type: Number,
        required: true,
      },
      sale: Number,
      currency: {
        type: String,
        default: "INR",
      },
    },
    inventory: {
      stock: {
        type: Number,
        default: 0,
      },
      lowStockThreshold: {
        type: Number,
        default: 10,
      },
      trackQuantity: {
        type: Boolean,
        default: true,
      },
      allowBackorder: {
        type: Boolean,
        default: false,
      },
    },
    images: [String],
    variants: [
      {
        size: String,
        color: String,
        sku: String,
        price: Number,
        stock: Number,
        image: String,
      },
    ],
    specifications: Map,
    tags: [String],
    seo: {
      metaTitle: String,
      metaDescription: String,
      slug: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Generate SKU before saving
productSchema.pre("save", function (next) {
  if (!this.sku) {
    this.sku = "PROD-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);

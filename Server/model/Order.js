// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: String,
    },
    shippingAddress: {
      name: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
      postalCode: String,
      phone: String,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        sku: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        total: Number,
        image: String,
      },
    ],
    summary: {
      subtotal: Number,
      shipping: Number,
      tax: Number,
      discount: Number,
      total: Number,
      currency: {
        type: String,
        default: "INR",
      },
    },
    payment: {
      method: {
        type: String,
        enum: [
          "upi",
          "credit_card",
          "debit_card",
          "net_banking",
          "wallet",
          "cod",
        ],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      transactionId: String,
      gateway: String,
      paidAt: Date,
    },
    shipping: {
      method: String,
      trackingNumber: String,
      carrier: String,
      estimatedDelivery: Date,
      shippedAt: Date,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        note: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    notes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Generate order ID before saving
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = "ORD-" + Date.now();
  }

  // Calculate item totals
  this.items.forEach((item) => {
    item.total = item.price * item.quantity;
  });

  // Calculate summary
  this.summary.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.summary.total =
    this.summary.subtotal +
    (this.summary.shipping || 0) +
    (this.summary.tax || 0) -
    (this.summary.discount || 0);

  next();
});

module.exports = mongoose.model("Order", orderSchema);

// models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      trim: true,
    },
    description: String,
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    image: String,
    seo: {
      metaTitle: String,
      metaDescription: String,
      slug: {
        type: String,
        unique: true,
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    productCount: {
      type: Number,
      default: 0,
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

// Update product count when products are added/removed
categorySchema.statics.updateProductCount = async function (categoryId) {
  const Product = require("./Product");
  const count = await Product.countDocuments({ categoryId, status: "active" });
  await this.findByIdAndUpdate(categoryId, { productCount: count });
};

module.exports = mongoose.model("Category", categorySchema);

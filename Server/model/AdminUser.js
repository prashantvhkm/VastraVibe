const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    profileImage: String,
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
    },
    phone: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdminUser", userSchema);

// config/database.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Create default admin user
    await createDefaultAdmin();
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  const User = require("../models/User");
  const bcrypt = require("bcryptjs");

  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await User.create({
      name: "Admin User",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("✅ Default admin user created");
  }
};

module.exports = connectDB;

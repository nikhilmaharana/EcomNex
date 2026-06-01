import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";

dotenv.config();

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || "";
const adminName = process.env.ADMIN_NAME?.trim() || "Admin";

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing in backend/.env");
  process.exit(1);
}

if (!adminEmail || !adminPassword) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD before creating an admin.");
  process.exit(1);
}

if (adminPassword.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  const existingUser = await User.findOne({ email: adminEmail });
  if (existingUser && existingUser.role !== "admin") {
    throw new Error("That email already belongs to a non-admin account.");
  }

  const admin = await User.findOneAndUpdate(
    { email: adminEmail },
    {
      name: adminName,
      email: adminEmail,
      password: hashPassword(adminPassword),
      role: "admin",
    },
    { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin account ready for ${admin.email}`);
} catch (err) {
  console.error("Admin creation failed:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}

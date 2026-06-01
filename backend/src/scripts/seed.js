import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";

dotenv.config();

const accounts = [
  {
    name: "Demo Buyer",
    email: "buyer@ecomnex.test",
    password: hashPassword("buyer123"),
    role: "buyer",
    phone: "9876543210",
  },
  {
    businessName: "Ecomnex Electronics",
    email: "seller@ecomnex.test",
    password: hashPassword("seller123"),
    role: "seller",
    phone: "9876543211",
    gst: "GSTDEMO12345",
  },
  {
    name: "Admin",
    email: "admin@ecomnex.test",
    password: hashPassword("admin123"),
    role: "admin",
  },
];

const productData = [
  {
    title: "Apple iPhone 15",
    price: 69999,
    description:
      "A16 Bionic smartphone with advanced dual camera, Dynamic Island, and USB-C.",
    category: "Smartphones",
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1000",
    ],
    rating: 4.7,
    reviews: [
      {
        name: "Demo Buyer",
        rating: 5,
        comment: "Camera quality is excellent and the seller shipped quickly.",
      },
      {
        name: "Riya Sharma",
        rating: 4,
        comment: "Smooth phone, original packaging, and good delivery updates.",
      },
    ],
  },
  {
    title: "Samsung Galaxy S24",
    price: 74999,
    description:
      "Compact flagship Android phone with bright AMOLED display and Galaxy AI features.",
    category: "Smartphones",
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1000",
    ],
    rating: 4.6,
    reviews: [
      {
        name: "Arjun Mehta",
        rating: 5,
        comment: "Display is bright and the performance feels premium.",
      },
    ],
  },
  {
    title: "MacBook Air M3",
    price: 114900,
    description:
      "Thin and light laptop with Apple M3 chip, all-day battery life, and Liquid Retina display.",
    category: "Laptops",
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000",
    ],
    rating: 4.8,
    reviews: [
      {
        name: "Neha Rao",
        rating: 5,
        comment: "Very light laptop and battery life is great for college work.",
      },
    ],
  },
  {
    title: "Sony WH-1000XM5 Headphones",
    price: 29990,
    description:
      "Premium wireless noise cancelling headphones with long battery life and rich audio.",
    category: "Audio",
    stock: 22,
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000",
    ],
    rating: 4.5,
    reviews: [
      {
        name: "Karan Patel",
        rating: 4,
        comment: "Noise cancellation is strong and audio is clean.",
      },
    ],
  },
  {
    title: "Apple Watch Series 9",
    price: 41900,
    description:
      "Smartwatch with health tracking, bright always-on display, and fast performance.",
    category: "Wearables",
    stock: 14,
    images: [
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=1000",
    ],
    rating: 4.4,
    reviews: [
      {
        name: "Maya Das",
        rating: 4,
        comment: "Useful fitness tracking and comfortable strap.",
      },
    ],
  },
  {
    title: "Logitech MX Master 3S Mouse",
    price: 9495,
    description:
      "Ergonomic wireless performance mouse with quiet clicks and precise scrolling.",
    category: "Accessories",
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=1000",
    ],
    rating: 4.6,
    reviews: [
      {
        name: "Dev Kumar",
        rating: 5,
        comment: "Comfortable for long work sessions and scrolling is precise.",
      },
    ],
  },
];

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing in backend/.env");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);

const createdUsers = {};
for (const account of accounts) {
  const user = await User.findOneAndUpdate(
    { email: account.email },
    account,
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
  );
  createdUsers[user.role] = user;
}

for (const product of productData) {
  await Product.findOneAndUpdate(
    { title: product.title },
    {
      ...product,
      seller: createdUsers.seller._id,
      sellerName: createdUsers.seller.businessName,
    },
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
  );
}

const productCount = await Product.countDocuments();
const userCount = await User.countDocuments();

console.log(`Seed complete: ${userCount} users, ${productCount} products`);
console.log("Demo buyer: buyer@ecomnex.test / buyer123");
console.log("Demo seller: seller@ecomnex.test / seller123");
console.log("Demo admin: admin@ecomnex.test / admin123");

await mongoose.disconnect();

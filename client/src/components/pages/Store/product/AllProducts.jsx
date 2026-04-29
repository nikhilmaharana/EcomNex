import { useState } from "react";
import Footer from "../../../Footer/Footer";
import Header from "../../../Navbar/Header";
import "./AllProduct.css";

const AllProducts = () => {
  const [sortOption, setSortOption] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const products = [
    { id: 1, name: "iPhone 14", category: "Mobiles", price: 70000, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97" },
    { id: 2, name: "Samsung S23", category: "Mobiles", price: 65000, img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf" },
    { id: 3, name: "OnePlus 11", category: "Mobiles", price: 60000, img: "https://images.unsplash.com/photo-1580910051074-3eb694886505" },
    { id: 4, name: "HP Pavilion", category: "Laptops", price: 55000, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8" },
    { id: 5, name: "Dell Inspiron", category: "Laptops", price: 60000, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853" },
    { id: 6, name: "MacBook Air", category: "Laptops", price: 90000, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8" },
    { id: 7, name: "iPad", category: "Tablets", price: 40000, img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04" },
    { id: 8, name: "Samsung Tab", category: "Tablets", price: 35000, img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04" },
    { id: 9, name: "Lenovo Tab", category: "Tablets", price: 30000, img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04" },
    { id: 10, name: "Boat Earbuds", category: "Accessories", price: 2000, img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad" },
    { id: 11, name: "Realme Buds", category: "Accessories", price: 2500, img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad" },
    { id: 12, name: "AirPods", category: "Accessories", price: 15000, img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad" },
    { id: 13, name: "Smart Watch", category: "Smartwatches", price: 5000, img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b" },
    { id: 14, name: "Bluetooth Speaker", category: "Accessories", price: 3000, img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad" },
    { id: 15, name: "Power Bank", category: "Accessories", price: 1500, img: "https://images.unsplash.com/photo-1580910051074-3eb694886505" }
  ];

  // FILTER
  let filteredProducts =
    filterCategory === "all"
      ? products
      : products.filter((p) => p.category === filterCategory);

  // SORT
  if (sortOption === "low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOption === "high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <>
      <Header />

      {/* TOP CONTROLS */}
      <div className="top-controls">
        <select onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Laptops">Laptops</option>
          <option value="Tablets">Tablets</option>
          <option value="Smartwatches">Smartwatches</option>
          <option value="Accessories">Accessories</option>
        </select>

        <select onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort By</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>

      {/* PAGE */}
      <div className="product-page">
        <h1 className="page-title">🛍️ All Products</h1>

        <div className="grid">
          {filteredProducts.map((p) => (
            <div className="card" key={p.id}>
              <div className="card-img">
                <img src={p.img} alt={p.name} />
              </div>

              <div className="card-body">
                <div className="card-top">
                  <span className="brand">{p.category}</span>
                  <span className="rating">4.5 ⭐</span>
                </div>

                <h2 className="title">{p.name}</h2>

                <p className="desc">
                  Premium quality product with modern features and design.
                </p>

                <div className="price-section">
                  <span className="price">₹{p.price.toLocaleString()}</span>
                  <span className="old-price">₹{(p.price + 10000).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AllProducts;
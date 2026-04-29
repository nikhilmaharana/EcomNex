import { Link } from "react-router-dom";
import { useState } from "react";
import { products } from "../../../data/products";
import "../ProductDetails/ProductDetails.css";
import "./Store.css";

const categories = ["All", ...new Set(products.map((product) => product.category))];

const Store = () => {
  const featuredProducts = products.slice(0, 3);

  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ FILTER LOGIC
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <main className="product-page store-page">

      {/* HEADER */}
      <header className="site-header">
        <Link className="brand" to="/">EcomNex</Link>

        <nav className="site-nav">
          <a href="#catalog">Catalog</a>
          <a href="#categories">Categories</a>
          <a href="#featured">Featured</a>
          <a href="#support">Support</a>
        </nav>

        <div className="header-right">
          <Link className="cart-button" to="/allproducts">
            Start shopping
          </Link>

          <div className="profile">
            <span className="profile-icon">👤</span>
            <div className="profile-dropdown">
              <p><strong>John Doe</strong></p>
              <p>john@email.com</p>
              <Link to="/login">Logout</Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="store-hero">
        <div>
          <p className="section-kicker">Mock catalog</p>
          <h1>Electronics built for a real storefront flow</h1>
          <p>
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam non deserunt dolores mollitia alias qui nisi, sunt saepe corrupti natus?
  
          </p>
        </div>

        <div className="store-hero-panel" id="featured">
          {featuredProducts.map((product) => (
            <Link className="mini-product" to={`/product/${product.id}`} key={product.id}>
              <span>{product.badge}</span>
              <strong>{product.name}</strong>
              <small>₹{product.price.toLocaleString("en-IN")}</small>
            </Link>
          ))}

          <div className="hero-images">
            <img src="https://source.unsplash.com/200x200/?laptop" alt="laptop" />
            <img src="https://source.unsplash.com/200x200/?smartphone" alt="phone" />
            <img src="https://source.unsplash.com/200x200/?headphones" alt="headphones" />
          </div>
        </div>
      </section>

      {/* ✅ CATEGORY FILTER */}
      <section className="category-strip" id="categories" aria-label="Product categories">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "active" : ""}
          >
            {category}
          </button>
        ))}
      </section>

      {/* PRODUCTS */}
      <section className="catalog-section" id="catalog">
        <div className="catalog-heading">
          <div>
            <p className="section-kicker">Products</p>
            <h2>Mock products</h2>
          </div>
          <span>{filteredProducts.length} items</span>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <Link className="product-card" to={`/product/${product.id}`} key={product.id}>
              <div className="product-card-media">
                {product.images?.[0]?.src ? (
                  <img src={product.images[0].src} alt={product.name} />
                ) : (
                  <span>{product.category}</span>
                )}
              </div>

              <div className="product-card-body">
                <div className="product-card-topline">
                  <span>{product.brand}</span>
                  <strong>{product.rating} ★</strong>
                </div>

                <h3>{product.name}</h3>
                <p>{product.shortDescription}</p>

                <div className="product-card-price">
                  <strong>₹{product.price.toLocaleString("en-IN")}</strong>
                  <span>₹{product.originalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Store;
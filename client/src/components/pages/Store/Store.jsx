import { Link } from "react-router-dom";
import { products } from "../../../data/products";
import "../ProductDetails/ProductDetails.css";
import "./Store.css";

const categories = ["All", ...new Set(products.map((product) => product.category))];

const Store = () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <main className="product-page store-page">
      <header className="site-header">
        <Link className="brand" to="/">
          EcomNex
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#catalog">Catalog</a>
          <a href="#categories">Categories</a>
          <a href="#featured">Featured</a>
          <a href="#support">Support</a>
        </nav>
        <Link className="cart-button" to="/product/iphone-14">
          Start shopping
        </Link>
      </header>

      <section className="store-hero">
        <div>
          <p className="section-kicker">Mock catalog</p>
          <h1>Electronics built for a real storefront flow</h1>
          <p>
            Browse multiple demo products, open detail pages, test variants, and later connect the same data shape to MongoDB.
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
        </div>
      </section>

      <section className="category-strip" id="categories" aria-label="Product categories">
        {categories.map((category) => (
          <a href="#catalog" key={category}>
            {category}
          </a>
        ))}
      </section>

      <section className="catalog-section" id="catalog" aria-labelledby="catalog-title">
        <div className="catalog-heading">
          <div>
            <p className="section-kicker">Products</p>
            <h2 id="catalog-title">Mock products</h2>
          </div>
          <span>{products.length} items</span>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <Link className="product-card" to={`/product/${product.id}`} key={product.id}>
              <div className="product-card-media" style={{ "--placeholder": product.images[0]?.color || "#dbeafe" }}>
                {product.images[0]?.src ? (
                  <img src={product.images[0].src} alt={product.images[0].alt || product.name} />
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

      <section className="store-support" id="support">
        <strong>Ready for backend later</strong>
        <span>This mock catalog can move into an API without changing the page structure.</span>
      </section>
    </main>
  );
};

export default Store;

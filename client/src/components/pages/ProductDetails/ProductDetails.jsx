import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getProductById } from "../../../data/products";
import ProductImageGallery from "../../productDetails/ProductImageGallery";
import ProductInfo from "../../productDetails/ProductInfo";
import ProductDescription from "../../productDetails/ProductDescription";
import ReviewList from "../../productDetails/ReviewList";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [cartCount, setCartCount] = useState(0);
  const product = getProductById(id);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const handleCartClick = () => {
    document.getElementById("purchase-panel")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="product-page">
      <header className="site-header">
        <Link className="brand" to="/">
          EcomNex
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <Link to="/">Store</Link>
          <a href="#benefits">Benefits</a>
          <a href="#details">Details</a>
          <a href="#reviews">Reviews</a>
        </nav>
        <button className="cart-button" type="button" onClick={handleCartClick} aria-label="Open cart">
          Cart <span>{cartCount}</span>
        </button>
      </header>

      <section className="product-hero" id="product" aria-labelledby="product-title">
        <div className="gallery-column">
          <p className="breadcrumb">Store / Mobiles / {product.brand}</p>
          <ProductImageGallery key={product.id} images={product.images} productName={product.name} />
        </div>

        <ProductInfo
          key={`${product.id}-purchase`}
          product={product}
          onAddToCart={(quantity) => setCartCount((count) => count + quantity)}
        />
      </section>

      <section className="trust-strip" id="benefits" aria-label="Shopping benefits">
        <div>
          <strong>Free delivery</strong>
          <span>On eligible orders</span>
        </div>
        <div>
          <strong>7 day replacement</strong>
          <span>Simple pickup flow</span>
        </div>
        <div>
          <strong>Secure payments</strong>
          <span>Cards, UPI, net banking</span>
        </div>
        <div>
          <strong>Brand warranty</strong>
          <span>Official coverage</span>
        </div>
      </section>

      <ProductDescription
        description={product.description}
        highlights={product.highlights}
        specs={product.specs}
      />
      <ReviewList reviews={product.reviews} rating={product.rating} reviewCount={product.reviewCount} />
    </main>
  );
};

export default ProductDetails;

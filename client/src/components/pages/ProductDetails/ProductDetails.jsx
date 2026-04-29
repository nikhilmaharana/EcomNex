import { useState } from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../../data/products";
import ProductImageGallery from "../../productDetails/ProductImageGallery";
import ProductInfo from "../../productDetails/ProductInfo";
import ProductDescription from "../../productDetails/ProductDescription";
import ReviewList from "../../productDetails/ReviewList";
import { FaHeart, FaSearch } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import "./ProductDetails.css";
import Footer from "../../Footer/Footer";
import Header from "../../Navbar/Header";

const ProductDetails = () => {
  const { id } = useParams();
  const [cartCount, setCartCount] = useState(0);
  const product = getProductById(id);
  const [searchTerm, setSearchTerm] = useState("");

   const navigate = useNavigate();

  if (!product) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="product-page">

     <Header/>
      {/* PRODUCT */}
      <section className="product-hero" id="product">
        <div className="gallery-column">
          <p className="breadcrumb">
            Store / {product.category} / {product.brand}
          </p>

          <ProductImageGallery
            key={product.id}
            images={product.images}
            productName={product.name}
          />
        </div>

        <ProductInfo
          key={`${product.id}-purchase`}
          product={product}
          onAddToCart={(quantity) =>
            setCartCount((count) => count + quantity)
          }
        />
      </section>

      {/* BENEFITS */}
      <section className="trust-strip" id="benefits">
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

      <ReviewList
        reviews={product.reviews}
        rating={product.rating}
        reviewCount={product.reviewCount}
      />

      <Footer/>
    </main>
  );
};

export default ProductDetails;
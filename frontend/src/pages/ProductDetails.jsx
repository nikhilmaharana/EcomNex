import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductImageGallery from "../components/productDetails/ProductImageGallery";
import ProductInfo from "../components/productDetails/ProductInfo";
import ProductDescription from "../components/productDetails/ProductDescription";
import ReviewList from "../components/productDetails/ReviewList";
import { apiUrl, normalizeProduct } from "../lib/api";

const ProductDetails = () => {
  const { id } = useParams(); // 👈 get product id from URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiUrl(`/products/${id}`))
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => setProduct(normalizeProduct(data)))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-300">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#0f172a] to-[#020617] p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">

        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-10">
          <ProductImageGallery images={product.images || []} />
          <ProductInfo product={product} />
        </div>

        {/* Description */}
        <ProductDescription description={product.description} />

        {/* Reviews */}
        <ReviewList product={product} onProductUpdated={setProduct} />
      </div>
    </div>
  );
};

export default ProductDetails;

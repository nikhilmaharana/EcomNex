import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl, getAuthHeaders } from "../../lib/api";
import { UserContext } from "../../context/UserContext";

const ProductInfo = ({ product }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const { user } = useContext(UserContext);
  const requireBuyer = () => {
    if (!user?._id) {
      navigate("/login");
      return null;
    }

    if (user.role !== "buyer") {
      setMessage("Please use a buyer account to shop or checkout.");
      return null;
    }

    return user;
  };

  const addToCart = async () => {
    const user = requireBuyer();
    if (!user) return;

    try {
      const res = await fetch(apiUrl(`/cart/${user._id}/items`), {
        method: "POST",
        headers: getAuthHeaders("application/json"),
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add to cart");

      setMessage("Added to cart");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const buyNow = () => {
    const user = requireBuyer();
    if (!user) return;
    navigate("/order", { state: { items: [{ product, quantity: 1 }] } });
  };

  return (

    <div className="flex flex-col gap-5 text-white">

      {/* Title */}
      <h1 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        {product.title}
      </h1>
      
      {/* Description (fallback handled) */}
      <p className="text-gray-400">
        {product.shortDescription || product.description}
      </p>
      
      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-semibold text-purple-400">
          ₹{product.price}
        </span>
        
        {/* oldPrice fallback */}
        <span className="line-through text-gray-500">
          ₹{product.oldPrice || product.price + 10000}
        </span>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-gray-400">Seller</p>
          <p className="font-semibold text-purple-200">{product.sellerName}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-gray-400">Category</p>
          <p className="font-semibold text-cyan-200">{product.category || "General"}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-gray-400">Availability</p>
          <p className="font-semibold text-green-300">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>
      </div>
      
      {/* Rating */}
      <div className="flex items-center gap-2 text-yellow-400">
        ⭐ {product.rating || 0} ({product.reviewCount || 0} reviews)
      </div>
      
      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        
        <button
          onClick={addToCart}
          className="bg-linear-to-r from-purple-600 to-indigo-600 px-6 py-2 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          Add to Cart
        </button>

        <button
          onClick={buyNow}
          className="border border-purple-500 text-purple-300 px-6 py-2 rounded-xl hover:bg-purple-500/10 transition"
        >
          Buy Now
        </button>
      </div>

      {message && <p className="text-sm text-cyan-300">{message}</p>}
    </div>
  );
};

export default ProductInfo;

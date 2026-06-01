import { useNavigate } from "react-router-dom";

const ProductInfo = ({ product }) => {

  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Title */}
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
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

      {/* Rating */}
      <div className="flex items-center gap-2 text-yellow-400">
        ⭐ {product.rating || 4.5} ({product.reviewCount || 0} reviews)
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 rounded-xl shadow-lg hover:opacity-90 transition">
          Add to Cart
        </button>

        <button onClick={()=>{navigate("/order")}} className="border border-purple-500 text-purple-300 px-6 py-2 rounded-xl hover:bg-purple-500/10 transition">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
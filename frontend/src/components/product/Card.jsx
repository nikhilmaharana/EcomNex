import { useState } from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";

export default function Card() {
  const [liked, setLiked] = useState(false);

  const rating = 4;
  const totalReviews = 120;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1221]">
      
      <div className="relative w-80 bg-gradient-to-br from-[#1a1f3a] to-[#12152a] rounded-2xl p-4 shadow-2xl hover:-translate-y-2 transition duration-300 group">
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-xl bg-purple-500/20"></div>

        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-4 right-4 z-10"
        >
          <Heart
            size={22}
            className={`transition ${
              liked ? "fill-pink-500 text-pink-500 scale-110" : "text-gray-400 z-1" 
            }`}
          />
        </button>

        {/* Image */}
        <img
          src="https://t4.ftcdn.net/jpg/03/77/76/03/360_F_377760368_dvPR39qE5QHKT9CDEnTsC8RVzueuIGUl.jpg"
          alt="product"
          className="w-full h-48 object-cover rounded-xl mb-4 relative z-10"
        />

        {/* Title */}
        <h2 className="text-lg font-semibold text-white mb-1 relative z-10">
          Wireless Headphones
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-3 relative z-10">
          Premium quality headphones with noise cancellation and deep bass.
        </p>

        {/* Price */}
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <span className="text-sm text-gray-500 line-through">$120</span>
          <span className="text-lg font-bold text-purple-400">$89</span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4 relative z-10">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={`mr-1 ${
                i < rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-600"
              }`}
            />
          ))}
          <span className="text-gray-400 text-sm ml-2">
            ({totalReviews} reviews)
          </span>
        </div>

        {/* Add to Cart */}
        <button className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl transition relative z-10 shadow-lg shadow-purple-500/20">
          <ShoppingCart size={18} />
          Add to Cart
        </button>

      </div>
    </div>
  );
}
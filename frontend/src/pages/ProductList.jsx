import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl, getProductImage, normalizeProduct } from "../lib/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(apiUrl("/products"))
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => setProducts(data.map(normalizeProduct)))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {error && <p className="text-red-300">{error}</p>}

        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}  // ✅ correct
            className="bg-white/5 p-4 rounded-xl border border-white/10 cursor-pointer hover:scale-105 transition"
          >
            <img
              src={getProductImage(product)}
              alt={product.title}
              className="h-40 w-full object-contain mb-4"
            />

            <h2 className="text-white font-semibold">{product.title}</h2>
            <p className="text-purple-400 font-bold">₹{product.price}</p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default ProductList;

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../Footer";
import { apiUrl, getProductImage, normalizeProduct } from "../lib/api";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.trim() || "";
  const navigate = useNavigate();

  const slugToCategory = {
    phones: "Smartphones",
    laptops: "Laptops",
    tablets: "Tablets",
    audio: "Audio",
    wearables: "Wearables",
    accessories: "Accessories",
  };
  const categoryToSlug = {
    Smartphones: "phones",
    Laptops: "laptops",
    Tablets: "tablets",
    Audio: "audio",
    Wearables: "wearables",
    Accessories: "accessories",
  };
  const selectedCategory = slug ? slugToCategory[slug.toLowerCase()] || "All" : "All";

  useEffect(() => {
    fetch(apiUrl("/products"))
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => setProducts(data.map(normalizeProduct)))
      .catch((err) => setError(err.message));
  }, []);

  // Categories
  const categories = [
    "All",
    "Smartphones",
    "Laptops",
    "Tablets",
    "Audio",
    "Accessories",
    "Wearables",
  ];

  // Auto category detection
  const categorizedProducts = useMemo(() => products.map((product) => {
    let category = product.category || "Accessories";

    if (
      product.title.toLowerCase().includes("iphone") ||
      product.title.toLowerCase().includes("galaxy")
    ) {
      category = "Smartphones";
    }

    else if (
      product.title.toLowerCase().includes("macbook") ||
      product.title.toLowerCase().includes("laptop")
    ) {
      category = "Laptops";
    }

    else if (
      product.title.toLowerCase().includes("ipad") ||
      product.title.toLowerCase().includes("tablet")
    ) {
      category = "Tablets";
    }

    else if (
      product.title.toLowerCase().includes("sony") ||
      product.title.toLowerCase().includes("speaker") ||
      product.title.toLowerCase().includes("headphone")
    ) {
      category = "Audio";
    }

    else if (
      product.title.toLowerCase().includes("watch")
    ) {
      category = "Wearables";
    }

    return {
      ...product,
      category,
    };
  }), [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let results = categorizedProducts;

    if (selectedCategory !== "All") {
      results = results.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      results = results.filter((product) =>
        product.title.toLowerCase().includes(lower) ||
        product.description.toLowerCase().includes(lower) ||
        product.category.toLowerCase().includes(lower)
      );
    }

    return results;
  }, [selectedCategory, categorizedProducts, searchQuery]);

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#0f172a] to-[#020617] px-6 py-10 mt-10">

      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Explore Products
        </h1>

        <p className="text-gray-400">
          Discover premium gadgets and accessories.
        </p>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-6 text-red-300">
          {error}
        </div>
      )}

      {/* Categories */}
      <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto mb-10 pb-2 scrollbar-hide">

        {categories.map((category) => (
          <button
            key={category}
            onClick={() =>
              navigate(category === "All" ? "/product" : `/category/${categoryToSlug[category]}`)
            }
            className={`px-5 py-2 rounded-full border transition-all duration-300 whitespace-nowrap
              
              ${
                selectedCategory === category
                  ? "bg-linear-to-r from-purple-600 to-cyan-500 text-white border-transparent shadow-lg shadow-cyan-500/20"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/10"
          >

            {/* Image */}
            <div className="h-60 bg-linear-to-br from-[#111827] to-[#1e293b] flex items-center justify-center overflow-hidden p-6">

              <img
                src={getProductImage(product)}
                alt={product.title}
                className="h-full object-contain group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* Content */}
              <div className="p-5 flex flex-col gap-3">

              <div className="flex items-center justify-between gap-3">
                <span className="w-fit px-3 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                  {product.category}
                </span>

                <span className="text-xs text-gray-400">
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold text-white line-clamp-1">
                {product.title}
              </h2>

              <p className="text-xs text-purple-300">
                Sold by {product.sellerName}
              </p>

              {/* Description */}
              <p className="text-gray-400 text-sm line-clamp-2">
                {product.description}
              </p>

              {/* Bottom */}
              <div className="flex items-center justify-between mt-2">

                <div>
                  <p className="text-2xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    ₹{product.price}
                  </p>

                  <p className="text-yellow-400 text-sm mt-1">
                    ⭐ {product.rating || 0} ({product.reviewCount})
                  </p>
                </div>

                <button className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 text-white text-sm hover:opacity-90 transition">
                  View
                </button>

              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Empty */}
      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-400 mt-20 text-lg">
          No products found.
        </div>
      )}

    </div>
    <Footer/>
    </>
  );
};

export default Product;

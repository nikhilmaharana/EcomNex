import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "../Footer";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "iPhone 14",
      price: 70000,
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    },
    {
      id: 2,
      name: "Samsung S23",
      price: 65000,
      img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf",
    },
    {
      id: 3,
      name: "Google Pixel 7",
      price: 60000,
      img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
    },
  ]);

  const removeItem = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-linear-to-br from-[#050507] via-[#0b0b1a] to-[#0a0a14] text-white p-6 pt-17 mt-10">
      
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-500">
        My Wishlist 💜
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          Your wishlist is empty
        </p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-[#0b0b1a] border border-purple-700/30 rounded-2xl p-4 shadow-lg shadow-purple-900/30 hover:shadow-purple-700/40 transition duration-300 backdrop-blur-md"
            >
              <img
                src={item.img}
                alt={item.name}
                className="h-40 w-full object-cover rounded-xl"
              />

              <h2 className="text-xl font-semibold mt-3 text-purple-400">
                {item.name}
              </h2>

              <p className="text-gray-400">₹{item.price}</p>

              <button
                onClick={() => removeItem(item.id)}
                className="mt-4 w-full bg-linear-to-r from-purple-700 to-indigo-700 hover:opacity-90 text-white py-2 rounded-lg transition duration-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default Wishlist;
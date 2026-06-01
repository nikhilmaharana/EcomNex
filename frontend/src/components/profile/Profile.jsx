import {
  FaShoppingBag,
  FaHeart,
  FaHeadset,
  FaPhoneAlt,
  FaUserEdit,
  FaUser,
  FaMapMarkerAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Navbar";
import Footer from "../../Footer";
import { UserContext, DEFAULT_USER } from "../../context/UserContext";
import { clearCurrentUser } from "../../lib/api";

const UserPage = () => {

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogout = () => {
    clearCurrentUser();
    setUser(DEFAULT_USER);
    navigate("/");
  };

  const products = [
    {
      id: 1,
      name: "iPhone 14",
      price: "₹70,000",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    },

    {
      id: 2,
      name: "MacBook Air",
      price: "₹95,000",
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    },

    {
      id: 3,
      name: "Samsung S23",
      price: "₹65,000",
      img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
    },

    {
      id: 4,
      name: "Sony Headphones",
      price: "₹12,000",
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },

    {
      id: 5,
      name: "Apple Watch",
      price: "₹35,000",
      img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
    },

    {
      id: 6,
      name: "Gaming Laptop",
      price: "₹1,20,000",
      img: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-[#050507] via-[#0b0b1a] to-[#0a0a14] text-white px-4 py-20">

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-purple-400 mb-10">
          My Profile
        </h1>

        {/* TOP OPTIONS */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">

          <button
            onClick={() => navigate("/orders")}
            className="bg-[#111122] hover:bg-purple-800/30 border border-purple-900/20 rounded-2xl p-6 flex flex-col items-center gap-3 transition"
          >
            <FaShoppingBag className="text-3xl text-purple-400" />
            <span>My Orders</span>
          </button>

          <button
            onClick={() => navigate("/wishlist")}
            className="bg-[#111122] hover:bg-purple-800/30 border border-purple-900/20 rounded-2xl p-6 flex flex-col items-center gap-3 transition"
          >
            <FaHeart className="text-3xl text-purple-400" />
            <span>Wishlist</span>
          </button>

          <button
            onClick={() => navigate("/help")}
            className="bg-[#111122] hover:bg-purple-800/30 border border-purple-900/20 rounded-2xl p-6 flex flex-col items-center gap-3 transition"
          >
            <FaHeadset className="text-3xl text-purple-400" />
            <span>Help Center</span>
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="bg-[#111122] hover:bg-purple-800/30 border border-purple-900/20 rounded-2xl p-6 flex flex-col items-center gap-3 transition"
          >
            <FaPhoneAlt className="text-3xl text-purple-400" />
            <span>Contact</span>
          </button>

        </div>

        {/* RECENT PRODUCTS */}
        <div className="max-w-6xl mx-auto mt-14">

          <h2 className="text-2xl font-semibold text-purple-400 mb-6">
            Recently Viewed
          </h2>

          {/* HIDDEN SCROLLBAR */}
          <div
            className="
              flex gap-6 overflow-x-auto pb-4
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >

            {products.map((item) => (
              <div
                key={item.id}
                className="
                  min-w-[230px]
                  bg-[#111122]
                  border border-purple-900/20
                  rounded-2xl
                  p-4
                  hover:scale-105
                  hover:border-purple-500/40
                  transition duration-300
                  shadow-lg
                "
              >

                <img
                  src={item.img}
                  alt={item.name}
                  className="h-40 w-full object-cover rounded-xl"
                />

                <h2 className="mt-3 text-lg font-semibold">
                  {item.name}
                </h2>

                <p className="text-purple-400 mt-1">
                  {item.price}
                </p>

              </div>
            ))}

          </div>
        </div>

        {/* ACCOUNT OPTIONS */}
        <div className="max-w-6xl mx-auto mt-14">

          <h2 className="text-2xl font-semibold text-purple-400 mb-6">
            Account Settings
          </h2>

          <div className="flex flex-col gap-5">

            <button
              onClick={() => navigate("/myprofile")}
              className="
                bg-[#111122]
                hover:bg-purple-800/30
                border border-purple-900/20
                rounded-2xl
                p-5
                flex items-center gap-4
                transition
              "
            >
              <FaUserEdit className="text-purple-400 text-xl" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => navigate("/account")}
              className="
                bg-[#111122]
                hover:bg-purple-800/30
                border border-purple-900/20
                rounded-2xl
                p-5
                flex items-center gap-4
                transition
              "
            >
              <FaUser className="text-purple-400 text-xl" />
              <span>My Account</span>
            </button>

            <button
              onClick={() => navigate("/address")}
              className="
                bg-[#111122]
                hover:bg-purple-800/30
                border border-purple-900/20
                rounded-2xl
                p-5
                flex items-center gap-4
                transition
              "
            >
              <FaMapMarkerAlt className="text-purple-400 text-xl" />
              <span>Saved Address</span>
            </button>

          </div>
        </div>

        {/* LOGOUT */}
        <div className="max-w-6xl mx-auto mt-10">

          <button
            onClick={handleLogout}
            className="
              w-full
              bg-red-600
              hover:bg-red-500
              rounded-2xl
              py-4
              flex items-center justify-center gap-3
              transition
            "
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default UserPage;

import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

import {
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import Footer from "../../Footer";
import Navbar from "../Navbar";

const Address = () => {

 
   const { user } = useContext(UserContext);
   const addresses = [
    {
      id: 1,
      name: "Home",
      user: user.name,
      phone: user.phone,
      address: user.address,
    },
  ];
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-linear-to-br from-[#050507] via-[#0b0b1a] to-[#0a0a14] text-white px-4 py-20 mt-10">

      {/* Heading */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-10">

        <h1 className="text-4xl font-bold text-purple-400">
          Saved Addresses
        </h1>

        <button className="bg-linear-to-r from-purple-700 to-indigo-700 px-5 py-3 rounded-2xl flex items-center gap-3 hover:opacity-90 transition">

          <FaPlus />

          Add New Address

        </button>

      </div>

      {/* Address Cards */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

        {addresses.map((item) => (
          <div
            key={item.id}
            className="bg-[#0b0b1a] border border-purple-900/20 rounded-3xl p-6 shadow-xl shadow-purple-900/20"
          >

            {/* Top */}
            <div className="flex items-center justify-between mb-6">

              <div className="flex items-center gap-3">

                <div className="bg-purple-700/20 p-3 rounded-2xl">
                  <FaMapMarkerAlt className="text-purple-400 text-xl" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    {item.name}
                  </h2>

                  <p className="text-gray-400 text-sm">
                    Delivery Address
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <button className="bg-[#111122] hover:bg-purple-800/30 p-3 rounded-xl transition">

                  <FaEdit className="text-purple-400" />

                </button>

                <button className="bg-[#111122] hover:bg-red-700/20 p-3 rounded-xl transition">

                  <FaTrash className="text-red-400" />

                </button>

              </div>

            </div>

            {/* Details */}
            <div className="bg-[#111122] rounded-2xl p-5">

              <p className="text-lg font-semibold mb-2">
                {item.user}
              </p>

              <p className="text-gray-400 mb-4">
                {item.phone}
              </p>

              <p className="text-gray-300 leading-7">
                {item.address}
              </p>

            </div>

          </div>
        ))}

      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Address;
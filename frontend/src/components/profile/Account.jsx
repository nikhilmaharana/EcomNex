import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { getProfileImage } from "../../lib/api";

import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";

import Footer from "../../Footer";
import Navbar from "../Navbar";

const Account = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-[#050507] via-[#0b0b1a] to-[#0a0a14] text-white px-4 py-20">

        <h1 className="text-4xl font-bold text-center text-purple-400 mb-10">
          My Account
        </h1>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">

          {/* LEFT PROFILE */}
          <div className="bg-[#0b0b1a] border border-purple-900/20 rounded-3xl p-6 flex flex-col items-center shadow-xl shadow-purple-900/20">

            <img
              src={getProfileImage(user)}
              alt={user?.name ? `${user.name} profile image` : "Profile image"}
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-700"
            />

            <h2 className="text-2xl font-semibold mt-5">
              {user.name}
            </h2>

            <p className="text-gray-400 mt-1">
              Premium Member
            </p>

          </div>

          {/* RIGHT DETAILS */}
          <div className="md:col-span-2 flex flex-col gap-6">

            {/* Personal Info */}
            <div className="bg-[#0b0b1a] border border-purple-900/20 rounded-3xl p-6 shadow-xl shadow-purple-900/20">

              <h2 className="text-2xl font-semibold text-purple-400 mb-6">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                <div className="bg-[#111122] p-5 rounded-2xl">
                  <p className="flex items-center gap-2 text-purple-400 mb-2">
                    <FaUser />
                    Full Name
                  </p>

                  <p className="text-gray-300">
                    {user.name}
                  </p>
                </div>

                <div className="bg-[#111122] p-5 rounded-2xl">
                  <p className="flex items-center gap-2 text-purple-400 mb-2">
                    <FaEnvelope />
                    Email
                  </p>

                  <p className="text-gray-300">
                    {user.email}
                  </p>
                </div>

                <div className="bg-[#111122] p-5 rounded-2xl">
                  <p className="flex items-center gap-2 text-purple-400 mb-2">
                    <FaPhone />
                    Phone
                  </p>

                  <p className="text-gray-300">
                    {user.phone}
                  </p>
                </div>

                <div className="bg-[#111122] p-5 rounded-2xl">
                  <p className="flex items-center gap-2 text-purple-400 mb-2">
                    <FaMapMarkerAlt />
                    Location
                  </p>

                  <p className="text-gray-300">
                    {user.location}
                  </p>
                </div>

              </div>
            </div>

            {/* Address */}
            <div className="bg-[#0b0b1a] border border-purple-900/20 rounded-3xl p-6 shadow-xl shadow-purple-900/20">

              <h2 className="text-2xl font-semibold text-purple-400 mb-5">
                Saved Address
              </h2>

              <div className="bg-[#111122] p-5 rounded-2xl text-gray-300 leading-7">
                {user.address}
              </div>

            </div>

          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Account;

// ========================= SELLER SIGNUP =========================
// File: SellerSignup.jsx

import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { apiUrl } from "../../../lib/api";
import Navbar from "../../Navbar";

export default function SellerSignup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const businessName = e.target.businessName.value.trim();
    const email = e.target.email.value.trim();
    const phone = e.target.phone.value.trim();
    const gst = e.target.gst.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword =
      e.target.confirmPassword.value.trim();

    // VALIDATION
    if (
      !businessName ||
      !email ||
      !phone ||
      !gst ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter valid email");
      return;
    }

    if (phone.length < 10) {
      setError("Enter valid phone number");
      return;
    }

    if (gst.length < 5) {
      setError("Enter valid GST number");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(apiUrl("/auth/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          email,
          phone,
          gst,
          password,
          role: "seller",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Seller signup failed");

      setError("");
      navigate("/sellerlogin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen pt-24 flex items-center justify-center bg-linear-to-br from-[#0f0f1b] via-[#1a1a2e] to-[#0f0f1b] text-white px-4">

      <Navbar />

      {/* Glow Effect */}
      <div className="hidden md:block absolute w-125 h-125 bg-purple-600 opacity-20 blur-3xl rounded-full top-10 left-10"></div>

      <div className="w-full max-w-md">
        <div className="bg-[#1c1c2e]/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10">

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-center mb-2">
            Signup
          </h2>

          <p className="text-gray-400 text-center text-sm mb-6">
            Register your business account
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* BUSINESS NAME */}
            <input
              name="businessName"
              placeholder="Business Name"
              className="w-full px-4 py-2 rounded-lg bg-[#2a2a40] outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* EMAIL */}
            <input
              name="email"
              type="email"
              placeholder="Business Email"
              className="w-full px-4 py-2 rounded-lg bg-[#2a2a40] outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* PHONE */}
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-2 rounded-lg bg-[#2a2a40] outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* GST */}
            <input
              name="gst"
              placeholder="GST Number"
              className="w-full px-4 py-2 rounded-lg bg-[#2a2a40] outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 pr-10 rounded-lg bg-[#2a2a40] outline-none focus:ring-2 focus:ring-purple-500"
              />

              <span
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
            </div>

            {/* CONFIRM PASSWORD */}
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 rounded-lg bg-[#2a2a40] outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* ERROR */}
            {error && (
              <p className="text-red-400 text-sm">
                {error}
              </p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-linear-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition font-semibold"
            >
              Register Seller
            </button>
          </form>

          {/* FOOTER */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already registered?{" "}
            <Link
              to="/sellerlogin"
              className="text-purple-400 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

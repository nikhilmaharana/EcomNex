import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { apiUrl } from "../../../lib/api";
import Navbar from "../../Navbar";

export default function UserSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "seller" ? "seller" : "buyer";

  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword =
      e.target.confirmPassword.value.trim();

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      name,
      email,
      password,
      role,
    };

    if (role === "seller") {
      const businessName = e.target.businessName.value.trim();
      const phone = e.target.phone.value.trim();
      const gst = e.target.gst.value.trim();

      if (!businessName || !phone || !gst) {
        setError("Business name, phone and GST are required for sellers");
        return;
      }

      payload.businessName = businessName;
      payload.phone = phone;
      payload.gst = gst;
    }

    try {
      const res = await fetch(apiUrl("/auth/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      navigate(role === "seller" ? "/sellerlogin" : "/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen pt-24 flex items-center justify-center bg-linear-to-br from-[#0f0f1b] via-[#1a1a2e] to-[#0f0f1b] text-white px-4">

      <Navbar />
      <div className="w-full max-w-md">
        <div className="bg-[#1c1c2e]/80 p-8 rounded-2xl border border-white/10">

          <h2 className="text-2xl font-bold text-center mb-6">
            {role === "seller" ? "Seller Signup" : "Buyer Signup"}
          </h2>

          <div className="flex gap-4 justify-center mb-4">
            {[
              { key: "buyer", label: "Buyer" },
              { key: "seller", label: "Seller" },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setRole(option.key)}
                className={`px-4 py-2 rounded-full transition ${
                  role === option.key
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 text-gray-200 hover:bg-white/20"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-lg bg-[#2a2a40]"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-lg bg-[#2a2a40]"
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 pr-10 rounded-lg bg-[#2a2a40]"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {role === "seller" && (
              <>
                <input
                  name="businessName"
                  placeholder="Business Name"
                  className="w-full px-4 py-2 rounded-lg bg-[#2a2a40]"
                />

                <input
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full px-4 py-2 rounded-lg bg-[#2a2a40]"
                />

                <input
                  name="gst"
                  placeholder="GST Number"
                  className="w-full px-4 py-2 rounded-lg bg-[#2a2a40]"
                />
              </>
            )}

            <div className="relative">
              <input
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                className="w-full px-4 py-2 pr-10 rounded-lg bg-[#2a2a40]"
              />

              <span
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-linear-to-r from-purple-500 to-indigo-500"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to={role === "seller" ? "/sellerlogin" : "/login"}
              className="text-purple-400"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

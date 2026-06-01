import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { apiUrl, saveCurrentUser } from "../../../lib/api";
import { UserContext } from "../../../context/UserContext";
import Navbar from "../../Navbar";

export default function SellerLogin() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
      const res = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "seller" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Seller login failed");

      const normalizedUser = saveCurrentUser({ ...data.user, token: data.token });
      if (normalizedUser) {
        setUser(normalizedUser);
      }
      navigate("/seller");
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
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

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

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-linear-to-r from-purple-500 to-indigo-500"
            >
              Seller Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don’t have seller account?{" "}
            <Link
              to="/sellersignup"
              className="text-purple-400"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { apiUrl, saveCurrentUser } from "../../../lib/api";
import { UserContext } from "../../../context/UserContext";
import Navbar from "../../Navbar";

export default function UserLogin() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    const email =
      e.target.email.value.trim();

    const password =
      e.target.password.value.trim();

    if (!email || !password) {

      setError("All fields are required");

      return;
    }

    try {
      const res = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "buyer" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const normalizedUser = saveCurrentUser({ ...data.user, token: data.token });
      if (normalizedUser) {
        setUser(normalizedUser);
      }

      setError("");
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen pt-24 flex items-center justify-center bg-linear-to-br from-[#0f0f1b] via-[#1a1a2e] to-[#0f0f1b] text-white px-4">

      <Navbar />
      {/* Glow */}
      <div className="absolute w-100 h-100 bg-purple-600 opacity-20 blur-3xl rounded-full top-10 left-10"></div>

      <div className="w-full max-w-md">

        <div className="bg-[#1c1c2e]/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10">

          <h2 className="text-2xl font-bold text-center mb-2">
            Login
          </h2>

          <p className="text-gray-400 text-center text-sm mb-6">
            Login to continue shopping
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">

            <div className="flex-1 h-px bg-gray-700"></div>

            <span className="text-gray-400 text-sm">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-700"></div>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <input
              name="email"
              type="email"
              placeholder="Email"
              className="
                w-full px-4 py-3
                rounded-xl
                bg-[#2a2a40]
                outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            />

            {/* PASSWORD */}
            <div className="relative">

              <input
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                className="
                  w-full px-4 py-3 pr-10
                  rounded-xl
                  bg-[#2a2a40]
                  outline-none
                  focus:ring-2
                  focus:ring-purple-500
                "
              />

              <span
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  cursor-pointer text-gray-400
                "
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-400 text-sm">
                {error}
              </p>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="
                w-full py-3 rounded-xl
                bg-linear-to-r
                from-purple-500
                to-indigo-500
                hover:opacity-90
                transition
                font-semibold
              "
            >
              Login
            </button>

          </form>

          {/* FOOTER */}
          <p className="mt-6 text-center text-sm text-gray-400">

            Don’t have an account?{" "}

            <Link
              to="/signup"
              className="
                text-purple-400
                hover:underline
              "
            >
              Sign Up
            </Link>

          </p>

        </div>
      </div>
    </main>
  );
}

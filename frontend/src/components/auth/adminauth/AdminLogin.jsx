import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl, saveCurrentUser } from "../../../lib/api";
import { UserContext } from "../../../context/UserContext";
import Navbar from "../../Navbar";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
      const res = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "admin" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Admin login failed");

      const normalizedUser = saveCurrentUser({ ...data.user, token: data.token });
      if (normalizedUser) {
        setUser(normalizedUser);
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen pt-24 flex items-center justify-center bg-[#050816] text-white px-4">
      <div className="w-full max-w-md">
        <Navbar />
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl p-8 space-y-4"
        >
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>

          <input
            name="email"
            type="email"
            placeholder="Admin Email"
            className="w-full px-4 py-3 rounded-xl bg-[#1f2937] outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-[#1f2937] outline-none"
          />

          {error && <p className="text-red-300 text-sm">{error}</p>}

          <button className="w-full rounded-xl bg-purple-600 py-3 font-semibold hover:bg-purple-700">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}

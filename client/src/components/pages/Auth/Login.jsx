import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    // VALIDATION
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");

    // Navigate AFTER validation
    navigate("/store");
  };

  return (
    <main className="auth">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-sub">Login to continue shopping</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <input name="email" type="email" placeholder="Email" />

            {/* PASSWORD FIELD */}
            <div className="password-field">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />

              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="auth-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>

            {/* FIXED BUTTON */}
            <button type="submit" className="btn full">
              Login
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </main>
  );
}
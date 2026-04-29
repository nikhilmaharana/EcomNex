import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./SignUp.css";

export function Signup() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();

    // VALIDATION
    if (!name || !email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    // Redirect after success
    navigate("/login");
  };

  return (
    <main className="auth">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-sub">Start your shopping journey</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <input name="name" placeholder="Full Name" />

            <input name="email" type="email" placeholder="Email" />

            {/* PASSWORD */}
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

            {/* CONFIRM PASSWORD */}
            <div className="password-field">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
              />
              <span
                className="eye-icon"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="btn full">
              Sign Up
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="link">
              Login
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
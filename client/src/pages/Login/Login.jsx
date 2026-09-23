import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login({
        email,
        password,
      });

      if (data.success) {
        navigate("/");
      }
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="aeloria-login">
      <div className="aeloria-login-container">

        {/* LEFT SIDE */}
        <section className="aeloria-login-info">
          <div className="aeloria-login-brand">
            <div className="aeloria-login-brand-icon">A</div>

            <div>
              <h2>AELORIA</h2>
              <span>Learn. Practice. Build.</span>
            </div>
          </div>

          <div className="aeloria-login-info-content">
            <span className="aeloria-login-label">
              WELCOME BACK
            </span>

            <h1>
              Continue Your
              <span> Learning Journey.</span>
            </h1>

            <p>
              Login to access your courses, practice problems,
              progress, notes, and Aeloria AI.
            </p>

            <div className="aeloria-login-benefits">

              <div className="aeloria-login-benefit">
                <span>✓</span>
                <p>Track your learning progress</p>
              </div>

              <div className="aeloria-login-benefit">
                <span>✓</span>
                <p>Access courses and free resources</p>
              </div>

              <div className="aeloria-login-benefit">
                <span>✓</span>
                <p>Get help from Aeloria AI</p>
              </div>

            </div>
          </div>
        </section>

        {/* LOGIN CARD */}
        <section className="aeloria-login-form-section">
          <div className="aeloria-login-card">

            <div className="aeloria-login-card-header">
              <h2>Welcome Back 👋</h2>
              <p>Login to your Aeloria account</p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="aeloria-login-error">
                  {error}
                </div>
              )}

              {/* EMAIL */}
              <div className="aeloria-login-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="aeloria-login-field">

                <div className="aeloria-login-password-label">
                  <label htmlFor="password">
                    Password
                  </label>

                  <Link to="/forgot-password">
                    Forgot Password?
                  </Link>
                </div>

                <div className="aeloria-login-password-wrapper">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="aeloria-login-password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "◉" : "○"}
                  </button>

                </div>
              </div>

              {/* REMEMBER */}
              <label className="aeloria-login-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              {/* SUBMIT */}
              <button
                type="submit"
                className="aeloria-login-submit"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login to Aeloria"}

                <span>
                  {loading ? "..." : "→"}
                </span>
              </button>

            </form>

            <div className="aeloria-login-divider">
              <span>OR</span>
            </div>

            <div className="aeloria-login-register">
              <p>
                Don't have an account?

                <Link to="/register">
                  {" "}Create Account
                </Link>
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}

export default Login;
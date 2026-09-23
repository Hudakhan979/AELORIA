import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

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
      const data = await adminLogin({
        email,
        password,
      });

      if (data.success) {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setError(
        error.message || "Admin login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="aeloria-admin-login">
      <div className="aeloria-admin-login-container">

        {/* LEFT SIDE */}
        <section className="aeloria-admin-login-info">

          <div className="aeloria-admin-login-brand">
            <div className="aeloria-admin-login-brand-icon">
              A
            </div>

            <div>
              <h2>AELORIA</h2>
              <span>Admin Panel</span>
            </div>
          </div>

          <div className="aeloria-admin-login-info-content">

            <span className="aeloria-admin-login-label">
              ADMINISTRATOR ACCESS
            </span>

            <h1>
              Manage
              <span> AELORIA.</span>
            </h1>

            <p>
              Manage courses, tutorials, notes, practice problems,
              categories, users, and learning resources from one place.
            </p>

            <div className="aeloria-admin-login-features">

              <div>
                <span>✓</span>
                <p>Manage learning content</p>
              </div>

              <div>
                <span>✓</span>
                <p>Manage users and mentors</p>
              </div>

              <div>
                <span>✓</span>
                <p>Publish or save content as draft</p>
              </div>

            </div>
          </div>
        </section>

        {/* LOGIN FORM */}
        <section className="aeloria-admin-login-form-section">

          <div className="aeloria-admin-login-card">

            <div className="aeloria-admin-login-card-icon">
              ✦
            </div>

            <div className="aeloria-admin-login-header">
              <span>SECURE ACCESS</span>
              <h2>Admin Login</h2>
              <p>
                Sign in to access the Aeloria Admin Panel
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* ERROR */}
              {error && (
                <div className="aeloria-admin-login-error">
                  {error}
                </div>
              )}

              {/* EMAIL */}
              <div className="aeloria-admin-login-field">

                <label htmlFor="adminEmail">
                  Admin Email
                </label>

                <input
                  id="adminEmail"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />

              </div>

              {/* PASSWORD */}
              <div className="aeloria-admin-login-field">

                <label htmlFor="adminPassword">
                  Password
                </label>

                <div className="aeloria-admin-login-password">

                  <input
                    id="adminPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "◉" : "○"}
                  </button>

                </div>
              </div>

              {/* OPTIONS */}
              <div className="aeloria-admin-login-options">

                <label>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <Link to="/admin/forgot-password">
                  Forgot Password?
                </Link>

              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="aeloria-admin-login-submit"
                disabled={loading}
              >
                {loading
                  ? "Authenticating..."
                  : "Access Admin Panel"}

                <span>
                  {loading ? "..." : "→"}
                </span>
              </button>

            </form>

            <div className="aeloria-admin-login-security">
              <span>🔒</span>
              <p>
                Authorized administrators only
              </p>
            </div>

            <div className="aeloria-admin-login-back">
              <Link to="/login">
                ← Back to Student Login
              </Link>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}

export default AdminLogin;
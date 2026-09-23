import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    } catch (err) {
      setError(err.message || "Invalid administrator credentials or access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="aeloria-admin-login">
      <div className="aeloria-admin-login-container">
        {/* LEFT SIDE: ADMIN BRANDING */}
        <section className="aeloria-admin-login-info">
          <div className="aeloria-admin-login-brand">
            <div className="aeloria-admin-login-brand-icon">
              🛡️
            </div>

            <div>
              <h2>AELORIA</h2>
              <span className="aeloria-admin-portal-tag">ADMIN PORTAL</span>
            </div>
          </div>

          <div className="aeloria-admin-login-info-content">
            <span className="aeloria-admin-login-label">
              RESTRICTED CONSOLE
            </span>

            <h1>
              Management &amp; <span>Control.</span>
            </h1>

            <p>
              Administrative access to author curriculum, publish coding challenges,
              manage revision notes, configure languages, and monitor platform metrics.
            </p>

            <div className="aeloria-admin-login-features">
              <div>
                <span>🛡️</span>
                <p>Role-governed administrative controls</p>
              </div>

              <div>
                <span>📚</span>
                <p>Course, tutorial &amp; practice problem CMS</p>
              </div>

              <div>
                <span>👥</span>
                <p>User account management &amp; role assignments</p>
              </div>

              <div>
                <span>⚡</span>
                <p>Real-time content publishing &amp; draft states</p>
              </div>
            </div>
          </div>

          <div className="aeloria-admin-security-badge">
            <span className="security-dot"></span>
            <span>256-Bit Encrypted Admin Session</span>
          </div>
        </section>

        {/* RIGHT SIDE: ADMIN AUTH FORM */}
        <section className="aeloria-admin-login-form-section">
          <div className="aeloria-admin-login-card">
            <div className="aeloria-admin-card-badge">
              <span className="admin-lock-icon">🔒</span>
              SECURE ACCESS
            </div>

            <div className="aeloria-admin-login-header">
              <h2>Administrator Sign In</h2>
              <p>
                Secure access to the AELORIA management portal.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* ERROR ALERT */}
              {error && (
                <div className="aeloria-admin-login-error">
                  <span className="err-icon">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* EMAIL */}
              <div className="aeloria-admin-login-field">
                <label htmlFor="adminEmail">
                  Administrator Email
                </label>

                <input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@aeloria.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              {/* PASSWORD */}
              <div className="aeloria-admin-login-field">
                <label htmlFor="adminPassword">
                  Master Password
                </label>

                <div className="aeloria-admin-login-password">
                  <input
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="admin-pw-toggle"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="aeloria-admin-login-submit"
                disabled={loading}
              >
                {loading ? "Authenticating Admin..." : "Sign In to Portal →"}
              </button>
            </form>

            <div className="aeloria-admin-login-security">
              <span className="shield-icon">🛡️</span>
              <p>
                Authorized personnel only. All access attempts are authenticated
                and monitored.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminLogin;
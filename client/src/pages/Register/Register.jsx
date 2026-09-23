import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (data.success) {
        navigate("/");
      }
    } catch (error) {
      setError(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="aeloria-register">
      <div className="aeloria-register-container">

        {/* LEFT SIDE */}
        <section className="aeloria-register-info">

          <div className="aeloria-register-brand">
            <div className="aeloria-register-brand-icon">
              A
            </div>

            <div>
              <h2>AELORIA</h2>
              <span>Learn. Practice. Build.</span>
            </div>
          </div>

          <div className="aeloria-register-info-content">

            <span className="aeloria-register-label">
              START YOUR JOURNEY
            </span>

            <h1>
              Build Skills.
              <span> Build Your Future.</span>
            </h1>

            <p>
              Create your Aeloria account and start learning
              programming, practicing DSA, exploring resources,
              and getting help from AI.
            </p>

            <div className="aeloria-register-benefits">

              <div className="aeloria-register-benefit">
                <span>✓</span>
                <p>Access structured programming courses</p>
              </div>

              <div className="aeloria-register-benefit">
                <span>✓</span>
                <p>Practice coding and DSA problems</p>
              </div>

              <div className="aeloria-register-benefit">
                <span>✓</span>
                <p>Learn with Aeloria AI</p>
              </div>

              <div className="aeloria-register-benefit">
                <span>✓</span>
                <p>Track your learning progress</p>
              </div>

            </div>
          </div>
        </section>

        {/* REGISTER FORM */}
        <section className="aeloria-register-form-section">

          <div className="aeloria-register-card">

            <div className="aeloria-register-card-header">
              <h2>Create Account 🚀</h2>
              <p>Join Aeloria and start learning today</p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* ERROR */}
              {error && (
                <div className="aeloria-register-error">
                  {error}
                </div>
              )}

              {/* FIRST + LAST NAME */}
              <div className="aeloria-register-row">

                <div className="aeloria-register-field">
                  <label htmlFor="firstName">
                    First Name
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="aeloria-register-field">
                  <label htmlFor="lastName">
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              {/* EMAIL */}
              <div className="aeloria-register-field">

                <label htmlFor="registerEmail">
                  Email Address
                </label>

                <input
                  id="registerEmail"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* PASSWORD */}
              <div className="aeloria-register-field">

                <label htmlFor="registerPassword">
                  Password
                </label>

                <div className="aeloria-register-password-wrapper">

                  <input
                    id="registerPassword"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="aeloria-register-password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "◉" : "○"}
                  </button>

                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="aeloria-register-field">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="aeloria-register-password-wrapper">

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="aeloria-register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? "◉" : "○"}
                  </button>

                </div>
              </div>

              {/* TERMS */}
              <label className="aeloria-register-terms">

                <input
                  type="checkbox"
                  required
                />

                <span>
                  I agree to the Aeloria{" "}
                  <Link to="/terms">
                    Terms & Conditions
                  </Link>
                  {" "}and{" "}
                  <Link to="/privacy">
                    Privacy Policy
                  </Link>
                  .
                </span>

              </label>

              {/* SUBMIT */}
              <button
                type="submit"
                className="aeloria-register-submit"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create My Account"}

                <span>
                  {loading ? "..." : "→"}
                </span>
              </button>

            </form>

            <div className="aeloria-register-divider">
              <span>OR</span>
            </div>

            <div className="aeloria-register-login">
              <p>
                Already have an account?

                <Link to="/login">
                  {" "}Login
                </Link>
              </p>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}

export default Register;
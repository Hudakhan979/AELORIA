import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  getAdminUserById,
  updateAdminUser,
} from "../../../services/api";
import "./EditUser.css";

const EditUser = () => {
  const { userId } = useParams();
  const { admin, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "student",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && (!admin || !token)) {
      navigate("/admin/login");
    }
  }, [admin, token, authLoading, navigate]);

  useEffect(() => {
    if (admin && token && userId) {
      fetchUser();
    }
  }, [admin, token, userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUserById(userId, token);

      const user = response?.data || response?.user || response;

      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "student",
        isActive: user.isActive ?? true,
      });
    } catch (err) {
      setError(err.message || "Failed to load user.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.firstName.trim()) {
        setError("First name is required.");
        return;
      }

      if (!formData.lastName.trim()) {
        setError("Last name is required.");
        return;
      }

      if (!formData.email.trim()) {
        setError("Email is required.");
        return;
      }

      const response = await updateAdminUser(
        userId,
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          role: formData.role,
          isActive: formData.isActive,
        },
        token
      );

      if (response?.success !== false) {
        setSuccess("User updated successfully.");

        setTimeout(() => {
          navigate("/admin/users");
        }, 700);
      }
    } catch (err) {
      setError(err.message || "Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="aeloria-edit-user-loading">
        <div className="aeloria-edit-user-spinner"></div>
        <p>Loading user...</p>
      </div>
    );
  }

  return (
    <div className="aeloria-edit-user-page">
      {/* Sidebar */}
      <aside className="aeloria-edit-user-sidebar">
        <div className="aeloria-edit-user-sidebar-logo">
          <div className="aeloria-edit-user-logo-icon">A</div>

          <div>
            <h2>AELORIA</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="aeloria-edit-user-sidebar-nav">
          <Link
            to="/admin/dashboard"
            className="aeloria-edit-user-nav-item"
          >
            <span>📊</span>
            Dashboard
          </Link>

          <Link
            to="/admin/courses"
            className="aeloria-edit-user-nav-item"
          >
            <span>📚</span>
            Courses
          </Link>

          <Link
            to="/admin/tutorials"
            className="aeloria-edit-user-nav-item"
          >
            <span>📖</span>
            Tutorials
          </Link>

          <Link
            to="/admin/notes"
            className="aeloria-edit-user-nav-item"
          >
            <span>📝</span>
            Notes
          </Link>

          <Link
            to="/admin/practice"
            className="aeloria-edit-user-nav-item"
          >
            <span>💻</span>
            Practice
          </Link>

          <Link
            to="/admin/categories"
            className="aeloria-edit-user-nav-item"
          >
            <span>🗂️</span>
            Categories
          </Link>

          <Link
            to="/admin/languages"
            className="aeloria-edit-user-nav-item"
          >
            <span>🌐</span>
            Languages
          </Link>

          <Link
            to="/admin/users"
            className="aeloria-edit-user-nav-item active"
          >
            <span>👥</span>
            Users
          </Link>
        </nav>

        <Link
          to="/admin/users"
          className="aeloria-edit-user-back-link"
        >
          ← Back to Users
        </Link>
      </aside>

      {/* Main */}
      <main className="aeloria-edit-user-main">
        <div className="aeloria-edit-user-header">
          <div>
            <p className="aeloria-edit-user-breadcrumb">
              Admin / Users / Edit User
            </p>

            <h1>Edit User</h1>

            <p>
              Update user account information and access settings.
            </p>
          </div>

          <Link
            to="/admin/users"
            className="aeloria-edit-user-cancel-top"
          >
            ← Back to Users
          </Link>
        </div>

        {/* Form Card */}
        <section className="aeloria-edit-user-card">
          <div className="aeloria-edit-user-card-header">
            <div className="aeloria-edit-user-profile-preview">
              <div className="aeloria-edit-user-avatar">
                {formData.firstName?.charAt(0)?.toUpperCase() || "U"}
                {formData.lastName?.charAt(0)?.toUpperCase() || ""}
              </div>

              <div>
                <h2>
                  {formData.firstName || "User"}{" "}
                  {formData.lastName || ""}
                </h2>

                <p>{formData.email || "user@email.com"}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="aeloria-edit-user-message error">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="aeloria-edit-user-message success">
              <span>✓</span>
              <p>{success}</p>
            </div>
          )}

          <form
            className="aeloria-edit-user-form"
            onSubmit={handleSubmit}
          >
            <div className="aeloria-edit-user-section">
              <div className="aeloria-edit-user-section-title">
                <h3>Personal Information</h3>
                <p>Update the user's basic information.</p>
              </div>

              <div className="aeloria-edit-user-grid">
                <div className="aeloria-edit-user-field">
                  <label htmlFor="firstName">
                    First Name
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                </div>

                <div className="aeloria-edit-user-field">
                  <label htmlFor="lastName">
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </div>

                <div className="aeloria-edit-user-field full">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            <div className="aeloria-edit-user-section">
              <div className="aeloria-edit-user-section-title">
                <h3>Account Settings</h3>
                <p>Manage role and account access.</p>
              </div>

              <div className="aeloria-edit-user-grid">
                <div className="aeloria-edit-user-field">
                  <label htmlFor="role">
                    User Role
                  </label>

                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="aeloria-edit-user-field">
                  <label>Account Status</label>

                  <label className="aeloria-edit-user-status-toggle">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />

                    <span className="aeloria-edit-user-toggle-slider"></span>

                    <span className="aeloria-edit-user-toggle-text">
                      {formData.isActive
                        ? "Active Account"
                        : "Inactive Account"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="aeloria-edit-user-warning">
              <span>ℹ️</span>

              <div>
                <strong>Important</strong>
                <p>
                  Changing a user's role or account status
                  affects their access to the AELORIA platform.
                </p>
              </div>
            </div>

            <div className="aeloria-edit-user-actions">
              <Link
                to="/admin/users"
                className="aeloria-edit-user-cancel"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="aeloria-edit-user-save"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default EditUser;
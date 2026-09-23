import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAdminCategories,
  updateCategory,
} from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import "./EditCategory.css";

const categoryTypes = [
  "programming",
  "development",
  "data-structures",
  "ai-ml",
  "cs-subject",
  "other",
];

const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { admin, token, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    image: "",
    type: "programming",
    order: 0,
    status: "draft",
    isFeatured: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    const loadCategory = async () => {
      if (!admin || !token || !categoryId) return;

      try {
        setLoading(true);
        setError("");

        const response = await getAdminCategories(token);

        const categories =
          response?.categories ||
          response?.data ||
          (Array.isArray(response) ? response : []);

        const category = categories.find(
          (item) => item._id === categoryId
        );

        if (!category) {
          setError("Category not found.");
          return;
        }

        setFormData({
          name: category.name || "",
          slug: category.slug || "",
          description: category.description || "",
          icon: category.icon || "",
          image: category.image || "",
          type: category.type || "programming",
          order: category.order ?? 0,
          status: category.status || "draft",
          isFeatured: Boolean(category.isFeatured),
        });
      } catch (err) {
        setError(err.message || "Failed to load category.");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [admin, token, categoryId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setFormData((prev) => ({
      ...prev,
      slug,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateCategory(
        categoryId,
        {
          ...formData,
          name: formData.name.trim(),
          slug:
            formData.slug.trim() ||
            formData.name
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
          order: Number(formData.order) || 0,
        },
        token
      );

      navigate("/admin/categories");
    } catch (err) {
      setError(err.message || "Failed to update category.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="aeloria-edit-category-loading">
        <div className="aeloria-edit-category-spinner"></div>
        <p>Loading category...</p>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="aeloria-edit-category-page">
      <aside className="aeloria-edit-category-sidebar">
        <Link
          to="/admin/dashboard"
          className="aeloria-edit-category-logo"
        >
          <span className="aeloria-edit-category-logo-icon">
            A
          </span>

          <div>
            <strong>AELORIA</strong>
            <small>Admin Panel</small>
          </div>
        </Link>

        <nav className="aeloria-edit-category-nav">
          <Link to="/admin/dashboard">📊 Dashboard</Link>
          <Link to="/admin/courses">📚 Courses</Link>
          <Link to="/admin/tutorials">📖 Tutorials</Link>
          <Link to="/admin/notes">📝 Notes</Link>
          <Link to="/admin/practice">💻 Practice</Link>

          <Link
            to="/admin/categories"
            className="aeloria-edit-category-nav-active"
          >
            🗂️ Categories
          </Link>

          <Link to="/admin/languages">🌐 Languages</Link>
          <Link to="/admin/users">👥 Users</Link>
        </nav>
      </aside>

      <main className="aeloria-edit-category-main">
        <div className="aeloria-edit-category-topbar">
          <div>
            <Link
              to="/admin/categories"
              className="aeloria-edit-category-back"
            >
              ← Back to Categories
            </Link>

            <p className="aeloria-edit-category-eyebrow">
              CONTENT MANAGEMENT
            </p>

            <h1>Edit Category</h1>

            <p>
              Update the category information used across AELORIA.
            </p>
          </div>
        </div>

        {error && (
          <div className="aeloria-edit-category-error">
            {error}
          </div>
        )}

        <form
          className="aeloria-edit-category-form"
          onSubmit={handleSubmit}
        >
          <section className="aeloria-edit-category-card">
            <div className="aeloria-edit-category-card-header">
              <div>
                <h2>Basic Information</h2>
                <p>Update the category's main details.</p>
              </div>
            </div>

            <div className="aeloria-edit-category-grid">
              <div className="aeloria-edit-category-field">
                <label>Category Name *</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Programming"
                  required
                />
              </div>

              <div className="aeloria-edit-category-field">
                <label>Slug</label>

                <div className="aeloria-edit-category-slug-row">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="programming"
                  />

                  <button
                    type="button"
                    onClick={generateSlug}
                    className="aeloria-edit-category-generate"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="aeloria-edit-category-field">
                <label>Type</label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  {categoryTypes.map((type) => (
                    <option key={type} value={type}>
                      {type
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1)
                        )
                        .join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="aeloria-edit-category-field">
                <label>Display Order</label>

                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="aeloria-edit-category-field">
                <label>Icon</label>

                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="💻"
                />
              </div>

              <div className="aeloria-edit-category-field">
                <label>Image URL</label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="aeloria-edit-category-field">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="aeloria-edit-category-checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />

                  <span>Featured Category</span>
                </label>
              </div>

              <div className="aeloria-edit-category-field aeloria-edit-category-full">
                <label>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Describe this learning category..."
                />
              </div>
            </div>
          </section>

          <div className="aeloria-edit-category-actions">
            <Link
              to="/admin/categories"
              className="aeloria-edit-category-cancel"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="aeloria-edit-category-save"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditCategory;
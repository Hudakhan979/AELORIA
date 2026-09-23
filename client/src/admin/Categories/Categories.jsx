import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAdminCategories,
  createCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./Categories.css";

const initialForm = {
  name: "",
  slug: "",
  description: "",
  icon: "",
  image: "",
  type: "programming",
  order: 0,
  status: "draft",
  isFeatured: false,
};

const categoryTypes = [
  "programming",
  "development",
  "data-structures",
  "ai-ml",
  "cs-subject",
  "other",
];

const AdminCategories = () => {
  const navigate = useNavigate();
  const { admin, token, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, authLoading, navigate]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminCategories(token);

      const categoryData =
        response?.categories ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      setCategories(categoryData);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin && token) {
      loadCategories();
    }
  }, [admin, token]);

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

  const handleCreateCategory = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createCategory(
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

      setFormData(initialForm);
      setShowModal(false);

      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteCategory(id, token);
      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to delete category");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setError("");

      await toggleCategoryStatus(id, token);
      await loadCategories();
    } catch (err) {
      setError(err.message || "Failed to update category status");
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        category.name?.toLowerCase().includes(searchText) ||
        category.slug?.toLowerCase().includes(searchText) ||
        category.description?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" || category.status === statusFilter;

      const matchesType =
        typeFilter === "all" || category.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [categories, search, statusFilter, typeFilter]);

  const totalCategories = categories.length;

  const publishedCategories = categories.filter(
    (category) => category.status === "published"
  ).length;

  const draftCategories = categories.filter(
    (category) => category.status === "draft"
  ).length;

  const featuredCategories = categories.filter(
    (category) => category.isFeatured
  ).length;

  if (authLoading || !admin) {
    return (
      <div className="aeloria-admin-categories-loading">
        <div className="aeloria-admin-categories-spinner"></div>
        <p>Loading Categories...</p>
      </div>
    );
  }

  return (
    <div className="aeloria-admin-categories-page">
      <aside className="aeloria-admin-categories-sidebar">
        <Link
          to="/admin/dashboard"
          className="aeloria-admin-categories-logo"
        >
          <span className="aeloria-admin-categories-logo-icon">A</span>

          <div>
            <strong>AELORIA</strong>
            <small>Admin Panel</small>
          </div>
        </Link>

        <nav className="aeloria-admin-categories-nav">
          <Link to="/admin/dashboard">📊 Dashboard</Link>
          <Link to="/admin/courses">📚 Courses</Link>
          <Link to="/admin/tutorials">📖 Tutorials</Link>
          <Link to="/admin/notes">📝 Notes</Link>
          <Link to="/admin/practice">💻 Practice</Link>

          <Link
            to="/admin/categories"
            className="aeloria-admin-categories-nav-active"
          >
            🗂️ Categories
          </Link>

          <Link to="/admin/languages">🌐 Languages</Link>
          <Link to="/admin/users">👥 Users</Link>
        </nav>
      </aside>

      <main className="aeloria-admin-categories-main">
        <header className="aeloria-admin-categories-header">
          <div>
            <p className="aeloria-admin-categories-eyebrow">
              CONTENT MANAGEMENT
            </p>

            <h1>Categories</h1>

            <p>
              Manage learning categories used across courses, tutorials,
              notes and practice.
            </p>
          </div>

          <button
            className="aeloria-admin-categories-add-btn"
            onClick={() => {
              setError("");
              setFormData(initialForm);
              setShowModal(true);
            }}
          >
            + Add Category
          </button>
        </header>

        {error && (
          <div className="aeloria-admin-categories-error">
            {error}
          </div>
        )}

        <section className="aeloria-admin-categories-stats">
          <div className="aeloria-admin-categories-stat-card">
            <span className="aeloria-admin-categories-stat-icon">🗂️</span>
            <div>
              <strong>{totalCategories}</strong>
              <span>Total Categories</span>
            </div>
          </div>

          <div className="aeloria-admin-categories-stat-card">
            <span className="aeloria-admin-categories-stat-icon">✓</span>
            <div>
              <strong>{publishedCategories}</strong>
              <span>Published</span>
            </div>
          </div>

          <div className="aeloria-admin-categories-stat-card">
            <span className="aeloria-admin-categories-stat-icon">◷</span>
            <div>
              <strong>{draftCategories}</strong>
              <span>Drafts</span>
            </div>
          </div>

          <div className="aeloria-admin-categories-stat-card">
            <span className="aeloria-admin-categories-stat-icon">★</span>
            <div>
              <strong>{featuredCategories}</strong>
              <span>Featured</span>
            </div>
          </div>
        </section>

        <section className="aeloria-admin-categories-toolbar">
          <div className="aeloria-admin-categories-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="all">All Types</option>

            {categoryTypes.map((type) => (
              <option key={type} value={type}>
                {type
                  .split("-")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                  )
                  .join(" ")}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </section>

        <section className="aeloria-admin-categories-content">
          {loading ? (
            <div className="aeloria-admin-categories-empty">
              <div className="aeloria-admin-categories-spinner"></div>
              <p>Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="aeloria-admin-categories-empty">
              <div className="aeloria-admin-categories-empty-icon">
                🗂️
              </div>

              <h3>No categories found</h3>

              <p>
                Try changing your filters or create a new category.
              </p>

              <button
                onClick={() => {
                  setError("");
                  setFormData(initialForm);
                  setShowModal(true);
                }}
              >
                + Add Category
              </button>
            </div>
          ) : (
            <div className="aeloria-admin-categories-grid">
              {filteredCategories.map((category) => (
                <article
                  key={category._id}
                  className="aeloria-admin-category-card"
                >
                  <div className="aeloria-admin-category-card-top">
                    <div className="aeloria-admin-category-icon">
                      {category.icon || "📚"}
                    </div>

                    <span
                      className={`aeloria-admin-category-status ${
                        category.status === "published"
                          ? "aeloria-admin-category-status-published"
                          : "aeloria-admin-category-status-draft"
                      }`}
                    >
                      {category.status || "draft"}
                    </span>
                  </div>

                  <div className="aeloria-admin-category-body">
                    <div className="aeloria-admin-category-title-row">
                      <h3>{category.name}</h3>

                      {category.isFeatured && (
                        <span className="aeloria-admin-category-featured">
                          ★
                        </span>
                      )}
                    </div>

                    <p className="aeloria-admin-category-slug">
                      /{category.slug}
                    </p>

                    <p className="aeloria-admin-category-description">
                      {category.description ||
                        "No description available."}
                    </p>

                    <div className="aeloria-admin-category-meta">
                      <span>
                        Type:{" "}
                        <strong>{category.type || "other"}</strong>
                      </span>

                      <span>
                        Order: <strong>{category.order ?? 0}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="aeloria-admin-category-actions">
                    <Link
                      to={`/admin/categories/edit/${category._id}`}
                      className="aeloria-admin-category-edit"
                    >
                      ✏️ Edit
                    </Link>

                    <button
                      className="aeloria-admin-category-toggle"
                      onClick={() =>
                        handleToggleStatus(category._id)
                      }
                    >
                      {category.status === "published"
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    <button
                      className="aeloria-admin-category-delete"
                      onClick={() =>
                        handleDelete(category._id)
                      }
                    >
                      🗑️
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <div
          className="aeloria-admin-categories-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="aeloria-admin-categories-modal">
            <div className="aeloria-admin-categories-modal-header">
              <div>
                <p>CREATE NEW</p>
                <h2>Add Category</h2>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="aeloria-admin-categories-modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateCategory}>
              <div className="aeloria-admin-categories-form-grid">
                <div className="aeloria-admin-categories-field">
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

                <div className="aeloria-admin-categories-field">
                  <label>Slug</label>

                  <div className="aeloria-admin-categories-slug-row">
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
                      className="aeloria-admin-categories-generate"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div className="aeloria-admin-categories-field">
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

                <div className="aeloria-admin-categories-field">
                  <label>Order</label>

                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="aeloria-admin-categories-field">
                  <label>Icon</label>

                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="💻"
                  />
                </div>

                <div className="aeloria-admin-categories-field">
                  <label>Image URL</label>

                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="aeloria-admin-categories-field">
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

                <div className="aeloria-admin-categories-field aeloria-admin-categories-checkbox-field">
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

                <div className="aeloria-admin-categories-field aeloria-admin-categories-full-field">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe this learning category..."
                  />
                </div>
              </div>

              <div className="aeloria-admin-categories-modal-actions">
                <button
                  type="button"
                  className="aeloria-admin-categories-cancel"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="aeloria-admin-categories-save"
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
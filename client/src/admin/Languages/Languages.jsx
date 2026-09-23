import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getAdminLanguages,
  createLanguage,
  deleteLanguage,
  toggleLanguageStatus,
} from "../../services/api";
import "./Languages.css";

const AdminLanguages = () => {
  const { admin, token, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "#6D28D9",
    category: "Programming",
    order: 0,
    status: "draft",
    isFeatured: false,
  });

  useEffect(() => {
    if (authLoading) return;

    if (!admin || !token) {
      navigate("/admin/login");
      return;
    }

    fetchLanguages();
  }, [admin, token, authLoading, navigate]);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminLanguages(token);

      setLanguages(data.languages || data.data || []);
    } catch (err) {
      setError(err.message || "Failed to load languages.");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" && {
        slug: generateSlug(value),
      }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Language name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...formData,
        order: Number(formData.order) || 0,
      };

      await createLanguage(payload, token);

      setShowModal(false);

      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "",
        color: "#6D28D9",
        category: "Programming",
        order: 0,
        status: "draft",
        isFeatured: false,
      });

      await fetchLanguages();
    } catch (err) {
      setError(err.message || "Failed to create language.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this language?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteLanguage(id, token);
      await fetchLanguages();
    } catch (err) {
      setError(err.message || "Failed to delete language.");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setError("");

      await toggleLanguageStatus(id, token);
      await fetchLanguages();
    } catch (err) {
      setError(err.message || "Failed to update language status.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const filteredLanguages = languages.filter((language) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      language.name?.toLowerCase().includes(searchText) ||
      language.slug?.toLowerCase().includes(searchText) ||
      language.description?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || language.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" || language.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalLanguages = languages.length;

  const publishedLanguages = languages.filter(
    (language) => language.status === "published"
  ).length;

  const draftLanguages = languages.filter(
    (language) => language.status === "draft"
  ).length;

  const featuredLanguages = languages.filter(
    (language) => language.isFeatured
  ).length;

  const categories = [
    ...new Set(
      languages
        .map((language) => language.category)
        .filter(Boolean)
    ),
  ];

  if (authLoading || loading) {
    return (
      <div className="aeloria-admin-languages-page">
        <div className="aeloria-admin-languages-loading">
          Loading languages...
        </div>
      </div>
    );
  }

  if (!admin || !token) {
    return null;
  }

  return (
    <div className="aeloria-admin-languages-page">
      {/* HEADER */}
      <div className="aeloria-admin-languages-header">
        <div className="aeloria-admin-languages-header-left">
          <h1>Languages</h1>
          <p>
            Manage programming languages and learning categories on AELORIA.
          </p>
        </div>

        <button
          className="aeloria-admin-languages-add-btn"
          onClick={() => {
            setError("");
            setShowModal(true);
          }}
        >
          <span>＋</span>
          Add Language
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="aeloria-admin-languages-error">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="aeloria-admin-languages-stats">
        <div className="aeloria-admin-language-stat-card">
          <div className="aeloria-admin-language-stat-icon">⌘</div>

          <div className="aeloria-admin-language-stat-info">
            <span>Total Languages</span>
            <strong>{totalLanguages}</strong>
          </div>
        </div>

        <div className="aeloria-admin-language-stat-card">
          <div className="aeloria-admin-language-stat-icon">✓</div>

          <div className="aeloria-admin-language-stat-info">
            <span>Published</span>
            <strong>{publishedLanguages}</strong>
          </div>
        </div>

        <div className="aeloria-admin-language-stat-card">
          <div className="aeloria-admin-language-stat-icon">◷</div>

          <div className="aeloria-admin-language-stat-info">
            <span>Drafts</span>
            <strong>{draftLanguages}</strong>
          </div>
        </div>

        <div className="aeloria-admin-language-stat-card">
          <div className="aeloria-admin-language-stat-icon">★</div>

          <div className="aeloria-admin-language-stat-info">
            <span>Featured</span>
            <strong>{featuredLanguages}</strong>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="aeloria-admin-languages-toolbar">
        <div className="aeloria-admin-languages-search">
          <input
            type="text"
            placeholder="Search languages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="aeloria-admin-languages-filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="aeloria-admin-languages-filter">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="aeloria-admin-languages-table-wrapper">
        {filteredLanguages.length === 0 ? (
          <div className="aeloria-admin-languages-empty">
            <h3>No languages found</h3>
            <p>
              Try changing your search or filters, or add a new language.
            </p>
          </div>
        ) : (
          <table className="aeloria-admin-languages-table">
            <thead>
              <tr>
                <th>Language</th>
                <th>Category</th>
                <th>Color</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLanguages.map((language) => (
                <tr key={language._id}>
                  {/* LANGUAGE */}
                  <td>
                    <div className="aeloria-admin-language-info">
                      <div
                        className="aeloria-admin-language-icon"
                        style={{
                          backgroundColor: `${language.color || "#6D28D9"}20`,
                          color: language.color || "#6D28D9",
                        }}
                      >
                        {language.icon || language.name?.charAt(0)}
                      </div>

                      <div>
                        <div className="aeloria-admin-language-name">
                          {language.name}
                        </div>

                        <div className="aeloria-admin-language-slug">
                          /{language.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td>
                    <span className="aeloria-admin-language-category">
                      {language.category || "Programming"}
                    </span>
                  </td>

                  {/* COLOR */}
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "6px",
                          background: language.color || "#6D28D9",
                          border: "1px solid #ddd",
                          display: "inline-block",
                        }}
                      />

                      <span>{language.color || "#6D28D9"}</span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`aeloria-admin-language-status ${
                        language.status === "published"
                          ? "published"
                          : "draft"
                      }`}
                    >
                      {language.status === "published"
                        ? "Published"
                        : "Draft"}
                    </span>
                  </td>

                  {/* FEATURED */}
                  <td>
                    {language.isFeatured ? (
                      <span className="aeloria-admin-language-featured">
                        ★ Featured
                      </span>
                    ) : (
                      <span style={{ color: "#9ca3af" }}>—</span>
                    )}
                  </td>

                  {/* ORDER */}
                  <td>{language.order ?? 0}</td>

                  {/* ACTIONS */}
                  <td>
                    <div className="aeloria-admin-language-actions">
                      <Link
                        to={`/admin/languages/edit/${language._id}`}
                        className="aeloria-admin-language-action-btn"
                        title="Edit"
                      >
                        ✎
                      </Link>

                      <button
                        className={`aeloria-admin-language-action-btn ${
                          language.status === "published" ? "publish" : ""
                        }`}
                        title={
                          language.status === "published"
                            ? "Unpublish"
                            : "Publish"
                        }
                        onClick={() => handleToggleStatus(language._id)}
                      >
                        {language.status === "published" ? "◉" : "○"}
                      </button>

                      <button
                        className="aeloria-admin-language-action-btn delete"
                        title="Delete"
                        onClick={() => handleDelete(language._id)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD LANGUAGE MODAL */}
      {showModal && (
        <div
          className="aeloria-admin-language-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="aeloria-admin-language-modal">
            {/* MODAL HEADER */}
            <div className="aeloria-admin-language-modal-header">
              <h2>Add New Language</h2>

              <button
                type="button"
                className="aeloria-admin-language-modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <form
              className="aeloria-admin-language-form"
              onSubmit={handleSubmit}
            >
              <div className="aeloria-admin-language-form-grid">
                {/* NAME */}
                <div className="aeloria-admin-language-form-group">
                  <label htmlFor="language-name">
                    Language Name *
                  </label>

                  <input
                    id="language-name"
                    type="text"
                    name="name"
                    placeholder="e.g. JavaScript"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* SLUG */}
                <div className="aeloria-admin-language-form-group">
                  <label htmlFor="language-slug">Slug</label>

                  <input
                    id="language-slug"
                    type="text"
                    name="slug"
                    placeholder="javascript"
                    value={formData.slug}
                    onChange={handleChange}
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="aeloria-admin-language-form-group full">
                  <label htmlFor="language-description">
                    Description
                  </label>

                  <textarea
                    id="language-description"
                    name="description"
                    placeholder="Write a short description..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* ICON */}
                <div className="aeloria-admin-language-form-group">
                  <label htmlFor="language-icon">Icon</label>

                  <input
                    id="language-icon"
                    type="text"
                    name="icon"
                    placeholder="JS / C++ / ☕"
                    value={formData.icon}
                    onChange={handleChange}
                  />
                </div>

                {/* COLOR */}
                <div className="aeloria-admin-language-form-group">
                  <label htmlFor="language-color">Color</label>

                  <input
                    id="language-color"
                    type="text"
                    name="color"
                    placeholder="#6D28D9"
                    value={formData.color}
                    onChange={handleChange}
                  />
                </div>

                {/* CATEGORY */}
                <div className="aeloria-admin-language-form-group">
                  <label htmlFor="language-category">
                    Category
                  </label>

                  <select
                    id="language-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Programming">
                      Programming
                    </option>

                    <option value="Development">
                      Development
                    </option>

                    <option value="Data Structures">
                      Data Structures
                    </option>

                    <option value="AI & ML">
                      AI & ML
                    </option>

                    <option value="Data Science">
                      Data Science
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* ORDER */}
                <div className="aeloria-admin-language-form-group">
                  <label htmlFor="language-order">Display Order</label>

                  <input
                    id="language-order"
                    type="number"
                    name="order"
                    min="0"
                    value={formData.order}
                    onChange={handleChange}
                  />
                </div>

                {/* STATUS */}
                <div className="aeloria-admin-language-form-group">
                  <label htmlFor="language-status">Status</label>

                  <select
                    id="language-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {/* FEATURED */}
                <div className="aeloria-admin-language-form-group">
                  <div className="aeloria-admin-language-checkbox">
                    <input
                      id="language-featured"
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                    />

                    <label htmlFor="language-featured">
                      Mark as Featured
                    </label>
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="aeloria-admin-language-modal-footer">
                <button
                  type="button"
                  className="aeloria-admin-language-cancel-btn"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="aeloria-admin-language-save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Create Language"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGOUT */}
      <button
        type="button"
        onClick={handleLogout}
        style={{ display: "none" }}
      >
        Logout
      </button>
    </div>
  );
};

export default AdminLanguages;
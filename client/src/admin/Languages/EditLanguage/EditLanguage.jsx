import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  getAdminLanguages,
  updateLanguage,
} from "../../../services/api";
import "./EditLanguage.css";

const EditLanguage = () => {
  const { languageId } = useParams();
  const { admin, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

    fetchLanguage();
  }, [admin, token, authLoading, languageId, navigate]);

  const fetchLanguage = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminLanguages(token);
      const languageList = data.languages || data.data || [];

      const selectedLanguage = languageList.find(
        (language) => language._id === languageId
      );

      if (!selectedLanguage) {
        setError("Language not found.");
        return;
      }

      setFormData({
        name: selectedLanguage.name || "",
        slug: selectedLanguage.slug || "",
        description: selectedLanguage.description || "",
        icon: selectedLanguage.icon || "",
        color: selectedLanguage.color || "#6D28D9",
        category: selectedLanguage.category || "Programming",
        order: selectedLanguage.order ?? 0,
        status: selectedLanguage.status || "draft",
        isFeatured: selectedLanguage.isFeatured || false,
      });
    } catch (err) {
      setError(err.message || "Failed to load language.");
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

      await updateLanguage(languageId, payload, token);

      navigate("/admin/languages");
    } catch (err) {
      setError(err.message || "Failed to update language.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="aeloria-edit-language-page">
        <div className="aeloria-edit-language-loading">
          Loading language...
        </div>
      </div>
    );
  }

  if (!admin || !token) {
    return null;
  }

  return (
    <div className="aeloria-edit-language-page">
      <div className="aeloria-edit-language-container">
        {/* HEADER */}
        <div className="aeloria-edit-language-header">
          <div>
            <button
              type="button"
              className="aeloria-edit-language-back-btn"
              onClick={() => navigate("/admin/languages")}
            >
              ← Back to Languages
            </button>

            <h1>Edit Language</h1>

            <p>
              Update the language information used across AELORIA.
            </p>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="aeloria-edit-language-error">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          className="aeloria-edit-language-form"
          onSubmit={handleSubmit}
        >
          {/* BASIC INFORMATION */}
          <div className="aeloria-edit-language-section">
            <div className="aeloria-edit-language-section-header">
              <h2>Basic Information</h2>
              <p>Update the basic details of this language.</p>
            </div>

            <div className="aeloria-edit-language-grid">
              {/* NAME */}
              <div className="aeloria-edit-language-form-group">
                <label htmlFor="edit-language-name">
                  Language Name *
                </label>

                <input
                  id="edit-language-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript"
                  required
                />
              </div>

              {/* SLUG */}
              <div className="aeloria-edit-language-form-group">
                <label htmlFor="edit-language-slug">
                  Slug
                </label>

                <input
                  id="edit-language-slug"
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="javascript"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="aeloria-edit-language-form-group full">
                <label htmlFor="edit-language-description">
                  Description
                </label>

                <textarea
                  id="edit-language-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short description..."
                />
              </div>
            </div>
          </div>

          {/* APPEARANCE */}
          <div className="aeloria-edit-language-section">
            <div className="aeloria-edit-language-section-header">
              <h2>Appearance</h2>
              <p>
                Customize how this language appears on AELORIA.
              </p>
            </div>

            <div className="aeloria-edit-language-grid">
              {/* ICON */}
              <div className="aeloria-edit-language-form-group">
                <label htmlFor="edit-language-icon">
                  Icon
                </label>

                <input
                  id="edit-language-icon"
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="JS / C++ / ☕"
                />
              </div>

              {/* COLOR */}
              <div className="aeloria-edit-language-form-group">
                <label htmlFor="edit-language-color">
                  Color
                </label>

                <div className="aeloria-edit-language-color-wrapper">
                  <input
                    id="edit-language-color"
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="#6D28D9"
                  />

                  <input
                    type="color"
                    value={formData.color || "#6D28D9"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    className="aeloria-edit-language-color-picker"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SETTINGS */}
          <div className="aeloria-edit-language-section">
            <div className="aeloria-edit-language-section-header">
              <h2>Language Settings</h2>
              <p>
                Manage category, order and publishing settings.
              </p>
            </div>

            <div className="aeloria-edit-language-grid">
              {/* CATEGORY */}
              <div className="aeloria-edit-language-form-group">
                <label htmlFor="edit-language-category">
                  Category
                </label>

                <select
                  id="edit-language-category"
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
              <div className="aeloria-edit-language-form-group">
                <label htmlFor="edit-language-order">
                  Display Order
                </label>

                <input
                  id="edit-language-order"
                  type="number"
                  name="order"
                  min="0"
                  value={formData.order}
                  onChange={handleChange}
                />
              </div>

              {/* STATUS */}
              <div className="aeloria-edit-language-form-group">
                <label htmlFor="edit-language-status">
                  Status
                </label>

                <select
                  id="edit-language-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* FEATURED */}
              <div className="aeloria-edit-language-form-group">
                <label>Featured</label>

                <label className="aeloria-edit-language-featured-toggle">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />

                  <span>
                    Show this language as featured
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="aeloria-edit-language-actions">
            <button
              type="button"
              className="aeloria-edit-language-cancel-btn"
              onClick={() => navigate("/admin/languages")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="aeloria-edit-language-save-btn"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLanguage;
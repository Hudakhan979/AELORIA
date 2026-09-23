import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getAdminTutorials,
  updateTutorial,
} from "../../../services/api";

import { useAuth } from "../../../context/AuthContext";

import "./EditTutorial.css";

const EditTutorial = () => {
  const { tutorialId } = useParams();
  const navigate = useNavigate();

  const { admin, token, loading: authLoading } = useAuth();

  const [tutorial, setTutorial] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    level: "Beginner",
    description: "",
    thumbnail: "",
    status: "draft",
    isFeatured: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // LOAD TUTORIAL
  // =========================

  const loadTutorial = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminTutorials(token);

      const tutorials =
        response?.tutorials ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      const selectedTutorial = tutorials.find(
        (item) => item._id === tutorialId
      );

      if (!selectedTutorial) {
        setError("Tutorial not found.");
        return;
      }

      setTutorial(selectedTutorial);

      setFormData({
        title: selectedTutorial.title || "",
        category: selectedTutorial.category || "",
        level: selectedTutorial.level || "Beginner",
        description: selectedTutorial.description || "",
        thumbnail: selectedTutorial.thumbnail || "",
        status: selectedTutorial.status || "draft",
        isFeatured: selectedTutorial.isFeatured || false,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load tutorial.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADMIN PROTECTION
  // =========================

  useEffect(() => {
    if (!authLoading) {
      if (!admin || !token) {
        navigate("/admin/login");
        return;
      }

      loadTutorial();
    }
  }, [admin, token, authLoading, tutorialId]);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // SAVE TUTORIAL
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Tutorial title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Tutorial description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateTutorial(
        tutorialId,
        {
          title: formData.title.trim(),
          category: formData.category.trim(),
          level: formData.level,
          description: formData.description.trim(),
          thumbnail: formData.thumbnail.trim(),
          status: formData.status,
          isFeatured: formData.isFeatured,
        },
        token
      );

      navigate("/admin/tutorials");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update tutorial.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (authLoading || loading) {
    return (
      <div className="aeloria-edit-tutorial-loading">
        <div className="aeloria-edit-tutorial-spinner"></div>
        <p>Loading tutorial...</p>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="aeloria-edit-tutorial-page">

      {/* ================= HEADER ================= */}

      <header className="aeloria-edit-tutorial-header">

        <div>
          <Link
            to="/admin/tutorials"
            className="aeloria-edit-tutorial-back"
          >
            ← Back to Tutorials
          </Link>

          <h1>Edit Tutorial</h1>

          <p>
            Update tutorial information and publishing settings.
          </p>
        </div>

        <div className="aeloria-edit-tutorial-header-actions">

          <Link
            to={`/tutorials/${tutorial?.slug || tutorialId}`}
            className="aeloria-edit-tutorial-view-btn"
          >
            👁️ View Tutorial
          </Link>

        </div>

      </header>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="aeloria-edit-tutorial-error">
          {error}
        </div>
      )}

      {/* ================= FORM ================= */}

      {!error && tutorial && (
        <form
          className="aeloria-edit-tutorial-form"
          onSubmit={handleSubmit}
        >

          {/* ================= BASIC INFORMATION ================= */}

          <section className="aeloria-edit-tutorial-card">

            <div className="aeloria-edit-tutorial-card-header">
              <div>
                <h2>Basic Information</h2>
                <p>
                  Update the main information of your tutorial.
                </p>
              </div>
            </div>

            <div className="aeloria-edit-tutorial-form-grid">

              <div className="aeloria-edit-tutorial-field full">
                <label>Tutorial Title *</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter tutorial title"
                  disabled={saving}
                />
              </div>

              <div className="aeloria-edit-tutorial-field">
                <label>Category</label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Programming"
                  disabled={saving}
                />
              </div>

              <div className="aeloria-edit-tutorial-field">
                <label>Level</label>

                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">
                    Intermediate
                  </option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="aeloria-edit-tutorial-field full">
                <label>Description *</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write tutorial description..."
                  rows="6"
                  disabled={saving}
                ></textarea>
              </div>

              <div className="aeloria-edit-tutorial-field full">
                <label>Thumbnail URL</label>

                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://example.com/tutorial-image.jpg"
                  disabled={saving}
                />
              </div>

            </div>

          </section>

          {/* ================= PUBLISHING ================= */}

          <section className="aeloria-edit-tutorial-card">

            <div className="aeloria-edit-tutorial-card-header">
              <div>
                <h2>Publishing Settings</h2>
                <p>
                  Control the visibility of this tutorial.
                </p>
              </div>
            </div>

            <div className="aeloria-edit-tutorial-publishing">

              <div className="aeloria-edit-tutorial-field">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="draft">Draft</option>
                  <option value="published">
                    Published
                  </option>
                </select>
              </div>

              <label className="aeloria-edit-tutorial-featured">

                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  disabled={saving}
                />

                <span>
                  <strong>Featured Tutorial</strong>
                  <small>
                    Show this tutorial in featured content.
                  </small>
                </span>

              </label>

            </div>

          </section>

          {/* ================= INFO ================= */}

          <section className="aeloria-edit-tutorial-card">

            <div className="aeloria-edit-tutorial-card-header">
              <div>
                <h2>Tutorial Information</h2>
                <p>
                  Current tutorial statistics.
                </p>
              </div>
            </div>

            <div className="aeloria-edit-tutorial-info-grid">

              <div>
                <span>Topics</span>
                <strong>
                  {tutorial.topics?.length || 0}
                </strong>
              </div>

              <div>
                <span>Views</span>
                <strong>
                  {tutorial.views || 0}
                </strong>
              </div>

              <div>
                <span>Category</span>
                <strong>
                  {tutorial.category || "—"}
                </strong>
              </div>

              <div>
                <span>Level</span>
                <strong>
                  {tutorial.level || "Beginner"}
                </strong>
              </div>

            </div>

          </section>

          {/* ================= ACTIONS ================= */}

          <div className="aeloria-edit-tutorial-actions">

            <Link
              to="/admin/tutorials"
              className="aeloria-edit-tutorial-cancel"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="aeloria-edit-tutorial-save"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>

          </div>

        </form>
      )}

    </div>
  );
};

export default EditTutorial;
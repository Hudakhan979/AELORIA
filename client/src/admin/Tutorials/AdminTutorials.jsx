import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getAdminTutorials,
  createTutorial,
  deleteTutorial,
  toggleTutorialStatus,
} from "../../services/api";

import { useAuth } from "../../context/AuthContext";

import "./AdminTutorials.css";

const AdminTutorials = () => {
  const navigate = useNavigate();
  const { admin, token, loading: authLoading } = useAuth();

  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    level: "Beginner",
    description: "",
  });

  // =========================
  // LOAD TUTORIALS
  // =========================
  const loadTutorials = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminTutorials(token);

      const tutorialData =
        response?.tutorials ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      setTutorials(tutorialData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load tutorials.");
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

      loadTutorials();
    }
  }, [admin, token, authLoading]);

  // =========================
  // FORM CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // CREATE TUTORIAL
  // =========================
  const handleCreateTutorial = async (e) => {
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

      await createTutorial(
        {
          title: formData.title.trim(),
          category: formData.category.trim(),
          level: formData.level,
          description: formData.description.trim(),
          status: "draft",
        },
        token
      );

      setFormData({
        title: "",
        category: "",
        level: "Beginner",
        description: "",
      });

      setShowModal(false);

      await loadTutorials();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create tutorial.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE TUTORIAL
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tutorial?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteTutorial(id, token);

      await loadTutorials();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete tutorial.");
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================
  const handleToggleStatus = async (id) => {
    try {
      setError("");

      await toggleTutorialStatus(id, token);

      await loadTutorials();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update tutorial status.");
    }
  };

  // =========================
  // FILTER DATA
  // =========================
  const filteredTutorials = tutorials.filter((tutorial) => {
    const title = tutorial.title?.toLowerCase() || "";
    const category = tutorial.category?.toLowerCase() || "";
    const searchText = search.toLowerCase();

    const matchesSearch =
      title.includes(searchText) || category.includes(searchText);

    const matchesStatus =
      statusFilter === "all" || tutorial.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" || tutorial.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // =========================
  // STATS
  // =========================
  const totalTutorials = tutorials.length;

  const publishedTutorials = tutorials.filter(
    (tutorial) => tutorial.status === "published"
  ).length;

  const draftTutorials = tutorials.filter(
    (tutorial) => tutorial.status === "draft"
  ).length;

  const categories = [
    ...new Set(
      tutorials
        .map((tutorial) => tutorial.category)
        .filter(Boolean)
    ),
  ];

  // =========================
  // LOADING
  // =========================
  if (authLoading || loading) {
    return (
      <div className="aeloria-admin-tutorials-loading">
        <div className="aeloria-admin-tutorials-spinner"></div>
        <p>Loading tutorials...</p>
      </div>
    );
  }

  return (
    <div className="aeloria-admin-tutorials-page">
      {/* ================= HEADER ================= */}
      <header className="aeloria-admin-tutorials-header">
        <div>
          <Link
            to="/admin/dashboard"
            className="aeloria-admin-tutorials-back"
          >
            ← Dashboard
          </Link>

          <h1>Tutorial Management</h1>

          <p>
            Create, manage and publish programming tutorials for AELORIA.
          </p>
        </div>

        <button
          className="aeloria-admin-tutorials-add-btn"
          onClick={() => {
            setError("");
            setShowModal(true);
          }}
        >
          + Add Tutorial
        </button>
      </header>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="aeloria-admin-tutorials-error">
          {error}
        </div>
      )}

      {/* ================= STATS ================= */}
      <section className="aeloria-admin-tutorials-stats">
        <div className="aeloria-admin-tutorial-stat-card">
          <span className="aeloria-admin-tutorial-stat-icon">📚</span>

          <div>
            <h3>{totalTutorials}</h3>
            <p>Total Tutorials</p>
          </div>
        </div>

        <div className="aeloria-admin-tutorial-stat-card">
          <span className="aeloria-admin-tutorial-stat-icon">🟢</span>

          <div>
            <h3>{publishedTutorials}</h3>
            <p>Published</p>
          </div>
        </div>

        <div className="aeloria-admin-tutorial-stat-card">
          <span className="aeloria-admin-tutorial-stat-icon">📝</span>

          <div>
            <h3>{draftTutorials}</h3>
            <p>Drafts</p>
          </div>
        </div>
      </section>

      {/* ================= TOOLBAR ================= */}
      <section className="aeloria-admin-tutorials-toolbar">
        <div className="aeloria-admin-tutorial-search">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search tutorials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </section>

      {/* ================= TUTORIAL LIST ================= */}
      <section className="aeloria-admin-tutorials-list">
        {filteredTutorials.length === 0 ? (
          <div className="aeloria-admin-tutorials-empty">
            <div className="aeloria-admin-tutorials-empty-icon">
              📚
            </div>

            <h2>No Tutorials Found</h2>

            <p>
              Try changing your search or filters, or create a new tutorial.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="aeloria-admin-tutorials-empty-btn"
            >
              + Add Tutorial
            </button>
          </div>
        ) : (
          filteredTutorials.map((tutorial) => (
            <article
              key={tutorial._id}
              className="aeloria-admin-tutorial-card"
            >
              <div className="aeloria-admin-tutorial-card-main">
                <div className="aeloria-admin-tutorial-card-icon">
                  📖
                </div>

                <div className="aeloria-admin-tutorial-card-info">
                  <div className="aeloria-admin-tutorial-card-top">
                    <h2>{tutorial.title}</h2>

                    <span
                      className={`aeloria-admin-tutorial-status ${
                        tutorial.status === "published"
                          ? "published"
                          : "draft"
                      }`}
                    >
                      {tutorial.status || "draft"}
                    </span>
                  </div>

                  <p className="aeloria-admin-tutorial-description">
                    {tutorial.description || "No description available."}
                  </p>

                  <div className="aeloria-admin-tutorial-meta">
                    <span>
                      📂 {tutorial.category || "Uncategorized"}
                    </span>

                    <span>
                      🎯 {tutorial.level || "Beginner"}
                    </span>

                    <span>
                      👁️ {tutorial.views || 0} views
                    </span>

                    <span>
                      📚 {tutorial.topics?.length || 0} topics
                    </span>
                  </div>
                </div>
              </div>

              <div className="aeloria-admin-tutorial-actions">
                <Link
                  to={`/admin/tutorials/edit/${tutorial._id}`}
                  className="aeloria-admin-tutorial-edit"
                  title="Edit Tutorial"
                >
                  ✏️ Edit
                </Link>

                <Link
                  to={`/admin/tutorials/${tutorial._id}/topics`}
                  className="aeloria-admin-tutorial-topics"
                  title="Manage Topics"
                >
                  📚 Topics
                </Link>

                <Link
                  to={`/tutorials/${tutorial.slug || tutorial._id}`}
                  className="aeloria-admin-tutorial-view"
                  title="View Tutorial"
                >
                  👁️ View
                </Link>

                <button
                  className="aeloria-admin-tutorial-status-btn"
                  onClick={() => handleToggleStatus(tutorial._id)}
                >
                  {tutorial.status === "published"
                    ? "Unpublish"
                    : "Publish"}
                </button>

                <button
                  className="aeloria-admin-tutorial-delete"
                  onClick={() => handleDelete(tutorial._id)}
                  title="Delete Tutorial"
                >
                  🗑️
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      {/* ================= ADD MODAL ================= */}
      {showModal && (
        <div
          className="aeloria-admin-tutorial-modal-overlay"
          onClick={() => !saving && setShowModal(false)}
        >
          <div
            className="aeloria-admin-tutorial-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aeloria-admin-tutorial-modal-header">
              <div>
                <h2>Add New Tutorial</h2>
                <p>Create a new tutorial for AELORIA.</p>
              </div>

              <button
                className="aeloria-admin-tutorial-modal-close"
                onClick={() => !saving && setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTutorial}>
              <div className="aeloria-admin-tutorial-form-group">
                <label>Tutorial Title *</label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. JavaScript Tutorial"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="aeloria-admin-tutorial-form-row">
                <div className="aeloria-admin-tutorial-form-group">
                  <label>Category</label>

                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. Programming"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="aeloria-admin-tutorial-form-group">
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
              </div>

              <div className="aeloria-admin-tutorial-form-group">
                <label>Description *</label>

                <textarea
                  name="description"
                  rows="5"
                  placeholder="Write a short description about this tutorial..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={saving}
                ></textarea>
              </div>

              <div className="aeloria-admin-tutorial-modal-actions">
                <button
                  type="button"
                  className="aeloria-admin-tutorial-cancel-btn"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="aeloria-admin-tutorial-save-btn"
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Create Tutorial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTutorials;
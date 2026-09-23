import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getAdminPracticeProblems,
  createPracticeProblem,
  deletePracticeProblem,
  togglePracticeProblemStatus,
} from "../../services/api";

import { useAuth } from "../../context/AuthContext";

import "./Practice.css";

const AdminPractice = () => {
  const navigate = useNavigate();

  const { admin, token, loading: authLoading } = useAuth();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    topic: "",
    difficulty: "Easy",
    description: "",
  });

  useEffect(() => {
    if (authLoading) return;

    if (!admin || !token) {
      navigate("/admin/login");
      return;
    }

    loadProblems();
  }, [authLoading, admin, token]);

  const loadProblems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminPracticeProblems(token);

      const data = Array.isArray(response)
        ? response
        : response?.problems ||
          response?.practice ||
          response?.data ||
          [];

      setProblems(data);
    } catch (err) {
      setError(err.message || "Failed to load practice problems.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Problem title is required.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (!formData.topic.trim()) {
      setError("Topic is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createPracticeProblem(
        {
          title: formData.title.trim(),
          category: formData.category.trim(),
          topic: formData.topic.trim(),
          difficulty: formData.difficulty,
          description: formData.description.trim(),
          status: "draft",
        },
        token
      );

      setFormData({
        title: "",
        category: "",
        topic: "",
        difficulty: "Easy",
        description: "",
      });

      setShowModal(false);

      await loadProblems();
    } catch (err) {
      setError(err.message || "Failed to create practice problem.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this practice problem?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deletePracticeProblem(id, token);

      setProblems((prev) =>
        prev.filter((problem) => problem._id !== id)
      );
    } catch (err) {
      setError(err.message || "Failed to delete practice problem.");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setError("");

      const response = await togglePracticeProblemStatus(
        id,
        token
      );

      const updatedProblem =
        response?.problem || response?.data;

      if (updatedProblem) {
        setProblems((prev) =>
          prev.map((problem) =>
            problem._id === id
              ? updatedProblem
              : problem
          )
        );
      } else {
        await loadProblems();
      }
    } catch (err) {
      setError(
        err.message || "Failed to update problem status."
      );
    }
  };

  const categories = [
    ...new Set(
      problems
        .map((problem) => problem.category)
        .filter(Boolean)
    ),
  ];

  const filteredProblems = problems.filter((problem) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      problem.title?.toLowerCase().includes(searchValue) ||
      problem.topic?.toLowerCase().includes(searchValue) ||
      problem.category?.toLowerCase().includes(searchValue);

    const matchesDifficulty =
      difficultyFilter === "all" ||
      problem.difficulty === difficultyFilter;

    const matchesStatus =
      statusFilter === "all" ||
      problem.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" ||
      problem.category === categoryFilter;

    return (
      matchesSearch &&
      matchesDifficulty &&
      matchesStatus &&
      matchesCategory
    );
  });

  const totalProblems = problems.length;

  const publishedProblems = problems.filter(
    (problem) => problem.status === "published"
  ).length;

  const draftProblems = problems.filter(
    (problem) => problem.status === "draft"
  ).length;

  const easyProblems = problems.filter(
    (problem) => problem.difficulty === "Easy"
  ).length;

  if (authLoading || loading) {
    return (
      <div className="aeloria-admin-practice-loading">
        <div className="aeloria-admin-practice-spinner"></div>
        <p>Loading practice problems...</p>
      </div>
    );
  }

  return (
    <div className="aeloria-admin-practice-page">
      <div className="aeloria-admin-practice-container">

        {/* Header */}
        <div className="aeloria-admin-practice-header">
          <div>
            <span className="aeloria-admin-practice-eyebrow">
              AELORIA ADMIN
            </span>

            <h1>Practice Problems</h1>

            <p>
              Create and manage coding practice problems
              for students.
            </p>
          </div>

          <button
            type="button"
            className="aeloria-admin-practice-add"
            onClick={() => {
              setError("");
              setShowModal(true);
            }}
          >
            + Add Problem
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="aeloria-admin-practice-error">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="aeloria-admin-practice-stats">

          <div className="aeloria-admin-practice-stat">
            <div className="aeloria-admin-practice-stat-icon">
              🧩
            </div>

            <div>
              <span>Total Problems</span>
              <strong>{totalProblems}</strong>
            </div>
          </div>

          <div className="aeloria-admin-practice-stat">
            <div className="aeloria-admin-practice-stat-icon published">
              ✓
            </div>

            <div>
              <span>Published</span>
              <strong>{publishedProblems}</strong>
            </div>
          </div>

          <div className="aeloria-admin-practice-stat">
            <div className="aeloria-admin-practice-stat-icon draft">
              📝
            </div>

            <div>
              <span>Drafts</span>
              <strong>{draftProblems}</strong>
            </div>
          </div>

          <div className="aeloria-admin-practice-stat">
            <div className="aeloria-admin-practice-stat-icon easy">
              ⭐
            </div>

            <div>
              <span>Easy Problems</span>
              <strong>{easyProblems}</strong>
            </div>
          </div>

        </div>

        {/* Toolbar */}
        <div className="aeloria-admin-practice-toolbar">

          <div className="aeloria-admin-practice-search">
            <span>⌕</span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search problems..."
            />
          </div>

          <select
            value={difficultyFilter}
            onChange={(event) =>
              setDifficultyFilter(event.target.value)
            }
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
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
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

        </div>

        {/* Problem List */}
        <div className="aeloria-admin-practice-list">

          {filteredProblems.length === 0 ? (
            <div className="aeloria-admin-practice-empty">
              <div>🧩</div>

              <h3>No practice problems found</h3>

              <p>
                Try changing your filters or create a new
                practice problem.
              </p>
            </div>
          ) : (
            filteredProblems.map((problem) => (
              <div
                key={problem._id}
                className="aeloria-admin-practice-card"
              >

                <div className="aeloria-admin-practice-card-main">

                  <div className="aeloria-admin-practice-card-top">

                    <span
                      className={`aeloria-admin-practice-difficulty ${(
                        problem.difficulty || "Easy"
                      ).toLowerCase()}`}
                    >
                      {problem.difficulty || "Easy"}
                    </span>

                    <span
                      className={`aeloria-admin-practice-status ${
                        problem.status === "published"
                          ? "published"
                          : "draft"
                      }`}
                    >
                      {problem.status === "published"
                        ? "Published"
                        : "Draft"}
                    </span>

                  </div>

                  <h2>{problem.title}</h2>

                  <p className="aeloria-admin-practice-description">
                    {problem.description ||
                      "No description available."}
                  </p>

                  <div className="aeloria-admin-practice-meta">
                    <span>
                      📁 {problem.category || "Uncategorized"}
                    </span>

                    <span>
                      🎯 {problem.topic || "General"}
                    </span>

                    <span>
                      🧪{" "}
                      {problem.testCases?.length || 0} Test Cases
                    </span>

                    <span>
                      👥 {problem.attempts || 0} Attempts
                    </span>
                  </div>

                </div>

                <div className="aeloria-admin-practice-actions">

                  <Link
                    to={`/admin/practice/edit/${problem._id}`}
                    className="aeloria-admin-practice-action edit"
                    title="Edit Problem"
                  >
                    ✏️
                  </Link>

                  <Link
                    to={`/practice/${problem.slug || problem._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="aeloria-admin-practice-action view"
                    title="View Problem"
                  >
                    👁️
                  </Link>

                  <button
                    type="button"
                    className="aeloria-admin-practice-action toggle"
                    onClick={() =>
                      handleToggleStatus(problem._id)
                    }
                    title={
                      problem.status === "published"
                        ? "Unpublish"
                        : "Publish"
                    }
                  >
                    {problem.status === "published"
                      ? "⏸️"
                      : "🚀"}
                  </button>

                  <button
                    type="button"
                    className="aeloria-admin-practice-action delete"
                    onClick={() =>
                      handleDelete(problem._id)
                    }
                    title="Delete Problem"
                  >
                    🗑️
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

      {/* Add Problem Modal */}
      {showModal && (
        <div
          className="aeloria-admin-practice-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="aeloria-admin-practice-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="aeloria-admin-practice-modal-header">
              <div>
                <h2>Add Practice Problem</h2>
                <p>
                  Create a basic problem first. You can add
                  code, test cases and hints while editing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="aeloria-admin-practice-modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreate}>

              <div className="aeloria-admin-practice-form-grid">

                <div className="aeloria-admin-practice-field full">
                  <label>Problem Title *</label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Find Maximum Element"
                  />
                </div>

                <div className="aeloria-admin-practice-field">
                  <label>Category *</label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Data Structures"
                  />
                </div>

                <div className="aeloria-admin-practice-field">
                  <label>Topic *</label>

                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="e.g. Arrays"
                  />
                </div>

                <div className="aeloria-admin-practice-field">
                  <label>Difficulty</label>

                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="aeloria-admin-practice-field full">
                  <label>Description *</label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the problem..."
                    rows="6"
                  />
                </div>

              </div>

              <div className="aeloria-admin-practice-modal-actions">

                <button
                  type="button"
                  className="aeloria-admin-practice-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="aeloria-admin-practice-save"
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Create Problem"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPractice;
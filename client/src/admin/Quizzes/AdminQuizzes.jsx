import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAdminQuizzes,
  getAdminCourses,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  toggleQuizStatus,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./AdminQuizzes.css";

const initialForm = {
  title: "",
  slug: "",
  course: "",
  description: "",
  difficulty: "Beginner",
  timeLimit: 20,
  passingPercentage: 60,
  marksPerQuestion: 1,
  maxAttempts: 0,
  status: "draft",
};

const AdminQuizzes = () => {
  const navigate = useNavigate();
  const { admin, token, loading: authLoading } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, authLoading, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [resQuizzes, resCourses] = await Promise.all([
        getAdminQuizzes(token),
        getAdminCourses(token),
      ]);

      const quizList = Array.isArray(resQuizzes)
        ? resQuizzes
        : resQuizzes?.quizzes || resQuizzes?.data || [];

      const courseList = Array.isArray(resCourses)
        ? resCourses
        : resCourses?.courses || resCourses?.data || [];

      setQuizzes(quizList);
      setCourses(courseList);
    } catch (err) {
      setError(err.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin && token) {
      loadData();
    }
  }, [admin, token]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    if (!isEditing) {
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, title, slug }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      ...initialForm,
      course: courses.length > 0 ? courses[0]._id : "",
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (quiz) => {
    setIsEditing(true);
    setEditId(quiz._id);
    setFormData({
      title: quiz.title || "",
      slug: quiz.slug || "",
      course: quiz.course?._id || quiz.course || "",
      description: quiz.description || "",
      difficulty: quiz.difficulty || "Beginner",
      timeLimit: quiz.timeLimit || 20,
      passingPercentage: quiz.passingPercentage || 60,
      marksPerQuestion: quiz.marksPerQuestion || 1,
      maxAttempts: quiz.maxAttempts || 0,
      status: quiz.status || "draft",
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Quiz title is required");
      return;
    }
    if (!formData.course) {
      setError("Please select an associated course");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (isEditing) {
        await updateQuiz(editId, formData, token);
        setSuccess("Quiz updated successfully!");
      } else {
        await createQuiz(formData, token);
        setSuccess("Quiz created successfully!");
      }

      setShowModal(false);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (quizId) => {
    try {
      setError("");
      await toggleQuizStatus(quizId, token);
      setQuizzes((prev) =>
        prev.map((q) =>
          q._id === quizId
            ? { ...q, status: q.status === "published" ? "draft" : "published" }
            : q
        )
      );
    } catch (err) {
      setError(err.message || "Failed to toggle quiz status");
    }
  };

  const handleDelete = async (quizId, title) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${title}"? This will also remove student attempts for this quiz.`
      )
    ) {
      return;
    }

    try {
      setError("");
      await deleteQuiz(quizId, token);
      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
      setSuccess(`Quiz "${title}" deleted successfully.`);
    } catch (err) {
      setError(err.message || "Failed to delete quiz");
    }
  };

  // Filter quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const titleMatch =
        quiz.title?.toLowerCase().includes(search.toLowerCase()) ||
        quiz.course?.title?.toLowerCase().includes(search.toLowerCase()) ||
        quiz.slug?.toLowerCase().includes(search.toLowerCase());

      const diffMatch =
        difficultyFilter === "all" || quiz.difficulty === difficultyFilter;
      const statusMatch =
        statusFilter === "all" || quiz.status === statusFilter;
      const courseMatch =
        courseFilter === "all" ||
        quiz.course?._id === courseFilter ||
        quiz.course === courseFilter;

      return titleMatch && diffMatch && statusMatch && courseMatch;
    });
  }, [quizzes, search, difficultyFilter, statusFilter, courseFilter]);

  const totalQuizzes = quizzes.length;
  const publishedQuizzes = quizzes.filter((q) => q.status === "published").length;
  const draftQuizzes = quizzes.filter((q) => q.status === "draft").length;
  const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questionsCount || 0), 0);
  const totalAttempts = quizzes.reduce((sum, q) => sum + (q.totalAttempts || 0), 0);

  if (authLoading || !admin) {
    return (
      <div className="aeloria-admin-quizzes-loading">
        <div className="aeloria-admin-quizzes-spinner"></div>
        <p>Loading Quiz Management...</p>
      </div>
    );
  }

  return (
    <div className="aeloria-admin-quizzes-page">
      {/* SIDEBAR */}
      <aside className="aeloria-admin-quizzes-sidebar">
        <Link to="/admin/dashboard" className="aeloria-admin-quizzes-logo">
          <span className="aeloria-admin-quizzes-logo-icon">A</span>
          <div>
            <strong>AELORIA</strong>
            <small>Admin Panel</small>
          </div>
        </Link>

        <nav className="aeloria-admin-quizzes-nav">
          <Link to="/admin/dashboard">📊 Dashboard</Link>
          <Link to="/admin/courses">📚 Courses</Link>
          <Link to="/admin/tutorials">📖 Tutorials</Link>
          <Link to="/admin/notes">📝 Notes</Link>
          <Link to="/admin/practice">💻 Practice</Link>
          <Link
            to="/admin/quizzes"
            className="aeloria-admin-quizzes-nav-active"
          >
            🎯 Quizzes
          </Link>
          <Link to="/admin/categories">🗂️ Categories</Link>
          <Link to="/admin/languages">🌐 Languages</Link>
          <Link to="/admin/users">👥 Users</Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="aeloria-admin-quizzes-main">
        {/* HEADER */}
        <header className="aeloria-admin-quizzes-header">
          <div>
            <p className="aeloria-admin-quizzes-eyebrow">ASSESSMENT & GRADING</p>
            <h1>Quiz Management</h1>
            <p className="aeloria-admin-quizzes-subtitle">
              Create, configure, and monitor course assessments, MCQs, and student results.
            </p>
          </div>

          <button
            className="aeloria-admin-quizzes-btn-primary"
            onClick={openCreateModal}
          >
            <span>+</span> Create Quiz
          </button>
        </header>

        {/* ALERTS */}
        {error && (
          <div className="aeloria-admin-quizzes-alert aeloria-alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="aeloria-admin-quizzes-alert aeloria-alert-success">
            <span>✓</span> {success}
          </div>
        )}

        {/* STATS CARDS */}
        <section className="aeloria-admin-quizzes-stats">
          <div className="aeloria-admin-quizzes-stat-card">
            <span className="aeloria-admin-quizzes-stat-icon">🎯</span>
            <div>
              <strong>{totalQuizzes}</strong>
              <span>Total Quizzes</span>
            </div>
          </div>

          <div className="aeloria-admin-quizzes-stat-card">
            <span className="aeloria-admin-quizzes-stat-icon">✓</span>
            <div>
              <strong>{publishedQuizzes}</strong>
              <span>Published</span>
            </div>
          </div>

          <div className="aeloria-admin-quizzes-stat-card">
            <span className="aeloria-admin-quizzes-stat-icon">⏳</span>
            <div>
              <strong>{draftQuizzes}</strong>
              <span>Drafts</span>
            </div>
          </div>

          <div className="aeloria-admin-quizzes-stat-card">
            <span className="aeloria-admin-quizzes-stat-icon">❓</span>
            <div>
              <strong>{totalQuestions}</strong>
              <span>Total MCQs</span>
            </div>
          </div>

          <div className="aeloria-admin-quizzes-stat-card">
            <span className="aeloria-admin-quizzes-stat-icon">🎓</span>
            <div>
              <strong>{totalAttempts}</strong>
              <span>Student Attempts</span>
            </div>
          </div>
        </section>

        {/* TOOLBAR */}
        <section className="aeloria-admin-quizzes-toolbar">
          <div className="aeloria-admin-quizzes-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search by quiz title, course, or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
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

        {/* QUIZZES LIST */}
        <section className="aeloria-admin-quizzes-content">
          {loading ? (
            <div className="aeloria-admin-quizzes-empty">
              <div className="aeloria-admin-quizzes-spinner"></div>
              <p>Loading quizzes...</p>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="aeloria-admin-quizzes-empty">
              <div className="aeloria-admin-quizzes-empty-icon">🎯</div>
              <h3>No quizzes found</h3>
              <p>Create your first course quiz or change your search filter.</p>
              <button
                className="aeloria-admin-quizzes-btn-primary"
                onClick={openCreateModal}
              >
                + Create Quiz
              </button>
            </div>
          ) : (
            <div className="aeloria-admin-quizzes-grid">
              {filteredQuizzes.map((quiz) => (
                <div key={quiz._id} className="aeloria-admin-quiz-card">
                  <div className="aeloria-admin-quiz-top">
                    <span className="aeloria-admin-quiz-course-badge">
                      📚 {quiz.course?.title || "General Course"}
                    </span>
                    <button
                      type="button"
                      className={`aeloria-admin-quiz-status-pill ${
                        quiz.status === "published" ? "published" : "draft"
                      }`}
                      onClick={() => handleToggleStatus(quiz._id)}
                      title="Click to toggle status"
                    >
                      {quiz.status === "published" ? "● Published" : "○ Draft"}
                    </button>
                  </div>

                  <h3 className="aeloria-admin-quiz-title">{quiz.title}</h3>
                  <p className="aeloria-admin-quiz-desc">
                    {quiz.description || "No description provided."}
                  </p>

                  <div className="aeloria-admin-quiz-params">
                    <div className="aeloria-quiz-param">
                      <span>Difficulty</span>
                      <strong>{quiz.difficulty}</strong>
                    </div>
                    <div className="aeloria-quiz-param">
                      <span>Questions</span>
                      <strong>{quiz.questionsCount || 0} MCQs</strong>
                    </div>
                    <div className="aeloria-quiz-param">
                      <span>Time Limit</span>
                      <strong>{quiz.timeLimit} Mins</strong>
                    </div>
                    <div className="aeloria-quiz-param">
                      <span>Pass Mark</span>
                      <strong>{quiz.passingPercentage}%</strong>
                    </div>
                  </div>

                  <div className="aeloria-admin-quiz-stats-footer">
                    <span>
                      📊 {quiz.totalAttempts || 0} Student Attempts
                    </span>
                    <span>
                      ✓ {quiz.passedAttempts || 0} Passed
                    </span>
                  </div>

                  <div className="aeloria-admin-quiz-actions">
                    <Link
                      to={`/admin/quizzes/${quiz._id}/questions`}
                      className="aeloria-admin-quiz-action-btn questions"
                    >
                      ❓ Manage Questions ({quiz.questionsCount || 0})
                    </Link>

                    <Link
                      to={`/admin/quizzes/${quiz._id}/attempts`}
                      className="aeloria-admin-quiz-action-btn results"
                    >
                      📈 Student Results
                    </Link>

                    <button
                      type="button"
                      className="aeloria-admin-quiz-action-btn edit"
                      onClick={() => openEditModal(quiz)}
                    >
                      ✎ Edit
                    </button>

                    <button
                      type="button"
                      className="aeloria-admin-quiz-action-btn delete"
                      onClick={() => handleDelete(quiz._id, quiz.title)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="aeloria-quiz-modal-overlay">
          <div className="aeloria-quiz-modal">
            <div className="aeloria-quiz-modal-header">
              <h2>{isEditing ? "Edit Quiz" : "Create New Quiz"}</h2>
              <button
                className="aeloria-quiz-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="aeloria-quiz-form">
              <div className="aeloria-quiz-form-group">
                <label>Associated Course *</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="aeloria-quiz-form-row">
                <div className="aeloria-quiz-form-group">
                  <label>Quiz Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Python Fundamentals Quiz"
                    required
                  />
                </div>

                <div className="aeloria-quiz-form-group">
                  <label>URL Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="e.g. python-fundamentals-quiz"
                    required
                  />
                </div>
              </div>

              <div className="aeloria-quiz-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the topics and purpose of this quiz..."
                />
              </div>

              <div className="aeloria-quiz-form-grid">
                <div className="aeloria-quiz-form-group">
                  <label>Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="aeloria-quiz-form-group">
                  <label>Time Limit (Minutes)</label>
                  <input
                    type="number"
                    name="timeLimit"
                    value={formData.timeLimit}
                    onChange={handleChange}
                    min={1}
                    required
                  />
                </div>

                <div className="aeloria-quiz-form-group">
                  <label>Passing Percentage (%)</label>
                  <input
                    type="number"
                    name="passingPercentage"
                    value={formData.passingPercentage}
                    onChange={handleChange}
                    min={1}
                    max={100}
                    required
                  />
                </div>

                <div className="aeloria-quiz-form-group">
                  <label>Marks Per Question</label>
                  <input
                    type="number"
                    name="marksPerQuestion"
                    value={formData.marksPerQuestion}
                    onChange={handleChange}
                    min={1}
                    required
                  />
                </div>

                <div className="aeloria-quiz-form-group">
                  <label>Max Allowed Attempts</label>
                  <input
                    type="number"
                    name="maxAttempts"
                    value={formData.maxAttempts}
                    onChange={handleChange}
                    min={0}
                    placeholder="0 = Unlimited"
                  />
                  <small style={{ color: "#8b5cf6", fontSize: "11px" }}>
                    0 means unlimited attempts
                  </small>
                </div>

                <div className="aeloria-quiz-form-group">
                  <label>Publication Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Draft (Hidden from students)</option>
                    <option value="published">Published (Live for students)</option>
                  </select>
                </div>
              </div>

              <div className="aeloria-quiz-modal-footer">
                <button
                  type="button"
                  className="aeloria-quiz-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="aeloria-quiz-btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : isEditing
                    ? "Update Quiz"
                    : "Create Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuizzes;

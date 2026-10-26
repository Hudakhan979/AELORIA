import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getAdminQuizAttempts } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import "./QuizAttempts.css";

const QuizAttempts = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { admin, token, loading: authLoading } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterResult, setFilterResult] = useState("all");
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, authLoading, navigate]);

  const loadAttempts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAdminQuizAttempts(quizId, token);
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load student quiz attempts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin && token && quizId) {
      loadAttempts();
    }
  }, [admin, token, quizId]);

  const attempts = data?.attempts || [];

  const filteredAttempts = useMemo(() => {
    return attempts.filter((att) => {
      const studentName = `${att.user?.firstName || ""} ${att.user?.lastName || ""}`.toLowerCase();
      const studentEmail = (att.user?.email || "").toLowerCase();
      const q = search.toLowerCase();

      const matchesSearch = studentName.includes(q) || studentEmail.includes(q);
      const matchesFilter =
        filterResult === "all" ||
        (filterResult === "passed" && att.passed) ||
        (filterResult === "failed" && !att.passed);

      return matchesSearch && matchesFilter;
    });
  }, [attempts, search, filterResult]);

  const passedCount = attempts.filter((a) => a.passed).length;
  const failedCount = attempts.filter((a) => !a.passed).length;
  const passRate =
    attempts.length > 0 ? Math.round((passedCount / attempts.length) * 100) : 0;

  const formatSeconds = (sec) => {
    if (!sec && sec !== 0) return "--";
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s < 10 ? "0" : ""}${s}s`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "--";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="aeloria-attempts-loading">
        <div className="aeloria-attempts-spinner"></div>
        <p>Loading student results...</p>
      </div>
    );
  }

  return (
    <div className="aeloria-attempts-page">
      {/* Top Header */}
      <div className="aeloria-attempts-topbar">
        <div className="aeloria-attempts-topbar-inner">
          <Link to="/admin/quizzes" className="aeloria-attempts-back">
            ← Back to Quizzes
          </Link>
          <span className="aeloria-attempts-breadcrumb">
            Quiz Management / {data?.quizTitle || "Quiz"} / Student Results
          </span>
        </div>
      </div>

      <div className="aeloria-attempts-container">
        {/* Header */}
        <header className="aeloria-attempts-header">
          <div>
            <span className="aeloria-attempts-badge">STUDENT PERFORMANCE</span>
            <h1>{data?.quizTitle || "Quiz Attempts"}</h1>
            <p className="aeloria-attempts-subtitle">
              Detailed log of all student quiz submissions and grading outcomes.
            </p>
          </div>
        </header>

        {/* STATS */}
        <div className="aeloria-attempts-stats">
          <div className="aeloria-attempts-stat-card">
            <span className="aeloria-attempts-stat-icon">🎓</span>
            <div>
              <strong>{attempts.length}</strong>
              <span>Total Submissions</span>
            </div>
          </div>

          <div className="aeloria-attempts-stat-card">
            <span className="aeloria-attempts-stat-icon pass">✓</span>
            <div>
              <strong>{passedCount}</strong>
              <span>Passed</span>
            </div>
          </div>

          <div className="aeloria-attempts-stat-card">
            <span className="aeloria-attempts-stat-icon fail">✕</span>
            <div>
              <strong>{failedCount}</strong>
              <span>Failed</span>
            </div>
          </div>

          <div className="aeloria-attempts-stat-card">
            <span className="aeloria-attempts-stat-icon rate">%</span>
            <div>
              <strong>{passRate}%</strong>
              <span>Pass Rate</span>
            </div>
          </div>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="aeloria-attempts-alert error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* TOOLBAR */}
        <div className="aeloria-attempts-toolbar">
          <div className="aeloria-attempts-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search student name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value)}
          >
            <option value="all">All Results</option>
            <option value="passed">Passed Only</option>
            <option value="failed">Failed Only</option>
          </select>
        </div>

        {/* ATTEMPTS TABLE */}
        <div className="aeloria-attempts-table-card">
          {filteredAttempts.length === 0 ? (
            <div className="aeloria-attempts-empty">
              <div className="aeloria-attempts-empty-icon">📊</div>
              <h3>No attempts recorded yet</h3>
              <p>When students submit this quiz, their results will appear here.</p>
            </div>
          ) : (
            <div className="aeloria-attempts-table-wrapper">
              <table className="aeloria-attempts-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Score / Total</th>
                    <th>Percentage</th>
                    <th>Status</th>
                    <th>Time Spent</th>
                    <th>Submitted At</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttempts.map((att) => (
                    <tr key={att._id}>
                      <td>
                        <div className="aeloria-student-info">
                          <div className="aeloria-student-avatar">
                            {att.user?.firstName?.[0]?.toUpperCase() || "S"}
                          </div>
                          <div>
                            <strong>
                              {att.user?.firstName || "Unknown"} {att.user?.lastName || ""}
                            </strong>
                            <small>{att.user?.email || "No email"}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>
                          {att.score} / {att.totalMarks || att.totalQuestions}
                        </strong>
                      </td>
                      <td>
                        <div className="aeloria-percent-badge">
                          {att.percentage}%
                        </div>
                      </td>
                      <td>
                        <span
                          className={`aeloria-status-tag ${
                            att.passed ? "passed" : "failed"
                          }`}
                        >
                          {att.passed ? "✓ Passed" : "✕ Failed"}
                        </span>
                      </td>
                      <td>{formatSeconds(att.timeSpent)}</td>
                      <td>{formatDate(att.submittedAt)}</td>
                      <td>
                        <button
                          type="button"
                          className="aeloria-view-breakdown-btn"
                          onClick={() => setSelectedAttempt(att)}
                        >
                          View Breakdown
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* STUDENT ATTEMPT BREAKDOWN MODAL */}
      {selectedAttempt && (
        <div className="aeloria-attempt-modal-overlay">
          <div className="aeloria-attempt-modal">
            <div className="aeloria-attempt-modal-header">
              <div>
                <h2>
                  Submission by {selectedAttempt.user?.firstName}{" "}
                  {selectedAttempt.user?.lastName}
                </h2>
                <p>
                  Score: <strong>{selectedAttempt.score} / {selectedAttempt.totalMarks}</strong>{" "}
                  ({selectedAttempt.percentage}%) •{" "}
                  <span
                    className={
                      selectedAttempt.passed
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {selectedAttempt.passed ? "PASSED" : "FAILED"}
                  </span>{" "}
                  • Time: {formatSeconds(selectedAttempt.timeSpent)}
                </p>
              </div>
              <button
                className="aeloria-attempt-modal-close"
                onClick={() => setSelectedAttempt(null)}
              >
                ✕
              </button>
            </div>

            <div className="aeloria-attempt-modal-body">
              {selectedAttempt.answers && selectedAttempt.answers.length > 0 ? (
                selectedAttempt.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`aeloria-attempt-review-item ${
                      ans.isCorrect ? "correct" : "incorrect"
                    }`}
                  >
                    <div className="aeloria-attempt-review-top">
                      <span className="aeloria-attempt-qnum">
                        Q{idx + 1}
                      </span>
                      <span
                        className={`aeloria-attempt-result-pill ${
                          ans.isCorrect ? "correct" : "incorrect"
                        }`}
                      >
                        {ans.isCorrect ? "✓ Correct (+1)" : "✕ Incorrect / Unanswered"}
                      </span>
                    </div>

                    <p className="aeloria-attempt-qtext">{ans.questionText}</p>

                    <div className="aeloria-attempt-choice-box">
                      <div>
                        <small>Student's Choice:</small>
                        <strong>
                          {ans.selectedOption !== null && ans.selectedOption !== undefined
                            ? `Option ${String.fromCharCode(65 + ans.selectedOption)}`
                            : "Unanswered"}
                        </strong>
                      </div>
                      <div>
                        <small>Correct Answer:</small>
                        <strong className="text-success">
                          Option {String.fromCharCode(65 + ans.correctAnswer)}
                        </strong>
                      </div>
                    </div>

                    {ans.explanation && (
                      <div className="aeloria-attempt-review-expl">
                        💡 <strong>Explanation:</strong> {ans.explanation}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No detailed answers recorded for this attempt.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizAttempts;

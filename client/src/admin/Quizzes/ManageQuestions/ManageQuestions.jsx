import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getAdminQuizById,
  addQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
} from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import "./ManageQuestions.css";

const initialQuestion = {
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
};

const ManageQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { admin, token, loading: authLoading } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [questionIdToEdit, setQuestionIdToEdit] = useState(null);
  const [formData, setFormData] = useState(initialQuestion);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, authLoading, navigate]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAdminQuizById(quizId, token);
      if (res?.quiz) {
        setQuiz(res.quiz);
        setQuestions(res.quiz.questions || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load quiz questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin && token && quizId) {
      loadQuiz();
    }
  }, [admin, token, quizId]);

  const handleOpenAddModal = () => {
    setEditingIndex(null);
    setQuestionIdToEdit(null);
    setFormData(initialQuestion);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleOpenEditModal = (q, index) => {
    setEditingIndex(index);
    setQuestionIdToEdit(q._id);
    setFormData({
      question: q.question,
      options: [...q.options],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || "",
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleOptionChange = (idx, value) => {
    const updated = [...formData.options];
    updated[idx] = value;
    setFormData((prev) => ({ ...prev, options: updated }));
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      setError("Question text is required.");
      return;
    }

    for (let i = 0; i < 4; i++) {
      if (!formData.options[i] || !formData.options[i].trim()) {
        setError(`Option ${i + 1} cannot be empty.`);
        return;
      }
    }

    try {
      setSaving(true);
      setError("");

      if (questionIdToEdit) {
        await updateQuizQuestion(quizId, questionIdToEdit, formData, token);
        setSuccess("Question updated successfully!");
      } else {
        await addQuizQuestion(quizId, formData, token);
        setSuccess("Question added successfully!");
      }

      setShowModal(false);
      await loadQuiz();
    } catch (err) {
      setError(err.message || "Failed to save question");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId, index) => {
    if (!window.confirm(`Are you sure you want to delete Question #${index + 1}?`)) {
      return;
    }

    try {
      setError("");
      await deleteQuizQuestion(quizId, questionId, token);
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
      setSuccess(`Question #${index + 1} deleted.`);
    } catch (err) {
      setError(err.message || "Failed to delete question");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="aeloria-manage-q-loading">
        <div className="aeloria-manage-q-spinner"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="aeloria-manage-q-page">
      {/* Top Header */}
      <div className="aeloria-manage-q-topbar">
        <div className="aeloria-manage-q-topbar-inner">
          <Link to="/admin/quizzes" className="aeloria-manage-q-back">
            ← Back to Quizzes
          </Link>
          <span className="aeloria-manage-q-breadcrumb">
            Quiz Management / {quiz?.title} / Questions ({questions.length})
          </span>
        </div>
      </div>

      <div className="aeloria-manage-q-container">
        {/* Quiz Meta Card */}
        <header className="aeloria-manage-q-header">
          <div>
            <span className="aeloria-manage-q-badge">
              📚 {quiz?.course?.title || "Course"}
            </span>
            <h1>{quiz?.title}</h1>
            <p className="aeloria-manage-q-subtitle">
              {quiz?.description || "Manage the multiple-choice questions for this quiz."}
            </p>
            <div className="aeloria-manage-q-meta">
              <span>⏱ {quiz?.timeLimit} Mins</span>
              <span>🎯 Pass: {quiz?.passingPercentage}%</span>
              <span>⭐ {quiz?.marksPerQuestion} mark/question</span>
              <span>📊 Total: {questions.length * (quiz?.marksPerQuestion || 1)} marks</span>
            </div>
          </div>

          <button
            className="aeloria-manage-q-add-btn"
            onClick={handleOpenAddModal}
          >
            <span>+</span> Add MCQ Question
          </button>
        </header>

        {/* ALERTS */}
        {error && (
          <div className="aeloria-manage-q-alert error">
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="aeloria-manage-q-alert success">
            <span>✓</span> {success}
          </div>
        )}

        {/* QUESTIONS LIST */}
        <div className="aeloria-manage-q-list">
          {questions.length === 0 ? (
            <div className="aeloria-manage-q-empty">
              <div className="aeloria-manage-q-empty-icon">📝</div>
              <h3>No questions added yet</h3>
              <p>Add the first multiple-choice question to this quiz.</p>
              <button
                className="aeloria-manage-q-add-btn"
                onClick={handleOpenAddModal}
              >
                + Add Question
              </button>
            </div>
          ) : (
            questions.map((q, index) => (
              <div key={q._id || index} className="aeloria-manage-q-card">
                <div className="aeloria-manage-q-card-header">
                  <span className="aeloria-manage-q-number">
                    Question {index + 1} of {questions.length}
                  </span>

                  <div className="aeloria-manage-q-card-actions">
                    <button
                      type="button"
                      className="aeloria-manage-q-card-btn edit"
                      onClick={() => handleOpenEditModal(q, index)}
                    >
                      ✎ Edit
                    </button>
                    <button
                      type="button"
                      className="aeloria-manage-q-card-btn delete"
                      onClick={() => handleDeleteQuestion(q._id, index)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>

                <h3 className="aeloria-manage-q-title">{q.question}</h3>

                <div className="aeloria-manage-q-options-grid">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = q.correctAnswer === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`aeloria-manage-q-option ${
                          isCorrect ? "correct" : ""
                        }`}
                      >
                        <span className="aeloria-manage-q-opt-marker">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="aeloria-manage-q-opt-text">{opt}</span>
                        {isCorrect && (
                          <span className="aeloria-manage-q-correct-tag">
                            ✓ Correct Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="aeloria-manage-q-explanation">
                    <strong>💡 Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD / EDIT QUESTION MODAL */}
      {showModal && (
        <div className="aeloria-manage-q-modal-overlay">
          <div className="aeloria-manage-q-modal">
            <div className="aeloria-manage-q-modal-header">
              <h2>
                {questionIdToEdit
                  ? `Edit Question #${(editingIndex ?? 0) + 1}`
                  : "Add New MCQ Question"}
              </h2>
              <button
                className="aeloria-manage-q-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitQuestion} className="aeloria-manage-q-form">
              <div className="aeloria-manage-q-form-group">
                <label>Question Statement *</label>
                <textarea
                  value={formData.question}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, question: e.target.value }))
                  }
                  rows={3}
                  placeholder="e.g. Which of the following data types is immutable in Python?"
                  required
                />
              </div>

              <div className="aeloria-manage-q-form-group">
                <label>Options (Select the radio button for the correct answer) *</label>
                <div className="aeloria-manage-q-form-options">
                  {formData.options.map((opt, optIdx) => (
                    <div key={optIdx} className="aeloria-manage-q-form-opt-row">
                      <label
                        className={`aeloria-manage-q-radio-label ${
                          formData.correctAnswer === optIdx ? "selected" : ""
                        }`}
                        title="Mark as correct answer"
                      >
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={formData.correctAnswer === optIdx}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              correctAnswer: optIdx,
                            }))
                          }
                        />
                        <span>{String.fromCharCode(65 + optIdx)}</span>
                      </label>

                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        required
                      />

                      {formData.correctAnswer === optIdx && (
                        <span className="aeloria-manage-q-radio-active-badge">
                          ✓ Correct
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="aeloria-manage-q-form-group">
                <label>Explanation (Shown to student upon submission)</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      explanation: e.target.value,
                    }))
                  }
                  rows={2}
                  placeholder="Explain why this option is correct to help students learn..."
                />
              </div>

              <div className="aeloria-manage-q-modal-footer">
                <button
                  type="button"
                  className="aeloria-manage-q-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="aeloria-manage-q-btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : questionIdToEdit
                    ? "Update Question"
                    : "Add Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;

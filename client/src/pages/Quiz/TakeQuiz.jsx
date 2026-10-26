import { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { startQuizTake, submitQuizAnswers } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./TakeQuiz.css";

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user, token, isLoggedIn, loading: authLoading } = useAuth();

  const [quizMeta, setQuizMeta] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIndex]: optionIndex }
  const [timeRemaining, setTimeRemaining] = useState(null); // in seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [result, setResult] = useState(null);
  const [filterReview, setFilterReview] = useState("all"); // 'all', 'correct', 'incorrect'

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // Check login
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate(`/login?redirect=/quiz/${quizId}/take`);
    }
  }, [authLoading, isLoggedIn, navigate, quizId]);

  // Load questions
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError("");

        // Check if there's already a completed result in session storage for this quiz
        const cachedResultKey = `aeloria_quiz_result_${quizId}_${user?._id || "anon"}`;
        const cachedResult = sessionStorage.getItem(cachedResultKey);
        if (cachedResult) {
          try {
            const parsed = JSON.parse(cachedResult);
            if (parsed && parsed.result) {
              setResult(parsed.result);
              setQuizMeta(parsed.quizMeta);
              setLoading(false);
              return;
            }
          } catch {
            sessionStorage.removeItem(cachedResultKey);
          }
        }

        const res = await startQuizTake(quizId, token);

        if (res?.quiz && res?.questions) {
          setQuizMeta(res.quiz);
          setQuestions(res.questions);
          const limitSeconds = (res.quiz.timeLimit || 20) * 60;
          setTimeRemaining(limitSeconds);
          startTimeRef.current = Date.now();
        } else {
          setError("Failed to load quiz content.");
        }
      } catch (err) {
        setError(err.message || "Failed to start quiz.");
      } finally {
        setLoading(false);
      }
    };

    if (token && !result) {
      fetchQuiz();
    }
  }, [quizId, token, result, user]);

  // Handle countdown timer
  useEffect(() => {
    if (result || timeRemaining === null || loading || submitting) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeRemaining, result, loading, submitting]);

  const handleSelectOption = (optIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const handleAutoSubmit = () => {
    handleSubmitAnswers(true);
  };

  const handleSubmitAnswers = async (isAuto = false) => {
    setShowConfirmModal(false);

    try {
      setSubmitting(true);
      setError("");

      const timeSpentSeconds = Math.round(
        (Date.now() - startTimeRef.current) / 1000
      );

      // Prepare payload
      const formattedAnswers = Object.entries(userAnswers).map(
        ([qIdx, selectedOption]) => ({
          questionIndex: Number(qIdx),
          selectedOption: Number(selectedOption),
        })
      );

      const res = await submitQuizAnswers(
        quizId,
        {
          answers: formattedAnswers,
          timeSpent: timeSpentSeconds,
        },
        token
      );

      if (res?.result) {
        setResult(res.result);
        if (timerRef.current) clearInterval(timerRef.current);

        // Cache completed result in session storage for persistence on refresh
        const cachedResultKey = `aeloria_quiz_result_${quizId}_${user?._id || "anon"}`;
        sessionStorage.setItem(
          cachedResultKey,
          JSON.stringify({ result: res.result, quizMeta })
        );

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      setError(err.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    const cachedResultKey = `aeloria_quiz_result_${quizId}_${user?._id || "anon"}`;
    sessionStorage.removeItem(cachedResultKey);
    setResult(null);
    setUserAnswers({});
    setCurrentIndex(0);
    setError("");
    const limitSeconds = (quizMeta?.timeLimit || 20) * 60;
    setTimeRemaining(limitSeconds);
    startTimeRef.current = Date.now();
  };

  // Format timer
  const formatTimer = (seconds) => {
    if (seconds === null || seconds === undefined) return "20:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const formatSecondsSpent = (sec) => {
    if (!sec && sec !== 0) return "--";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = questions.length - answeredCount;

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="aeloria-tq-loading">
          <div className="aeloria-tq-spinner"></div>
          <h2>Preparing Your Assessment...</h2>
          <p>Loading questions securely from Aeloria.</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error && !questions.length && !result) {
    return (
      <>
        <Navbar />
        <div className="aeloria-tq-error-container">
          <div className="aeloria-tq-error-card">
            <span>⚠️</span>
            <h2>Unable to Start Quiz</h2>
            <p>{error}</p>
            <Link to={`/quiz/${quizId}`} className="aeloria-tq-btn-primary">
              Return to Quiz Overview
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ==========================================
  // RESULTS SCREEN (AFTER SUBMISSION)
  // ==========================================
  if (result) {
    const reviewList = result.review || [];
    const filteredReview = reviewList.filter((item) => {
      if (filterReview === "correct") return item.isCorrect;
      if (filterReview === "incorrect") return !item.isCorrect;
      return true;
    });

    return (
      <>
        <Navbar />
        <main className="aeloria-tq-result-page">
          <div className="aeloria-tq-result-container">
            {/* Result Hero Banner */}
            <div
              className={`aeloria-tq-result-hero ${
                result.passed ? "passed" : "failed"
              }`}
            >
              <div className="aeloria-tq-result-icon">
                {result.passed ? "🎉" : "💪"}
              </div>

              <span className="aeloria-tq-result-tag">
                {result.passed ? "ASSESSMENT PASSED" : "ASSESSMENT COMPLETED"}
              </span>

              <h1>
                {result.passed
                  ? "Congratulations! You Passed!"
                  : "Good Effort! Keep Practicing!"}
              </h1>

              <p className="aeloria-tq-result-subtext">
                {result.passed
                  ? `You cleared the ${result.passingPercentage}% benchmark for ${result.quizTitle || "this assessment"}. Excellent work!`
                  : `You scored ${result.percentage}%. The passing threshold is ${result.passingPercentage}%. Review your answers below and try again.`}
              </p>

              {/* Score Highlights */}
              <div className="aeloria-tq-metrics-grid">
                <div className="aeloria-tq-metric">
                  <small>Score</small>
                  <strong>
                    {result.score} / {result.totalMarks}
                  </strong>
                </div>

                <div className="aeloria-tq-metric">
                  <small>Percentage</small>
                  <strong>{result.percentage}%</strong>
                </div>

                <div className="aeloria-tq-metric">
                  <small>Correct</small>
                  <strong className="text-success">{result.correctCount}</strong>
                </div>

                <div className="aeloria-tq-metric">
                  <small>Incorrect</small>
                  <strong className="text-danger">{result.incorrectCount}</strong>
                </div>

                <div className="aeloria-tq-metric">
                  <small>Unanswered</small>
                  <strong>{result.unansweredCount}</strong>
                </div>

                <div className="aeloria-tq-metric">
                  <small>Time Taken</small>
                  <strong>{formatSecondsSpent(result.timeSpent)}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="aeloria-tq-result-actions">
                <button
                  type="button"
                  className="aeloria-tq-btn-retake"
                  onClick={handleRetake}
                >
                  🔄 Retake Quiz
                </button>

                <Link
                  to={
                    quizMeta?.course
                      ? `/courses/${quizMeta.course.slug || quizMeta.course._id}`
                      : "/courses"
                  }
                  className="aeloria-tq-btn-course"
                >
                  📚 Back to Course
                </Link>

                <Link to="/dashboard" className="aeloria-tq-btn-dash">
                  📊 Student Dashboard
                </Link>
              </div>
            </div>

            {/* Answers Breakdown / Review */}
            <div className="aeloria-tq-review-section">
              <div className="aeloria-tq-review-header">
                <div>
                  <h2>Detailed Answers & Explanations</h2>
                  <p>
                    Review each question, your selected answer, and comprehensive explanations.
                  </p>
                </div>

                <div className="aeloria-tq-filter-tabs">
                  <button
                    className={`aeloria-tq-filter-tab ${
                      filterReview === "all" ? "active" : ""
                    }`}
                    onClick={() => setFilterReview("all")}
                  >
                    All ({reviewList.length})
                  </button>
                  <button
                    className={`aeloria-tq-filter-tab ${
                      filterReview === "correct" ? "active" : ""
                    }`}
                    onClick={() => setFilterReview("correct")}
                  >
                    ✓ Correct ({result.correctCount})
                  </button>
                  <button
                    className={`aeloria-tq-filter-tab ${
                      filterReview === "incorrect" ? "active" : ""
                    }`}
                    onClick={() => setFilterReview("incorrect")}
                  >
                    ✕ Incorrect ({result.incorrectCount + result.unansweredCount})
                  </button>
                </div>
              </div>

              <div className="aeloria-tq-review-list">
                {filteredReview.map((item, index) => (
                  <div
                    key={index}
                    className={`aeloria-tq-review-card ${
                      item.isCorrect ? "correct" : "incorrect"
                    }`}
                  >
                    <div className="aeloria-tq-review-card-top">
                      <span className="aeloria-tq-qindex">
                        Question {item.questionIndex + 1} of {result.totalQuestions}
                      </span>
                      <span
                        className={`aeloria-tq-outcome-badge ${
                          item.isCorrect ? "correct" : "incorrect"
                        }`}
                      >
                        {item.isCorrect ? "✓ Correct (+1 Mark)" : "✕ Incorrect (0 Marks)"}
                      </span>
                    </div>

                    <h3 className="aeloria-tq-review-qtext">
                      {item.questionText}
                    </h3>

                    {/* Options list showing user choice & correct answer */}
                    <div className="aeloria-tq-review-options">
                      {item.options?.map((opt, optIdx) => {
                        const isChosen = item.selectedOption === optIdx;
                        const isCorrectAnswer = item.correctAnswer === optIdx;

                        let optClass = "aeloria-tq-rev-opt";
                        if (isCorrectAnswer) optClass += " is-correct";
                        if (isChosen && !isCorrectAnswer) optClass += " is-wrong-chosen";

                        return (
                          <div key={optIdx} className={optClass}>
                            <span className="opt-letter">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="opt-text">{opt}</span>

                            {isCorrectAnswer && (
                              <span className="opt-tag correct">
                                ✓ Correct Answer
                              </span>
                            )}
                            {isChosen && !isCorrectAnswer && (
                              <span className="opt-tag chosen-wrong">
                                Your Choice (Incorrect)
                              </span>
                            )}
                            {isChosen && isCorrectAnswer && (
                              <span className="opt-tag chosen-correct">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {item.selectedOption === null && (
                      <p className="aeloria-tq-unanswered-note">
                        ⚠️ You left this question unanswered.
                      </p>
                    )}

                    {/* Pedagogical Explanation */}
                    {item.explanation && (
                      <div className="aeloria-tq-explanation-box">
                        <span className="expl-icon">💡</span>
                        <div>
                          <strong>Explanation:</strong>
                          <p>{item.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ==========================================
  // QUIZ TAKING SCREEN (ACTIVE)
  // ==========================================
  const currentQuestion = questions[currentIndex];
  const isUrgentTimer = timeRemaining !== null && timeRemaining <= 120; // 2 minutes

  return (
    <>
      <Navbar />

      <main className="aeloria-tq-page">
        {/* Top Control Bar with Timer & Status */}
        <header className="aeloria-tq-header-bar">
          <div className="aeloria-tq-header-inner">
            <div className="aeloria-tq-header-title">
              <span className="aeloria-tq-quiz-badge">
                📚 {quizMeta?.course?.title || "Quiz"}
              </span>
              <h2>{quizMeta?.title}</h2>
            </div>

            {/* Timer Banner */}
            <div
              className={`aeloria-tq-timer-badge ${
                isUrgentTimer ? "urgent" : ""
              }`}
            >
              <span className="timer-icon">⏱</span>
              <div>
                <small>Time Remaining</small>
                <strong>{formatTimer(timeRemaining)}</strong>
              </div>
            </div>

            <button
              type="button"
              className="aeloria-tq-submit-top-btn"
              onClick={() => setShowConfirmModal(true)}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </header>

        <div className="aeloria-tq-workspace">
          {/* Main Question Column */}
          <div className="aeloria-tq-main-col">
            {error && (
              <div className="aeloria-tq-alert error">
                <span>⚠️</span> {error}
              </div>
            )}

            {currentQuestion ? (
              <div className="aeloria-tq-card">
                <div className="aeloria-tq-card-meta">
                  <span className="aeloria-tq-qnum">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="aeloria-tq-mark-badge">
                    1 Mark • Single Choice
                  </span>
                </div>

                <h2 className="aeloria-tq-question-statement">
                  {currentQuestion.question}
                </h2>

                {/* 4 Options Selection */}
                <div className="aeloria-tq-options-container">
                  {currentQuestion.options?.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentIndex] === optIdx;
                    return (
                      <button
                        type="button"
                        key={optIdx}
                        className={`aeloria-tq-option-card ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => handleSelectOption(optIdx)}
                      >
                        <span className="aeloria-tq-radio-custom">
                          {isSelected && <span className="radio-dot"></span>}
                        </span>

                        <span className="aeloria-tq-opt-marker">
                          {String.fromCharCode(65 + optIdx)}
                        </span>

                        <span className="aeloria-tq-opt-label">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigation Controls */}
                <div className="aeloria-tq-nav-footer">
                  <button
                    type="button"
                    className="aeloria-tq-nav-btn prev"
                    onClick={() =>
                      setCurrentIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentIndex === 0}
                  >
                    ← Previous
                  </button>

                  <span className="aeloria-tq-footer-status">
                    {userAnswers[currentIndex] !== undefined ? (
                      <span className="text-success">● Answered</span>
                    ) : (
                      <span className="text-muted">○ Not answered yet</span>
                    )}
                  </span>

                  {currentIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      className="aeloria-tq-nav-btn next"
                      onClick={() =>
                        setCurrentIndex((prev) =>
                          Math.min(questions.length - 1, prev + 1)
                        )
                      }
                    >
                      Next Question →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="aeloria-tq-nav-btn finish"
                      onClick={() => setShowConfirmModal(true)}
                    >
                      Review & Submit →
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sidebar Question Palette */}
          <aside className="aeloria-tq-sidebar">
            <div className="aeloria-tq-palette-card">
              <div className="aeloria-tq-palette-header">
                <h3>Question Palette</h3>
                <span>
                  {answeredCount} of {questions.length} Answered
                </span>
              </div>

              {/* Progress bar */}
              <div className="aeloria-tq-progress-bar">
                <div
                  className="aeloria-tq-progress-fill"
                  style={{
                    width: `${
                      questions.length > 0
                        ? (answeredCount / questions.length) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              {/* Grid of question number buttons */}
              <div className="aeloria-tq-palette-grid">
                {questions.map((q, idx) => {
                  const isCurrent = currentIndex === idx;
                  const isAnswered = userAnswers[idx] !== undefined;

                  let btnClass = "aeloria-tq-palette-btn";
                  if (isCurrent) btnClass += " active";
                  if (isAnswered) btnClass += " answered";

                  return (
                    <button
                      type="button"
                      key={idx}
                      className={btnClass}
                      onClick={() => setCurrentIndex(idx)}
                      title={`Go to Question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="aeloria-tq-palette-legend">
                <div>
                  <span className="legend-dot active"></span> Current
                </div>
                <div>
                  <span className="legend-dot answered"></span> Answered
                </div>
                <div>
                  <span className="legend-dot empty"></span> Unanswered
                </div>
              </div>

              <button
                type="button"
                className="aeloria-tq-palette-submit-btn"
                onClick={() => setShowConfirmModal(true)}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Answers"}
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* CONFIRMATION SUBMIT MODAL */}
      {showConfirmModal && (
        <div className="aeloria-tq-modal-overlay">
          <div className="aeloria-tq-confirm-modal">
            <div className="aeloria-tq-confirm-header">
              <h2>Confirm Submission</h2>
              <button
                className="aeloria-tq-modal-close"
                onClick={() => setShowConfirmModal(false)}
              >
                ✕
              </button>
            </div>

            <p className="aeloria-tq-confirm-text">
              Are you sure you want to finish and submit your quiz answers?
            </p>

            <div className="aeloria-tq-confirm-stats">
              <div className="confirm-stat-item">
                <strong>{answeredCount}</strong>
                <span>Answered</span>
              </div>
              <div className="confirm-stat-item">
                <strong className={unansweredCount > 0 ? "text-danger" : ""}>
                  {unansweredCount}
                </strong>
                <span>Unanswered</span>
              </div>
              <div className="confirm-stat-item">
                <strong>{formatTimer(timeRemaining)}</strong>
                <span>Time Left</span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="aeloria-tq-confirm-warning">
                ⚠️ You still have {unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}. You can go back and answer them before submitting.
              </p>
            )}

            <div className="aeloria-tq-confirm-actions">
              <button
                type="button"
                className="aeloria-tq-btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Continue Quiz
              </button>

              <button
                type="button"
                className="aeloria-tq-btn-primary"
                onClick={() => handleSubmitAnswers(false)}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Yes, Submit Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default TakeQuiz;

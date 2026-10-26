import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getQuizInfo, getMyQuizAttempts } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import Footer from "../../components/Footer/Footer";
import "./QuizDetail.css";

const QuizDetail = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user, token, isLoggedIn, loading: authLoading } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getQuizInfo(quizId, token);
        if (res?.quiz) {
          setQuiz(res.quiz);
        }

        if (isLoggedIn && token) {
          try {
            const attRes = await getMyQuizAttempts(quizId, token);
            setAttempts(attRes?.attempts || []);
          } catch {
            // Ignore attempt load error if guest
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load quiz details");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadQuizData();
    }
  }, [quizId, isLoggedIn, token, authLoading]);

  const canTake = !quiz?.maxAttempts || attempts.length < quiz.maxAttempts;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSeconds = (sec) => {
    if (!sec && sec !== 0) return "--";
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s < 10 ? "0" : ""}${s}s`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <CategoryBar />
        <div className="aeloria-quiz-detail-loading">
          <div className="aeloria-qd-spinner"></div>
          <p>Loading Quiz Details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !quiz) {
    return (
      <>
        <Navbar />
        <CategoryBar />
        <div className="aeloria-quiz-detail-error-container">
          <div className="aeloria-qd-error-card">
            <span className="aeloria-qd-error-icon">⚠️</span>
            <h2>Quiz Not Found</h2>
            <p>{error || "This quiz may be currently unavailable or in draft mode."}</p>
            <Link to="/courses" className="aeloria-qd-back-btn">
              Browse Courses
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <CategoryBar />

      <main className="aeloria-quiz-detail-page">
        {/* Topbar navigation */}
        <div className="aeloria-qd-topbar">
          <div className="aeloria-qd-topbar-inner">
            <Link
              to={quiz.course ? `/courses/${quiz.course.slug || quiz.course._id}` : "/courses"}
              className="aeloria-qd-back-link"
            >
              ← Back to Course
            </Link>
            <span className="aeloria-qd-breadcrumb">
              {quiz.course?.title || "Course"} / {quiz.title}
            </span>
          </div>
        </div>

        <div className="aeloria-qd-container">
          {/* Main Card */}
          <div className="aeloria-qd-main-card">
            <div className="aeloria-qd-hero">
              <span className="aeloria-qd-course-tag">
                📚 {quiz.course?.title || "Assessment"}
              </span>
              <h1>{quiz.title}</h1>
              <p className="aeloria-qd-desc">
                {quiz.description ||
                  "Test your knowledge with this multiple-choice assessment designed to reinforce core programming principles."}
              </p>

              <div className="aeloria-qd-specs-grid">
                <div className="aeloria-qd-spec">
                  <span className="spec-icon">⏱</span>
                  <div>
                    <strong>{quiz.timeLimit} Minutes</strong>
                    <small>Time Limit</small>
                  </div>
                </div>

                <div className="aeloria-qd-spec">
                  <span className="spec-icon">❓</span>
                  <div>
                    <strong>{quiz.questionsCount || 20} MCQs</strong>
                    <small>Total Questions</small>
                  </div>
                </div>

                <div className="aeloria-qd-spec">
                  <span className="spec-icon">🎯</span>
                  <div>
                    <strong>{quiz.passingPercentage}%</strong>
                    <small>Passing Score</small>
                  </div>
                </div>

                <div className="aeloria-qd-spec">
                  <span className="spec-icon">📊</span>
                  <div>
                    <strong>{quiz.difficulty}</strong>
                    <small>Difficulty Level</small>
                  </div>
                </div>

                <div className="aeloria-qd-spec">
                  <span className="spec-icon">🔄</span>
                  <div>
                    <strong>
                      {quiz.maxAttempts === 0 ? "Unlimited" : `${quiz.maxAttempts} Max`}
                    </strong>
                    <small>Attempts Allowed</small>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="aeloria-qd-cta-area">
                {!isLoggedIn ? (
                  <Link to="/login" className="aeloria-qd-start-btn">
                    🔑 Log in to Start Quiz
                  </Link>
                ) : !canTake ? (
                  <div className="aeloria-qd-exhausted-badge">
                    ⚠️ You have reached the maximum allowed attempts ({quiz.maxAttempts}) for this quiz.
                  </div>
                ) : (
                  <Link
                    to={`/quiz/${quiz.slug || quiz._id}/take`}
                    className="aeloria-qd-start-btn"
                  >
                    🚀 {attempts.length > 0 ? "Retake Quiz" : "Start Quiz Now"}
                  </Link>
                )}
              </div>
            </div>

            {/* Rules Section */}
            <div className="aeloria-qd-rules-box">
              <h3>📋 Quiz Instructions & Rules</h3>
              <ul>
                <li>Each question has <strong>4 options</strong> with exactly <strong>one correct answer</strong>.</li>
                <li>The quiz is timed at <strong>{quiz.timeLimit} minutes</strong>. An active countdown timer will be displayed.</li>
                <li>When the timer expires, your answers will be <strong>automatically submitted</strong>.</li>
                <li>You need <strong>{quiz.passingPercentage}% or higher</strong> to pass.</li>
                <li>Detailed explanations for every question will be unlocked immediately after submission.</li>
              </ul>
            </div>
          </div>

          {/* Past Attempts Section */}
          {isLoggedIn && (
            <div className="aeloria-qd-attempts-card">
              <div className="aeloria-qd-attempts-header">
                <h2>Your Past Attempts</h2>
                <span className="aeloria-qd-attempt-counter">
                  {attempts.length} {attempts.length === 1 ? "attempt" : "attempts"} completed
                </span>
              </div>

              {attempts.length === 0 ? (
                <div className="aeloria-qd-no-attempts">
                  <span className="no-att-icon">🎯</span>
                  <p>You haven't attempted this quiz yet. Click <strong>Start Quiz Now</strong> above when you are ready!</p>
                </div>
              ) : (
                <div className="aeloria-qd-attempts-list">
                  {attempts.map((att, idx) => (
                    <div key={att._id} className="aeloria-qd-attempt-item">
                      <div className="att-left">
                        <span className="att-num">#{attempts.length - idx}</span>
                        <div>
                          <strong>{att.score} / {att.totalMarks || att.totalQuestions} Marks</strong>
                          <small>{formatDate(att.submittedAt)}</small>
                        </div>
                      </div>

                      <div className="att-right">
                        <span className="att-percent">{att.percentage}%</span>
                        <span className={`att-badge ${att.passed ? "passed" : "failed"}`}>
                          {att.passed ? "✓ Passed" : "✕ Failed"}
                        </span>
                        <small className="att-time">⏱ {formatSeconds(att.timeSpent)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default QuizDetail;

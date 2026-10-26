import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getUserProfile,
  getCourses,
  getAllStudentProgress,
} from "../../services/api";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const { user, token, isLoggedIn, loading: authLoading } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        if (token) {
          const [resProfile, resCourses, resProgress] = await Promise.allSettled([
            getUserProfile(token),
            getCourses(),
            getAllStudentProgress(token),
          ]);

          if (resProfile.status === "fulfilled" && resProfile.value?.user) {
            setProfileData(resProfile.value.user);
          }

          if (resCourses.status === "fulfilled") {
            const list = Array.isArray(resCourses.value?.courses)
              ? resCourses.value.courses
              : Array.isArray(resCourses.value?.data)
              ? resCourses.value.data
              : Array.isArray(resCourses.value)
              ? resCourses.value
              : [];
            setAvailableCourses(list);
          }

          if (resProgress.status === "fulfilled" && (resProgress.value?.progress || resProgress.value?.progressList)) {
            setProgressList(resProgress.value.progress || resProgress.value.progressList || []);
          }
        }
      } catch (err) {
        console.log("Could not load backend data; using cached auth data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn, token, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <main className="aeloria-dashboard-loading">
        <div className="aeloria-dash-spinner"></div>
        <p>Loading your learning dashboard...</p>
      </main>
    );
  }

  const currentUser = profileData || user;
  const enrolledCourses = currentUser?.enrolledCourses || [];
  const completedCourses = currentUser?.completedCourses || [];

  const avgCompletion =
    progressList.length > 0
      ? Math.round(
          progressList.reduce((acc, p) => acc + (p.completionPercentage || 0), 0) /
            progressList.length
        )
      : 0;

  return (
    <main className="aeloria-student-dashboard-page">
      <div className="aeloria-student-dashboard-layout">
        {/* =========================================
            LEFT COLUMN: STUDENT SIDEBAR
           ========================================= */}
        <aside className="aeloria-student-sidebar">
          {/* 1. Student Profile Card */}
          <div className="student-sidebar-card student-profile-card">
            <div className="student-profile-avatar">
              {currentUser?.firstName?.charAt(0) || "U"}
            </div>
            <h3 className="student-profile-name">
              {currentUser?.firstName} {currentUser?.lastName}
            </h3>
            <p className="student-profile-email">{currentUser?.email}</p>
            <div className="student-role-badge-wrap">
              <span className="student-role-badge">Student Account</span>
            </div>
            <div className="student-profile-actions">
              <Link to="/profile" className="student-edit-profile-btn">
                Edit Profile
              </Link>
            </div>
          </div>

          {/* 2. Quick AI Learning Shortcut */}
          <div className="student-sidebar-card student-ai-card">
            <div className="student-ai-card-icon">✦</div>
            <h3>Need an instant explanation?</h3>
            <p>
              Ask AELORIA AI to explain concepts, generate practice quizzes, or
              help you debug code.
            </p>
            <Link to="/ai-assistant" className="student-ai-card-btn">
              Ask Aeloria AI →
            </Link>
          </div>

          {/* 3. Quick Links Card */}
          <div className="student-sidebar-card student-links-card">
            <h4>Quick Links</h4>
            <ul className="student-quick-links">
              <li>
                <Link to="/practice">Coding Challenges</Link>
              </li>
              <li>
                <Link to="/notes">Free Revision Notes</Link>
              </li>
              <li>
                <Link to="/tutorials">Tutorials Library</Link>
              </li>
              <li>
                <Link to="/interview-preparation">Interview Preparation</Link>
              </li>
              <li>
                <Link to="/quizzes">Quizzes & Assessments</Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* =========================================
            RIGHT COLUMN: MAIN DASHBOARD CONTENT
           ========================================= */}
        <div className="aeloria-student-main">
          {/* Welcome Banner */}
          <section className="aeloria-student-welcome-banner">
            <div className="aeloria-student-welcome-info">
              <span className="aeloria-student-badge">STUDENT DASHBOARD</span>
              <h1>
                Welcome back, <span className="student-name-highlight">{currentUser?.firstName || "Learner"}</span>! 👋
              </h1>
              <p>
                Continue your programming journey. Practice concepts, learn new
                technologies, and ask AELORIA AI whenever you get stuck.
              </p>
            </div>

            <div className="aeloria-student-welcome-cta">
              <Link to="/quizzes" className="student-welcome-btn quiz-btn">
                🎯 Take Quizzes
              </Link>
              <Link to="/ai-assistant" className="student-welcome-btn ai-btn">
                ✦ Open AELORIA AI
              </Link>
              <Link to="/profile" className="student-welcome-btn profile-btn">
                Manage Profile
              </Link>
            </div>
          </section>

          {/* Overview Stats Grid */}
          <div className="aeloria-student-stats-grid">
            <div className="aeloria-student-stat-card">
              <div className="student-stat-icon-box">📚</div>
              <div className="student-stat-content">
                <strong>{progressList.length || enrolledCourses.length}</strong>
                <span>Active Courses</span>
              </div>
            </div>

            <div className="aeloria-student-stat-card">
              <div className="student-stat-icon-box">📈</div>
              <div className="student-stat-content">
                <strong>{avgCompletion}%</strong>
                <span>Average Progress</span>
              </div>
            </div>

            <div className="aeloria-student-stat-card">
              <div className="student-stat-icon-box">🏆</div>
              <div className="student-stat-content">
                <strong>
                  {progressList.filter((p) => p.isCompleted || p.completionPercentage === 100).length ||
                    completedCourses.length}
                </strong>
                <span>Completed Courses</span>
              </div>
            </div>

            <div className="aeloria-student-stat-card">
              <div className="student-stat-icon-box">⚡</div>
              <div className="student-stat-content">
                <strong>Active</strong>
                <span>Learning Status</span>
              </div>
            </div>
          </div>

          {/* My Learning Progress Section */}
          <div className="aeloria-dash-section">
            <div className="aeloria-dash-section-header">
              <h2>My Learning Progress</h2>
              <span style={{ fontSize: "13px", color: "#6b6478" }}>
                Real-time tracking of lessons & quizzes
              </span>
            </div>

            {progressList.length > 0 ? (
              <div className="aeloria-progress-list">
                {progressList.map((c) => (
                  <div key={c.courseId || c.courseSlug} className="aeloria-progress-card">
                    <div className="aeloria-progress-card-header">
                      <div>
                        <div className="aeloria-progress-tags">
                          <span className="aeloria-progress-cat-tag">
                            {c.courseCategory || c.category || "Programming"}
                          </span>
                          <span className="aeloria-progress-level-tag">
                            {c.courseLevel || c.level || "Beginner"}
                          </span>
                        </div>
                        <h3>{c.courseTitle}</h3>
                      </div>
                      <span
                        className={`aeloria-progress-status-badge ${
                          c.isCompleted || c.completionPercentage === 100
                            ? "completed"
                            : "in-progress"
                        }`}
                      >
                        {c.isCompleted || c.completionPercentage === 100
                          ? "✓ Completed"
                          : "● In Progress"}
                      </span>
                    </div>

                    <div className="aeloria-progress-metrics">
                      <div className="aeloria-progress-meta-top">
                        <span>Course Completion</span>
                        <strong>{c.completionPercentage}%</strong>
                      </div>
                      <div className="aeloria-progress-track">
                        <div
                          className="aeloria-progress-fill"
                          style={{ width: `${c.completionPercentage}%` }}
                        ></div>
                      </div>
                      <div className="aeloria-progress-counts">
                        <span>
                          <strong>{c.completedLessons ?? c.completedCount ?? 0}</strong> of{" "}
                          <strong>{c.totalLessons}</strong> lessons completed
                        </span>
                        <span>
                          {c.remainingLessons === 0
                            ? "All lessons finished! 🎉"
                            : `${c.remainingLessons} lessons remaining`}
                        </span>
                      </div>
                    </div>

                    <div className="aeloria-progress-quiz-box">
                      <div className="aeloria-quiz-box-title">
                        <span>🎯</span> Quiz Performance
                      </div>
                      {c.quizSummary && c.quizSummary.attemptsCount > 0 ? (
                        <div className="aeloria-quiz-scores-grid">
                          <div className="aeloria-quiz-score-item">
                            <small>Latest Quiz Score</small>
                            <strong>
                              {c.quizSummary.latestScore}/{c.quizSummary.latestTotal} (
                              {c.quizSummary.latestPercentage}%)
                              <span
                                className={`aeloria-score-badge ${
                                  c.quizSummary.latestPassed ? "pass" : "fail"
                                }`}
                              >
                                {c.quizSummary.latestPassed
                                  ? "Passed ✓"
                                  : "Needs Practice"}
                              </span>
                            </strong>
                          </div>
                          <div className="aeloria-quiz-score-item">
                            <small>Best Quiz Score</small>
                            <strong>
                              {c.quizSummary.bestScore}/{c.quizSummary.bestTotal} (
                              {c.quizSummary.bestPercentage}%)
                              <span className="aeloria-score-badge pass">
                                Best 🏆
                              </span>
                            </strong>
                          </div>
                        </div>
                      ) : (
                        <div className="aeloria-progress-no-quiz">
                          <span>No quiz attempted yet for this course.</span>
                          <Link to="/quizzes">Take Course Quiz →</Link>
                        </div>
                      )}
                    </div>

                    <div className="aeloria-progress-card-actions">
                      <Link
                        to={`/courses/${c.courseSlug}?lesson=${
                          c.nextIncompleteLesson ?? 0
                        }`}
                        className="aeloria-continue-learning-btn"
                      >
                        Continue Learning →
                      </Link>
                      <Link to="/quizzes" className="aeloria-progress-quiz-link">
                        Take Quiz 🎯
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="aeloria-dash-empty-card">
                <span className="empty-icon">📖</span>
                <h3>Start Learning Today</h3>
                <p>
                  You haven't started any lessons yet. Dive into Python
                  Programming for Beginners to begin tracking your progress!
                </p>
                <Link
                  to="/courses/python-programming-for-beginners"
                  className="dash-browse-btn"
                >
                  Start Python Course →
                </Link>
              </div>
            )}
          </div>

          {/* Available Courses Catalog */}
          {availableCourses.length > 0 && (
            <div className="aeloria-dash-section">
              <div className="aeloria-dash-section-header">
                <h2>Available Courses & Curriculum</h2>
                <Link to="/courses">Browse All Courses →</Link>
              </div>

              <div className="aeloria-dash-courses-grid">
                {availableCourses.map((c) => (
                  <div key={c._id || c.slug} className="aeloria-dash-course-item">
                    <span className="dash-course-cat">{c.category || "Programming"}</span>
                    <h3>{c.title}</h3>
                    <p>{c.duration || "Structured learning"} • {c.level || "Beginner"}</p>
                    <Link
                      to={`/courses/${c.slug || c._id}`}
                      className="dash-continue-btn"
                    >
                      Start Learning →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Learning & Recommended Pathways */}
          <div className="aeloria-dash-section">
            <div className="aeloria-dash-section-header">
              <h2>Recent Learning & Recommended Pathways</h2>
            </div>

            <div className="aeloria-dash-pathways-grid">
              <div className="aeloria-dash-pathway-card">
                <div className="pathway-icon">🐍</div>
                <div className="pathway-info">
                  <h4>Python Programming for Beginners</h4>
                  <p>Variables, control flow, functions, dictionaries, and file handling.</p>
                  <Link to="/courses/python-programming-for-beginners">Open Course →</Link>
                </div>
              </div>

              <div className="aeloria-dash-pathway-card">
                <div className="pathway-icon">⚡</div>
                <div className="pathway-info">
                  <h4>Complete C Programming</h4>
                  <p>Beginner fundamentals, pointers, functions, and memory management.</p>
                  <Link to="/courses/c-programming">Open Course →</Link>
                </div>
              </div>

              <div className="aeloria-dash-pathway-card">
                <div className="pathway-icon">💻</div>
                <div className="pathway-info">
                  <h4>Data Structures & Algorithms</h4>
                  <p>Binary Search, Linked Lists, Stacks, Queues, and dynamic problem solving.</p>
                  <Link to="/practice">Practice DSA →</Link>
                </div>
              </div>

              <div className="aeloria-dash-pathway-card">
                <div className="pathway-icon">🌐</div>
                <div className="pathway-info">
                  <h4>MERN Stack Development</h4>
                  <p>Full-stack web applications with MongoDB, Express, React, and Node.js.</p>
                  <Link to="/courses/mern-stack">Explore MERN →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default StudentDashboard;

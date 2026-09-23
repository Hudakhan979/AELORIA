import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../services/api";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const { user, token, isLoggedIn, loading: authLoading } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        if (token) {
          const res = await getUserProfile(token);
          if (res?.user) {
            setProfileData(res.user);
          }
        }
      } catch (err) {
        console.log("Could not load backend user profile; using cached auth data");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
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

  return (
    <main className="aeloria-dashboard-page">
      {/* Top Banner */}
      <section className="aeloria-dashboard-hero">
        <div className="aeloria-dashboard-hero-container">
          <div className="aeloria-dashboard-welcome">
            <span className="aeloria-dash-badge">STUDENT DASHBOARD</span>
            <h1>
              Welcome back, <span>{currentUser?.firstName || "Learner"}</span>! 👋
            </h1>
            <p>
              Continue your programming journey. Practice concepts, learn new
              technologies, and ask AELORIA AI whenever you get stuck.
            </p>
          </div>

          <div className="aeloria-dashboard-hero-cta">
            <Link to="/ai-assistant" className="aeloria-dash-ai-btn">
              ✦ Open AELORIA AI
            </Link>
            <Link to="/profile" className="aeloria-dash-profile-btn">
              Manage Profile
            </Link>
          </div>
        </div>
      </section>

      <div className="aeloria-dashboard-container">
        {/* Main Content Area */}
        <section className="aeloria-dashboard-content">
          {/* Overview Stats */}
          <div className="aeloria-dash-stats-grid">
            <div className="aeloria-dash-stat-card">
              <span className="dash-stat-icon">📚</span>
              <div>
                <strong>{enrolledCourses.length}</strong>
                <span>Enrolled Courses</span>
              </div>
            </div>

            <div className="aeloria-dash-stat-card">
              <span className="dash-stat-icon">🏆</span>
              <div>
                <strong>{completedCourses.length}</strong>
                <span>Completed Courses</span>
              </div>
            </div>

            <div className="aeloria-dash-stat-card">
              <span className="dash-stat-icon">⚡</span>
              <div>
                <strong>Active</strong>
                <span>Learning Status</span>
              </div>
            </div>
          </div>

          {/* Enrolled Courses Section */}
          <div className="aeloria-dash-section">
            <div className="aeloria-dash-section-header">
              <h2>My Enrolled Courses</h2>
              <Link to="/courses">Explore More Courses →</Link>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="aeloria-dash-courses-grid">
                {enrolledCourses.map((c) => (
                  <div key={c._id || c.slug} className="aeloria-dash-course-item">
                    <span className="dash-course-cat">{c.category || "Programming"}</span>
                    <h3>{c.title}</h3>
                    <p>{c.duration || "Structured learning"}</p>
                    <Link
                      to={`/courses/${c.slug || c._id}`}
                      className="dash-continue-btn"
                    >
                      Continue Learning →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="aeloria-dash-empty-card">
                <span className="empty-icon">📖</span>
                <h3>No enrolled courses yet</h3>
                <p>
                  Explore our curriculum and start learning your first
                  programming language or tech stack today!
                </p>
                <Link to="/courses" className="dash-browse-btn">
                  Browse Courses
                </Link>
              </div>
            )}
          </div>

          {/* Recent Learning & Practice Roadmap */}
          <div className="aeloria-dash-section">
            <div className="aeloria-dash-section-header">
              <h2>Recent Learning & Recommended Pathways</h2>
            </div>

            <div className="aeloria-dash-pathways-grid">
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
        </section>

        {/* Sidebar */}
        <aside className="aeloria-dashboard-sidebar">
          {/* Profile Card */}
          <div className="aeloria-dash-sidebar-card">
            <div className="dash-profile-avatar">
              {currentUser?.firstName?.charAt(0) || "U"}
            </div>
            <h3>
              {currentUser?.firstName} {currentUser?.lastName}
            </h3>
            <p className="dash-user-email">{currentUser?.email}</p>
            <span className="dash-user-role-badge">Student Account</span>
            <div className="dash-profile-actions">
              <Link to="/profile">Edit Profile</Link>
            </div>
          </div>

          {/* Quick AI Learning Shortcut */}
          <div className="aeloria-dash-sidebar-card ai-card">
            <div className="ai-icon-large">✦</div>
            <h3>Need an instant explanation?</h3>
            <p>
              Ask AELORIA AI to explain concepts, generate practice quizzes, or
              help you debug code.
            </p>
            <Link to="/ai-assistant" className="dash-sidebar-ai-btn">
              Ask Aeloria AI →
            </Link>
          </div>

          {/* Quick Links */}
          <div className="aeloria-dash-sidebar-card">
            <h4>Quick Links</h4>
            <ul className="dash-quick-links">
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
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default StudentDashboard;

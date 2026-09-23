import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAdminDashboardData } from "../../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { admin, adminToken, token, loading: authLoading, adminLogout } = useAuth();
  const effectiveToken = adminToken || token;

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!admin || !effectiveToken || admin.role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminDashboardData(effectiveToken);

        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard Error:", error);
        setError(error.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [admin, effectiveToken, authLoading, navigate]);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  const getCount = (data) => {
    if (!data) return 0;

    if (typeof data.count === "number") {
      return data.count;
    }

    if (Array.isArray(data.courses)) return data.courses.length;
    if (Array.isArray(data.tutorials)) return data.tutorials.length;
    if (Array.isArray(data.notes)) return data.notes.length;
    if (Array.isArray(data.problems)) return data.problems.length;
    if (Array.isArray(data.practice)) return data.practice.length;
    if (Array.isArray(data.users)) return data.users.length;
    if (Array.isArray(data.categories)) return data.categories.length;
    if (Array.isArray(data.languages)) return data.languages.length;

    if (Array.isArray(data.data)) {
      return data.data.length;
    }

    if (Array.isArray(data)) {
      return data.length;
    }

    return 0;
  };

  const coursesCount = getCount(dashboardData?.courses);
  const tutorialsCount = getCount(dashboardData?.tutorials);
  const notesCount = getCount(dashboardData?.notes);
  const practiceCount = getCount(dashboardData?.practice);
  const usersCount = getCount(dashboardData?.users);

  const getItems = (data) => {
    if (!data) return [];

    if (Array.isArray(data.courses)) return data.courses;
    if (Array.isArray(data.tutorials)) return data.tutorials;
    if (Array.isArray(data.notes)) return data.notes;
    if (Array.isArray(data.problems)) return data.problems;
    if (Array.isArray(data.practice)) return data.practice;
    if (Array.isArray(data.users)) return data.users;
    if (Array.isArray(data.categories)) return data.categories;
    if (Array.isArray(data.languages)) return data.languages;

    if (Array.isArray(data.data)) {
      return data.data;
    }

    if (Array.isArray(data)) {
      return data;
    }

    return [];
  };

  const allContent = [
    ...getItems(dashboardData?.courses),
    ...getItems(dashboardData?.tutorials),
    ...getItems(dashboardData?.notes),
    ...getItems(dashboardData?.practice),
  ];

  const publishedContent = allContent.filter(
    (item) => item.status === "published"
  ).length;

  const publishedPercentage =
    allContent.length > 0
      ? Math.round((publishedContent / allContent.length) * 100)
      : 0;

  const recentActivities = allContent
    .filter((item) => item.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getActivityType = (item) => {
    if (item.lessons) return "Course";
    if (item.topics) return "Tutorial";
    if (item.content) return "Note";
    if (item.testCases || item.difficulty) return "Practice";

    return "Content";
  };

  if (authLoading || loading) {
    return (
      <main className="aeloria-admin-dashboard">
        <div className="aeloria-dashboard-loading">
          <div className="aeloria-dashboard-spinner"></div>
          <h2>Loading Dashboard...</h2>
          <p>Fetching the latest Aeloria data.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="aeloria-admin-dashboard">
        <div className="aeloria-dashboard-error">
          <div className="aeloria-dashboard-error-icon">!</div>
          <h2>Unable to Load Dashboard</h2>
          <p>{error}</p>

          <button
            className="aeloria-dashboard-retry"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="aeloria-admin-dashboard">
      {/* SIDEBAR */}
      <aside className="aeloria-dashboard-sidebar">
        <div className="aeloria-dashboard-logo">
          <div className="aeloria-dashboard-logo-icon">A</div>

          <div>
            <h2>AELORIA</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="aeloria-dashboard-nav">
          <Link
            to="/admin/dashboard"
            className="aeloria-dashboard-nav-item active"
          >
            <span>▦</span>
            Dashboard
          </Link>

          <Link to="/admin/courses" className="aeloria-dashboard-nav-item">
            <span>📚</span>
            Courses
          </Link>

          <Link to="/admin/tutorials" className="aeloria-dashboard-nav-item">
            <span>📖</span>
            Tutorials
          </Link>

          <Link to="/admin/notes" className="aeloria-dashboard-nav-item">
            <span>📝</span>
            Notes
          </Link>

          <Link to="/admin/practice" className="aeloria-dashboard-nav-item">
            <span>💻</span>
            Practice
          </Link>

          <Link to="/admin/categories" className="aeloria-dashboard-nav-item">
            <span>🗂️</span>
            Categories
          </Link>

          <Link to="/admin/languages" className="aeloria-dashboard-nav-item">
            <span>🌐</span>
            Languages
          </Link>

          <Link to="/admin/users" className="aeloria-dashboard-nav-item">
            <span>👥</span>
            Users
          </Link>

          <Link to="/admin/mentors" className="aeloria-dashboard-nav-item">
            <span>👨‍🏫</span>
            Mentors
          </Link>

          <Link to="/admin/settings" className="aeloria-dashboard-nav-item">
            <span>⚙️</span>
            Settings
          </Link>
        </nav>

        <div className="aeloria-dashboard-sidebar-bottom">
          <button
            className="aeloria-dashboard-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="aeloria-dashboard-main">
        {/* HEADER */}
        <header className="aeloria-dashboard-header">
          <div>
            <span className="aeloria-dashboard-header-label">
              ADMINISTRATION
            </span>

            <h1>Dashboard</h1>
          </div>

          <div className="aeloria-dashboard-admin">
            <div className="aeloria-dashboard-admin-avatar">
              {admin?.firstName?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {admin?.firstName || "Admin"}{" "}
                {admin?.lastName || ""}
              </strong>

              <span>Administrator</span>
            </div>
          </div>
        </header>

        {/* WELCOME */}
        <section className="aeloria-dashboard-welcome">
          <div>
            <span>WELCOME BACK 👋</span>

            <h2>
              Hello, {admin?.firstName || "Admin"}!
            </h2>

            <p>
              Here's what's happening across your Aeloria learning platform.
            </p>
          </div>

          <div className="aeloria-dashboard-welcome-icon">
            ✨
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="aeloria-dashboard-inline-error">
            {error}
          </div>
        )}

        {/* STATS */}
        <section className="aeloria-dashboard-stats">
          <div className="aeloria-dashboard-stat-card">
            <div className="aeloria-dashboard-stat-icon">📚</div>

            <div>
              <span>Total Courses</span>
              <strong>{coursesCount}</strong>
            </div>
          </div>

          <div className="aeloria-dashboard-stat-card">
            <div className="aeloria-dashboard-stat-icon">📖</div>

            <div>
              <span>Total Tutorials</span>
              <strong>{tutorialsCount}</strong>
            </div>
          </div>

          <div className="aeloria-dashboard-stat-card">
            <div className="aeloria-dashboard-stat-icon">👥</div>

            <div>
              <span>Registered Users</span>
              <strong>{usersCount}</strong>
            </div>
          </div>

          <div className="aeloria-dashboard-stat-card">
            <div className="aeloria-dashboard-stat-icon">💻</div>

            <div>
              <span>Practice Problems</span>
              <strong>{practiceCount}</strong>
            </div>
          </div>
        </section>

        {/* CONTENT AREA */}
        <section className="aeloria-dashboard-content-grid">
          {/* RECENT ACTIVITY */}
          <div className="aeloria-dashboard-panel">
            <div className="aeloria-dashboard-panel-header">
              <div>
                <span>ACTIVITY</span>
                <h2>Recent Content</h2>
              </div>

              <span className="aeloria-dashboard-live-badge">
                ● LIVE
              </span>
            </div>

            <div className="aeloria-dashboard-activity-list">
              {recentActivities.length > 0 ? (
                recentActivities.map((item, index) => (
                  <div
                    className="aeloria-dashboard-activity"
                    key={item._id || index}
                  >
                    <div className="aeloria-dashboard-activity-icon">
                      {getActivityType(item) === "Course"
                        ? "📚"
                        : getActivityType(item) === "Tutorial"
                        ? "📖"
                        : getActivityType(item) === "Note"
                        ? "📝"
                        : "💻"}
                    </div>

                    <div className="aeloria-dashboard-activity-info">
                      <strong>{item.title}</strong>

                      <span>
                        {getActivityType(item)} •{" "}
                        {item.status || "draft"}
                      </span>
                    </div>

                    <time>{formatDate(item.createdAt)}</time>
                  </div>
                ))
              ) : (
                <div className="aeloria-dashboard-empty">
                  No recent content available.
                </div>
              )}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="aeloria-dashboard-panel">
            <div className="aeloria-dashboard-panel-header">
              <div>
                <span>MANAGE</span>
                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="aeloria-dashboard-actions">
              <Link
                to="/admin/courses/add"
                className="aeloria-dashboard-action"
              >
                <span>📚</span>
                <div>
                  <strong>Add Course</strong>
                  <small>Create a new course</small>
                </div>
                <b>→</b>
              </Link>

              <Link
                to="/admin/tutorials/add"
                className="aeloria-dashboard-action"
              >
                <span>📖</span>
                <div>
                  <strong>Add Tutorial</strong>
                  <small>Create a new tutorial</small>
                </div>
                <b>→</b>
              </Link>

              <Link
                to="/admin/notes/add"
                className="aeloria-dashboard-action"
              >
                <span>📝</span>
                <div>
                  <strong>Add Notes</strong>
                  <small>Upload learning notes</small>
                </div>
                <b>→</b>
              </Link>

              <Link
                to="/admin/practice/add"
                className="aeloria-dashboard-action"
              >
                <span>💻</span>
                <div>
                  <strong>Add Practice</strong>
                  <small>Create coding problems</small>
                </div>
                <b>→</b>
              </Link>
            </div>
          </div>
        </section>

        {/* PLATFORM STATUS */}
        <section className="aeloria-dashboard-platform">
          <div className="aeloria-dashboard-platform-header">
            <div>
              <span>PLATFORM</span>
              <h2>System Status</h2>
            </div>

            <span className="aeloria-dashboard-status-good">
              ● All Systems Operational
            </span>
          </div>

          <div className="aeloria-dashboard-status-grid">
            <div className="aeloria-dashboard-status-item">
              <span className="aeloria-dashboard-status-dot"></span>
              <div>
                <strong>Website</strong>
                <small>Operational</small>
              </div>
            </div>

            <div className="aeloria-dashboard-status-item">
              <span className="aeloria-dashboard-status-dot"></span>
              <div>
                <strong>API Server</strong>
                <small>Connected</small>
              </div>
            </div>

            <div className="aeloria-dashboard-status-item">
              <span className="aeloria-dashboard-status-dot"></span>
              <div>
                <strong>MongoDB</strong>
                <small>Connected</small>
              </div>
            </div>

            <div className="aeloria-dashboard-status-item">
              <span className="aeloria-dashboard-status-dot"></span>
              <div>
                <strong>Aeloria AI</strong>
                <small>Available</small>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT STATUS */}
        <section className="aeloria-dashboard-publishing">
          <div>
            <span>CONTENT STATUS</span>
            <h2>Published Content</h2>
          </div>

          <div className="aeloria-dashboard-progress-wrapper">
            <div className="aeloria-dashboard-progress">
              <span
                style={{
                  width: `${publishedPercentage}%`,
                }}
              ></span>
            </div>

            <strong>{publishedPercentage}%</strong>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="aeloria-dashboard-footer">
          <span>© 2026 AELORIA</span>
          <span>Learn. Practice. Build.</span>
        </footer>
      </section>
    </main>
  );
}

export default Dashboard;
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const { user, token, isLoggedIn, logout, adminToken } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setOpenMenu(null);
    logout();
    navigate("/");
  };

  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName ? user.firstName[0].toUpperCase() : "";
    const last = user.lastName ? user.lastName[0].toUpperCase() : "";
    return first + last || "U";
  };

  return (
    <header className="navbar" ref={navRef}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setOpenMenu(null)}>
          <div className="logo-icon">A</div>

          <div className="logo-text">
            <span className="logo-name">AELORIA</span>
            <span className="logo-tagline">Learn. Practice. Build.</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-menu">
          {/* Courses */}
          <div className="nav-dropdown">
            <button
              className={`nav-link ${openMenu === "courses" ? "active" : ""}`}
              onClick={() => toggleMenu("courses")}
              type="button"
            >
              Courses <span>⌄</span>
            </button>

            {openMenu === "courses" && (
              <div className="dropdown-menu">
                <Link to="/courses" onClick={() => setOpenMenu(null)}>
                  All Courses
                </Link>
                <Link
                  to="/courses?type=popular"
                  onClick={() => setOpenMenu(null)}
                >
                  Popular Courses
                </Link>
                <Link
                  to="/courses?type=free"
                  onClick={() => setOpenMenu(null)}
                >
                  Free Courses
                </Link>
                <Link
                  to="/courses?type=categories"
                  onClick={() => setOpenMenu(null)}
                >
                  Categories
                </Link>
              </div>
            )}
          </div>

          {/* Tutorials */}
          <div className="nav-dropdown">
            <button
              className={`nav-link ${openMenu === "tutorials" ? "active" : ""}`}
              onClick={() => toggleMenu("tutorials")}
              type="button"
            >
              Tutorials <span>⌄</span>
            </button>

            {openMenu === "tutorials" && (
              <div className="dropdown-menu">
                <Link to="/tutorials" onClick={() => setOpenMenu(null)}>
                  All Tutorials
                </Link>
                <Link to="/programming" onClick={() => setOpenMenu(null)}>
                  Programming
                </Link>
                <Link to="/web-development" onClick={() => setOpenMenu(null)}>
                  Web Development
                </Link>
                <Link to="/dsa" onClick={() => setOpenMenu(null)}>
                  DSA
                </Link>
                <Link to="/ai-ml" onClick={() => setOpenMenu(null)}>
                  AI & ML
                </Link>
                <Link to="/data-science" onClick={() => setOpenMenu(null)}>
                  Data Science
                </Link>
                <Link to="/devops" onClick={() => setOpenMenu(null)}>
                  DevOps
                </Link>
              </div>
            )}
          </div>

          {/* Practice */}
          <div className="nav-dropdown">
            <button
              className={`nav-link ${openMenu === "practice" ? "active" : ""}`}
              onClick={() => toggleMenu("practice")}
              type="button"
            >
              Practice <span>⌄</span>
            </button>

            {openMenu === "practice" && (
              <div className="dropdown-menu">
                <Link to="/practice" onClick={() => setOpenMenu(null)}>
                  Practice Problems
                </Link>
                <Link to="/practice/coding" onClick={() => setOpenMenu(null)}>
                  Coding Challenges
                </Link>
                <Link to="/practice/quiz" onClick={() => setOpenMenu(null)}>
                  Quizzes
                </Link>
                <Link to="/practice/mock-tests" onClick={() => setOpenMenu(null)}>
                  Mock Tests
                </Link>
              </div>
            )}
          </div>

          {/* Free Revision Notes */}
          <Link
            className="nav-link"
            to="/notes"
            onClick={() => setOpenMenu(null)}
          >
            Free Notes
          </Link>

          {/* Interview */}
          <Link
            className="nav-link"
            to="/interview-preparation"
            onClick={() => setOpenMenu(null)}
          >
            Interview Prep
          </Link>

          {/* AI Assistant */}
          <Link
            className="nav-link ai-nav-link"
            to="/ai-assistant"
            onClick={() => setOpenMenu(null)}
          >
            <span className="ai-star">✦</span>
            AI Assistant
          </Link>
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <button
            className="search-button"
            aria-label="Search"
            type="button"
            onClick={() => {
              setOpenMenu(null);
              navigate("/search");
            }}
          >
            🔍
          </button>

          {isLoggedIn ? (
            <div className="nav-user-dropdown">
              <button
                className="user-profile-btn"
                type="button"
                onClick={() => toggleMenu("user")}
                aria-label="User Account Menu"
              >
                <div className="user-avatar-badge">{getInitials()}</div>
                <span className="user-display-name">
                  {user?.firstName || "Account"}
                </span>
                <span className="user-caret">⌄</span>
              </button>

              {openMenu === "user" && (
                <div className="dropdown-menu user-dropdown-menu">
                  <div className="user-menu-header">
                    <p className="user-menu-name">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="user-menu-email">{user?.email}</p>
                    <span className="user-menu-role">Student</span>
                  </div>
                  <hr className="user-menu-divider" />
                  <Link
                    to="/dashboard"
                    onClick={() => setOpenMenu(null)}
                    className="user-menu-link"
                  >
                    📊 My Learning Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setOpenMenu(null)}
                    className="user-menu-link"
                  >
                    👤 Profile Settings
                  </Link>
                  <Link
                    to="/notes"
                    onClick={() => setOpenMenu(null)}
                    className="user-menu-link"
                  >
                    📝 Revision Notes
                  </Link>
                  <Link
                    to="/practice"
                    onClick={() => setOpenMenu(null)}
                    className="user-menu-link"
                  >
                    ⚡ Practice Challenges
                  </Link>
                  {adminToken && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setOpenMenu(null)}
                      className="user-menu-link admin-link"
                    >
                      🛡️ Admin Portal
                    </Link>
                  )}
                  <hr className="user-menu-divider" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="user-menu-logout"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-action-group">
              <Link to="/login" className="login-button">
                Login
              </Link>
            </div>
          )}

          <button
            className="mobile-menu-button"
            onClick={() => toggleMenu("mobile")}
            aria-label="Open menu"
            type="button"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {openMenu === "mobile" && (
        <div className="mobile-menu">
          {isLoggedIn && (
            <div className="mobile-user-greeting">
              <div className="user-avatar-badge">{getInitials()}</div>
              <div>
                <strong>
                  {user?.firstName} {user?.lastName}
                </strong>
                <span>{user?.email}</span>
              </div>
            </div>
          )}

          <Link to="/courses" onClick={() => setOpenMenu(null)}>
            Courses
          </Link>
          <Link to="/tutorials" onClick={() => setOpenMenu(null)}>
            Tutorials
          </Link>
          <Link to="/practice" onClick={() => setOpenMenu(null)}>
            Practice
          </Link>
          <Link to="/notes" onClick={() => setOpenMenu(null)}>
            Free Notes
          </Link>
          <Link to="/interview-preparation" onClick={() => setOpenMenu(null)}>
            Interview Prep
          </Link>
          <Link
            to="/ai-assistant"
            className="mobile-ai-link"
            onClick={() => setOpenMenu(null)}
          >
            ✦ Aeloria AI Assistant
          </Link>

          {isLoggedIn ? (
            <>
              <hr className="mobile-menu-divider" />
              <Link to="/dashboard" onClick={() => setOpenMenu(null)}>
                📊 My Dashboard
              </Link>
              <Link to="/profile" onClick={() => setOpenMenu(null)}>
                👤 Profile Settings
              </Link>
              {adminToken && (
                <Link to="/admin/dashboard" onClick={() => setOpenMenu(null)}>
                  🛡️ Admin Portal
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="mobile-logout-btn"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <hr className="mobile-menu-divider" />
              <Link to="/login" onClick={() => setOpenMenu(null)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setOpenMenu(null)}>
                Create Free Account
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
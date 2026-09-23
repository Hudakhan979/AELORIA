import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../../services/api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { user, token, isLoggedIn, updateUser, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
  });

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

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
            setFormData({
              firstName: res.user.firstName || "",
              lastName: res.user.lastName || "",
              email: res.user.email || "",
              profileImage: res.user.profileImage || "",
            });
            setEnrolledCourses(res.user.enrolledCourses || []);
            setCompletedCourses(res.user.completedCourses || []);
          } else if (user) {
            setFormData({
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              email: user.email || "",
              profileImage: user.profileImage || "",
            });
          }
        } else if (user) {
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            profileImage: user.profileImage || "",
          });
        }
      } catch (err) {
        if (user) {
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            profileImage: user.profileImage || "",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isLoggedIn, token, user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      if (token) {
        const res = await updateUserProfile(
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            profileImage: formData.profileImage,
          },
          token
        );

        if (res?.success) {
          updateUser({
            firstName: formData.firstName,
            lastName: formData.lastName,
            profileImage: formData.profileImage,
          });
          setMessage({
            type: "success",
            text: "Profile updated successfully!",
          });
        } else {
          setMessage({
            type: "error",
            text: res?.message || "Failed to update profile.",
          });
        }
      } else {
        updateUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        setMessage({
          type: "success",
          text: "Profile updated locally.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to save profile changes.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="aeloria-profile-loading">
        <div className="aeloria-profile-spinner"></div>
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="aeloria-profile-page">
      <div className="aeloria-profile-container">
        {/* Header */}
        <div className="aeloria-profile-header">
          <div className="aeloria-profile-avatar-large">
            {formData.firstName ? formData.firstName.charAt(0) : "A"}
          </div>
          <div className="aeloria-profile-header-info">
            <span className="aeloria-profile-tag">STUDENT ACCOUNT</span>
            <h1>
              {formData.firstName} {formData.lastName}
            </h1>
            <p className="aeloria-profile-email-text">{formData.email}</p>
          </div>
        </div>

        {message.text && (
          <div
            className={`aeloria-profile-alert ${
              message.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="aeloria-profile-grid">
          {/* Left Form: Edit Profile */}
          <section className="aeloria-profile-card">
            <h2>Personal Information</h2>
            <p className="card-subtitle">
              Manage your personal name and profile information.
            </p>

            <form onSubmit={handleSubmit} className="aeloria-profile-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  disabled
                  value={formData.email}
                  className="input-disabled"
                />
                <small className="help-text">Email address is read-only.</small>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={saving}
                  className="aeloria-profile-save-btn"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>

          {/* Right Info: Enrolled & Completed Courses */}
          <aside className="aeloria-profile-sidebar">
            <div className="aeloria-profile-card">
              <h3>Enrolled Courses ({enrolledCourses.length})</h3>
              {enrolledCourses.length > 0 ? (
                <ul className="profile-course-list">
                  {enrolledCourses.map((c) => (
                    <li key={c._id || c.slug} className="profile-course-item">
                      <span className="course-cat">{c.category}</span>
                      <h4>{c.title}</h4>
                      <Link to={`/courses/${c.slug || c._id}`}>Go to Course →</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="profile-empty-section">
                  <p>You have not enrolled in any courses yet.</p>
                  <Link to="/courses" className="profile-link-btn">
                    Explore Courses
                  </Link>
                </div>
              )}
            </div>

            <div className="aeloria-profile-card">
              <h3>Completed Courses ({completedCourses.length})</h3>
              {completedCourses.length > 0 ? (
                <ul className="profile-course-list">
                  {completedCourses.map((c) => (
                    <li key={c._id || c.slug} className="profile-course-item">
                      <span className="course-cat done">Completed</span>
                      <h4>{c.title}</h4>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="profile-empty-section">
                  <p>Complete course topics to earn completion badges here.</p>
                </div>
              )}
            </div>

            <div className="aeloria-profile-card ai-shortcut-card">
              <h4>AELORIA AI Helper</h4>
              <p>Practice learning topics or ask questions about your coursework.</p>
              <Link to="/ai-assistant" className="profile-ai-btn">
                ✦ Ask AELORIA AI
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Profile;

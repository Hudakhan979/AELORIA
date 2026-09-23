import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAdminCourses,
  createCourse,
  deleteCourse,
  toggleCourseStatus,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./AdminCourses.css";

function AdminCourses() {
  const navigate = useNavigate();
  const { admin, token, loading: authLoading } = useAuth();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Programming",
    level: "Beginner",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD COURSES
     ===================================================== */

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminCourses(token);

      const courseList = Array.isArray(response?.courses)
        ? response.courses
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

      setCourses(courseList);
    } catch (error) {
      console.error("Admin Courses Error:", error);
      setError(error.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!admin || !token) {
      navigate("/admin/login");
      return;
    }

    loadCourses();
  }, [admin, token, authLoading, navigate]);

  /* =====================================================
     FORM CHANGE
     ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     ADD COURSE
     ===================================================== */

  const handleCreateCourse = async () => {
    if (!formData.title.trim()) {
      alert("Please enter course title.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter course description.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createCourse(
        {
          title: formData.title.trim(),
          category: formData.category,
          level: formData.level,
          description: formData.description.trim(),
          status: "draft",
        },
        token
      );

      setFormData({
        title: "",
        category: "Programming",
        level: "Beginner",
        description: "",
      });

      setShowModal(false);

      await loadCourses();
    } catch (error) {
      console.error("Create Course Error:", error);
      setError(error.message || "Failed to create course.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE COURSE
     ===================================================== */

  const handleDeleteCourse = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmDelete) return;

    try {
      setError("");

      await deleteCourse(id, token);

      setCourses((previous) =>
        previous.filter((course) => course._id !== id)
      );
    } catch (error) {
      console.error("Delete Course Error:", error);
      setError(error.message || "Failed to delete course.");
    }
  };

  /* =====================================================
     TOGGLE STATUS
     ===================================================== */

  const handleToggleStatus = async (id) => {
    try {
      setError("");

      const response = await toggleCourseStatus(id, token);

      const updatedCourse =
        response?.course ||
        response?.data ||
        null;

      if (updatedCourse?._id) {
        setCourses((previous) =>
          previous.map((course) =>
            course._id === id ? updatedCourse : course
          )
        );
      } else {
        await loadCourses();
      }
    } catch (error) {
      console.error("Toggle Course Status Error:", error);
      setError(error.message || "Failed to update course status.");
    }
  };

  /* =====================================================
     FILTER
     ===================================================== */

  const filteredCourses = courses.filter((course) => {
    const title = course.title || "";
    const category = course.category || "";
    const status = course.status || "";

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      status.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const publishedCount = courses.filter(
    (course) => course.status?.toLowerCase() === "published"
  ).length;

  const draftCount = courses.filter(
    (course) => course.status?.toLowerCase() === "draft"
  ).length;

  /* =====================================================
     LOADING
     ===================================================== */

  if (authLoading || loading) {
    return (
      <main className="aeloria-admin-courses">
        <div className="aeloria-admin-courses-empty">
          <div>📚</div>
          <h3>Loading Courses...</h3>
          <p>Fetching courses from MongoDB.</p>
        </div>
      </main>
    );
  }

  /* =====================================================
     UI
     ===================================================== */

  return (
    <main className="aeloria-admin-courses">

      {/* HEADER */}

      <header className="aeloria-admin-courses-header">
        <div>
          <span className="aeloria-admin-courses-label">
            CONTENT MANAGEMENT
          </span>

          <h1>Courses</h1>

          <p>
            Create, manage and publish your Aeloria courses.
          </p>
        </div>

        <button
          className="aeloria-admin-courses-add-button"
          onClick={() => setShowModal(true)}
        >
          <span>＋</span>
          Add New Course
        </button>
      </header>

      {/* ERROR */}

      {error && (
        <div className="aeloria-admin-courses-error">
          {error}
        </div>
      )}

      {/* STATS */}

      <section className="aeloria-admin-courses-stats">

        <div className="aeloria-admin-courses-stat">
          <div className="aeloria-admin-courses-stat-icon">
            📚
          </div>

          <div>
            <strong>{courses.length}</strong>
            <span>Total Courses</span>
          </div>
        </div>

        <div className="aeloria-admin-courses-stat">
          <div className="aeloria-admin-courses-stat-icon">
            ✓
          </div>

          <div>
            <strong>{publishedCount}</strong>
            <span>Published</span>
          </div>
        </div>

        <div className="aeloria-admin-courses-stat">
          <div className="aeloria-admin-courses-stat-icon">
            📝
          </div>

          <div>
            <strong>{draftCount}</strong>
            <span>Drafts</span>
          </div>
        </div>

      </section>

      {/* CONTENT */}

      <section className="aeloria-admin-courses-content">

        <div className="aeloria-admin-courses-toolbar">

          <div className="aeloria-admin-courses-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="aeloria-admin-courses-filter">

            <label>Status:</label>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
            >
              <option value="All">All Courses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>

          </div>

        </div>

        {/* COURSE LIST */}

        <div className="aeloria-admin-courses-list">

          <div className="aeloria-admin-courses-list-header">
            <span>COURSE</span>
            <span>CATEGORY</span>
            <span>LEVEL</span>
            <span>LESSONS</span>
            <span>STATUS</span>
            <span>ACTIONS</span>
          </div>

          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => {

              const courseStatus =
                course.status?.toLowerCase() === "published"
                  ? "Published"
                  : "Draft";

              const lessonCount =
                course.lessonsCount ??
                course.lessons?.length ??
                0;

              return (
                <div
                  className="aeloria-admin-course-row"
                  key={course._id}
                >

                  <div className="aeloria-admin-course-info">

                    <div className="aeloria-admin-course-icon">
                      {(course.title || "C")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h3>{course.title}</h3>

                      <span>
                        Course ID: #
                        {course._id?.slice(-6) || "N/A"}
                      </span>
                    </div>

                  </div>

                  <div>
                    <span className="aeloria-admin-course-category">
                      {course.category || "Programming"}
                    </span>
                  </div>

                  <div>
                    <span className="aeloria-admin-course-level">
                      {course.level || "Beginner"}
                    </span>
                  </div>

                  <div className="aeloria-admin-course-lessons">
                    {lessonCount} lessons
                  </div>

                  <div>
                    <button
                      className={`aeloria-admin-course-status ${courseStatus === "Published"
                          ? "published"
                          : "draft"
                        }`}
                      onClick={() =>
                        handleToggleStatus(course._id)
                      }
                    >
                      <span></span>
                      {courseStatus}
                    </button>
                  </div>

                  <div className="aeloria-admin-course-actions">

  <Link
    to={`/admin/courses/edit/${course._id}`}
    className="aeloria-admin-course-edit"
    title="Edit Course"
  >
    ✎
  </Link>

  <Link
    to={`/admin/courses/${course._id}/lessons`}
    className="aeloria-admin-course-lessons"
    title="Manage Lessons"
  >
    📖
  </Link>

  <Link
    to={`/courses/${course.slug || course._id}`}
    className="aeloria-admin-course-view"
    title="View Course"
  >
    ↗
  </Link>

  <button
    className="aeloria-admin-course-delete"
    title="Delete Course"
    onClick={() =>
      handleDeleteCourse(
        course._id,
        course.title
      )
    }
  >
    🗑
  </button>

</div>

                </div>
              );
            })
          ) : (
            <div className="aeloria-admin-courses-empty">
              <div>📚</div>

              <h3>No courses found</h3>

              <p>
                Try changing your search or filter.
              </p>
            </div>
          )}

        </div>

      </section>

      {/* ADD COURSE MODAL */}

      {showModal && (
        <div className="aeloria-admin-courses-modal-overlay">

          <div className="aeloria-admin-courses-modal">

            <button
              className="aeloria-admin-courses-modal-close"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <span className="aeloria-admin-courses-modal-label">
              CREATE CONTENT
            </span>

            <h2>Add New Course</h2>

            <p>
              Create a new course and save it to MongoDB.
            </p>

            <div className="aeloria-admin-courses-form">

              <div className="aeloria-admin-courses-form-field">
                <label>Course Title</label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Complete Java Programming"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="aeloria-admin-courses-form-row">

                <div className="aeloria-admin-courses-form-field">
                  <label>Category</label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option>Programming</option>
                    <option>Web Development</option>
                    <option>DSA</option>
                    <option>AI & ML</option>
                    <option>Data Science</option>
                    <option>DevOps</option>
                  </select>
                </div>

                <div className="aeloria-admin-courses-form-field">
                  <label>Level</label>

                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

              </div>

              <div className="aeloria-admin-courses-form-field">
                <label>Description</label>

                <textarea
                  rows="4"
                  name="description"
                  placeholder="Write a short course description..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="aeloria-admin-courses-form-buttons">

                <button
                  type="button"
                  className="aeloria-admin-courses-cancel"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="aeloria-admin-courses-save"
                  onClick={handleCreateCourse}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Course"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default AdminCourses;
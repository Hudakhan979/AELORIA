import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getAdminCourses,
  updateCourse,
} from "../../../services/api";

import { useAuth } from "../../../context/AuthContext";

import "./EditCourse.css";

function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    admin,
    token,
    loading: authLoading,
  } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Programming",
    language: "",
    level: "Beginner",
    description: "",
    duration: "",
    lessonsCount: 0,
    thumbnail: "",
    status: "draft",
  });

  // ==========================================
  // LOAD COURSE
  // ==========================================

  useEffect(() => {
    if (authLoading) return;

    if (!admin || !token) {
      navigate("/admin/login");
      return;
    }

    loadCourse();
  }, [admin, token, authLoading, courseId]);

  const loadCourse = async () => {
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

      const course = courseList.find(
        (item) => item._id === courseId
      );

      if (!course) {
        setError("Course not found.");
        return;
      }

      setFormData({
        title: course.title || "",
        category: course.category || "Programming",
        language: course.language || "",
        level: course.level || "Beginner",
        description: course.description || "",
        duration: course.duration || "",
        lessonsCount:
          course.lessonsCount ??
          course.lessons?.length ??
          0,
        thumbnail: course.thumbnail || "",
        status: course.status || "draft",
      });
    } catch (error) {
      console.error("Load Course Error:", error);

      setError(
        error.message || "Failed to load course."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE COURSE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Course title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Course description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateCourse(
        courseId,
        {
          ...formData,
          lessonsCount:
            Number(formData.lessonsCount) || 0,
        },
        token
      );

      alert("Course updated successfully! 🎉");

      navigate("/admin/courses");
    } catch (error) {
      console.error("Update Course Error:", error);

      setError(
        error.message || "Failed to update course."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (authLoading || loading) {
    return (
      <main className="aeloria-edit-course">
        <div className="aeloria-edit-course-loading">
          <div>📚</div>

          <h2>Loading Course...</h2>

          <p>
            Fetching course details from MongoDB.
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="aeloria-edit-course">

      {/* HEADER */}

      <header className="aeloria-edit-course-header">
        <div>

          <button
            type="button"
            className="aeloria-edit-course-back"
            onClick={() =>
              navigate("/admin/courses")
            }
          >
            ← Back to Courses
          </button>

          <span className="aeloria-edit-course-label">
            CONTENT MANAGEMENT
          </span>

          <h1>Edit Course</h1>

          <p>
            Update your course information and save
            changes to MongoDB.
          </p>

        </div>
      </header>

      {/* ERROR */}

      {error && (
        <div className="aeloria-edit-course-error">
          {error}
        </div>
      )}

      {/* FORM */}

      <form
        className="aeloria-edit-course-form"
        onSubmit={handleSubmit}
      >

        {/* BASIC INFORMATION */}

        <section className="aeloria-edit-course-section">

          <div className="aeloria-edit-course-section-heading">

            <div className="aeloria-edit-course-section-icon">
              📚
            </div>

            <div>
              <h2>Basic Information</h2>

              <p>
                Add the main information about your course.
              </p>
            </div>

          </div>

          <div className="aeloria-edit-course-fields">

            {/* TITLE */}

            <div className="aeloria-edit-course-field full">

              <label>
                Course Title *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter course title"
              />

            </div>

            {/* CATEGORY */}

            <div className="aeloria-edit-course-field">

              <label>
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Programming">
                  Programming
                </option>

                <option value="Web Development">
                  Web Development
                </option>

                <option value="Data Structures">
                  Data Structures
                </option>

                <option value="Algorithms">
                  Algorithms
                </option>

                <option value="AI & ML">
                  AI & ML
                </option>

                <option value="Data Science">
                  Data Science
                </option>

                <option value="DevOps">
                  DevOps
                </option>

                <option value="Computer Science">
                  Computer Science
                </option>
              </select>

            </div>

            {/* LANGUAGE */}

            <div className="aeloria-edit-course-field">

              <label>
                Language / Technology
              </label>

              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                placeholder="e.g. Java, C++, MERN"
              />

            </div>

            {/* LEVEL */}

            <div className="aeloria-edit-course-field">

              <label>
                Level
              </label>

              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
              >
                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>
              </select>

            </div>

            {/* DURATION */}

            <div className="aeloria-edit-course-field">

              <label>
                Duration
              </label>

              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 10 Hours"
              />

            </div>

            {/* LESSONS */}

            <div className="aeloria-edit-course-field">

              <label>
                Number of Lessons
              </label>

              <input
                type="number"
                min="0"
                name="lessonsCount"
                value={formData.lessonsCount}
                onChange={handleChange}
              />

            </div>

          </div>

        </section>

        {/* DESCRIPTION */}

        <section className="aeloria-edit-course-section">

          <div className="aeloria-edit-course-section-heading">

            <div className="aeloria-edit-course-section-icon">
              📝
            </div>

            <div>
              <h2>Course Description</h2>

              <p>
                Explain what students will learn in this course.
              </p>
            </div>

          </div>

          <div className="aeloria-edit-course-field full">

            <label>
              Description *
            </label>

            <textarea
              name="description"
              rows="7"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write course description..."
            ></textarea>

          </div>

        </section>

        {/* MEDIA */}

        <section className="aeloria-edit-course-section">

          <div className="aeloria-edit-course-section-heading">

            <div className="aeloria-edit-course-section-icon">
              🖼️
            </div>

            <div>
              <h2>Course Media</h2>

              <p>
                Add a thumbnail image for your course.
              </p>
            </div>

          </div>

          <div className="aeloria-edit-course-field full">

            <label>
              Thumbnail URL
            </label>

            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/course-image.jpg"
            />

          </div>

        </section>

        {/* PUBLISHING */}

        <section className="aeloria-edit-course-section">

          <div className="aeloria-edit-course-section-heading">

            <div className="aeloria-edit-course-section-icon">
              🚀
            </div>

            <div>
              <h2>Publishing</h2>

              <p>
                Choose whether this course is visible to students.
              </p>
            </div>

          </div>

          <div className="aeloria-edit-course-status-options">

            {/* DRAFT */}

            <label
              className={`aeloria-edit-course-status-option ${
                formData.status === "draft"
                  ? "active"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === "draft"}
                onChange={handleChange}
              />

              <div>
                <strong>Draft</strong>

                <span>
                  Course is not visible publicly.
                </span>
              </div>

            </label>

            {/* PUBLISHED */}

            <label
              className={`aeloria-edit-course-status-option ${
                formData.status === "published"
                  ? "active"
                  : ""
              }`}
            >

              <input
                type="radio"
                name="status"
                value="published"
                checked={
                  formData.status === "published"
                }
                onChange={handleChange}
              />

              <div>
                <strong>Published</strong>

                <span>
                  Course is visible to students.
                </span>
              </div>

            </label>

          </div>

        </section>

        {/* ACTIONS */}

        <div className="aeloria-edit-course-actions">

          <button
            type="button"
            className="aeloria-edit-course-cancel"
            onClick={() =>
              navigate("/admin/courses")
            }
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="aeloria-edit-course-save"
            disabled={saving}
          >
            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </main>
  );
}

export default EditCourse;
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getAdminCourses,
  updateCourse,
} from "../../../services/api";

import { useAuth } from "../../../context/AuthContext";

import "./ManageLessons.css";

function ManageLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { admin, token, loading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);

  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    content: "",
    videoUrl: "",
    codeExample: "",
    duration: "10 min",
    order: 1,
  });

  // =====================================================
  // LOAD COURSE
  // =====================================================

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

      const selectedCourse = courseList.find(
        (item) => item._id === courseId
      );

      if (!selectedCourse) {
        setError("Course not found.");
        return;
      }

      setCourse(selectedCourse);
    } catch (error) {
      console.error("Manage Lessons Error:", error);
      setError(error.message || "Failed to load course.");
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

    loadCourse();
  }, [admin, token, authLoading, courseId, navigate]);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleLessonChange = (event) => {
    const { name, value } = event.target;

    setLessonForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetLessonForm = () => {
    setLessonForm({
      title: "",
      description: "",
      content: "",
      videoUrl: "",
      codeExample: "",
      duration: "10 min",
      order: (course?.lessons?.length || 0) + 1,
    });

    setEditingLessonId(null);
    setShowLessonForm(false);
  };

  // =====================================================
  // ADD LESSON
  // =====================================================

  const handleAddLesson = () => {
    setEditingLessonId(null);

    setLessonForm({
      title: "",
      description: "",
      content: "",
      videoUrl: "",
      codeExample: "",
      duration: "10 min",
      order: (course?.lessons?.length || 0) + 1,
    });

    setShowLessonForm(true);
  };

  // =====================================================
  // EDIT LESSON
  // =====================================================

  const handleEditLesson = (lesson) => {
    setEditingLessonId(lesson._id);

    setLessonForm({
      title: lesson.title || "",
      description: lesson.description || "",
      content: lesson.content || "",
      videoUrl: lesson.videoUrl || "",
      codeExample: lesson.codeExample || "",
      duration: lesson.duration || "10 min",
      order: lesson.order || 1,
    });

    setShowLessonForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // SAVE LESSON
  // =====================================================

  const handleSaveLesson = async () => {
    if (!lessonForm.title.trim()) {
      alert("Please enter lesson title.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const currentLessons = Array.isArray(course.lessons)
        ? [...course.lessons]
        : [];

      const lessonData = {
        title: lessonForm.title.trim(),
        description: lessonForm.description.trim(),
        content: lessonForm.content.trim(),
        videoUrl: lessonForm.videoUrl.trim(),
        codeExample: lessonForm.codeExample,
        duration: lessonForm.duration.trim() || "10 min",
        order: Number(lessonForm.order) || 1,
      };

      let updatedLessons;

      if (editingLessonId) {
        updatedLessons = currentLessons.map((lesson) =>
          lesson._id === editingLessonId
            ? {
                ...lesson,
                ...lessonData,
              }
            : lesson
        );
      } else {
        updatedLessons = [
          ...currentLessons,
          lessonData,
        ];
      }

      updatedLessons.sort(
        (a, b) => Number(a.order || 0) - Number(b.order || 0)
      );

      const response = await updateCourse(
        course._id,
        {
          lessons: updatedLessons,
          lessonsCount: updatedLessons.length,
        },
        token
      );

      const updatedCourse =
        response?.course ||
        response?.data ||
        {
          ...course,
          lessons: updatedLessons,
          lessonsCount: updatedLessons.length,
        };

      setCourse(updatedCourse);

      resetLessonForm();

      alert(
        editingLessonId
          ? "Lesson updated successfully!"
          : "Lesson added successfully!"
      );
    } catch (error) {
      console.error("Save Lesson Error:", error);
      setError(error.message || "Failed to save lesson.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE LESSON
  // =====================================================

  const handleDeleteLesson = async (lessonId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmDelete) return;

    try {
      setSaving(true);
      setError("");

      const currentLessons = Array.isArray(course.lessons)
        ? course.lessons
        : [];

      const updatedLessons = currentLessons.filter(
        (lesson) => lesson._id !== lessonId
      );

      const response = await updateCourse(
        course._id,
        {
          lessons: updatedLessons,
          lessonsCount: updatedLessons.length,
        },
        token
      );

      const updatedCourse =
        response?.course ||
        response?.data ||
        {
          ...course,
          lessons: updatedLessons,
          lessonsCount: updatedLessons.length,
        };

      setCourse(updatedCourse);
    } catch (error) {
      console.error("Delete Lesson Error:", error);
      setError(error.message || "Failed to delete lesson.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (authLoading || loading) {
    return (
      <main className="aeloria-manage-lessons">
        <div className="aeloria-manage-lessons-loading">
          <div className="aeloria-manage-lessons-loading-icon">
            📚
          </div>

          <h2>Loading Course...</h2>

          <p>
            Fetching course content from MongoDB.
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (!course) {
    return (
      <main className="aeloria-manage-lessons">
        <div className="aeloria-manage-lessons-error-page">
          <div>⚠️</div>

          <h2>Course Not Found</h2>

          <p>{error || "The requested course does not exist."}</p>

          <Link
            to="/admin/courses"
            className="aeloria-manage-lessons-back-button"
          >
            ← Back to Courses
          </Link>
        </div>
      </main>
    );
  }

  const lessons = Array.isArray(course.lessons)
    ? [...course.lessons].sort(
        (a, b) => Number(a.order || 0) - Number(b.order || 0)
      )
    : [];

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="aeloria-manage-lessons">

      {/* HEADER */}

      <header className="aeloria-manage-lessons-header">

        <div>
          <Link
            to="/admin/courses"
            className="aeloria-manage-lessons-back"
          >
            ← Back to Courses
          </Link>

          <span className="aeloria-manage-lessons-label">
            COURSE CONTENT MANAGEMENT
          </span>

          <h1>{course.title}</h1>

          <p>
            Manage lessons, learning content, videos and code
            examples for this course.
          </p>
        </div>

        <button
          type="button"
          className="aeloria-manage-lessons-add-button"
          onClick={handleAddLesson}
        >
          <span>＋</span>
          Add New Lesson
        </button>

      </header>

      {/* ERROR */}

      {error && (
        <div className="aeloria-manage-lessons-error">
          {error}
        </div>
      )}

      {/* COURSE INFO */}

      <section className="aeloria-manage-lessons-course-info">

        <div className="aeloria-manage-lessons-course-icon">
          {(course.title || "C")
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="aeloria-manage-lessons-course-details">

          <span>COURSE</span>

          <h2>{course.title}</h2>

          <p>
            {course.category || "Programming"} •{" "}
            {course.level || "Beginner"} •{" "}
            {lessons.length} Lessons
          </p>

        </div>

      </section>

      {/* LESSON FORM */}

      {showLessonForm && (
        <section className="aeloria-manage-lessons-form-section">

          <div className="aeloria-manage-lessons-form-header">

            <div>
              <span>LESSON EDITOR</span>

              <h2>
                {editingLessonId
                  ? "Edit Lesson"
                  : "Add New Lesson"}
              </h2>
            </div>

            <button
              type="button"
              className="aeloria-manage-lessons-form-close"
              onClick={resetLessonForm}
              disabled={saving}
            >
              ×
            </button>

          </div>

          <div className="aeloria-manage-lessons-form">

            {/* TITLE */}

            <div className="aeloria-manage-lessons-field full">

              <label>Lesson Title *</label>

              <input
                type="text"
                name="title"
                placeholder="e.g. Introduction to Variables"
                value={lessonForm.title}
                onChange={handleLessonChange}
              />

            </div>

            {/* DESCRIPTION */}

            <div className="aeloria-manage-lessons-field full">

              <label>Short Description</label>

              <textarea
                name="description"
                rows="3"
                placeholder="Write a short description of this lesson..."
                value={lessonForm.description}
                onChange={handleLessonChange}
              />

            </div>

            {/* CONTENT */}

            <div className="aeloria-manage-lessons-field full">

              <label>Lesson Content</label>

              <textarea
                name="content"
                rows="8"
                placeholder="Write the complete lesson content here..."
                value={lessonForm.content}
                onChange={handleLessonChange}
              />

            </div>

            {/* VIDEO + DURATION + ORDER */}

            <div className="aeloria-manage-lessons-form-row">

              <div className="aeloria-manage-lessons-field">

                <label>Video URL</label>

                <input
                  type="url"
                  name="videoUrl"
                  placeholder="https://..."
                  value={lessonForm.videoUrl}
                  onChange={handleLessonChange}
                />

              </div>

              <div className="aeloria-manage-lessons-field">

                <label>Duration</label>

                <input
                  type="text"
                  name="duration"
                  placeholder="10 min"
                  value={lessonForm.duration}
                  onChange={handleLessonChange}
                />

              </div>

              <div className="aeloria-manage-lessons-field">

                <label>Order</label>

                <input
                  type="number"
                  min="1"
                  name="order"
                  value={lessonForm.order}
                  onChange={handleLessonChange}
                />

              </div>

            </div>

            {/* CODE */}

            <div className="aeloria-manage-lessons-field full">

              <label>Code Example</label>

              <textarea
                name="codeExample"
                rows="10"
                placeholder={`// Example code

console.log("Hello Aeloria");`}
                value={lessonForm.codeExample}
                onChange={handleLessonChange}
              />

            </div>

            {/* BUTTONS */}

            <div className="aeloria-manage-lessons-form-actions">

              <button
                type="button"
                className="aeloria-manage-lessons-cancel"
                onClick={resetLessonForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="aeloria-manage-lessons-save"
                onClick={handleSaveLesson}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingLessonId
                    ? "Update Lesson"
                    : "Save Lesson"}
              </button>

            </div>

          </div>

        </section>
      )}

      {/* LESSONS */}

      <section className="aeloria-manage-lessons-list-section">

        <div className="aeloria-manage-lessons-list-header">

          <div>
            <span>COURSE LESSONS</span>

            <h2>
              {lessons.length}{" "}
              {lessons.length === 1
                ? "Lesson"
                : "Lessons"}
            </h2>
          </div>

          {!showLessonForm && (
            <button
              type="button"
              className="aeloria-manage-lessons-mobile-add"
              onClick={handleAddLesson}
            >
              + Add Lesson
            </button>
          )}

        </div>

        {lessons.length > 0 ? (
          <div className="aeloria-manage-lessons-list">

            {lessons.map((lesson, index) => (
              <article
                className="aeloria-manage-lesson-card"
                key={lesson._id || `${lesson.title}-${index}`}
              >

                <div className="aeloria-manage-lesson-number">
                  {index + 1}
                </div>

                <div className="aeloria-manage-lesson-content">

                  <div className="aeloria-manage-lesson-top">

                    <div>

                      <span className="aeloria-manage-lesson-order">
                        Lesson {lesson.order || index + 1}
                      </span>

                      <h3>
                        {lesson.title}
                      </h3>

                    </div>

                    <div className="aeloria-manage-lesson-actions">

                      <button
                        type="button"
                        className="aeloria-manage-lesson-edit"
                        onClick={() =>
                          handleEditLesson(lesson)
                        }
                        disabled={saving}
                        title="Edit Lesson"
                      >
                        ✎
                      </button>

                      <button
                        type="button"
                        className="aeloria-manage-lesson-delete"
                        onClick={() =>
                          handleDeleteLesson(lesson._id)
                        }
                        disabled={saving}
                        title="Delete Lesson"
                      >
                        🗑
                      </button>

                    </div>

                  </div>

                  {lesson.description && (
                    <p className="aeloria-manage-lesson-description">
                      {lesson.description}
                    </p>
                  )}

                  <div className="aeloria-manage-lesson-meta">

                    <span>
                      ⏱ {lesson.duration || "10 min"}
                    </span>

                    {lesson.videoUrl && (
                      <span>
                        ▶ Video
                      </span>
                    )}

                    {lesson.codeExample && (
                      <span>
                        {"</>"} Code
                      </span>
                    )}

                  </div>

                </div>

              </article>
            ))}

          </div>
        ) : (
          <div className="aeloria-manage-lessons-empty">

            <div>📖</div>

            <h3>No lessons yet</h3>

            <p>
              Start building this course by adding
              your first lesson.
            </p>

            <button
              type="button"
              onClick={handleAddLesson}
            >
              + Add First Lesson
            </button>

          </div>
        )}

      </section>

    </main>
  );
}

export default ManageLessons;
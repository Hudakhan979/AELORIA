import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getQuizzes, getCourses } from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import Footer from "../../components/Footer/Footer";
import "./QuizzesCatalog.css";

const QuizzesCatalog = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        setError("");

        const [resQuizzes, resCourses] = await Promise.all([
          getQuizzes(),
          getCourses(),
        ]);

        const quizList = Array.isArray(resQuizzes?.quizzes)
          ? resQuizzes.quizzes
          : Array.isArray(resQuizzes)
          ? resQuizzes
          : [];

        const courseList = Array.isArray(resCourses?.courses)
          ? resCourses.courses
          : Array.isArray(resCourses?.data)
          ? resCourses.data
          : Array.isArray(resCourses)
          ? resCourses
          : [];

        setQuizzes(quizList);
        setCourses(courseList);
      } catch (err) {
        setError(err.message || "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const titleMatch =
        q.title?.toLowerCase().includes(search.toLowerCase()) ||
        q.description?.toLowerCase().includes(search.toLowerCase()) ||
        q.course?.title?.toLowerCase().includes(search.toLowerCase());

      const diffMatch =
        difficultyFilter === "all" || q.difficulty === difficultyFilter;

      const courseMatch =
        courseFilter === "all" ||
        q.course?._id === courseFilter ||
        q.course === courseFilter;

      return titleMatch && diffMatch && courseMatch;
    });
  }, [quizzes, search, difficultyFilter, courseFilter]);

  return (
    <>
      <Navbar />
      <CategoryBar />

      <main className="aeloria-qc-page">
        {/* Hero Banner */}
        <section className="aeloria-qc-hero">
          <div className="aeloria-qc-hero-inner">
            <span className="aeloria-qc-badge">ASSESSMENTS & MCQ QUIZZES</span>
            <h1>Course Assessments & Quizzes</h1>
            <p>
              Test and reinforce your coding knowledge with timed, interactive MCQs.
              Earn passing grades, review comprehensive explanations, and track your progress.
            </p>
          </div>
        </section>

        <div className="aeloria-qc-container">
          {/* Toolbar */}
          <div className="aeloria-qc-toolbar">
            <div className="aeloria-qc-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search quizzes by title or concept..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Quizzes Grid */}
          {loading ? (
            <div className="aeloria-qc-loading">
              <div className="aeloria-qc-spinner"></div>
              <p>Loading course quizzes...</p>
            </div>
          ) : error ? (
            <div className="aeloria-qc-error">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="aeloria-qc-empty">
              <span>🎯</span>
              <h3>No quizzes matching your criteria</h3>
              <p>Try clearing filters or check back later as new quizzes are added.</p>
            </div>
          ) : (
            <div className="aeloria-qc-grid">
              {filteredQuizzes.map((quiz) => (
                <div key={quiz._id} className="aeloria-qc-card">
                  <div className="aeloria-qc-card-top">
                    <span className="aeloria-qc-course-badge">
                      📚 {quiz.course?.title || "Course Quiz"}
                    </span>
                    <span className="aeloria-qc-diff-badge">
                      {quiz.difficulty}
                    </span>
                  </div>

                  <h3 className="aeloria-qc-title">{quiz.title}</h3>
                  <p className="aeloria-qc-desc">{quiz.description}</p>

                  <div className="aeloria-qc-meta">
                    <div>
                      <small>Questions</small>
                      <strong>{quiz.questionsCount || 20} MCQs</strong>
                    </div>
                    <div>
                      <small>Time</small>
                      <strong>{quiz.timeLimit} Mins</strong>
                    </div>
                    <div>
                      <small>Pass Mark</small>
                      <strong>{quiz.passingPercentage}%</strong>
                    </div>
                  </div>

                  <div className="aeloria-qc-actions">
                    <Link
                      to={`/quiz/${quiz.slug || quiz._id}`}
                      className="aeloria-qc-view-btn"
                    >
                      View Quiz Details
                    </Link>

                    <Link
                      to={`/quiz/${quiz.slug || quiz._id}/take`}
                      className="aeloria-qc-start-btn"
                    >
                      Take Quiz →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default QuizzesCatalog;

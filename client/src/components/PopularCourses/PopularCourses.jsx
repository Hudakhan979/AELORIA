import { Link } from "react-router-dom";
import "./PopularCourses.css";

function PopularCourses() {
  const courses = [
    {
      id: "c-programming",
      title: "Complete C Programming",
      category: "C",
      description:
        "Master memory management, pointers, data structures, and foundational algorithms from scratch.",
      level: "Beginner",
      duration: "8h 30m",
      lessons: "45 Lessons",
      badge: "Popular",
    },
    {
      id: "cpp-programming",
      title: "C++ Programming Mastery",
      category: "C++",
      description:
        "Modern OOP, STL containers, template metaprogramming, and competitive programming patterns.",
      level: "Intermediate",
      duration: "10h 15m",
      lessons: "52 Lessons",
      badge: "Hot",
    },
    {
      id: "java-programming",
      title: "Java Enterprise Architecture",
      category: "Java",
      description:
        "Comprehensive core Java, multi-threading, concurrency, JVM internals, and Spring frameworks.",
      level: "Intermediate",
      duration: "12h 00m",
      lessons: "60 Lessons",
      badge: "In-Demand",
    },
    {
      id: "mern-stack",
      title: "Full-Stack MERN Development",
      category: "MERN",
      description:
        "Build and deploy scalable full-stack web applications with MongoDB, Express, React, and Node.js.",
      level: "Advanced",
      duration: "18h 45m",
      lessons: "72 Lessons",
      badge: "Featured",
    },
  ];

  return (
    <section className="aeloria-popular-courses">
      <div className="aeloria-popular-courses-container">
        {/* Section Header */}
        <div className="aeloria-popular-courses-header">
          <div>
            <span className="aeloria-popular-courses-label">
              CURATED CURRICULUM
            </span>
            <h2 className="aeloria-popular-courses-title">
              Popular <span>Courses</span>
            </h2>
            <p className="aeloria-popular-courses-description">
              Industry-aligned programming tracks designed to take you from foundational
              syntax to production systems.
            </p>
          </div>

          <Link to="/courses" className="aeloria-popular-courses-view-all">
            View All Courses →
          </Link>
        </div>

        {/* Course Cards Grid */}
        <div className="aeloria-popular-courses-grid">
          {courses.map((course) => (
            <article className="aeloria-popular-course-card" key={course.title}>
              {/* Card Visual Header */}
              <div className="aeloria-course-card-visual">
                <div className="aeloria-course-category-tag">
                  {course.category}
                </div>
                {course.badge && (
                  <span className={`aeloria-card-badge badge-${course.badge.toLowerCase()}`}>
                    {course.badge}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="aeloria-popular-course-content">
                <div className="aeloria-course-meta-top">
                  <span className="aeloria-course-level-pill">
                    {course.level}
                  </span>
                  <span className="aeloria-course-duration">
                    ⏱ {course.duration}
                  </span>
                </div>

                <h3 className="aeloria-popular-course-title">
                  {course.title}
                </h3>

                <p className="aeloria-popular-course-description">
                  {course.description}
                </p>

                {/* Card Footer */}
                <div className="aeloria-popular-course-footer">
                  <span className="aeloria-course-lessons-count">
                    📚 {course.lessons}
                  </span>

                  <Link
                    to={`/courses/${course.id}`}
                    className="aeloria-popular-course-link"
                  >
                    Start Course →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularCourses;
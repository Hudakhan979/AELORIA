import "./PopularCourses.css";

function PopularCourses() {
  const courses = [
    {
      title: "Complete C Programming",
      description:
        "Learn C programming from fundamentals to problem solving.",
      level: "Beginner",
      lessons: "45 Lessons",
    },
    {
      title: "C++ Programming Mastery",
      description:
        "Build strong C++ fundamentals and object-oriented programming skills.",
      level: "Beginner",
      lessons: "52 Lessons",
    },
    {
      title: "Java Programming",
      description:
        "Master Java programming, OOP concepts, collections, and more.",
      level: "Intermediate",
      lessons: "60 Lessons",
    },
    {
      title: "MERN Stack Development",
      description:
        "Learn MongoDB, Express, React, and Node.js by building projects.",
      level: "Intermediate",
      lessons: "72 Lessons",
    },
  ];

  return (
    <section className="aeloria-popular-courses">
      <div className="aeloria-popular-courses-container">

        {/* Section Header */}
        <div className="aeloria-popular-courses-header">
          <div>
            <span className="aeloria-popular-courses-label">
              LEARN & BUILD
            </span>

            <h2 className="aeloria-popular-courses-title">
              Popular Courses
            </h2>

            <p className="aeloria-popular-courses-description">
              Start learning in-demand technologies with structured
              courses designed for your journey.
            </p>
          </div>

          <a
            href="/courses"
            className="aeloria-popular-courses-view-all"
          >
            View All Courses →
          </a>
        </div>

        {/* Course Cards */}
        <div className="aeloria-popular-courses-grid">
          {courses.map((course) => (
            <article
              className="aeloria-popular-course-card"
              key={course.title}
            >
              <div className="aeloria-popular-course-icon">
                &lt;/&gt;
              </div>

              <div className="aeloria-popular-course-content">
                <span className="aeloria-popular-course-level">
                  {course.level}
                </span>

                <h3 className="aeloria-popular-course-title">
                  {course.title}
                </h3>

                <p className="aeloria-popular-course-description">
                  {course.description}
                </p>

                <div className="aeloria-popular-course-footer">
                  <span>{course.lessons}</span>

                  <a
                    href="/courses"
                    className="aeloria-popular-course-link"
                  >
                    Explore →
                  </a>
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
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/api";
import "./Courses.css";

const defaultCourses = [
  {
    id: "c-programming",
    title: "Complete C Programming",
    category: "C",
    level: "Beginner",
    lessons: "42 Lessons",
    duration: "8 Hours",
    description:
      "Learn C programming from the basics to functions, arrays, pointers, and file handling.",
  },
  {
    id: "cpp-programming",
    title: "C++ Programming Mastery",
    category: "C++",
    level: "Beginner",
    lessons: "48 Lessons",
    duration: "10 Hours",
    description:
      "Build a strong C++ foundation with OOP, STL, functions, classes, and problem solving.",
  },
  {
    id: "java-programming",
    title: "Java Programming",
    category: "Java",
    level: "Intermediate",
    lessons: "55 Lessons",
    duration: "12 Hours",
    description:
      "Master Java fundamentals, OOP, collections, exception handling, and modern concepts.",
  },
  {
    id: "python-programming-for-beginners",
    title: "Python Programming for Beginners",
    category: "Python",
    level: "Beginner",
    lessons: "10 Lessons",
    duration: "10 Hours",
    description:
      "Start Python from scratch and learn programming concepts through practical examples.",
  },
  {
    id: "javascript",
    title: "JavaScript Complete Guide",
    category: "JavaScript",
    level: "Intermediate",
    lessons: "60 Lessons",
    duration: "14 Hours",
    description:
      "Learn modern JavaScript including ES6+, DOM, asynchronous programming, and APIs.",
  },
  {
    id: "mern-stack",
    title: "MERN Stack Development",
    category: "MERN",
    level: "Advanced",
    lessons: "72 Lessons",
    duration: "20 Hours",
    description:
      "Build full-stack web applications using MongoDB, Express, React, and Node.js.",
  },
  {
    id: "angular",
    title: "Angular Web Development",
    category: "Angular",
    level: "Intermediate",
    lessons: "46 Lessons",
    duration: "11 Hours",
    description:
      "Learn Angular components, services, routing, forms, APIs, and application development.",
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    category: "DSA",
    level: "Intermediate",
    lessons: "68 Lessons",
    duration: "16 Hours",
    description:
      "Understand important data structures and algorithms with practical coding problems.",
  },
];

function Courses() {
  const [coursesList, setCoursesList] = useState(defaultCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    const fetchLiveCourses = async () => {
      try {
        const response = await getCourses();
        const apiCourses = Array.isArray(response?.courses)
          ? response.courses
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        if (apiCourses.length > 0) {
          const formatted = apiCourses.map((c) => ({
            id: c.slug || c._id,
            title: c.title,
            category: c.category || "Programming",
            level: c.level || "Beginner",
            lessons: `${c.lessonsCount ?? c.lessons?.length ?? 0} Lessons`,
            duration: c.duration || "Structured learning",
            description: c.description || "",
          }));

          // Merge with default courses avoiding duplicate IDs
          const apiSlugs = new Set(formatted.map((c) => c.id));
          const merged = [
            ...formatted,
            ...defaultCourses.filter((dc) => !apiSlugs.has(dc.id)),
          ];
          setCoursesList(merged);
        }
      } catch (err) {
        console.log("Using cached courses catalog");
      }
    };

    fetchLiveCourses();
  }, []);

  const filteredCourses = coursesList.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" ||
      course.category.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="aeloria-courses">
      <section className="aeloria-courses-hero">
        <div className="aeloria-courses-hero-content">
          <span className="aeloria-courses-label">
            AELORIA COURSES
          </span>

          <h1 className="aeloria-courses-title">
            Learn Skills That
            <span>Build Your Future.</span>
          </h1>

          <p className="aeloria-courses-description">
            Explore structured courses designed to help you learn
            programming, development, DSA, and modern technologies
            step by step.
          </p>

          <div className="aeloria-courses-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="aeloria-courses-content">
        <div className="aeloria-courses-top">
          <div>
            <span className="aeloria-courses-small-label">
              EXPLORE
            </span>

            <h2>Popular Courses</h2>
          </div>

          <select
            className="aeloria-courses-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="C">C</option>
            <option value="JavaScript">JavaScript</option>
            <option value="MERN">MERN</option>
            <option value="Angular">Angular</option>
            <option value="DSA">DSA</option>
          </select>
        </div>

        <div className="aeloria-courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <article
                className="aeloria-course-card"
                key={course.id}
              >
                <div className="aeloria-course-card-top">
                  <span className="aeloria-course-category">
                    {course.category}
                  </span>

                  <span className="aeloria-course-level">
                    {course.level}
                  </span>
                </div>

                <h3 className="aeloria-course-title">
                  {course.title}
                </h3>

                <p className="aeloria-course-description">
                  {course.description}
                </p>

                <div className="aeloria-course-info">
                  <span>📖 {course.lessons}</span>
                  <span>⏱ {course.duration}</span>
                </div>

                <Link
                  to={`/courses/${course.id}`}
                  className="aeloria-course-button"
                >
                  View Course →
                </Link>
              </article>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
              <p>No courses found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Courses;
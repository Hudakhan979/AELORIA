import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTutorials } from "../../services/api";
import "./Tutorials.css";

const defaultTutorials = [
  {
    id: "python",
    title: "Python Programming Tutorial",
    category: "Python",
    topics: "10 Topics",
    description:
      "Start Python with syntax, data types, conditions, loops, functions, collections, and file handling.",
  },
  {
    id: "c-programming",
    title: "C Programming Tutorial",
    category: "C",
    topics: "25+ Topics",
    description:
      "Learn C programming from variables and operators to arrays, functions, pointers, and file handling.",
  },
  {
    id: "cpp-programming",
    title: "C++ Programming Tutorial",
    category: "C++",
    topics: "30+ Topics",
    description:
      "Understand C++ fundamentals, OOP, classes, inheritance, STL, and problem-solving concepts.",
  },
  {
    id: "java-programming",
    title: "Java Programming Tutorial",
    category: "Java",
    topics: "35+ Topics",
    description:
      "Explore Java fundamentals, object-oriented programming, collections, exceptions, and more.",
  },
  {
    id: "javascript",
    title: "JavaScript Tutorial",
    category: "JavaScript",
    topics: "35+ Topics",
    description:
      "Master modern JavaScript, DOM, events, functions, ES6+, asynchronous programming, and APIs.",
  },
  {
    id: "mern-stack",
    title: "MERN Stack Tutorial",
    category: "Web Development",
    topics: "40+ Topics",
    description:
      "Learn MongoDB, Express, React, and Node.js while understanding how full-stack applications work.",
  },
  {
    id: "data-structures",
    title: "Data Structures Tutorial",
    category: "DSA",
    topics: "30+ Topics",
    description:
      "Understand arrays, linked lists, stacks, queues, trees, graphs, and other essential data structures.",
  },
  {
    id: "algorithms",
    title: "Algorithms Tutorial",
    category: "DSA",
    topics: "35+ Topics",
    description:
      "Learn searching, sorting, recursion, dynamic programming, greedy algorithms, and problem solving.",
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    category: "AI & ML",
    topics: "25+ Topics",
    description:
      "Explore artificial intelligence, machine learning fundamentals, models, datasets, and applications.",
  },
  {
    id: "data-science",
    title: "Data Science Tutorial",
    category: "Data Science",
    topics: "28+ Topics",
    description:
      "Learn data analysis, visualization, statistics, Python libraries, and essential data science concepts.",
  },
  {
    id: "web-development",
    title: "Web Development",
    category: "Web Development",
    topics: "40+ Topics",
    description:
      "Build a strong foundation in HTML, CSS, JavaScript, responsive design, and modern web development.",
  },
  {
    id: "devops",
    title: "DevOps Tutorial",
    category: "DevOps",
    topics: "22+ Topics",
    description:
      "Understand DevOps fundamentals, Git, CI/CD, containers, deployment, and development workflows.",
  },
];

function Tutorials() {
  const [tutorialsList, setTutorialsList] = useState(defaultTutorials);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    const fetchLiveTutorials = async () => {
      try {
        const res = await getTutorials();
        const apiList = Array.isArray(res?.tutorials)
          ? res.tutorials
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        if (apiList.length > 0) {
          const formatted = apiList.map((t) => ({
            id: t.slug || t._id,
            title: t.title,
            category: t.category || "Programming",
            topics: `${t.topics?.length || 10}+ Topics`,
            description: t.description || "",
          }));

          const apiSlugs = new Set(formatted.map((t) => t.id));
          const merged = [
            ...formatted,
            ...defaultTutorials.filter((dt) => !apiSlugs.has(dt.id)),
          ];
          setTutorialsList(merged);
        }
      } catch (err) {
        console.log("Using cached tutorials catalog");
      }
    };

    fetchLiveTutorials();
  }, []);

  const filteredTutorials = tutorialsList.filter((tutorial) => {
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" ||
      tutorial.category.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="aeloria-tutorials">
      <section className="aeloria-tutorials-hero">
        <div className="aeloria-tutorials-hero-content">
          <span className="aeloria-tutorials-label">
            AELORIA TUTORIALS
          </span>

          <h1 className="aeloria-tutorials-title">
            Learn Concepts.
            <span>Build Understanding.</span>
          </h1>

          <p className="aeloria-tutorials-description">
            Explore easy-to-follow tutorials covering programming,
            web development, DSA, AI, data science, and modern
            technologies.
          </p>

          <div className="aeloria-tutorials-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="aeloria-tutorials-content">
        <div className="aeloria-tutorials-heading">
          <div>
            <span className="aeloria-tutorials-small-label">
              EXPLORE TUTORIALS
            </span>

            <h2>Programming & Technology</h2>
          </div>

          <select
            className="aeloria-tutorials-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Python">Python</option>
            <option value="C">C</option>
            <option value="C++">C++</option>
            <option value="Java">Java</option>
            <option value="JavaScript">JavaScript</option>
            <option value="web development">Web Development</option>
            <option value="dsa">DSA</option>
            <option value="ai & ml">AI & ML</option>
            <option value="data science">Data Science</option>
            <option value="devops">DevOps</option>
          </select>
        </div>

        <div className="aeloria-tutorials-grid">
          {filteredTutorials.length > 0 ? (
            filteredTutorials.map((tutorial) => (
              <article
                className="aeloria-tutorial-card"
                key={tutorial.id}
              >
                <div className="aeloria-tutorial-card-top">
                  <span className="aeloria-tutorial-category">
                    {tutorial.category}
                  </span>

                  <span className="aeloria-tutorial-topics">
                    {tutorial.topics}
                  </span>
                </div>

                <h3 className="aeloria-tutorial-title">
                  {tutorial.title}
                </h3>

                <p className="aeloria-tutorial-description">
                  {tutorial.description}
                </p>

                <Link
                  to={`/tutorials/${tutorial.id}`}
                  className="aeloria-tutorial-button"
                >
                  Start Learning →
                </Link>
              </article>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
              <p>No tutorials found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Tutorials;
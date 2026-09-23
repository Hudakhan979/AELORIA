import { Link } from "react-router-dom";
import "./ProgrammingLanguages.css";

function ProgrammingLanguages() {
  const languages = [
    {
      name: "C",
      symbol: "C",
      description: "Foundational systems programming, memory control, and pointer mastery.",
      topics: "Memory • Pointers • DSA",
    },
    {
      name: "C++",
      symbol: "C++",
      description: "High-performance object-oriented programming and modern STL algorithms.",
      topics: "OOP • STL • Concurrency",
    },
    {
      name: "Java",
      symbol: "☕",
      description: "Robust enterprise architecture, JVM optimization, and scalable backend logic.",
      topics: "Collections • Threads • Spring",
    },
    {
      name: "Python",
      symbol: "Py",
      description: "Clean syntax for software engineering, automation, data science, and AI pipelines.",
      topics: "OOP • Scripts • PyData",
    },
    {
      name: "JavaScript",
      symbol: "JS",
      description: "The core language of modern interactive web systems and asynchronous events.",
      topics: "ES6+ • DOM • Promises",
    },
    {
      name: "MERN",
      symbol: "M",
      description: "Full-stack web apps using MongoDB, Express, React, and Node.js ecosystems.",
      topics: "Full-Stack • REST • NoSQL",
    },
    {
      name: "Angular",
      symbol: "NG",
      description: "Enterprise single-page web applications with TypeScript, RxJS, and modules.",
      topics: "Components • RxJS • Forms",
    },
    {
      name: "DSA",
      symbol: "⚡",
      description: "Essential data structures, asymptotic analysis, and algorithmic problem-solving.",
      topics: "Trees • Graphs • Dynamic Prog",
    },
  ];

  return (
    <section className="aeloria-programming-languages">
      <div className="aeloria-programming-languages-container">
        {/* Header */}
        <div className="aeloria-programming-languages-header">
          <div>
            <span className="aeloria-programming-languages-label">
              TECHNOLOGY TRACKS
            </span>

            <h2 className="aeloria-programming-languages-title">
              Learn by <span>Technology</span>
            </h2>

            <p className="aeloria-programming-languages-description">
              Select a language or stack to access comprehensive roadmaps, syntax guides,
              and interactive coding exercises.
            </p>
          </div>

          <Link
            to="/courses"
            className="aeloria-programming-languages-view-all"
          >
            All Tracks →
          </Link>
        </div>

        {/* Language Grid */}
        <div className="aeloria-programming-languages-grid">
          {languages.map((language) => (
            <Link
              to={`/search?category=${encodeURIComponent(language.name)}`}
              className="aeloria-programming-language-card"
              key={language.name}
            >
              {/* Gradient Icon Container */}
              <div className="aeloria-programming-language-icon-wrap">
                <span className="aeloria-programming-language-symbol">
                  {language.symbol}
                </span>
              </div>

              <div className="aeloria-programming-language-content">
                <div className="aeloria-programming-language-top">
                  <h3 className="aeloria-programming-language-name">
                    {language.name}
                  </h3>
                  <span className="aeloria-lang-arrow">→</span>
                </div>

                <p className="aeloria-programming-language-description">
                  {language.description}
                </p>

                <div className="aeloria-programming-language-topics">
                  {language.topics}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProgrammingLanguages;
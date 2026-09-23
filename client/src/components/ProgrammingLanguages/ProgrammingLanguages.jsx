import "./ProgrammingLanguages.css";

function ProgrammingLanguages() {
  const languages = [
    {
      name: "C",
      description: "Learn programming fundamentals and problem solving.",
      topics: "Basics • Functions • Pointers",
    },
    {
      name: "C++",
      description: "Master C++ and object-oriented programming concepts.",
      topics: "OOP • STL • Algorithms",
    },
    {
      name: "Java",
      description: "Build a strong foundation in Java programming.",
      topics: "OOP • Collections • Exception Handling",
    },
    {
      name: "Python",
      description: "Learn Python from basics to practical programming.",
      topics: "Syntax • OOP • Libraries",
    },
    {
      name: "JavaScript",
      description: "Master the language behind modern web applications.",
      topics: "ES6+ • DOM • Async JS",
    },
    {
      name: "MERN",
      description: "Build complete full-stack applications with MERN.",
      topics: "MongoDB • Express • React • Node",
    },
    {
      name: "Angular",
      description: "Create scalable web applications with Angular.",
      topics: "Components • Services • Routing",
    },
    {
      name: "SQL",
      description: "Learn databases and powerful SQL queries.",
      topics: "Queries • Joins • Database Design",
    },
  ];

  return (
    <section className="aeloria-programming-languages">
      <div className="aeloria-programming-languages-container">

        <div className="aeloria-programming-languages-header">
          <div>
            <span className="aeloria-programming-languages-label">
              EXPLORE TECHNOLOGIES
            </span>

            <h2 className="aeloria-programming-languages-title">
              Learn Programming Languages
            </h2>

            <p className="aeloria-programming-languages-description">
              Choose a technology and explore structured tutorials,
              concepts, examples, and practice resources.
            </p>
          </div>

          <a
            href="/programming"
            className="aeloria-programming-languages-view-all"
          >
            Explore All →
          </a>
        </div>

        <div className="aeloria-programming-languages-grid">
          {languages.map((language) => (
            <a
              href={`/search?language=${encodeURIComponent(language.name)}`}
              className="aeloria-programming-language-card"
              key={language.name}
            >
              <div className="aeloria-programming-language-icon">
                {language.name === "MERN"
                  ? "M"
                  : language.name === "SQL"
                    ? "DB"
                    : language.name.charAt(0)}
              </div>

              <div className="aeloria-programming-language-content">
                <h3 className="aeloria-programming-language-name">
                  {language.name}
                </h3>

                <p className="aeloria-programming-language-description">
                  {language.description}
                </p>

                <span className="aeloria-programming-language-topics">
                  {language.topics}
                </span>
              </div>

              <span className="aeloria-programming-language-arrow">
                →
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ProgrammingLanguages;
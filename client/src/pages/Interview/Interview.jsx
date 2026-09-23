import { Link } from "react-router-dom";
import "./Interview.css";

function Interview() {
  const roadmap = [
    {
      number: "01",
      title: "Programming Fundamentals",
      description:
        "Strengthen your understanding of programming concepts, syntax, logic, and problem solving.",
      link: "/courses",
    },
    {
      number: "02",
      title: "Data Structures & Algorithms",
      description:
        "Prepare arrays, strings, linked lists, stacks, queues, trees, graphs, and algorithms.",
      link: "/practice",
    },
    {
      number: "03",
      title: "Core CS Subjects",
      description:
        "Revise DBMS, Operating Systems, Computer Networks, OOP, and Software Engineering.",
      link: "/tutorials",
    },
    {
      number: "04",
      title: "Development Skills",
      description:
        "Prepare frontend, backend, APIs, databases, Git, and full-stack development concepts.",
      link: "/courses",
    },
    {
      number: "05",
      title: "Interview Practice",
      description:
        "Solve interview questions, coding challenges, quizzes, and topic-wise problems.",
      link: "/practice",
    },
    {
      number: "06",
      title: "HR & Behavioral Round",
      description:
        "Prepare common HR questions, communication, projects, strengths, and career goals.",
      link: "/interview-preparation",
    },
  ];

  const categories = [
    {
      icon: "</>",
      title: "DSA Interviews",
      description:
        "Practice commonly asked data structures and algorithms questions.",
      questions: "150+ Questions",
    },
    {
      icon: "DB",
      title: "Core CS",
      description:
        "Revise DBMS, OS, networking, OOP, and important CS fundamentals.",
      questions: "120+ Questions",
    },
    {
      icon: "WEB",
      title: "Web Development",
      description:
        "Prepare HTML, CSS, JavaScript, React, Node.js, APIs, and web concepts.",
      questions: "100+ Questions",
    },
    {
      icon: "HR",
      title: "HR & Behavioral",
      description:
        "Prepare common HR questions and learn how to confidently present yourself.",
      questions: "50+ Questions",
    },
  ];

  const quickTopics = [
    "Arrays",
    "Strings",
    "Linked List",
    "Stack & Queue",
    "Trees",
    "Graphs",
    "DBMS",
    "Operating Systems",
    "Computer Networks",
    "OOP",
    "JavaScript",
    "React",
  ];

  return (
    <main className="aeloria-interview">

      {/* Hero */}
      <section className="aeloria-interview-hero">
        <div className="aeloria-interview-hero-content">

          <span className="aeloria-interview-hero-label">
            INTERVIEW PREPARATION
          </span>

          <h1 className="aeloria-interview-hero-title">
            Prepare Smart.
            <span> Get Interview Ready.</span>
          </h1>

          <p className="aeloria-interview-hero-description">
            Build your interview confidence with DSA practice,
            core CS concepts, development questions, and HR preparation.
          </p>

          <div className="aeloria-interview-hero-actions">
            <Link
              to="/practice"
              className="aeloria-interview-primary-button"
            >
              Start Practicing →
            </Link>

            <Link
              to="/courses"
              className="aeloria-interview-secondary-button"
            >
              Explore Courses
            </Link>
          </div>

        </div>
      </section>

      {/* Roadmap */}
      <section className="aeloria-interview-roadmap">

        <div className="aeloria-interview-heading">
          <span>YOUR PREPARATION PATH</span>

          <h2>
            Interview Preparation
            <strong> Roadmap</strong>
          </h2>

          <p>
            Follow a structured path from programming fundamentals
            to interview-ready skills.
          </p>
        </div>

        <div className="aeloria-interview-roadmap-grid">

          {roadmap.map((step) => (
            <article
              className="aeloria-interview-roadmap-card"
              key={step.number}
            >
              <div className="aeloria-interview-roadmap-number">
                {step.number}
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

              <Link to={step.link}>
                Explore →
              </Link>
            </article>
          ))}

        </div>
      </section>

      {/* Categories */}
      <section className="aeloria-interview-categories">

        <div className="aeloria-interview-heading">
          <span>EXPLORE PREPARATION</span>

          <h2>
            Practice by
            <strong> Category</strong>
          </h2>

          <p>
            Focus on the areas most important for your target
            technical and HR interviews.
          </p>
        </div>

        <div className="aeloria-interview-category-grid">

          {categories.map((category) => (
            <article
              className="aeloria-interview-category-card"
              key={category.title}
            >
              <div className="aeloria-interview-category-icon">
                {category.icon}
              </div>

              <h3>{category.title}</h3>

              <p>{category.description}</p>

              <div className="aeloria-interview-category-bottom">
                <span>{category.questions}</span>

                <Link to="/practice">
                  Practice →
                </Link>
              </div>
            </article>
          ))}

        </div>
      </section>

      {/* Quick Topics */}
      <section className="aeloria-interview-topics">

        <div className="aeloria-interview-topics-content">

          <div className="aeloria-interview-topics-heading">
            <span>QUICK REVISION</span>

            <h2>
              Important Interview
              <strong> Topics</strong>
            </h2>

            <p>
              Quickly jump into topics that frequently appear
              in technical interviews.
            </p>
          </div>

          <div className="aeloria-interview-topic-list">

            {quickTopics.map((topic) => (
              <Link
                to={`/search?category=${encodeURIComponent(topic)}`}
                className="aeloria-interview-topic"
                key={topic}
              >
                <span>{topic}</span>
                <span>→</span>
              </Link>
            ))}

          </div>

        </div>
      </section>

      {/* Mock Interview CTA */}
      <section className="aeloria-interview-cta">

        <div className="aeloria-interview-cta-content">

          <span>READY TO TEST YOURSELF?</span>

          <h2>
            Turn Your Preparation
            <strong> Into Confidence.</strong>
          </h2>

          <p>
            Practice coding problems, revise important concepts,
            and prepare yourself for real interview situations.
          </p>

          <div className="aeloria-interview-cta-actions">

            <Link
              to="/practice"
              className="aeloria-interview-cta-button"
            >
              Start Coding Practice →
            </Link>

            <Link
              to="/notes"
              className="aeloria-interview-cta-link"
            >
              Read Free Notes
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Interview;
import { Link } from "react-router-dom";
import "./Practice.css";

function Practice() {
  const topics = [
    {
      id: "python-even-or-odd",
      icon: "🐍",
      title: "Python Fundamentals",
      problems: "10+ Problems",
      description:
        "Practice Python syntax, control flow, functions, dictionaries, and file handling.",
    },
    {
      id: "arrays",
      icon: "▣",
      title: "Arrays",
      problems: "45 Problems",
      description:
        "Practice array traversal, searching, sorting, and common patterns.",
    },
    {
      id: "strings",
      icon: "Aa",
      title: "Strings",
      problems: "38 Problems",
      description:
        "Solve string manipulation, matching, and character-based problems.",
    },
    {
      id: "linked-list",
      icon: "↔",
      title: "Linked List",
      problems: "30 Problems",
      description:
        "Practice insertion, deletion, reversal, and linked-list algorithms.",
    },
    {
      id: "stack",
      icon: "▤",
      title: "Stack & Queue",
      problems: "32 Problems",
      description:
        "Build problem-solving skills using stacks, queues, and their patterns.",
    },
    {
      id: "trees",
      icon: "◇",
      title: "Trees",
      problems: "35 Problems",
      description:
        "Practice traversals, binary trees, BSTs, and tree-based problems.",
    },
    {
      id: "graphs",
      icon: "◈",
      title: "Graphs",
      problems: "32 Problems",
      description:
        "Learn graph traversal and solve connectivity and path problems.",
    },
    {
      id: "dynamic-programming",
      icon: "⚡",
      title: "Dynamic Programming",
      problems: "40 Problems",
      description:
        "Develop your DP thinking with optimized problem-solving techniques.",
    },
    {
      id: "algorithms",
      icon: "⌁",
      title: "Algorithms",
      problems: "50 Problems",
      description:
        "Practice searching, sorting, recursion, greedy, and algorithmic patterns.",
    },
  ];

  const challenges = [
    {
      title: "Python Coding Practice",
      description:
        "Solve beginner-friendly Python problems on conditionals, loops, lists, dictionaries, strings, and file handling.",
      icon: "🐍",
      link: "/practice/python-even-or-odd",
    },
    {
      title: "Python MCQ Quiz",
      description:
        "Assess your Python programming knowledge with 10 interactive multiple-choice questions and explanations.",
      icon: "❓",
      link: "/practice/quiz",
    },
    {
      title: "Topic-wise DSA Practice",
      description:
        "Choose a topic and practice problems according to your current skill level.",
      icon: "🎯",
      link: "/practice/arrays",
    },
  ];

  return (
    <main className="aeloria-practice">
      <section className="aeloria-practice-hero">
        <div className="aeloria-practice-hero-content">
          <span className="aeloria-practice-label">
            AELORIA PRACTICE
          </span>

          <h1 className="aeloria-practice-title">
            Practice More.
            <span>Build Better Skills.</span>
          </h1>

          <p className="aeloria-practice-description">
            Improve your problem-solving skills with topic-wise coding
            problems, challenges, quizzes, and mock tests.
          </p>

          <div className="aeloria-practice-actions">
            <a
              href="/practice/coding"
              className="aeloria-practice-primary-button"
            >
              Start Coding
            </a>

            <a
              href="/practice/quiz"
              className="aeloria-practice-secondary-button"
            >
              Take a Quiz
            </a>
          </div>
        </div>
      </section>

      <section className="aeloria-practice-content">
        <div className="aeloria-practice-heading">
          <span className="aeloria-practice-small-label">
            PRACTICE BY TOPIC
          </span>

          <h2>Master DSA Step by Step</h2>

          <p>
            Choose a topic and solve problems designed to strengthen
            your programming fundamentals.
          </p>
        </div>

        <div className="aeloria-practice-topic-grid">
          {topics.map((topic) => (
            <Link
              to={`/practice/${topic.id}`}
              className="aeloria-practice-topic-card"
              key={topic.id}
            >
              <div className="aeloria-practice-topic-icon">
                {topic.icon}
              </div>

              <div className="aeloria-practice-topic-info">
                <h3>{topic.title}</h3>

                <span>{topic.problems}</span>

                <p>{topic.description}</p>
              </div>

              <span className="aeloria-practice-topic-arrow">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="aeloria-practice-challenges">
        <div className="aeloria-practice-challenges-container">
          <div className="aeloria-practice-heading">
            <span className="aeloria-practice-small-label">
              KEEP PRACTICING
            </span>

            <h2>Choose Your Challenge</h2>

            <p>
              Practice consistently and turn your knowledge into
              real problem-solving skills.
            </p>
          </div>

          <div className="aeloria-practice-challenge-grid">
            {challenges.map((challenge) => (
              <div
                className="aeloria-practice-challenge-card"
                key={challenge.title}
              >
                <div className="aeloria-practice-challenge-icon">
                  {challenge.icon}
                </div>

                <h3>{challenge.title}</h3>

                <p>{challenge.description}</p>

                <Link to={challenge.link || "/practice"}>
                  Explore →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Practice;
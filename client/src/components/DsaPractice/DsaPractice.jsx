import "./DsaPractice.css";

function DsaPractice() {
  const dsaTopics = [
    "Arrays",
    "Strings",
    "Linked List",
    "Stack",
    "Queue",
    "Trees",
    "Graphs",
    "Dynamic Programming",
  ];

  return (
    <section className="aeloria-dsa-practice">
      <div className="aeloria-dsa-practice-container">

        {/* Header */}
        <div className="aeloria-dsa-practice-header">
          <div>
            <span className="aeloria-dsa-practice-label">
              PRACTICE & IMPROVE
            </span>

            <h2 className="aeloria-dsa-practice-title">
              Master DSA Through Practice
            </h2>

            <p className="aeloria-dsa-practice-description">
              Strengthen your problem-solving skills with topic-wise
              DSA learning and coding practice.
            </p>
          </div>

          <a
            href="/dsa"
            className="aeloria-dsa-practice-view-all"
          >
            Explore DSA →
          </a>
        </div>

        {/* Main Content */}
        <div className="aeloria-dsa-practice-layout">

          {/* DSA Card */}
          <div className="aeloria-dsa-learning-card">
            <div className="aeloria-dsa-learning-icon">
              &lt;/&gt;
            </div>

            <div className="aeloria-dsa-learning-content">
              <span className="aeloria-dsa-learning-badge">
                DSA ROADMAP
              </span>

              <h3 className="aeloria-dsa-learning-title">
                Data Structures & Algorithms
              </h3>

              <p className="aeloria-dsa-learning-description">
                Learn important data structures and algorithms
                step-by-step, from fundamentals to advanced concepts.
              </p>

              <a
                href="/dsa"
                className="aeloria-dsa-learning-button"
              >
                Start DSA Learning →
              </a>
            </div>
          </div>

          {/* Practice Card */}
          <div className="aeloria-dsa-practice-card">
            <div className="aeloria-dsa-practice-card-top">
              <div className="aeloria-dsa-practice-card-icon">
                ✓
              </div>

              <div>
                <span className="aeloria-dsa-practice-card-label">
                  CODING PRACTICE
                </span>

                <h3 className="aeloria-dsa-practice-card-title">
                  Practice Problems
                </h3>
              </div>
            </div>

            <p className="aeloria-dsa-practice-card-description">
              Pick a topic and start solving problems to improve
              your coding skills.
            </p>

            <div className="aeloria-dsa-topic-grid">
              {dsaTopics.map((topic) => (
                <a
                  href={`/practice?topic=${encodeURIComponent(topic)}`}
                  className="aeloria-dsa-topic-item"
                  key={topic}
                >
                  {topic}
                  <span>→</span>
                </a>
              ))}
            </div>

            <a
              href="/practice"
              className="aeloria-dsa-practice-button"
            >
              View All Problems →
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default DsaPractice;
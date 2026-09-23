import "./Why.css";

function Why() {
  const features = [
    {
      icon: "📚",
      title: "Structured Learning",
      description:
        "Learn programming through organized courses, tutorials, topics, and learning paths.",
    },
    {
      icon: "💻",
      title: "Learn by Practicing",
      description:
        "Strengthen your skills with coding problems, quizzes, DSA practice, and challenges.",
    },
    {
      icon: "✦",
      title: "AI-Powered Guidance",
      description:
        "Get help from Aeloria AI with simple explanations, examples, code, and topic-based doubts.",
    },
    {
      icon: "🚀",
      title: "Build Real Skills",
      description:
        "Move beyond theory and develop practical skills for projects, development, and interviews.",
    },
  ];

  return (
    <section className="aeloria-why">
      <div className="aeloria-why-container">

        <div className="aeloria-why-heading">
          <span className="aeloria-why-label">WHY AELORIA?</span>

          <h2 className="aeloria-why-title">
            Everything You Need to
            <span> Learn & Grow</span>
          </h2>

          <p className="aeloria-why-description">
            A complete learning ecosystem designed to help you understand
            concepts, practice consistently, and build your future in tech.
          </p>
        </div>

        <div className="aeloria-why-grid">
          {features.map((feature) => (
            <div className="aeloria-why-card" key={feature.title}>
              <div className="aeloria-why-icon">
                {feature.icon}
              </div>

              <h3 className="aeloria-why-card-title">
                {feature.title}
              </h3>

              <p className="aeloria-why-card-description">
                {feature.description}
              </p>

              <a
                href="/courses"
                className="aeloria-why-card-link"
              >
                Explore More →
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Why;
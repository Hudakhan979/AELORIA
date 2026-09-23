import "./ResourcesSection.css";

function ResourcesSection() {
  const resources = [
    {
      type: "NOTES",
      title: "C Programming Notes",
      description:
        "Quick revision notes covering important C programming concepts.",
      meta: "12 Topics",
    },
    {
      type: "NOTES",
      title: "Data Structures Notes",
      description:
        "Understand arrays, linked lists, stacks, queues, trees, and graphs.",
      meta: "18 Topics",
    },
    {
      type: "NOTES",
      title: "JavaScript Notes",
      description:
        "Important JavaScript concepts with simple explanations and examples.",
      meta: "15 Topics",
    },
    {
      type: "CHEATSHEET",
      title: "SQL Quick Reference",
      description:
        "Useful SQL commands, queries, joins, and database concepts.",
      meta: "40+ Commands",
    },
    {
      type: "NOTES",
      title: "Operating Systems",
      description:
        "Revision material for processes, memory, scheduling, and file systems.",
      meta: "14 Topics",
    },
    {
      type: "CHEATSHEET",
      title: "Git & GitHub Guide",
      description:
        "Essential Git commands and workflows for everyday development.",
      meta: "25+ Commands",
    },
  ];

  return (
    <section className="aeloria-free-resources">
      <div className="aeloria-free-resources-container">

        {/* Header */}
        <div className="aeloria-free-resources-header">
          <div>
            <span className="aeloria-free-resources-label">
              FREE LEARNING MATERIAL
            </span>

            <h2 className="aeloria-free-resources-title">
              Notes & Resources
            </h2>

            <p className="aeloria-free-resources-description">
              Get concise study material, revision notes, and
              developer resources to learn faster.
            </p>
          </div>

          <a
            href="/notes"
            className="aeloria-free-resources-view-all"
          >
            View All Resources →
          </a>
        </div>

        {/* Resource Grid */}
        <div className="aeloria-free-resources-grid">
          {resources.map((resource) => (
            <article
              className="aeloria-free-resource-card"
              key={resource.title}
            >
              <div className="aeloria-free-resource-top">
                <div className="aeloria-free-resource-icon">
                  {resource.type === "NOTES" ? "▤" : "⌘"}
                </div>

                <span className="aeloria-free-resource-type">
                  {resource.type}
                </span>
              </div>

              <h3 className="aeloria-free-resource-title">
                {resource.title}
              </h3>

              <p className="aeloria-free-resource-description">
                {resource.description}
              </p>

              <div className="aeloria-free-resource-footer">
                <span className="aeloria-free-resource-meta">
                  {resource.meta}
                </span>

                <a
                  href="/notes"
                  className="aeloria-free-resource-link"
                >
                  Read →
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="aeloria-free-resources-cta">
          <div>
            <span className="aeloria-free-resources-cta-label">
              NEED HELP WITH A TOPIC?
            </span>

            <h3 className="aeloria-free-resources-cta-title">
              Ask Aeloria AI
            </h3>

            <p className="aeloria-free-resources-cta-description">
              Get simple explanations, examples, code, and
              practice questions for your doubts.
            </p>
          </div>

          <a
            href="/ai-assistant"
            className="aeloria-free-resources-cta-button"
          >
            ✦ Ask Aeloria AI
          </a>
        </div>

      </div>
    </section>
  );
}

export default ResourcesSection;
import { Link } from "react-router-dom";
import "./ResourcesSection.css";

function ResourcesSection() {
  const resources = [
    {
      type: "STUDY NOTES",
      category: "C Programming",
      title: "Pointers & Memory Architecture",
      description:
        "Comprehensive breakdown of stack vs heap, pointer arithmetic, memory leaks, and dynamic arrays in C.",
      tag: "12 Topics",
      slug: "c-pointers-and-memory",
    },
    {
      type: "ALGORITHM NOTES",
      category: "DSA",
      title: "Big-O & Asymptotic Cheat Sheet",
      description:
        "Quick revision notes covering time and space complexities for trees, heaps, graphs, sorting, and binary search.",
      tag: "Cheat Sheet",
      slug: "big-o-complexity-guide",
    },
    {
      type: "REVISION NOTES",
      category: "JavaScript",
      title: "V8 Event Loop & Async Architecture",
      description:
        "Deep dive into microtask queues, macrotask scheduling, promises, and async/await event loops.",
      tag: "Core Guide",
      slug: "javascript-event-loop",
    },
    {
      type: "CHEATSHEET",
      category: "SQL & Databases",
      title: "SQL Indexing & Query Optimization",
      description:
        "Essential SQL queries, B-tree indexes, execution plans, join algorithms, and schema normalization.",
      tag: "Reference",
      slug: "sql-optimization",
    },
    {
      type: "SYSTEM NOTES",
      category: "OS & Systems",
      title: "Process Scheduling & Concurrency",
      description:
        "Thread synchronization, semaphores, mutex locks, deadlocks, and virtual memory paging concepts.",
      tag: "Revision",
      slug: "os-concurrency",
    },
    {
      type: "DEVELOPER GUIDE",
      category: "DevOps & Tooling",
      title: "Production Git Workflows",
      description:
        "Interactive rebase, merge strategies, submodules, bisect debugging, and clean commit hygiene.",
      tag: "25+ Commands",
      slug: "git-workflows",
    },
  ];

  return (
    <section className="aeloria-free-resources">
      <div className="aeloria-free-resources-container">
        {/* Section Header */}
        <div className="aeloria-free-resources-header">
          <div>
            <div className="aeloria-resources-header-badge">
              <span className="aeloria-free-coral-dot"></span>
              FREE RESOURCES
            </div>

            <h2 className="aeloria-free-resources-title">
              Revision Notes & <span>Cheatsheets</span>
            </h2>

            <p className="aeloria-free-resources-description">
              High-yield technical summaries, interview revision sheets, and reference
              guides crafted for rapid mastery.
            </p>
          </div>

          <Link to="/notes" className="aeloria-free-resources-view-all">
            View All Notes (Free) →
          </Link>
        </div>

        {/* Resources Cards Grid */}
        <div className="aeloria-free-resources-grid">
          {resources.map((resource) => (
            <article
              className="aeloria-free-resource-card"
              key={resource.title}
            >
              {/* Card Sub-section Header */}
              <div className="aeloria-resource-card-top">
                <span className="aeloria-resource-type-badge">
                  {resource.type}
                </span>
                <span className="aeloria-resource-category">
                  {resource.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="aeloria-resource-card-body">
                <h3 className="aeloria-free-resource-title">
                  {resource.title}
                </h3>

                <p className="aeloria-free-resource-description">
                  {resource.description}
                </p>

                {/* Card Footer */}
                <div className="aeloria-free-resource-footer">
                  <span className="aeloria-resource-tag">
                    🏷️ {resource.tag}
                  </span>

                  <Link
                    to={`/notes/${resource.slug}`}
                    className="aeloria-free-resource-link"
                  >
                    Read Note →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom AI Teaser Banner */}
        <div className="aeloria-free-resources-cta">
          <div className="aeloria-resources-cta-left">
            <span className="aeloria-free-resources-cta-label">
              ✦ STUCK ON A TOPIC?
            </span>
            <h3 className="aeloria-free-resources-cta-title">
              Ask Aeloria AI in Real-Time
            </h3>
            <p className="aeloria-free-resources-cta-description">
              Get step-by-step analogies, code samples, and practice questions for any
              concept in your curriculum.
            </p>
          </div>

          <Link
            to="/ai-assistant"
            className="aeloria-free-resources-cta-button"
          >
            ✦ Launch AI Assistant →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ResourcesSection;
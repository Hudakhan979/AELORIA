import "./AI.css";

function AI() {
  return (
    <section className="aeloria-ai-section">
      <div className="aeloria-ai-section-container">

        <div className="aeloria-ai-section-content">

          <span className="aeloria-ai-section-label">
            ✦ AELORIA AI
          </span>

          <h2 className="aeloria-ai-section-title">
            Your Personal
            <span> Learning Assistant</span>
          </h2>

          <p className="aeloria-ai-section-description">
            Stuck on a programming concept? Ask Aeloria AI for
            simple explanations, examples, code, or practice
            questions based on what you are learning.
          </p>

          <div className="aeloria-ai-section-features">

            <div className="aeloria-ai-section-feature">
              <span className="aeloria-ai-section-feature-icon">✦</span>
              <span>Explain concepts simply</span>
            </div>

            <div className="aeloria-ai-section-feature">
              <span className="aeloria-ai-section-feature-icon">
                &lt;/&gt;
              </span>
              <span>Get code examples</span>
            </div>

            <div className="aeloria-ai-section-feature">
              <span className="aeloria-ai-section-feature-icon">?</span>
              <span>Ask topic-specific doubts</span>
            </div>

            <div className="aeloria-ai-section-feature">
              <span className="aeloria-ai-section-feature-icon">✓</span>
              <span>Practice with AI-generated questions</span>
            </div>

          </div>

          <a
            href="/ai-assistant"
            className="aeloria-ai-section-button"
          >
            Try Aeloria AI →
          </a>

        </div>

        <div className="aeloria-ai-section-preview">

          <div className="aeloria-ai-preview-window">

            <div className="aeloria-ai-preview-header">

              <div className="aeloria-ai-preview-brand">

                <div className="aeloria-ai-preview-icon">
                  ✦
                </div>

                <div>
                  <strong>Aeloria AI</strong>
                  <span>Learning Assistant</span>
                </div>

              </div>

              <span className="aeloria-ai-preview-status">
                ● Online
              </span>

            </div>

            <div className="aeloria-ai-preview-body">

              <div className="aeloria-ai-preview-message user">
                Can you explain recursion simply?
              </div>

              <div className="aeloria-ai-preview-message assistant">

                <strong>Sure! ✦</strong>

                <p>
                  Recursion is when a function calls itself
                  to solve a smaller version of the same problem.
                </p>

                <div className="aeloria-ai-preview-code">
                  function count(n) {"{"}
                  <br />
                  &nbsp;&nbsp;if (n === 0) return;
                  <br />
                  &nbsp;&nbsp;count(n - 1);
                  <br />
                  {"}"}
                </div>

                <span className="aeloria-ai-preview-hint">
                  Want a practice question?
                </span>

              </div>

            </div>

            <div className="aeloria-ai-preview-input">
              <span>Ask Aeloria AI...</span>

              <button aria-label="Send message">
                ↑
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default AI;
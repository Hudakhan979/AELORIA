import { Link } from "react-router-dom";
import "./AI.css";

function AI() {
  const sampleActions = [
    { label: "Explain Simply", query: "Explain pointers simply using a real-world analogy" },
    { label: "Give Example", query: "Show a practical example of pointers with arrays" },
    { label: "Give Code", query: "Provide clean C code demonstrating pointer swapping" },
    { label: "Quiz Me", query: "Give me a quick 3-question quiz on memory addresses" },
  ];

  return (
    <section className="aeloria-ai-section">
      <div className="aeloria-ai-section-container">
        {/* Left Column: Copy & Actions */}
        <div className="aeloria-ai-section-content">
          <div className="aeloria-ai-section-badge">
            <span className="aeloria-ai-sparkle">✦</span>
            CONTEXT-AWARE AI TUTOR
          </div>

          <h2 className="aeloria-ai-section-title">
            Meet <span>Aeloria AI</span>
          </h2>

          <p className="aeloria-ai-section-subtitle">
            Your personal learning assistant for programming and problem solving.
          </p>

          <p className="aeloria-ai-section-description">
            Stuck on complex pointer arithmetic or tree recursion? Aeloria AI analyzes
            your exact active lesson and delivers step-by-step analogies, clean code,
            and practice quizzes.
          </p>

          <div className="aeloria-ai-features-grid">
            <div className="aeloria-ai-feature-pill">
              <span className="feat-icon">💡</span>
              <span>Intuitive Real-World Analogies</span>
            </div>
            <div className="aeloria-ai-feature-pill">
              <span className="feat-icon">⚡</span>
              <span>Instant Code Explanations</span>
            </div>
            <div className="aeloria-ai-feature-pill">
              <span className="feat-icon">🎯</span>
              <span>Contextual Quiz Generation</span>
            </div>
            <div className="aeloria-ai-feature-pill">
              <span className="feat-icon">🛡️</span>
              <span>100% Local Ollama Privacy</span>
            </div>
          </div>

          <div className="aeloria-ai-actions-wrap">
            <Link
              to="/ai-assistant"
              className="aeloria-ai-primary-btn"
            >
              ✦ Launch Aeloria AI →
            </Link>
          </div>
        </div>

        {/* Right Column: Large White Chat Interface */}
        <div className="aeloria-ai-preview-panel">
          <div className="aeloria-ai-chat-card">
            {/* Header */}
            <div className="aeloria-ai-chat-header">
              <div className="aeloria-ai-brand-group">
                <div className="aeloria-ai-avatar">✦</div>
                <div>
                  <strong>Aeloria AI</strong>
                  <span className="aeloria-ai-role">Programming Mentor</span>
                </div>
              </div>

              <div className="aeloria-ai-chat-status">
                <span className="chat-status-pulse"></span>
                <span>Online • Context Aware</span>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="aeloria-ai-chat-body">
              {/* Student Message */}
              <div className="chat-bubble student-bubble">
                <div className="bubble-author">Student</div>
                <p>Explain pointers simply.</p>
              </div>

              {/* AI Response Message */}
              <div className="chat-bubble ai-bubble">
                <div className="bubble-author-ai">
                  <span>✦ Aeloria AI</span>
                  <span className="bubble-tag">Step-by-Step</span>
                </div>
                <p>
                  Think of a pointer as a <strong>house address</strong> rather than
                  the house itself.
                </p>
                <p>
                  A regular variable holds a value (like the furniture inside). A
                  pointer holds the <strong>memory address</strong> where that value
                  lives.
                </p>

                {/* Micro Code Snippet */}
                <div className="chat-code-block">
                  <div className="chat-code-header">
                    <span>C</span>
                    <span>Address &amp; Dereference</span>
                  </div>
                  <code>
                    <span className="c-type">int</span> score = <span className="c-num">95</span>;{"\n"}
                    <span className="c-type">int</span> *ptr = &amp;score;{" "}
                    <span className="c-com">// ptr holds address</span>{"\n"}
                    printf(<span className="c-str">&quot;%d\n&quot;</span>, *ptr);{" "}
                    <span className="c-com">// dereferences 95</span>
                  </code>
                </div>
              </div>
            </div>

            {/* One-Click Action Prompts */}
            <div className="aeloria-ai-quick-prompts">
              <span className="quick-label">Try Asking:</span>
              <div className="quick-buttons-row">
                {sampleActions.map((act) => (
                  <Link
                    key={act.label}
                    to={`/ai-assistant?prompt=${encodeURIComponent(act.query)}`}
                    className="quick-action-pill"
                  >
                    {act.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AI;
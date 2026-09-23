import { useState } from "react";
import "./AI.css";

function AI() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "assistant",
      text: "Hi! I'm Aeloria AI ✦ Ask me anything about the topic you're learning.",
    },
  ]);

  const sendMessage = (text = message) => {
    const newMessage = text.trim();

    if (!newMessage) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: newMessage,
      },
      {
        type: "assistant",
        text: "I can help you understand this concept. Connect the Aeloria AI backend to get real topic-based answers here.",
      },
    ]);

    setMessage("");
  };

  const quickActions = [
    "Explain Simply",
    "Give Example",
    "Give Code",
    "Quiz Me",
  ];

  const suggestions = [
    "Explain recursion in simple words",
    "What is an API?",
    "Difference between let and const",
    "Explain OOP with an example",
  ];

  return (
    <main className="aeloria-ai-page">

      {/* Header */}
      <section className="aeloria-ai-page-header">
        <div className="aeloria-ai-page-header-content">

          <div className="aeloria-ai-page-title-area">
            <div className="aeloria-ai-page-icon">✦</div>

            <div>
              <span className="aeloria-ai-page-label">
                AELORIA AI
              </span>

              <h1>
                Your Learning Assistant
              </h1>

              <p>
                Ask questions, understand concepts, get examples,
                and practice what you learn.
              </p>
            </div>
          </div>

          <div className="aeloria-ai-page-status">
            <span>●</span>
            Ready to help
          </div>

        </div>
      </section>

      {/* Main AI Area */}
      <section className="aeloria-ai-page-content">

        {/* Context Sidebar */}
        <aside className="aeloria-ai-page-sidebar">

          <div className="aeloria-ai-context-card">

            <span className="aeloria-ai-context-label">
              LEARNING CONTEXT
            </span>

            <h2>JavaScript</h2>

            <p>
              Current topic: Functions & Scope
            </p>

            <div className="aeloria-ai-context-progress">
              <div>
                <span>Topic Progress</span>
                <strong>65%</strong>
              </div>

              <div className="aeloria-ai-progress-track">
                <span></span>
              </div>
            </div>

          </div>

          <div className="aeloria-ai-actions-card">

            <span className="aeloria-ai-context-label">
              QUICK ACTIONS
            </span>

            <div className="aeloria-ai-action-list">

              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                >
                  <span>
                    {action === "Explain Simply" && "✦"}
                    {action === "Give Example" && "◎"}
                    {action === "Give Code" && "</>"}
                    {action === "Quiz Me" && "?"}
                  </span>

                  {action}
                </button>
              ))}

            </div>

          </div>

          <div className="aeloria-ai-sidebar-note">
            <span>✦</span>

            <p>
              Aeloria AI is designed to help you learn,
              not replace your own practice.
            </p>
          </div>

        </aside>

        {/* Chat */}
        <div className="aeloria-ai-chat">

          <div className="aeloria-ai-chat-header">

            <div>
              <strong>Aeloria AI</strong>
              <span>Learning Assistant</span>
            </div>

            <button
              onClick={() =>
                setMessages([
                  {
                    type: "assistant",
                    text: "Hi! I'm Aeloria AI ✦ Ask me anything about the topic you're learning.",
                  },
                ])
              }
            >
              New Chat
            </button>

          </div>

          {/* Messages */}
          <div className="aeloria-ai-messages">

            {messages.map((item, index) => (
              <div
                className={`aeloria-ai-message ${
                  item.type === "user"
                    ? "aeloria-ai-user-message"
                    : "aeloria-ai-assistant-message"
                }`}
                key={`${item.type}-${index}`}
              >

                {item.type === "assistant" && (
                  <div className="aeloria-ai-message-avatar">
                    ✦
                  </div>
                )}

                <div className="aeloria-ai-message-content">

                  {item.type === "assistant" && (
                    <span className="aeloria-ai-message-name">
                      Aeloria AI
                    </span>
                  )}

                  <p>{item.text}</p>

                </div>

              </div>
            ))}

          </div>

          {/* Suggestions */}
          <div className="aeloria-ai-suggestions">

            <span>TRY ASKING</span>

            <div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>

          </div>

          {/* Input */}
          <div className="aeloria-ai-input-area">

            <div className="aeloria-ai-input-wrapper">

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask Aeloria AI about what you're learning..."
                rows="1"
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <button
                className="aeloria-ai-send-button"
                onClick={() => sendMessage()}
                aria-label="Send message"
              >
                ↑
              </button>

            </div>

            <p>
              Aeloria AI can make mistakes. Verify important information.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}

export default AI;
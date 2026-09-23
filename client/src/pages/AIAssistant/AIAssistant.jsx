import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sendAIMessage } from "../../services/api";
import "./AIAssistant.css";

const AIAssistant = () => {
const { token, isLoggedIn } = useAuth();
const [searchParams] = useSearchParams();
const location = useLocation();

  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [learningPoints, setLearningPoints] = useState([]);
  const [action, setAction] = useState("answer");

  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD AI CONTEXT FROM URL
  // Example:
  // /ai-assistant?subject=Algorithms&topic=Binary%20Search&course=DSA
  // --------------------------------------------------

  useEffect(() => {
    const urlSubject = searchParams.get("subject") || "";
    const urlTopic = searchParams.get("topic") || "";
    const urlCourse = searchParams.get("course") || "";

    if (urlSubject) setSubject(urlSubject);
    if (urlTopic) setTopic(urlTopic);
    if (urlCourse) setCourse(urlCourse);

    const contextState = location.state;

    // Direct link state arrived via React Router
    if (contextState?.lessonContent || contextState?.learningPoints) {
      if (contextState.lessonContent) {
        setLessonContent(contextState.lessonContent);
      }
      if (contextState.learningPoints) {
        setLearningPoints(contextState.learningPoints);
      }

      // Cache for browser refresh
      try {
        sessionStorage.setItem(
          "aeloria_ai_context",
          JSON.stringify({
            subject: urlSubject,
            topic: urlTopic,
            course: urlCourse,
            lessonContent: contextState.lessonContent || "",
            learningPoints: contextState.learningPoints || [],
          })
        );
      } catch (e) {
        console.error("Session storage error:", e);
      }
    } else {
      // Direct URL or browser refresh fallback
      try {
        const cached = sessionStorage.getItem("aeloria_ai_context");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (!urlTopic || parsed.topic === urlTopic) {
            if (parsed.lessonContent) setLessonContent(parsed.lessonContent);
            if (parsed.learningPoints) setLearningPoints(parsed.learningPoints);
            if (!urlSubject && parsed.subject) setSubject(parsed.subject);
            if (!urlCourse && parsed.course) setCourse(parsed.course);
            if (!urlTopic && parsed.topic) setTopic(parsed.topic);
          }
        }
      } catch (e) {
        console.error("Cache restore error:", e);
      }
    }
  }, [searchParams, location.state]);

  const handleSubmit = async (selectedAction = action, customPrompt = null) => {
    const promptToSend = customPrompt !== null ? customPrompt : message;
    const cleanPrompt = promptToSend.trim();

    if (!cleanPrompt) {
      setError("Please enter your question first.");
      return;
    }

    if (!isLoggedIn || !token) {
      setError("Please login to use AELORIA AI.");
      return;
    }

    setError("");
    setLoading(true);

    setChat((previous) => [
      ...previous,
      {
        type: "user",
        message: cleanPrompt,
      },
    ]);

    try {
      const result = await sendAIMessage(
        {
          message: cleanPrompt,
          subject,
          topic,
          course,
          lessonContent,
          learningPoints,
          action: selectedAction,
        },
        token
      );

      if (result.success) {
        setChat((prev) => [
          ...prev,
          {
            type: "ai",
            message: result.data.response,
          },
        ]);
      } else {
        setError(result.message || "AELORIA AI could not respond.");
      }
    } catch (apiError) {
      setError(
        apiError.message ||
          "AELORIA AI could not connect to the local AI model. Make sure Ollama is running."
      );
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  const handleAction = (selectedAction) => {
    setAction(selectedAction);

    let promptMsg = message.trim();
    if (!promptMsg) {
      const currentTopicName = topic || course || "this concept";
      switch (selectedAction) {
        case "explain":
          promptMsg = `Explain ${currentTopicName} in simple terms.`;
          break;
        case "example":
          promptMsg = `Give a practical example for ${currentTopicName}.`;
          break;
        case "code":
          promptMsg = `Show me code examples for ${currentTopicName}.`;
          break;
        case "quiz":
          promptMsg = `Quiz me on ${currentTopicName}.`;
          break;
        default:
          promptMsg = `Explain ${currentTopicName}.`;
      }
    }

    handleSubmit(selectedAction, promptMsg);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(action);
    }
  };

  // --------------------------------------------------
  // LOGIN SCREEN
  // --------------------------------------------------

  if (!isLoggedIn) {
    return (
      <div className="aeloria-ai-page">
        <div className="aeloria-ai-login-card">
          <div className="aeloria-ai-login-icon">🤖</div>

          <h1>Welcome to AELORIA AI</h1>

          <p>
            Your personal learning assistant for programming, DSA,
            web development, AI & ML, and more.
          </p>

          <Link to="/login" className="aeloria-ai-login-button">
            Login to Continue
          </Link>

          <Link to="/register" className="aeloria-ai-register-link">
            Don't have an account? Create one
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="aeloria-ai-page">
      <div className="aeloria-ai-container">

        {/* HEADER */}
        <div className="aeloria-ai-header">
          <div className="aeloria-ai-header-icon">🤖</div>

          <div>
            <h1>AELORIA AI</h1>
            <p>Your intelligent learning companion</p>
          </div>
        </div>

        {/* CONTEXT */}
        <div className="aeloria-ai-context-card">

          <div className="aeloria-ai-context-heading">
            <h2>Learning Context</h2>
            <span>
              {course || topic || subject ? "Active" : "Optional"}
            </span>
          </div>

          <div className="aeloria-ai-context-grid">

            {/* SUBJECT */}
            <div className="aeloria-ai-field">
              <label>Subject</label>

              <select
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              >
                <option value="">Select Subject</option>
                <option value="Programming">Programming</option>
                <option value="Data Structures">Data Structures</option>
                <option value="Algorithms">Algorithms</option>
                <option value="Web Development">Web Development</option>
                <option value="AI & ML">AI & ML</option>
                <option value="Data Science">Data Science</option>
                <option value="DevOps">DevOps</option>
                <option value="Computer Science">
                  Computer Science
                </option>
              </select>
            </div>

            {/* TOPIC */}
            <div className="aeloria-ai-field">
              <label>Topic</label>

              <input
                type="text"
                placeholder="e.g. Linked List"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
              />
            </div>

            {/* COURSE */}
            <div className="aeloria-ai-field">
              <label>Course</label>

              <input
                type="text"
                placeholder="e.g. Complete DSA"
                value={course}
                onChange={(event) => setCourse(event.target.value)}
              />
            </div>

          </div>

          {/* ACTIVE CONTEXT */}
          {(course || topic || subject) && (
            <div className="aeloria-ai-active-context">
              <span>🧠 AI Context:</span>

              {course && <strong> {course}</strong>}

              {topic && (
                <>
                  <span> → </span>
                  <strong>{topic}</strong>
                </>
              )}

              {subject && (
                <>
                  <span> → </span>
                  <strong>{subject}</strong>
                </>
              )}
            </div>
          )}
        </div>

        {/* CHAT */}
        <div className="aeloria-ai-chat-card">

          {chat.length === 0 ? (
            <div className="aeloria-ai-empty">

              <div className="aeloria-ai-empty-icon">
                ✨
              </div>

              <h2>How can I help you?</h2>

              <p>
                Ask me anything about your current learning topic.
              </p>

              <div className="aeloria-ai-suggestions">

                <button
                  onClick={() => {
                    setMessage("Explain what a linked list is.");
                    setSubject("Data Structures");
                    setTopic("Linked List");
                  }}
                >
                  Explain Linked List
                </button>

                <button
                  onClick={() => {
                    setMessage("Give me an example of binary search.");
                    setSubject("Algorithms");
                    setTopic("Binary Search");
                  }}
                >
                  Binary Search Example
                </button>

                <button
                  onClick={() => {
                    setMessage("How does a React component work?");
                    setSubject("Web Development");
                    setTopic("React");
                  }}
                >
                  React Components
                </button>

              </div>
            </div>
          ) : (
            <div className="aeloria-ai-messages">

              {chat.map((item, index) => (
                <div
                  key={`${item.type}-${index}`}
                  className={`aeloria-ai-message ${
                    item.type === "user"
                      ? "aeloria-ai-message-user"
                      : "aeloria-ai-message-ai"
                  }`}
                >
                  <div className="aeloria-ai-message-avatar">
                    {item.type === "user" ? "You" : "AI"}
                  </div>

                  <div className="aeloria-ai-message-content">

                    <span>
                      {item.type === "user"
                        ? "You"
                        : "AELORIA AI"}
                    </span>

                    <div className="aeloria-ai-message-text">
                      {item.message.split("\n\n").map((part, pIdx) => {
                        if (part.startsWith("```")) {
                          const cleaned = part
                            .replace(/^```[a-zA-Z]*\n/, "")
                            .replace(/\n```$/, "");
                          return (
                            <pre key={pIdx} className="aeloria-ai-code-snippet">
                              <code>{cleaned}</code>
                            </pre>
                          );
                        }
                        return <p key={pIdx}>{part}</p>;
                      })}
                    </div>

                  </div>
                </div>
              ))}

              {loading && (
                <div className="aeloria-ai-message aeloria-ai-message-ai">

                  <div className="aeloria-ai-message-avatar">
                    AI
                  </div>

                  <div className="aeloria-ai-message-content">

                    <span>AELORIA AI</span>

                    <div className="aeloria-ai-loading">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* ACTIONS */}
          <div className="aeloria-ai-actions">

            <button
              type="button"
              onClick={() => handleAction("explain")}
              disabled={loading}
            >
              ✨ Explain Simply
            </button>

            <button
              type="button"
              onClick={() => handleAction("example")}
              disabled={loading}
            >
              💡 Give Example
            </button>

            <button
              type="button"
              onClick={() => handleAction("code")}
              disabled={loading}
            >
              💻 Give Code
            </button>

            <button
              type="button"
              onClick={() => handleAction("quiz")}
              disabled={loading}
            >
              📝 Quiz Me
            </button>

          </div>

          {/* INPUT */}
          <div className="aeloria-ai-input-area">

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                topic
                  ? `Ask anything about ${topic}...`
                  : "Ask AELORIA AI anything..."
              }
              rows="3"
            />

            <button
              type="button"
              className="aeloria-ai-send-button"
              onClick={() => handleSubmit("answer")}
              disabled={loading || !message.trim()}
            >
              {loading ? "Thinking..." : "Send"}
            </button>

          </div>

          {error && (
            <div className="aeloria-ai-error">
              {error}
            </div>
          )}

          <p className="aeloria-ai-disclaimer">
            AELORIA AI is designed to help you learn concepts,
            understand examples, and practice programming.
          </p>

        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
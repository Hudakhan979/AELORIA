import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sendAIMessage } from "../../services/api";
import "./AIAssistant.css";

function CodeSnippet({ lang, code }) {
  const [copied, setCopied] = useState(false);

  // Sanitize any stray UI button text if present inside code block
  const cleanCode = (code || "")
    .replace(/^(?:PYTHON|JAVASCRIPT|JAVA|C\+\+|C)?\s*Copy\s*Code\s*\n?/i, "")
    .trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="aeloria-ai-code-wrapper">
      <div
        className="aeloria-ai-code-header"
        style={{ userSelect: "none", WebkitUserSelect: "none" }}
      >
        <span className="aeloria-ai-code-lang">{(lang || "python").toUpperCase()}</span>
        <button
          type="button"
          className="aeloria-ai-code-copy-btn"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
        >
          {copied ? "✓ Copied" : "Copy Code"}
        </button>
      </div>
      <pre className="aeloria-ai-code-body">
        <code>{cleanCode}</code>
      </pre>
    </div>
  );
}

function parseInline(text) {
  if (!text) return "";
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="aeloria-ai-inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function renderMessageContent(content) {
  if (!content) return null;

  // Sanitize stray UI artifacts and normalize CRLF to LF
  const sanitized = content
    .replace(/(?:PYTHON|JAVASCRIPT|JAVA|C\+\+|C)?\s*Copy\s*Code/gi, "")
    .replace(/\r\n/g, "\n");

  // Split on fenced code blocks: ```lang\ncode``` (handling optional whitespace before newline)
  const segments = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)[^\S\r\n]*\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(sanitized)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        raw: sanitized.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: "code",
      lang: match[1]?.toLowerCase() || "python",
      code: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({
      type: "text",
      raw: content.slice(lastIndex),
    });
  }

  return segments.map((seg, segIdx) => {
    if (seg.type === "code") {
      return (
        <CodeSnippet
          key={`code-${segIdx}`}
          lang={seg.lang}
          code={seg.code}
        />
      );
    }

    const lines = seg.raw.split("\n");
    const elements = [];
    let currentParagraph = [];
    let currentList = [];
    let lineIdx = 0;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(" ").trim();
        if (text) {
          elements.push(
            <p key={`p-${segIdx}-${lineIdx++}`} className="aeloria-ai-paragraph">
              {parseInline(text)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${segIdx}-${lineIdx++}`} className="aeloria-ai-list">
            {currentList.map((item, idx) => (
              <li key={idx}>{parseInline(item)}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!line) {
        flushParagraph();
        flushList();
        continue;
      }

      // Headings
      if (line.startsWith("### ")) {
        flushParagraph();
        flushList();
        elements.push(
          <h4 key={`h4-${segIdx}-${lineIdx++}`} className="aeloria-ai-heading">
            {parseInline(line.replace(/^###\s+/, ""))}
          </h4>
        );
        continue;
      }
      if (line.startsWith("## ") || line.startsWith("# ")) {
        flushParagraph();
        flushList();
        elements.push(
          <h3 key={`h3-${segIdx}-${lineIdx++}`} className="aeloria-ai-heading">
            {parseInline(line.replace(/^#{1,2}\s+/, ""))}
          </h3>
        );
        continue;
      }

      // Lists
      if (/^[-*•]\s+/.test(line)) {
        flushParagraph();
        currentList.push(line.replace(/^[-*•]\s+/, ""));
        continue;
      }
      if (/^\d+\.\s+/.test(line)) {
        flushParagraph();
        currentList.push(line.replace(/^\d+\.\s+/, ""));
        continue;
      }

      // Normal text
      flushList();
      currentParagraph.push(line);
    }

    flushParagraph();
    flushList();

    return <div key={`text-${segIdx}`} className="aeloria-ai-text-block">{elements}</div>;
  });
}

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
  // --------------------------------------------------
  useEffect(() => {
    const urlSubject = searchParams.get("subject") || "";
    const urlTopic = searchParams.get("topic") || "";
    const urlCourse = searchParams.get("course") || "";
    const urlPrompt = searchParams.get("prompt") || "";

    if (urlSubject) setSubject(urlSubject);
    if (urlTopic) setTopic(urlTopic);
    if (urlCourse) setCourse(urlCourse);
    if (urlPrompt) setMessage(urlPrompt);

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

    const currentChatSnapshot = chat;
    setChat((previous) => [
      ...previous,
      {
        type: "user",
        message: cleanPrompt,
      },
    ]);

    try {
      // Prepare multi-turn conversation history
      const formattedHistory = currentChatSnapshot.slice(-8).map((item) => ({
        role: item.type === "user" ? "user" : "assistant",
        content: item.message,
      }));

      const result = await sendAIMessage(
        {
          message: cleanPrompt,
          history: formattedHistory,
          subject,
          topic,
          course,
          lessonContent,
          learningPoints,
          action: selectedAction,
        },
        token
      );

      if (result.success && result.data?.response) {
        setChat((prev) => [
          ...prev,
          {
            type: "ai",
            message: result.data.response,
          },
        ]);
      } else {
        setError(result.message || "AELORIA AI could not process your request.");
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
                placeholder="e.g. Lists and Tuples"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
              />
            </div>

            {/* COURSE */}
            <div className="aeloria-ai-field">
              <label>Course</label>

              <input
                type="text"
                placeholder="e.g. Python Programming"
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
                Ask me anything about programming, code debugging, or concepts.
              </p>

              <div className="aeloria-ai-suggestions">

                <button
                  onClick={() => {
                    setMessage("Explain the difference between Python lists and tuples with examples.");
                    setSubject("Programming");
                    setTopic("Python Basics");
                  }}
                >
                  Explain Lists vs Tuples
                </button>

                <button
                  onClick={() => {
                    setMessage("Write Python code to find the factorial of a number.");
                    setSubject("Programming");
                    setTopic("Functions");
                  }}
                >
                  Factorial in Python
                </button>

                <button
                  onClick={() => {
                    setMessage('Fix this Python code: print("Hello"');
                    setSubject("Programming");
                    setTopic("Syntax & Debugging");
                  }}
                >
                  Fix Broken Code
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
                      {item.type === "user" ? (
                        <p>{item.message}</p>
                      ) : (
                        renderMessageContent(item.message)
                      )}
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
              onClick={() => handleSubmit(action)}
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
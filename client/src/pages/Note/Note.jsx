import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getNoteById } from "../../services/api";
import "./Note.css";

const fallbackNotes = {
  "c-programming-notes": {
    title: "C Programming Notes",
    category: "C",
    language: "C",
    description:
      "Comprehensive C revision notes covering memory management, pointers, structures, recursion, and preprocessor directives.",
    content: `## 1. Fundamentals of C
C is a statically typed, procedural language that gives developers direct access to memory through pointers. 
Every C execution begins at the \`main()\` function.

\`\`\`c
#include <stdio.h>

int main(void) {
    printf("Welcome to AELORIA C Notes!\\n");
    return 0;
}
\`\`\`

## 2. Pointers & Memory Architecture
A pointer stores the memory address of another variable.
- \`&\` (Address-of operator): Retrieves the memory location.
- \`*\` (Dereference operator): Accesses the value stored at the referenced address.

\`\`\`c
int value = 42;
int *ptr = &value; // ptr holds &value
printf("Value: %d, Address: %p\\n", *ptr, (void*)ptr);
\`\`\`

## 3. Dynamic Memory Allocation
Using \`<stdlib.h>\`:
- \`malloc(size)\`: Allocates uninitialized memory.
- \`calloc(n, size)\`: Allocates zero-initialized memory.
- \`realloc(ptr, newSize)\`: Resizes previously allocated block.
- \`free(ptr)\`: Releases heap memory to prevent memory leaks.

## 4. Structures & Unions
A \`struct\` groups variables of different data types together under a single contiguous memory block:
\`\`\`c
struct Student {
    char name[50];
    int rollNumber;
    float gpa;
};
\`\`\`
`,
    tags: ["Pointers", "Memory", "Structures", "Basics", "Algorithms"],
    pdfUrl: "https://example.com/notes/c-programming.pdf",
    relatedCourse: {
      title: "Complete C Programming",
      link: "/courses/c-programming",
    },
    relatedTutorial: {
      title: "C Programming Tutorial",
      link: "/tutorials/c-programming",
    },
  },

  "javascript-notes": {
    title: "JavaScript Notes",
    category: "JavaScript",
    language: "JavaScript",
    description:
      "Core JavaScript reference notes covering closures, event loop, promises, async/await, prototypes, and ES6+ features.",
    content: `## 1. Execution Context & Hoisting
JavaScript code executes inside Execution Contexts. Variables declared with \`var\` are hoisted with \`undefined\`, whereas \`let\` and \`const\` stay in the Temporal Dead Zone (TDZ).

## 2. Closures & Scope
A closure gives you access to an outer function's scope from an inner function, preserving state across invocations:

\`\`\`javascript
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
\`\`\`

## 3. Asynchronous JavaScript & Event Loop
JavaScript is single-threaded with an event loop handling non-blocking I/O.
- **Microtask Queue**: Promises (\`then\`, \`catch\`, \`async/await\`) have higher priority.
- **Macrotask Queue**: \`setTimeout\`, \`setInterval\`, DOM events.

\`\`\`javascript
async function fetchData(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Fetch failed", err);
  }
}
\`\`\`
`,
    tags: ["Closures", "Async", "ES6", "DOM", "Event Loop"],
    pdfUrl: "https://example.com/notes/javascript-notes.pdf",
    relatedCourse: {
      title: "JavaScript Complete Guide",
      link: "/courses/javascript",
    },
    relatedTutorial: {
      title: "JavaScript Tutorial",
      link: "/tutorials/javascript",
    },
  },

  "mern-stack-notes": {
    title: "MERN Stack Notes",
    category: "MERN",
    language: "JavaScript",
    description:
      "Full-stack MERN architecture notes: MongoDB aggregation, Express middleware, React state & hooks, and Node.js REST APIs.",
    content: `## 1. MERN Architecture
MERN is a pure JavaScript full-stack application structure:
- **MongoDB**: Document-based database.
- **Express.js**: Backend web framework for HTTP routing and middleware.
- **React**: Declarative, component-driven UI library.
- **Node.js**: Cross-platform JavaScript runtime.

## 2. Express Middleware Pipeline
Express routes requests through a chain of middleware functions:
\`\`\`javascript
app.use(express.json());
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
});
\`\`\`

## 3. JWT Authentication Pattern
Authentication uses Bearer tokens stored on the client and verified via middleware on protected endpoints.
`,
    tags: ["MongoDB", "Express", "React", "Node", "Full Stack"],
    pdfUrl: "https://example.com/notes/mern-stack-notes.pdf",
    relatedCourse: {
      title: "MERN Stack Development",
      link: "/courses/mern-stack",
    },
    relatedTutorial: {
      title: "MERN Stack Tutorial",
      link: "/tutorials/mern-stack",
    },
  },
};

function Note() {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      setLoading(true);
      try {
        const response = await getNoteById(noteId);
        if (response?.note) {
          setNote(response.note);
        } else if (fallbackNotes[noteId]) {
          setNote(fallbackNotes[noteId]);
        } else {
          // Default fallback
          const defaultKey = Object.keys(fallbackNotes)[0];
          setNote(fallbackNotes[defaultKey]);
        }
      } catch (err) {
        if (fallbackNotes[noteId]) {
          setNote(fallbackNotes[noteId]);
        } else {
          const firstKey = Object.keys(fallbackNotes)[0];
          setNote(fallbackNotes[firstKey]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId]);

  if (loading) {
    return (
      <main className="aeloria-note-page aeloria-note-loading">
        <div className="aeloria-note-spinner"></div>
        <p>Loading note details...</p>
      </main>
    );
  }

  if (!note) {
    return (
      <main className="aeloria-note-page">
        <div className="aeloria-note-container">
          <h2>Note Not Found</h2>
          <Link to="/notes" className="aeloria-note-back-btn">
            ← Back to Notes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="aeloria-note-page">
      {/* Top Bar */}
      <div className="aeloria-note-topbar">
        <div className="aeloria-note-topbar-container">
          <Link to="/notes" className="aeloria-note-back-link">
            ← All Notes
          </Link>
          <span className="aeloria-note-breadcrumb">
            Notes / {note.category} / {note.title}
          </span>
        </div>
      </div>

      <div className="aeloria-note-container">
        {/* Main Note Body */}
        <article className="aeloria-note-main">
          <header className="aeloria-note-header">
            <div className="aeloria-note-badge-row">
              <span className="aeloria-note-cat-badge">{note.category}</span>
              {note.language && (
                <span className="aeloria-note-lang-badge">{note.language}</span>
              )}
            </div>

            <h1 className="aeloria-note-title">{note.title}</h1>
            <p className="aeloria-note-description">{note.description}</p>

            <div className="aeloria-note-meta-row">
              {note.tags && note.tags.length > 0 && (
                <div className="aeloria-note-tags">
                  {note.tags.map((t) => (
                    <span key={t} className="aeloria-note-tag">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {note.pdfUrl && (
                <a
                  href={note.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aeloria-note-pdf-btn"
                >
                  📄 Download PDF Resource
                </a>
              )}
            </div>
          </header>

          <section className="aeloria-note-body">
            <div className="aeloria-note-content-markdown">
              {note.content.split("\n\n").map((block, idx) => {
                if (block.startsWith("## ")) {
                  return (
                    <h2 key={idx} className="aeloria-note-heading-2">
                      {block.replace("## ", "")}
                    </h2>
                  );
                }
                if (block.startsWith("```")) {
                  const cleaned = block
                    .replace(/^```[a-z]*\n/, "")
                    .replace(/\n```$/, "");
                  return (
                    <pre key={idx} className="aeloria-note-code-block">
                      <code>{cleaned}</code>
                    </pre>
                  );
                }
                return (
                  <p key={idx} className="aeloria-note-paragraph">
                    {block}
                  </p>
                );
              })}
            </div>
          </section>

          {/* AI Helper Banner */}
          <div className="aeloria-note-ai-banner">
            <div className="aeloria-note-ai-icon">✦</div>
            <div className="aeloria-note-ai-text">
              <h3>Have doubts about these notes?</h3>
              <p>
                Ask AELORIA AI to explain any formula, code example, or concept
                from these notes step-by-step.
              </p>
            </div>
            <Link
              to={`/ai-assistant?subject=${encodeURIComponent(
                note.category
              )}&topic=${encodeURIComponent(
                note.title
              )}&course=${encodeURIComponent(note.title)}`}
              state={{
                lessonContent: note.description + "\n\n" + note.content,
                learningPoints: note.tags || [note.title],
              }}
              className="aeloria-note-ai-link"
            >
              Ask Aeloria AI →
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="aeloria-note-sidebar">
          <div className="aeloria-note-sidebar-card">
            <h3>Related Learning</h3>
            <p>Solidify your understanding with hands-on courses & tutorials.</p>

            {note.relatedCourse && (
              <div className="aeloria-note-related-item">
                <span className="related-type">Course</span>
                <h4>{note.relatedCourse.title}</h4>
                <Link to={note.relatedCourse.link}>Explore Course →</Link>
              </div>
            )}

            {note.relatedTutorial && (
              <div className="aeloria-note-related-item">
                <span className="related-type">Tutorial</span>
                <h4>{note.relatedTutorial.title}</h4>
                <Link to={note.relatedTutorial.link}>Read Tutorial →</Link>
              </div>
            )}

            <div className="aeloria-note-related-item">
              <span className="related-type">Practice</span>
              <h4>Solve DSA Problems</h4>
              <Link to="/practice">Start Practicing →</Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Note;

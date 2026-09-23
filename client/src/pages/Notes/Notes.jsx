import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNotes } from "../../services/api";
import "./Notes.css";

const initialNotes = [
  {
    slug: "c-programming-notes",
    title: "C Programming Notes",
    category: "C",
    description:
      "Complete notes covering C programming basics, variables, loops, functions, arrays, pointers, and more.",
    topics: "25+ Topics",
  },
  {
    slug: "cpp-programming-notes",
    title: "C++ Programming Notes",
    category: "C++",
    description:
      "Learn C++ concepts including OOP, classes, inheritance, STL, functions, and problem solving.",
    topics: "30+ Topics",
  },
  {
    slug: "java-programming-notes",
    title: "Java Programming Notes",
    category: "Java",
    description:
      "Structured Java notes covering core Java, OOP, exception handling, collections, and more.",
    topics: "35+ Topics",
  },
  {
    slug: "python-programming-notes",
    title: "Python Programming Notes",
    category: "Python",
    description:
      "Easy-to-understand Python notes from basics to functions, modules, OOP, and file handling.",
    topics: "30+ Topics",
  },
  {
    slug: "javascript-notes",
    title: "JavaScript Notes",
    category: "JavaScript",
    description:
      "Master JavaScript fundamentals, ES6, functions, arrays, objects, DOM, and asynchronous programming.",
    topics: "35+ Topics",
  },
  {
    slug: "mern-stack-notes",
    title: "MERN Stack Notes",
    category: "MERN",
    description:
      "Learn MongoDB, Express.js, React, and Node.js with practical full-stack development concepts.",
    topics: "40+ Topics",
  },
  {
    slug: "data-structures-notes",
    title: "Data Structures Notes",
    category: "DSA",
    description:
      "Important data structure concepts including arrays, linked lists, stacks, queues, trees, and graphs.",
    topics: "30+ Topics",
  },
  {
    slug: "web-development-notes",
    title: "Web Development Notes",
    category: "Web Development",
    description:
      "HTML, CSS, JavaScript, responsive design, APIs, and modern web development concepts.",
    topics: "40+ Topics",
  },
];

function Notes() {
  const [notesList, setNotesList] = useState(initialNotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchApiNotes = async () => {
      try {
        const response = await getNotes();
        if (response?.notes && response.notes.length > 0) {
          const apiFormatted = response.notes.map((n) => ({
            slug: n.slug || n._id,
            title: n.title,
            category: n.category,
            description: n.description,
            topics: `${n.tags?.length || 15}+ Topics`,
          }));
          // Merge unique by slug
          const existingSlugs = new Set(apiFormatted.map((a) => a.slug));
          const merged = [
            ...apiFormatted,
            ...initialNotes.filter((inNote) => !existingSlugs.has(inNote.slug)),
          ];
          setNotesList(merged);
        }
      } catch (err) {
        console.log("Using built-in notes catalog");
      }
    };

    fetchApiNotes();
  }, []);

  const filteredNotes = notesList.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      selectedCategory === "All Categories" ||
      note.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="aeloria-notes">
      <section className="aeloria-notes-hero">
        <div className="aeloria-notes-hero-content">
          <span className="aeloria-notes-hero-label">
            FREE LEARNING RESOURCES
          </span>

          <h1 className="aeloria-notes-hero-title">
            Learn with
            <span> Free Notes</span>
          </h1>

          <p className="aeloria-notes-hero-description">
            Access easy-to-understand programming notes, concepts, examples,
            and revision material to strengthen your technical skills.
          </p>

          <div className="aeloria-notes-search">
            <input
              type="text"
              placeholder="Search notes, topics or technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="button">Search</button>
          </div>
        </div>
      </section>

      <section className="aeloria-notes-content">
        <div className="aeloria-notes-heading">
          <div>
            <span className="aeloria-notes-label">EXPLORE NOTES</span>
            <h2>Programming & Technology Notes</h2>
          </div>

          <select
            className="aeloria-notes-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="C">C</option>
            <option value="C++">C++</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="MERN">MERN</option>
            <option value="DSA">DSA</option>
            <option value="Web Development">Web Development</option>
          </select>
        </div>

        <div className="aeloria-notes-grid">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <article className="aeloria-note-card" key={note.slug}>
                <div className="aeloria-note-card-top">
                  <span className="aeloria-note-category">
                    {note.category}
                  </span>

                  <span className="aeloria-note-free">FREE</span>
                </div>

                <h3>{note.title}</h3>

                <p>{note.description}</p>

                <div className="aeloria-note-card-bottom">
                  <span>📖 {note.topics}</span>

                  <Link to={`/notes/${note.slug}`}>
                    Read Notes →
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#6b7280" }}>
              <p>No notes matched your search criteria.</p>
            </div>
          )}
        </div>
      </section>

      <section className="aeloria-notes-cta">
        <div>
          <span className="aeloria-notes-cta-label">KEEP LEARNING</span>

          <h2>
            Practice What
            <span> You Learn</span>
          </h2>

          <p>
            Combine your notes with coding practice and quizzes to improve
            your programming skills.
          </p>

          <a href="/practice" className="aeloria-notes-cta-button">
            Start Practicing →
          </a>
        </div>
      </section>
    </main>
  );
}

export default Notes;
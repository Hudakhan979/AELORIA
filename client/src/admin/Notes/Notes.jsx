import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getAdminNotes,
  createNote,
  deleteNote,
  toggleNoteStatus,
} from "../../services/api";

import { useAuth } from "../../context/AuthContext";

import "./Notes.css";

const AdminNotes = () => {
  const navigate = useNavigate();

  const { admin, token, loading: authLoading } = useAuth();

  const [notes, setNotes] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    language: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =========================================
     LOAD NOTES
  ========================================= */

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminNotes(token);

      const noteList =
        response?.notes ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      setNotes(noteList);
    } catch (err) {
      setError(err.message || "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     AUTH + INITIAL LOAD
  ========================================= */

  useEffect(() => {
    if (!authLoading) {
      if (!admin || !token) {
        navigate("/admin/login");
        return;
      }

      loadNotes();
    }
  }, [admin, token, authLoading]);

  /* =========================================
     FORM CHANGE
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================
     CREATE NOTE
  ========================================= */

  const handleCreateNote = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Note title is required.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createNote(
        {
          title: formData.title.trim(),
          category: formData.category.trim(),
          language: formData.language.trim(),
          description: formData.description.trim(),
          status: "draft",
        },
        token
      );

      setFormData({
        title: "",
        category: "",
        language: "",
        description: "",
      });

      setShowModal(false);

      await loadNotes();
    } catch (err) {
      setError(err.message || "Failed to create note.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     DELETE NOTE
  ========================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteNote(id, token);

      setNotes((prev) =>
        prev.filter((note) => note._id !== id)
      );
    } catch (err) {
      setError(err.message || "Failed to delete note.");
    }
  };

  /* =========================================
     TOGGLE STATUS
  ========================================= */

  const handleToggleStatus = async (id) => {
    try {
      setError("");

      const response = await toggleNoteStatus(id, token);

      const updatedNote =
        response?.note ||
        response?.data;

      if (updatedNote) {
        setNotes((prev) =>
          prev.map((note) =>
            note._id === id ? updatedNote : note
          )
        );
      } else {
        await loadNotes();
      }
    } catch (err) {
      setError(err.message || "Failed to update note status.");
    }
  };

  /* =========================================
     FILTER NOTES
  ========================================= */

  const categories = [
    ...new Set(
      notes
        .map((note) => note.category)
        .filter(Boolean)
    ),
  ];

  const filteredNotes = notes.filter((note) => {
    const searchMatch =
      note.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      note.category
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      note.language
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "all" ||
      note.status === statusFilter;

    const categoryMatch =
      categoryFilter === "all" ||
      note.category === categoryFilter;

    return (
      searchMatch &&
      statusMatch &&
      categoryMatch
    );
  });

  /* =========================================
     STATS
  ========================================= */

  const totalNotes = notes.length;

  const publishedNotes = notes.filter(
    (note) => note.status === "published"
  ).length;

  const draftNotes = notes.filter(
    (note) => note.status === "draft"
  ).length;

  /* =========================================
     LOADING
  ========================================= */

  if (authLoading || loading) {
    return (
      <div className="aeloria-admin-notes-loading">
        <div className="aeloria-admin-notes-spinner"></div>
        <p>Loading notes...</p>
      </div>
    );
  }

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="aeloria-admin-notes-page">

      {/* HEADER */}

      <header className="aeloria-admin-notes-header">

        <div>
          <Link
            to="/admin/dashboard"
            className="aeloria-admin-notes-back"
          >
            ← Back to Dashboard
          </Link>

          <h1>Notes Management</h1>

          <p>
            Manage learning notes and study resources.
          </p>
        </div>

        <button
          type="button"
          className="aeloria-admin-notes-add-btn"
          onClick={() => {
            setError("");
            setShowModal(true);
          }}
        >
          + Add Note
        </button>

      </header>

      <main className="aeloria-admin-notes-container">

        {/* ERROR */}

        {error && (
          <div className="aeloria-admin-notes-error">
            {error}
          </div>
        )}

        {/* STATS */}

        <section className="aeloria-admin-notes-stats">

          <div className="aeloria-admin-notes-stat-card">
            <div className="aeloria-admin-notes-stat-icon">
              📚
            </div>

            <div>
              <span>Total Notes</span>
              <strong>{totalNotes}</strong>
            </div>
          </div>

          <div className="aeloria-admin-notes-stat-card">
            <div className="aeloria-admin-notes-stat-icon published">
              ✓
            </div>

            <div>
              <span>Published</span>
              <strong>{publishedNotes}</strong>
            </div>
          </div>

          <div className="aeloria-admin-notes-stat-card">
            <div className="aeloria-admin-notes-stat-icon draft">
              📝
            </div>

            <div>
              <span>Drafts</span>
              <strong>{draftNotes}</strong>
            </div>
          </div>

        </section>

        {/* TOOLBAR */}

        <section className="aeloria-admin-notes-toolbar">

          <div className="aeloria-admin-notes-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

        </section>

        {/* NOTES LIST */}

        <section className="aeloria-admin-notes-list">

          <div className="aeloria-admin-notes-list-header">
            <div>
              <h2>All Notes</h2>

              <p>
                {filteredNotes.length} note
                {filteredNotes.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="aeloria-admin-notes-empty">
              <div>📄</div>

              <h3>No Notes Found</h3>

              <p>
                Try changing your search or filters,
                or create a new note.
              </p>
            </div>
          ) : (
            <div className="aeloria-admin-notes-grid">

              {filteredNotes.map((note) => (
                <article
                  key={note._id}
                  className="aeloria-admin-note-card"
                >

                  <div className="aeloria-admin-note-card-top">

                    <div className="aeloria-admin-note-icon">
                      📄
                    </div>

                    <span
                      className={`aeloria-admin-note-status ${
                        note.status === "published"
                          ? "published"
                          : "draft"
                      }`}
                    >
                      {note.status === "published"
                        ? "Published"
                        : "Draft"}
                    </span>

                  </div>

                  <div className="aeloria-admin-note-card-content">

                    <h3>{note.title}</h3>

                    <p className="aeloria-admin-note-description">
                      {note.description
                        ? note.description.length > 120
                          ? `${note.description.substring(
                              0,
                              120
                            )}...`
                          : note.description
                        : "No description added."}
                    </p>

                    <div className="aeloria-admin-note-meta">

                      {note.category && (
                        <span>
                          📂 {note.category}
                        </span>
                      )}

                      {note.language && (
                        <span>
                          💻 {note.language}
                        </span>
                      )}

                      <span>
                        👁️ {note.views || 0}
                      </span>

                    </div>

                  </div>

                  <div className="aeloria-admin-note-actions">

                    <Link
                      to={`/admin/notes/edit/${note._id}`}
                      className="aeloria-admin-note-edit"
                      title="Edit Note"
                    >
                      ✏️
                    </Link>

                    <Link
                      to={`/notes/${note.slug || note._id}`}
                      target="_blank"
                      className="aeloria-admin-note-view"
                      title="View Note"
                    >
                      👁️
                    </Link>

                    <button
                      type="button"
                      className="aeloria-admin-note-toggle"
                      onClick={() =>
                        handleToggleStatus(note._id)
                      }
                      title={
                        note.status === "published"
                          ? "Unpublish"
                          : "Publish"
                      }
                    >
                      {note.status === "published"
                        ? "↩️"
                        : "📢"}
                    </button>

                    <button
                      type="button"
                      className="aeloria-admin-note-delete"
                      onClick={() =>
                        handleDelete(note._id)
                      }
                      title="Delete Note"
                    >
                      🗑️
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </main>

      {/* ADD NOTE MODAL */}

      {showModal && (
        <div
          className="aeloria-admin-notes-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="aeloria-admin-notes-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="aeloria-admin-notes-modal-header">

              <div>
                <h2>Add New Note</h2>

                <p>
                  Create a new note as a draft.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleCreateNote}>

              <div className="aeloria-admin-notes-form-field">
                <label>
                  Note Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: JavaScript Notes"
                />
              </div>

              <div className="aeloria-admin-notes-form-row">

                <div className="aeloria-admin-notes-form-field">
                  <label>
                    Category *
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Example: Programming"
                  />
                </div>

                <div className="aeloria-admin-notes-form-field">
                  <label>
                    Language
                  </label>

                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="Example: JavaScript"
                  />
                </div>

              </div>

              <div className="aeloria-admin-notes-form-field">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short description..."
                  rows="4"
                />
              </div>

              <div className="aeloria-admin-notes-modal-actions">

                <button
                  type="button"
                  className="aeloria-admin-notes-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="aeloria-admin-notes-save-btn"
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Create Note"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminNotes;
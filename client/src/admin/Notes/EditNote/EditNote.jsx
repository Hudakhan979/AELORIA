import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getAdminNotes,
  updateNote,
} from "../../../services/api";

import { useAuth } from "../../../context/AuthContext";

import "./EditNote.css";

const EditNote = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const { admin, token, loading: authLoading } = useAuth();

  const [note, setNote] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    language: "",
    description: "",
    content: "",
    pdfUrl: "",
    thumbnail: "",
    tags: "",
    status: "draft",
    isFeatured: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!admin || !token) {
      navigate("/admin/login");
      return;
    }

    loadNote();
  }, [authLoading, admin, token, noteId]);

  const loadNote = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminNotes(token);

      const notes = Array.isArray(response)
        ? response
        : response?.notes || response?.data || [];

      const selectedNote = notes.find(
        (item) => item._id === noteId
      );

      if (!selectedNote) {
        setError("Note not found.");
        return;
      }

      setNote(selectedNote);

      setFormData({
        title: selectedNote.title || "",
        category: selectedNote.category || "",
        language: selectedNote.language || "",
        description: selectedNote.description || "",
        content: selectedNote.content || "",
        pdfUrl: selectedNote.pdfUrl || "",
        thumbnail: selectedNote.thumbnail || "",
        tags: Array.isArray(selectedNote.tags)
          ? selectedNote.tags.join(", ")
          : selectedNote.tags || "",
        status: selectedNote.status || "draft",
        isFeatured: Boolean(selectedNote.isFeatured),
      });
    } catch (err) {
      setError(err.message || "Failed to load note.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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

      const updatedNote = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        language: formData.language.trim(),
        description: formData.description.trim(),
        content: formData.content,
        pdfUrl: formData.pdfUrl.trim(),
        thumbnail: formData.thumbnail.trim(),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        status: formData.status,
        isFeatured: formData.isFeatured,
      };

      await updateNote(noteId, updatedNote, token);

      navigate("/admin/notes");
    } catch (err) {
      setError(err.message || "Failed to update note.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="aeloria-edit-note-loading">
        <div className="aeloria-edit-note-spinner"></div>
        <p>Loading note...</p>
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="aeloria-edit-note-error-page">
        <h2>{error}</h2>

        <Link
          to="/admin/notes"
          className="aeloria-edit-note-back-button"
        >
          ← Back to Notes
        </Link>
      </div>
    );
  }

  return (
    <div className="aeloria-edit-note-page">
      <div className="aeloria-edit-note-container">

        {/* Header */}
        <div className="aeloria-edit-note-header">
          <div>
            <Link
              to="/admin/notes"
              className="aeloria-edit-note-back"
            >
              ← Back to Notes
            </Link>

            <h1>Edit Note</h1>

            <p>
              Update the note content and publishing information.
            </p>
          </div>

          {note?.slug && (
            <Link
              to={`/notes/${note.slug}`}
              target="_blank"
              rel="noreferrer"
              className="aeloria-edit-note-view-button"
            >
              View Note ↗
            </Link>
          )}
        </div>

        {error && (
          <div className="aeloria-edit-note-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Basic Information */}
          <div className="aeloria-edit-note-card">
            <div className="aeloria-edit-note-card-header">
              <h2>Basic Information</h2>
              <p>Update the main details of this note.</p>
            </div>

            <div className="aeloria-edit-note-grid">

              <div className="aeloria-edit-note-field full">
                <label>Note Title *</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter note title"
                />
              </div>

              <div className="aeloria-edit-note-field">
                <label>Category *</label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Programming"
                />
              </div>

              <div className="aeloria-edit-note-field">
                <label>Language</label>

                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript"
                />
              </div>

              <div className="aeloria-edit-note-field full">
                <label>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short description..."
                  rows="4"
                />
              </div>

              <div className="aeloria-edit-note-field full">
                <label>Tags</label>

                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="javascript, basics, programming"
                />

                <small>
                  Separate multiple tags using commas.
                </small>
              </div>

            </div>
          </div>

          {/* Note Content */}
          <div className="aeloria-edit-note-card">
            <div className="aeloria-edit-note-card-header">
              <h2>Note Content</h2>
              <p>Write or update the actual learning material.</p>
            </div>

            <div className="aeloria-edit-note-field">
              <label>Content</label>

              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your note content here..."
                rows="16"
              />
            </div>
          </div>

          {/* Resources */}
          <div className="aeloria-edit-note-card">
            <div className="aeloria-edit-note-card-header">
              <h2>Resources</h2>
              <p>Add optional thumbnail and PDF resources.</p>
            </div>

            <div className="aeloria-edit-note-grid">

              <div className="aeloria-edit-note-field">
                <label>Thumbnail URL</label>

                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="aeloria-edit-note-field">
                <label>PDF URL</label>

                <input
                  type="url"
                  name="pdfUrl"
                  value={formData.pdfUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

            </div>
          </div>

          {/* Publishing */}
          <div className="aeloria-edit-note-card">
            <div className="aeloria-edit-note-card-header">
              <h2>Publishing Settings</h2>
              <p>Control the visibility of this note.</p>
            </div>

            <div className="aeloria-edit-note-publishing">

              <div className="aeloria-edit-note-field">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <label className="aeloria-edit-note-checkbox">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />

                <span>
                  <strong>Featured Note</strong>
                  <small>
                    Show this note in featured resources.
                  </small>
                </span>
              </label>

            </div>
          </div>

          {/* Actions */}
          <div className="aeloria-edit-note-actions">

            <Link
              to="/admin/notes"
              className="aeloria-edit-note-cancel"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="aeloria-edit-note-save"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditNote;
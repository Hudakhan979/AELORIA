import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getAdminTutorials,
  updateTutorial,
} from "../../../services/api";

import { useAuth } from "../../../context/AuthContext";

import "./ManageTopics.css";

const ManageTopics = () => {
  const { tutorialId } = useParams();
  const navigate = useNavigate();

  const { admin, token, loading: authLoading } = useAuth();

  const [tutorial, setTutorial] = useState(null);
  const [topics, setTopics] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    codeExample: "",
    order: 1,
  });

  const [editingTopicId, setEditingTopicId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load Tutorial
  const loadTutorial = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminTutorials(token);

      const tutorialList =
        response?.tutorials ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      const selectedTutorial = tutorialList.find(
        (item) => item._id === tutorialId
      );

      if (!selectedTutorial) {
        setError("Tutorial not found.");
        return;
      }

      setTutorial(selectedTutorial);
      setTopics(selectedTutorial.topics || []);
    } catch (err) {
      setError(err.message || "Failed to load tutorial.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!admin || !token) {
        navigate("/admin/login");
        return;
      }

      loadTutorial();
    }
  }, [admin, token, authLoading, tutorialId]);

  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      codeExample: "",
      order: topics.length + 1,
    });

    setEditingTopicId(null);
  };

  // Add / Update Topic
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Topic title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      let updatedTopics;

      if (editingTopicId) {
        updatedTopics = topics.map((topic) =>
          topic._id === editingTopicId
            ? {
                ...topic,
                title: formData.title.trim(),
                content: formData.content,
                codeExample: formData.codeExample,
                order: Number(formData.order),
              }
            : topic
        );
      } else {
        updatedTopics = [
          ...topics,
          {
            title: formData.title.trim(),
            content: formData.content,
            codeExample: formData.codeExample,
            order: Number(formData.order),
          },
        ];
      }

      updatedTopics.sort((a, b) => a.order - b.order);

      await updateTutorial(
        tutorialId,
        {
          topics: updatedTopics,
        },
        token
      );

      setTopics(updatedTopics);

      setTutorial((prev) => ({
        ...prev,
        topics: updatedTopics,
      }));

      resetForm();
    } catch (err) {
      setError(err.message || "Failed to save topic.");
    } finally {
      setSaving(false);
    }
  };

  // Edit Topic
  const handleEdit = (topic) => {
    setEditingTopicId(topic._id);

    setFormData({
      title: topic.title || "",
      content: topic.content || "",
      codeExample: topic.codeExample || "",
      order: topic.order || 1,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete Topic
  const handleDelete = async (topicId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this topic?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const updatedTopics = topics.filter(
        (topic) => topic._id !== topicId
      );

      updatedTopics.forEach((topic, index) => {
        topic.order = index + 1;
      });

      await updateTutorial(
        tutorialId,
        {
          topics: updatedTopics,
        },
        token
      );

      setTopics(updatedTopics);

      setTutorial((prev) => ({
        ...prev,
        topics: updatedTopics,
      }));

      if (editingTopicId === topicId) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Failed to delete topic.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="aeloria-manage-topics-loading">
        <div className="aeloria-manage-topics-spinner"></div>
        <p>Loading tutorial...</p>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="aeloria-manage-topics-error-page">
        <h2>Tutorial Not Found</h2>
        <p>{error || "The requested tutorial could not be found."}</p>

        <Link to="/admin/tutorials">
          ← Back to Tutorials
        </Link>
      </div>
    );
  }

  return (
    <div className="aeloria-manage-topics-page">

      {/* Header */}
      <header className="aeloria-manage-topics-header">
        <div>
          <Link
            to="/admin/tutorials"
            className="aeloria-manage-topics-back"
          >
            ← Back to Tutorials
          </Link>

          <h1>Manage Tutorial Topics</h1>

          <p>
            Add, edit and organize topics for{" "}
            <strong>{tutorial.title}</strong>
          </p>
        </div>

        <div className="aeloria-manage-topics-header-actions">
          <Link
            to={`/tutorials/${tutorial.slug || tutorial._id}`}
            target="_blank"
            className="aeloria-manage-topics-view-btn"
          >
            View Tutorial ↗
          </Link>
        </div>
      </header>

      <main className="aeloria-manage-topics-container">

        {/* Error */}
        {error && (
          <div className="aeloria-manage-topics-error">
            {error}
          </div>
        )}

        {/* Tutorial Info */}
        <section className="aeloria-manage-topics-info-card">
          <div className="aeloria-manage-topics-info-icon">
            📚
          </div>

          <div>
            <h2>{tutorial.title}</h2>

            <div className="aeloria-manage-topics-info-meta">
              <span>{tutorial.category}</span>
              <span>{tutorial.level}</span>
              <span>{topics.length} Topics</span>
            </div>
          </div>
        </section>

        <div className="aeloria-manage-topics-layout">

          {/* Add / Edit Form */}
          <section className="aeloria-manage-topics-form-card">

            <div className="aeloria-manage-topics-card-header">
              <div>
                <h2>
                  {editingTopicId
                    ? "Edit Topic"
                    : "Add New Topic"}
                </h2>

                <p>
                  {editingTopicId
                    ? "Update the selected topic."
                    : "Create a new topic for this tutorial."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Title */}
              <div className="aeloria-manage-topics-field">
                <label htmlFor="topic-title">
                  Topic Title *
                </label>

                <input
                  id="topic-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Variables in JavaScript"
                />
              </div>

              {/* Order */}
              <div className="aeloria-manage-topics-field">
                <label htmlFor="topic-order">
                  Topic Order
                </label>

                <input
                  id="topic-order"
                  type="number"
                  name="order"
                  min="1"
                  value={formData.order}
                  onChange={handleChange}
                />
              </div>

              {/* Content */}
              <div className="aeloria-manage-topics-field">
                <label htmlFor="topic-content">
                  Topic Content
                </label>

                <textarea
                  id="topic-content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write the topic explanation here..."
                  rows="8"
                />
              </div>

              {/* Code */}
              <div className="aeloria-manage-topics-field">
                <label htmlFor="topic-code">
                  Code Example
                </label>

                <textarea
                  id="topic-code"
                  name="codeExample"
                  value={formData.codeExample}
                  onChange={handleChange}
                  placeholder={`Example:

let name = "Aeloria";
console.log(name);`}
                  rows="10"
                  className="aeloria-manage-topics-code-input"
                />
              </div>

              {/* Buttons */}
              <div className="aeloria-manage-topics-form-actions">

                {editingTopicId && (
                  <button
                    type="button"
                    className="aeloria-manage-topics-cancel-btn"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  className="aeloria-manage-topics-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingTopicId
                    ? "Update Topic"
                    : "Add Topic"}
                </button>

              </div>
            </form>
          </section>

          {/* Topics List */}
          <section className="aeloria-manage-topics-list-card">

            <div className="aeloria-manage-topics-card-header">
              <div>
                <h2>Topics</h2>
                <p>
                  {topics.length} topic
                  {topics.length !== 1 ? "s" : ""} added
                </p>
              </div>
            </div>

            {topics.length === 0 ? (
              <div className="aeloria-manage-topics-empty">
                <div>📖</div>
                <h3>No Topics Yet</h3>
                <p>
                  Add your first topic using the form.
                </p>
              </div>
            ) : (
              <div className="aeloria-manage-topics-list">

                {[...topics]
                  .sort((a, b) => a.order - b.order)
                  .map((topic, index) => (
                    <div
                      key={topic._id || `${topic.title}-${index}`}
                      className="aeloria-manage-topic-item"
                    >

                      <div className="aeloria-manage-topic-number">
                        {topic.order || index + 1}
                      </div>

                      <div className="aeloria-manage-topic-content">
                        <h3>{topic.title}</h3>

                        <p>
                          {topic.content
                            ? topic.content.length > 120
                              ? `${topic.content.substring(
                                  0,
                                  120
                                )}...`
                              : topic.content
                            : "No content added yet."}
                        </p>

                        {topic.codeExample && (
                          <span className="aeloria-manage-topic-code-badge">
                            💻 Code Example
                          </span>
                        )}
                      </div>

                      <div className="aeloria-manage-topic-actions">

                        <button
                          type="button"
                          className="aeloria-manage-topic-edit"
                          onClick={() => handleEdit(topic)}
                          title="Edit Topic"
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          className="aeloria-manage-topic-delete"
                          onClick={() =>
                            handleDelete(topic._id)
                          }
                          title="Delete Topic"
                        >
                          🗑️
                        </button>

                      </div>

                    </div>
                  ))}

              </div>
            )}

          </section>

        </div>
      </main>
    </div>
  );
};

export default ManageTopics;
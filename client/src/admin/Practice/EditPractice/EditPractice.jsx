import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getAdminPracticeProblems,
  updatePracticeProblem,
} from "../../../services/api";

import { useAuth } from "../../../context/AuthContext";

import "./EditPractice.css";

const EditPractice = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const { admin, token, loading: authLoading } = useAuth();

  const [problem, setProblem] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    topic: "",
    difficulty: "Easy",
    description: "",
    constraints: "",
    inputFormat: "",
    outputFormat: "",
    exampleInput: "",
    exampleOutput: "",
    explanation: "",
    supportedLanguages: "",
    starterCode: "",
    solution: "",
    hints: "",
    status: "draft",
    isFeatured: false,
  });

  const [testCases, setTestCases] = useState([]);

  const [newTestCase, setNewTestCase] = useState({
    input: "",
    expectedOutput: "",
    isHidden: false,
  });

  const [editingTestCaseIndex, setEditingTestCaseIndex] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!admin || !token) {
      navigate("/admin/login");
      return;
    }

    loadProblem();
  }, [authLoading, admin, token, problemId]);

  const loadProblem = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminPracticeProblems(token);

      const problems = Array.isArray(response)
        ? response
        : response?.problems ||
          response?.practice ||
          response?.data ||
          [];

      const selectedProblem = problems.find(
        (item) => item._id === problemId
      );

      if (!selectedProblem) {
        setError("Practice problem not found.");
        return;
      }

      setProblem(selectedProblem);

      setFormData({
        title: selectedProblem.title || "",
        category: selectedProblem.category || "",
        topic: selectedProblem.topic || "",
        difficulty: selectedProblem.difficulty || "Easy",
        description: selectedProblem.description || "",
        constraints: Array.isArray(selectedProblem.constraints)
          ? selectedProblem.constraints.join("\n")
          : selectedProblem.constraints || "",
        inputFormat: selectedProblem.inputFormat || "",
        outputFormat: selectedProblem.outputFormat || "",
        exampleInput: selectedProblem.exampleInput || "",
        exampleOutput: selectedProblem.exampleOutput || "",
        explanation: selectedProblem.explanation || "",
        supportedLanguages: Array.isArray(
          selectedProblem.supportedLanguages
        )
          ? selectedProblem.supportedLanguages.join(", ")
          : selectedProblem.supportedLanguages || "",
        starterCode: selectedProblem.starterCode || "",
        solution: selectedProblem.solution || "",
        hints: Array.isArray(selectedProblem.hints)
          ? selectedProblem.hints.join("\n")
          : selectedProblem.hints || "",
        status: selectedProblem.status || "draft",
        isFeatured: Boolean(selectedProblem.isFeatured),
      });

      setTestCases(
        Array.isArray(selectedProblem.testCases)
          ? selectedProblem.testCases
          : []
      );
    } catch (err) {
      setError(
        err.message || "Failed to load practice problem."
      );
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

  const handleTestCaseChange = (event) => {
    const { name, value, type, checked } = event.target;

    setNewTestCase((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddTestCase = () => {
    if (
      !newTestCase.input.trim() ||
      !newTestCase.expectedOutput.trim()
    ) {
      setError(
        "Test case input and expected output are required."
      );
      return;
    }

    setError("");

    if (editingTestCaseIndex !== null) {
      setTestCases((prev) =>
        prev.map((testCase, index) =>
          index === editingTestCaseIndex
            ? {
                ...newTestCase,
                input: newTestCase.input.trim(),
                expectedOutput:
                  newTestCase.expectedOutput.trim(),
              }
            : testCase
        )
      );

      setEditingTestCaseIndex(null);
    } else {
      setTestCases((prev) => [
        ...prev,
        {
          ...newTestCase,
          input: newTestCase.input.trim(),
          expectedOutput:
            newTestCase.expectedOutput.trim(),
        },
      ]);
    }

    setNewTestCase({
      input: "",
      expectedOutput: "",
      isHidden: false,
    });
  };

  const handleEditTestCase = (index) => {
    const selectedTestCase = testCases[index];

    setNewTestCase({
      input: selectedTestCase.input || "",
      expectedOutput:
        selectedTestCase.expectedOutput || "",
      isHidden: Boolean(selectedTestCase.isHidden),
    });

    setEditingTestCaseIndex(index);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleDeleteTestCase = (index) => {
    setTestCases((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );

    if (editingTestCaseIndex === index) {
      setEditingTestCaseIndex(null);

      setNewTestCase({
        input: "",
        expectedOutput: "",
        isHidden: false,
      });
    }
  };

  const handleCancelTestCaseEdit = () => {
    setEditingTestCaseIndex(null);

    setNewTestCase({
      input: "",
      expectedOutput: "",
      isHidden: false,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Problem title is required.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (!formData.topic.trim()) {
      setError("Topic is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Problem description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedProblem = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        topic: formData.topic.trim(),
        difficulty: formData.difficulty,

        description: formData.description.trim(),

        constraints: formData.constraints
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        inputFormat: formData.inputFormat.trim(),
        outputFormat: formData.outputFormat.trim(),

        exampleInput: formData.exampleInput,
        exampleOutput: formData.exampleOutput,

        explanation: formData.explanation,

        supportedLanguages: formData.supportedLanguages
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        starterCode: formData.starterCode,
        solution: formData.solution,

        hints: formData.hints
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        testCases,

        status: formData.status,
        isFeatured: formData.isFeatured,
      };

      await updatePracticeProblem(
        problemId,
        updatedProblem,
        token
      );

      navigate("/admin/practice");
    } catch (err) {
      setError(
        err.message || "Failed to update practice problem."
      );
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="aeloria-edit-practice-loading">
        <div className="aeloria-edit-practice-spinner"></div>
        <p>Loading practice problem...</p>
      </div>
    );
  }

  if (error && !problem) {
    return (
      <div className="aeloria-edit-practice-error-page">
        <h2>{error}</h2>

        <Link
          to="/admin/practice"
          className="aeloria-edit-practice-back-button"
        >
          ← Back to Practice
        </Link>
      </div>
    );
  }

  return (
    <div className="aeloria-edit-practice-page">
      <div className="aeloria-edit-practice-container">

        {/* Header */}
        <div className="aeloria-edit-practice-header">
          <div>
            <Link
              to="/admin/practice"
              className="aeloria-edit-practice-back"
            >
              ← Back to Practice
            </Link>

            <h1>Edit Practice Problem</h1>

            <p>
              Manage the complete coding problem, solution,
              hints and test cases.
            </p>
          </div>

          {problem?.slug && (
            <Link
              to={`/practice/${problem.slug}`}
              target="_blank"
              rel="noreferrer"
              className="aeloria-edit-practice-view"
            >
              View Problem ↗
            </Link>
          )}
        </div>

        {error && (
          <div className="aeloria-edit-practice-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Basic Information */}
          <div className="aeloria-edit-practice-card">
            <div className="aeloria-edit-practice-card-header">
              <h2>Basic Information</h2>
              <p>
                Define the main information of the coding
                problem.
              </p>
            </div>

            <div className="aeloria-edit-practice-grid">

              <div className="aeloria-edit-practice-field full">
                <label>Problem Title *</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Find Maximum Element"
                />
              </div>

              <div className="aeloria-edit-practice-field">
                <label>Category *</label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Data Structures"
                />
              </div>

              <div className="aeloria-edit-practice-field">
                <label>Topic *</label>

                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g. Arrays"
                />
              </div>

              <div className="aeloria-edit-practice-field">
                <label>Difficulty</label>

                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="aeloria-edit-practice-field full">
                <label>Problem Description *</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Explain what the student needs to solve..."
                  rows="7"
                />
              </div>

            </div>
          </div>

          {/* Problem Details */}
          <div className="aeloria-edit-practice-card">
            <div className="aeloria-edit-practice-card-header">
              <h2>Problem Details</h2>
              <p>
                Add constraints and input/output information.
              </p>
            </div>

            <div className="aeloria-edit-practice-grid">

              <div className="aeloria-edit-practice-field full">
                <label>Constraints</label>

                <textarea
                  name="constraints"
                  value={formData.constraints}
                  onChange={handleChange}
                  placeholder={
                    "1 ≤ n ≤ 100000\nArray contains integers\nTime limit: 1 second"
                  }
                  rows="6"
                />

                <small>
                  Write each constraint on a separate line.
                </small>
              </div>

              <div className="aeloria-edit-practice-field">
                <label>Input Format</label>

                <textarea
                  name="inputFormat"
                  value={formData.inputFormat}
                  onChange={handleChange}
                  placeholder="Describe the input format..."
                  rows="5"
                />
              </div>

              <div className="aeloria-edit-practice-field">
                <label>Output Format</label>

                <textarea
                  name="outputFormat"
                  value={formData.outputFormat}
                  onChange={handleChange}
                  placeholder="Describe the expected output..."
                  rows="5"
                />
              </div>

            </div>
          </div>

          {/* Examples */}
          <div className="aeloria-edit-practice-card">
            <div className="aeloria-edit-practice-card-header">
              <h2>Example</h2>
              <p>
                Add a sample input and its expected output.
              </p>
            </div>

            <div className="aeloria-edit-practice-grid">

              <div className="aeloria-edit-practice-field">
                <label>Example Input</label>

                <textarea
                  name="exampleInput"
                  value={formData.exampleInput}
                  onChange={handleChange}
                  placeholder="[5, 8, 2, 10, 4]"
                  rows="7"
                />
              </div>

              <div className="aeloria-edit-practice-field">
                <label>Example Output</label>

                <textarea
                  name="exampleOutput"
                  value={formData.exampleOutput}
                  onChange={handleChange}
                  placeholder="10"
                  rows="7"
                />
              </div>

              <div className="aeloria-edit-practice-field full">
                <label>Explanation</label>

                <textarea
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleChange}
                  placeholder="Explain how the example works..."
                  rows="7"
                />
              </div>

            </div>
          </div>

          {/* Code */}
          <div className="aeloria-edit-practice-card">
            <div className="aeloria-edit-practice-card-header">
              <h2>Code</h2>
              <p>
                Configure supported languages, starter code
                and solution.
              </p>
            </div>

            <div className="aeloria-edit-practice-grid">

              <div className="aeloria-edit-practice-field full">
                <label>Supported Languages</label>

                <input
                  type="text"
                  name="supportedLanguages"
                  value={formData.supportedLanguages}
                  onChange={handleChange}
                  placeholder="JavaScript, C++, Java, Python"
                />

                <small>
                  Separate languages using commas.
                </small>
              </div>

              <div className="aeloria-edit-practice-field full">
                <label>Starter Code</label>

                <textarea
                  name="starterCode"
                  value={formData.starterCode}
                  onChange={handleChange}
                  placeholder="// Write starter code here..."
                  rows="14"
                />
              </div>

              <div className="aeloria-edit-practice-field full">
                <label>Solution</label>

                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleChange}
                  placeholder="// Write the solution here..."
                  rows="16"
                />
              </div>

            </div>
          </div>

          {/* Hints */}
          <div className="aeloria-edit-practice-card">
            <div className="aeloria-edit-practice-card-header">
              <h2>Hints</h2>
              <p>
                Add helpful hints that students can reveal while
                solving.
              </p>
            </div>

            <div className="aeloria-edit-practice-field">
              <label>Hints</label>

              <textarea
                name="hints"
                value={formData.hints}
                onChange={handleChange}
                placeholder={
                  "Think about keeping track of the largest value.\nTraverse the array once."
                }
                rows="7"
              />

              <small>
                Write each hint on a separate line.
              </small>
            </div>
          </div>

          {/* Test Cases */}
          <div className="aeloria-edit-practice-card">
            <div className="aeloria-edit-practice-card-header">
              <h2>Test Cases</h2>
              <p>
                Add test cases used to validate student
                submissions.
              </p>
            </div>

            <div className="aeloria-edit-practice-test-form">

              <div className="aeloria-edit-practice-field">
                <label>Input *</label>

                <textarea
                  name="input"
                  value={newTestCase.input}
                  onChange={handleTestCaseChange}
                  placeholder="5&#10;10 20 30 40 50"
                  rows="5"
                />
              </div>

              <div className="aeloria-edit-practice-field">
                <label>Expected Output *</label>

                <textarea
                  name="expectedOutput"
                  value={newTestCase.expectedOutput}
                  onChange={handleTestCaseChange}
                  placeholder="50"
                  rows="5"
                />
              </div>

              <label className="aeloria-edit-practice-hidden">
                <input
                  type="checkbox"
                  name="isHidden"
                  checked={newTestCase.isHidden}
                  onChange={handleTestCaseChange}
                />

                <span>
                  Hidden Test Case
                </span>
              </label>

              <div className="aeloria-edit-practice-test-buttons">

                {editingTestCaseIndex !== null && (
                  <button
                    type="button"
                    className="aeloria-edit-practice-test-cancel"
                    onClick={handleCancelTestCaseEdit}
                  >
                    Cancel Edit
                  </button>
                )}

                <button
                  type="button"
                  className="aeloria-edit-practice-test-add"
                  onClick={handleAddTestCase}
                >
                  {editingTestCaseIndex !== null
                    ? "Update Test Case"
                    : "+ Add Test Case"}
                </button>

              </div>

            </div>

            {testCases.length > 0 && (
              <div className="aeloria-edit-practice-test-list">

                {testCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="aeloria-edit-practice-test-card"
                  >

                    <div className="aeloria-edit-practice-test-number">
                      Test Case {index + 1}
                    </div>

                    <div className="aeloria-edit-practice-test-content">

                      <div>
                        <span>Input</span>

                        <pre>
                          {testCase.input}
                        </pre>
                      </div>

                      <div>
                        <span>Expected Output</span>

                        <pre>
                          {testCase.expectedOutput}
                        </pre>
                      </div>

                    </div>

                    <div className="aeloria-edit-practice-test-footer">

                      <span
                        className={
                          testCase.isHidden
                            ? "hidden"
                            : "visible"
                        }
                      >
                        {testCase.isHidden
                          ? "🔒 Hidden"
                          : "👁️ Visible"}
                      </span>

                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            handleEditTestCase(index)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteTestCase(index)
                          }
                        >
                          🗑️ Delete
                        </button>
                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* Publishing */}
          <div className="aeloria-edit-practice-card">
            <div className="aeloria-edit-practice-card-header">
              <h2>Publishing Settings</h2>
              <p>
                Control visibility and featured status.
              </p>
            </div>

            <div className="aeloria-edit-practice-publishing">

              <div className="aeloria-edit-practice-field">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">
                    Published
                  </option>
                </select>
              </div>

              <label className="aeloria-edit-practice-featured">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />

                <span>
                  <strong>Featured Problem</strong>
                  <small>
                    Highlight this problem in the practice
                    section.
                  </small>
                </span>
              </label>

            </div>
          </div>

          {/* Actions */}
          <div className="aeloria-edit-practice-actions">

            <Link
              to="/admin/practice"
              className="aeloria-edit-practice-cancel"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="aeloria-edit-practice-save"
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

export default EditPractice;
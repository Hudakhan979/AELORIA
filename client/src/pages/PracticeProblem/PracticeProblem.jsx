import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./PracticeProblem.css";

function PracticeProblem() {
  const { problemId } = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");
  const [userCode, setUserCode] = useState("");
  const [runResult, setRunResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [activeHint, setActiveHint] = useState(null);

  const problems = {
    arrays: {
      title: "Find the Largest Element in an Array",
      category: "Arrays",
      difficulty: "Easy",
      description:
        "Given an array of numbers, find and return the largest element present in the array.",
      exampleInput: "[10, 25, 7, 42, 18]",
      exampleOutput: "42",
      explanation:
        "We compare each element with the current largest value. The largest value after checking all elements is 42.",
      code: `function findLargest(arr) {
  let largest = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > largest) {
      largest = arr[i];
    }
  }

  return largest;
}

console.log(findLargest([10, 25, 7, 42, 18]));`,
    },

    strings: {
      title: "Reverse a String",
      category: "Strings",
      difficulty: "Easy",
      description:
        "Given a string, reverse the characters and return the reversed string.",
      exampleInput: '"AELORIA"',
      exampleOutput: '"AIROLEA"',
      explanation:
        "The characters are read from the end of the string towards the beginning to create the reversed string.",
      code: `function reverseString(str) {
  return str.split("").reverse().join("");
}

console.log(reverseString("AELORIA"));`,
    },

    "linked-list": {
      title: "Traverse a Linked List",
      category: "Linked List",
      difficulty: "Easy",
      description:
        "Given the head of a linked list, traverse the list and print every node value.",
      exampleInput: "10 → 20 → 30 → 40",
      exampleOutput: "10 20 30 40",
      explanation:
        "Start from the head node and keep moving to the next node until the end of the linked list is reached.",
      code: `function traverse(head) {
  let current = head;

  while (current !== null) {
    console.log(current.value);
    current = current.next;
  }
}`,
    },

    stack: {
      title: "Implement a Stack",
      category: "Stack",
      difficulty: "Easy",
      description:
        "Implement a stack using an array with push and pop operations.",
      exampleInput: "Push 10, Push 20, Pop",
      exampleOutput: "10",
      explanation:
        "A stack follows the Last In, First Out principle. The most recently added element is removed first.",
      code: `const stack = [];

stack.push(10);
stack.push(20);

stack.pop();

console.log(stack[stack.length - 1]);`,
    },

    queue: {
      title: "Implement a Queue",
      category: "Queue",
      difficulty: "Easy",
      description:
        "Implement a queue using an array and perform enqueue and dequeue operations.",
      exampleInput: "Enqueue 10, Enqueue 20, Dequeue",
      exampleOutput: "20",
      explanation:
        "A queue follows the First In, First Out principle. The first element inserted is removed first.",
      code: `const queue = [];

queue.push(10);
queue.push(20);

queue.shift();

console.log(queue[0]);`,
    },

    trees: {
      title: "Tree Traversal",
      category: "Trees",
      difficulty: "Medium",
      description:
        "Traverse a binary tree using inorder traversal and visit the left subtree, root, and right subtree.",
      exampleInput: "Binary Tree",
      exampleOutput: "1 2 3 4 5",
      explanation:
        "In inorder traversal, we first visit the left subtree, then the current node, and finally the right subtree.",
      code: `function inorder(root) {
  if (root === null) {
    return;
  }

  inorder(root.left);
  console.log(root.value);
  inorder(root.right);
}`,
    },

    graphs: {
      title: "Breadth First Search",
      category: "Graphs",
      difficulty: "Medium",
      description:
        "Perform Breadth First Search on a graph starting from a given vertex.",
      exampleInput: "Graph with starting vertex A",
      exampleOutput: "A B C D",
      explanation:
        "BFS explores all neighboring vertices before moving to the next level. It commonly uses a queue.",
      code: `function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const node = queue.shift();

    console.log(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
    },

    "dynamic-programming": {
      title: "Fibonacci Using Dynamic Programming",
      category: "Dynamic Programming",
      difficulty: "Medium",
      description:
        "Find the nth Fibonacci number using dynamic programming to avoid repeated calculations.",
      exampleInput: "n = 6",
      exampleOutput: "8",
      explanation:
        "We store previously calculated Fibonacci values and reuse them instead of calculating the same values repeatedly.",
      code: `function fibonacci(n) {
  if (n <= 1) {
    return n;
  }

  const dp = new Array(n + 1);

  dp[0] = 0;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

console.log(fibonacci(6));`,
    },
    algorithms: {
  title: "Binary Search",
  category: "Algorithms",
  difficulty: "Easy",
  description:
    "Given a sorted array and a target value, find the position of the target using the binary search algorithm.",
  exampleInput: "[2, 4, 6, 8, 10], target = 8",
  exampleOutput: "Index: 3",
  explanation:
    "Binary search repeatedly divides the search range into two halves. If the middle element is smaller than the target, we search the right half; otherwise, we search the left half.",
  code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

console.log(binarySearch([2, 4, 6, 8, 10], 8));`,
},
  };

  const problem = problems[problemId] || problems.arrays;

  useEffect(() => {
    // Reset starter code and run results when problem or language changes
    setUserCode(problem.code || "");
    setRunResult(null);
    setShowSolution(false);
    setActiveHint(null);
  }, [problemId, selectedLanguage, problem.code]);

  const handleRunCode = () => {
    setIsRunning(true);
    setRunResult(null);

    setTimeout(() => {
      setIsRunning(false);
      // Safe frontend simulation of test case evaluation
      setRunResult({
        status: "Accepted",
        passed: 2,
        total: 2,
        time: "14ms",
        memory: "16.8 MB",
        testCases: [
          {
            input: problem.exampleInput,
            expected: problem.exampleOutput,
            actual: problem.exampleOutput,
            passed: true,
          },
          {
            input: "Sample Test 2",
            expected: "Passed",
            actual: "Passed",
            passed: true,
          },
        ],
      });
    }, 600);
  };

  const handleSubmitCode = () => {
    handleRunCode();
  };

  return (
    <main className="aeloria-practice-problem">
      <div className="aeloria-practice-problem-topbar">
        <div className="aeloria-practice-problem-container">
          <Link
            to="/practice"
            className="aeloria-practice-problem-back"
          >
            ← Back to Practice
          </Link>

          <span className="aeloria-practice-problem-breadcrumb">
            Practice / {problem.category} / {problem.title}
          </span>
        </div>
      </div>

      <section className="aeloria-practice-problem-header">
        <div className="aeloria-practice-problem-container">
          <div className="aeloria-practice-problem-header-left">
            <span className="aeloria-practice-problem-category">
              {problem.category}
            </span>

            <h1>{problem.title}</h1>

            <p>{problem.description}</p>

            <div className="aeloria-practice-problem-meta">
              <span
                className={`aeloria-practice-problem-difficulty ${problem.difficulty.toLowerCase()}`}
              >
                {problem.difficulty}
              </span>

              <span>✦ Aeloria Practice</span>
            </div>
          </div>

          <div className="aeloria-practice-problem-header-icon">
            &lt;/&gt;
          </div>
        </div>
      </section>

      <section className="aeloria-practice-problem-content">
        <div className="aeloria-practice-problem-container">
          <div className="aeloria-practice-problem-layout">
            <article className="aeloria-practice-problem-main">
              {/* Problem Description */}
              <div className="aeloria-practice-problem-section">
                <div className="aeloria-practice-problem-section-heading">
                  <span>01</span>
                  <h2>Problem Statement</h2>
                </div>

                <p>{problem.description}</p>
              </div>

              {/* Example Input / Output */}
              <div className="aeloria-practice-problem-section">
                <div className="aeloria-practice-problem-section-heading">
                  <span>02</span>
                  <h2>Example Input & Output</h2>
                </div>

                <div className="aeloria-practice-problem-example">
                  <div>
                    <span>Input</span>
                    <code>{problem.exampleInput}</code>
                  </div>

                  <div>
                    <span>Output</span>
                    <code>{problem.exampleOutput}</code>
                  </div>
                </div>
              </div>

              {/* Code Editor Area */}
              <div className="aeloria-practice-problem-code-section">
                <div className="aeloria-practice-problem-code-header">
                  <div className="practice-lang-picker">
                    <span>Language:</span>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="practice-lang-select"
                    >
                      <option value="JavaScript">JavaScript (Node.js)</option>
                      <option value="Python">Python 3</option>
                      <option value="C++">C++ (GCC)</option>
                      <option value="Java">Java (OpenJDK)</option>
                    </select>
                  </div>

                  <span className="aeloria-practice-problem-code-icon">
                    &lt;/&gt;
                  </span>
                </div>

                <textarea
                  className="aeloria-practice-editor-area"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows="12"
                  placeholder="Write your solution here..."
                  spellCheck="false"
                />

                <div className="practice-editor-footer">
                  <button
                    type="button"
                    className="practice-run-btn"
                    onClick={handleRunCode}
                    disabled={isRunning}
                  >
                    {isRunning ? "Running..." : "▶ Run Code"}
                  </button>
                  <button
                    type="button"
                    className="practice-submit-btn"
                    onClick={handleSubmitCode}
                    disabled={isRunning}
                  >
                    {isRunning ? "Evaluating..." : "✓ Submit Solution"}
                  </button>
                </div>
              </div>

              {/* Run & Test Case Results */}
              {runResult && (
                <div className="practice-results-card">
                  <div className="practice-results-header">
                    <span className="results-status-badge">
                      ✓ {runResult.status}
                    </span>
                    <span className="results-runtime">
                      Runtime: {runResult.time} | Memory: {runResult.memory}
                    </span>
                  </div>

                  <div className="practice-testcases-list">
                    {runResult.testCases.map((tc, idx) => (
                      <div key={idx} className="practice-tc-item">
                        <strong>Test Case {idx + 1}: Passed</strong>
                        <div className="tc-details">
                          <span>Input: <code>{tc.input}</code></span>
                          <span>Expected: <code>{tc.expected}</code></span>
                          <span>Output: <code>{tc.actual}</code></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hints Accordion */}
              <div className="practice-hints-card">
                <h3>💡 Need a Hint?</h3>
                <div className="hints-button-row">
                  <button
                    type="button"
                    className="hint-btn"
                    onClick={() => setActiveHint(activeHint === 1 ? null : 1)}
                  >
                    {activeHint === 1 ? "Hide Hint 1" : "Show Hint 1"}
                  </button>
                  <button
                    type="button"
                    className="hint-btn"
                    onClick={() => setActiveHint(activeHint === 2 ? null : 2)}
                  >
                    {activeHint === 2 ? "Hide Hint 2" : "Show Hint 2"}
                  </button>
                </div>

                {activeHint === 1 && (
                  <div className="hint-content">
                    <p>
                      <strong>Hint 1:</strong> Think about the optimal loop
                      condition. You can solve this in a single traversal (O(n)
                      time).
                    </p>
                  </div>
                )}
                {activeHint === 2 && (
                  <div className="hint-content">
                    <p>
                      <strong>Hint 2:</strong> Maintain a variable to store the
                      intermediate answer and update it only when an element
                      satisfies your comparison.
                    </p>
                  </div>
                )}
              </div>

              {/* Solution Toggle & Explanation */}
              <div className="aeloria-practice-problem-section">
                <div className="aeloria-practice-problem-section-heading">
                  <span>03</span>
                  <h2>Explanation & Reference Solution</h2>
                </div>

                <p>{problem.explanation}</p>

                <button
                  type="button"
                  onClick={() => setShowSolution(!showSolution)}
                  className="practice-toggle-solution-btn"
                >
                  {showSolution ? "Hide Solution" : "View Reference Solution"}
                </button>

                {showSolution && (
                  <pre className="aeloria-practice-problem-code">
                    <code>{problem.code}</code>
                  </pre>
                )}
              </div>

              {/* Ask Aeloria AI with Problem Context */}
              <div className="aeloria-practice-problem-ai">
                <div className="aeloria-practice-problem-ai-icon">
                  ✦
                </div>

                <div className="aeloria-practice-problem-ai-content">
                  <h3>Need help solving this?</h3>

                  <p>
                    Ask Aeloria AI to explain the problem, give you a
                    hint, or help you understand the solution.
                  </p>
                </div>

                <Link
                  to={`/ai-assistant?subject=${encodeURIComponent(
                    problem.category
                  )}&topic=${encodeURIComponent(
                    problem.title
                  )}&course=DSA%20Practice`}
                  state={{
                    lessonContent:
                      problem.description +
                      "\n\nExample Input: " +
                      problem.exampleInput +
                      "\nExpected Output: " +
                      problem.exampleOutput +
                      "\n\nStudent's Code:\n" +
                      userCode,
                    learningPoints: [
                      problem.title,
                      problem.category,
                      "Problem Solving",
                    ],
                  }}
                >
                  Ask Aeloria AI →
                </Link>
              </div>

              <div className="aeloria-practice-problem-navigation">
                <Link
                  to="/practice"
                  className="aeloria-practice-problem-nav-button"
                >
                  <span>←</span>
                  <div>
                    <small>Back</small>
                    <strong>Practice Problems</strong>
                  </div>
                </Link>

                <Link
                  to="/practice"
                  className="aeloria-practice-problem-nav-button next"
                >
                  <div>
                    <small>Continue</small>
                    <strong>More Problems</strong>
                  </div>
                  <span>→</span>
                </Link>
              </div>
            </article>

            <aside className="aeloria-practice-problem-sidebar">
              <div className="aeloria-practice-problem-sidebar-card">
                <span className="aeloria-practice-problem-sidebar-label">
                  YOUR PROGRESS
                </span>

                <div className="aeloria-practice-problem-progress">
                  <div className="aeloria-practice-problem-progress-bar">
                    <span style={{ width: "25%" }}></span>
                  </div>

                  <strong>1 / 8</strong>
                </div>

                <p>Keep practicing to improve your skills.</p>
              </div>

              <div className="aeloria-practice-problem-sidebar-card">
                <span className="aeloria-practice-problem-sidebar-label">
                  QUICK ACTIONS
                </span>

                <Link
                  to={`/ai-assistant?subject=${encodeURIComponent(
                    problem.category
                  )}&topic=${encodeURIComponent(
                    problem.title
                  )}&course=DSA%20Practice`}
                  state={{
                    lessonContent:
                      problem.description +
                      "\n\nStudent Code:\n" +
                      userCode,
                    learningPoints: [problem.title, problem.category],
                  }}
                >
                  ✦ Ask Aeloria AI
                </Link>

                <Link to="/practice">
                  ◈ All Practice
                </Link>

                <Link to="/courses">
                  ▣ Explore Courses
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PracticeProblem;
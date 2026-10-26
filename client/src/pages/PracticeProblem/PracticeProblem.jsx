import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getPracticeProblemById } from "../../services/api";
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

    "coding": {
      title: "Even or Odd Number Checker",
      category: "Python",
      difficulty: "Easy",
      description:
        "Write a Python function `check_even_odd(n)` that takes an integer and returns 'Even' if the number is divisible by 2, or 'Odd' if it is not.",
      exampleInput: "4",
      exampleOutput: '"Even"',
      explanation:
        "An integer is even if dividing it by 2 leaves a remainder of 0 (`n % 2 == 0`). Otherwise, it is odd.",
      code: `def check_even_odd(n):
    # Check if remainder is 0 when divided by 2
    if n % 2 == 0:
        return "Even"
    else:
        return "Odd"

# Test your function
print(check_even_odd(4))
print(check_even_odd(7))`,
    },

    "python-even-or-odd": {
      title: "Even or Odd Number Checker",
      category: "Python",
      difficulty: "Easy",
      description:
        "Write a Python function `check_even_odd(n)` that takes an integer and returns 'Even' if the number is divisible by 2, or 'Odd' if it is not.",
      exampleInput: "4",
      exampleOutput: '"Even"',
      explanation:
        "An integer is even if dividing it by 2 leaves a remainder of 0 (`n % 2 == 0`). Otherwise, it is odd.",
      code: `def check_even_odd(n):
    # Check if remainder is 0 when divided by 2
    if n % 2 == 0:
        return "Even"
    else:
        return "Odd"

# Test your function
print(check_even_odd(4))
print(check_even_odd(7))`,
    },

    "python-sum-of-list": {
      title: "Sum of List Elements",
      category: "Python",
      difficulty: "Easy",
      description:
        "Given a list of numbers, write a function `sum_of_list(numbers)` that returns the total sum of all elements.",
      exampleInput: "[10, 20, 30, 40]",
      exampleOutput: "100",
      explanation:
        "Iterate through the list adding each value to an accumulator variable, or use Python's built-in `sum()` function.",
      code: `def sum_of_list(numbers):
    total = 0
    for num in numbers:
        total += num
    return total

print(sum_of_list([10, 20, 30, 40]))`,
    },

    "python-char-frequency": {
      title: "Character Frequency Counter",
      category: "Python",
      difficulty: "Easy",
      description:
        "Given a string, write a function `char_frequency(text)` that returns a dictionary mapping each character to the number of times it appears in the text.",
      exampleInput: '"aeloria"',
      exampleOutput: "{'a': 2, 'e': 1, 'l': 1, 'o': 1, 'r': 1, 'i': 1}",
      explanation:
        "Loop over each character in the string. If the character exists in the dictionary, increment its count by 1; otherwise, initialize it with 1.",
      code: `def char_frequency(text):
    freq = {}
    for char in text:
        freq[char] = freq.get(char, 0) + 1
    return freq

print(char_frequency("aeloria"))`,
    },

    "python-word-count": {
      title: "Word Count in a Sentence",
      category: "Python",
      difficulty: "Easy",
      description:
        "Given a sentence string, write a Python function `count_words(sentence)` that returns the number of words separated by whitespace.",
      exampleInput: '"Learn Python with Aeloria"',
      exampleOutput: "4",
      explanation:
        "Use the string `.split()` method which splits by whitespace characters and returns a list of words, then get the length using `len()`.",
      code: `def count_words(sentence):
    words = sentence.split()
    return len(words)

print(count_words("Learn Python with Aeloria"))`,
    },

    "python-file-handling": {
      title: "Simulate File Line Counter",
      category: "Python",
      difficulty: "Medium",
      description:
        "Simulate file reading: given multi-line string content representing a file's lines, write a function `count_non_empty_lines(content)` that returns the count of non-empty lines.",
      exampleInput: '"Python\\n\\nIs\\nAwesome\\n"',
      exampleOutput: "3",
      explanation:
        "Split the content lines using `.splitlines()`. Filter lines to only include those where `.strip()` is non-empty, and return the count.",
      code: `def count_non_empty_lines(content):
    lines = content.splitlines()
    non_empty = [line for line in lines if line.strip()]
    return len(non_empty)

sample = "Python\\n\\nIs\\nAwesome\\n"
print(count_non_empty_lines(sample))`,
    },
  };

  const pythonQuizQuestions = [
    {
      id: 1,
      topic: "Introduction to Python",
      question: "Which of the following statements correctly describes Python?",
      options: [
        "A compiled language requiring explicit variable declarations",
        "An interpreted, high-level, dynamically-typed programming language",
        "A language designed strictly for hardware drivers",
        "A markup language like HTML"
      ],
      correctAnswer: 1,
      explanation: "Python is an interpreted, high-level language with readable syntax and dynamic typing, created by Guido van Rossum."
    },
    {
      id: 2,
      topic: "Variables and Data Types",
      question: "What does the expression `type(42.5)` return in Python?",
      options: [
        "<class 'int'>",
        "<class 'float'>",
        "<class 'number'>",
        "<class 'decimal'>"
      ],
      correctAnswer: 1,
      explanation: "In Python, floating-point numbers with decimal points belong to the `float` data type."
    },
    {
      id: 3,
      topic: "Operators",
      question: "What is the output of `2 ** 4` in Python?",
      options: ["8", "16", "6", "64"],
      correctAnswer: 1,
      explanation: "`**` is Python's exponentiation operator. 2 to the power 4 equals 16."
    },
    {
      id: 4,
      topic: "Conditional Statements",
      question: "Which keyword is used in Python for 'else if' branch checking?",
      options: ["elseif", "else if", "elif", "elsif"],
      correctAnswer: 2,
      explanation: "Python uses `if`, `elif`, and `else` to control conditional branching."
    },
    {
      id: 5,
      topic: "Loops",
      question: "What values does `range(1, 6)` produce during iteration?",
      options: [
        "1, 2, 3, 4, 5, 6",
        "1, 2, 3, 4, 5",
        "0, 1, 2, 3, 4, 5",
        "0, 1, 2, 3, 4"
      ],
      correctAnswer: 1,
      explanation: "`range(start, stop)` generates integers from `start` up to but not including `stop`. Thus, `range(1, 6)` yields 1, 2, 3, 4, 5."
    },
    {
      id: 6,
      topic: "Lists and Tuples",
      question: "What is the fundamental difference between a Python list and a tuple?",
      options: [
        "Lists use parentheses (), tuples use brackets []",
        "Lists are mutable, whereas tuples are immutable",
        "Lists can only hold numbers, tuples can hold any type",
        "Tuples support .append(), lists do not"
      ],
      correctAnswer: 1,
      explanation: "Lists are mutable (can be changed after creation), while tuples are immutable (read-only sequences)."
    },
    {
      id: 7,
      topic: "Functions",
      question: "Which keyword is used to declare a function in Python?",
      options: ["function", "func", "def", "lambda only"],
      correctAnswer: 2,
      explanation: "In Python, named functions are defined using the `def` keyword followed by the function name and parentheses."
    },
    {
      id: 8,
      topic: "Dictionaries",
      question: "How do you retrieve a key's value safely without throwing a KeyError if it's missing?",
      options: [
        "dict[key]",
        "dict.get(key)",
        "dict.fetch(key)",
        "dict.find(key)"
      ],
      correctAnswer: 1,
      explanation: "The `.get(key)` method returns `None` (or an optional default) if the key does not exist, preventing crashes."
    },
    {
      id: 9,
      topic: "Strings",
      question: "What is the result of `'aeloria'.upper()` in Python?",
      options: ["'aeloria'", "'Aeloria'", "'AELORIA'", "Error"],
      correctAnswer: 2,
      explanation: "The `.upper()` method returns an all-uppercase copy of the original string."
    },
    {
      id: 10,
      topic: "File Handling",
      question: "Why is `with open('file.txt', 'r') as f:` preferred for file operations?",
      options: [
        "It makes the file execute faster",
        "It automatically closes the file when the block exits, even on exceptions",
        "It converts text files into binary files",
        "It encrypts the file content"
      ],
      correctAnswer: 1,
      explanation: "The `with` statement utilizes Python's context manager protocol to guarantee proper file closure automatically."
    }
  ];

  const isQuizMode = problemId === "quiz";

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Problem state
  const [activeProblem, setActiveProblem] = useState(
    problems[problemId] || problems.arrays
  );

  useEffect(() => {
    // If not quiz mode, check if problem exists locally or load from API
    if (!isQuizMode) {
      if (problems[problemId]) {
        setActiveProblem(problems[problemId]);
        if (
          problems[problemId].category === "Python" ||
          problemId.includes("python")
        ) {
          setSelectedLanguage("Python");
        }
      } else {
        // Try to fetch from backend
        getPracticeProblemById(problemId)
          .then((res) => {
            const data = res?.problem || res?.data || res;
            if (data && data.title) {
              setActiveProblem({
                title: data.title,
                category: data.category || "General",
                difficulty: data.difficulty || "Easy",
                description: data.description || "",
                exampleInput: data.exampleInput || "",
                exampleOutput: data.exampleOutput || "",
                explanation: data.explanation || "",
                code: data.starterCode || data.solution || "",
              });
              if (
                data.category?.toLowerCase().includes("python") ||
                problemId.includes("python")
              ) {
                setSelectedLanguage("Python");
              }
            }
          })
          .catch(() => {
            setActiveProblem(problems.arrays);
          });
      }
    }
  }, [problemId, isQuizMode]);

  useEffect(() => {
    setUserCode(activeProblem.code || "");
    setRunResult(null);
    setShowSolution(false);
    setActiveHint(null);
  }, [activeProblem, selectedLanguage]);

  const handleRunCode = () => {
    setIsRunning(true);
    setRunResult(null);

    setTimeout(() => {
      setIsRunning(false);
      setRunResult({
        status: "Accepted",
        passed: 2,
        total: 2,
        time: "12ms",
        memory: "15.4 MB",
        testCases: [
          {
            input: activeProblem.exampleInput || "Sample input",
            expected: activeProblem.exampleOutput || "Sample output",
            actual: activeProblem.exampleOutput || "Sample output",
            passed: true,
          },
          {
            input: "Edge Case Test",
            expected: "Passed",
            actual: "Passed",
            passed: true,
          },
        ],
      });
    }, 500);
  };

  const handleSubmitCode = () => {
    handleRunCode();
  };

  // Quiz Handlers
  const handleOptionSelect = (optionIndex) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optionIndex);
  };

  const handleCheckQuizAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === pythonQuizQuestions[quizIndex].correctAnswer) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex + 1 < pythonQuizQuestions.length) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <main className="aeloria-practice-problem">
      <div className="aeloria-practice-problem-topbar">
        <div className="aeloria-practice-problem-container">
          <Link to="/practice" className="aeloria-practice-problem-back">
            ← Back to Practice
          </Link>

          <span className="aeloria-practice-problem-breadcrumb">
            Practice / {isQuizMode ? "Python Quiz" : `${activeProblem.category} / ${activeProblem.title}`}
          </span>
        </div>
      </div>

      <section className="aeloria-practice-problem-header">
        <div className="aeloria-practice-problem-container">
          <div className="aeloria-practice-problem-header-left">
            <span className="aeloria-practice-problem-category">
              {isQuizMode ? "Python Quiz" : activeProblem.category}
            </span>

            <h1>
              {isQuizMode
                ? "Python Programming MCQ Assessment"
                : activeProblem.title}
            </h1>

            <p>
              {isQuizMode
                ? "Test your understanding of Python fundamentals, syntax, data structures, and functions across 10 core topics."
                : activeProblem.description}
            </p>

            <div className="aeloria-practice-problem-meta">
              <span
                className={`aeloria-practice-problem-difficulty ${
                  isQuizMode ? "easy" : activeProblem.difficulty.toLowerCase()
                }`}
              >
                {isQuizMode ? "Quiz" : activeProblem.difficulty}
              </span>

              <span>✦ Aeloria Practice</span>
            </div>
          </div>

          <div className="aeloria-practice-problem-header-icon">
            {isQuizMode ? "❓" : "</>"}
          </div>
        </div>
      </section>

      <section className="aeloria-practice-problem-content">
        <div className="aeloria-practice-problem-container">
          <div className="aeloria-practice-problem-layout">
            <article className="aeloria-practice-problem-main">
              {/* QUIZ MODE UI */}
              {isQuizMode ? (
                <div className="quiz-mode-container">
                  {!quizFinished ? (
                    <div>
                      <div className="quiz-header-status">
                        <span className="quiz-topic-badge">
                          Topic: {pythonQuizQuestions[quizIndex].topic}
                        </span>
                        <span className="quiz-score-badge">
                          Question {quizIndex + 1} of {pythonQuizQuestions.length} | Score: {quizScore}
                        </span>
                      </div>

                      <h2 className="quiz-question-title">
                        {pythonQuizQuestions[quizIndex].question}
                      </h2>

                      <div className="quiz-options-list">
                        {pythonQuizQuestions[quizIndex].options.map(
                          (option, idx) => {
                            let optionClass = "quiz-option-btn";
                            if (selectedOption === idx) {
                              optionClass += " selected";
                            }
                            if (isAnswerSubmitted) {
                              if (
                                idx ===
                                pythonQuizQuestions[quizIndex].correctAnswer
                              ) {
                                optionClass += " correct";
                              } else if (selectedOption === idx) {
                                optionClass += " incorrect";
                              }
                            }

                            return (
                              <button
                                key={idx}
                                type="button"
                                className={optionClass}
                                onClick={() => handleOptionSelect(idx)}
                                disabled={isAnswerSubmitted}
                              >
                                <span className="quiz-option-label">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span>{option}</span>
                              </button>
                            );
                          }
                        )}
                      </div>

                      {isAnswerSubmitted && (
                        <div
                          className={`quiz-feedback-box ${
                            selectedOption ===
                            pythonQuizQuestions[quizIndex].correctAnswer
                              ? "correct"
                              : "incorrect"
                          }`}
                        >
                          <strong>
                            {selectedOption ===
                            pythonQuizQuestions[quizIndex].correctAnswer
                              ? "✓ Correct Answer!"
                              : "✗ Incorrect!"}
                          </strong>
                          <p>{pythonQuizQuestions[quizIndex].explanation}</p>
                        </div>
                      )}

                      <div className="quiz-controls-row">
                        {!isAnswerSubmitted ? (
                          <button
                            type="button"
                            className="quiz-action-btn"
                            onClick={handleCheckQuizAnswer}
                            disabled={selectedOption === null}
                          >
                            Check Answer
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="quiz-action-btn"
                            onClick={handleNextQuizQuestion}
                          >
                            {quizIndex + 1 < pythonQuizQuestions.length
                              ? "Next Question →"
                              : "Finish Quiz & View Results"}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="quiz-results-card">
                      <h2>🎉 Quiz Completed!</h2>
                      <div className="quiz-results-score">
                        {quizScore} / {pythonQuizQuestions.length}
                      </div>
                      <p className="quiz-results-msg">
                        {quizScore >= 8
                          ? "Outstanding! You have a solid grasp of Python programming fundamentals."
                          : quizScore >= 5
                          ? "Good effort! Review the study notes and practice lessons to strengthen your skills."
                          : "Keep practicing! Explore the Python lessons and tutorials to master each topic."}
                      </p>
                      <div className="quiz-controls-row" style={{ justifyContent: "center" }}>
                        <button
                          type="button"
                          className="quiz-action-btn"
                          onClick={handleRestartQuiz}
                        >
                          🔄 Retake Quiz
                        </button>
                        <Link
                          to="/courses/python-programming-for-beginners"
                          className="quiz-action-btn"
                          style={{ textDecoration: "none" }}
                        >
                          📖 Go to Python Course
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* CODING PROBLEM MODE UI */
                <>
                  {/* Problem Description */}
                  <div className="aeloria-practice-problem-section">
                    <div className="aeloria-practice-problem-section-heading">
                      <span>01</span>
                      <h2>Problem Statement</h2>
                    </div>

                    <p>{activeProblem.description}</p>
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
                        <code>{activeProblem.exampleInput}</code>
                      </div>

                      <div>
                        <span>Output</span>
                        <code>{activeProblem.exampleOutput}</code>
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
                          <option value="Python">Python 3</option>
                          <option value="JavaScript">JavaScript (Node.js)</option>
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
                          <strong>Hint 1:</strong> Think about Python's built-in operators
                          or functions (such as %, sum(), split(), or dict.get()).
                        </p>
                      </div>
                    )}
                    {activeHint === 2 && (
                      <div className="hint-content">
                        <p>
                          <strong>Hint 2:</strong> Ensure you handle edge cases such as empty
                          lists or inputs with different casings.
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

                    <p>{activeProblem.explanation}</p>

                    <button
                      type="button"
                      onClick={() => setShowSolution(!showSolution)}
                      className="practice-toggle-solution-btn"
                    >
                      {showSolution ? "Hide Solution" : "View Reference Solution"}
                    </button>

                    {showSolution && (
                      <pre className="aeloria-practice-problem-code">
                        <code>{activeProblem.code}</code>
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
                        activeProblem.category
                      )}&topic=${encodeURIComponent(
                        activeProblem.title
                      )}&course=Python%20Practice`}
                      state={{
                        lessonContent:
                          activeProblem.description +
                          "\n\nExample Input: " +
                          activeProblem.exampleInput +
                          "\nExpected Output: " +
                          activeProblem.exampleOutput +
                          "\n\nStudent's Code:\n" +
                          userCode,
                        learningPoints: [
                          activeProblem.title,
                          activeProblem.category,
                          "Problem Solving",
                        ],
                      }}
                    >
                      Ask Aeloria AI →
                    </Link>
                  </div>
                </>
              )}

              <div className="aeloria-practice-problem-navigation">
                <Link to="/practice" className="aeloria-practice-problem-nav-button">
                  <span>←</span>
                  <div>
                    <small>Back</small>
                    <strong>Practice Problems</strong>
                  </div>
                </Link>

                <Link
                  to={isQuizMode ? "/practice/coding" : "/practice/quiz"}
                  className="aeloria-practice-problem-nav-button next"
                >
                  <div>
                    <small>Next Activity</small>
                    <strong>{isQuizMode ? "Coding Problems" : "Take Quiz"}</strong>
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
                    <span style={{ width: "40%" }}></span>
                  </div>

                  <strong>
                    {isQuizMode
                      ? `${quizIndex + 1} / ${pythonQuizQuestions.length}`
                      : "1 / 10"}
                  </strong>
                </div>

                <p>Keep practicing to build your Python mastery.</p>
              </div>

              <div className="aeloria-practice-problem-sidebar-card">
                <span className="aeloria-practice-problem-sidebar-label">
                  QUICK ACTIONS
                </span>

                <Link
                  to={`/ai-assistant?subject=Python&topic=${encodeURIComponent(
                    isQuizMode ? "Python Quiz" : activeProblem.title
                  )}&course=Python%20Mastery`}
                  state={{
                    lessonContent: isQuizMode
                      ? "Python multiple choice quiz assessment"
                      : activeProblem.description,
                    learningPoints: ["Python Fundamentals", "Problem Solving"],
                  }}
                >
                  ✦ Ask Aeloria AI
                </Link>

                <Link to="/courses/python-programming-for-beginners">
                  🐍 Python Course
                </Link>

                <Link to="/tutorials/python">
                  📖 Python Tutorial
                </Link>

                <Link to="/notes/python-programming-notes">
                  📝 Python Notes
                </Link>

                <Link to="/practice">
                  ◈ All Practice
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
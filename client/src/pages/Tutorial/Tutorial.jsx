import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getTutorialById } from "../../services/api";
import "./Tutorial.css";

function Tutorial() {
  const { tutorialId } = useParams();
  const [activeTopic, setActiveTopic] = useState(0);
  const [apiTutorial, setApiTutorial] = useState(null);
  const [loading, setLoading] = useState(true);

  const tutorials = {
    javascript: {
      title: "JavaScript Tutorial",
      category: "JavaScript",
      level: "Beginner to Advanced",
      topics: [
        {
          title: "Introduction to JavaScript",
          content:
            "JavaScript is a programming language used to create interactive and dynamic web applications.",
          points: [
            "What is JavaScript?",
            "Features of JavaScript",
            "JavaScript in the browser",
            "How JavaScript works",
            "Writing your first JavaScript program",
          ],
        },
        {
          title: "Variables in JavaScript",
          content:
            "Variables are used to store values that can be used and changed throughout a program.",
          points: [
            "var",
            "let",
            "const",
            "Variable naming rules",
            "Scope of variables",
          ],
        },
        {
          title: "Data Types",
          content:
            "JavaScript provides different data types for representing numbers, strings, boolean values, objects, and more.",
          points: [
            "String",
            "Number",
            "Boolean",
            "Undefined",
            "Null",
            "Object",
          ],
        },
        {
          title: "Operators",
          content:
            "Operators are symbols that allow you to perform calculations, comparisons, and logical operations.",
          points: [
            "Arithmetic operators",
            "Assignment operators",
            "Comparison operators",
            "Logical operators",
            "Ternary operator",
          ],
        },
        {
          title: "Conditional Statements",
          content:
            "Conditional statements allow a JavaScript program to execute different code depending on a condition.",
          points: [
            "if statement",
            "if-else",
            "else-if",
            "Nested conditions",
            "Switch statement",
          ],
        },
        {
          title: "Loops",
          content:
            "Loops are used when you need to execute a block of code multiple times.",
          points: [
            "for loop",
            "while loop",
            "do-while loop",
            "break",
            "continue",
          ],
        },
        {
          title: "Functions",
          content:
            "Functions are reusable blocks of code that perform a specific task.",
          points: [
            "Function declaration",
            "Function expression",
            "Parameters",
            "Return values",
            "Arrow functions",
          ],
        },
        {
          title: "Arrays",
          content:
            "Arrays are used to store multiple values inside a single variable.",
          points: [
            "Creating arrays",
            "Accessing elements",
            "Array methods",
            "map()",
            "filter()",
            "reduce()",
          ],
        },
        {
          title: "Objects",
          content:
            "Objects store related data and functionality using key-value pairs.",
          points: [
            "Creating objects",
            "Object properties",
            "Object methods",
            "Nested objects",
            "Destructuring",
          ],
        },
        {
          title: "DOM Manipulation",
          content:
            "The Document Object Model allows JavaScript to interact with HTML elements on a webpage.",
          points: [
            "Selecting elements",
            "Changing content",
            "Changing styles",
            "Handling events",
            "Creating elements",
          ],
        },
        {
          title: "Asynchronous JavaScript",
          content:
            "Asynchronous JavaScript allows applications to perform tasks such as API requests without blocking the main execution flow.",
          points: [
            "Callbacks",
            "Promises",
            "async and await",
            "Fetch API",
            "Error handling",
          ],
        },
      ],
    },

    "c-programming": {
      title: "C Programming Tutorial",
      category: "C",
      level: "Beginner",
      topics: [
        {
          title: "Introduction to C",
          content:
            "C is a general-purpose programming language widely used for learning programming fundamentals and system development.",
          points: [
            "What is C?",
            "Features of C",
            "History of C",
            "Applications of C",
            "First C program",
          ],
        },
        {
          title: "Variables and Data Types",
          content:
            "Variables store values in memory, while data types define what kind of value can be stored.",
          points: [
            "Variables",
            "Constants",
            "int",
            "float",
            "char",
            "double",
          ],
        },
        {
          title: "Operators",
          content:
            "Operators are used to perform mathematical, logical, relational, and assignment operations.",
          points: [
            "Arithmetic operators",
            "Relational operators",
            "Logical operators",
            "Assignment operators",
            "Increment and decrement",
          ],
        },
        {
          title: "Conditional Statements",
          content:
            "Conditional statements allow programs to make decisions based on conditions.",
          points: [
            "if",
            "if-else",
            "else-if",
            "Nested if",
            "switch",
          ],
        },
        {
          title: "Loops",
          content:
            "Loops allow a block of code to execute repeatedly.",
          points: [
            "for loop",
            "while loop",
            "do-while loop",
            "break",
            "continue",
          ],
        },
        {
          title: "Functions",
          content:
            "Functions divide a program into smaller reusable blocks.",
          points: [
            "Function declaration",
            "Function definition",
            "Parameters",
            "Return values",
            "Recursion",
          ],
        },
        {
          title: "Arrays",
          content:
            "Arrays store multiple values of the same data type in a collection.",
          points: [
            "One-dimensional arrays",
            "Two-dimensional arrays",
            "Array traversal",
            "Searching",
            "Sorting",
          ],
        },
        {
          title: "Pointers",
          content:
            "Pointers are variables that store memory addresses and are an important feature of C.",
          points: [
            "Pointer basics",
            "Address operator",
            "Pointer declaration",
            "Pointers and arrays",
            "Pointers and functions",
          ],
        },
      ],
    },

    "cpp-programming": {
      title: "C++ Programming Tutorial",
      category: "C++",
      level: "Beginner to Intermediate",
      topics: [
        {
          title: "Introduction to C++",
          content:
            "C++ is a general-purpose programming language that supports procedural and object-oriented programming.",
          points: [
            "What is C++?",
            "Features of C++",
            "C++ program structure",
            "Input and output",
            "Compilation",
          ],
        },
        {
          title: "Classes and Objects",
          content:
            "Classes define the structure of objects and objects represent instances of those classes.",
          points: [
            "Class declaration",
            "Objects",
            "Data members",
            "Member functions",
            "Access modifiers",
          ],
        },
        {
          title: "Inheritance",
          content:
            "Inheritance allows one class to acquire properties and behaviour from another class.",
          points: [
            "Base class",
            "Derived class",
            "Single inheritance",
            "Multiple inheritance",
            "Multilevel inheritance",
          ],
        },
        {
          title: "Polymorphism",
          content:
            "Polymorphism allows the same interface to behave differently in different situations.",
          points: [
            "Function overloading",
            "Operator overloading",
            "Function overriding",
            "Virtual functions",
            "Runtime polymorphism",
          ],
        },
        {
          title: "STL",
          content:
            "The Standard Template Library provides reusable containers, iterators, and algorithms.",
          points: [
            "Vector",
            "Set",
            "Map",
            "Stack",
            "Queue",
          ],
        },
      ],
    },

    "java-programming": {
      title: "Java Programming Tutorial",
      category: "Java",
      level: "Beginner to Advanced",
      topics: [
        {
          title: "Introduction to Java",
          content:
            "Java is a popular object-oriented programming language designed to work across different platforms.",
          points: [
            "What is Java?",
            "Features of Java",
            "JDK",
            "JRE",
            "JVM",
          ],
        },
        {
          title: "Variables and Data Types",
          content:
            "Java uses variables and data types to store and process information.",
          points: [
            "Primitive types",
            "Reference types",
            "Variables",
            "Constants",
            "Type casting",
          ],
        },
        {
          title: "OOP Concepts",
          content:
            "Object-oriented programming is a core part of Java development.",
          points: [
            "Classes",
            "Objects",
            "Encapsulation",
            "Inheritance",
            "Polymorphism",
          ],
        },
        {
          title: "Exception Handling",
          content:
            "Exception handling helps Java programs respond to unexpected situations.",
          points: [
            "try",
            "catch",
            "finally",
            "throw",
            "throws",
          ],
        },
        {
          title: "Collections",
          content:
            "Java Collections provide useful data structures for storing and processing groups of objects.",
          points: [
            "ArrayList",
            "LinkedList",
            "HashSet",
            "HashMap",
            "Iterator",
          ],
        },
      ],
    },

    python: {
      title: "Python Programming Tutorial",
      category: "Python",
      level: "Beginner",
      topics: [
        {
          title: "Introduction to Python",
          content:
            "Python is a high-level programming language known for its readable syntax, indentation-based structure, and vast ecosystem.",
          points: [
            "What is Python?",
            "Features of Python",
            "Python installation and runtime",
            "Python clean syntax",
            "Writing and running first program",
          ],
          codeExample: `# Introduction to Python\nprint("Hello, Welcome to Python on AELORIA!")\n\nlanguage = "Python"\nprint(f"You are mastering {language}!")`,
        },
        {
          title: "Variables and Data Types",
          content:
            "Python variables store values dynamically without requiring explicit type declaration. Key data types include int, float, str, and bool.",
          points: [
            "Numbers (int, float)",
            "Strings and characters",
            "Booleans (True, False)",
            "Type conversion (casting)",
            "Dynamic typing rules",
          ],
          codeExample: `# Variables and Types\nname = "Aeloria Student"\nage = 20\nscore = 94.5\nis_active = True\n\nprint(f"Name: {name}, Age: {age}, Score: {score}")\nprint(f"Type of score: {type(score)}")`,
        },
        {
          title: "Operators",
          content:
            "Operators allow you to perform arithmetic, comparison, logical, and membership calculations in Python.",
          points: [
            "Arithmetic (+, -, *, /, //, %, **)",
            "Comparison (==, !=, >, <, >=, <=)",
            "Logical (and, or, not)",
            "Membership (in, not in)",
            "Assignment operators",
          ],
          codeExample: `# Operators\nx = 10\ny = 3\n\nprint("Floor division:", x // y)  # 3\nprint("Power:", x ** y)           # 1000\nprint("Modulus:", x % y)          # 1\nprint("Is 10 > 5 and 3 < 5?", x > 5 and y < 5)`,
        },
        {
          title: "Conditional Statements",
          content:
            "Conditional statements allow decisions in Python programs using if, elif, and else statements.",
          points: [
            "if statement",
            "if-else block",
            "elif ladder",
            "Nested conditions",
            "Ternary expressions",
          ],
          codeExample: `# Conditional Statements\nmarks = 85\n\nif marks >= 90:\n    result = "Distinction"\nelif marks >= 75:\n    result = "First Class"\nelse:\n    result = "Passed"\n\nprint("Performance:", result)`,
        },
        {
          title: "Loops",
          content:
            "Loops repeat execution of code blocks. Python supports for loops over iterables and while loops with conditions.",
          points: [
            "for loop with range()",
            "Iterating over collections",
            "while loop with condition",
            "break statement",
            "continue statement",
          ],
          codeExample: `# Loops in Python\nprint("For Loop:")\nfor i in range(1, 4):\n    print(f"Step {i}")\n\nprint("While Loop:")\nn = 3\nwhile n > 0:\n    print(f"Countdown: {n}")\n    n -= 1`,
        },
        {
          title: "Lists and Tuples",
          content:
            "Lists are mutable ordered sequences, while tuples are immutable fixed sequences.",
          points: [
            "List creation and indexing",
            "List methods: append, pop, sort",
            "List slicing [start:end:step]",
            "Tuples and immutability",
            "Tuple unpacking",
          ],
          codeExample: `# Lists and Tuples\nfruits = ["apple", "banana", "orange"]\nfruits.append("mango")\nprint("Fruits:", fruits)\nprint("Slice:", fruits[1:3])\n\ncoords = (10, 20)\nx, y = coords\nprint(f"Coordinates: X={x}, Y={y}")`,
        },
        {
          title: "Functions",
          content:
            "Functions organize reusable blocks of Python code, declared using the def keyword with return values.",
          points: [
            "Defining functions with def",
            "Parameters and arguments",
            "Default parameters",
            "Return values",
            "Docstrings and scope",
          ],
          codeExample: `# Functions\ndef greet(name, role="Learner"):\n    """Return a greeting message."""\n    return f"Hello {name}, welcome as a {role}!"\n\nmsg = greet("Alex", "Python Developer")\nprint(msg)`,
        },
        {
          title: "Dictionaries",
          content:
            "Dictionaries store key-value mappings with fast lookup using unique, hashable keys.",
          points: [
            "Dictionary syntax {key: value}",
            "Accessing values with get()",
            "Adding and modifying keys",
            "Iterating over items()",
            "Dictionary comprehension",
          ],
          codeExample: `# Dictionaries\nstudent = {\n    "name": "Jordan",\n    "course": "Python",\n    "modules_completed": 8\n}\n\nstudent["score"] = 92\nfor key, val in student.items():\n    print(f"{key}: {val}")`,
        },
        {
          title: "Strings",
          content:
            "Strings are sequences of Unicode characters with rich formatting and manipulation methods.",
          points: [
            "f-string interpolation",
            "String methods: split, join, strip",
            "Case conversion: upper, lower, title",
            "Substring search with 'in'",
            "String immutability",
          ],
          codeExample: `# Strings\nraw = "  learn python programming  "\nclean = raw.strip().title()\nprint("Cleaned:", clean)\nwords = clean.split()\nprint("Words:", words)\nprint("Hyphenated:", "-".join(words).lower())`,
        },
        {
          title: "File Handling",
          content:
            "File handling allows reading and writing to files safely using context managers.",
          points: [
            "open() in read and write modes",
            "with statement for safe closure",
            "Reading lines with read() & readlines()",
            "Writing text with write()",
            "Handling FileNotFoundError",
          ],
          codeExample: `# File Handling\nwith open("sample.txt", "w") as f:\n    f.write("Line 1: Python is versatile.\\nLine 2: AELORIA Learning.")\n\nwith open("sample.txt", "r") as f:\n    for line in f:\n        print("File Line:", line.strip())`,
        },
      ],
    },

    "mern-stack": {
      title: "MERN Stack Tutorial",
      category: "MERN",
      level: "Intermediate",
      topics: [
        {
          title: "Introduction to MERN",
          content:
            "MERN is a full-stack JavaScript technology stack consisting of MongoDB, Express.js, React, and Node.js.",
          points: [
            "What is MERN?",
            "MERN architecture",
            "Frontend",
            "Backend",
            "Database",
          ],
        },
        {
          title: "React Fundamentals",
          content:
            "React is a JavaScript library used to create component-based user interfaces.",
          points: [
            "Components",
            "JSX",
            "Props",
            "State",
            "Events",
          ],
        },
        {
          title: "Node.js",
          content:
            "Node.js allows JavaScript to run outside the browser and is commonly used for backend development.",
          points: [
            "Node.js basics",
            "Modules",
            "NPM",
            "File system",
            "HTTP server",
          ],
        },
        {
          title: "Express.js",
          content:
            "Express.js is a Node.js framework used to build web servers and REST APIs.",
          points: [
            "Express setup",
            "Routes",
            "Middleware",
            "Controllers",
            "REST APIs",
          ],
        },
        {
          title: "MongoDB",
          content:
            "MongoDB is a document-oriented NoSQL database commonly used with MERN applications.",
          points: [
            "Database",
            "Collections",
            "Documents",
            "CRUD operations",
            "Mongoose",
          ],
        },
        {
          title: "Connecting Frontend and Backend",
          content:
            "A MERN application connects the React frontend with an Express and Node.js backend through APIs.",
          points: [
            "API requests",
            "Fetch",
            "Axios",
            "JSON data",
            "API integration",
          ],
        },
      ],
    },

    "web-development": {
      title: "Web Development Tutorial",
      category: "Web Development",
      level: "Beginner to Advanced",
      topics: [
        {
          title: "How the Web Works",
          content:
            "Learn the basic concepts behind websites, browsers, servers, and HTTP.",
          points: [
            "Client and server",
            "Browser",
            "Web server",
            "HTTP",
            "URL",
          ],
        },
        {
          title: "HTML Basics",
          content:
            "HTML provides the structure and content of web pages.",
          points: [
            "HTML elements",
            "Headings",
            "Paragraphs",
            "Links",
            "Forms",
          ],
        },
        {
          title: "CSS Basics",
          content:
            "CSS controls the visual appearance and layout of web pages.",
          points: [
            "Selectors",
            "Colors",
            "Box model",
            "Flexbox",
            "Grid",
          ],
        },
        {
          title: "Responsive Design",
          content:
            "Responsive design allows websites to adapt to different screen sizes.",
          points: [
            "Media queries",
            "Flexible layouts",
            "Mobile design",
            "Responsive images",
            "Breakpoints",
          ],
        },
        {
          title: "JavaScript for Web",
          content:
            "JavaScript adds interactivity and dynamic behaviour to web pages.",
          points: [
            "DOM",
            "Events",
            "Functions",
            "Forms",
            "APIs",
          ],
        },
      ],
    },

    "data-structures": {
      title: "Data Structures Tutorial",
      category: "DSA",
      level: "Beginner to Advanced",
      topics: [
        {
          title: "Introduction to Data Structures",
          content:
            "Data structures organize data so that it can be stored, accessed, and processed efficiently.",
          points: [
            "What are data structures?",
            "Linear structures",
            "Non-linear structures",
            "Time complexity",
            "Space complexity",
          ],
        },
        {
          title: "Arrays",
          content:
            "Arrays store elements in a sequential structure.",
          points: [
            "Array creation",
            "Traversal",
            "Insertion",
            "Deletion",
            "Searching",
          ],
        },
        {
          title: "Linked Lists",
          content:
            "Linked lists store data in nodes connected through links.",
          points: [
            "Singly linked list",
            "Doubly linked list",
            "Insertion",
            "Deletion",
            "Reversal",
          ],
        },
        {
          title: "Stacks",
          content:
            "A stack follows the Last In, First Out principle.",
          points: [
            "Push",
            "Pop",
            "Peek",
            "Stack implementation",
            "Applications",
          ],
        },
        {
          title: "Queues",
          content:
            "A queue generally follows the First In, First Out principle.",
          points: [
            "Enqueue",
            "Dequeue",
            "Front",
            "Rear",
            "Applications",
          ],
        },
        {
          title: "Trees",
          content:
            "Trees are hierarchical data structures consisting of nodes and relationships.",
          points: [
            "Binary tree",
            "BST",
            "Tree traversal",
            "Height",
            "Searching",
          ],
        },
        {
          title: "Graphs",
          content:
            "Graphs represent relationships between connected entities.",
          points: [
            "Vertices",
            "Edges",
            "BFS",
            "DFS",
            "Graph representation",
          ],
        },
      ],
    },
  };

  tutorials["python-programming"] = tutorials.python;

  useEffect(() => {
    let isMounted = true;
    const fetchTutorial = async () => {
      try {
        setLoading(true);
        const res = await getTutorialById(tutorialId);
        if (isMounted && res?.tutorial) {
          const t = res.tutorial;
          let mappedTopics = [];
          if (Array.isArray(t.topics) && t.topics.length > 0) {
            mappedTopics = t.topics.map((topic) => ({
              title: topic.title,
              content: topic.content || "",
              points: [
                `Learn ${topic.title}`,
                "Core syntax and semantics",
                "Practical coding practice",
                "Key takeaways",
              ],
              codeExample: topic.codeExample || "",
            }));
          }

          if (mappedTopics.length > 0) {
            setApiTutorial({
              title: t.title,
              category: t.category || "Python",
              level: t.level || "Beginner",
              topics: mappedTopics,
            });
          }
        }
      } catch (err) {
        console.log("Using cached tutorial for", tutorialId);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTutorial();
    return () => {
      isMounted = false;
    };
  }, [tutorialId]);

  const tutorial =
    apiTutorial ||
    tutorials[tutorialId] ||
    tutorials.python ||
    tutorials.javascript;

  const currentTopic =
    (tutorial.topics && tutorial.topics[activeTopic]) ||
    (tutorial.topics && tutorial.topics[0]) || {
      title: "Topic",
      content: "",
      points: [],
      codeExample: "",
    };

  const goNext = () => {
    if (activeTopic < tutorial.topics.length - 1) {
      setActiveTopic(activeTopic + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const goPrevious = () => {
    if (activeTopic > 0) {
      setActiveTopic(activeTopic - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="aeloria-tutorial-page">
      <div className="aeloria-tutorial-topbar">
        <div className="aeloria-tutorial-topbar-container">
          <Link
            to="/tutorials"
            className="aeloria-tutorial-back"
          >
            ← All Tutorials
          </Link>

          <span className="aeloria-tutorial-breadcrumb">
            {tutorial.category} / {currentTopic.title}
          </span>
        </div>
      </div>

      <section className="aeloria-tutorial-header">
        <div className="aeloria-tutorial-header-container">
          <div className="aeloria-tutorial-header-content">
            <span className="aeloria-tutorial-category">
              {tutorial.category}
            </span>

            <h1>{tutorial.title}</h1>

            <p>
              Learn {tutorial.category} step by step with
              simple explanations, practical concepts, examples,
              and structured learning resources.
            </p>

            <div className="aeloria-tutorial-meta">
              <span>📊 {tutorial.level}</span>
              <span>📚 {tutorial.topics.length} Topics</span>
              <span>✦ Aeloria Learning</span>
            </div>
          </div>

          <div className="aeloria-tutorial-header-card">
            <div className="aeloria-tutorial-header-card-icon">
              &lt;/&gt;
            </div>

            <h3>Learn by Topic</h3>

            <p>
              Follow the sidebar topics in order or jump directly
              to the concept you want to learn.
            </p>
          </div>
        </div>
      </section>

      <section className="aeloria-tutorial-learning">
        <aside className="aeloria-tutorial-sidebar">
          <div className="aeloria-tutorial-sidebar-header">
            <span>TUTORIAL CONTENT</span>
            <strong>
              {tutorial.topics.length} Topics
            </strong>
          </div>

          <div className="aeloria-tutorial-topic-list">
            {tutorial.topics.map((topic, index) => (
              <button
                key={topic.title}
                className={`aeloria-tutorial-topic ${
                  activeTopic === index ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTopic(index);

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                <span className="aeloria-tutorial-topic-number">
                  {index + 1}
                </span>

                <span className="aeloria-tutorial-topic-name">
                  {topic.title}
                </span>

                {index < activeTopic && (
                  <span className="aeloria-tutorial-topic-check">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="aeloria-tutorial-ai-box">
            <span className="aeloria-tutorial-ai-icon">
              ✦
            </span>

            <h3>Need help?</h3>

            <p>
              Ask Aeloria AI to explain this tutorial topic in
              simple words.
            </p>

            <Link
              to={`/ai-assistant?subject=${encodeURIComponent(
                tutorial.category
              )}&topic=${encodeURIComponent(
                currentTopic.title
              )}&course=${encodeURIComponent(
                tutorial.title
              )}`}
              state={{
                lessonContent: currentTopic.content,
                learningPoints: currentTopic.points,
              }}
            >
              Ask Aeloria AI →
            </Link>
          </div>
        </aside>

        <div className="aeloria-tutorial-content">
          <div className="aeloria-tutorial-content-top">
            <span>
              Topic {activeTopic + 1} of{" "}
              {tutorial.topics.length}
            </span>

            <span className="aeloria-tutorial-content-label">
              {tutorial.category}
            </span>
          </div>

          <h2>{currentTopic.title}</h2>

          <p className="aeloria-tutorial-content-description">
            {currentTopic.content}
          </p>

          <div className="aeloria-tutorial-concepts">
            <h3>Key Concepts</h3>

            <div className="aeloria-tutorial-concept-list">
              {currentTopic.points.map((point) => (
                <div
                  className="aeloria-tutorial-concept"
                  key={point}
                >
                  <span>✓</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="aeloria-tutorial-example">
            <div className="aeloria-tutorial-example-header">
              <span>Example</span>
              <span>&lt;/&gt;</span>
            </div>

            <div className="aeloria-tutorial-code">
              {currentTopic.codeExample ? (
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    fontFamily: "Consolas, Menlo, Monaco, monospace",
                    fontSize: "13.5px",
                    lineHeight: "1.65",
                    color: "#f8fafc",
                    backgroundColor: "transparent",
                  }}
                >
                  {currentTopic.codeExample}
                </pre>
              ) : (
                <>
                  {tutorial.category === "JavaScript" && (
                <>
                  <span className="tutorial-code-purple">
                    const
                  </span>{" "}
                  message ={" "}
                  <span className="tutorial-code-coral">
                    "Hello, Aeloria!"
                  </span>
                  ;
                  <br />
                  console.log(message);
                </>
              )}

              {tutorial.category === "C" && (
                <>
                  <span className="tutorial-code-purple">
                    #include
                  </span>{" "}
                  &lt;stdio.h&gt;
                  <br />
                  <br />
                  <span className="tutorial-code-purple">
                    int
                  </span>{" "}
                  main() {"{"}
                  <br />
                  &nbsp;&nbsp;printf(
                  <span className="tutorial-code-coral">
                    "Hello, Aeloria!"
                  </span>
                  );
                  <br />
                  &nbsp;&nbsp;
                  <span className="tutorial-code-purple">
                    return
                  </span>{" "}
                  0;
                  <br />
                  {"}"}
                </>
              )}

              {tutorial.category === "C++" && (
                <>
                  <span className="tutorial-code-purple">
                    #include
                  </span>{" "}
                  &lt;iostream&gt;
                  <br />
                  <br />
                  <span className="tutorial-code-purple">
                    int
                  </span>{" "}
                  main() {"{"}
                  <br />
                  &nbsp;&nbsp;std::cout &lt;&lt;{" "}
                  <span className="tutorial-code-coral">
                    "Hello, Aeloria!"
                  </span>
                  ;
                  <br />
                  &nbsp;&nbsp;
                  <span className="tutorial-code-purple">
                    return
                  </span>{" "}
                  0;
                  <br />
                  {"}"}
                </>
              )}

              {tutorial.category === "Java" && (
                <>
                  <span className="tutorial-code-purple">
                    public class
                  </span>{" "}
                  Main {"{"}
                  <br />
                  &nbsp;&nbsp;
                  <span className="tutorial-code-purple">
                    public static void
                  </span>{" "}
                  main(String[] args) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  System.out.println(
                  <span className="tutorial-code-coral">
                    "Hello, Aeloria!"
                  </span>
                  );
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  {"}"}
                </>
              )}

              {tutorial.category === "Python" && (
                <>
                  <span className="tutorial-code-purple">
                    def
                  </span>{" "}
                  learn():
                  <br />
                  &nbsp;&nbsp;print(
                  <span className="tutorial-code-coral">
                    "Hello, Aeloria!"
                  </span>
                  )
                </>
              )}

              {tutorial.category === "MERN" && (
                <>
                  <span className="tutorial-code-purple">
                    const
                  </span>{" "}
                  app = express();
                  <br />
                  <br />
                  app.get(
                  <span className="tutorial-code-coral">
                    "/"
                  </span>
                  , (req, res) =&gt; {"{"}
                  <br />
                  &nbsp;&nbsp;res.send(
                  <span className="tutorial-code-coral">
                    "Hello from Aeloria"
                  </span>
                  );
                  <br />
                  {"}"});
                </>
              )}

              {tutorial.category === "Web Development" && (
                <>
                  <span className="tutorial-code-purple">
                    &lt;h1&gt;
                  </span>
                  Hello Aeloria
                  <span className="tutorial-code-purple">
                    &lt;/h1&gt;
                  </span>
                  <br />
                  <br />
                  <span className="tutorial-code-purple">
                    &lt;p&gt;
                  </span>
                  Learn. Practice. Build.
                  <span className="tutorial-code-purple">
                    &lt;/p&gt;
                  </span>
                </>
              )}

              {tutorial.category === "DSA" && (
                <>
                  <span className="tutorial-code-purple">
                    const
                  </span>{" "}
                  arr = [1, 2, 3, 4, 5];
                  <br />
                  <br />
                  arr.forEach(
                  <span className="tutorial-code-purple">
                    (value) =&gt;
                  </span>{" "}
                  {"{"}
                  <br />
                  &nbsp;&nbsp;console.log(value);
                  <br />
                  {"}"});
                </>
              )}
                </>
              )}
            </div>
          </div>

          <div className="aeloria-tutorial-ai-inline">
            <div className="aeloria-tutorial-ai-inline-icon">
              ✦
            </div>

            <div>
              <h3>
                Confused about this topic?
              </h3>

              <p>
                Ask Aeloria AI for a simple explanation,
                example, code, or quiz.
              </p>
            </div>

            <Link
              to={`/ai-assistant?subject=${encodeURIComponent(
                tutorial.category
              )}&topic=${encodeURIComponent(
                currentTopic.title
              )}&course=${encodeURIComponent(
                tutorial.title
              )}`}
              state={{
                lessonContent: currentTopic.content,
                learningPoints: currentTopic.points,
              }}
            >
              Ask AI →
            </Link>
          </div>

          <div className="aeloria-tutorial-navigation">
            <button
              className="aeloria-tutorial-nav-button previous"
              onClick={goPrevious}
              disabled={activeTopic === 0}
            >
              <span>←</span>

              <div>
                <small>Previous</small>

                <strong>
                  {activeTopic > 0
                    ? tutorial.topics[activeTopic - 1].title
                    : "Start of tutorial"}
                </strong>
              </div>
            </button>

            <button
              className="aeloria-tutorial-nav-button next"
              onClick={goNext}
              disabled={
                activeTopic === tutorial.topics.length - 1
              }
            >
              <div>
                <small>Next</small>

                <strong>
                  {activeTopic <
                  tutorial.topics.length - 1
                    ? tutorial.topics[activeTopic + 1].title
                    : "Tutorial Complete"}
                </strong>
              </div>

              <span>→</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Tutorial;
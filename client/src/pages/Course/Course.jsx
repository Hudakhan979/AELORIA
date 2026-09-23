import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Course.css";

function Course() {
  const { courseId } = useParams();
  const [activeTopic, setActiveTopic] = useState(0);

  const courses = {
    "c-programming": {
      title: "Complete C Programming",
      category: "C",
      level: "Beginner",
      lessons: "45 Lessons",
      duration: "12 Hours",
      description:
        "Learn C programming from the basics and build a strong foundation in programming and problem solving.",
      topics: [
        {
          title: "Introduction to C",
          content:
            "C is a powerful general-purpose programming language. It is widely used for system programming, embedded systems, and learning programming fundamentals.",
          points: [
            "What is C programming?",
            "Features of C",
            "History of C",
            "Applications of C",
            "Setting up a C environment",
          ],
        },
        {
          title: "Variables & Data Types",
          content:
            "Variables are used to store data in a program. C provides different data types for storing integers, characters, decimal values, and other information.",
          points: [
            "Variables",
            "Constants",
            "int, float, double and char",
            "Declaration and initialization",
            "Type conversion",
          ],
        },
        {
          title: "Operators",
          content:
            "Operators are symbols used to perform operations on values and variables.",
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
            "Conditional statements allow a program to make decisions based on different conditions.",
          points: [
            "if statement",
            "if-else statement",
            "else-if ladder",
            "Nested if",
            "Switch statement",
          ],
        },
        {
          title: "Loops",
          content:
            "Loops are used to repeatedly execute a block of code while a condition is satisfied.",
          points: [
            "for loop",
            "while loop",
            "do-while loop",
            "Nested loops",
            "break and continue",
          ],
        },
        {
          title: "Functions",
          content:
            "Functions help divide a program into smaller reusable blocks of code.",
          points: [
            "Function declaration",
            "Function definition",
            "Function parameters",
            "Return values",
            "Recursive functions",
          ],
        },
        {
          title: "Arrays",
          content:
            "An array stores multiple values of the same data type in a single collection.",
          points: [
            "One-dimensional arrays",
            "Two-dimensional arrays",
            "Array traversal",
            "Searching in arrays",
            "Sorting arrays",
          ],
        },
        {
          title: "Pointers",
          content:
            "Pointers are variables that store memory addresses. They are one of the most important concepts in C.",
          points: [
            "Introduction to pointers",
            "Address operator",
            "Pointer declaration",
            "Pointers and arrays",
            "Pointers and functions",
          ],
        },
        {
          title: "Structures",
          content:
            "Structures allow different types of data to be grouped together under one name.",
          points: [
            "Structure declaration",
            "Structure variables",
            "Array of structures",
            "Nested structures",
            "Structure with functions",
          ],
        },
        {
          title: "Practice Problems",
          content:
            "Test your C programming knowledge with practical coding problems.",
          points: [
            "Basic programming problems",
            "Conditional problems",
            "Loop problems",
            "Array problems",
            "Function problems",
          ],
        },
      ],
    },

    "cpp-programming": {
      title: "C++ Programming Mastery",
      category: "C++",
      level: "Beginner to Intermediate",
      lessons: "50 Lessons",
      duration: "15 Hours",
      description:
        "Master C++ programming, object-oriented concepts, STL, and problem solving.",
      topics: [
        {
          title: "Introduction to C++",
          content:
            "Learn the fundamentals of C++ and understand how it extends the C programming language.",
          points: [
            "What is C++?",
            "Features of C++",
            "C++ program structure",
            "Compilation",
            "Input and output",
          ],
        },
        {
          title: "Variables & Data Types",
          content:
            "Understand variables, constants, data types, and type conversion in C++.",
          points: [
            "Primitive data types",
            "Variables",
            "Constants",
            "Type casting",
            "Input and output",
          ],
        },
        {
          title: "Functions",
          content:
            "Learn how functions make C++ programs modular and reusable.",
          points: [
            "Function declaration",
            "Function parameters",
            "Return values",
            "Default arguments",
            "Function overloading",
          ],
        },
        {
          title: "OOP Concepts",
          content:
            "Object-oriented programming is one of the core concepts of C++.",
          points: [
            "Classes and objects",
            "Encapsulation",
            "Inheritance",
            "Polymorphism",
            "Abstraction",
          ],
        },
        {
          title: "STL",
          content:
            "The Standard Template Library provides powerful containers and algorithms.",
          points: [
            "Vectors",
            "Sets",
            "Maps",
            "Stacks and queues",
            "STL algorithms",
          ],
        },
      ],
    },

    "java-programming": {
      title: "Java Programming",
      category: "Java",
      level: "Beginner to Advanced",
      lessons: "55 Lessons",
      duration: "18 Hours",
      description:
        "Build a strong foundation in Java programming, OOP, collections, and exception handling.",
      topics: [
        {
          title: "Introduction to Java",
          content:
            "Java is a popular object-oriented programming language used to build applications across different platforms.",
          points: [
            "What is Java?",
            "Features of Java",
            "JDK, JRE and JVM",
            "First Java program",
            "Compilation and execution",
          ],
        },
        {
          title: "Variables & Data Types",
          content:
            "Learn how Java stores and works with different types of data.",
          points: [
            "Primitive data types",
            "Variables",
            "Constants",
            "Type casting",
            "Input and output",
          ],
        },
        {
          title: "OOP in Java",
          content:
            "Learn the fundamental object-oriented concepts used throughout Java development.",
          points: [
            "Classes and objects",
            "Inheritance",
            "Polymorphism",
            "Encapsulation",
            "Abstraction",
          ],
        },
        {
          title: "Exception Handling",
          content:
            "Exception handling allows Java programs to handle unexpected situations safely.",
          points: [
            "try and catch",
            "finally",
            "throw",
            "throws",
            "Custom exceptions",
          ],
        },
        {
          title: "Collections",
          content:
            "Java Collections provide ready-to-use data structures for storing and processing data.",
          points: [
            "ArrayList",
            "LinkedList",
            "HashSet",
            "HashMap",
            "Iterators",
          ],
        },
      ],
    },

    "python-programming": {
      title: "Python Programming",
      category: "Python",
      level: "Beginner",
      lessons: "48 Lessons",
      duration: "14 Hours",
      description:
        "Learn Python from fundamentals to functions, OOP, file handling, and practical programming.",
      topics: [
        {
          title: "Introduction to Python",
          content:
            "Python is a high-level programming language known for its simple syntax and wide range of applications.",
          points: [
            "What is Python?",
            "Features of Python",
            "Installing Python",
            "Python syntax",
            "First Python program",
          ],
        },
        {
          title: "Variables & Data Types",
          content:
            "Learn how Python stores numbers, strings, collections, and other values.",
          points: [
            "Numbers",
            "Strings",
            "Lists",
            "Tuples",
            "Dictionaries",
          ],
        },
        {
          title: "Conditions & Loops",
          content:
            "Use conditions and loops to control the flow of Python programs.",
          points: [
            "if statement",
            "if-else",
            "for loop",
            "while loop",
            "break and continue",
          ],
        },
        {
          title: "Functions",
          content:
            "Functions allow Python programs to be organized into reusable blocks.",
          points: [
            "Defining functions",
            "Parameters",
            "Return values",
            "Lambda functions",
            "Recursion",
          ],
        },
        {
          title: "OOP in Python",
          content:
            "Learn classes, objects, inheritance, and other object-oriented concepts in Python.",
          points: [
            "Classes",
            "Objects",
            "Constructors",
            "Inheritance",
            "Polymorphism",
          ],
        },
      ],
    },

    javascript: {
      title: "JavaScript Complete Guide",
      category: "JavaScript",
      level: "Beginner to Advanced",
      lessons: "60 Lessons",
      duration: "20 Hours",
      description:
        "Master modern JavaScript, ES6+, DOM, asynchronous programming, APIs, and practical development.",
      topics: [
        {
          title: "Introduction to JavaScript",
          content:
            "JavaScript is a programming language used to make web pages interactive and dynamic.",
          points: [
            "What is JavaScript?",
            "JavaScript in the browser",
            "Variables",
            "Basic syntax",
            "Console",
          ],
        },
        {
          title: "Variables & Data Types",
          content:
            "Learn let, const, primitive values, objects, and type conversion.",
          points: [
            "let",
            "const",
            "var",
            "Primitive data types",
            "Type conversion",
          ],
        },
        {
          title: "Functions",
          content:
            "Functions are reusable blocks of JavaScript code.",
          points: [
            "Function declaration",
            "Function expression",
            "Arrow functions",
            "Parameters",
            "Return values",
          ],
        },
        {
          title: "Arrays & Objects",
          content:
            "Arrays and objects are fundamental structures for working with data in JavaScript.",
          points: [
            "Creating arrays",
            "Array methods",
            "Objects",
            "Object methods",
            "Destructuring",
          ],
        },
        {
          title: "DOM Manipulation",
          content:
            "The DOM allows JavaScript to interact with HTML elements on a web page.",
          points: [
            "Selecting elements",
            "Changing content",
            "Changing styles",
            "Events",
            "Creating elements",
          ],
        },
        {
          title: "Async JavaScript",
          content:
            "Learn how JavaScript handles asynchronous operations such as API requests.",
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

    "mern-stack": {
      title: "MERN Stack Development",
      category: "MERN",
      level: "Intermediate",
      lessons: "70 Lessons",
      duration: "25 Hours",
      description:
        "Learn MongoDB, Express.js, React, and Node.js by building modern full-stack web applications.",
      topics: [
        {
          title: "MERN Stack Introduction",
          content:
            "MERN is a full-stack JavaScript technology stack consisting of MongoDB, Express.js, React, and Node.js.",
          points: [
            "What is MERN?",
            "MERN architecture",
            "Frontend and backend",
            "REST APIs",
            "Project structure",
          ],
        },
        {
          title: "React Fundamentals",
          content:
            "React is a JavaScript library used for building component-based user interfaces.",
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
            "Node.js allows JavaScript to run on the server side.",
          points: [
            "Node.js introduction",
            "Modules",
            "NPM",
            "File system",
            "HTTP server",
          ],
        },
        {
          title: "Express.js",
          content:
            "Express.js is a web framework for building APIs and server-side applications with Node.js.",
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
            "Database basics",
            "Collections",
            "Documents",
            "CRUD operations",
            "Mongoose",
          ],
        },
        {
          title: "Full Stack Project",
          content:
            "Combine React, Node.js, Express, and MongoDB to create a complete full-stack application.",
          points: [
            "Frontend setup",
            "Backend setup",
            "API integration",
            "Authentication",
            "Deployment basics",
          ],
        },
      ],
    },

    angular: {
      title: "Angular Web Development",
      category: "Angular",
      level: "Intermediate",
      lessons: "55 Lessons",
      duration: "18 Hours",
      description:
        "Learn Angular fundamentals, components, services, routing, forms, APIs, and application development.",
      topics: [
        {
          title: "Introduction to Angular",
          content:
            "Angular is a TypeScript-based framework for building modern web applications.",
          points: [
            "What is Angular?",
            "Angular CLI",
            "Project structure",
            "Components",
            "Templates",
          ],
        },
        {
          title: "Components",
          content:
            "Components are the basic building blocks of Angular applications.",
          points: [
            "Creating components",
            "Templates",
            "Data binding",
            "Event binding",
            "Component communication",
          ],
        },
        {
          title: "Services",
          content:
            "Angular services are used to organize reusable application logic and shared data.",
          points: [
            "Creating services",
            "Dependency injection",
            "Sharing data",
            "HTTP services",
            "Reusable logic",
          ],
        },
        {
          title: "Routing",
          content:
            "Angular routing allows users to navigate between different views in a single-page application.",
          points: [
            "Routes",
            "RouterLink",
            "Route parameters",
            "Navigation",
            "Guards",
          ],
        },
        {
          title: "Forms & APIs",
          content:
            "Learn how to create forms and connect Angular applications with backend APIs.",
          points: [
            "Template-driven forms",
            "Reactive forms",
            "Validation",
            "HTTP client",
            "API requests",
          ],
        },
      ],
    },

    dsa: {
      title: "Data Structures & Algorithms",
      category: "DSA",
      level: "Beginner to Advanced",
      lessons: "80 Lessons",
      duration: "30 Hours",
      description:
        "Master important data structures and algorithms for problem solving, coding practice, and interviews.",
      topics: [
        {
          title: "Introduction to DSA",
          content:
            "Data Structures and Algorithms help us organize data and solve problems efficiently.",
          points: [
            "What is DSA?",
            "Time complexity",
            "Space complexity",
            "Big O notation",
            "Problem solving",
          ],
        },
        {
          title: "Arrays",
          content:
            "Arrays store elements in a sequential structure and are one of the most commonly used data structures.",
          points: [
            "Array basics",
            "Traversal",
            "Searching",
            "Sorting",
            "Two pointer technique",
          ],
        },
        {
          title: "Linked Lists",
          content:
            "Linked lists store elements as connected nodes and allow flexible insertion and deletion.",
          points: [
            "Singly linked list",
            "Doubly linked list",
            "Insertion",
            "Deletion",
            "Reversal",
          ],
        },
        {
          title: "Stacks & Queues",
          content:
            "Stacks and queues are linear data structures with different methods of adding and removing elements.",
          points: [
            "Stack",
            "Queue",
            "Deque",
            "Applications",
            "Implementation",
          ],
        },
        {
          title: "Trees",
          content:
            "Trees are hierarchical data structures used in many real-world applications.",
          points: [
            "Binary trees",
            "Binary search trees",
            "Tree traversal",
            "Height",
            "Balanced trees",
          ],
        },
        {
          title: "Graphs",
          content:
            "Graphs represent relationships between connected entities.",
          points: [
            "Graph representation",
            "BFS",
            "DFS",
            "Shortest path",
            "Graph problems",
          ],
        },
        {
          title: "Dynamic Programming",
          content:
            "Dynamic programming solves complex problems by breaking them into overlapping subproblems.",
          points: [
            "Memoization",
            "Tabulation",
            "Optimal substructure",
            "Classic DP problems",
            "Problem solving",
          ],
        },
      ],
    },
  };

  const course = courses[courseId] || courses["c-programming"];
  const currentTopic = course.topics[activeTopic];

  const goNext = () => {
    if (activeTopic < course.topics.length - 1) {
      setActiveTopic(activeTopic + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goPrevious = () => {
    if (activeTopic > 0) {
      setActiveTopic(activeTopic - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="aeloria-course-page">
      <div className="aeloria-course-topbar">
        <div className="aeloria-course-topbar-container">
          <Link to="/courses" className="aeloria-course-back">
            ← All Courses
          </Link>

          <span className="aeloria-course-breadcrumb">
            {course.category} / {currentTopic.title}
          </span>
        </div>
      </div>

      <section className="aeloria-course-header">
        <div className="aeloria-course-header-container">
          <div className="aeloria-course-header-content">
            <span className="aeloria-course-category">
              {course.category}
            </span>

            <h1>{course.title}</h1>

            <p>{course.description}</p>

            <div className="aeloria-course-meta">
              <span>📊 {course.level}</span>
              <span>📚 {course.lessons}</span>
              <span>⏱ {course.duration}</span>
            </div>
          </div>

          <div className="aeloria-course-progress-card">
            <div className="aeloria-course-progress-top">
              <span>Your Progress</span>
              <strong>
                {Math.round(
                  ((activeTopic + 1) / course.topics.length) * 100
                )}
                %
              </strong>
            </div>

            <div className="aeloria-course-progress-bar">
              <span
                style={{
                  width: `${
                    ((activeTopic + 1) / course.topics.length) * 100
                  }%`,
                }}
              ></span>
            </div>

            <p>
              {activeTopic + 1} of {course.topics.length} topics
            </p>
          </div>
        </div>
      </section>

      <section className="aeloria-course-learning">
        <aside className="aeloria-course-sidebar">
          <div className="aeloria-course-sidebar-header">
            <span>COURSE CONTENT</span>
            <strong>{course.topics.length} Topics</strong>
          </div>

          <div className="aeloria-course-topic-list">
            {course.topics.map((topic, index) => (
              <button
                key={topic.title}
                className={`aeloria-course-topic ${
                  activeTopic === index ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTopic(index);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <span className="aeloria-course-topic-number">
                  {index + 1}
                </span>

                <span className="aeloria-course-topic-name">
                  {topic.title}
                </span>

                {index < activeTopic && (
                  <span className="aeloria-course-topic-check">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="aeloria-course-ai-box">
            <span className="aeloria-course-ai-icon">✦</span>

            <h3>Stuck on a topic?</h3>

            <p>
              Ask Aeloria AI to explain this concept in simple words.
            </p>

<Link
  to={`/ai-assistant?subject=${encodeURIComponent(
    course.category
  )}&topic=${encodeURIComponent(
    currentTopic.title
  )}&course=${encodeURIComponent(
    course.title
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

        <div className="aeloria-course-content">
          <div className="aeloria-course-content-top">
            <span>
              Topic {activeTopic + 1} of {course.topics.length}
            </span>

            <span className="aeloria-course-content-label">
              {course.category}
            </span>
          </div>

          <h2>{currentTopic.title}</h2>

          <p className="aeloria-course-content-description">
            {currentTopic.content}
          </p>

          <div className="aeloria-course-learning-box">
            <h3>What you will learn</h3>

            <div className="aeloria-course-learning-points">
              {currentTopic.points.map((point) => (
                <div key={point} className="aeloria-course-learning-point">
                  <span>✓</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="aeloria-course-example">
            <div className="aeloria-course-example-header">
              <span>Example</span>
              <span>&lt;/&gt;</span>
            </div>

            <div className="aeloria-course-code">
              {course.category === "C" && (
                <>
                  <span className="code-purple">#include</span>{" "}
                  <span className="code-text">&lt;stdio.h&gt;</span>
                  <br />
                  <br />
                  <span className="code-purple">int</span>{" "}
                  <span className="code-text">main</span>() {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="code-text">printf</span>(
                  <span className="code-coral">
                    "Hello, Aeloria!"
                  </span>
                  );
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="code-purple">return</span>{" "}
                  <span className="code-number">0</span>;
                  <br />
                  {"}"}
                </>
              )}

              {course.category === "JavaScript" && (
                <>
                  <span className="code-purple">function</span>{" "}
                  <span className="code-text">learn</span>() {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="code-purple">const</span> message ={" "}
                  <span className="code-coral">
                    "Keep learning!"
                  </span>
                  ;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  console.log(message);
                  <br />
                  {"}"}
                </>
              )}

              {course.category === "Python" && (
                <>
                  <span className="code-purple">def</span>{" "}
                  <span className="code-text">learn</span>():
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  message ={" "}
                  <span className="code-coral">
                    "Keep learning!"
                  </span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  print(message)
                </>
              )}

              {course.category === "Java" && (
                <>
                  <span className="code-purple">public class</span>{" "}
                  <span className="code-text">Main</span> {"{"}
                  <br />
                  &nbsp;&nbsp;
                  <span className="code-purple">public static void</span>{" "}
                  main(String[] args) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  System.out.println(
                  <span className="code-coral">
                    "Hello, Aeloria!"
                  </span>
                  );
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  {"}"}
                </>
              )}

              {course.category === "C++" && (
                <>
                  <span className="code-purple">#include</span>{" "}
                  <span className="code-text">&lt;iostream&gt;</span>
                  <br />
                  <br />
                  <span className="code-purple">int</span>{" "}
                  <span className="code-text">main</span>() {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;std::cout &lt;&lt;{" "}
                  <span className="code-coral">
                    "Hello, Aeloria!"
                  </span>
                  ;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="code-purple">return</span>{" "}
                  <span className="code-number">0</span>;
                  <br />
                  {"}"}
                </>
              )}

              {course.category === "MERN" && (
                <>
                  <span className="code-purple">const</span>{" "}
                  express ={" "}
                  <span className="code-text">
                    require("express")
                  </span>
                  ;
                  <br />
                  <br />
                  <span className="code-purple">const</span> app =
                  express();
                  <br />
                  app.get(
                  <span className="code-coral">"/"</span>, (req,
                  res) =&gt; {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;res.send(
                  <span className="code-coral">
                    "Hello from Aeloria"
                  </span>
                  );
                  <br />
                  {"}"});
                </>
              )}

              {course.category === "Angular" && (
                <>
                  <span className="code-purple">import</span>{" "}
                  {"{"} Component {"}"}{" "}
                  <span className="code-purple">from</span>{" "}
                  <span className="code-coral">
                    "@angular/core"
                  </span>
                  ;
                  <br />
                  <br />
                  @Component({"{"}
                  <br />
                  &nbsp;&nbsp;selector:{" "}
                  <span className="code-coral">
                    "app-learning"
                  </span>
                  ,
                  <br />
                  &nbsp;&nbsp;template:{" "}
                  <span className="code-coral">
                    "&lt;h1&gt;Learn Aeloria&lt;/h1&gt;"
                  </span>
                  <br />
                  {"}"})
                </>
              )}

              {course.category === "DSA" && (
                <>
                  <span className="code-purple">function</span>{" "}
                  <span className="code-text">binarySearch</span>
                  (arr, target) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="code-purple">let</span> left =
                  <span className="code-number">0</span>;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="code-purple">let</span> right =
                  arr.length - <span className="code-number">1</span>;
                  <br />
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="code-purple">while</span> (left
                  &lt;= right) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="code-text">
                    const mid = Math.floor((left + right) / 2);
                  </span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                  <br />
                  {"}"}
                </>
              )}
            </div>
          </div>

          <div className="aeloria-course-ai-inline">
            <div className="aeloria-course-ai-inline-icon">
              ✦
            </div>

            <div>
              <h3>Need help understanding this topic?</h3>
              <p>
                Ask Aeloria AI for a simple explanation, example,
                code, or quiz.
              </p>
            </div>

<Link
  to={`/ai-assistant?subject=${encodeURIComponent(
    course.category
  )}&topic=${encodeURIComponent(
    currentTopic.title
  )}&course=${encodeURIComponent(
    course.title
  )}`}
  state={{
    lessonContent: currentTopic.content,
    learningPoints: currentTopic.points,
  }}
>
  Ask AI →
</Link>
          </div>

          <div className="aeloria-course-navigation">
            <button
              className="aeloria-course-nav-button previous"
              onClick={goPrevious}
              disabled={activeTopic === 0}
            >
              <span>←</span>
              <div>
                <small>Previous</small>
                <strong>
                  {activeTopic > 0
                    ? course.topics[activeTopic - 1].title
                    : "Start of course"}
                </strong>
              </div>
            </button>

            <button
              className="aeloria-course-nav-button next"
              onClick={goNext}
              disabled={activeTopic === course.topics.length - 1}
            >
              <div>
                <small>Next</small>
                <strong>
                  {activeTopic < course.topics.length - 1
                    ? course.topics[activeTopic + 1].title
                    : "Course Complete"}
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

export default Course;
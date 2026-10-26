import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getCourseById,
  getCourseProgress,
  toggleLessonCompletion,
  updateLastAccessedLesson,
} from "../../services/api";
import "./Course.css";

function Course() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const { token } = useAuth();
  const [activeTopic, setActiveTopic] = useState(0);
  const [apiCourse, setApiCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [markingLoading, setMarkingLoading] = useState(false);
  const [initialResumeApplied, setInitialResumeApplied] = useState(false);

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

    "python-programming-for-beginners": {
      title: "Python Programming for Beginners",
      category: "Python",
      level: "Beginner",
      lessons: "10 Lessons",
      duration: "10 Hours",
      description:
        "Learn Python programming from the basics. Master variables, operators, conditions, loops, collections, functions, and file handling step by step.",
      topics: [
        {
          title: "Introduction to Python",
          content:
            "Python is a popular, high-level, interpreted programming language created by Guido van Rossum. It emphasizes readability, rapid development, and clear indentation rather than curly braces. Python is used in web development, automation, data science, and AI.",
          points: [
            "Understand Python design philosophy and simple syntax",
            "Learn how the Python interpreter executes code line by line",
            "Write and execute your first print('Hello, Aeloria!') script",
            "Learn indentation rules: 4 spaces instead of braces",
          ],
          codeExample: `# 01. Introduction to Python - First Program
def welcome_aeloria():
    message = "Welcome to Python Programming on AELORIA!"
    version = "Python 3.x"
    print(message)
    print(f"Running on: {version}")

welcome_aeloria()`,
        },
        {
          title: "Variables and Data Types",
          content:
            "Python is dynamically typed: you do not need to explicitly declare variable types. Python automatically determines types at runtime. Core data types include int, float, str, bool, and None.",
          points: [
            "Declare and assign variables without explicit type annotations",
            "Work with int, float, string, and boolean primitive types",
            "Check variable data types using type() function",
            "Perform explicit type conversion (type casting)",
          ],
          codeExample: `# 02. Variables and Data Types
student_name = "Alex"          # str
course_points = 95             # int
completion_rate = 98.5         # float
is_enrolled = True             # bool

print(f"Student: {student_name} ({type(student_name).__name__})")
print(f"Points: {course_points}, Rate: {completion_rate}%")
print(f"Enrollment Active: {is_enrolled}")

# Type conversion
points_str = str(course_points)
print(f"Points as string: '{points_str}'")`,
        },
        {
          title: "Operators",
          content:
            "Operators perform operations on variables and values. Python provides arithmetic (+, -, *, /, //, %, **), comparison (==, !=, >, <, >=, <=), logical (and, or, not), assignment, and identity/membership operators.",
          points: [
            "Use arithmetic operators including floor division (//) and exponentiation (**)",
            "Compare values with relational equality and inequality operators",
            "Combine boolean logic using and, or, not",
            "Use membership operator 'in' to test containment",
          ],
          codeExample: `# 03. Python Operators
a = 15
b = 4

print("Addition:", a + b)           # 19
print("Division:", a / b)           # 3.75
print("Floor Division:", a // b)    # 3
print("Modulus (Remainder):", a % b)# 3
print("Exponentiation:", a ** 2)    # 225

# Logical & Membership
has_prereq = True
score = 85
qualifies = has_prereq and (score >= 80)
print("Qualifies for certificate:", qualifies)
print("'P' in 'Python':", "P" in "Python")`,
        },
        {
          title: "Conditional Statements",
          content:
            "Conditional statements control program flow based on conditions. Python uses if, elif, and else blocks with indentation defining the scope.",
          points: [
            "Make binary decisions using if and else blocks",
            "Chain multi-branch conditions using elif statements",
            "Evaluate compound boolean expressions cleanly",
            "Avoid common indentation and comparison pitfalls",
          ],
          codeExample: `# 04. Conditional Statements
score = 88

if score >= 90:
    grade = "A (Distinction)"
elif score >= 80:
    grade = "B (Very Good)"
elif score >= 70:
    grade = "C (Good)"
elif score >= 60:
    grade = "D (Pass)"
else:
    grade = "F (Need Revision)"

print(f"Score: {score} -> Grade: {grade}")`,
        },
        {
          title: "Loops",
          content:
            "Loops allow code to repeat execution. Python provides for loops (iterating over sequences, ranges, or collections) and while loops (executing while a boolean condition remains True), alongside break and continue.",
          points: [
            "Iterate through ranges and collections using for loops",
            "Use while loops with safety termination conditions",
            "Skip iterations using continue statement",
            "Exit loops immediately using break statement",
          ],
          codeExample: `# 05. Loops in Python
print("--- For Loop with range() ---")
total = 0
for number in range(1, 6):
    total += number
    print(f"Adding {number}, running total = {total}")

print("\\n--- While Loop with Condition ---")
countdown = 3
while countdown > 0:
    print(f"Launching in {countdown}...")
    countdown -= 1
print("🚀 Lift off!")`,
        },
        {
          title: "Lists and Tuples",
          content:
            "Lists and tuples are sequence data types in Python. Lists are mutable (can be modified after creation: append, remove, sort), enclosed in square brackets []. Tuples are immutable (read-only), enclosed in parentheses ().",
          points: [
            "Create and index zero-indexed lists and tuples",
            "Modify lists using append(), pop(), and insert()",
            "Understand immutability of tuples for fixed datasets",
            "Slice sub-sequences using start:stop:step syntax",
          ],
          codeExample: `# 06. Lists and Tuples
# Mutable List
modules = ["Basics", "Conditions", "Loops"]
modules.append("Functions")
modules.insert(1, "Variables")
print("Course Modules:", modules)
print("First module:", modules[0])
print("Last module:", modules[-1])

# Slicing
print("Core topics (first 3):", modules[:3])

# Immutable Tuple
screen_resolution = (1920, 1080)
width, height = screen_resolution  # Unpacking
print(f"Display Dimensions: {width}x{height}")`,
        },
        {
          title: "Functions",
          content:
            "Functions are reusable blocks of code defined with the def keyword. They accept parameters, execute logic, and return values with return. Python functions also support default arguments, *args, and docstrings.",
          points: [
            "Define reusable functions using def keyword",
            "Pass positional and keyword arguments",
            "Use default parameter values effectively",
            "Return single or multiple values from functions",
          ],
          codeExample: `# 07. Functions
def calculate_grade(student_name, marks, passing_score=60):
    """Calculate whether a student passed and return a formatted status."""
    is_passed = marks >= passing_score
    status = "Passed" if is_passed else "Needs Improvement"
    return f"{student_name}: {status} with {marks} marks"

result1 = calculate_grade("Huda", 92)
result2 = calculate_grade("Sam", 55)

print(result1)
print(result2)`,
        },
        {
          title: "Dictionaries",
          content:
            "Dictionaries store data in key-value pairs enclosed in {}. Keys must be unique and immutable (such as strings or numbers), while values can be any data type. Dictionaries provide fast lookup by key.",
          points: [
            "Create key-value dictionaries and access elements by key",
            "Use .get() method to safely retrieve values with defaults",
            "Add, update, and remove dictionary keys",
            "Iterate over keys, values, and items() pairs",
          ],
          codeExample: `# 08. Dictionaries
course_info = {
    "title": "Python Programming for Beginners",
    "level": "Beginner",
    "lessons_count": 10,
    "language": "Python",
    "status": "published"
}

# Accessing and modifying
print("Course Title:", course_info.get("title"))
course_info["rating"] = 4.9

print("\\n--- Course Details ---")
for key, value in course_info.items():
    print(f"• {key.capitalize()}: {value}")`,
        },
        {
          title: "Strings",
          content:
            "Strings in Python are immutable sequences of Unicode characters. Python offers powerful string manipulation tools: f-strings for formatting, methods like .strip(), .split(), .join(), .replace(), and slicing.",
          points: [
            "Format dynamic strings cleanly using Python 3 f-strings",
            "Split sentences into words with .split() and join with .join()",
            "Clean user input with .strip(), .lower(), and .upper()",
            "Perform substring searches and replacements",
          ],
          codeExample: `# 09. Strings
raw_input = "   aeloria python masterclass   "
clean_title = raw_input.strip().title()
print("Clean Title:", clean_title)

# Splitting and Joining
words = clean_title.split(" ")
slug = "-".join([w.lower() for w in words])
print("Generated Slug:", slug)

# Inspection & Formatting
sentence = f"The '{clean_title}' course has {len(words)} key focus areas."
print(sentence)
print("Starts with 'Aeloria':", clean_title.startswith("Aeloria"))`,
        },
        {
          title: "File Handling",
          content:
            "File handling allows Python programs to read from and write to disk files. Using the 'with open(...) as f:' context manager ensures files are automatically and safely closed after operations.",
          points: [
            "Open files in read ('r'), write ('w'), and append ('a') modes",
            "Use the with statement for safe resource and error management",
            "Read files line by line using readlines() or iteration",
            "Handle missing files gracefully with try-except blocks",
          ],
          codeExample: `# 10. File Handling
filename = "aeloria_notes.txt"

# Writing to file using context manager
with open(filename, "w", encoding="utf-8") as file:
    file.write("AELORIA Learning Platform\\n")
    file.write("Python Programming for Beginners Complete Notes\\n")
    file.write("Status: 10/10 Topics Completed Successfully!\\n")

# Reading from file
try:
    with open(filename, "r", encoding="utf-8") as file:
        content = file.read()
        print("--- File Contents Read ---")
        print(content)
except FileNotFoundError:
    print(f"Error: Could not locate {filename}")`,
        },
      ],
    },
  };

  courses["python-programming"] = courses["python-programming-for-beginners"];

  useEffect(() => {
    let isMounted = true;
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await getCourseById(courseId);
        if (isMounted && res?.course) {
          const c = res.course;
          let mappedTopics = [];
          if (Array.isArray(c.lessons) && c.lessons.length > 0) {
            mappedTopics = c.lessons.map((lesson, idx) => ({
              id: lesson._id || `lesson-${idx}`,
              title: lesson.title,
              content: lesson.content || lesson.description,
              points: lesson.description
                ? lesson.description.split("•").map((p) => p.trim()).filter(Boolean)
                : [
                    `Understand ${lesson.title}`,
                    "Core syntax & concepts",
                    "Practical Python implementation",
                    "Hands-on coding exercise",
                  ],
              codeExample: lesson.codeExample || "",
            }));
          } else if (Array.isArray(c.topics) && c.topics.length > 0) {
            mappedTopics = c.topics.map((t, idx) => ({
              id: t._id || `topic-${idx}`,
              title: typeof t === "string" ? t : t.title || "Topic",
              content: typeof t === "string" ? c.description : t.content || c.description,
              points: t.points || ["Key concepts", "Syntax breakdown", "Working example"],
              codeExample: t.codeExample || "",
            }));
          }

          if (mappedTopics.length > 0) {
            setApiCourse({
              _id: c._id,
              slug: c.slug,
              title: c.title,
              category: c.category || "Python",
              level: c.level || "Beginner",
              lessons: `${c.lessonsCount || mappedTopics.length} Lessons`,
              duration: c.duration || "10 Hours",
              description: c.description,
              topics: mappedTopics,
            });
          }
        }
      } catch (err) {
        console.log("Using cached course catalog for", courseId);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourse();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  // Load student progress for this course if logged in
  useEffect(() => {
    let isMounted = true;
    const fetchProgress = async () => {
      if (!token) {
        setProgressData(null);
        return;
      }
      const targetCourseId = apiCourse?._id || courseId;
      if (!targetCourseId) return;

      try {
        const res = await getCourseProgress(targetCourseId, token);
        if (isMounted && res?.progress) {
          setProgressData(res.progress);

          // Handle initial resume or deep-linked ?lesson=N
          if (!initialResumeApplied) {
            const queryLesson = searchParams.get("lesson");
            if (queryLesson !== null && !isNaN(parseInt(queryLesson, 10))) {
              const parsedIdx = parseInt(queryLesson, 10);
              if (parsedIdx >= 0) {
                setActiveTopic(parsedIdx);
              }
            } else if (
              res.progress.nextIncompleteLesson !== undefined &&
              res.progress.nextIncompleteLesson !== null
            ) {
              setActiveTopic(res.progress.nextIncompleteLesson);
            } else if (
              res.progress.lastAccessedLesson !== undefined &&
              res.progress.lastAccessedLesson !== null
            ) {
              setActiveTopic(res.progress.lastAccessedLesson);
            }
            setInitialResumeApplied(true);
          }
        }
      } catch (err) {
        // Guest or un-enrolled course - safe ignore
      }
    };

    fetchProgress();
    return () => {
      isMounted = false;
    };
  }, [courseId, apiCourse?._id, token, initialResumeApplied, searchParams]);

  const course =
    apiCourse ||
    courses[courseId] ||
    courses["python-programming-for-beginners"] ||
    courses["c-programming"];

  const currentTopic =
    (course.topics && course.topics[activeTopic]) ||
    (course.topics && course.topics[0]) || {
      title: "Introduction",
      content: "Welcome to this course.",
      points: ["Introduction"],
      codeExample: "",
    };

  const completedIndexes = progressData?.completedLessonIndexes || [];
  const isCurrentCompleted = completedIndexes.includes(activeTopic);
  const totalTopics = course.topics?.length || 1;
  const completedCount = completedIndexes.length;
  const remainingCount = Math.max(0, totalTopics - completedCount);
  const dynamicPercentage = Math.min(
    100,
    Math.round((completedCount / totalTopics) * 100)
  );

  const handleSelectTopic = (index) => {
    setActiveTopic(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (token) {
      const targetCourseId = apiCourse?._id || courseId;
      if (targetCourseId) {
        updateLastAccessedLesson(targetCourseId, index, token).catch(() => {});
      }
    }
  };

  const goNext = () => {
    if (activeTopic < course.topics.length - 1) {
      const nextIndex = activeTopic + 1;
      setActiveTopic(nextIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (token) {
        const targetCourseId = apiCourse?._id || courseId;
        if (targetCourseId) {
          updateLastAccessedLesson(targetCourseId, nextIndex, token).catch(() => {});
        }
      }
    }
  };

  const goPrevious = () => {
    if (activeTopic > 0) {
      const prevIndex = activeTopic - 1;
      setActiveTopic(prevIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (token) {
        const targetCourseId = apiCourse?._id || courseId;
        if (targetCourseId) {
          updateLastAccessedLesson(targetCourseId, prevIndex, token).catch(() => {});
        }
      }
    }
  };

  const handleToggleComplete = async () => {
    if (!token) {
      alert("Please log in to track your learning progress.");
      return;
    }
    const targetCourseId = apiCourse?._id || courseId;
    const currentTopicObj = course.topics?.[activeTopic];
    const lessonId = currentTopicObj?.id || `idx-${activeTopic}`;

    try {
      setMarkingLoading(true);
      const res = await toggleLessonCompletion(
        targetCourseId,
        {
          lessonId,
          lessonIndex: activeTopic,
          lessonTitle: currentTopic.title,
        },
        token
      );
      if (res?.progress) {
        setProgressData(res.progress);
      }
    } catch (err) {
      console.error("Failed to toggle lesson completion:", err);
    } finally {
      setMarkingLoading(false);
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
              <Link
                to="/quiz/python-fundamentals-quiz"
                style={{
                  background: "#f5f3ff",
                  color: "#6d28d9",
                  padding: "4px 12px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  textDecoration: "none",
                  border: "1px solid #ddd6fe",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                🎯 Course Quiz (20 MCQs)
              </Link>
            </div>
          </div>

          <div className="aeloria-course-progress-card">
            <div className="aeloria-course-progress-top">
              <span>Your Progress</span>
              <strong>{dynamicPercentage}%</strong>
            </div>

            <div className="aeloria-course-progress-bar">
              <span
                style={{
                  width: `${dynamicPercentage}%`,
                }}
              ></span>
            </div>

            <p>
              {completedCount} of {totalTopics} lessons completed
              {remainingCount > 0 ? ` (${remainingCount} remaining)` : " (All completed! 🎉)"}
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
                key={topic.id || topic.title || index}
                className={`aeloria-course-topic ${
                  activeTopic === index ? "active" : ""
                }`}
                onClick={() => handleSelectTopic(index)}
              >
                <span className="aeloria-course-topic-number">
                  {index + 1}
                </span>

                <span className="aeloria-course-topic-name">
                  {topic.title}
                </span>

                {completedIndexes.includes(index) && (
                  <span className="aeloria-course-topic-check" title="Lesson Completed">✓</span>
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

          <div className="aeloria-course-ai-box" style={{ marginTop: "16px", background: "#fdf4ff", borderColor: "#f5d0fe" }}>
            <span className="aeloria-course-ai-icon">🎯</span>
            <h3 style={{ color: "#701a75" }}>Course Assessment</h3>
            <p>Ready to test your skills? Take the 20-question fundamentals quiz.</p>
            <Link to="/quiz/python-fundamentals-quiz" style={{ background: "#a21caf", color: "#fff" }}>
              Take Quiz (20 MCQs) →
            </Link>
          </div>
        </aside>

        <div className="aeloria-course-content">
          <div className="aeloria-lesson-complete-bar">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  className={`aeloria-lesson-status-tag ${
                    isCurrentCompleted ? "completed" : "in-progress"
                  }`}
                >
                  {isCurrentCompleted ? "✓ Completed" : "○ In Progress"}
                </span>
                <span style={{ fontSize: "14px", color: "#475569", fontWeight: "600" }}>
                  Lesson {activeTopic + 1} of {totalTopics}
                </span>
              </div>
              <h3 style={{ margin: "4px 0 0", fontSize: "17px", color: "#1e1b4b" }}>
                {currentTopic.title}
              </h3>
            </div>

            <button
              type="button"
              className={`aeloria-lesson-complete-btn ${
                isCurrentCompleted ? "completed" : ""
              }`}
              onClick={handleToggleComplete}
              disabled={markingLoading}
            >
              {markingLoading
                ? "Updating..."
                : isCurrentCompleted
                ? "✓ Mark as Incomplete"
                : "Mark as Completed ✓"}
            </button>
          </div>

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
              {currentTopic.codeExample ? (
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    fontFamily: "Consolas, Menlo, Monaco, 'Courier New', monospace",
                    fontSize: "13.5px",
                    lineHeight: "1.65",
                    color: "#f1f5f9",
                    backgroundColor: "transparent",
                  }}
                >
                  {currentTopic.codeExample}
                </pre>
              ) : (
                <>
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

          {activeTopic === course.topics.length - 1 && (
            <div
              style={{
                marginTop: "24px",
                padding: "24px",
                background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                border: "1.5px solid #d8b4fe",
                borderRadius: "18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "0 0 6px",
                    color: "#1e1b4b",
                    fontSize: "18px",
                    fontWeight: "800",
                  }}
                >
                  🎉 Completed All Topics? Take the Assessment!
                </h3>
                <p style={{ margin: 0, color: "#4b5563", fontSize: "14px" }}>
                  Validate your skills with the 20-question Python Fundamentals Quiz and earn your score.
                </p>
              </div>

              <Link
                to="/quiz/python-fundamentals-quiz"
                style={{
                  background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
                  color: "#ffffff",
                  padding: "12px 26px",
                  borderRadius: "12px",
                  fontWeight: "800",
                  fontSize: "14px",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(109, 40, 217, 0.25)",
                }}
              >
                Start Python Quiz (20 MCQs) →
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Course;
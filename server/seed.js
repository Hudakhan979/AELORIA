const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");
const Course = require("./models/Course");
const Tutorial = require("./models/Tutorial");
const Note = require("./models/Note");
const Practice = require("./models/Practice");
const Category = require("./models/Category");
const Language = require("./models/Language");

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected for seeding");

    // =========================
    // ADMIN
    // =========================

    const adminEmail = "admin@aeloria.com";

    let admin = await User.findOne({
      email: adminEmail,
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(
        "AeloriaAdmin@2026",
        10
      );

      admin = await User.create({
        firstName: "AELORIA",
        lastName: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isActive: true,
      });

      console.log("👑 Admin created");
    } else {
      console.log("ℹ️ Admin already exists");
    }

    // =========================
    // LANGUAGES
    // =========================

    const languages = [
      {
        name: "C",
        slug: "c",
        description: "Learn C programming from fundamentals to advanced concepts.",
        icon: "C",
        category: "Programming",
        order: 1,
        status: "published",
        isFeatured: true,
      },
      {
        name: "C++",
        slug: "cpp",
        description: "Master C++ programming, OOP, STL and problem solving.",
        icon: "C++",
        category: "Programming",
        order: 2,
        status: "published",
        isFeatured: true,
      },
      {
        name: "Java",
        slug: "java",
        description: "Learn Java programming and object-oriented development.",
        icon: "☕",
        category: "Programming",
        order: 3,
        status: "published",
        isFeatured: true,
      },
      {
        name: "Python",
        slug: "python",
        description: "Learn Python programming with practical examples.",
        icon: "🐍",
        category: "Programming",
        order: 4,
        status: "published",
        isFeatured: true,
      },
      {
        name: "JavaScript",
        slug: "javascript",
        description: "Learn modern JavaScript for web development.",
        icon: "JS",
        category: "Programming",
        order: 5,
        status: "published",
        isFeatured: true,
      },
      {
        name: "MERN Stack",
        slug: "mern-stack",
        description: "Build full-stack applications using MongoDB, Express, React and Node.js.",
        icon: "M",
        category: "Web Development",
        order: 6,
        status: "published",
        isFeatured: true,
      },
      {
        name: "Angular",
        slug: "angular",
        description: "Build modern web applications using Angular.",
        icon: "A",
        category: "Web Development",
        order: 7,
        status: "published",
        isFeatured: true,
      },
      {
        name: "SQL",
        slug: "sql",
        description: "Learn databases, SQL queries and database concepts.",
        icon: "SQL",
        category: "Database",
        order: 8,
        status: "published",
        isFeatured: false,
      },
    ];

    for (const language of languages) {
      await Language.findOneAndUpdate(
        { slug: language.slug },
        language,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log("🔤 Languages seeded");

    // =========================
    // CATEGORIES
    // =========================

    const categories = [
      {
        name: "Programming",
        slug: "programming",
        description: "Programming languages and programming fundamentals.",
        icon: "💻",
        type: "programming",
        order: 1,
        status: "published",
        isFeatured: true,
      },
      {
        name: "Web Development",
        slug: "web-development",
        description: "Frontend and full-stack web development.",
        icon: "🌐",
        type: "development",
        order: 2,
        status: "published",
        isFeatured: true,
      },
      {
        name: "Data Structures",
        slug: "data-structures",
        description: "Learn important data structures and their applications.",
        icon: "🧩",
        type: "data-structures",
        order: 3,
        status: "published",
        isFeatured: true,
      },
      {
        name: "Algorithms",
        slug: "algorithms",
        description: "Learn algorithms and problem-solving techniques.",
        icon: "⚡",
        type: "data-structures",
        order: 4,
        status: "published",
        isFeatured: true,
      },
      {
        name: "AI & ML",
        slug: "ai-ml",
        description: "Explore artificial intelligence and machine learning.",
        icon: "🤖",
        type: "ai-ml",
        order: 5,
        status: "published",
        isFeatured: true,
      },
      {
        name: "Computer Science",
        slug: "cs-subjects",
        description: "Core computer science subjects and concepts.",
        icon: "📚",
        type: "cs-subject",
        order: 6,
        status: "published",
        isFeatured: true,
      },
    ];

    for (const category of categories) {
      await Category.findOneAndUpdate(
        { slug: category.slug },
        category,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log("🗂️ Categories seeded");

    // =========================
    // COURSES
    // =========================

    const courses = [
      {
        title: "Complete C Programming",
        slug: "c-programming",
        category: "C",
        language: "C",
        description:
          "Learn C programming from basics to functions, arrays, pointers and file handling.",
        level: "Beginner",
        duration: "8 Hours",
        lessonsCount: 42,
        topics: [
          "Introduction to C",
          "Variables and Data Types",
          "Operators",
          "Conditional Statements",
          "Loops",
          "Functions",
          "Arrays",
          "Pointers",
          "Structures",
          "File Handling",
        ],
        learningOutcomes: [
          "Understand C programming fundamentals",
          "Write structured C programs",
          "Work with arrays and pointers",
          "Build problem-solving skills",
        ],
        status: "published",
        isFeatured: true,
      },
      {
        title: "C++ Programming Mastery",
        slug: "cpp-programming",
        category: "C++",
        language: "C++",
        description:
          "Master C++ programming with OOP, STL, classes and problem solving.",
        level: "Beginner",
        duration: "10 Hours",
        lessonsCount: 48,
        topics: [
          "C++ Basics",
          "Functions",
          "Classes and Objects",
          "Inheritance",
          "Polymorphism",
          "STL",
          "Vectors",
          "Maps",
          "Problem Solving",
        ],
        learningOutcomes: [
          "Understand C++ fundamentals",
          "Build object-oriented programs",
          "Use STL effectively",
          "Solve programming problems",
        ],
        status: "published",
        isFeatured: true,
      },
      {
        title: "Java Programming",
        slug: "java-programming",
        category: "Java",
        language: "Java",
        description:
          "Learn Java programming, OOP, collections and exception handling.",
        level: "Intermediate",
        duration: "12 Hours",
        lessonsCount: 55,
        topics: [
          "Java Basics",
          "Variables",
          "Conditions",
          "Loops",
          "Methods",
          "Classes and Objects",
          "Inheritance",
          "Interfaces",
          "Collections",
          "Exception Handling",
        ],
        learningOutcomes: [
          "Write Java applications",
          "Understand OOP concepts",
          "Work with collections",
          "Handle exceptions",
        ],
        status: "published",
        isFeatured: true,
      },
      {
        title: "MERN Stack Development",
        slug: "mern-stack",
        category: "MERN",
        language: "MERN Stack",
        description:
          "Build full-stack web applications using MongoDB, Express, React and Node.js.",
        level: "Advanced",
        duration: "20 Hours",
        lessonsCount: 72,
        topics: [
          "HTML and CSS",
          "JavaScript",
          "React",
          "React Router",
          "Node.js",
          "Express.js",
          "MongoDB",
          "Mongoose",
          "REST APIs",
          "Authentication",
        ],
        learningOutcomes: [
          "Build modern React applications",
          "Create REST APIs",
          "Work with MongoDB",
          "Build complete MERN applications",
        ],
        status: "published",
        isFeatured: true,
      },
    ];

    for (const course of courses) {
      await Course.findOneAndUpdate(
        { slug: course.slug },
        course,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log("📚 Courses seeded");

    // =========================
    // TUTORIALS
    // =========================

    const tutorials = [
      {
        title: "JavaScript Tutorial",
        slug: "javascript",
        category: "JavaScript",
        description:
          "Learn JavaScript fundamentals, functions, objects, DOM and asynchronous programming.",
        level: "Intermediate",
        topics: [
          {
            title: "JavaScript Basics",
            content:
              "Learn variables, data types, operators and basic JavaScript syntax.",
            codeExample:
              'const name = "Aeloria";\nconsole.log(name);',
            order: 1,
          },
          {
            title: "Functions",
            content:
              "Functions allow you to organize reusable blocks of JavaScript code.",
            codeExample:
              "function add(a, b) {\n  return a + b;\n}",
            order: 2,
          },
        ],
        keyConcepts: [
          "Variables",
          "Functions",
          "Objects",
          "Arrays",
          "DOM",
          "Async JavaScript",
        ],
        status: "published",
        isFeatured: true,
      },
      {
        title: "C Programming Tutorial",
        slug: "c-programming",
        category: "C",
        description:
          "Learn C programming concepts with simple explanations and examples.",
        level: "Beginner",
        topics: [
          {
            title: "Introduction to C",
            content:
              "C is a general-purpose programming language widely used for system and application development.",
            codeExample:
              '#include <stdio.h>\n\nint main() {\n  printf("Hello Aeloria");\n  return 0;\n}',
            order: 1,
          },
        ],
        keyConcepts: [
          "Variables",
          "Data Types",
          "Conditions",
          "Loops",
          "Functions",
          "Arrays",
        ],
        status: "published",
        isFeatured: true,
      },
      {
        title: "MERN Stack Tutorial",
        slug: "mern-stack",
        category: "MERN",
        description:
          "Learn MongoDB, Express, React and Node.js for full-stack development.",
        level: "Advanced",
        topics: [
          {
            title: "MERN Introduction",
            content:
              "MERN is a JavaScript-based full-stack technology stack.",
            codeExample:
              "React + Node.js + Express + MongoDB",
            order: 1,
          },
        ],
        keyConcepts: [
          "React",
          "Node.js",
          "Express",
          "MongoDB",
          "REST APIs",
        ],
        status: "published",
        isFeatured: true,
      },
    ];

    for (const tutorial of tutorials) {
      await Tutorial.findOneAndUpdate(
        { slug: tutorial.slug },
        tutorial,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log("📖 Tutorials seeded");

    // =========================
    // NOTES
    // =========================

    const notes = [
      {
        title: "C Programming Notes",
        slug: "c-programming-notes",
        category: "C",
        language: "C",
        description:
          "Quick revision notes for C programming.",
        content:
          "C Programming Notes\n\nVariables\nData Types\nOperators\nConditions\nLoops\nFunctions\nArrays\nPointers\nStructures\nFile Handling",
        tags: [
          "C",
          "Programming",
          "Notes",
          "Revision",
        ],
        status: "published",
        isFeatured: true,
      },
      {
        title: "JavaScript Notes",
        slug: "javascript-notes",
        category: "JavaScript",
        language: "JavaScript",
        description:
          "Quick revision notes for JavaScript.",
        content:
          "JavaScript Notes\n\nVariables\nFunctions\nArrays\nObjects\nDOM\nEvents\nPromises\nAsync/Await",
        tags: [
          "JavaScript",
          "Web Development",
          "Notes",
        ],
        status: "published",
        isFeatured: true,
      },
      {
        title: "MERN Stack Notes",
        slug: "mern-stack-notes",
        category: "MERN",
        language: "MERN Stack",
        description:
          "Quick revision notes for MERN Stack development.",
        content:
          "MERN Stack Notes\n\nMongoDB\nExpress.js\nReact\nNode.js\nREST APIs\nAuthentication",
        tags: [
          "MERN",
          "React",
          "Node",
          "MongoDB",
        ],
        status: "published",
        isFeatured: true,
      },
    ];

    for (const note of notes) {
      await Note.findOneAndUpdate(
        { slug: note.slug },
        note,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log("📝 Notes seeded");

    // =========================
    // PRACTICE
    // =========================

    const practiceProblems = [
      {
        title: "Find Maximum Element",
        slug: "find-maximum-element",
        category: "Arrays",
        topic: "Arrays",
        difficulty: "Easy",
        description:
          "Given an array of numbers, find the maximum element.",
        constraints: [
          "The array contains at least one element.",
        ],
        inputFormat:
          "An array of integers.",
        outputFormat:
          "Return the maximum element.",
        exampleInput:
          "[4, 8, 2, 10, 6]",
        exampleOutput:
          "10",
        explanation:
          "Traverse the array and keep track of the largest value found.",
        supportedLanguages: [
          "C",
          "C++",
          "Java",
          "Python",
          "JavaScript",
        ],
        starterCode:
          "function findMaximum(arr) {\n  // Write your solution\n}",
        solution:
          "function findMaximum(arr) {\n  let max = arr[0];\n\n  for (const value of arr) {\n    if (value > max) {\n      max = value;\n    }\n  }\n\n  return max;\n}",
        testCases: [
          {
            input: "[4, 8, 2, 10, 6]",
            expectedOutput: "10",
            isHidden: false,
          },
          {
            input: "[-5, -2, -9]",
            expectedOutput: "-2",
            isHidden: true,
          },
        ],
        hints: [
          "Start with the first element.",
          "Compare every element with the current maximum.",
        ],
        status: "published",
        isFeatured: true,
      },
      {
        title: "Binary Search",
        slug: "binary-search",
        category: "Algorithms",
        topic: "Searching",
        difficulty: "Easy",
        description:
          "Given a sorted array and a target value, find the target using binary search.",
        constraints: [
          "The array must be sorted.",
        ],
        inputFormat:
          "A sorted array and a target value.",
        outputFormat:
          "Return the index of the target or -1.",
        exampleInput:
          "[2, 4, 6, 8, 10], target = 8",
        exampleOutput:
          "3",
        explanation:
          "Binary search repeatedly divides the search range into two halves.",
        supportedLanguages: [
          "C",
          "C++",
          "Java",
          "Python",
          "JavaScript",
        ],
        starterCode:
          "function binarySearch(arr, target) {\n  // Write your solution\n}",
        solution:
          "function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n\n    if (arr[mid] === target) {\n      return mid;\n    }\n\n    if (arr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n\n  return -1;\n}",
        testCases: [
          {
            input: "[2, 4, 6, 8, 10], 8",
            expectedOutput: "3",
            isHidden: false,
          },
        ],
        hints: [
          "Use left and right pointers.",
          "Check the middle element.",
        ],
        status: "published",
        isFeatured: true,
      },
      {
        title: "Reverse a String",
        slug: "reverse-a-string",
        category: "Strings",
        topic: "Strings",
        difficulty: "Easy",
        description:
          "Given a string, return the string in reverse order.",
        inputFormat:
          "A string.",
        outputFormat:
          "The reversed string.",
        exampleInput:
          "AELORIA",
        exampleOutput:
          "AIROLEA",
        explanation:
          "Read the characters from the end of the string to the beginning.",
        supportedLanguages: [
          "C",
          "C++",
          "Java",
          "Python",
          "JavaScript",
        ],
        starterCode:
          "function reverseString(str) {\n  // Write your solution\n}",
        solution:
          "function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
        testCases: [
          {
            input: "AELORIA",
            expectedOutput: "AIROLEA",
            isHidden: false,
          },
        ],
        hints: [
          "Think about iterating from the last character.",
        ],
        status: "published",
        isFeatured: true,
      },
    ];

    for (const problem of practiceProblems) {
      await Practice.findOneAndUpdate(
        { slug: problem.slug },
        problem,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log("💻 Practice problems seeded");

    console.log("\n🎉 AELORIA database seeded successfully!");
    console.log("\nAdmin Login:");
    console.log("Email: admin@aeloria.com");
    console.log("Password: AeloriaAdmin@2026\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
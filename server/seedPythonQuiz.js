const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Course = require("./models/Course");
const Quiz = require("./models/Quiz");

const pythonQuestions = [
  {
    order: 0,
    question: "Which of the following statements correctly describes Python?",
    options: [
      "A statically-typed, compiled language for low-level systems",
      "An interpreted, high-level, dynamically-typed programming language",
      "A styling language used strictly for browser user interfaces",
      "A database query language like SQL",
    ],
    correctAnswer: 1,
    explanation:
      "Python is an interpreted, high-level programming language known for readable syntax and dynamic typing, created by Guido van Rossum.",
  },
  {
    order: 1,
    question: "Which character is used to write single-line comments in Python?",
    options: ["//", "/*", "#", "--"],
    correctAnswer: 2,
    explanation:
      "In Python, the hash symbol `#` begins a single-line comment. Everything after `#` on that line is ignored by the interpreter.",
  },
  {
    order: 2,
    question: "What is the data type of the value returned by type(42.5) in Python?",
    options: ["<class 'int'>", "<class 'float'>", "<class 'decimal'>", "<class 'number'>"],
    correctAnswer: 1,
    explanation:
      "Numbers with fractional decimal components in Python are instances of the float data type.",
  },
  {
    order: 3,
    question: "Which of the following is an invalid variable name in Python?",
    options: ["student_age", "_counter", "2nd_player", "totalAmount"],
    correctAnswer: 2,
    explanation:
      "Variable names in Python cannot begin with a number/digit. 2nd_player starts with 2, which causes a SyntaxError.",
  },
  {
    order: 4,
    question: "What is the output of the expression 19 // 4 in Python?",
    options: ["4.75", "4", "3", "5"],
    correctAnswer: 1,
    explanation:
      "// is the floor division operator in Python. It divides two numbers and rounds down to the nearest integer, so 19 // 4 results in 4.",
  },
  {
    order: 5,
    question: "What is the result of the logical expression: not (5 > 2 and 3 == 4)?",
    options: ["False", "True", "None", "SyntaxError"],
    correctAnswer: 1,
    explanation:
      "(5 > 2 and 3 == 4) evaluates to (True and False), which is False. Negating with not produces True.",
  },
  {
    order: 6,
    question: "Which keyword is used in Python to test multiple conditions consecutively (else-if)?",
    options: ["elseif", "else if", "elif", "elsif"],
    correctAnswer: 2,
    explanation:
      "Python uses elif (short for 'else if') to chain conditional branches after an initial if statement.",
  },
  {
    order: 7,
    question: "In Python, which branch executes if x = 10 in: if x < 5: print('A') elif x == 10: print('B') else: print('C')?",
    options: ["A", "B", "C", "None of the branches"],
    correctAnswer: 1,
    explanation:
      "The first condition 10 < 5 is False. The second condition x == 10 is True, so 'B' is printed and subsequent branches are skipped.",
  },
  {
    order: 8,
    question: "What sequence of integers does range(2, 8, 2) generate in Python?",
    options: ["2, 4, 6, 8", "2, 4, 6", "2, 3, 4, 5, 6, 7", "4, 6, 8"],
    correctAnswer: 1,
    explanation:
      "range(start, stop, step) generates numbers starting at 2, incrementing by 2, and stopping before 8: 2, 4, 6.",
  },
  {
    order: 9,
    question: "Which statement immediately exits a loop regardless of the loop condition?",
    options: ["continue", "pass", "break", "return"],
    correctAnswer: 2,
    explanation:
      "The break statement immediately terminates the innermost enclosing for or while loop.",
  },
  {
    order: 10,
    question: "How do you append the value 50 to the end of a list named scores in Python?",
    options: ["scores.add(50)", "scores.insertEnd(50)", "scores.append(50)", "scores.push(50)"],
    correctAnswer: 2,
    explanation:
      "Python lists use the .append() method to add a single element to the end of the list.",
  },
  {
    order: 11,
    question: "What is the primary difference between a Python list and a Python tuple?",
    options: [
      "Lists use parentheses (), while tuples use brackets []",
      "Lists are mutable, whereas tuples are immutable",
      "Tuples cannot hold string values",
      "Lists cannot contain duplicate elements",
    ],
    correctAnswer: 1,
    explanation:
      "Lists can be modified after creation (mutable), while tuples cannot be modified once defined (immutable).",
  },
  {
    order: 12,
    question: "Which keyword is used to define a function in Python?",
    options: ["func", "function", "def", "define"],
    correctAnswer: 2,
    explanation:
      "The def keyword is used in Python to define a function, followed by the function name, parameters, and a colon.",
  },
  {
    order: 13,
    question: "What does a Python function return if it executes to the end without reaching an explicit return statement?",
    options: ["0", "False", "None", "undefined"],
    correctAnswer: 2,
    explanation:
      "In Python, if a function does not explicitly return a value with return, it implicitly returns None.",
  },
  {
    order: 14,
    question: "How do you access the value for key 'email' safely from user = {'name': 'Alex'} without raising KeyError?",
    options: ["user['email']", "user.get('email')", "user.fetch('email')", "user.find('email')"],
    correctAnswer: 1,
    explanation:
      "dict.get(key) returns None (or an optional default value) if the key is not in the dictionary, avoiding a KeyError.",
  },
  {
    order: 15,
    question: "Which method returns all key-value pairs of a dictionary as tuple pairs?",
    options: ["user.items()", "user.pairs()", "user.keys_values()", "user.entries()"],
    correctAnswer: 0,
    explanation:
      "The .items() method of a Python dictionary returns a view containing (key, value) tuple pairs.",
  },
  {
    order: 16,
    question: "What is the output of 'Python'[1:4] in Python string slicing?",
    options: ["'Pyt'", "'yth'", "'ytho'", "'pyt'"],
    correctAnswer: 1,
    explanation:
      "Slice [1:4] extracts characters from index 1 ('y') up to but not including index 4 ('h'), giving 'yth'.",
  },
  {
    order: 17,
    question: "Which string method converts all characters in a string to uppercase in Python?",
    options: ["text.toUpper()", "text.capitalize()", "text.upper()", "text.uppercase()"],
    correctAnswer: 2,
    explanation:
      "Python's str.upper() method returns a copy of the string with all cased characters converted to uppercase.",
  },
  {
    order: 18,
    question: "Which mode should you pass to the open() function to open an existing file for reading text?",
    options: ["'w'", "'a'", "'r'", "'x'"],
    correctAnswer: 2,
    explanation:
      "The 'r' mode opens a file for reading text. 'w' is for writing and 'a' is for appending.",
  },
  {
    order: 19,
    question: "Why is the 'with open(...) as file:' construct recommended for file handling in Python?",
    options: [
      "It automatically closes the file even if an exception occurs",
      "It executes file operations in an asynchronous worker thread",
      "It compresses the file automatically on the disk",
      "It converts text files into Python dictionaries automatically",
    ],
    correctAnswer: 0,
    explanation:
      "The with statement is a context manager that guarantees the file is properly and automatically closed after exiting the block, even if an error is raised.",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const course = await Course.findOne({
      $or: [
        { slug: "python-programming-for-beginners" },
        { title: /Python Programming for Beginners/i },
      ],
    });

    if (!course) {
      console.error("Course 'Python Programming for Beginners' not found!");
      process.exit(1);
    }

    console.log(`Found course: ${course.title} (${course._id})`);

    const quizData = {
      title: "Python Fundamentals Quiz",
      slug: "python-fundamentals-quiz",
      course: course._id,
      description:
        "Test your understanding of core Python concepts including variables, operators, loops, data structures, functions, and file handling.",
      difficulty: "Beginner",
      timeLimit: 20,
      passingPercentage: 60,
      marksPerQuestion: 1,
      totalMarks: pythonQuestions.length * 1,
      maxAttempts: 0, // Unlimited
      status: "published",
      questions: pythonQuestions,
    };

    let quiz = await Quiz.findOne({ slug: "python-fundamentals-quiz" });

    if (quiz) {
      console.log("Updating existing Python Fundamentals Quiz...");
      Object.assign(quiz, quizData);
      await quiz.save();
      console.log("Quiz updated successfully!");
    } else {
      console.log("Creating new Python Fundamentals Quiz...");
      quiz = new Quiz(quizData);
      await quiz.save();
      console.log("Quiz created successfully!");
    }

    console.log(`Quiz ID: ${quiz._id}`);
    console.log(`Questions Count: ${quiz.questions.length}`);
    console.log(`Status: ${quiz.status}`);
    console.log(`Passing %: ${quiz.passingPercentage}%`);
    console.log(`Time Limit: ${quiz.timeLimit} minutes`);

    await mongoose.disconnect();
    console.log("Database disconnected.");
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();

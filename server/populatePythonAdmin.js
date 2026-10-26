/**
 * Script to populate Python learning content through the existing AELORIA Admin REST API.
 * Uses Admin login credentials to obtain JWT token and calls:
 * - POST /api/courses/admin
 * - POST /api/tutorials/admin
 * - POST /api/notes/admin
 * - POST /api/practice/admin
 */

const API_BASE = "http://localhost:5000/api";

const pythonCourseData = {
  title: "Python Programming for Beginners",
  slug: "python-programming-for-beginners",
  category: "Programming",
  language: "Python",
  level: "Beginner",
  duration: "12 Hours",
  description:
    "Master Python programming from the ground up with interactive lessons, beginner-friendly explanations, live code examples, and practical exercises.",
  thumbnail:
    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80",
  topics: [
    "Introduction to Python",
    "Variables and Data Types",
    "Operators",
    "Conditional Statements",
    "Loops",
    "Lists and Tuples",
    "Functions",
    "Dictionaries",
    "Strings",
    "File Handling",
  ],
  prerequisites: [
    "No prior programming experience required",
    "Basic computer knowledge",
  ],
  learningOutcomes: [
    "Understand Python syntax, structure, and execution model",
    "Work with variables, data types, and mathematical/logical operators",
    "Control program flow using conditional branches and loops",
    "Organize and manipulate collections: lists, tuples, and dictionaries",
    "Build modular and reusable programs using functions",
    "Read from and write data to files reliably",
  ],
  status: "published",
  isFeatured: true,
  lessons: [
    {
      title: "Introduction to Python",
      duration: "15 min",
      order: 1,
      description:
        "Learn what Python is, why it is so popular, and run your very first Python program.",
      content: `### Welcome to Python!
Python is a high-level, interpreted, dynamically typed programming language created by Guido van Rossum in 1991. It emphasizes code readability and simplicity, making it one of the most beloved and beginner-friendly languages in the world.

#### Why Learn Python?
- **Readability:** Clean, English-like syntax with whitespace indentation.
- **Versatility:** Used in Web Development, Artificial Intelligence, Data Science, Automation, and Game Development.
- **Vibrant Community:** Extensive libraries and vast online support.

#### Syntax & Structure
In Python, statements do not need semicolons (;), and code blocks are defined using 4-space indentation.`,
      codeExample: `# First Python program
print("Hello, Welcome to AELORIA Python Learning!")

name = "Aeloria Student"
year = 2026
print(f"Welcome {name}! Ready to master Python in {year}?")`,
    },
    {
      title: "Variables and Data Types",
      duration: "20 min",
      order: 2,
      description:
        "Understand variables, dynamic typing, and fundamental data types like integers, floats, strings, and booleans.",
      content: `### Variables & Data Types
In Python, variables are created when you assign a value to them using the assignment operator (=). You do not declare data types explicitly.

#### Core Built-in Types:
1. **int:** Whole numbers (e.g., \`42\`, \`-7\`)
2. **float:** Real numbers with decimal points (e.g., \`3.1415\`)
3. **str:** Text wrapped in single or double quotes (e.g., \`'Python'\`)
4. **bool:** Boolean values (\`True\` or \`False\`)

#### Checking Types:
Use the \`type()\` function to inspect any variable's data type.`,
      codeExample: `# Variable declarations
user_id = 101                 # int
user_score = 98.5             # float
user_name = "Alex"            # str
is_enrolled = True            # bool

print("Type of user_id:", type(user_id))
print("Type of user_score:", type(user_score))
print(f"Student {user_name} has a score of {user_score}")`,
    },
    {
      title: "Operators",
      duration: "20 min",
      order: 3,
      description:
        "Perform calculations and evaluate conditions using arithmetic, comparison, and logical operators.",
      content: `### Operators in Python
Operators are special symbols used to perform operations on values and variables.

#### 1. Arithmetic Operators:
- Addition: \`+\`
- Subtraction: \`-\`
- Multiplication: \`*\`
- Division: \`/\` (always returns float)
- Floor Division: \`//\` (rounds down to nearest integer)
- Modulus: \`%\` (remainder after division)
- Exponentiation: \`**\`

#### 2. Comparison & Logical Operators:
- Comparison: \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`
- Logical: \`and\`, \`or\`, \`not\``,
      codeExample: `# Arithmetic
a, b = 17, 5
print(f"{a} + {b} = {a + b}")
print(f"{a} // {b} = {a // b} (Floor Division)")
print(f"{a} % {b} = {a % b} (Remainder)")
print(f"2 ** 4 = {2 ** 4} (Exponentiation)")

# Logical
has_prereq = True
passed_quiz = True
can_graduate = has_prereq and passed_quiz
print("Can Graduate:", can_graduate)`,
    },
    {
      title: "Conditional Statements",
      duration: "25 min",
      order: 4,
      description:
        "Guide program execution using if, elif, and else conditional decision-making structures.",
      content: `### Conditional Statements
Conditional statements allow your Python program to make decisions and execute different blocks of code based on whether a condition evaluates to \`True\` or \`False\`.

#### Syntax:
\`\`\`python
if condition1:
    # executed if condition1 is True
elif condition2:
    # executed if condition1 is False and condition2 is True
else:
    # executed if none of the above are True
\`\`\`

Indentation is mandatory to define the body of each conditional block.`,
      codeExample: `# Grade classification system
score = 85

if score >= 90:
    grade = "A+"
elif score >= 80:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"

print(f"Score: {score} -> Grade: {grade}")`,
    },
    {
      title: "Loops",
      duration: "25 min",
      order: 5,
      description:
        "Automate repetitive tasks using for loops, while loops, range(), and loop control statements.",
      content: `### Loops in Python
Loops allow you to iterate over sequences or repeat execution while a condition remains true.

#### 1. The \`for\` Loop:
Used for sequential iteration over iterables like lists, ranges, or strings.
\`\`\`python
for item in iterable:
    # block of code
\`\`\`

#### 2. The \`while\` Loop:
Repeats execution as long as the test condition remains \`True\`.

#### Loop Control:
- \`break\`: Exits the loop immediately.
- \`continue\`: Skips to the next iteration.`,
      codeExample: `# Iterating with range()
print("Range iteration 1 to 5:")
for num in range(1, 6):
    print(f"Step {num}: Value is {num * 10}")

# While loop with counter
countdown = 3
while countdown > 0:
    print(f"Launching in {countdown}...")
    countdown -= 1
print("Blast off! 🚀")`,
    },
    {
      title: "Lists and Tuples",
      duration: "30 min",
      order: 6,
      description:
        "Store and manipulate ordered collections of items using mutable lists and immutable tuples.",
      content: `### Lists and Tuples
Both lists and tuples store ordered sequences of values, but they have a key architectural distinction:

#### 1. Lists (\`[]\`):
- **Mutable:** Elements can be added, updated, or removed after creation.
- Methods: \`.append()\`, \`.insert()\`, \`.pop()\`, \`.sort()\`, \`.remove()\`

#### 2. Tuples (\`()\`):
- **Immutable:** Elements cannot be modified after creation.
- Perfect for fixed configurations, coordinates, and database records.`,
      codeExample: `# List operations (Mutable)
languages = ["Python", "JavaScript", "C++"]
languages.append("Go")
languages[1] = "TypeScript"
print("Updated List:", languages)
print("List length:", len(languages))

# Tuple operations (Immutable)
coordinates = (37.7749, -122.4194)
lat, lon = coordinates  # Tuple unpacking
print(f"Latitude: {lat}, Longitude: {lon}")`,
    },
    {
      title: "Functions",
      duration: "30 min",
      order: 7,
      description:
        "Write reusable, clean code using functions, default arguments, keyword arguments, and return values.",
      content: `### Functions in Python
A function is a block of organized, reusable code designed to perform a single related action.

#### Defining Functions:
Functions are declared using the \`def\` keyword:
\`\`\`python
def function_name(parameters):
    """Docstring explaining the function"""
    # code logic
    return result
\`\`\`

#### Benefits:
- Code reusability & modularity
- Easier debugging and testing
- Clear variable scoping`,
      codeExample: `# Function with default parameter & return value
def calculate_price(amount, tax_rate=0.08):
    """Calculates total price including sales tax."""
    tax = amount * tax_rate
    total = amount + tax
    return round(total, 2)

order1 = calculate_price(100.0)
order2 = calculate_price(250.0, tax_rate=0.12)
print("Order 1 Total:", order1)
print("Order 2 Total:", order2)`,
    },
    {
      title: "Dictionaries",
      duration: "25 min",
      order: 8,
      description:
        "Learn key-value mapping with Python dictionaries, including dictionary methods and iterations.",
      content: `### Dictionaries
A dictionary is an unordered (Python 3.7+ preserves insertion order), mutable collection of key-value pairs wrapped in curly braces \`{}\`.

#### Key Properties:
- Keys must be unique and immutable (strings, numbers, tuples).
- Values can be of any data type.
- Fast retrieval using hash lookups.

#### Common Methods:
- \`.get(key, default)\`: Safe retrieval without KeyError
- \`.keys()\`, \`.values()\`, \`.items()\`
- \`.update()\`: Merge dictionaries`,
      codeExample: `# Student dictionary
student = {
    "name": "Maya",
    "enrolled_course": "Python Programming",
    "completed_lessons": 8,
    "active": True
}

# Safe lookup with .get()
score = student.get("score", "Not Graded Yet")
print(f"Student: {student['name']}, Status: {score}")

# Iterating over key-value pairs
for key, value in student.items():
    print(f"  {key}: {value}")`,
    },
    {
      title: "Strings",
      duration: "25 min",
      order: 9,
      description:
        "Master string manipulation, indexing, slicing, formatting (f-strings), and built-in string methods.",
      content: `### String Operations
Strings in Python are immutable sequences of Unicode characters.

#### Indexing & Slicing:
- \`text[0]\`: First character
- \`text[-1]\`: Last character
- \`text[start:stop:step]\`: Substring slice

#### String Methods:
- \`.upper()\`, \`.lower()\`, \`.title()\`
- \`.strip()\`: Remove leading/trailing whitespace
- \`.split(delimiter)\`: Convert string to list of tokens
- \`delimiter.join(list)\`: Combine list into a string`,
      codeExample: `# String formatting and methods
title = "   aeloria python masterclass   "
clean_title = title.strip().title()
print("Cleaned Title:", clean_title)

# Slicing
word = "DEVELOPMENT"
print("Prefix:", word[:6])     # "DEVELO"
print("Reversed:", word[::-1]) # Reversed string

# Splitting and Joining
skills = "Python,SQL,Git,FastAPI"
skills_list = skills.split(",")
print("Skills Array:", skills_list)`,
    },
    {
      title: "File Handling",
      duration: "30 min",
      order: 10,
      description:
        "Read and write files safely using Python's with open() context manager and file modes.",
      content: `### File Handling
Python provides native support for opening, reading, writing, and manipulating files on disk.

#### File Modes:
- \`'r'\`: Read mode (default, file must exist)
- \`'w'\`: Write mode (creates new or truncates existing)
- \`'a'\`: Append mode (writes data to the end)
- \`'x'\`: Exclusive creation (fails if file already exists)

#### Best Practice: The \`with\` Statement
Always use the \`with open(...) as file:\` context manager. It guarantees that the file is automatically closed as soon as the execution leaves the block, even if an exception occurs!`,
      codeExample: `# Simulated safe file writing & reading
data_lines = [
    "Lesson 1: Introduction Completed\\n",
    "Lesson 2: Variables & Data Types Completed\\n",
    "Lesson 3: Operators & Expressions Completed\\n"
]

# Writing to a file
with open("learning_log.txt", "w") as file:
    file.writelines(data_lines)
    print("File written successfully.")

# Reading from a file
with open("learning_log.txt", "r") as file:
    content = file.read()
    print("File Content:\\n" + content)`,
    },
  ],
};

const pythonTutorialData = {
  title: "Python Programming Tutorial",
  slug: "python",
  category: "Programming",
  level: "Beginner",
  description:
    "Comprehensive, step-by-step Python tutorial designed for beginners. Learn syntax, data structures, functions, and file operations with practical code examples.",
  thumbnail:
    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80",
  prerequisites: [
    "No prior programming experience required",
    "A computer with internet access",
  ],
  keyConcepts: [
    "Python Syntax & Indentation",
    "Variables & Dynamic Typing",
    "Arithmetic & Logical Operators",
    "Conditional Branching",
    "For & While Loops",
    "Lists, Tuples & Dictionaries",
    "Functions & Return Values",
    "File Reading & Writing",
  ],
  status: "published",
  isFeatured: true,
  topics: [
    {
      title: "1. Introduction to Python",
      order: 1,
      content:
        "Python is a versatile, high-level programming language known for readable syntax. It is interpreted and supports both procedural and object-oriented paradigms.",
      codeExample: `print("Welcome to AELORIA Python Tutorial!")\nlanguage = "Python"\nprint(f"You are learning {language}!")`,
    },
    {
      title: "2. Variables and Data Types",
      order: 2,
      content:
        "Variables store data in memory without explicit type declaration. Python automatically assigns types such as int, float, str, and bool.",
      codeExample: `course = "Python for Beginners"\nlessons = 10\nrating = 4.9\nis_active = True\nprint(course, lessons, rating, is_active)`,
    },
    {
      title: "3. Operators",
      order: 3,
      content:
        "Python includes arithmetic (+, -, *, /, //, %, **), comparison (==, !=, >, <), and logical (and, or, not) operators for performing computations and comparisons.",
      codeExample: `a, b = 15, 4\nprint("Floor Division:", a // b)\nprint("Modulus:", a % b)\nprint("Power:", 2 ** 5)`,
    },
    {
      title: "4. Conditional Statements",
      order: 4,
      content:
        "Conditionals direct program flow using if, elif, and else statements. Python enforces clean 4-space indentation for code blocks.",
      codeExample: `num = 14\nif num % 2 == 0:\n    print(f"{num} is Even")\nelse:\n    print(f"{num} is Odd")`,
    },
    {
      title: "5. Loops",
      order: 5,
      content:
        "Loops automate repetitive logic. The for loop iterates over sequences, while the while loop runs while a condition evaluates to True.",
      codeExample: `for i in range(1, 6):\n    print(f"Square of {i} is {i * i}")`,
    },
    {
      title: "6. Lists and Tuples",
      order: 6,
      content:
        "Lists are ordered and mutable collections enclosed in brackets []. Tuples are ordered and immutable collections enclosed in parentheses ().",
      codeExample: `fruits = ["apple", "banana", "orange"]\nfruits.append("mango")\nprint("Fruits:", fruits)\n\ncoords = (10, 20)\nprint("Tuple:", coords)`,
    },
    {
      title: "7. Functions",
      order: 7,
      content:
        "Functions bundle reusable blocks of code. Define functions with the def keyword, accept parameters, and return results.",
      codeExample: `def greet(name, role="Student"):\n    return f"Welcome, {name}! ({role})"\n\nprint(greet("Aeloria Learner"))`,
    },
    {
      title: "8. Dictionaries",
      order: 8,
      content:
        "Dictionaries map unique keys to values. They offer fast lookups and methods like .get(), .keys(), and .items().",
      codeExample: `profile = {"name": "Alex", "course": "Python", "progress": 85}\nprint("Name:", profile.get("name"))\nprofile["progress"] = 100\nprint("Updated:", profile)`,
    },
    {
      title: "9. Strings",
      order: 9,
      content:
        "Strings are immutable sequences of characters. Support indexing, slicing, formatting with f-strings, and methods like .upper() and .split().",
      codeExample: `text = "aeloria python"\nprint("Title:", text.title())\nprint("Tokens:", text.split())`,
    },
    {
      title: "10. File Handling",
      order: 10,
      content:
        "Work with files using the with open() context manager, ensuring files are closed automatically upon block completion.",
      codeExample: `with open("demo.txt", "w") as f:\n    f.write("Aeloria Python Tutorial Complete!\\n")\n\nwith open("demo.txt", "r") as f:\n    print(f.read())`,
    },
  ],
};

const pythonNoteData = {
  title: "Python Programming Notes",
  slug: "python-programming-notes",
  category: "Python",
  language: "Python",
  description:
    "Comprehensive study and revision notes for Python covering fundamentals, data types, control structures, functions, collections, and file handling.",
  tags: [
    "Python",
    "Beginner",
    "Study Notes",
    "Syntax",
    "Functions",
    "Data Structures",
    "File Handling",
  ],
  status: "published",
  isFeatured: true,
  content: `## 1. Introduction to Python
Python is an interpreted, high-level, general-purpose programming language known for its emphasis on readability and clean syntax.

\`\`\`python
# Hello World
print("Hello, Python!")
\`\`\`

## 2. Variables & Built-in Data Types
Python dynamically binds types to variables based on assignment:
- **int:** Whole numbers (e.g. \`10\`, \`-5\`)
- **float:** Real numbers (e.g. \`3.14\`)
- **str:** Character sequences wrapped in quotes (e.g. \`"text"\`)
- **bool:** Boolean values (\`True\` or \`False\`)

## 3. Operators
- Arithmetic: \`+\`, \`-\`, \`*\`, \`/\`, \`//\` (floor division), \`%\` (modulus), \`**\` (exponent)
- Comparison: \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`
- Logical: \`and\`, \`or\`, \`not\`

## 4. Conditional Statements
\`\`\`python
score = 85
if score >= 90:
    print("Grade A")
elif score >= 75:
    print("Grade B")
else:
    print("Keep Practicing")
\`\`\`

## 5. Loops & Iteration
\`\`\`python
# For Loop
for i in range(1, 5):
    print("Number:", i)

# While Loop
counter = 3
while counter > 0:
    counter -= 1
\`\`\`

## 6. Lists and Tuples
- **List (Mutable):** \`items = [1, 2, 3]\` -> supports \`.append()\`, \`.pop()\`
- **Tuple (Immutable):** \`point = (10, 20)\` -> read-only sequence

## 7. Functions
\`\`\`python
def calculate_area(width, height=10):
    """Calculates rectangle area."""
    return width * height

print(calculate_area(5))
\`\`\`

## 8. Dictionaries
\`\`\`python
student = {"id": 1, "name": "Elena", "score": 95}
print(student.get("name"))
\`\`\`

## 9. Strings & Slicing
\`\`\`python
name = "Aeloria"
print(name[0:3])    # "Ael"
print(name.upper()) # "AELORIA"
\`\`\`

## 10. File Handling
\`\`\`python
# Writing and reading using context manager
with open("notes.txt", "w") as f:
    f.write("Python notes saved successfully.\\n")

with open("notes.txt", "r") as f:
    print(f.read())
\`\`\`
`,
};

const pythonPracticeProblems = [
  {
    title: "Even or Odd Number Checker",
    slug: "python-even-or-odd",
    category: "Python",
    topic: "Conditional Statements",
    difficulty: "Easy",
    description:
      "Write a Python function check_even_odd(n) that takes an integer and returns 'Even' if the number is divisible by 2, or 'Odd' if it is not.",
    constraints: ["-10^9 <= n <= 10^9"],
    inputFormat: "A single integer n",
    outputFormat: "A string: 'Even' or 'Odd'",
    exampleInput: "4",
    exampleOutput: '"Even"',
    explanation:
      "An integer is even if dividing it by 2 leaves a remainder of 0 (n % 2 == 0). Otherwise it is odd.",
    starterCode: `def check_even_odd(n):
    # Write your solution here
    if n % 2 == 0:
        return "Even"
    return "Odd"

print(check_even_odd(4))
print(check_even_odd(7))`,
    solution: `def check_even_odd(n):
    return "Even" if n % 2 == 0 else "Odd"`,
    testCases: [
      { input: "4", expectedOutput: '"Even"', isHidden: false },
      { input: "7", expectedOutput: '"Odd"', isHidden: false },
      { input: "0", expectedOutput: '"Even"', isHidden: true },
    ],
    hints: ["Use the modulus operator % to check divisibility by 2."],
    status: "published",
    isFeatured: true,
  },
  {
    title: "Sum of List Elements",
    slug: "python-sum-of-list",
    category: "Python",
    topic: "Lists and Tuples",
    difficulty: "Easy",
    description:
      "Given a list of numbers, write a function sum_of_list(numbers) that calculates and returns the sum of all elements.",
    constraints: ["0 <= len(numbers) <= 1000", "-10^4 <= numbers[i] <= 10^4"],
    inputFormat: "A list of numbers e.g. [10, 20, 30, 40]",
    outputFormat: "An integer representing the sum",
    exampleInput: "[10, 20, 30, 40]",
    exampleOutput: "100",
    explanation:
      "Iterate through the list and add each item to an accumulator total, or use Python's built-in sum().",
    starterCode: `def sum_of_list(numbers):
    total = 0
    for num in numbers:
        total += num
    return total

print(sum_of_list([10, 20, 30, 40]))`,
    solution: `def sum_of_list(numbers):
    return sum(numbers)`,
    testCases: [
      { input: "[10, 20, 30, 40]", expectedOutput: "100", isHidden: false },
      { input: "[-5, 5, 10]", expectedOutput: "10", isHidden: false },
    ],
    hints: ["A for loop can traverse each element in the list."],
    status: "published",
    isFeatured: true,
  },
  {
    title: "Character Frequency Counter",
    slug: "python-char-frequency",
    category: "Python",
    topic: "Dictionaries",
    difficulty: "Easy",
    description:
      "Given a string text, return a dictionary containing the frequency count of each character.",
    constraints: ["1 <= len(text) <= 5000"],
    inputFormat: "A string e.g. 'aeloria'",
    outputFormat: "A dictionary with characters as keys and counts as values",
    exampleInput: '"aeloria"',
    exampleOutput: "{'a': 2, 'e': 1, 'l': 1, 'o': 1, 'r': 1, 'i': 1}",
    explanation:
      "Loop through each character in text, using dict.get(char, 0) + 1 to increment the count.",
    starterCode: `def char_frequency(text):
    freq = {}
    for ch in text:
        freq[ch] = freq.get(ch, 0) + 1
    return freq

print(char_frequency("aeloria"))`,
    solution: `def char_frequency(text):
    freq = {}
    for ch in text:
        freq[ch] = freq.get(ch, 0) + 1
    return freq`,
    testCases: [
      {
        input: '"aeloria"',
        expectedOutput: "{'a': 2, 'e': 1, 'l': 1, 'o': 1, 'r': 1, 'i': 1}",
        isHidden: false,
      },
    ],
    hints: ["The dictionary .get() method helps avoid KeyErrors."],
    status: "published",
    isFeatured: true,
  },
  {
    title: "Word Count in a Sentence",
    slug: "python-word-count",
    category: "Python",
    topic: "Strings",
    difficulty: "Easy",
    description:
      "Given a sentence, write a function count_words(sentence) that returns the total count of words separated by whitespace.",
    constraints: ["0 <= len(sentence) <= 10^4"],
    inputFormat: "A sentence string",
    outputFormat: "An integer count of words",
    exampleInput: '"Learn Python with Aeloria"',
    exampleOutput: "4",
    explanation:
      "The sentence.split() method divides text into words by any whitespace sequence.",
    starterCode: `def count_words(sentence):
    words = sentence.split()
    return len(words)

print(count_words("Learn Python with Aeloria"))`,
    solution: `def count_words(sentence):
    return len(sentence.split())`,
    testCases: [
      {
        input: '"Learn Python with Aeloria"',
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: '"Code practice build"',
        expectedOutput: "3",
        isHidden: false,
      },
    ],
    hints: ["String split() method splits by whitespace by default."],
    status: "published",
    isFeatured: true,
  },
  {
    title: "Simulate File Line Counter",
    slug: "python-file-handling",
    category: "Python",
    topic: "File Handling",
    difficulty: "Medium",
    description:
      "Simulate file reading: given multi-line string content representing file data, write count_non_empty_lines(content) to return the count of non-empty lines.",
    constraints: ["0 <= len(content) <= 10^5"],
    inputFormat: "A multi-line string",
    outputFormat: "An integer representing non-empty line count",
    exampleInput: '"Line 1\\n\\nLine 2\\nLine 3\\n"',
    exampleOutput: "3",
    explanation:
      "Use .splitlines() to get each line, filter out those where line.strip() is empty, and count the rest.",
    starterCode: `def count_non_empty_lines(content):
    lines = content.splitlines()
    return len([line for line in lines if line.strip()])

sample = "Line 1\\n\\nLine 2\\nLine 3\\n"
print(count_non_empty_lines(sample))`,
    solution: `def count_non_empty_lines(content):
    return len([line for line in content.splitlines() if line.strip()])`,
    testCases: [
      {
        input: '"Line 1\\n\\nLine 2\\nLine 3\\n"',
        expectedOutput: "3",
        isHidden: false,
      },
    ],
    hints: ["Use splitlines() and strip() for whitespace trimming."],
    status: "published",
    isFeatured: true,
  },
];

async function run() {
  console.log("=== AELORIA Python Content Population via Admin API ===");

  // 1. Admin Login
  console.log("Logging in as Admin...");
  const loginRes = await fetch(`${API_BASE}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@aeloria.com",
      password: "AeloriaAdmin@2026",
    }),
  });

  const loginData = await loginRes.json();
  if (!loginData.success || !loginData.token) {
    throw new Error(`Admin login failed: ${loginData.message}`);
  }
  const token = loginData.token;
  console.log("✓ Admin authenticated successfully.");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 2. Create Python Course
  console.log("\nCreating Course: 'Python Programming for Beginners'...");
  const courseRes = await fetch(`${API_BASE}/courses/admin`, {
    method: "POST",
    headers,
    body: JSON.stringify(pythonCourseData),
  });
  const courseResult = await courseRes.json();
  if (courseRes.ok) {
    console.log("✓ Course created:", courseResult.course?.title);
  } else if (courseRes.status === 409) {
    console.log("✓ Course already exists (duplicate checked):", courseResult.message);
  } else {
    console.error("Course creation response:", courseResult);
  }

  // 3. Create Python Tutorial
  console.log("\nCreating Tutorial: 'Python Programming Tutorial'...");
  const tutRes = await fetch(`${API_BASE}/tutorials/admin`, {
    method: "POST",
    headers,
    body: JSON.stringify(pythonTutorialData),
  });
  const tutResult = await tutRes.json();
  if (tutRes.ok) {
    console.log("✓ Tutorial created:", tutResult.tutorial?.title);
  } else if (tutRes.status === 409) {
    console.log("✓ Tutorial already exists:", tutResult.message);
  } else {
    console.error("Tutorial creation response:", tutResult);
  }

  // 4. Create Python Notes
  console.log("\nCreating Note: 'Python Programming Notes'...");
  const noteRes = await fetch(`${API_BASE}/notes/admin`, {
    method: "POST",
    headers,
    body: JSON.stringify(pythonNoteData),
  });
  const noteResult = await noteRes.json();
  if (noteRes.ok) {
    console.log("✓ Note created:", noteResult.note?.title);
  } else if (noteRes.status === 409) {
    console.log("✓ Note already exists:", noteResult.message);
  } else {
    console.error("Note creation response:", noteResult);
  }

  // 5. Create Python Practice Problems
  console.log("\nCreating Python Practice Problems...");
  for (const prob of pythonPracticeProblems) {
    const probRes = await fetch(`${API_BASE}/practice/admin`, {
      method: "POST",
      headers,
      body: JSON.stringify(prob),
    });
    const probResult = await probRes.json();
    if (probRes.ok) {
      console.log(`✓ Practice Problem created: ${prob.title}`);
    } else if (probRes.status === 409) {
      console.log(`✓ Practice Problem exists: ${prob.title}`);
    } else {
      console.error(`Error for ${prob.title}:`, probResult);
    }
  }

  console.log("\n=== Content Population Finished Successfully! ===");
}

run().catch((err) => {
  console.error("Population Script Error:", err);
  process.exit(1);
});

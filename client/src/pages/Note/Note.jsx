import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getNoteById } from "../../services/api";
import "./Note.css";

function CodeSnippet({ lang, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isOutput =
    lang === "output" ||
    lang === "console" ||
    lang === "terminal" ||
    code.startsWith("Output:");

  if (isOutput) {
    const cleanOutput = code.replace(/^Output:\s*\n?/, "");
    return (
      <div className="aeloria-output-container">
        <div className="aeloria-output-header">
          <div className="aeloria-output-title-group">
            <span className="aeloria-output-terminal-icon">▶</span>
            <span className="aeloria-output-title">Program Output</span>
          </div>
          <span className="aeloria-output-status">Exit Code 0</span>
        </div>
        <pre className="aeloria-output-body">
          <code>{cleanOutput}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="aeloria-code-container">
      <div className="aeloria-code-header">
        <div className="aeloria-code-dots">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
        </div>
        <span className="aeloria-code-lang">
          {(lang || "python").toUpperCase()}
        </span>
        <button
          type="button"
          className="aeloria-code-copy-btn"
          onClick={handleCopy}
        >
          {copied ? "✓ Copied!" : "Copy Code"}
        </button>
      </div>
      <pre className="aeloria-code-body">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function parseInline(text) {
  if (!text) return "";
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="aeloria-inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function renderMarkdownContent(content) {
  if (!content) return null;

  // Split content based on fenced code blocks
  const segments = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        raw: content.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: "code",
      lang: match[1]?.toLowerCase() || "python",
      code: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({
      type: "text",
      raw: content.slice(lastIndex),
    });
  }

  return segments.map((seg, segIdx) => {
    if (seg.type === "code") {
      return (
        <CodeSnippet
          key={`code-${segIdx}`}
          lang={seg.lang}
          code={seg.code}
        />
      );
    }

    const lines = seg.raw.split("\n");
    const elements = [];
    let currentParagraph = [];
    let currentList = [];
    let lineIdx = 0;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(" ").trim();
        if (text) {
          elements.push(
            <p key={`p-${segIdx}-${lineIdx}`} className="aeloria-note-paragraph">
              {parseInline(text)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${segIdx}-${lineIdx}`} className="aeloria-note-list">
            {currentList.map((item, idx) => (
              <li key={idx}>{parseInline(item)}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      lineIdx = i;
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        flushParagraph();
        flushList();
        continue;
      }

      // Heading 2: ## Topic
      if (trimmed.startsWith("## ")) {
        flushParagraph();
        flushList();
        const headingText = trimmed.replace(/^##\s+/, "");
        elements.push(
          <h2 key={`h2-${segIdx}-${i}`} className="aeloria-note-topic-heading">
            {parseInline(headingText)}
          </h2>
        );
        continue;
      }

      // Heading 3: ### Subheading
      if (trimmed.startsWith("### ")) {
        flushParagraph();
        flushList();
        const subText = trimmed.replace(/^###\s+/, "");
        elements.push(
          <h3 key={`h3-${segIdx}-${i}`} className="aeloria-note-subheading">
            {parseInline(subText)}
          </h3>
        );
        continue;
      }

      // Heading 4: #### Subheading
      if (trimmed.startsWith("#### ")) {
        flushParagraph();
        flushList();
        const sub4Text = trimmed.replace(/^####\s+/, "");
        elements.push(
          <h4 key={`h4-${segIdx}-${i}`} className="aeloria-note-subheading-small">
            {parseInline(sub4Text)}
          </h4>
        );
        continue;
      }

      // Callout: > Note or Pro-Tip
      if (trimmed.startsWith("> ")) {
        flushParagraph();
        flushList();
        const calloutText = trimmed.replace(/^>\s+/, "");
        elements.push(
          <div key={`callout-${segIdx}-${i}`} className="aeloria-note-callout">
            <span className="aeloria-callout-icon">💡</span>
            <div>{parseInline(calloutText)}</div>
          </div>
        );
        continue;
      }

      // Bullet List item
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        flushParagraph();
        const itemText = trimmed.replace(/^[-*]\s+/, "");
        currentList.push(itemText);
        continue;
      }

      // Regular text inside paragraph
      flushList();
      currentParagraph.push(trimmed);
    }

    flushParagraph();
    flushList();

    return <React.Fragment key={`seg-${segIdx}`}>{elements}</React.Fragment>;
  });
}

const fallbackNotes = {
  "c-programming-notes": {
    title: "C Programming Notes",
    category: "C",
    language: "C",
    description:
      "Comprehensive C revision notes covering memory management, pointers, structures, recursion, and preprocessor directives.",
    content: `## 1. Fundamentals of C
C is a statically typed, procedural language that gives developers direct access to memory through pointers. 
Every C execution begins at the \`main()\` function.

\`\`\`c
#include <stdio.h>

int main(void) {
    printf("Welcome to AELORIA C Notes!\\n");
    return 0;
}
\`\`\`

## 2. Pointers & Memory Architecture
A pointer stores the memory address of another variable.
- \`&\` (Address-of operator): Retrieves the memory location.
- \`*\` (Dereference operator): Accesses the value stored at the referenced address.

\`\`\`c
int value = 42;
int *ptr = &value; // ptr holds &value
printf("Value: %d, Address: %p\\n", *ptr, (void*)ptr);
\`\`\`

## 3. Dynamic Memory Allocation
Using \`<stdlib.h>\`:
- \`malloc(size)\`: Allocates uninitialized memory.
- \`calloc(n, size)\`: Allocates zero-initialized memory.
- \`realloc(ptr, newSize)\`: Resizes previously allocated block.
- \`free(ptr)\`: Releases heap memory to prevent memory leaks.

## 4. Structures & Unions
A \`struct\` groups variables of different data types together under a single contiguous memory block:
\`\`\`c
struct Student {
    char name[50];
    int rollNumber;
    float gpa;
};
\`\`\`
`,
    tags: ["Pointers", "Memory", "Structures", "Basics", "Algorithms"],
    pdfUrl: "https://example.com/notes/c-programming.pdf",
    relatedCourse: {
      title: "Complete C Programming",
      link: "/courses/c-programming",
    },
    relatedTutorial: {
      title: "C Programming Tutorial",
      link: "/tutorials/c-programming",
    },
  },

  "javascript-notes": {
    title: "JavaScript Notes",
    category: "JavaScript",
    language: "JavaScript",
    description:
      "Core JavaScript reference notes covering closures, event loop, promises, async/await, prototypes, and ES6+ features.",
    content: `## 1. Execution Context & Hoisting
JavaScript code executes inside Execution Contexts. Variables declared with \`var\` are hoisted with \`undefined\`, whereas \`let\` and \`const\` stay in the Temporal Dead Zone (TDZ).

## 2. Closures & Scope
A closure gives you access to an outer function's scope from an inner function, preserving state across invocations:

\`\`\`javascript
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
\`\`\`

## 3. Asynchronous JavaScript & Event Loop
JavaScript is single-threaded with an event loop handling non-blocking I/O.
- **Microtask Queue**: Promises (\`then\`, \`catch\`, \`async/await\`) have higher priority.
- **Macrotask Queue**: \`setTimeout\`, \`setInterval\`, DOM events.

\`\`\`javascript
async function fetchData(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Fetch failed", err);
  }
}
\`\`\`
`,
    tags: ["Closures", "Async", "ES6", "DOM", "Event Loop"],
    pdfUrl: "https://example.com/notes/javascript-notes.pdf",
    relatedCourse: {
      title: "JavaScript Complete Guide",
      link: "/courses/javascript",
    },
    relatedTutorial: {
      title: "JavaScript Tutorial",
      link: "/tutorials/javascript",
    },
  },

  "mern-stack-notes": {
    title: "MERN Stack Notes",
    category: "MERN",
    language: "JavaScript",
    description:
      "Full-stack MERN architecture notes: MongoDB aggregation, Express middleware, React state & hooks, and Node.js REST APIs.",
    content: `## 1. MERN Architecture
MERN is a pure JavaScript full-stack application structure:
- **MongoDB**: Document-based database.
- **Express.js**: Backend web framework for HTTP routing and middleware.
- **React**: Declarative, component-driven UI library.
- **Node.js**: Cross-platform JavaScript runtime.

## 2. Express Middleware Pipeline
Express routes requests through a chain of middleware functions:
\`\`\`javascript
app.use(express.json());
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
});
\`\`\`

## 3. JWT Authentication Pattern
Authentication uses Bearer tokens stored on the client and verified via middleware on protected endpoints.
`,
    tags: ["MongoDB", "Express", "React", "Node", "Full Stack"],
    pdfUrl: "https://example.com/notes/mern-stack-notes.pdf",
    relatedCourse: {
      title: "MERN Stack Development",
      link: "/courses/mern-stack",
    },
    relatedTutorial: {
      title: "MERN Stack Tutorial",
      link: "/tutorials/mern-stack",
    },
  },

  "python-programming-notes": {
    title: "Python Programming Notes",
    category: "Python",
    language: "Python",
    description:
      "Comprehensive Python revision notes covering syntax, dynamic types, control structures, collections, functions, dictionaries, and file handling.",
    content: `## 1. Introduction to Python

Python is an interpreted, high-level, general-purpose programming language created by Guido van Rossum in 1991. It emphasizes readable, clean, and expressive code using whitespace indentation instead of braces or keywords.

### Key Concepts & Rules
- **Interpreted Execution:** Python code is processed at runtime by the CPython interpreter without a separate compilation step.
- **Dynamic Typing:** Variable types are determined automatically based on the assigned value.
- **Batteries Included:** A comprehensive standard library supporting file I/O, networking, math, JSON, and web protocols out of the box.
- **Multi-Paradigm:** Supports procedural, object-oriented, and functional programming styles.

### Practical Code Example
\`\`\`python
# First Python program in AELORIA
language_name = "Python"
version_info = "3.12"
is_awesome = True

print(f"Welcome to AELORIA {language_name} Masterclass!")
print(f"Language Version: {version_info} | Fully Supported: {is_awesome}")
\`\`\`

### Program Output
\`\`\`output
Welcome to AELORIA Python Masterclass!
Language Version: 3.12 | Fully Supported: True
\`\`\`

> Pro-Tip: Python relies strictly on 4-space indentation for defining code blocks. Never mix tabs and spaces in Python source files.


## 2. Variables and Data Types

In Python, variables are named references to memory locations that store values. You do not need to specify a type keyword (like int or String); Python automatically binds the appropriate data type at runtime.

### Key Concepts & Rules
- **int:** Represents whole numbers of unlimited precision (e.g., \`42\`, \`-105\`).
- **float:** Represents real numbers with decimal fractions (e.g., \`3.14159\`, \`-0.005\`).
- **str:** Represents immutable sequences of Unicode characters enclosed in quotes.
- **bool:** Represents binary truth values (\`True\` or \`False\`).
- **type() Function:** Inspects the runtime class of any variable.
- **Type Conversion:** Explicit casting using \`int()\`, \`float()\`, and \`str()\`.

### Practical Code Example
\`\`\`python
user_id = 1042
gpa_score = 3.92
user_name = "Elena Rostova"
is_active = True

print("User ID:", user_id, "->", type(user_id).__name__)
print("GPA Score:", gpa_score, "->", type(gpa_score).__name__)
print("Student Name:", user_name, "->", type(user_name).__name__)
print("Enrolled Status:", is_active, "->", type(is_active).__name__)

# Explicit Type Conversion
score_as_int = int(gpa_score)
print(f"Casted GPA to integer: {score_as_int}")
\`\`\`

### Program Output
\`\`\`output
User ID: 1042 -> int
GPA Score: 3.92 -> float
Student Name: Elena Rostova -> str
Enrolled Status: True -> bool
Casted GPA to integer: 3
\`\`\`

> Pro-Tip: Variable names should follow PEP 8 snake_case style (e.g. \`student_first_name\`). Constant values are written in ALL_CAPS.


## 3. Operators

Operators are special symbols used to perform computations on variables and literal values. Python features arithmetic, comparison, assignment, logical, and membership operators.

### Key Concepts & Rules
- **Arithmetic Operators:** \`+\` (addition), \`-\` (subtraction), \`*\` (multiplication), \`/\` (float division), \`//\` (floor division), \`%\` (modulus), \`**\` (exponentiation).
- **Floor Division (\`//\`):** Rounds the division result down to the nearest integer.
- **Comparison Operators:** \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\` (return boolean results).
- **Logical Operators:** \`and\` (both true), \`or\` (at least one true), \`not\` (inverts truth value).

### Practical Code Example
\`\`\`python
a = 23
b = 5

print("Addition (a + b):", a + b)
print("True Division (a / b):", a / b)
print("Floor Division (a // b):", a // b)
print("Modulus / Remainder (a % b):", a % b)
print("Power (2 ** 5):", 2 ** 5)

# Logical evaluation
has_passed = (a > 20) and (b == 5)
print("Evaluation Result (has_passed):", has_passed)
\`\`\`

### Program Output
\`\`\`output
Addition (a + b): 28
True Division (a / b): 4.6
Floor Division (a // b): 4
Modulus / Remainder (a % b): 3
Power (2 ** 5): 32
Evaluation Result (has_passed): True
\`\`\`

> Pro-Tip: The expression \`a // b\` always discards the fractional part, while \`a % b\` yields the remainder. Together, \`(b * (a // b)) + (a % b) == a\`.


## 4. Conditional Statements

Conditional statements give your program decision-making capability. Python uses \`if\`, \`elif\`, and \`else\` keywords to execute specific blocks of code depending on whether expressions evaluate to \`True\` or \`False\`.

### Key Concepts & Rules
- **if Statement:** Evaluates the initial boolean condition.
- **elif Statement:** Evaluates alternate branches sequentially if preceding conditions were false.
- **else Statement:** Serves as the fallback block when no earlier conditions match.
- **Ternary Operator:** One-line inline conditional expression: \`val = x if condition else y\`.
- **Indentation:** All nested statements must align at the same indentation level (4 spaces).

### Practical Code Example
\`\`\`python
exam_score = 86

if exam_score >= 90:
    letter_grade = "A+"
    feedback = "Outstanding achievement!"
elif exam_score >= 80:
    letter_grade = "A"
    feedback = "Excellent understanding of Python."
elif exam_score >= 70:
    letter_grade = "B"
    feedback = "Good foundation, keep practicing."
else:
    letter_grade = "C"
    feedback = "Review lesson notes and retry."

print(f"Score: {exam_score} | Grade: {letter_grade}")
print(f"Remarks: {feedback}")

# Ternary Expression
status = "Honors" if exam_score >= 85 else "Standard"
print("Academic Distinction:", status)
\`\`\`

### Program Output
\`\`\`output
Score: 86 | Grade: A
Remarks: Excellent understanding of Python.
Academic Distinction: Honors
\`\`\`

> Pro-Tip: In Python, empty collections (empty list \`[]\`, empty string \`""\`, empty dict \`{}\`), number zero \`0\`, and \`None\` evaluate to \`False\` in conditional checks.


## 5. Loops

Loops automate repetitive logic, enabling programs to iterate through items in a collection or repeat instructions until a termination condition is reached.

### Key Concepts & Rules
- **for Loop:** Iterates over items in any sequence (list, tuple, string, or range).
- **while Loop:** Repeatedly executes as long as a test condition remains \`True\`.
- **range(start, stop, step):** Generates an arithmetic progression from \`start\` up to (but excluding) \`stop\`.
- **break:** Immediately terminates the enclosing loop.
- **continue:** Skips the rest of the current iteration and jumps to the next cycle.

### Practical Code Example
\`\`\`python
# Definite iteration using range
print("Multiplication Table of 4:")
for multiplier in range(1, 6):
    product = 4 * multiplier
    print(f"  4 x {multiplier} = {product}")

# While loop with counter
countdown = 3
print("\\nCountdown Sequence:")
while countdown > 0:
    print(f"  T-minus {countdown} seconds...")
    countdown -= 1

print("  System Initialization Complete! 🚀")
\`\`\`

### Program Output
\`\`\`output
Multiplication Table of 4:
  4 x 1 = 4
  4 x 2 = 8
  4 x 3 = 12
  4 x 4 = 16
  4 x 5 = 20

Countdown Sequence:
  T-minus 3 seconds...
  T-minus 2 seconds...
  T-minus 1 seconds...
  System Initialization Complete! 🚀
\`\`\`

> Pro-Tip: Python loops support an optional \`else\` block that runs only when the loop completes naturally without hitting a \`break\` statement.


## 6. Lists and Tuples

Lists and tuples are ordered collections of values. Understanding the distinction between mutable lists and immutable tuples is a cornerstone of effective Python architecture.

### Key Concepts & Rules
- **Lists (\`[]\`):** Mutable sequences; elements can be inserted, updated, and removed after creation.
- **Tuples (\`()\`):** Immutable sequences; elements cannot be modified, reordered, or deleted once defined.
- **Zero-Based Indexing:** Access elements via \`list[0]\` (first) and negative indexing \`list[-1]\` (last).
- **Slicing:** Subsequences extracted via \`items[start:stop:step]\`.
- **Key List Methods:** \`.append()\`, \`.insert()\`, \`.pop()\`, \`.remove()\`, \`.sort()\`, \`.reverse()\`.
- **Tuple Unpacking:** Assigning tuple members directly to multiple variables in one line.

### Practical Code Example
\`\`\`python
# Working with mutable lists
languages = ["Python", "JavaScript", "C++"]
languages.append("Go")
languages[1] = "TypeScript"  # Update element
print("Modified List:", languages)
print("List Length:", len(languages))

# Working with immutable tuples
server_coordinates = (37.7749, -122.4194)
latitude, longitude = server_coordinates  # Tuple unpacking
print(f"Server Location: Latitude {latitude}, Longitude {longitude}")

# List Slicing
subset = languages[0:2]
print("Subset Slice [0:2]:", subset)
\`\`\`

### Program Output
\`\`\`output
Modified List: ['Python', 'TypeScript', 'C++', 'Go']
List Length: 4
Server Location: Latitude 37.7749, Longitude -122.4194
Subset Slice [0:2]: ['Python', 'TypeScript']
\`\`\`

> Pro-Tip: Use tuples for fixed data structures (such as database records or coordinate pairs) because they require less memory and prevent unintentional data mutation.


## 7. Functions

Functions are reusable, self-contained blocks of code designed to perform a specific task. They enhance modularity, facilitate testing, and eliminate redundant code.

### Key Concepts & Rules
- **def Keyword:** Begins the function definition, followed by function name and parameter list.
- **return Statement:** Passes calculated data back to the caller; returns \`None\` if omitted.
- **Default Arguments:** Allow callers to omit parameters while maintaining safe fallbacks.
- **Docstrings (\`"""..."""\`):** Standard multi-line comments explaining purpose, parameters, and return types.
- **Scope:** Variables defined inside a function are local to that function unless declared \`global\`.

### Practical Code Example
\`\`\`python
def calculate_invoice(subtotal, tax_rate=0.08, discount_amount=0.0):
    """
    Computes total order amount including tax and optional discount.
    """
    tax_amount = subtotal * tax_rate
    final_total = subtotal + tax_amount - discount_amount
    return round(final_total, 2)

# Calling with default parameters
order_one = calculate_invoice(100.0)
print("Standard Order Total:", order_one)

# Calling with custom keyword arguments
order_two = calculate_invoice(250.0, tax_rate=0.10, discount_amount=15.0)
print("Discounted Order Total:", order_two)
\`\`\`

### Program Output
\`\`\`output
Standard Order Total: 108.0
Discounted Order Total: 260.0
\`\`\`

> Pro-Tip: Keep functions small and focused on a single responsibility. Always document your functions with descriptive docstrings.


## 8. Dictionaries

A dictionary is an associative collection of unique key-value pairs wrapped in curly braces \`{}\`. Dictionaries provide highly optimized $O(1)$ average time complexity for lookups, insertions, and deletions.

### Key Concepts & Rules
- **Key Constraints:** Keys must be immutable and hashable (strings, numbers, or tuples).
- **Value Flexibility:** Values can be of any data type, including nested lists or other dictionaries.
- **Safe Retrieval (.get()):** Prevents unhandled \`KeyError\` exceptions by returning a default if key is absent.
- **Dictionary Methods:** \`.keys()\` (all keys), \`.values()\` (all values), \`.items()\` (key-value tuples).
- **Dynamic Updates:** Assign new pairs using \`dict[key] = value\` or \`.update()\`.

### Practical Code Example
\`\`\`python
student_profile = {
    "student_id": 2048,
    "full_name": "Maya Lin",
    "enrolled_course": "Python Programming for Beginners",
    "completed_units": 8,
    "account_active": True
}

# Safe lookup with .get()
mentor_name = student_profile.get("mentor", "Assigned on Request")
print(f"Student: {student_profile['full_name']}")
print(f"Assigned Mentor: {mentor_name}")

# Iterating over key-value pairs
print("\\nRecord Summary:")
for attribute, val in student_profile.items():
    print(f"  • {attribute}: {val}")
\`\`\`

### Program Output
\`\`\`output
Student: Maya Lin
Assigned Mentor: Assigned on Request

Record Summary:
  • student_id: 2048
  • full_name: Maya Lin
  • enrolled_course: Python Programming for Beginners
  • completed_units: 8
  • account_active: True
\`\`\`

> Pro-Tip: Always use \`dict.get(key, default)\` when accessing dynamic data (e.g. API responses or user inputs) to safeguard against unexpected missing keys.


## 9. Strings

Strings are immutable sequences of Unicode characters. Python offers a rich set of built-in string methods and formatting capabilities, making text processing fast and intuitive.

### Key Concepts & Rules
- **Immutability:** Strings cannot be modified in-place; all methods return new string instances.
- **F-Strings (\`f"..."\`):** Modern string interpolation enabling clean variable embedding and expressions.
- **Slicing & Stepping:** Extract substrings via \`string[start:stop:step]\`; reverse using \`string[::-1]\`.
- **Case Methods:** \`.upper()\`, \`.lower()\`, \`.title()\`, \`.capitalize()\`.
- **Whitespace Cleaning:** \`.strip()\`, \`.lstrip()\`, \`.rstrip()\`.
- **Tokenization:** \`.split(delimiter)\` converts string to list; \`delimiter.join(list)\` reconstructs text.

### Practical Code Example
\`\`\`python
raw_input = "   aeloria python developer track   "
cleaned = raw_input.strip().title()
print("Cleaned & Formatted:", cleaned)

# String Slicing and Reversing
keyword = "ALGORITHM"
prefix = keyword[:4]
reversed_str = keyword[::-1]
print(f"Prefix (0:4): {prefix} | Reversed: {reversed_str}")

# Tokenizing and Joining
technologies = "Python,FastAPI,Docker,PostgreSQL"
tech_list = technologies.split(",")
print("Parsed List:", tech_list)

formatted_display = " -> ".join(tech_list)
print("Joined Pipeline:", formatted_display)
\`\`\`

### Program Output
\`\`\`output
Cleaned & Formatted: Aeloria Python Developer Track
Prefix (0:4): ALGO | Reversed: MHTIROGLA
Parsed List: ['Python', 'FastAPI', 'Docker', 'PostgreSQL']
Joined Pipeline: Python -> FastAPI -> Docker -> PostgreSQL
\`\`\`

> Pro-Tip: Use f-strings for string formatting: \`f"Price: {price:.2f}"\` gives instant numerical precision formatting without messy concatenation.


## 10. File Handling

Python provides built-in mechanisms for creating, reading, updating, and closing files on disk. Using the proper context manager ensures reliable file operations without resource leaks.

### Key Concepts & Rules
- **File Modes:**
  - \`'r'\`: Read mode (default; fails if file does not exist).
  - \`'w'\`: Write mode (creates new file or truncates existing file).
  - \`'a'\`: Append mode (appends data to the end of the file).
  - \`'r+'\`: Read and write mode.
- **The with Context Manager:** Guaranteed automatic closing of the file stream when execution leaves the block, even if exceptions are raised.
- **Encoding:** Explicitly passing \`encoding="utf-8"\` prevents character corruption across different operating systems.

### Practical Code Example
\`\`\`python
# 1. Writing data using context manager
log_entries = [
    "Log Entry 01: Python course initialized\\n",
    "Log Entry 02: 10 curriculum units loaded\\n",
    "Log Entry 03: Verification passed successfully\\n"
]

with open("aeloria_study_log.txt", "w", encoding="utf-8") as file:
    file.writelines(log_entries)
    print("Successfully written 3 log entries.")

# 2. Reading data back safely
with open("aeloria_study_log.txt", "r", encoding="utf-8") as file:
    retrieved_content = file.read()

print("\\n--- Contents of aeloria_study_log.txt ---")
print(retrieved_content.strip())
\`\`\`

### Program Output
\`\`\`output
Successfully written 3 log entries.

--- Contents of aeloria_study_log.txt ---
Log Entry 01: Python course initialized
Log Entry 02: 10 curriculum units loaded
Log Entry 03: Verification passed successfully
\`\`\`

> Pro-Tip: Always use \`with open(filepath, mode, encoding="utf-8") as file:\`. Never use manual \`file.open()\` and \`file.close()\` in production code.
`,
    tags: ["Python", "Revision", "CheatSheet", "Basics", "OOP", "File Handling"],
    pdfUrl: "https://example.com/notes/python-notes.pdf",
    relatedCourse: {
      title: "Python Programming for Beginners",
      link: "/courses/python-programming-for-beginners",
    },
    relatedTutorial: {
      title: "Python Programming Tutorial",
      link: "/tutorials/python",
    },
  },
};

fallbackNotes["python-notes"] = fallbackNotes["python-programming-notes"];

function Note() {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      setLoading(true);
      try {
        const response = await getNoteById(noteId);
        if (response?.note) {
          setNote(response.note);
        } else if (fallbackNotes[noteId]) {
          setNote(fallbackNotes[noteId]);
        } else {
          // Default fallback
          const defaultKey = Object.keys(fallbackNotes)[0];
          setNote(fallbackNotes[defaultKey]);
        }
      } catch (err) {
        if (fallbackNotes[noteId]) {
          setNote(fallbackNotes[noteId]);
        } else {
          const firstKey = Object.keys(fallbackNotes)[0];
          setNote(fallbackNotes[firstKey]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId]);

  if (loading) {
    return (
      <main className="aeloria-note-page aeloria-note-loading">
        <div className="aeloria-note-spinner"></div>
        <p>Loading note details...</p>
      </main>
    );
  }

  if (!note) {
    return (
      <main className="aeloria-note-page">
        <div className="aeloria-note-container">
          <h2>Note Not Found</h2>
          <Link to="/notes" className="aeloria-note-back-btn">
            ← Back to Notes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="aeloria-note-page">
      {/* Top Bar */}
      <div className="aeloria-note-topbar">
        <div className="aeloria-note-topbar-container">
          <Link to="/notes" className="aeloria-note-back-link">
            ← All Notes
          </Link>
          <span className="aeloria-note-breadcrumb">
            Notes / {note.category} / {note.title}
          </span>
        </div>
      </div>

      <div className="aeloria-note-container">
        {/* Main Note Body */}
        <article className="aeloria-note-main">
          <header className="aeloria-note-header">
            <div className="aeloria-note-badge-row">
              <span className="aeloria-note-cat-badge">{note.category}</span>
              {note.language && (
                <span className="aeloria-note-lang-badge">{note.language}</span>
              )}
            </div>

            <h1 className="aeloria-note-title">{note.title}</h1>
            <p className="aeloria-note-description">{note.description}</p>

            <div className="aeloria-note-meta-row">
              {note.tags && note.tags.length > 0 && (
                <div className="aeloria-note-tags">
                  {note.tags.map((t) => (
                    <span key={t} className="aeloria-note-tag">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {note.pdfUrl && (
                <a
                  href={note.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aeloria-note-pdf-btn"
                >
                  📄 Download PDF Resource
                </a>
              )}
            </div>
          </header>

          <section className="aeloria-note-body">
            <div className="aeloria-note-content-markdown">
              {renderMarkdownContent(note.content)}
            </div>
          </section>

          {/* AI Helper Banner */}
          <div className="aeloria-note-ai-banner">
            <div className="aeloria-note-ai-icon">✦</div>
            <div className="aeloria-note-ai-text">
              <h3>Have doubts about these notes?</h3>
              <p>
                Ask AELORIA AI to explain any formula, code example, or concept
                from these notes step-by-step.
              </p>
            </div>
            <Link
              to={`/ai-assistant?subject=${encodeURIComponent(
                note.category
              )}&topic=${encodeURIComponent(
                note.title
              )}&course=${encodeURIComponent(note.title)}`}
              state={{
                lessonContent: note.description + "\n\n" + note.content,
                learningPoints: note.tags || [note.title],
              }}
              className="aeloria-note-ai-link"
            >
              Ask Aeloria AI →
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="aeloria-note-sidebar">
          <div className="aeloria-note-sidebar-card">
            <h3>Related Learning</h3>
            <p>Solidify your understanding with hands-on courses & tutorials.</p>

            {note.relatedCourse && (
              <div className="aeloria-note-related-item">
                <span className="related-type">Course</span>
                <h4>{note.relatedCourse.title}</h4>
                <Link to={note.relatedCourse.link}>Explore Course →</Link>
              </div>
            )}

            {note.relatedTutorial && (
              <div className="aeloria-note-related-item">
                <span className="related-type">Tutorial</span>
                <h4>{note.relatedTutorial.title}</h4>
                <Link to={note.relatedTutorial.link}>Read Tutorial →</Link>
              </div>
            )}

            <div className="aeloria-note-related-item">
              <span className="related-type">Practice</span>
              <h4>Solve DSA Problems</h4>
              <Link to="/practice">Start Practicing →</Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Note;

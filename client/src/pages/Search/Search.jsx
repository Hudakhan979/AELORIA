import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  getCourses,
  getTutorials,
  getNotes,
  getPracticeProblems,
} from "../../services/api";
import "./Search.css";

// Comprehensive fallback catalog if backend is not yet populated or offline
const FALLBACK_RESOURCES = [
  {
    id: "c-course",
    title: "Complete C Programming",
    type: "Course",
    category: "C",
    difficulty: "Beginner",
    description:
      "Learn C programming from basics to functions, arrays, pointers, memory allocation, and problem solving.",
    link: "/courses/c-programming",
  },
  {
    id: "cpp-course",
    title: "C++ Programming Mastery",
    type: "Course",
    category: "C++",
    difficulty: "Intermediate",
    description:
      "Learn object-oriented programming, STL, classes, inheritance, templates, and performance optimization.",
    link: "/courses/cpp-programming",
  },
  {
    id: "java-course",
    title: "Java Programming",
    type: "Course",
    category: "Java",
    difficulty: "Beginner",
    description:
      "Master core Java, OOP, collections, multithreading, exception handling, and programming concepts.",
    link: "/courses/java-programming",
  },
  {
    id: "mern-course",
    title: "MERN Stack Development",
    type: "Course",
    category: "MERN",
    difficulty: "Intermediate",
    description:
      "Build full-stack applications using MongoDB, Express, React, and Node.js with real-world architecture.",
    link: "/courses/mern-stack",
  },
  {
    id: "dsa-course",
    title: "Data Structures & Algorithms",
    type: "Course",
    category: "DSA",
    difficulty: "Advanced",
    description:
      "Understand important data structures and algorithms with step-by-step visualizations and problem solving.",
    link: "/courses/dsa",
  },
  {
    id: "js-course",
    title: "JavaScript Complete Guide",
    type: "Course",
    category: "JavaScript",
    difficulty: "Beginner",
    description:
      "Learn JavaScript fundamentals, ES6+, functions, DOM, promises, and asynchronous event loops.",
    link: "/courses/javascript",
  },
  {
    id: "python-course",
    title: "Python Programming",
    type: "Course",
    category: "Python",
    difficulty: "Beginner",
    description:
      "Learn Python programming from fundamentals to functions, OOP, list comprehensions, and file handling.",
    link: "/courses/python-programming",
  },
  {
    id: "angular-course",
    title: "Angular Web Development",
    type: "Course",
    category: "Angular",
    difficulty: "Intermediate",
    description:
      "Learn Angular components, services, RxJS, routing, forms, APIs, and enterprise web application development.",
    link: "/courses/angular",
  },
  {
    id: "c-tut",
    title: "C Programming Tutorial",
    type: "Tutorial",
    category: "C",
    difficulty: "Beginner",
    description:
      "Step-by-step C programming concepts with syntax breakdowns, flow diagrams, and practical examples.",
    link: "/tutorials/c-programming",
  },
  {
    id: "js-tut",
    title: "JavaScript Tutorial",
    type: "Tutorial",
    category: "JavaScript",
    difficulty: "Beginner",
    description:
      "Explore modern JavaScript concepts, closures, DOM manipulation, events, and async/await.",
    link: "/tutorials/javascript",
  },
  {
    id: "mern-tut",
    title: "MERN Stack Tutorial",
    type: "Tutorial",
    category: "MERN",
    difficulty: "Intermediate",
    description:
      "Learn MongoDB schemas, Express APIs, React state management, and Node.js backend integration.",
    link: "/tutorials/mern-stack",
  },
  {
    id: "dsa-tut",
    title: "Data Structures Tutorial",
    type: "Tutorial",
    category: "DSA",
    difficulty: "Intermediate",
    description:
      "Understand arrays, linked lists, stacks, queues, binary search trees, hashing, and graphs.",
    link: "/tutorials/data-structures",
  },
  {
    id: "web-tut",
    title: "Web Development Tutorial",
    type: "Tutorial",
    category: "Web Development",
    difficulty: "Beginner",
    description:
      "Learn HTML5 semantic markup, CSS3 layouts, responsive design, APIs, and modern frontend tooling.",
    link: "/tutorials/web-development",
  },
  {
    id: "c-pointers-note",
    title: "C Pointers & Dynamic Memory Architecture",
    type: "Note",
    category: "C",
    difficulty: "Intermediate",
    description:
      "In-depth guide covering pointer arithmetic, heap allocation with malloc/free, memory leaks, and stack frames.",
    link: "/notes/c-pointers-and-memory",
  },
  {
    id: "dsa-complexity-note",
    title: "Asymptotic Complexity & Big-O Cheat Sheet",
    type: "Note",
    category: "DSA",
    difficulty: "Beginner",
    description:
      "A quick-reference study sheet covering time & space complexity bounds for arrays, trees, heaps, and sorting algorithms.",
    link: "/notes/big-o-complexity-guide",
  },
  {
    id: "js-async-note",
    title: "JavaScript Event Loop, Microtasks & Promises",
    type: "Note",
    category: "JavaScript",
    difficulty: "Intermediate",
    description:
      "Understand how V8 executes asynchronous code: call stack, task queue, microtask queue, and Promise lifecycle.",
    link: "/notes/javascript-event-loop",
  },
  {
    id: "two-sum-prob",
    title: "Two Sum Problem",
    type: "Practice",
    category: "DSA",
    difficulty: "Easy",
    description:
      "Given an array of integers and a target, return indices of the two numbers such that they add up to target.",
    link: "/practice/two-sum",
  },
  {
    id: "palindrome-prob",
    title: "Valid Palindrome",
    type: "Practice",
    category: "DSA",
    difficulty: "Easy",
    description:
      "Determine whether a string is a palindrome, considering only alphanumeric characters and ignoring cases.",
    link: "/practice/valid-palindrome",
  },
  {
    id: "reverse-ll-prob",
    title: "Reverse a Linked List",
    type: "Practice",
    category: "DSA",
    difficulty: "Medium",
    description:
      "Reverse a singly linked list in-place and return the pointer to the new head node.",
    link: "/practice/reverse-linked-list",
  },
];

const CONTENT_TYPES = ["All", "Course", "Tutorial", "Note", "Practice"];
const POPULAR_CATEGORIES = [
  "All",
  "C",
  "C++",
  "Java",
  "Python",
  "JavaScript",
  "MERN",
  "Angular",
  "DSA",
  "Web Development",
];

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "All";
  const urlType = searchParams.get("type") || "All";

  const [searchInput, setSearchInput] = useState(urlQuery);
  const [activeQuery, setActiveQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedType, setSelectedType] = useState(urlType);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const [liveResources, setLiveResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch backend data across all resources on mount
  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        setLoading(true);

        const [coursesRes, tutorialsRes, notesRes, practiceRes] =
          await Promise.allSettled([
            getCourses(),
            getTutorials(),
            getNotes(),
            getPracticeProblems(),
          ]);

        const combined = [];

        // Parse Courses
        if (coursesRes.status === "fulfilled" && coursesRes.value) {
          const list =
            coursesRes.value.courses ||
            coursesRes.value.data ||
            (Array.isArray(coursesRes.value) ? coursesRes.value : []);

          list.forEach((item) => {
            combined.push({
              id: item._id || item.slug,
              title: item.title,
              type: "Course",
              category:
                typeof item.category === "object"
                  ? item.category?.name || "General"
                  : item.category || "General",
              difficulty: item.level || "Beginner",
              description: item.description || "Comprehensive course on AELORIA.",
              link: `/courses/${item.slug || item._id}`,
            });
          });
        }

        // Parse Tutorials
        if (tutorialsRes.status === "fulfilled" && tutorialsRes.value) {
          const list =
            tutorialsRes.value.tutorials ||
            tutorialsRes.value.data ||
            (Array.isArray(tutorialsRes.value) ? tutorialsRes.value : []);

          list.forEach((item) => {
            combined.push({
              id: item._id || item.slug,
              title: item.title,
              type: "Tutorial",
              category:
                typeof item.category === "object"
                  ? item.category?.name || "General"
                  : item.category || "General",
              difficulty: "Beginner",
              description: item.description || "In-depth tutorial guide.",
              link: `/tutorials/${item.slug || item._id}`,
            });
          });
        }

        // Parse Notes
        if (notesRes.status === "fulfilled" && notesRes.value) {
          const list =
            notesRes.value.notes ||
            notesRes.value.data ||
            (Array.isArray(notesRes.value) ? notesRes.value : []);

          list.forEach((item) => {
            combined.push({
              id: item._id || item.slug,
              title: item.title,
              type: "Note",
              category:
                typeof item.category === "object"
                  ? item.category?.name || "General"
                  : item.category || "General",
              difficulty: item.level || "Beginner",
              description: item.description || "Key study notes and technical insights.",
              link: `/notes/${item.slug || item._id}`,
            });
          });
        }

        // Parse Practice Problems
        if (practiceRes.status === "fulfilled" && practiceRes.value) {
          const list =
            practiceRes.value.problems ||
            practiceRes.value.practice ||
            practiceRes.value.data ||
            (Array.isArray(practiceRes.value) ? practiceRes.value : []);

          list.forEach((item) => {
            combined.push({
              id: item._id || item.slug,
              title: item.title,
              type: "Practice",
              category:
                typeof item.category === "object"
                  ? item.category?.name || "DSA"
                  : item.category || "DSA",
              difficulty: item.difficulty || "Medium",
              description: item.description || "Solve coding challenges with instant tests.",
              link: `/practice/${item.slug || item._id}`,
            });
          });
        }

        if (isMounted) {
          // If backend yielded resources, merge them; otherwise use fallback
          if (combined.length > 0) {
            // Deduplicate with fallback items if any share titles
            const titles = new Set(combined.map((c) => c.title.toLowerCase()));
            const nonDupeFallbacks = FALLBACK_RESOURCES.filter(
              (f) => !titles.has(f.title.toLowerCase())
            );
            setLiveResources([...combined, ...nonDupeFallbacks]);
          } else {
            setLiveResources(FALLBACK_RESOURCES);
          }
        }
      } catch (err) {
        console.error("Search fetch error:", err);
        if (isMounted) {
          setLiveResources(FALLBACK_RESOURCES);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize state when URL params change
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "All";
    const tp = searchParams.get("type") || "All";

    setSearchInput(q);
    setActiveQuery(q);
    setSelectedCategory(cat);
    setSelectedType(tp);
  }, [searchParams]);

  // Update URL parameters
  const updateUrl = (q, cat, tp) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat && cat !== "All") params.set("category", cat);
    if (tp && tp !== "All") params.set("type", tp);

    navigate(`/search?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = searchInput.trim();
    setActiveQuery(trimmed);
    updateUrl(trimmed, selectedCategory, selectedType);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    updateUrl(activeQuery, selectedCategory, type);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    updateUrl(activeQuery, category, selectedType);
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setActiveQuery("");
    setSelectedCategory("All");
    setSelectedType("All");
    setSelectedDifficulty("All");
    navigate("/search");
  };

  // Filter items
  const filteredResources = useMemo(() => {
    const query = activeQuery.toLowerCase().trim();

    return liveResources.filter((item) => {
      // Type filter
      if (selectedType !== "All" && item.type.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }

      // Category filter
      if (
        selectedCategory !== "All" &&
        !item.category.toLowerCase().includes(selectedCategory.toLowerCase())
      ) {
        return false;
      }

      // Difficulty filter
      if (
        selectedDifficulty !== "All" &&
        item.difficulty &&
        item.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()
      ) {
        return false;
      }

      // Query filter
      if (!query) return true;

      return (
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    });
  }, [liveResources, activeQuery, selectedType, selectedCategory, selectedDifficulty]);

  return (
    <main className="aeloria-search">
      {/* Hero Section */}
      <section className="aeloria-search-hero">
        <div className="aeloria-search-hero-content">
          <span className="aeloria-search-label">EXPLORE AELORIA</span>

          <h1 className="aeloria-search-title">
            Search & <span>Master.</span>
          </h1>

          <p className="aeloria-search-description">
            Discover courses, tutorials, practice challenges, and curated revision notes
            tailored for high-impact computer science learning.
          </p>

          <form className="aeloria-search-box" onSubmit={handleSearchSubmit}>
            <span className="aeloria-search-icon">🔍</span>

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search courses, tutorials, DSA problems, notes..."
              id="aeloria-search-input"
            />

            {searchInput && (
              <button
                type="button"
                className="aeloria-search-input-clear"
                onClick={() => {
                  setSearchInput("");
                  setActiveQuery("");
                  updateUrl("", selectedCategory, selectedType);
                }}
                title="Clear query"
              >
                ✕
              </button>
            )}

            <button type="submit" className="aeloria-search-submit-btn">
              Search
            </button>
          </form>

          {/* Quick Type Filter Tabs */}
          <div className="aeloria-search-type-tabs">
            {CONTENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`aeloria-search-tab ${
                  selectedType === type ? "active" : ""
                }`}
                onClick={() => handleTypeChange(type)}
              >
                {type === "All" ? "All Resources" : `${type}s`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Results Section */}
      <section className="aeloria-search-content">
        <div className="aeloria-search-controls-bar">
          <div className="aeloria-search-heading-meta">
            <span className="aeloria-search-heading-label">SEARCH RESULTS</span>
            <h2>
              {activeQuery
                ? `Results for "${activeQuery}"`
                : selectedCategory !== "All"
                ? `${selectedCategory} Resources`
                : "Explore Learning Library"}
            </h2>
          </div>

          <div className="aeloria-search-filters-group">
            {/* Category dropdown */}
            <div className="aeloria-search-filter-select-wrap">
              <label htmlFor="search-cat-select">Technology:</label>
              <select
                id="search-cat-select"
                value={selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
              >
                {POPULAR_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Tech" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty dropdown */}
            <div className="aeloria-search-filter-select-wrap">
              <label htmlFor="search-diff-select">Level:</label>
              <select
                id="search-diff-select"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner / Easy</option>
                <option value="Intermediate">Intermediate / Medium</option>
                <option value="Advanced">Advanced / Hard</option>
              </select>
            </div>

            <span className="aeloria-search-count">
              {filteredResources.length}{" "}
              {filteredResources.length === 1 ? "Result" : "Results"}
            </span>

            {(activeQuery ||
              selectedCategory !== "All" ||
              selectedType !== "All" ||
              selectedDifficulty !== "All") && (
              <button
                type="button"
                className="aeloria-search-reset-btn"
                onClick={clearAllFilters}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="aeloria-search-loading">
            <div className="aeloria-search-spinner"></div>
            <p>Searching Aeloria catalog...</p>
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="aeloria-search-grid">
            {filteredResources.map((resource) => (
              <article
                className="aeloria-search-card"
                key={`${resource.type}-${resource.id || resource.title}`}
              >
                <div className="aeloria-search-card-top">
                  <span
                    className={`aeloria-search-card-type badge-${resource.type.toLowerCase()}`}
                  >
                    {resource.type}
                  </span>

                  <div className="aeloria-search-badges-right">
                    {resource.difficulty && (
                      <span
                        className={`aeloria-search-card-difficulty diff-${resource.difficulty.toLowerCase()}`}
                      >
                        {resource.difficulty}
                      </span>
                    )}
                    <span className="aeloria-search-card-category">
                      {resource.category}
                    </span>
                  </div>
                </div>

                <h3>{resource.title}</h3>
                <p>{resource.description}</p>

                <Link to={resource.link} className="aeloria-search-card-link">
                  Open {resource.type} →
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="aeloria-search-empty">
            <div className="aeloria-search-empty-icon">🔎</div>
            <h3>No matching resources found</h3>
            <p>
              We couldn&apos;t find anything matching your search criteria. Try
              adjusting your keywords, category, or difficulty level.
            </p>
            <button type="button" onClick={clearAllFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      {/* Popular Categories Grid */}
      <section className="aeloria-search-categories">
        <div className="aeloria-search-categories-heading">
          <span>POPULAR CATEGORIES</span>
          <h2>
            Start Learning by <strong>Technology</strong>
          </h2>
        </div>

        <div className="aeloria-search-category-list">
          {[
            "C",
            "C++",
            "Java",
            "Python",
            "JavaScript",
            "MERN",
            "Angular",
            "DSA",
            "Web Development",
          ].map((category) => (
            <button
              key={category}
              type="button"
              className={`aeloria-search-category ${
                selectedCategory === category ? "active-cat" : ""
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              <span>{category}</span>
              <span className="aeloria-cat-arrow">→</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Search;
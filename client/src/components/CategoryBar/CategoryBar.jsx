import { Link } from "react-router-dom";
import "./CategoryBar.css";

function CategoryBar() {
  const categories = [
    "C",
    "C++",
    "Java",
    "Python",
    "JavaScript",
    "MERN",
    "Angular",
    "DSA",
    "Web Development",
    "AI & ML",
    "Data Science",
    "DevOps",
    "CS Subjects",
  ];

  return (
    <div className="category-bar">
      <div className="category-container">
        {categories.map((category) => (
          <Link
            to={`/search?category=${encodeURIComponent(category)}`}
            className="category-item"
            key={category}
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryBar;
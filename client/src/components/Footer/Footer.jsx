import "./Footer.css";

function Footer() {
  const footerLinks = {
    "Learn & Explore": [
      "Courses",
      "Tutorials",
      "Practice",
      "DSA",
      "Programming",
    ],
    "Development": [
      "Web Development",
      "MERN Stack",
      "AI & ML",
      "Data Science",
      "DevOps",
    ],
    "Resources": [
      "Free Notes",
      "Interview Preparation",
      "Coding Challenges",
      "Quizzes",
      "Aeloria AI",
    ],
  };

  return (
    <footer className="aeloria-footer">
      <div className="aeloria-footer-container">

        {/* Brand Section */}
        <div className="aeloria-footer-brand">
          <div className="aeloria-footer-logo">
            A
          </div>

          <h2 className="aeloria-footer-brand-name">
            AELORIA
          </h2>

          <p className="aeloria-footer-tagline">
            Learn. Practice. Build.
          </p>

          <p className="aeloria-footer-description">
            A modern learning platform for programming,
            technology, practice, and career preparation.
          </p>

          <a
            href="/ai-assistant"
            className="aeloria-footer-ai-link"
          >
            ✦ Ask Aeloria AI
          </a>
        </div>

        {/* Footer Links */}
        <div className="aeloria-footer-links-wrapper">
          {Object.entries(footerLinks).map(
            ([section, links]) => (
              <div
                className="aeloria-footer-link-section"
                key={section}
              >
                <h3 className="aeloria-footer-section-title">
                  {section}
                </h3>

                <div className="aeloria-footer-link-list">
                  {links.map((link) => (
                    <a
                      href="#"
                      className="aeloria-footer-link"
                      key={link}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="aeloria-footer-bottom">
        <div className="aeloria-footer-bottom-container">

          <p className="aeloria-footer-copyright">
            © 2026 AELORIA. All rights reserved.
          </p>

          <div className="aeloria-footer-legal-links">
            <a href="#" className="aeloria-footer-legal-link">
              Privacy Policy
            </a>

            <a href="#" className="aeloria-footer-legal-link">
              Terms of Use
            </a>

            <a href="#" className="aeloria-footer-legal-link">
              Contact
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
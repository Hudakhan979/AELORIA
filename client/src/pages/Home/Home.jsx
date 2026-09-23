import { Link } from "react-router-dom";
import "./Home.css";
import PopularCourses from "../../components/PopularCourses/PopularCourses";
import ProgrammingLanguages from "../../components/ProgrammingLanguages/ProgrammingLanguages";
import DsaPractice from "../../components/DsaPractice/DsaPractice";
import ResourcesSection from "../../components/ResourcesSection/ResourcesSection";
import AI from "../../components/AI/AI";
import Why from "../../components/Why/Why";

function Home() {
  return (
    <main className="aeloria-home">
      {/* HERO SECTION */}
      <section className="aeloria-home-hero">
        <div className="aeloria-home-hero-content">
          <div className="aeloria-home-hero-badge">
            <span className="aeloria-badge-sparkle">✦</span>
            AI-POWERED LEARNING PLATFORM
          </div>

          <h1 className="aeloria-home-hero-title">
            Learn. Practice. <span className="aeloria-gradient-text">Build.</span>
          </h1>

          <p className="aeloria-home-hero-description">
            Master programming, development, data, AI and computer science with
            structured learning and Aeloria AI.
          </p>

          <div className="aeloria-home-hero-actions">
            <Link to="/courses" className="aeloria-home-hero-primary-button">
              Explore Courses →
            </Link>

            <Link to="/practice" className="aeloria-home-hero-secondary-button">
              Start Practicing
            </Link>
          </div>

          <div className="aeloria-home-hero-stats">
            <div className="aeloria-hero-stat">
              <strong>50+</strong>
              <span>Curated Courses</span>
            </div>
            <div className="aeloria-hero-stat-sep"></div>
            <div className="aeloria-hero-stat">
              <strong>300+</strong>
              <span>Practice Problems</span>
            </div>
            <div className="aeloria-hero-stat-sep"></div>
            <div className="aeloria-hero-stat">
              <strong>24/7</strong>
              <span>AI Tutor Support</span>
            </div>
          </div>
        </div>

        {/* HERO VISUAL — LEARNING COMMAND CENTER */}
        <div className="aeloria-home-hero-visual">
          <div className="aeloria-command-center">
            {/* Top Bar */}
            <div className="aeloria-cc-header">
              <div className="aeloria-cc-brand">
                <span className="aeloria-cc-badge-icon">✦</span>
                <strong>AELORIA AI</strong>
                <span className="aeloria-cc-tag">COMMAND CENTER</span>
              </div>
              <div className="aeloria-cc-status">
                <span className="aeloria-status-dot"></span>
                <span>Online • Active</span>
              </div>
            </div>

            {/* Active Learning Module Card */}
            <div className="aeloria-cc-active-module">
              <div className="aeloria-cc-module-info">
                <span className="aeloria-cc-label">CURRENT LEARNING</span>
                <h3>C Programming</h3>
                <p>Module 4: Pointers & Dynamic Memory</p>
                <div className="aeloria-cc-topics-pills">
                  <span className="topic-pill active">Pointers</span>
                  <span className="topic-pill">Arrays</span>
                  <span className="topic-pill">Functions</span>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="aeloria-cc-progress-wrap">
                <div className="aeloria-progress-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path
                      className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle-fill"
                      strokeDasharray="72, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage">
                      72%
                    </text>
                  </svg>
                </div>
                <span className="aeloria-cc-progress-lbl">Completed</span>
              </div>
            </div>

            {/* AI Recommendation Callout */}
            <div className="aeloria-cc-recommendation">
              <div className="aeloria-cc-rec-icon">💡</div>
              <div className="aeloria-cc-rec-body">
                <div className="aeloria-cc-rec-header">
                  <strong>AI Recommendation</strong>
                  <span className="aeloria-coral-pill">Next Step</span>
                </div>
                <p>
                  &ldquo;Review pointer arithmetic before moving to dynamic struct
                  allocation.&rdquo;
                </p>
              </div>
            </div>

            {/* Code Snippet Preview */}
            <div className="aeloria-cc-code-snippet">
              <div className="aeloria-cc-code-header">
                <span className="code-lang">pointers_demo.c</span>
                <span className="code-tag">C99</span>
              </div>
              <pre>
                <code>
                  <span className="code-keyword">int</span> value = <span className="code-num">42</span>;{"\n"}
                  <span className="code-keyword">int</span> *ptr = &value;{" "}
                  <span className="code-comment">// store address</span>{"\n"}
                  printf(<span className="code-str">&quot;Value at pointer: %d\n&quot;</span>, *ptr);
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR COURSES */}
      <PopularCourses />

      {/* PROGRAMMING LANGUAGES */}
      <ProgrammingLanguages />

      {/* DSA PRACTICE */}
      <DsaPractice />

      {/* FREE RESOURCES */}
      <ResourcesSection />

      {/* AELORIA AI TEASER */}
      <AI />

      {/* WHY AELORIA */}
      <Why />
    </main>
  );
}

export default Home;
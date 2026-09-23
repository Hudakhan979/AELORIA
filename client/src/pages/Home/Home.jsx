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
      <section className="aeloria-home-hero">
        <div className="aeloria-home-hero-content">

          <span className="aeloria-home-hero-badge">
            ✦ Learn Smarter with AELORIA
          </span>

          <h1 className="aeloria-home-hero-title">
            Learn. Practice.
            <span> Build Your Future.</span>
          </h1>

          <p className="aeloria-home-hero-description">
            Master programming, development, DSA, AI, and modern
            technologies with structured learning and intelligent
            guidance.
          </p>

          <div className="aeloria-home-hero-actions">
            <a
              href="/courses"
              className="aeloria-home-hero-primary-button"
            >
              Explore Courses
            </a>

            <a
              href="/practice"
              className="aeloria-home-hero-secondary-button"
            >
              Start Practicing
            </a>
          </div>

        </div>

        <div className="aeloria-home-hero-visual">
          <div className="aeloria-home-hero-card">

            <div className="aeloria-home-hero-card-top">
              <span className="aeloria-home-hero-card-dot"></span>
              <span className="aeloria-home-hero-card-dot"></span>
              <span className="aeloria-home-hero-card-dot"></span>
            </div>

            <div className="aeloria-home-code-line">
              <span>&lt;</span>
              <strong>AELORIA</strong>
              <span>/&gt;</span>
            </div>

            <p className="aeloria-home-code-text">
              Learn → Practice → Build
            </p>

            <div className="aeloria-home-progress">
              <div className="aeloria-home-progress-label">
                <span>Your Learning Journey</span>
                <span>75%</span>
              </div>

              <div className="aeloria-home-progress-track">
                <div className="aeloria-home-progress-fill"></div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <PopularCourses/>
      <ProgrammingLanguages/>
      <DsaPractice/>
      <ResourcesSection/>
      <AI/>
      <Why/>
    </main>
  );
}


export default Home;
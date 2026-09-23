import { useState } from "react";
import { Link } from "react-router-dom";
import "./DsaPractice.css";

function DsaPractice() {
  const [activeNode, setActiveNode] = useState(0);

  const roadmapSteps = [
    {
      id: "arrays",
      title: "Arrays",
      level: "Fundamentals",
      problems: "45 Problems",
      desc: "Traversal, two pointers, prefix sums, sliding window, and Kadane's algorithm.",
      isMilestone: false,
    },
    {
      id: "strings",
      title: "Strings",
      level: "Fundamentals",
      problems: "38 Problems",
      desc: "Pattern matching, anagrams, palindromes, and rolling hash techniques.",
      isMilestone: false,
    },
    {
      id: "linked-list",
      title: "Linked Lists",
      level: "Linear Structures",
      problems: "30 Problems",
      desc: "Single & doubly linked lists, cycle detection (Floyd's), reversal, and LRU cache.",
      isMilestone: false,
    },
    {
      id: "stacks-queues",
      title: "Stacks & Queues",
      level: "Linear Structures",
      problems: "32 Problems",
      desc: "Monotonic stack, expression parsing, queue buffers, and BFS queues.",
      isMilestone: true,
      badge: "Core Milestone",
    },
    {
      id: "trees",
      title: "Trees",
      level: "Hierarchical",
      problems: "35 Problems",
      desc: "Binary trees, BST properties, LCA, DFS/BFS traversals, and Trie structures.",
      isMilestone: false,
    },
    {
      id: "graphs",
      title: "Graphs",
      level: "Non-Linear",
      problems: "32 Problems",
      desc: "Adjacency matrix, Dijkstra, topological sort, Disjoint Set Union (DSU), and Prim's.",
      isMilestone: false,
    },
    {
      id: "dynamic-programming",
      title: "Dynamic Programming",
      level: "Optimization",
      problems: "40 Problems",
      desc: "Memoization, tabulation, 0/1 knapsack, LCS, LIS, and state-machine DP.",
      isMilestone: true,
      badge: "Mastery Level",
    },
  ];

  return (
    <section className="aeloria-dsa-roadmap-section">
      <div className="aeloria-dsa-roadmap-container">
        {/* Header */}
        <div className="aeloria-dsa-roadmap-header">
          <div>
            <span className="aeloria-dsa-roadmap-label">
              INTERACTIVE CURRICULUM
            </span>

            <h2 className="aeloria-dsa-roadmap-title">
              DSA Learning <span>Roadmap</span>
            </h2>

            <p className="aeloria-dsa-roadmap-description">
              Follow a battle-tested milestone path from basic arrays to advanced dynamic
              programming with hands-on coding challenges.
            </p>
          </div>

          <Link to="/practice" className="aeloria-dsa-roadmap-cta">
            Open Problem Catalog →
          </Link>
        </div>

        {/* Interactive Stepper Roadmap */}
        <div className="aeloria-roadmap-canvas">
          {/* Connecting Line */}
          <div className="aeloria-roadmap-track-line">
            <div
              className="aeloria-roadmap-track-fill"
              style={{
                width: `${(activeNode / (roadmapSteps.length - 1)) * 100}%`,
              }}
            ></div>
          </div>

          {/* Nodes Bar */}
          <div className="aeloria-roadmap-nodes-bar">
            {roadmapSteps.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                className={`aeloria-roadmap-node-btn ${
                  idx <= activeNode ? "passed" : ""
                } ${idx === activeNode ? "active" : ""} ${
                  step.isMilestone ? "milestone" : ""
                }`}
                onClick={() => setActiveNode(idx)}
                aria-label={`Select ${step.title}`}
              >
                <div className="aeloria-node-circle">
                  {step.isMilestone ? "★" : idx + 1}
                </div>
                <span className="aeloria-node-label">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Active Step Highlight Card */}
          <div className="aeloria-roadmap-detail-card">
            <div className="aeloria-detail-left">
              <div className="aeloria-detail-tags">
                <span className="aeloria-level-tag">
                  {roadmapSteps[activeNode].level}
                </span>
                {roadmapSteps[activeNode].badge && (
                  <span className="aeloria-milestone-coral-tag">
                    ✦ {roadmapSteps[activeNode].badge}
                  </span>
                )}
                <span className="aeloria-problem-count-tag">
                  {roadmapSteps[activeNode].problems}
                </span>
              </div>

              <h3>{roadmapSteps[activeNode].title}</h3>
              <p>{roadmapSteps[activeNode].desc}</p>
            </div>

            <div className="aeloria-detail-right">
              <Link
                to={`/practice/${roadmapSteps[activeNode].id}`}
                className="aeloria-practice-now-btn"
              >
                Practice {roadmapSteps[activeNode].title} →
              </Link>
              <span className="aeloria-instant-runner-note">
                ⚡ Safe In-Browser Test Runner Included
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DsaPractice;
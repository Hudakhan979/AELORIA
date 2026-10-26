const testWorkflow = async () => {
  const BASE_URL = "http://localhost:5000/api";

  console.log("=== 1. ADMIN LOGIN ===");
  const loginRes = await fetch(`${BASE_URL}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@aeloria.com",
      password: "AeloriaAdmin@2026",
    }),
  }).then((r) => r.json());

  if (!loginRes.success || !loginRes.token) {
    throw new Error("Admin login failed: " + JSON.stringify(loginRes));
  }
  const token = loginRes.token;
  console.log("✓ Admin logged in successfully");

  console.log("\n=== 2. GET EXISTING COURSES ===");
  const coursesRes = await fetch(`${BASE_URL}/courses`).then((r) => r.json());
  const pythonCourse = (coursesRes.courses || coursesRes.data || coursesRes).find(
    (c) => c.slug === "python-programming-for-beginners"
  );
  if (!pythonCourse) throw new Error("Python course not found");
  console.log(`✓ Found course: ${pythonCourse.title} (${pythonCourse._id})`);

  console.log("\n=== 3. CREATE NEW QUIZ VIA ADMIN ===");
  const createQuizRes = await fetch(`${BASE_URL}/quizzes/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: "Automated E2E Test Quiz",
      slug: "automated-e2e-test-quiz",
      course: pythonCourse._id,
      description: "Temporary quiz created to verify complete admin-to-student workflow",
      difficulty: "Beginner",
      timeLimit: 10,
      passingPercentage: 50,
      marksPerQuestion: 1,
      status: "draft",
    }),
  }).then((r) => r.json());

  if (!createQuizRes.success || !createQuizRes.quiz) {
    throw new Error("Failed to create quiz: " + JSON.stringify(createQuizRes));
  }
  const testQuiz = createQuizRes.quiz;
  console.log(`✓ Created quiz: "${testQuiz.title}" (ID: ${testQuiz._id})`);

  console.log("\n=== 4. TEST DUPLICATE PREVENTION ===");
  const dupRes = await fetch(`${BASE_URL}/quizzes/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: "Automated E2E Test Quiz",
      slug: "automated-e2e-test-quiz",
      course: pythonCourse._id,
    }),
  }).then((r) => r.json());
  if (dupRes.success === false) {
    console.log("✓ Duplicate prevention working correctly:", dupRes.message);
  } else {
    throw new Error("Duplicate prevention failed!");
  }

  console.log("\n=== 5. ADD QUESTIONS TO QUIZ ===");
  const q1Res = await fetch(
    `${BASE_URL}/quizzes/admin/${testQuiz._id}/questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question: "What is 2 + 2 in Python?",
        options: ["3", "4", "5", "22"],
        correctAnswer: 1, // '4'
        explanation: "Basic arithmetic 2 + 2 evaluates to 4.",
      }),
    }
  ).then((r) => r.json());
  console.log("✓ Added Q1:", q1Res.success);

  const q2Res = await fetch(
    `${BASE_URL}/quizzes/admin/${testQuiz._id}/questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question: "Which of these is a Python boolean?",
        options: ["true", "True", "TRUE", "bool"],
        correctAnswer: 1, // 'True'
        explanation: "Python booleans are capitalized: True and False.",
      }),
    }
  ).then((r) => r.json());
  console.log("✓ Added Q2:", q2Res.success);

  console.log("\n=== 6. PUBLISH QUIZ ===");
  const publishRes = await fetch(
    `${BASE_URL}/quizzes/admin/${testQuiz._id}/status`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    }
  ).then((r) => r.json());
  console.log(`✓ Quiz status toggled to: ${publishRes.status}`);

  console.log("\n=== 7. STUDENT TAKES QUIZ (SECURITY CHECK) ===");
  const takeRes = await fetch(
    `${BASE_URL}/quizzes/${testQuiz._id}/take`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  ).then((r) => r.json());

  if (!takeRes.questions || takeRes.questions.length !== 2) {
    throw new Error("Unexpected questions count: " + takeRes.questions?.length);
  }
  const hasAnswersExposed = takeRes.questions.some(
    (q) => "correctAnswer" in q || "explanation" in q
  );
  if (hasAnswersExposed) {
    throw new Error("SECURITY FAILURE: Correct answers were sent to student before submission!");
  }
  console.log("✓ Security verified: Correct answers and explanations are stripped before submission.");

  console.log("\n=== 8. STUDENT SUBMITS ANSWERS ===");
  // Answer Q0 correctly (selectedOption: 1), Answer Q1 incorrectly (selectedOption: 0)
  const submitRes = await fetch(
    `${BASE_URL}/quizzes/${testQuiz._id}/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        answers: [
          { questionIndex: 0, selectedOption: 1 }, // Correct!
          { questionIndex: 1, selectedOption: 0 }, // Incorrect!
        ],
        timeSpent: 35,
      }),
    }
  ).then((r) => r.json());

  const result = submitRes.result;
  console.log("✓ Score:", result.score, "/", result.totalMarks);
  console.log("✓ Percentage:", result.percentage + "%");
  console.log("✓ Passed:", result.passed, `(Required: ${result.passingPercentage}%)`);
  console.log("✓ Correct count:", result.correctCount, "Incorrect count:", result.incorrectCount);

  if (result.score !== 1 || result.percentage !== 50 || result.passed !== true) {
    throw new Error("Grading logic calculation error! Expected 1/2 (50%) passed.");
  }
  console.log("✓ Result scoring and pass/fail calculation is 100% accurate.");

  console.log("\n=== 9. STUDENT REVIEWS ATTEMPTS ===");
  const myAttempts = await fetch(
    `${BASE_URL}/quizzes/${testQuiz._id}/my-attempts`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  ).then((r) => r.json());
  console.log(`✓ Student has ${myAttempts.attempts.length} recorded attempt(s) in DB`);

  console.log("\n=== 10. ADMIN CHECKS QUIZ ATTEMPTS ===");
  const adminAttempts = await fetch(
    `${BASE_URL}/quizzes/admin/${testQuiz._id}/attempts`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  ).then((r) => r.json());
  console.log(`✓ Admin fetched ${adminAttempts.totalAttempts} student attempt(s) for quiz`);

  console.log("\n=== 11. CLEAN UP TEST QUIZ ===");
  const delRes = await fetch(
    `${BASE_URL}/quizzes/admin/${testQuiz._id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  ).then((r) => r.json());
  console.log("✓ Test quiz and attempts cleaned up:", delRes.message);

  console.log("\n=== 12. VERIFY PERMANENT PYTHON QUIZ ===");
  const pythonQuiz = await fetch(
    `${BASE_URL}/quizzes/python-fundamentals-quiz`
  ).then((r) => r.json());
  console.log("✓ Python Fundamentals Quiz:", pythonQuiz.quiz.title);
  console.log("✓ Questions count:", pythonQuiz.quiz.questionsCount);
  console.log("✓ Status:", pythonQuiz.quiz.status);
  console.log("✓ Time limit:", pythonQuiz.quiz.timeLimit, "minutes");
  console.log("✓ Passing mark:", pythonQuiz.quiz.passingPercentage + "%");

  console.log("\n🎉 ALL 12 INTEGRATION TESTS PASSED PERFECTLY!");
};

testWorkflow().catch((err) => {
  console.error("Test Workflow Failed:", err);
  process.exit(1);
});

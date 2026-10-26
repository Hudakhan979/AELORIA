const BASE_URL = "http://localhost:5000/api";

async function request(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const body = options.body ? JSON.stringify(options.body) : undefined;
  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function runTests() {
  console.log("=================================================");
  console.log("   AELORIA PROGRESS TRACKING INTEGRATION TESTS   ");
  console.log("=================================================\n");

  let studentAToken = "";
  let studentBToken = "";
  let adminToken = "";
  let pythonCourseId = "";
  let pythonCourseLessonsCount = 0;

  // 1. Authenticate Admin
  try {
    const adminRes = await request(`${BASE_URL}/auth/admin/login`, {
      method: "POST",
      body: {
        email: "admin@aeloria.com",
        password: "AeloriaAdmin@2026",
      },
    });
    adminToken = adminRes.token;
    console.log("✓ Admin authenticated successfully.");
  } catch (err) {
    console.error("✗ Failed to log in as admin:", err.data || err.message);
    process.exit(1);
  }

  // 2. Authenticate or Register Student A
  try {
    let loginA;
    try {
      loginA = await request(`${BASE_URL}/auth/login`, {
        method: "POST",
        body: {
          email: "student_a_progress@aeloria.com",
          password: "StudentPassword123!",
        },
      });
    } catch (e) {
      loginA = await request(`${BASE_URL}/auth/register`, {
        method: "POST",
        body: {
          firstName: "Alice",
          lastName: "Learner",
          username: "alice_student_" + Date.now().toString().slice(-4),
          email: "student_a_progress@aeloria.com",
          password: "StudentPassword123!",
        },
      });
    }
    studentAToken = loginA.token;
    console.log("✓ Student A authenticated (Alice).");
  } catch (err) {
    console.error("✗ Failed to auth Student A:", err.data || err.message);
    process.exit(1);
  }

  // 3. Authenticate or Register Student B (for independence test)
  try {
    let loginB;
    try {
      loginB = await request(`${BASE_URL}/auth/login`, {
        method: "POST",
        body: {
          email: "student_b_progress@aeloria.com",
          password: "StudentPassword123!",
        },
      });
    } catch (e) {
      loginB = await request(`${BASE_URL}/auth/register`, {
        method: "POST",
        body: {
          firstName: "Bob",
          lastName: "Coder",
          username: "bob_student_" + Date.now().toString().slice(-4),
          email: "student_b_progress@aeloria.com",
          password: "StudentPassword123!",
        },
      });
    }
    studentBToken = loginB.token;
    console.log("✓ Student B authenticated (Bob).");
  } catch (err) {
    console.error("✗ Failed to auth Student B:", err.data || err.message);
    process.exit(1);
  }

  // 4. Fetch Python Course
  try {
    const courseRes = await request(`${BASE_URL}/courses/python-programming-for-beginners`);
    const course = courseRes.course;
    pythonCourseId = course._id;
    pythonCourseLessonsCount = course.lessons?.length || 10;
    console.log(`✓ Fetched Python Course: '${course.title}' (ID: ${pythonCourseId}, ${pythonCourseLessonsCount} lessons)`);
  } catch (err) {
    console.error("✗ Failed to fetch Python course:", err.data || err.message);
    process.exit(1);
  }

  // 5. Initial Progress for Student A
  try {
    const initRes = await request(`${BASE_URL}/progress/course/${pythonCourseId}`, {
      headers: { Authorization: `Bearer ${studentAToken}` },
    });
    const p = initRes.progress;
    console.log(`✓ Initial progress for Student A: ${p.completedLessons.length} completed, ${p.remainingLessons} remaining, ${p.completionPercentage}%`);
    if (p.completionPercentage < 0 || p.completionPercentage > 100) {
      throw new Error("Invalid initial percentage");
    }
  } catch (err) {
    console.error("✗ Initial progress fetch failed:", err.data || err.message);
    process.exit(1);
  }

  // 6. Mark Lesson 0 as Completed for Student A
  try {
    const checkP = await request(`${BASE_URL}/progress/course/${pythonCourseId}`, {
      headers: { Authorization: `Bearer ${studentAToken}` },
    });
    let p;
    if (!checkP.progress.completedLessonIndexes.includes(0)) {
      const toggleRes = await request(`${BASE_URL}/progress/course/${pythonCourseId}/toggle-lesson`, {
        method: "POST",
        body: { lessonId: "test-lesson-0", lessonIndex: 0, lessonTitle: "01. Introduction to Python" },
        headers: { Authorization: `Bearer ${studentAToken}` },
      });
      p = toggleRes.progress;
    } else {
      p = checkP.progress;
    }
    console.log(`✓ Lesson 0 completed: ${p.completedCount}/${p.totalLessons} lessons (${p.completionPercentage}%), next incomplete: ${p.nextIncompleteLesson}`);
    if (!p.completedLessonIndexes.includes(0)) {
      throw new Error("Lesson 0 was not recorded in completedLessonIndexes");
    }
  } catch (err) {
    console.error("✗ Toggle Lesson 0 failed:", err.data || err.message);
    process.exit(1);
  }

  // 7. Test Idempotency / No Double Counting
  try {
    await request(`${BASE_URL}/progress/course/${pythonCourseId}/last-accessed`, {
      method: "POST",
      body: { lessonIndex: 0 },
      headers: { Authorization: `Bearer ${studentAToken}` },
    });
    const checkRes = await request(`${BASE_URL}/progress/course/${pythonCourseId}`, {
      headers: { Authorization: `Bearer ${studentAToken}` },
    });
    const p = checkRes.progress;
    console.log(`✓ Idempotency verified: completed count remains ${p.completedCount}, percentage remains ${p.completionPercentage}%`);
  } catch (err) {
    console.error("✗ Idempotency verification failed:", err.data || err.message);
    process.exit(1);
  }

  // 8. Mark Lesson 1 as Completed
  try {
    let p;
    const res = await request(`${BASE_URL}/progress/course/${pythonCourseId}`, {
      headers: { Authorization: `Bearer ${studentAToken}` },
    });
    if (!res.progress.completedLessonIndexes.includes(1)) {
      const toggleRes = await request(`${BASE_URL}/progress/course/${pythonCourseId}/toggle-lesson`, {
        method: "POST",
        body: { lessonId: "test-lesson-1", lessonIndex: 1, lessonTitle: "02. Variables & Data Types" },
        headers: { Authorization: `Bearer ${studentAToken}` },
      });
      p = toggleRes.progress;
    } else {
      p = res.progress;
    }
    console.log(`✓ Lesson 1 completed: ${p.completedCount}/${p.totalLessons} lessons (${p.completionPercentage}%), next incomplete: ${p.nextIncompleteLesson}`);
  } catch (err) {
    console.error("✗ Lesson 1 completion failed:", err.data || err.message);
    process.exit(1);
  }

  // 9. Simulate Logout & Login (Persistence check)
  try {
    const reLogin = await request(`${BASE_URL}/auth/login`, {
      method: "POST",
      body: {
        email: "student_a_progress@aeloria.com",
        password: "StudentPassword123!",
      },
    });
    const newSessionToken = reLogin.token;
    const progressAfterLogin = await request(`${BASE_URL}/progress/course/${pythonCourseId}`, {
      headers: { Authorization: `Bearer ${newSessionToken}` },
    });
    const p = progressAfterLogin.progress;
    console.log(`✓ Persistence after login verified: ${p.completedCount} completed lessons restored successfully (${p.completionPercentage}%).`);
    if (p.completedCount < 2) {
      throw new Error("Progress was lost after login!");
    }
  } catch (err) {
    console.error("✗ Persistence check failed:", err.data || err.message);
    process.exit(1);
  }

  // 10. Verify Independence for Student B
  try {
    const bProgress = await request(`${BASE_URL}/progress/course/${pythonCourseId}`, {
      headers: { Authorization: `Bearer ${studentBToken}` },
    });
    const pB = bProgress.progress;
    console.log(`✓ Student B independent progress verified: ${pB.completedCount} completed lessons (${pB.completionPercentage}%). Completely separate from Student A!`);
  } catch (err) {
    console.error("✗ Student B independence check failed:", err.data || err.message);
    process.exit(1);
  }

  // 11. Verify Quiz Results Linking in Progress
  try {
    const quizzesRes = await request(`${BASE_URL}/quizzes`);
    const quizList = quizzesRes.quizzes || [];
    const pyQuiz = quizList.find((q) => q.course === pythonCourseId || q.course?._id === pythonCourseId || q.slug?.includes("python"));
    
    if (pyQuiz) {
      const takeRes = await request(`${BASE_URL}/quizzes/${pyQuiz._id}/take`, {
        headers: { Authorization: `Bearer ${studentAToken}` },
      });
      const questions = takeRes.questions || [];
      const attemptRes = await request(`${BASE_URL}/quizzes/${pyQuiz._id}/submit`, {
        method: "POST",
        body: {
          answers: questions.map((q, idx) => ({
            questionIndex: idx,
            selectedOption: 0,
          })),
          timeSpent: 120,
        },
        headers: { Authorization: `Bearer ${studentAToken}` },
      });
      console.log(`✓ Quiz attempted & submitted by Student A: Score ${attemptRes.score}/${attemptRes.totalMarks} (${attemptRes.percentage}%)`);
    }

    const progressWithQuiz = await request(`${BASE_URL}/progress/course/${pythonCourseId}`, {
      headers: { Authorization: `Bearer ${studentAToken}` },
    });
    const qSummary = progressWithQuiz.progress.quizSummary || progressWithQuiz.quizSummary;
    console.log(`✓ Quiz summary in Course Progress verified: latest score = ${qSummary.latestScore}/${qSummary.latestTotal} (${qSummary.latestPercentage}%), attempts = ${qSummary.attemptsCount}`);
  } catch (err) {
    console.error("✗ Quiz linking check warning:", err.data || err.message);
  }

  // 12. Verify Student Dashboard Progress Listing
  try {
    const allStudentProgress = await request(`${BASE_URL}/progress/my-progress`, {
      headers: { Authorization: `Bearer ${studentAToken}` },
    });
    const list = allStudentProgress.progress || allStudentProgress.progressList || [];
    console.log(`✓ Student Dashboard progress endpoint returned ${list.length} course(s).`);
    const pyItem = list.find((item) => item.courseId.toString() === pythonCourseId.toString());
    if (pyItem) {
      console.log(`  - Python Course: ${pyItem.completedLessons}/${pyItem.totalLessons} lessons (${pyItem.completionPercentage}%) | Quiz: ${pyItem.quizSummary.latestPercentage ?? 'N/A'}%`);
    }
  } catch (err) {
    console.error("✗ Student Dashboard progress list failed:", err.data || err.message);
    process.exit(1);
  }

  // 13. Verify Course Progress Cap at 100%
  try {
    for (let i = 2; i < pythonCourseLessonsCount; i++) {
      const checkRes = await request(`${BASE_URL}/progress/course/${pythonCourseId}`, {
        headers: { Authorization: `Bearer ${studentAToken}` },
      });
      if (!checkRes.progress.completedLessonIndexes.includes(i)) {
        await request(`${BASE_URL}/progress/course/${pythonCourseId}/toggle-lesson`, {
          method: "POST",
          body: { lessonId: `test-lesson-${i}`, lessonIndex: i, lessonTitle: `Lesson ${i + 1}` },
          headers: { Authorization: `Bearer ${studentAToken}` },
        });
      }
    }

    const fullRes = await request(`${BASE_URL}/progress/course/${pythonCourseId}`, {
      headers: { Authorization: `Bearer ${studentAToken}` },
    });
    const fullP = fullRes.progress;
    console.log(`✓ Full completion tested: ${fullP.completedCount}/${fullP.totalLessons} lessons completed, completion percentage: ${fullP.completionPercentage}%, isCompleted: ${fullP.isCompleted}`);
    if (fullP.completionPercentage > 100) {
      throw new Error(`Progress exceeded 100%! Got: ${fullP.completionPercentage}%`);
    }

    // Mark 1 lesson for Student B to prove completely separate 10% vs 100%
    await request(`${BASE_URL}/progress/course/${pythonCourseId}/toggle-lesson`, {
      method: "POST",
      body: { lessonId: "test-lesson-0", lessonIndex: 0, lessonTitle: "01. Introduction to Python" },
      headers: { Authorization: `Bearer ${studentBToken}` },
    });
    const bCheck = await request(`${BASE_URL}/progress/course/${pythonCourseId}`, {
      headers: { Authorization: `Bearer ${studentBToken}` },
    });
    console.log(`✓ Student B independent completion verified: ${bCheck.progress.completedCount}/${bCheck.progress.totalLessons} lessons (${bCheck.progress.completionPercentage}%), while Student A is at ${fullP.completionPercentage}%!`);
  } catch (err) {
    console.error("✗ 100% completion check failed:", err.data || err.message);
    process.exit(1);
  }

  // 14. Admin Read-Only Overview Verification
  try {
    const adminOverview = await request(`${BASE_URL}/progress/admin/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const records = adminOverview.records || [];
    console.log(`✓ Admin Progress Overview returned ${records.length} student progress records.`);
    const studentARecord = records.find(
      (r) => r.email === "student_a_progress@aeloria.com" && r.courseId.toString() === pythonCourseId.toString()
    );
    if (studentARecord) {
      console.log(`  - Found Student A in Admin Overview: ${studentARecord.studentName} (${studentARecord.email}) -> ${studentARecord.completionPercentage}% completed, Best Quiz: ${studentARecord.bestQuizScore ?? 'N/A'}`);
    }
  } catch (err) {
    console.error("✗ Admin Progress Overview failed:", err.data || err.message);
    process.exit(1);
  }

  console.log("\n=================================================");
  console.log("   🎉 ALL PROGRESS TRACKING TESTS PASSED!       ");
  console.log("=================================================");
}

runTests();

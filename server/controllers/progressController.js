const mongoose = require("mongoose");
const Progress = require("../models/Progress");
const Course = require("../models/Course");
const User = require("../models/User");
const QuizAttempt = require("../models/QuizAttempt");

// Helper to resolve Course by ID or Slug
const resolveCourse = async (courseIdentifier) => {
  if (!courseIdentifier) return null;
  const isObjectId = mongoose.Types.ObjectId.isValid(courseIdentifier);
  return Course.findOne(
    isObjectId ? { _id: courseIdentifier } : { slug: courseIdentifier }
  );
};

// Helper to determine total lessons in a course
const getCourseTotalLessons = (course) => {
  if (!course) return 0;
  if (Array.isArray(course.lessons) && course.lessons.length > 0) {
    return course.lessons.length;
  }
  if (Array.isArray(course.topics) && course.topics.length > 0) {
    return course.topics.length;
  }
  return course.lessonsCount || 0;
};

// Helper to find the next incomplete lesson index (0-based)
const getNextIncompleteIndex = (totalLessons, completedIndexes) => {
  if (totalLessons <= 0) return 0;
  const indexSet = new Set(completedIndexes || []);
  for (let i = 0; i < totalLessons; i++) {
    if (!indexSet.has(i)) {
      return i;
    }
  }
  return 0; // If all completed, resume from start or last
};

// ==========================================
// 1. GET COURSE PROGRESS FOR AUTHENTICATED STUDENT
// ==========================================
// @route   GET /api/progress/course/:courseId
// @access  Private (Student)
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await resolveCourse(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const totalLessons = getCourseTotalLessons(course);

    let progress = await Progress.findOne({
      user: userId,
      course: course._id,
    });

    // If progress doesn't exist yet, return clean initial state
    if (!progress) {
      // Check quiz attempts for this course
      const attempts = await QuizAttempt.find({
        user: userId,
        course: course._id,
      }).sort({ submittedAt: -1 });

      const latestQuiz = attempts.length > 0 ? attempts[0] : null;
      let bestQuiz = null;
      if (attempts.length > 0) {
        bestQuiz = attempts.reduce((best, cur) =>
          cur.percentage > (best ? best.percentage : -1) ? cur : best
        );
      }

      return res.json({
        success: true,
        progress: {
          courseId: course._id,
          courseSlug: course.slug,
          courseTitle: course.title,
          completedLessons: [],
          completedLessonIndexes: [],
          completedCount: 0,
          totalLessons,
          remainingLessons: totalLessons,
          completionPercentage: 0,
          isCompleted: false,
          lastAccessedLesson: 0,
          nextIncompleteLesson: 0,
        },
        quizSummary: {
          attemptsCount: attempts.length,
          latestQuizScore: latestQuiz
            ? {
                score: latestQuiz.score,
                totalMarks: latestQuiz.totalMarks || latestQuiz.totalQuestions,
                percentage: latestQuiz.percentage,
                passed: latestQuiz.passed,
                submittedAt: latestQuiz.submittedAt,
              }
            : null,
          bestQuizScore: bestQuiz
            ? {
                score: bestQuiz.score,
                totalMarks: bestQuiz.totalMarks || bestQuiz.totalQuestions,
                percentage: bestQuiz.percentage,
                passed: bestQuiz.passed,
                submittedAt: bestQuiz.submittedAt,
              }
            : null,
        },
      });
    }

    // Safely reconcile completed lessons with current course lesson data
    const validIndexes = (progress.completedLessonIndexes || []).filter(
      (idx) => typeof idx === "number" && idx >= 0 && idx < totalLessons
    );
    const uniqueIndexes = Array.from(new Set(validIndexes));
    const completedCount = uniqueIndexes.length;
    const remainingLessons = Math.max(0, totalLessons - completedCount);
    const completionPercentage =
      totalLessons > 0
        ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
        : 0;

    const nextIncompleteLesson = getNextIncompleteIndex(
      totalLessons,
      uniqueIndexes
    );

    // Fetch quiz attempts
    const attempts = await QuizAttempt.find({
      user: userId,
      course: course._id,
    }).sort({ submittedAt: -1 });

    const latestQuiz = attempts.length > 0 ? attempts[0] : null;
    let bestQuiz = null;
    if (attempts.length > 0) {
      bestQuiz = attempts.reduce((best, cur) =>
        cur.percentage > (best ? best.percentage : -1) ? cur : best
      );
    }

    const qSummary = {
      attemptsCount: attempts.length,
      latestScore: latestQuiz ? latestQuiz.score : null,
      latestTotal: latestQuiz ? (latestQuiz.totalMarks || latestQuiz.totalQuestions) : null,
      latestPercentage: latestQuiz ? latestQuiz.percentage : null,
      latestPassed: latestQuiz ? latestQuiz.passed : null,
      bestScore: bestQuiz ? bestQuiz.score : null,
      bestTotal: bestQuiz ? (bestQuiz.totalMarks || bestQuiz.totalQuestions) : null,
      bestPercentage: bestQuiz ? bestQuiz.percentage : null,
      bestPassed: bestQuiz ? bestQuiz.passed : null,
      latestQuizScore: latestQuiz
        ? {
            score: latestQuiz.score,
            totalMarks: latestQuiz.totalMarks || latestQuiz.totalQuestions,
            percentage: latestQuiz.percentage,
            passed: latestQuiz.passed,
            submittedAt: latestQuiz.submittedAt,
          }
        : null,
      bestQuizScore: bestQuiz
        ? {
            score: bestQuiz.score,
            totalMarks: bestQuiz.totalMarks || bestQuiz.totalQuestions,
            percentage: bestQuiz.percentage,
            passed: bestQuiz.passed,
            submittedAt: bestQuiz.submittedAt,
          }
        : null,
    };

    res.json({
      success: true,
      progress: {
        _id: progress._id,
        courseId: course._id,
        courseSlug: course.slug,
        courseTitle: course.title,
        completedLessons: progress.completedLessons || [],
        completedLessonIndexes: uniqueIndexes,
        completedCount,
        totalLessons,
        remainingLessons,
        completionPercentage,
        isCompleted: completionPercentage === 100,
        lastAccessedLesson: progress.lastAccessedLesson || 0,
        nextIncompleteLesson,
        lastActivityAt: progress.lastActivityAt,
        quizSummary: qSummary,
      },
      quizSummary: qSummary,
    });
  } catch (error) {
    console.error("getCourseProgress Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch course progress",
    });
  }
};

// ==========================================
// 2. TOGGLE OR MARK LESSON COMPLETED
// ==========================================
// @route   POST /api/progress/course/:courseId/toggle-lesson
// @access  Private (Student)
const toggleLessonCompletion = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId, lessonIndex, completed } = req.body;
    const userId = req.user._id;

    const course = await resolveCourse(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const totalLessons = getCourseTotalLessons(course);
    const targetIndex = Number(lessonIndex);

    if (isNaN(targetIndex) || targetIndex < 0 || (totalLessons > 0 && targetIndex >= totalLessons)) {
      return res.status(400).json({
        success: false,
        message: `Invalid lesson index: ${lessonIndex}`,
      });
    }

    // Find or create progress document atomically
    let progress = await Progress.findOne({
      user: userId,
      course: course._id,
    });

    if (!progress) {
      progress = new Progress({
        user: userId,
        course: course._id,
        completedLessons: [],
        completedLessonIndexes: [],
        lastAccessedLesson: targetIndex,
      });
    }

    // Determine completion status
    const currentIndexes = new Set(progress.completedLessonIndexes || []);
    const currentLessonIds = new Set(progress.completedLessons || []);

    const isCurrentlyCompleted = currentIndexes.has(targetIndex);
    const shouldComplete =
      typeof completed === "boolean" ? completed : !isCurrentlyCompleted;

    if (shouldComplete) {
      currentIndexes.add(targetIndex);
      if (lessonId) currentLessonIds.add(String(lessonId));
    } else {
      currentIndexes.delete(targetIndex);
      if (lessonId) currentLessonIds.delete(String(lessonId));
    }

    // Reconcile and calculate
    const uniqueIndexes = Array.from(currentIndexes).filter(
      (idx) => idx >= 0 && idx < totalLessons
    );
    const completedCount = uniqueIndexes.length;
    const remainingLessons = Math.max(0, totalLessons - completedCount);
    const completionPercentage =
      totalLessons > 0
        ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
        : 0;
    const isCompleted = completionPercentage === 100;

    progress.completedLessons = Array.from(currentLessonIds);
    progress.completedLessonIndexes = uniqueIndexes;
    progress.completedCount = completedCount;
    progress.totalLessons = totalLessons;
    progress.remainingLessons = remainingLessons;
    progress.completionPercentage = completionPercentage;
    progress.isCompleted = isCompleted;
    progress.lastAccessedLesson = targetIndex;
    progress.lastActivityAt = new Date();

    await progress.save();

    // Update User enrolled/completed courses
    if (isCompleted) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          enrolledCourses: course._id,
          completedCourses: course._id,
        },
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { enrolledCourses: course._id },
        $pull: { completedCourses: course._id },
      });
    }

    const nextIncompleteLesson = getNextIncompleteIndex(
      totalLessons,
      uniqueIndexes
    );

    res.json({
      success: true,
      message: shouldComplete
        ? "Lesson marked as completed! 🎉"
        : "Lesson marked as incomplete.",
      progress: {
        _id: progress._id,
        courseId: course._id,
        courseSlug: course.slug,
        courseTitle: course.title,
        completedLessons: progress.completedLessons,
        completedLessonIndexes: uniqueIndexes,
        completedCount,
        totalLessons,
        remainingLessons,
        completionPercentage,
        isCompleted,
        lastAccessedLesson: targetIndex,
        nextIncompleteLesson,
        lastActivityAt: progress.lastActivityAt,
      },
    });
  } catch (error) {
    console.error("toggleLessonCompletion Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update lesson completion",
    });
  }
};

// ==========================================
// 3. UPDATE LAST ACCESSED LESSON
// ==========================================
// @route   POST /api/progress/course/:courseId/last-accessed
// @access  Private (Student)
const updateLastAccessedLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonIndex } = req.body;
    const userId = req.user._id;

    const course = await resolveCourse(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const targetIndex = Number(lessonIndex) || 0;
    const totalLessons = getCourseTotalLessons(course);

    let progress = await Progress.findOne({ user: userId, course: course._id });
    if (!progress) {
      progress = new Progress({
        user: userId,
        course: course._id,
        completedLessons: [],
        completedLessonIndexes: [],
        completedCount: 0,
        totalLessons,
        remainingLessons: totalLessons,
        completionPercentage: 0,
        lastAccessedLesson: targetIndex,
      });
    } else {
      progress.lastAccessedLesson = targetIndex;
      progress.lastActivityAt = new Date();
    }

    await progress.save();

    // Ensure course is in student's enrolled courses
    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: course._id },
    });

    res.json({
      success: true,
      lastAccessedLesson: targetIndex,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. GET ALL STUDENT PROGRESS (DASHBOARD)
// ==========================================
// @route   GET /api/progress/my-progress
// @access  Private (Student)
const getAllStudentProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch student's progress records
    const progressDocs = await Progress.find({ user: userId })
      .populate("course", "title slug category duration lessonsCount lessons topics level thumbnail")
      .sort({ lastActivityAt: -1 });

    // Also fetch user's enrolledCourses to include any course they enrolled in but haven't started yet
    const userDoc = await User.findById(userId)
      .populate("enrolledCourses", "title slug category duration lessonsCount lessons topics level thumbnail")
      .populate("completedCourses", "_id");

    const courseProgressMap = {};

    progressDocs.forEach((doc) => {
      if (doc.course) {
        courseProgressMap[doc.course._id.toString()] = doc;
      }
    });

    // Merge enrolled courses
    const allCourses = [];
    const seenCourseIds = new Set();

    progressDocs.forEach((doc) => {
      if (doc.course) {
        seenCourseIds.add(doc.course._id.toString());
        allCourses.push(doc.course);
      }
    });

    if (userDoc?.enrolledCourses) {
      userDoc.enrolledCourses.forEach((c) => {
        if (c && !seenCourseIds.has(c._id.toString())) {
          seenCourseIds.add(c._id.toString());
          allCourses.push(c);
        }
      });
    }

    // Fetch all quiz attempts for this student to attach latest and best scores
    const allAttempts = await QuizAttempt.find({ user: userId }).sort({
      submittedAt: -1,
    });

    const quizMap = {};
    allAttempts.forEach((att) => {
      if (!att.course) return;
      const cId = att.course.toString();
      if (!quizMap[cId]) {
        quizMap[cId] = [];
      }
      quizMap[cId].push(att);
    });

    const progressSummaryList = allCourses.map((c) => {
      const cId = c._id.toString();
      const pDoc = courseProgressMap[cId];
      const totalLessons = getCourseTotalLessons(c);

      const uniqueIndexes = pDoc
        ? Array.from(new Set(pDoc.completedLessonIndexes || [])).filter(
            (idx) => idx >= 0 && idx < totalLessons
          )
        : [];

      const completedCount = uniqueIndexes.length;
      const remainingLessons = Math.max(0, totalLessons - completedCount);
      const completionPercentage =
        totalLessons > 0
          ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
          : 0;

      const nextIncompleteLesson = getNextIncompleteIndex(
        totalLessons,
        uniqueIndexes
      );

      // Quiz summary for this course
      const attempts = quizMap[cId] || [];
      const latestQuiz = attempts.length > 0 ? attempts[0] : null;
      let bestQuiz = null;
      if (attempts.length > 0) {
        bestQuiz = attempts.reduce((best, cur) =>
          cur.percentage > (best ? best.percentage : -1) ? cur : best
        );
      }

      return {
        courseId: c._id,
        courseTitle: c.title,
        courseSlug: c.slug,
        category: c.category || "Programming",
        courseCategory: c.category || "Programming",
        duration: c.duration || "10 Hours",
        level: c.level || "Beginner",
        courseLevel: c.level || "Beginner",
        totalLessons,
        completedCount,
        completedLessons: completedCount,
        remainingLessons,
        completionPercentage,
        isCompleted: completionPercentage === 100,
        lastAccessedLesson: pDoc?.lastAccessedLesson || 0,
        nextIncompleteLesson,
        lastActivityAt: pDoc?.lastActivityAt || c.updatedAt,
        quizSummary: {
          attemptsCount: attempts.length,
          latestScore: latestQuiz ? latestQuiz.score : null,
          latestTotal: latestQuiz ? (latestQuiz.totalMarks || latestQuiz.totalQuestions) : null,
          latestPercentage: latestQuiz ? latestQuiz.percentage : null,
          latestPassed: latestQuiz ? latestQuiz.passed : null,
          bestScore: bestQuiz ? bestQuiz.score : null,
          bestTotal: bestQuiz ? (bestQuiz.totalMarks || bestQuiz.totalQuestions) : null,
          bestPercentage: bestQuiz ? bestQuiz.percentage : null,
          bestPassed: bestQuiz ? bestQuiz.passed : null,
          latestQuizScore: latestQuiz
            ? {
                score: latestQuiz.score,
                totalMarks: latestQuiz.totalMarks || latestQuiz.totalQuestions,
                percentage: latestQuiz.percentage,
                passed: latestQuiz.passed,
                submittedAt: latestQuiz.submittedAt,
              }
            : null,
          bestQuizScore: bestQuiz
            ? {
                score: bestQuiz.score,
                totalMarks: bestQuiz.totalMarks || bestQuiz.totalQuestions,
                percentage: bestQuiz.percentage,
                passed: bestQuiz.passed,
                submittedAt: bestQuiz.submittedAt,
              }
            : null,
        },
      };
    });

    res.json({
      success: true,
      count: progressSummaryList.length,
      progress: progressSummaryList,
      progressList: progressSummaryList,
    });
  } catch (error) {
    console.error("getAllStudentProgress Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to load student progress",
    });
  }
};

// ==========================================
// 5. ADMIN PROGRESS OVERVIEW
// ==========================================
// @route   GET /api/progress/admin/overview
// @access  Private (Admin)
const getAdminProgressOverview = async (req, res) => {
  try {
    const progressRecords = await Progress.find()
      .populate("user", "firstName lastName email avatar role")
      .populate("course", "title slug category duration lessonsCount lessons topics")
      .sort({ lastActivityAt: -1 });

    const totalStudentsTracked = await Progress.distinct("user");
    const completedCoursesCount = await Progress.countDocuments({
      isCompleted: true,
    });

    // Aggregate attempts
    const attempts = await QuizAttempt.find()
      .populate("user", "firstName lastName email")
      .populate("course", "title slug");

    res.json({
      success: true,
      stats: {
        totalEnrollments: progressRecords.length,
        totalStudentsTracked: totalStudentsTracked.length,
        completedCoursesCount,
        totalQuizAttempts: attempts.length,
      },
      records: progressRecords.map((p) => {
        const total = getCourseTotalLessons(p.course);
        const completed = p.completedLessonIndexes?.length || 0;
        return {
          _id: p._id,
          student: p.user,
          course: p.course
            ? {
                _id: p.course._id,
                title: p.course.title,
                slug: p.course.slug,
                category: p.course.category,
              }
            : null,
          completedCount: completed,
          totalLessons: total,
          completionPercentage: p.completionPercentage,
          isCompleted: p.isCompleted,
          lastActivityAt: p.lastActivityAt,
        };
      }),
    });
  } catch (error) {
    console.error("getAdminProgressOverview Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch admin progress overview",
    });
  }
};

module.exports = {
  getCourseProgress,
  toggleLessonCompletion,
  updateLastAccessedLesson,
  getAllStudentProgress,
  getAdminProgressOverview,
};

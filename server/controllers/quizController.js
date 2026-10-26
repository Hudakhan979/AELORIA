const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const Course = require("../models/Course");

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// ==========================================
// ADMIN CONTROLLERS
// ==========================================

// @desc    Get all quizzes for admin
// @route   GET /api/quizzes/admin/all
// @access  Private/Admin
const getAllQuizzesAdmin = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("course", "title slug category")
      .sort({ createdAt: -1 });

    // Gather attempt counts for each quiz
    const quizIds = quizzes.map((q) => q._id);
    const attemptCounts = await QuizAttempt.aggregate([
      { $match: { quiz: { $in: quizIds } } },
      { $group: { _id: "$quiz", count: { $sum: 1 }, passedCount: { $sum: { $cond: ["$passed", 1, 0] } } } },
    ]);

    const countMap = {};
    attemptCounts.forEach((item) => {
      countMap[item._id.toString()] = {
        totalAttempts: item.count,
        passedAttempts: item.passedCount,
      };
    });

    const quizzesWithStats = quizzes.map((q) => {
      const stats = countMap[q._id.toString()] || { totalAttempts: 0, passedAttempts: 0 };
      return {
        ...q.toObject(),
        questionsCount: q.questions ? q.questions.length : 0,
        totalAttempts: stats.totalAttempts,
        passedAttempts: stats.passedAttempts,
      };
    });

    res.json({
      success: true,
      count: quizzesWithStats.length,
      quizzes: quizzesWithStats,
    });
  } catch (error) {
    console.error("getAllQuizzesAdmin Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch quizzes",
    });
  }
};

// @desc    Get quiz by ID or Slug for admin (includes answers & explanations)
// @route   GET /api/quizzes/admin/:id
// @access  Private/Admin
const getQuizByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const quiz = await Quiz.findOne(
      isObjectId ? { _id: id } : { slug: id }
    ).populate("course", "title slug category level");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("getQuizByIdAdmin Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch quiz details",
    });
  }
};

// @desc    Create new quiz
// @route   POST /api/quizzes/admin
// @access  Private/Admin
const createQuizAdmin = async (req, res) => {
  try {
    const {
      title,
      slug,
      course,
      description,
      difficulty,
      timeLimit,
      passingPercentage,
      marksPerQuestion,
      maxAttempts,
      status,
      questions,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Quiz title is required",
      });
    }

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Associated course is required",
      });
    }

    // Verify course exists
    const isCourseObjectId = mongoose.Types.ObjectId.isValid(course);
    const existingCourse = await Course.findOne(
      isCourseObjectId ? { _id: course } : { slug: course }
    );

    if (!existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Selected course does not exist",
      });
    }

    const finalSlug = slug && slug.trim() ? generateSlug(slug) : generateSlug(title);

    // Prevent duplicate quiz
    const existingQuiz = await Quiz.findOne({
      $or: [{ slug: finalSlug }, { title: title.trim(), course: existingCourse._id }],
    });

    if (existingQuiz) {
      return res.status(400).json({
        success: false,
        message: "A quiz with this title or slug already exists",
      });
    }

    // Validate questions if provided
    let processedQuestions = [];
    if (Array.isArray(questions)) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question || !q.question.trim()) {
          return res.status(400).json({
            success: false,
            message: `Question #${i + 1} is missing question text`,
          });
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          return res.status(400).json({
            success: false,
            message: `Question #${i + 1} must have exactly 4 options`,
          });
        }
        if (
          typeof q.correctAnswer !== "number" ||
          q.correctAnswer < 0 ||
          q.correctAnswer > 3
        ) {
          return res.status(400).json({
            success: false,
            message: `Question #${i + 1} must have a valid correct answer index (0-3)`,
          });
        }
        processedQuestions.push({
          question: q.question.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation ? q.explanation.trim() : "",
          order: typeof q.order === "number" ? q.order : i,
        });
      }
    }

    const marks = marksPerQuestion ? Number(marksPerQuestion) : 1;
    const totalMarks = processedQuestions.length * marks;

    const newQuiz = new Quiz({
      title: title.trim(),
      slug: finalSlug,
      course: existingCourse._id,
      description: description ? description.trim() : "",
      difficulty: difficulty || "Beginner",
      timeLimit: timeLimit ? Number(timeLimit) : 20,
      passingPercentage: passingPercentage ? Number(passingPercentage) : 60,
      marksPerQuestion: marks,
      totalMarks,
      maxAttempts: maxAttempts !== undefined ? Number(maxAttempts) : 0,
      status: status || "draft",
      questions: processedQuestions,
    });

    await newQuiz.save();
    const populated = await Quiz.findById(newQuiz._id).populate(
      "course",
      "title slug category"
    );

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz: populated,
    });
  } catch (error) {
    console.error("createQuizAdmin Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create quiz",
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/admin/:id
// @access  Private/Admin
const updateQuizAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const quiz = await Quiz.findOne(isObjectId ? { _id: id } : { slug: id });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const {
      title,
      slug,
      course,
      description,
      difficulty,
      timeLimit,
      passingPercentage,
      marksPerQuestion,
      maxAttempts,
      status,
      questions,
    } = req.body;

    if (title && title.trim()) {
      quiz.title = title.trim();
    }

    if (slug && slug.trim()) {
      const newSlug = generateSlug(slug);
      // check if taken by another quiz
      const conflict = await Quiz.findOne({
        slug: newSlug,
        _id: { $ne: quiz._id },
      });
      if (conflict) {
        return res.status(400).json({
          success: false,
          message: "Another quiz already uses this slug",
        });
      }
      quiz.slug = newSlug;
    }

    if (course) {
      const isCourseObjectId = mongoose.Types.ObjectId.isValid(course);
      const existingCourse = await Course.findOne(
        isCourseObjectId ? { _id: course } : { slug: course }
      );
      if (existingCourse) {
        quiz.course = existingCourse._id;
      }
    }

    if (description !== undefined) quiz.description = description.trim();
    if (difficulty) quiz.difficulty = difficulty;
    if (timeLimit) quiz.timeLimit = Number(timeLimit);
    if (passingPercentage !== undefined) quiz.passingPercentage = Number(passingPercentage);
    if (marksPerQuestion) quiz.marksPerQuestion = Number(marksPerQuestion);
    if (maxAttempts !== undefined) quiz.maxAttempts = Number(maxAttempts);
    if (status) quiz.status = status;

    if (Array.isArray(questions)) {
      quiz.questions = questions.map((q, i) => ({
        question: q.question.trim(),
        options: q.options.map((opt) => opt.trim()),
        correctAnswer: Number(q.correctAnswer),
        explanation: q.explanation ? q.explanation.trim() : "",
        order: typeof q.order === "number" ? q.order : i,
      }));
      quiz.totalMarks = quiz.questions.length * quiz.marksPerQuestion;
    }

    await quiz.save();
    const updated = await Quiz.findById(quiz._id).populate(
      "course",
      "title slug category"
    );

    res.json({
      success: true,
      message: "Quiz updated successfully",
      quiz: updated,
    });
  } catch (error) {
    console.error("updateQuizAdmin Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update quiz",
    });
  }
};

// @desc    Delete quiz and associated attempts
// @route   DELETE /api/quizzes/admin/:id
// @access  Private/Admin
const deleteQuizAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const quiz = await Quiz.findOne(isObjectId ? { _id: id } : { slug: id });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    await QuizAttempt.deleteMany({ quiz: quiz._id });
    await Quiz.findByIdAndDelete(quiz._id);

    res.json({
      success: true,
      message: "Quiz and all student attempts deleted successfully",
    });
  } catch (error) {
    console.error("deleteQuizAdmin Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete quiz",
    });
  }
};

// @desc    Toggle quiz published/draft status
// @route   PATCH /api/quizzes/admin/:id/status
// @access  Private/Admin
const toggleQuizStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const quiz = await Quiz.findOne(isObjectId ? { _id: id } : { slug: id });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    quiz.status = quiz.status === "published" ? "draft" : "published";
    await quiz.save();

    res.json({
      success: true,
      message: `Quiz status changed to ${quiz.status}`,
      status: quiz.status,
    });
  } catch (error) {
    console.error("toggleQuizStatusAdmin Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update status",
    });
  }
};

// @desc    Add single question to quiz
// @route   POST /api/quizzes/admin/:id/questions
// @access  Private/Admin
const addQuestionAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correctAnswer, explanation } = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: "Question text required" });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ success: false, message: "Exactly 4 options required" });
    }

    quiz.questions.push({
      question: question.trim(),
      options: options.map((opt) => opt.trim()),
      correctAnswer: Number(correctAnswer),
      explanation: explanation ? explanation.trim() : "",
      order: quiz.questions.length,
    });

    quiz.totalMarks = quiz.questions.length * quiz.marksPerQuestion;
    await quiz.save();

    res.status(201).json({
      success: true,
      message: "Question added successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update question in quiz
// @route   PUT /api/quizzes/admin/:id/questions/:questionId
// @access  Private/Admin
const updateQuestionAdmin = async (req, res) => {
  try {
    const { id, questionId } = req.params;
    const { question, options, correctAnswer, explanation } = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const q = quiz.questions.id(questionId);
    if (!q) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    if (question && question.trim()) q.question = question.trim();
    if (Array.isArray(options) && options.length === 4) {
      q.options = options.map((opt) => opt.trim());
    }
    if (correctAnswer !== undefined) q.correctAnswer = Number(correctAnswer);
    if (explanation !== undefined) q.explanation = explanation.trim();

    await quiz.save();

    res.json({
      success: true,
      message: "Question updated successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete question from quiz
// @route   DELETE /api/quizzes/admin/:id/questions/:questionId
// @access  Private/Admin
const deleteQuestionAdmin = async (req, res) => {
  try {
    const { id, questionId } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    quiz.questions.pull({ _id: questionId });
    quiz.totalMarks = quiz.questions.length * quiz.marksPerQuestion;
    await quiz.save();

    res.json({
      success: true,
      message: "Question deleted successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all student attempts for a quiz
// @route   GET /api/quizzes/admin/:id/attempts
// @access  Private/Admin
const getQuizAttemptsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const quiz = await Quiz.findOne(isObjectId ? { _id: id } : { slug: id });
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const attempts = await QuizAttempt.find({ quiz: quiz._id })
      .populate("user", "firstName lastName email avatar")
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      quizTitle: quiz.title,
      passingPercentage: quiz.passingPercentage,
      totalAttempts: attempts.length,
      attempts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// STUDENT / PUBLIC CONTROLLERS
// ==========================================

// @desc    Get published quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Public
const getQuizzesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(courseId);

    const course = await Course.findOne(
      isObjectId ? { _id: courseId } : { slug: courseId }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const quizzes = await Quiz.find({
      course: course._id,
      status: "published",
    }).select("title slug description difficulty timeLimit passingPercentage marksPerQuestion totalMarks maxAttempts questions");

    const sanitized = quizzes.map((q) => ({
      _id: q._id,
      title: q.title,
      slug: q.slug,
      description: q.description,
      difficulty: q.difficulty,
      timeLimit: q.timeLimit,
      passingPercentage: q.passingPercentage,
      marksPerQuestion: q.marksPerQuestion,
      totalMarks: q.totalMarks,
      maxAttempts: q.maxAttempts,
      questionsCount: q.questions ? q.questions.length : 0,
      courseId: course._id,
      courseTitle: course.title,
    }));

    res.json({
      success: true,
      quizzes: sanitized,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all published quizzes
// @route   GET /api/quizzes
// @access  Public
const getAllPublishedQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ status: "published" })
      .populate("course", "title slug category level")
      .select("title slug description difficulty timeLimit passingPercentage marksPerQuestion totalMarks maxAttempts questions course");

    const sanitized = quizzes.map((q) => ({
      _id: q._id,
      title: q.title,
      slug: q.slug,
      description: q.description,
      difficulty: q.difficulty,
      timeLimit: q.timeLimit,
      passingPercentage: q.passingPercentage,
      totalMarks: q.totalMarks,
      maxAttempts: q.maxAttempts,
      questionsCount: q.questions ? q.questions.length : 0,
      course: q.course,
    }));

    res.json({
      success: true,
      quizzes: sanitized,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get quiz overview & info for student
// @route   GET /api/quizzes/:id
// @access  Public / Protected
const getQuizInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const quiz = await Quiz.findOne(
      isObjectId ? { _id: id } : { slug: id }
    ).populate("course", "title slug category level");

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    if (quiz.status !== "published" && (!req.user || req.user.role !== "admin")) {
      return res.status(403).json({ success: false, message: "Quiz is currently not published" });
    }

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        slug: quiz.slug,
        description: quiz.description,
        difficulty: quiz.difficulty,
        timeLimit: quiz.timeLimit,
        passingPercentage: quiz.passingPercentage,
        marksPerQuestion: quiz.marksPerQuestion,
        totalMarks: quiz.totalMarks,
        maxAttempts: quiz.maxAttempts,
        questionsCount: quiz.questions ? quiz.questions.length : 0,
        course: quiz.course,
        status: quiz.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Start / take quiz - Sanitized questions WITHOUT correct answers or explanations
// @route   GET /api/quizzes/:id/take
// @access  Private (Student & Admin)
const startQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const quiz = await Quiz.findOne(
      isObjectId ? { _id: id } : { slug: id }
    ).populate("course", "title slug category");

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    if (quiz.status !== "published" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "This quiz is not currently available" });
    }

    if (!quiz.questions || quiz.questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "This quiz does not have any questions yet",
      });
    }

    // Check maximum attempts limit if configured
    if (quiz.maxAttempts > 0 && req.user.role !== "admin") {
      const pastAttemptsCount = await QuizAttempt.countDocuments({
        quiz: quiz._id,
        user: req.user._id,
      });

      if (pastAttemptsCount >= quiz.maxAttempts) {
        return res.status(403).json({
          success: false,
          message: `You have reached the maximum allowed attempts (${quiz.maxAttempts}) for this quiz.`,
        });
      }
    }

    // CRITICAL SECURITY REQUIREMENT:
    // Strip correctAnswer and explanation before sending to client!
    const sanitizedQuestions = quiz.questions.map((q, index) => ({
      questionIndex: index,
      _id: q._id,
      question: q.question,
      options: q.options,
      order: q.order !== undefined ? q.order : index,
    }));

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        slug: quiz.slug,
        description: quiz.description,
        difficulty: quiz.difficulty,
        timeLimit: quiz.timeLimit,
        passingPercentage: quiz.passingPercentage,
        marksPerQuestion: quiz.marksPerQuestion,
        totalMarks: quiz.totalMarks,
        maxAttempts: quiz.maxAttempts,
        totalQuestions: sanitizedQuestions.length,
        course: quiz.course,
      },
      questions: sanitizedQuestions,
    });
  } catch (error) {
    console.error("startQuiz Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit quiz answers, compute score server-side, and save attempt
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, timeSpent } = req.body;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const quiz = await Quiz.findOne(
      isObjectId ? { _id: id } : { slug: id }
    );

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    if (quiz.status !== "published" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Quiz is not published" });
    }

    // Check maximum attempts
    if (quiz.maxAttempts > 0 && req.user.role !== "admin") {
      const attemptCount = await QuizAttempt.countDocuments({
        quiz: quiz._id,
        user: req.user._id,
      });

      if (attemptCount >= quiz.maxAttempts) {
        return res.status(403).json({
          success: false,
          message: "Maximum attempts reached for this quiz",
        });
      }
    }

    // Create lookup map for submitted answers
    // answers is array of: { questionIndex: Number, selectedOption: Number }
    const answerMap = {};
    if (Array.isArray(answers)) {
      answers.forEach((ans) => {
        if (typeof ans.questionIndex === "number") {
          answerMap[ans.questionIndex] = ans.selectedOption;
        }
      });
    }

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    const reviewAnswers = [];

    quiz.questions.forEach((q, index) => {
      const selectedOption = answerMap[index];
      const isUnanswered =
        selectedOption === undefined ||
        selectedOption === null ||
        selectedOption === -1;

      let isCorrect = false;

      if (isUnanswered) {
        unansweredCount++;
        isCorrect = false;
      } else if (Number(selectedOption) === q.correctAnswer) {
        correctCount++;
        isCorrect = true;
      } else {
        incorrectCount++;
        isCorrect = false;
      }

      reviewAnswers.push({
        questionIndex: index,
        questionText: q.question,
        options: q.options,
        selectedOption: isUnanswered ? null : Number(selectedOption),
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || "",
      });
    });

    const marksPerQuestion = quiz.marksPerQuestion || 1;
    const score = correctCount * marksPerQuestion;
    const totalMarks = quiz.questions.length * marksPerQuestion;
    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
    const passed = percentage >= quiz.passingPercentage;

    const attempt = new QuizAttempt({
      quiz: quiz._id,
      user: req.user._id,
      course: quiz.course,
      answers: reviewAnswers,
      score,
      totalQuestions: quiz.questions.length,
      correctCount,
      incorrectCount,
      unansweredCount,
      totalMarks,
      percentage,
      passed,
      timeSpent: typeof timeSpent === "number" ? timeSpent : 0,
      submittedAt: new Date(),
    });

    await attempt.save();

    res.status(201).json({
      success: true,
      message: passed
        ? "Congratulations! You passed the quiz! 🎉"
        : "Quiz completed. Keep practicing to improve your score! 💪",
      result: {
        attemptId: attempt._id,
        quizId: quiz._id,
        quizTitle: quiz.title,
        score,
        totalMarks,
        percentage,
        passingPercentage: quiz.passingPercentage,
        passed,
        correctCount,
        incorrectCount,
        unansweredCount,
        totalQuestions: quiz.questions.length,
        timeSpent: attempt.timeSpent,
        submittedAt: attempt.submittedAt,
        review: reviewAnswers,
      },
    });
  } catch (error) {
    console.error("submitQuiz Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user's past attempts for a quiz
// @route   GET /api/quizzes/:id/my-attempts
// @access  Private
const getMyAttempts = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const quiz = await Quiz.findOne(
      isObjectId ? { _id: id } : { slug: id }
    );

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const attempts = await QuizAttempt.find({
      quiz: quiz._id,
      user: req.user._id,
    })
      .sort({ submittedAt: -1 })
      .select("-answers");

    res.json({
      success: true,
      attempts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get specific attempt review
// @route   GET /api/quizzes/attempts/:attemptId
// @access  Private
const getAttemptById = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await QuizAttempt.findById(attemptId)
      .populate("quiz", "title slug passingPercentage difficulty timeLimit course")
      .populate("user", "firstName lastName email");

    if (!attempt) {
      return res.status(404).json({ success: false, message: "Attempt not found" });
    }

    // Only allow owner student or admin to view
    if (
      attempt.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({
      success: true,
      attempt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllQuizzesAdmin,
  getQuizByIdAdmin,
  createQuizAdmin,
  updateQuizAdmin,
  deleteQuizAdmin,
  toggleQuizStatusAdmin,
  addQuestionAdmin,
  updateQuestionAdmin,
  deleteQuestionAdmin,
  getQuizAttemptsAdmin,
  getQuizzesByCourse,
  getAllPublishedQuizzes,
  getQuizInfo,
  startQuiz,
  submitQuiz,
  getMyAttempts,
  getAttemptById,
};

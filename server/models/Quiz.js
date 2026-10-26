const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question text is required"],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, "Four options are required"],
    validate: {
      validator: function (val) {
        return Array.isArray(val) && val.length === 4;
      },
      message: "Each question must have exactly 4 options",
    },
  },
  correctAnswer: {
    type: Number,
    required: [true, "Correct answer index is required (0-3)"],
    min: 0,
    max: 3,
  },
  explanation: {
    type: String,
    trim: true,
    default: "",
  },
  order: {
    type: Number,
    default: 0,
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Quiz slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Associated course is required"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    timeLimit: {
      type: Number,
      required: [true, "Time limit in minutes is required"],
      default: 20,
      min: 1,
    },
    passingPercentage: {
      type: Number,
      required: [true, "Passing percentage is required"],
      default: 60,
      min: 1,
      max: 100,
    },
    marksPerQuestion: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalMarks: {
      type: Number,
      default: 20,
    },
    maxAttempts: {
      type: Number,
      default: 0, // 0 = unlimited
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

quizSchema.pre("save", function () {
  if (this.questions && this.questions.length > 0) {
    this.totalMarks = this.questions.length * (this.marksPerQuestion || 1);
  } else {
    this.totalMarks = 0;
  }
});

module.exports = mongoose.model("Quiz", quizSchema);

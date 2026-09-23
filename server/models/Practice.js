const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      default: "",
    },

    expectedOutput: {
      type: String,
      default: "",
    },

    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const practiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    description: {
      type: String,
      required: true,
    },

    constraints: [
      {
        type: String,
        trim: true,
      },
    ],

    inputFormat: {
      type: String,
      default: "",
    },

    outputFormat: {
      type: String,
      default: "",
    },

    exampleInput: {
      type: String,
      default: "",
    },

    exampleOutput: {
      type: String,
      default: "",
    },

    explanation: {
      type: String,
      default: "",
    },

    supportedLanguages: [
      {
        type: String,
        trim: true,
      },
    ],

    starterCode: {
      type: String,
      default: "",
    },

    solution: {
      type: String,
      default: "",
    },

    testCases: [testCaseSchema],

    hints: [
      {
        type: String,
        trim: true,
      },
    ],

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    successfulSubmissions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Practice", practiceSchema);
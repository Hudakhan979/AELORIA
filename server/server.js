const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const tutorialRoutes = require("./routes/tutorialRoutes");
const noteRoutes = require("./routes/noteRoutes");
const practiceRoutes = require("./routes/practiceRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const languageRoutes = require("./routes/languageRoutes");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/tutorials", tutorialRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AELORIA Backend is running 🚀",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AELORIA API is working properly",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AELORIA Server running on port ${PORT}`);
});
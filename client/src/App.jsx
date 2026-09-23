import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import CategoryBar from "./components/CategoryBar/CategoryBar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Courses from "./pages/Courses/Courses";
import Tutorials from "./pages/Tutorials/Tutorials";
import Practice from "./pages/Practice/Practice";
import Notes from "./pages/Notes/Notes";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import AdminLogin from "./admin/AdminLogin/AdminLogin";
import Dashboard from "./admin/Dashboard/Dashboard";
import AdminCourses from "./admin/Courses/AdminCourses";
import Search from "./pages/Search/Search";
import Interview from "./pages/Interview/Interview";
import Course from "./pages/Course/Course";
import Tutorial from "./pages/Tutorial/Tutorial";
import PracticeProblem from "./pages/PracticeProblem/PracticeProblem";
import NoteDetail from "./pages/Note/Note";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import Profile from "./pages/Profile/Profile";
import EditCourse from "./admin/Courses/EditCourse/EditCourse";
import ManageLessons from "./admin/Courses/ManageLessons/ManageLessons";
import EditTutorial from "./admin/Tutorials/EditTutorial/EditTutorial";
import AdminTutorials from "./admin/Tutorials/AdminTutorials";
import ManageTopics from "./admin/Tutorials/ManageTopics/ManageTopics";
import AdminNotes from "./admin/Notes/Notes";
import EditNote from "./admin/Notes/EditNote/EditNote";
import EditPractice from "./admin/Practice/EditPractice/EditPractice";
import AdminPractice from "./admin/Practice/Practice";
import AdminCategories from "./admin/Categories/Categories";
import EditCategory from "./admin/Categories/EditCategory/EditCategory";
import AdminLanguages from "./admin/Languages/Languages";
import EditLanguage from "./admin/Languages/EditLanguage/EditLanguage";
import AdminUsers from "./admin/Users/Users";
import EditUser from "./admin/Users/EditUser/EditUser";
import AIAssistant from "./pages/AIAssistant/AIAssistant";
import AdminProtectedRoute from "./components/AdminProtectedRoute/AdminProtectedRoute";




function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC WEBSITE */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Home />
              <Footer />
            </>
          }
        />

        <Route
          path="/courses"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Courses />
              <Footer />
            </>
          }
        />

        <Route
          path="/courses/:courseId"
          element={<Course />}
        />

        <Route
          path="/tutorials"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Tutorials />
              <Footer />
            </>
          }
        />

        <Route
          path="/tutorials/:tutorialId"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Tutorial />
              <Footer />
            </>
          }
        />

        <Route
          path="/practice"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Practice />
              <Footer />
            </>
          }
        />

        <Route
          path="/practice/:problemId"
          element={<PracticeProblem />}
        />

        <Route
          path="/notes"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Notes />
              <Footer />
            </>
          }
        />

        <Route
          path="/notes/:noteId"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <NoteDetail />
              <Footer />
            </>
          }
        />

        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <StudentDashboard />
              <Footer />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Profile />
              <Footer />
            </>
          }
        />

        <Route
          path="/search"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Search />
              <Footer />
            </>
          }
        />

        <Route
          path="/interview-preparation"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Interview />
              <Footer />
            </>
          }
        />

        <Route
          path="/ai-assistant"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <AIAssistant />
              <Footer />
            </>
          }
        />

        {/* AUTH */}

        <Route
          path="/login"
          element={
            <>
              <Login />
            </>
          }
        />

        <Route
          path="/register"
          element={
            <>
              <Register />
            </>
          }
        />

        {/* ADMIN */}

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/courses/edit/:courseId" element={<EditCourse />} />
          <Route path="/admin/courses/:courseId/lessons" element={<ManageLessons />} />
          <Route path="/admin/tutorials" element={<AdminTutorials />} />
          <Route path="/admin/tutorials/edit/:tutorialId" element={<EditTutorial />} />
          <Route path="/admin/tutorials/:tutorialId/topics" element={<ManageTopics />} />
          <Route path="/admin/notes" element={<AdminNotes />} />
          <Route path="/admin/notes/edit/:noteId" element={<EditNote />} />
          <Route path="/admin/practice" element={<AdminPractice />} />
          <Route path="/admin/practice/edit/:problemId" element={<EditPractice />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/categories/edit/:categoryId" element={<EditCategory />} />
          <Route path="/admin/languages" element={<AdminLanguages />} />
          <Route path="/admin/languages/edit/:languageId" element={<EditLanguage />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/edit/:userId" element={<EditUser />} />
        </Route>

        {/* 404 */}

        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "10px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <h1>404</h1>
              <p>Page not found</p>
              <a href="/">Go Home</a>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
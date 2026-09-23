const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";


const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

// =========================
// AUTH
// =========================

export const registerUser = (userData) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const loginUser = (loginData) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(loginData),
  });

export const loginAdmin = (loginData) =>
  apiRequest("/auth/admin/login", {
    method: "POST",
    body: JSON.stringify(loginData),
  });

// =========================
// COURSES
// =========================

export const getCourses = () =>
  apiRequest("/courses");

export const getCourseById = (id) =>
  apiRequest(`/courses/${id}`);

// =========================
// TUTORIALS
// =========================

export const getTutorials = () =>
  apiRequest("/tutorials");

export const getTutorialById = (id) =>
  apiRequest(`/tutorials/${id}`);

// =========================
// NOTES
// =========================

export const getNotes = () =>
  apiRequest("/notes");

export const getNoteById = (id) =>
  apiRequest(`/notes/${id}`);

// =========================
// PRACTICE
// =========================

export const getPracticeProblems = () =>
  apiRequest("/practice");

export const getPracticeProblemById = (id) =>
  apiRequest(`/practice/${id}`);

// =========================
// CATEGORIES
// =========================

export const getCategories = () =>
  apiRequest("/categories");

export const getCategoryById = (id) =>
  apiRequest(`/categories/${id}`);

// =========================
// LANGUAGES
// =========================

export const getLanguages = () =>
  apiRequest("/languages");

export const getLanguageById = (id) =>
  apiRequest(`/languages/${id}`);

// =========================
// ADMIN - COURSES
// =========================

export const getAdminCourses = (token) =>
  apiRequest("/courses/admin/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createCourse = (courseData, token) =>
  apiRequest("/courses/admin", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });

export const updateCourse = (id, courseData, token) =>
  apiRequest(`/courses/admin/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });

export const deleteCourse = (id, token) =>
  apiRequest(`/courses/admin/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const toggleCourseStatus = (id, token) =>
  apiRequest(`/courses/admin/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// =========================
// ADMIN TUTORIALS
// =========================

export const getAdminTutorials = (token) =>
  apiRequest("/tutorials/admin/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createTutorial = (tutorialData, token) =>
  apiRequest("/tutorials/admin", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tutorialData),
  });

export const updateTutorial = (id, tutorialData, token) =>
  apiRequest(`/tutorials/admin/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tutorialData),
  });

export const deleteTutorial = (id, token) =>
  apiRequest(`/tutorials/admin/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const toggleTutorialStatus = (id, token) =>
  apiRequest(`/tutorials/admin/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// =========================
// ADMIN - NOTES
// =========================

// =========================
// NOTES - ADMIN
// =========================

export const getAdminNotes = (token) =>
  apiRequest("/notes/admin/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createNote = (noteData, token) =>
  apiRequest("/notes/admin", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noteData),
  });

export const updateNote = (id, noteData, token) =>
  apiRequest(`/notes/admin/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noteData),
  });

export const deleteNote = (id, token) =>
  apiRequest(`/notes/admin/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const toggleNoteStatus = (id, token) =>
  apiRequest(`/notes/admin/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// =========================
// PRACTICE - ADMIN
// =========================

export const getAdminPracticeProblems = (token) =>
  apiRequest("/practice/admin/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createPracticeProblem = (problemData, token) =>
  apiRequest("/practice/admin", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(problemData),
  });

export const updatePracticeProblem = (
  id,
  problemData,
  token
) =>
  apiRequest(`/practice/admin/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(problemData),
  });

export const deletePracticeProblem = (id, token) =>
  apiRequest(`/practice/admin/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const togglePracticeProblemStatus = (id, token) =>
  apiRequest(`/practice/admin/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
// =========================
// ADMIN - CATEGORIES
// =========================

export const getAdminCategories = (token) =>
  apiRequest("/categories/admin/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createCategory = (categoryData, token) =>
  apiRequest("/categories/admin", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

export const updateCategory = (id, categoryData, token) =>
  apiRequest(`/categories/admin/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

export const deleteCategory = (id, token) =>
  apiRequest(`/categories/admin/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const toggleCategoryStatus = (id, token) =>
  apiRequest(`/categories/admin/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// ================================
// ADMIN LANGUAGES
// ================================

export const getAdminLanguages = (token) =>
  apiRequest("/languages/admin/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createLanguage = (languageData, token) =>
  apiRequest("/languages/admin", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(languageData),
  });

export const updateLanguage = (id, languageData, token) =>
  apiRequest(`/languages/admin/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(languageData),
  });

export const deleteLanguage = (id, token) =>
  apiRequest(`/languages/admin/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const toggleLanguageStatus = (id, token) =>
  apiRequest(`/languages/admin/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// =========================
// ADMIN - USERS
// =========================

export const getAdminUsers = (token) =>
  apiRequest("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAdminUserById = (id, token) =>
  apiRequest(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateAdminUser = (id, userData, token) =>
  apiRequest(`/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

export const deleteAdminUser = (id, token) =>
  apiRequest(`/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const toggleAdminUserStatus = (id, token) =>
  apiRequest(`/users/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAdminDashboardData = async (token) => {
  const [
    courses,
    tutorials,
    notes,
    practice,
    categories,
    languages,
    users,
  ] = await Promise.all([
    getAdminCourses(token),
    getAdminTutorials(token),
    getAdminNotes(token),
    getAdminPracticeProblems(token),
    getAdminCategories(token),
    getAdminLanguages(token),
    getAdminUsers(token),
  ]);

  return {
    courses,
    tutorials,
    notes,
    practice,
    categories,
    languages,
    users,
  };
};
export const sendAIMessage = (aiData, token) =>
  apiRequest("/ai/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(aiData),
  });

// =========================
// USER PROFILE
// =========================

export const getUserProfile = (token) =>
  apiRequest("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateUserProfile = (userData, token) =>
  apiRequest("/auth/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

export default apiRequest;
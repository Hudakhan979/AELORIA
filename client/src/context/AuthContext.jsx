import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  loginAdmin,
} from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore isolated sessions upon app load / refresh
  useEffect(() => {
    try {
      // 1. Student Session
      const savedUser = localStorage.getItem("aeloriaUser");
      const savedUserToken =
        localStorage.getItem("aeloriaUserToken") ||
        localStorage.getItem("aeloriaStudentToken");

      if (savedUser && savedUserToken) {
        setUser(JSON.parse(savedUser));
        setUserToken(savedUserToken);
      }

      // 2. Admin Session (Completely Isolated)
      const savedAdmin = localStorage.getItem("aeloriaAdmin");
      const savedAdminToken = localStorage.getItem("aeloriaAdminToken");

      if (savedAdmin && savedAdminToken) {
        setAdmin(JSON.parse(savedAdmin));
        setAdminToken(savedAdminToken);
      }
    } catch (err) {
      console.error("Auth restore error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------------------
  // STUDENT AUTHENTICATION
  // ----------------------------------------
  const register = async (userData) => {
    const data = await registerUser(userData);

    if (data.success && data.token) {
      localStorage.setItem("aeloriaUser", JSON.stringify(data.user));
      localStorage.setItem("aeloriaUserToken", data.token);

      setUser(data.user);
      setUserToken(data.token);
    }

    return data;
  };

  const login = async (loginData) => {
    const data = await loginUser(loginData);

    if (data.success && data.token) {
      localStorage.setItem("aeloriaUser", JSON.stringify(data.user));
      localStorage.setItem("aeloriaUserToken", data.token);

      setUser(data.user);
      setUserToken(data.token);
    }

    return data;
  };

  // Student Logout (Clears ONLY student credentials)
  const logout = () => {
    localStorage.removeItem("aeloriaUser");
    localStorage.removeItem("aeloriaUserToken");
    localStorage.removeItem("aeloriaStudentToken");
    localStorage.removeItem("aeloriaToken");

    setUser(null);
    setUserToken(null);
  };

  // Update in-memory and local student user state (e.g. after profile edit)
  const updateUser = (updatedUserData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUserData };
      localStorage.setItem("aeloriaUser", JSON.stringify(merged));
      return merged;
    });
  };

  // ----------------------------------------
  // ADMIN AUTHENTICATION (ISOLATED)
  // ----------------------------------------
  const adminLogin = async (loginData) => {
    const data = await loginAdmin(loginData);

    if (data.success && data.token) {
      const adminData = data.admin || data.user;
      localStorage.setItem("aeloriaAdmin", JSON.stringify(adminData));
      localStorage.setItem("aeloriaAdminToken", data.token);

      setAdmin(adminData);
      setAdminToken(data.token);
    }

    return data;
  };

  // Admin Logout (Clears ONLY admin credentials)
  const adminLogout = () => {
    localStorage.removeItem("aeloriaAdmin");
    localStorage.removeItem("aeloriaAdminToken");

    setAdmin(null);
    setAdminToken(null);
  };

  const value = {
    // Student State
    user,
    userToken,
    studentToken: userToken, // alias for backwards compatibility
    isLoggedIn: !!user,
    register,
    login,
    logout,
    updateUser,

    // Admin State (Explicitly Isolated)
    admin,
    adminToken,
    isAdmin: !!admin,
    adminLogin,
    adminLogout,

    // Smart role-aware token:
    // If called on an admin path, delivers adminToken.
    // Otherwise delivers userToken (falling back to adminToken if only admin is logged in).
    get token() {
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
        return adminToken || userToken;
      }
      return userToken || adminToken;
    },

    // Lifecycle
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
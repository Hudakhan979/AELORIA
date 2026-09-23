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
  const [studentToken, setStudentToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore login after refresh
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("aeloriaUser");
      const savedAdmin = localStorage.getItem("aeloriaAdmin");
      const savedStudentToken =
        localStorage.getItem("aeloriaStudentToken") ||
        localStorage.getItem("aeloriaToken");
      const savedAdminToken = localStorage.getItem("aeloriaAdminToken");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (savedAdmin) {
        setAdmin(JSON.parse(savedAdmin));
      }

      if (savedStudentToken) {
        setStudentToken(savedStudentToken);
      }

      if (savedAdminToken) {
        setAdminToken(savedAdminToken);
      }
    } catch (err) {
      console.error("Auth restore error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Student Register
  const register = async (userData) => {
    const data = await registerUser(userData);

    if (data.success) {
      localStorage.setItem("aeloriaUser", JSON.stringify(data.user));
      localStorage.setItem("aeloriaStudentToken", data.token);
      localStorage.setItem("aeloriaToken", data.token);

      setUser(data.user);
      setStudentToken(data.token);
    }

    return data;
  };

  // Student Login
  const login = async (loginData) => {
    const data = await loginUser(loginData);

    if (data.success) {
      localStorage.setItem("aeloriaUser", JSON.stringify(data.user));
      localStorage.setItem("aeloriaStudentToken", data.token);
      localStorage.setItem("aeloriaToken", data.token);

      setUser(data.user);
      setStudentToken(data.token);
    }

    return data;
  };

  // Admin Login
  const adminLogin = async (loginData) => {
    const data = await loginAdmin(loginData);

    if (data.success) {
      localStorage.setItem("aeloriaAdmin", JSON.stringify(data.admin));
      localStorage.setItem("aeloriaAdminToken", data.token);

      setAdmin(data.admin);
      setAdminToken(data.token);
    }

    return data;
  };

  // Update in-memory and local user state (e.g. after profile edit)
  const updateUser = (updatedUserData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUserData };
      localStorage.setItem("aeloriaUser", JSON.stringify(merged));
      return merged;
    });
  };

  // Student Logout
  const logout = () => {
    localStorage.removeItem("aeloriaUser");
    localStorage.removeItem("aeloriaStudentToken");
    localStorage.removeItem("aeloriaToken");

    setUser(null);
    setStudentToken(null);
  };

  // Admin Logout
  const adminLogout = () => {
    localStorage.removeItem("aeloriaAdmin");
    localStorage.removeItem("aeloriaAdminToken");

    setAdmin(null);
    setAdminToken(null);
  };

  // Token is context-aware: adminToken if admin is active and no student token, or studentToken
  const activeToken = adminToken || studentToken;

  const value = {
    user,
    admin,
    token: activeToken,
    studentToken,
    adminToken,
    loading,
    isLoggedIn: !!user,
    isAdmin: !!admin,
    register,
    login,
    adminLogin,
    updateUser,
    logout,
    adminLogout,
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
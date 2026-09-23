import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * AdminProtectedRoute
 * 
 * Enforces strict authentication for admin routes.
 * Non-admins, students, and unauthenticated visitors attempting
 * to access /admin/dashboard or any admin sub-route are redirected to /admin/login.
 */
const AdminProtectedRoute = ({ children }) => {
  const { admin, adminToken, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF9FF",
          color: "#6D28D9",
          fontFamily: "'Inter', sans-serif",
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        Authenticating Admin Session...
      </div>
    );
  }

  // Strict verification: user must have active admin object, adminToken, and role === 'admin'
  if (!admin || !adminToken || admin.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminProtectedRoute;

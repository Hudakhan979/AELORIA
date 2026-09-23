import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getAdminUsers,
  deleteAdminUser,
  toggleAdminUserStatus,
} from "../../services/api";
import "./Users.css";

const AdminUsers = () => {
  const { admin, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && (!admin || !token)) {
      navigate("/admin/login");
    }
  }, [admin, token, authLoading, navigate]);

  useEffect(() => {
    if (admin && token) {
      fetchUsers();
    }
  }, [admin, token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUsers(token);

      const userData = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.users)
        ? response.users
        : [];

      setUsers(userData);
    } catch (err) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await toggleAdminUserStatus(userId, token);
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to update user status.");
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      await deleteAdminUser(userId, token);
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to delete user.");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName || ""} ${
        user.lastName || ""
      }`.trim();

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        fullName.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive === true) ||
        (statusFilter === "inactive" && user.isActive === false);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      students: users.filter((user) => user.role === "student").length,
      admins: users.filter((user) => user.role === "admin").length,
      active: users.filter((user) => user.isActive === true).length,
      inactive: users.filter((user) => user.isActive === false).length,
    };
  }, [users]);

  const getInitials = (user) => {
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";

    return `${first}${last}`.toUpperCase() || "U";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="aeloria-admin-users-loading">
        <div className="aeloria-admin-users-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="aeloria-admin-users-page">
      {/* Sidebar */}
      <aside className="aeloria-admin-users-sidebar">
        <div className="aeloria-admin-users-sidebar-logo">
          <div className="aeloria-admin-users-logo-icon">A</div>
          <div>
            <h2>AELORIA</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="aeloria-admin-users-sidebar-nav">
          <Link
            to="/admin/dashboard"
            className="aeloria-admin-users-nav-item"
          >
            <span>📊</span>
            Dashboard
          </Link>

          <Link
            to="/admin/courses"
            className="aeloria-admin-users-nav-item"
          >
            <span>📚</span>
            Courses
          </Link>

          <Link
            to="/admin/tutorials"
            className="aeloria-admin-users-nav-item"
          >
            <span>📖</span>
            Tutorials
          </Link>

          <Link
            to="/admin/notes"
            className="aeloria-admin-users-nav-item"
          >
            <span>📝</span>
            Notes
          </Link>

          <Link
            to="/admin/practice"
            className="aeloria-admin-users-nav-item"
          >
            <span>💻</span>
            Practice
          </Link>

          <Link
            to="/admin/categories"
            className="aeloria-admin-users-nav-item"
          >
            <span>🗂️</span>
            Categories
          </Link>

          <Link
            to="/admin/languages"
            className="aeloria-admin-users-nav-item"
          >
            <span>🌐</span>
            Languages
          </Link>

          <Link
            to="/admin/users"
            className="aeloria-admin-users-nav-item active"
          >
            <span>👥</span>
            Users
          </Link>
        </nav>

        <Link
          to="/"
          className="aeloria-admin-users-back-site"
        >
          ← Back to Website
        </Link>
      </aside>

      {/* Main Content */}
      <main className="aeloria-admin-users-main">
        {/* Header */}
        <header className="aeloria-admin-users-header">
          <div>
            <p className="aeloria-admin-users-breadcrumb">
              Admin / Users
            </p>
            <h1>User Management</h1>
            <p>
              Manage AELORIA students and administrators.
            </p>
          </div>

          <div className="aeloria-admin-users-admin-profile">
            <div className="aeloria-admin-users-admin-avatar">
              {admin?.firstName?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {admin?.firstName || "Admin"}{" "}
                {admin?.lastName || ""}
              </strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="aeloria-admin-users-error">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={fetchUsers}>Retry</button>
          </div>
        )}

        {/* Stats */}
        <section className="aeloria-admin-users-stats">
          <div className="aeloria-admin-users-stat-card">
            <div className="aeloria-admin-users-stat-icon purple">
              👥
            </div>
            <div>
              <span>Total Users</span>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className="aeloria-admin-users-stat-card">
            <div className="aeloria-admin-users-stat-icon blue">
              🎓
            </div>
            <div>
              <span>Students</span>
              <strong>{stats.students}</strong>
            </div>
          </div>

          <div className="aeloria-admin-users-stat-card">
            <div className="aeloria-admin-users-stat-icon orange">
              🛡️
            </div>
            <div>
              <span>Admins</span>
              <strong>{stats.admins}</strong>
            </div>
          </div>

          <div className="aeloria-admin-users-stat-card">
            <div className="aeloria-admin-users-stat-icon green">
              ✓
            </div>
            <div>
              <span>Active</span>
              <strong>{stats.active}</strong>
            </div>
          </div>

          <div className="aeloria-admin-users-stat-card">
            <div className="aeloria-admin-users-stat-icon red">
              ⏸
            </div>
            <div>
              <span>Inactive</span>
              <strong>{stats.inactive}</strong>
            </div>
          </div>
        </section>

        {/* Users Panel */}
        <section className="aeloria-admin-users-panel">
          <div className="aeloria-admin-users-panel-header">
            <div>
              <h2>All Users</h2>
              <p>
                {filteredUsers.length} user
                {filteredUsers.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="aeloria-admin-users-filters">
            <div className="aeloria-admin-users-search">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="admin">Admins</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              className="aeloria-admin-users-refresh"
              onClick={fetchUsers}
            >
              ↻ Refresh
            </button>
          </div>

          {/* Table */}
          {filteredUsers.length === 0 ? (
            <div className="aeloria-admin-users-empty">
              <div>👥</div>
              <h3>No users found</h3>
              <p>
                Try changing your search or filter options.
              </p>
            </div>
          ) : (
            <div className="aeloria-admin-users-table-wrapper">
              <table className="aeloria-admin-users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Activity</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="aeloria-admin-user-info">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={`${user.firstName || "User"} profile`}
                              className="aeloria-admin-user-avatar"
                            />
                          ) : (
                            <div className="aeloria-admin-user-avatar aeloria-admin-user-avatar-placeholder">
                              {getInitials(user)}
                            </div>
                          )}

                          <div>
                            <strong>
                              {user.firstName || ""}{" "}
                              {user.lastName || ""}
                            </strong>
                            <span>
                              ID: {user._id?.slice(-8) || "—"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="aeloria-admin-user-email">
                          {user.email}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`aeloria-admin-user-role ${
                            user.role === "admin"
                              ? "admin"
                              : "student"
                          }`}
                        >
                          {user.role === "admin"
                            ? "Admin"
                            : "Student"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`aeloria-admin-user-status ${
                            user.isActive ? "active" : "inactive"
                          }`}
                        >
                          <span></span>
                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <span className="aeloria-admin-user-date">
                          {formatDate(user.createdAt)}
                        </span>
                      </td>

                      <td>
                        <div className="aeloria-admin-user-activity">
                          <span>
                            Enrolled:{" "}
                            {user.enrolledCourses?.length || 0}
                          </span>
                          <span>
                            Completed:{" "}
                            {user.completedCourses?.length || 0}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="aeloria-admin-user-actions">
                          <Link
                            to={`/admin/users/edit/${user._id}`}
                            className="aeloria-admin-user-action edit"
                            title="Edit User"
                          >
                            ✏️
                          </Link>

                          <button
                            className={`aeloria-admin-user-action status ${
                              user.isActive
                                ? "deactivate"
                                : "activate"
                            }`}
                            onClick={() =>
                              handleToggleStatus(user._id)
                            }
                            title={
                              user.isActive
                                ? "Deactivate User"
                                : "Activate User"
                            }
                          >
                            {user.isActive ? "⏸" : "▶"}
                          </button>

                          <button
                            className="aeloria-admin-user-action delete"
                            onClick={() =>
                              handleDelete(user._id)
                            }
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminUsers;
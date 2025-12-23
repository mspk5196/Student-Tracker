import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const MENU_BY_ROLE = {
  ADMIN: [
    { label: "Dashboard", icon: DashboardIcon, path: "/" },
    { label: "Faculty", icon: SchoolIcon, path: "/faculty" },
    { label: "Students", icon: EmojiEventsIcon, path: "/students" },
    { label: "Settings", icon: SettingsIcon, path: "/settings" },
  ],

  FACULTY: [
    { label: "Dashboard", icon: DashboardIcon, path: "/" },
    { label: "Classes", icon: SchoolIcon, path: "/classes" },
    { label: "Tasks", icon: AssignmentIcon, path: "/tasks" },
    { label: "Attendance", icon: EventAvailableIcon, path: "/attendance" },
  ],

  STUDENT: [
    { label: "Dashboard", icon: DashboardIcon, path: "/" },
    { label: "My Classes", icon: SchoolIcon, path: "/classes" },
    { label: "Assignments", icon: AssignmentIcon, path: "/assignments" },
    { label: "Attendance", icon: EventAvailableIcon, path: "/attendance" },
  ],
};

const SideTab = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const menu = MENU_BY_ROLE[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.header}>
        <MenuBookIcon sx={{ fontSize: 32, color: "#1976d2" }} />
        <h3>{user.role} Panel</h3>
      </div>

      {/* Menu */}
      <nav style={styles.nav}>
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.link,
                background: isActive ? "#e3f2fd" : "transparent",
              })}
            >
              <Icon />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <button style={styles.logout} onClick={handleLogout}>
        <LogoutIcon />
        Logout
      </button>
    </aside>
  );
};

export default SideTab;

/* ---------------- STYLES ---------------- */

const styles = {
  sidebar: {
    width: 260,
    height: "100vh",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #ddd",
  },
  header: {
    padding: 20,
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderBottom: "1px solid #ddd",
  },
  nav: {
    flex: 1,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  link: {
    padding: "10px 12px",
    display: "flex",
    gap: 12,
    alignItems: "center",
    textDecoration: "none",
    color: "#333",
    borderRadius: 6,
    fontWeight: 500,
  },
  logout: {
    padding: 12,
    border: "none",
    background: "#fff",
    borderTop: "1px solid #ddd",
    cursor: "pointer",
    display: "flex",
    gap: 10,
    alignItems: "center",
    color: "#d32f2f",
    fontWeight: 500,
  },
};

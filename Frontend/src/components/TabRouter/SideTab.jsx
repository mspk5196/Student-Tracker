import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BarChart3,
  Settings,
  Bell,
  Layers,
  LogOut,
  CalendarCheck,
  ClipboardCheck
} from 'lucide-react';

const SideTab = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const topPath = segments[0] || 'dashboard';
    setActiveTab(topPath);
  }, [location]);

  /* ================= ROLE BASED MENU ================= */
  const menuByRole = {
    "admin": [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
      { id: 'faculty', label: 'Faculty & Accounts', icon: Users, section: 'main' },
      { id: 'classes', label: 'Classes & Groups', icon: Layers, section: 'main' },
      { id: 'students', label: 'Students', icon: Users, section: 'main' },
      { id: 'attendance', label: 'Attendance', icon: CalendarCheck, section: 'academic' },
      { id: 'tasks', label: 'Tasks', icon: ClipboardCheck, section: 'academic' },
      { id: 'reports', label: 'Reports', icon: BarChart3, section: 'academic' },
      { id: 'settings', label: 'Settings', icon: Settings, section: 'system' },
    ],
    "faculty": [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
      { id: 'classes', label: 'My Classes / Groups', icon: Layers, section: 'main' },
      { id: 'students', label: 'Students', icon: Users, section: 'main' },
      { id: 'attendance', label: 'Attendance', icon: CalendarCheck, section: 'academic' },
      { id: 'tasks', label: 'Task & Assignment', icon: ClipboardCheck, section: 'academic' },
      { id: 'reports', label: 'Reports', icon: BarChart3, section: 'academic' },
      { id: 'settings', label: 'Settings', icon: Settings, section: 'system' },
    ],
    "student": [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
      { id: 'classes', label: 'My Classes', icon: Layers, section: 'main' },
      { id: 'attendance', label: 'My Attendance', icon: CalendarCheck, section: 'main' },
      { id: 'tasks', label: 'My Tasks', icon: ClipboardCheck, section: 'main' },
    ],
  };

  const menuItems = menuByRole[user?.role] || [];

  const tabContent = {
    dashboard: { title: 'Dashboard' },
    faculty: { title: 'Faculty & Accounts' },
    classes: { title: 'My Classes / Groups' },
    students: { title: 'Students' },
    attendance: { title: 'Attendance' },
    tasks: { title: 'Task & Assignment' },
    reports: { title: 'Reports' },
    settings: { title: 'Settings' },
  };

  const handleNavigation = (id) => {
    setActiveTab(id);
    navigate(id === 'dashboard' ? '/' : id);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <div
        key={item.id}
        style={{
          ...styles.navItem,
          ...(isActive ? styles.navItemActive : {})
        }}
        onClick={() => handleNavigation(item.id)}
      >
        <Icon size={20} />
        <span>{item.label}</span>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* ================= SIDEBAR ================= */}
      <aside style={styles.sidebar}>
        {/* LOGO */}
        <div style={styles.logo}>
          <div style={styles.logoContent}>
            <div style={styles.logoIcon}>
              <GraduationCap size={24} color="#ffffff" />
            </div>
            <span style={styles.logoText}>Academia</span>
          </div>
        </div>

        {/* NAV + SCROLL */}
        <div style={styles.navWrapper}>
          <nav style={styles.nav}>
            {menuItems.filter(i => i.section === 'main').map(renderNavItem)}

            {menuItems.some(i => i.section === 'academic') && (
              <div style={styles.navSection}>
                <div style={styles.navSectionTitle}>ACADEMIC</div>
                {menuItems.filter(i => i.section === 'academic').map(renderNavItem)}
              </div>
            )}

            {menuItems.some(i => i.section === 'system') && (
              <div style={styles.navSection}>
                <div style={styles.navSectionTitle}>SYSTEM</div>
                {menuItems.filter(i => i.section === 'system').map(renderNavItem)}
              </div>
            )}
          </nav>
        </div>

        {/* LOGOUT FIXED AT BOTTOM */}
        <div style={styles.logoutWrapper}>
          <div
            style={{ ...styles.navItem, color: '#ef4444' }}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>
              {menuItems.find(i => i.id === activeTab)?.label || tabContent[activeTab]?.title || 'Dashboard'}
            </h1>

            <div style={styles.headerRight}>
              <button style={styles.bellButton}>
                <Bell size={24} />
              </button>

              <div style={styles.userInfo}>
                <div style={styles.userText}>
                  <div style={styles.userName}>{user?.name || 'User'}</div>
                  <div style={styles.userRole}>
                    {user?.role === 1 && 'Super Admin'}
                    {user?.role === 2 && 'Faculty'}
                    {user?.role === 3 && 'Student'}
                  </div>
                </div>
                <div style={styles.userAvatar} />
              </div>
            </div>
          </div>
        </header>

        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SideTab;

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },

  /* ================= SIDEBAR ================= */
  sidebar: {
    width: '260px',
    minWidth: '260px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e5e7eb'
  },
  logo: {
    padding: '14px 20px',
    borderBottom: '1px solid #e5e7eb'
  },
  logoContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#2563eb',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827'
  },

  // Scrollable menu
  navWrapper: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column'
  },
  navSection: {
    marginBottom: '24px'
  },
  navSectionTitle: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#9ca3af',
    padding: '0 16px',
    marginBottom: '12px',
    letterSpacing: '0.05em'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'all 0.2s',
    color: '#6b7280',
    fontWeight: '500'
  },
  navItemActive: {
    backgroundColor: '#eff6ff',
    color: '#2563eb'
  },

  logoutWrapper: {
    padding: '5px',
    borderTop: '1px solid #e5e7eb',
  },

  /* ================= MAIN ================= */
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },

  /* ================= HEADER ================= */
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '12px 32px',
    boxSizing: 'border-box'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  bellButton: {
    padding: '8px',
    color: '#9ca3af',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent'
  },

  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  userText: {
    textAlign: 'right'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827'
  },
  userRole: {
    fontSize: '12px',
    color: '#6b7280'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #fb923c 0%, #ec4899 100%)',
    borderRadius: '50%'
  },

  /* ================= CONTENT ================= */
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px'
  }
};

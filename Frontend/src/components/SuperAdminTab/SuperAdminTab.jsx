import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  User,
  GraduationCap,
  CheckCircle,
  BarChart3,
  Settings,
  Bell,
  Layers,
  Clock
} from 'lucide-react';

const AcademiaDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

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
      width: '300px',
      minWidth: '300px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column'
    },
    logo: {
      padding: '24px',
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

    nav: {
      flex: 1,
      padding: '16px'
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
      padding: '12px 16px',
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
      padding: '16px 32px',
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
      padding: '32px'
    },
    tabContent: {
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    },
    tabTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '8px'
    },
    tabDescription: {
      fontSize: '14px',
      color: '#6b7280'
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
    { id: 'faculty', label: 'Faculty & Accounts', icon: Users, section: 'main' },
    { id: 'classes', label: 'Classes & Groups', icon: Layers, section: 'main' },
    { id: 'students', label: 'Students', icon: User, section: 'main' },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle, section: 'academic' },
    { id: 'tasks', label: 'Tasks & Assignments', icon: Clock, section: 'academic' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, section: 'academic' },
    { id: 'settings', label: 'Settings', icon: Settings, section: 'system' }
  ];

  const tabContent = {
    dashboard: {
      title: 'Dashboard',
      description:
        'Welcome to the Academia Dashboard. View your institution overview and key metrics here.'
    },
    faculty: {
      title: 'Faculty & Accounts',
      description: 'Manage faculty members, staff accounts, and their permissions.'
    },
    classes: {
      title: 'Classes & Groups',
      description: 'Organize and manage classes, groups, and course structures.'
    },
    students: {
      title: 'Students',
      description: 'View and manage student information, enrollment, and academic records.'
    },
    attendance: {
      title: 'Attendance',
      description: 'Track and manage student attendance across all classes and departments.'
    },
    tasks: {
      title: 'Tasks & Assignments',
      description: 'Create, assign, and track tasks and assignments for students.'
    },
    reports: {
      title: 'Reports & Analytics',
      description: 'Generate comprehensive reports and analyze institutional data.'
    },
    settings: {
      title: 'Settings',
      description: 'Configure system settings, preferences, and administrative options.'
    }
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
        onClick={() => setActiveTab(item.id)}
      >
        <Icon size={20} />
        <span>{item.label}</span>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoContent}>
            <div style={styles.logoIcon}>
              <GraduationCap size={24} color="#ffffff" />
            </div>
            <span style={styles.logoText}>Academia</span>
          </div>
        </div>

        <nav style={styles.nav}>
          {menuItems.filter(i => i.section === 'main').map(renderNavItem)}

          <div style={styles.navSection}>
            <div style={styles.navSectionTitle}>ACADEMIC</div>
            {menuItems.filter(i => i.section === 'academic').map(renderNavItem)}
          </div>

          <div style={styles.navSection}>
            <div style={styles.navSectionTitle}>SYSTEM</div>
            {menuItems.filter(i => i.section === 'system').map(renderNavItem)}
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>{tabContent[activeTab].title}</h1>
            <div style={styles.headerRight}>
              <button style={styles.bellButton}>
                <Bell size={24} />
              </button>
              <div style={styles.userInfo}>
                <div style={styles.userText}>
                  <div style={styles.userName}>Alex Morgan</div>
                  <div style={styles.userRole}>Super Admin</div>
                </div>
                <div style={styles.userAvatar} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={styles.content}>
          <div style={styles.tabContent}>
            <h2 style={styles.tabTitle}>{tabContent[activeTab].title}</h2>
            <p style={styles.tabDescription}>{tabContent[activeTab].description}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AcademiaDashboard;
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const FacultyTab = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  // Navigation configuration with Material Icons
  const navItems = [
    {
      icon: DashboardIcon,
      label: 'Dashboard',
      path: '/',
      description: 'Overview and statistics'
    },
    {
      icon: SchoolIcon,
      label: 'My Classes',
      path: '/classes',
      description: 'Manage your classes'
    },
    {
      icon: AssignmentIcon,
      label: 'Tasks',
      path: '/tasks',
      description: 'Assign and track tasks'
    },
    {
      icon: EventAvailableIcon,
      label: 'Attendance',
      path: '/attendance',
      description: 'Mark attendance'
    },
    {
      icon: EmojiEventsIcon,
      label: 'Skill Tracking',
      path: '/skills',
      description: 'Track student skills'
    },
  ];

  // Event Handlers
  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked');
    // Example: navigate to login page, clear session, etc.
  };

  // Render Functions
  const renderLogo = () => (
    <div style={styles.header}>
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>
          <MenuBookIcon sx={{ fontSize: 32, color: 'white' }} />
        </div>
        <div style={styles.logoTextContainer}>
          <h1 style={styles.logoText}>EduTrack</h1>
          <span style={styles.subtitle}>Faculty Portal</span>
        </div>
      </div>
    </div>
  );

  const renderNavItem = (item, index) => {
    const NavIcon = item.icon;

    return (
      <li key={item.path} style={styles.navItem}>
        <NavLink
          to={item.path}
          style={({ isActive }) => getNavLinkStyle(isActive, hoveredItem === index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          {({ isActive }) => (
            <>
              <div style={getIconStyle(isActive)}>
                <NavIcon sx={{ fontSize: 24 }} />
              </div>
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      </li>
    );
  };

  const renderNavigation = () => (
    <nav style={styles.navContainer}>
      <ul style={styles.navList}>
        {navItems.map((item, index) => renderNavItem(item, index))}
      </ul>
    </nav>
  );

  const renderLogoutButton = () => (
    <div style={styles.logoutContainer}>
      <button
        style={getLogoutButtonStyle(hoveredItem === 'logout')}
        onMouseEnter={() => handleMouseEnter('logout')}
        onMouseLeave={handleMouseLeave}
        onClick={handleLogout}
      >
        <div style={styles.logoutIcon}>
          <LogoutIcon sx={{ fontSize: 24 }} />
        </div>
        <span>Logout</span>
      </button>
    </div>
  );

  // Style Functions
  const getNavLinkStyle = (isActive, isHovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 16px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: isActive ? '500' : '400',
    color: isActive ? '#1976d2' : 'rgba(0, 0, 0, 0.87)',
    background: isActive
      ? 'rgba(25, 118, 210, 0.08)'
      : isHovered
        ? 'rgba(0, 0, 0, 0.04)'
        : 'transparent',
    transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    position: 'relative',
    overflow: 'hidden',
    letterSpacing: '0.01071em',
  });

  const getIconStyle = (isActive) => ({
    minWidth: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isActive ? '#1976d2' : 'rgba(0, 0, 0, 0.54)',
    transition: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  });

  const getLogoutButtonStyle = (isHovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 16px',
    borderRadius: '4px',
    width: '100%',
    border: 'none',
    background: isHovered ? 'rgba(211, 47, 47, 0.04)' : 'transparent',
    color: '#d32f2f',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '400',
    transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    letterSpacing: '0.01071em',
    fontFamily: 'inherit',
  });

  return (
    <aside style={styles.sidebar}>
      {renderLogo()}
      {renderNavigation()}
      {renderLogoutButton()}
    </aside>
  );
};

// Styles Object
const styles = {
  sidebar: {
    position: 'sticky',
    top: 0,
    height: '100vh',
    width: '280px',
    background: '#ffffff',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  header: {
    padding: '20px 16px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
  },
  logoTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.87)',
    margin: 0,
    lineHeight: 1.2,
    letterSpacing: '0.0075em',
  },
  subtitle: {
    fontSize: '0.75rem',
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '400',
    marginTop: '2px',
    letterSpacing: '0.03333em',
    textTransform: 'uppercase',
  },
  navContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 0',
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: '0 8px',
  },
  navItem: {
    marginBottom: '8px',
  },
  logoutContainer: {
    padding: '8px',
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  },
  logoutIcon: {
    minWidth: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#d32f2f',
  },
};

export default FacultyTab;
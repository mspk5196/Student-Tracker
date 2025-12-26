import React, { useState } from 'react';
import AssignmentDashboard from './Task-Assignment-page/Task&assignments';
import StudyRoadmap from './Study-Road-Map/RoadMap';

const TaskHeader = () => {
  const [activeTab, setActiveTab] = useState('roadmap');

  // --- SVG Icons ---
  const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  return (
    <div style={styles.pageWrapper}>
      {/* STICKY HEADER WRAPPER */}
      <div style={styles.stickyHeader}>
        <div style={styles.headerContainer}>
          {/* Left Section: Tabs and Dropdown */}
          <div style={styles.leftSection}>
            <div style={styles.toggleContainer}>
              <button 
                onClick={() => setActiveTab('assignments')}
                style={{
                  ...styles.tab,
                  ...(activeTab === 'assignments' ? styles.activeTab : styles.inactiveTab)
                }}
              >
                Assignments
              </button>
              <button 
                onClick={() => setActiveTab('roadmap')}
                style={{
                  ...styles.tab,
                  ...(activeTab === 'roadmap' ? styles.activeTab : styles.inactiveTab)
                }}
              >
                Study Roadmap
              </button>
            </div>

            <div style={styles.dropdownContainer}>
              <span style={styles.dropdownText}>CS-201: Data Structures</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          {/* Right Section: Buttons */}
          <div style={styles.rightSection}>
            <button style={styles.outlineBtn}>
              <EyeIcon />
              Student View
            </button>
            <button style={styles.primaryBtn}>
              <PlusIcon />
              Add Day / Module
            </button>
          </div>
        </div>
      </div>

      {/* SCROLLING CONTENT AREA */}
      <div style={styles.contentArea}>
        {/* Placeholder for long content to demonstrate scrolling */}
        <div style={styles.contentPlaceholder}>
          {activeTab === 'assignments' ? (
            <AssignmentDashboard/>
          ) : (
            <StudyRoadmap/>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Styles JSON ---
const styles = {
  pageWrapper: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  stickyHeader: {
    position: 'sticky',
    top: 0,             // Stick to the very top
    zIndex: 1000,       // Ensure it is above the scrolling content
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '12px 20px',
  },
  headerContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  toggleContainer: {
    display: 'flex',
    backgroundColor: '#f1f5f9',
    padding: '4px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  tab: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    backgroundColor: '#ffffff',
    color: '#1e293b',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  inactiveTab: {
    backgroundColor: 'transparent',
    color: '#64748b',
  },
  dropdownContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
  },
  dropdownText: {
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '400',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  outlineBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 18px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    cursor: 'pointer',
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 18px',
    backgroundColor: '#0066ff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
  },
  contentArea: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  contentPlaceholder: {
    marginTop: '10px',
  },
  viewBox: {
    padding: '40px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    color: '#1e293b',
  },
  spacer: {
    height: '1500px', // Just to force a scrollbar
    paddingTop: '20px',
    color: '#94a3b8',
    fontStyle: 'italic',
  }
};

export default TaskHeader;
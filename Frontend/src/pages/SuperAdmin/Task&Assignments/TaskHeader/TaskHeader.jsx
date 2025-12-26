import React, { useState, useEffect } from 'react';
import AssignmentDashboard from './Task-Assignment-page/Task&assignments';
import StudyRoadmap from './Study-Road-Map/RoadMap';

const TaskHeader = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [addDayTrigger, setAddDayTrigger] = useState(0);

  // --- SKILLS/COURSES DATA ---
  const skillsData = [
    { id: 1, name: 'React Mastery Workshop', code: 'REACT-101' },
    { id: 2, name: 'HTML & CSS Fundamentals', code: 'WEB-201' },
    { id: 3, name: 'JavaScript Deep Dive', code: 'JS-301' },
    { id: 4, name: 'Node.js Backend Development', code: 'NODE-401' },
    { id: 5, name: 'UI/UX Design Principles', code: 'DESIGN-501' }
  ];

  useEffect(() => {
    // Initialize with first skill
    if (skillsData.length > 0 && !selectedSkill) {
      setSelectedSkill(skillsData[0].code);
    }
    setSkills(skillsData);
  }, []);

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

  // Function to handle Add Day/Module button click
  const handleAddModule = () => {
    // First switch to roadmap tab
    setActiveTab('roadmap');
    
    // Then trigger the add day action after a small delay to ensure component is rendered
    setTimeout(() => {
      setAddDayTrigger(prev => prev + 1);
    }, 100);
  };

  // Handle skill change
  const handleSkillChange = (e) => {
    setSelectedSkill(e.target.value);
  };

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
              <select
                value={selectedSkill}
                onChange={handleSkillChange}
                style={styles.dropdownSelect}
              >
                {skills.map(skill => (
                  <option key={skill.id} value={skill.code}>
                    {skill.code}: {skill.name}
                  </option>
                ))}
              </select>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }}>
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
          </div>
        </div>
      </div>

      {/* SCROLLING CONTENT AREA */}
      <div style={styles.contentArea}>
        <div style={styles.contentPlaceholder}>
          {activeTab === 'assignments' ? (
            <AssignmentDashboard selectedSkill={selectedSkill} />
          ) : (
            <StudyRoadmap 
              selectedSkill={selectedSkill} 
              isActiveTab={activeTab === 'roadmap'}
              addDayTrigger={addDayTrigger}
              key={`${selectedSkill}-${addDayTrigger}`} // Force re-render when skill or trigger changes
            />
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
    top: 0,
    zIndex: 1000,
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
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    minWidth: '220px',
  },
  dropdownSelect: {
    width: '100%',
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '400',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    appearance: 'none',
    outline: 'none',
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
  }
};

export default TaskHeader;
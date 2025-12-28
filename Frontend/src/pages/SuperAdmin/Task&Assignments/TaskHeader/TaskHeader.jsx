import React, { useState, useEffect } from 'react';
import AssignmentDashboard from './Task-Assignment-page/Task&assignments';
import StudyRoadmap from './Study-Road-Map/RoadMap';

const TaskHeader = () => {
    const [activeTab, setActiveTab] = useState('assignments');
    const [selectedSkill, setSelectedSkill] = useState('');
    const [skills, setSkills] = useState([]);
    const [addDayTrigger, setAddDayTrigger] = useState(0);

    // --- Responsive State ---
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- SKILLS/COURSES DATA ---
    const skillsData = [
        { id: 1, name: 'React Mastery Workshop', code: 'REACT-101' },
        { id: 2, name: 'HTML & CSS Fundamentals', code: 'WEB-201' },
        { id: 3, name: 'JavaScript Deep Dive', code: 'JS-301' },
        { id: 4, name: 'Node.js Backend Development', code: 'NODE-401' },
        { id: 5, name: 'UI/UX Design Principles', code: 'DESIGN-501' }
    ];

    useEffect(() => {
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

    // Handle skill change
    const handleSkillChange = (e) => {
        setSelectedSkill(e.target.value);
    };

    // --- Dynamic Styles Based on Screen Size ---
    const responsiveStyles = {
        stickyHeader: {
            ...styles.stickyHeader,
            padding: isMobile ? '12px 16px' : '16px 24px',
        },
        headerContainer: {
            ...styles.headerContainer,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: isMobile ? '16px' : '0',
        },
        leftSection: {
            ...styles.leftSection,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: isMobile ? '12px' : '20px',
        },
        toggleContainer: {
            ...styles.toggleContainer,
            width: isMobile ? '100%' : 'auto',
        },
        tab: {
            ...styles.tab,
            flex: isMobile ? 1 : 'none',
            textAlign: 'center',
        },
        dropdownContainer: {
            ...styles.dropdownContainer,
            minWidth: isMobile ? '100%' : '220px',
        },
        contentArea: {
            ...styles.contentArea,
            padding: isMobile ? '10px 16px' : '10px 24px',
        }
    };

    return (
        <div style={styles.pageWrapper}>
            {/* STICKY HEADER WRAPPER */}
            <div style={responsiveStyles.stickyHeader}>
                <div style={responsiveStyles.headerContainer}>
                    {/* Left Section: Tabs and Dropdown */}
                    <div style={responsiveStyles.leftSection}>
                        <div style={responsiveStyles.toggleContainer}>
                            <button
                                onClick={() => setActiveTab('assignments')}
                                style={{
                                    ...responsiveStyles.tab,
                                    ...(activeTab === 'assignments' ? styles.activeTab : styles.inactiveTab)
                                }}
                            >
                                Assignments
                            </button>
                            <button
                                onClick={() => setActiveTab('roadmap')}
                                style={{
                                    ...responsiveStyles.tab,
                                    ...(activeTab === 'roadmap' ? styles.activeTab : styles.inactiveTab)
                                }}
                            >
                                Study Roadmap
                            </button>
                        </div>

                        <div style={responsiveStyles.dropdownContainer}>
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
                    <div style={{ ...styles.rightSection, justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
                        <button style={styles.outlineBtn}>
                            <EyeIcon />
                            Student View
                        </button>
                    </div>
                </div>
            </div>

            {/* SCROLLING CONTENT AREA */}
            <div style={responsiveStyles.contentArea}>
                <div style={styles.contentPlaceholder}>
                    {activeTab === 'assignments' ? (
                        <AssignmentDashboard selectedSkill={selectedSkill} />
                    ) : (
                        <StudyRoadmap
                            selectedSkill={selectedSkill}
                            isActiveTab={activeTab === 'roadmap'}
                            addDayTrigger={addDayTrigger}
                            key={`${selectedSkill}-${addDayTrigger}`}
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
        margin: '-24px -24px 0 -24px',
        overflowX: 'hidden' // Prevent horizontal scroll on mobile
    },
    stickyHeader: {
        position: 'sticky',
        top: -25,
        zIndex: 1000,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        width: '100%',
        boxSizing: 'border-box'
    },
    headerContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftSection: {
        display: 'flex',
        alignItems: 'center',
    },
    toggleContainer: {
        display: 'flex',
        backgroundColor: '#f1f5f9',
        padding: '4px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxSizing: 'border-box'
    },
    tab: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px', // Slightly smaller for mobile fit
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
    },
    dropdownSelect: {
        width: '100%',
        padding: '10px 32px 10px 16px', // Extra right padding for custom arrow
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
    contentArea: {
        width: '100%',
        boxSizing: 'border-box'
    },
    contentPlaceholder: {
        marginTop: '0px',
    }
};

export default TaskHeader;
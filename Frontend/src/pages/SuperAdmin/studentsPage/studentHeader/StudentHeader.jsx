
import React, { useState } from 'react';

/**
 * Student Data JSON
 */
const STUDENT_DATA = {
  name: "Alexander Pierce",
  id: "ST-2024-8842",
  department: "Faculty of Applied Sciences",
  major: "Quantum Computing & Physics",
  year: "3rd Year",
  semester: "Semester 6",
  batch: "2021-2025",
  group: "Alpha-1",
  avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200",
  email: "a.pierce@university.edu",
  academicStatus: "Dean's List",
  credits: 112,
  gpa: "3.92"
};

/**
 * React Inline Styles (JSON format)
 */
const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#F9FAFB',
    color: '#1e293b',
    overflow: 'hidden',
  },
  fixedHeader: {
    flexShrink: 0,
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px 24px 0 24px',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '20px',
  },
  avatarBox: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarImg: {
    width: '80px',
    height: '80px',
    borderRadius: '14px',
    objectFit: 'cover',
    border: '3px solid #fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  statusBadge: {
    position: 'absolute',
    bottom: '-6px',
    right: '-6px',
    background: '#10b981',
    color: 'white',
    fontSize: '9px',
    fontWeight: '800',
    padding: '3px 7px',
    borderRadius: '12px',
    border: '2px solid white',
    textTransform: 'uppercase',
  },
  profileInfo: {
    flexGrow: 1,
  },
  profileHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  studentName: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  studentMajor: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: '13px',
    marginTop: '2px',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  btn: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    transition: 'background 0.2s',
  },
  btnPrimary: {
    background: '#2563eb',
    color: 'white',
  },
  btnSecondary: {
    background: '#f1f5f9',
    color: '#475569',
    border: '1px solid #e2e8f0',
  },
  statsRow: {
    display: 'flex',
    gap: '32px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '2px',
  },
  statValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  tabsNav: {
    display: 'flex',
    gap: '28px',
    marginTop: '4px',
  },
  tabButton: {
    padding: '14px 2px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    background: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s',
  },
  activeTabButton: {
    color: '#2563eb',
    borderBottomColor: '#2563eb',
  },
  scrollContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '30px 24px',
  },
  contentWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    minHeight: '80vh', // Ensure it's long enough to test scrolling
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '600',
    color: '#94a3b8',
  }
};

const StudentHeader = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Attendance', 'Coursework', 'Exams', 'Finance'];

  return (
    <div style={styles.appContainer}>
      {/* FIXED HEADER */}
      <header style={styles.fixedHeader}>
        <div style={styles.headerInner}>
          <div style={styles.profileSection}>
            <div style={styles.avatarBox}>
              <img 
                src={STUDENT_DATA.avatar} 
                alt={STUDENT_DATA.name} 
                style={styles.avatarImg} 
              />
              <div style={styles.statusBadge}>{STUDENT_DATA.academicStatus}</div>
            </div>

            <div style={styles.profileInfo}>
              <div style={styles.profileHeaderRow}>
                <div>
                  <h1 style={styles.studentName}>{STUDENT_DATA.name}</h1>
                  <div style={styles.studentMajor}>{STUDENT_DATA.major}</div>
                </div>
                <div style={styles.actionButtons}>
                  <button style={{ ...styles.btn, ...styles.btnSecondary }}>Report</button>
                  <button style={{ ...styles.btn, ...styles.btnPrimary }}>Edit Profile</button>
                </div>
              </div>

              <div style={styles.statsRow}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>ID No.</span>
                  <span style={styles.statValue}>{STUDENT_DATA.id}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Academic Year</span>
                  <span style={styles.statValue}>{STUDENT_DATA.year}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>GPA</span>
                  <span style={{ ...styles.statValue, color: '#10b981' }}>{STUDENT_DATA.gpa}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Section</span>
                  <span style={styles.statValue}>{STUDENT_DATA.group}</span>
                </div>
              </div>
            </div>
          </div>

          <nav style={styles.tabsNav}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tabButton,
                  ...(activeTab === tab ? styles.activeTabButton : {})
                }}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* SCROLLABLE CONTENT */}
      <main style={styles.scrollContainer}>
        <div style={styles.contentWrapper}>
          {activeTab} Component Area
        </div>
      </main>
    </div>
  );
};

export default StudentHeader;

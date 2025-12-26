import React, { useState } from 'react';
// Correct Professional Icons from Material UI
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import AssignmentIndIcon from '@mui/icons-material/AssignmentIndOutlined'; 
import BookIcon from '@mui/icons-material/MenuBookOutlined'; 
import LayersIcon from '@mui/icons-material/LayersOutlined'; 
import PeopleIcon from '@mui/icons-material/PeopleOutlined'; 

// Tabs component
import Overview from './Overview/Overview';
import AttendanceDashboard from './Attendance/Attendance';
import TaskGrade from './Task&Grades/TaskGrade';
import Ranking from './Ranking/Ranking';

const DATA = {
  name: "Emma Watson",
  id: "20230045",
  major: "Computer Science",
  year: "3rd Year (Sem 5)",
  group: "Group CS-A",
  avatar: "https://i.pravatar.cc/150?u=s1"
};

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#fff',
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh', // Ensure page is scrollable
  },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    border: '1px solid #eef2f6',
    borderRadius: '12px',
    padding: '32px',
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    marginBottom: '20px',
  },
  avatarContainer: { marginRight: '28px' },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    padding: '3px',
    background: 'white',
    border: '1.5px solid #d1e1fb',
  },
  infoArea: { flexGrow: 1 },
  name: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 10px 0',
    letterSpacing: '-0.02em',
  },
  metaRow: { display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', fontWeight: '500' },
  metaIcon: { fontSize: '16px', color: '#94a3b8' },
  btnGroup: { position: 'absolute', top: '32px', right: '32px', display: 'flex', gap: '12px' },
  btnOutline: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    cursor: 'pointer',
  },
  // STICKY NAVBAR LOGIC
  navBar: {
    display: 'flex',
    gap: '35px',
    position: 'sticky',     // Makes the element sticky
    top: -25,                 // Sticks to the very top of the viewport
    backgroundColor: '#fff', // Important: covers content scrolling underneath
    zIndex: 1000,           // Ensures it stays above the dashboard content
    borderBottom: '1px solid #f1f5f9', // Optional: adds definition when sticky
    paddingTop: '10px',
  },
  tab: {
    padding: '14px 2px',
    fontSize: '15px',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    borderBottom: '3px solid transparent',
    transition: '0.2s ease',
    marginBottom: '-1px', // Aligns with the borderBottom of navBar
  },
  tabActive: {
    color: '#2563eb',
    borderBottomColor: '#2563eb',
  }
};

const StudentHeader = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Attendance', 'Tasks & Grades', 'Ranking'];

  return (
    <div style={styles.container}>
      
      {/* 1. Profile Card (Will scroll away) */}
      <div style={styles.profileCard}>
        <div style={styles.avatarContainer}>
          <img src={DATA.avatar} alt={DATA.name} style={styles.avatar} />
        </div>

        <div style={styles.infoArea}>
          <h1 style={styles.name}>{DATA.name}</h1>
          <div style={styles.metaRow}>
            <span style={styles.metaItem}><AssignmentIndIcon style={styles.metaIcon} /> ID: {DATA.id}</span>
            <span style={styles.metaItem}><BookIcon style={styles.metaIcon} /> {DATA.major}</span>
            <span style={styles.metaItem}><LayersIcon style={styles.metaIcon} /> {DATA.year}</span>
            <span style={styles.metaItem}><PeopleIcon style={styles.metaIcon} /> {DATA.group}</span>
          </div>
        </div>

        <div style={styles.btnGroup}>
          <button style={styles.btnOutline}>
            <DownloadIcon sx={{ fontSize: 18 }} /> Download Report
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs (Will stick to top) */}
      <nav style={styles.navBar}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {borderBottom:'0px'})
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* 3. Component Content Area */}
      <div style={{ marginTop: '20px' }}>
        {activeTab === 'Overview' && <Overview />}
        {activeTab === 'Attendance' && <AttendanceDashboard />}
        {activeTab === 'Tasks & Grades' && <TaskGrade />}
        {activeTab === 'Ranking' && <Ranking />}
      </div>

    </div>
  );
};

export default StudentHeader;
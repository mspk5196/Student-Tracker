import React, { useState } from 'react';
// Correct Professional Icons from Material UI
import EditIcon from '@mui/icons-material/EditOutlined';
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import AssignmentIndIcon from '@mui/icons-material/AssignmentIndOutlined'; // ID
import BookIcon from '@mui/icons-material/MenuBookOutlined'; // Computer Science
import LayersIcon from '@mui/icons-material/LayersOutlined'; // Year
import PeopleIcon from '@mui/icons-material/PeopleOutlined'; // Group

import Overview from './Overview/Overview';
import AttendanceDashboard from './Attendance/Attendance';

/**
 * 1:1 Matching Data
 */
const DATA = {
  name: "Emma Watson",
  id: "20230045",
  major: "Computer Science",
  year: "3rd Year (Sem 5)",
  group: "Group CS-A",
  avatar: "https://i.pravatar.cc/150?u=emma" // Matching the profile look
};

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#fff',
    fontFamily: "'Inter', sans-serif",
  },
  // Main White Profile Box
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
  avatarContainer: {
    marginRight: '28px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    // Perfect Circle Ring Style from Image
    padding: '3px',
    background: 'white',
    border: '1.5px solid #d1e1fb',
  },
  infoArea: {
    flexGrow: 1,
  },
  name: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 10px 0',
    letterSpacing: '-0.02em',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
  },
  metaIcon: {
    fontSize: '16px',
    color: '#94a3b8',
  },
  // Button Group Aligned to Top Right of card
  btnGroup: {
    position: 'absolute',
    top: '32px',
    right: '32px',
    display: 'flex',
    gap: '12px',
  },
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
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: '#2563eb', // Pure profile blue
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer',
  },
  // Tab Bar Style (Below the card)
  navBar: {
    display: 'flex',
    gap: '35px',
    borderBottom: '1.5px solid #f1f5f9',
    marginTop: '10px',
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
  },
  tabActive: {
    color: '#2563eb',
    borderBottomColor: '#2563eb',
  }
};

const StudentHeader = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Attendance', 'Tasks & Grades', 'History'];

  return (
    <div style={styles.container}>
      
      {/* 1. Main Profile Card Wrapper */}
      <div style={styles.profileCard}>
        {/* Profile Circle Image */}
        <div style={styles.avatarContainer}>
          <img src={DATA.avatar} alt={DATA.name} style={styles.avatar} />
        </div>

        {/* Text Details Area */}
        <div style={styles.infoArea}>
          <h1 style={styles.name}>{DATA.name}</h1>
          
          <div style={styles.metaRow}>
            <span style={styles.metaItem}>
              <AssignmentIndIcon style={styles.metaIcon} /> ID: {DATA.id}
            </span>
            <span style={styles.metaItem}>
              <BookIcon style={styles.metaIcon} /> {DATA.major}
            </span>
            <span style={styles.metaItem}>
              <LayersIcon style={styles.metaIcon} /> {DATA.year}
            </span>
            <span style={styles.metaItem}>
              <PeopleIcon style={styles.metaIcon} /> {DATA.group}
            </span>
          </div>
        </div>

        {/* Buttons inside top-right card */}
        <div style={styles.btnGroup}>
          <button style={styles.btnOutline}>
            <DownloadIcon sx={{ fontSize: 18 }} /> Download Report
          </button>
          <button style={styles.btnPrimary}>
            <EditIcon sx={{ fontSize: 18 }} /> Edit Profile
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs (Correct List from Image) */}
      <nav style={styles.navBar}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {})
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
        {!['Overview', 'Attendance'].includes(activeTab) && (
            <div style={{ padding: '40px', color: '#94a3b8', fontSize: '18px' }}>
                Placeholder for {activeTab} Content
            </div>
        )}
      </div>

    </div>
  );
};

export default StudentHeader;
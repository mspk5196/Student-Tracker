import React, { useState } from 'react';
import AttendanceView from './AttendanceView/AttendanceView';
import SkillProficiencyView from './SkillProficiencyView/SkillProficiencyView';

const GroupInsights = () => {
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' or 'skills'
  const [selectedGroup, setSelectedGroup] = useState('CS-302 (Web Technologies)');
  const [academicYear, setAcademicYear] = useState('2024 - 2025');
  const [period, setPeriod] = useState('Today');
  const [selectedVenue, setSelectedVenue] = useState('');

  return (
    <div style={styles.container}>
      {/* Top Header Bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <div style={styles.headerFilterGroup}>
            <select style={styles.headerSelect} value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
              <option>All Groups</option>
              <option>CS-302 (Web Technologies)</option>
              <option>CS-303 (Data Structures)</option>
            </select>
          </div>
        </div>

        <div style={styles.topBarTabs}>
          <button 
            style={activeTab === 'attendance' ? styles.topTabActive : styles.topTab}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button 
            style={activeTab === 'skills' ? styles.topTabActive : styles.topTab}
            onClick={() => setActiveTab('skills')}
          >
            Skill Proficiency
          </button>
        </div>
      </div>

      <div style={styles.contentContainer}>
        {activeTab === 'attendance' ? (
          <AttendanceView 
            selectedGroup={selectedGroup}
            period={period}
            academicYear={academicYear}
            setAcademicYear={setAcademicYear}
            setPeriod={setPeriod}
          />
        ) : (
          <SkillProficiencyView 
            selectedGroup={selectedGroup}
            academicYear={academicYear}
            setAcademicYear={setAcademicYear}
            selectedVenue={selectedVenue}
            setSelectedVenue={setSelectedVenue}
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    boxSizing: 'border-box',
    padding: 0,
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  topBar: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e7eb',
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  headerFilterGroup: {
  },
  headerSelect: {
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1f2937',
    outline: 'none',
    backgroundColor: '#fff',
    minWidth: '220px',
  },
  topBarTabs: {
    display: 'flex',
    backgroundColor: '#f1f5f9',
    padding: '4px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  topTab: {
    padding: '8px 16px',
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  },
  topTabActive: {
    padding: '8px 16px',
    border: 'none',
    background: '#ffffff',
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '6px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
  },
  contentContainer: {
    padding: '12px 16px 24px 16px',
    flex: 1,
    overflowY: 'auto',
  },
  contextFilters: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '180px',
  },
  label: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1f2937',
    outline: 'none',
    backgroundColor: '#fff',
  },
  mainContent: {
  },
  sectionTitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
  },
  statsRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  statBox: {
    flex: 1,
    minWidth: '200px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  statLabel: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '8px',
    fontWeight: '500',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '4px',
  },
  statSub: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  tableControls: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  filterBadge: {
    padding: '6px 16px',
    borderRadius: '20px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#fff',
    color: '#374151',
    fontSize: '13px',
    cursor: 'pointer',
  },
  filterBadgeActive: {
    padding: '6px 16px',
    borderRadius: '20px',
    border: '1px solid #0066FF',
    backgroundColor: '#0066FF',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
  },
  tableCard: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      marginBottom: '32px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thRow: {
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tr: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #f3f4f6',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#1f2937',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-block',
  },
  sectionHeader: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    marginTop: '0px',
    marginBottom: '4px',
  },
  sectionSubHeader: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '16px',
  }
};

export default GroupInsights;
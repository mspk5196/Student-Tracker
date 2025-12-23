import React, { useState, useEffect } from 'react';
import {
  PeopleAltOutlined,
  LayersOutlined,
  TimelineOutlined,
  ErrorOutline
} from '@mui/icons-material';

// --- Custom Hook for Responsive Logic ---
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// --- Static Data ---
const DASHBOARD_DATA = {
  metrics: [
    { id: 1, label: 'Total Students', value: '2,450', trend: '+5.2%', trendContext: 'from last semester', isPositive: true, icon: <PeopleAltOutlined sx={{ fontSize: 20, color: '#64748b' }} /> },
    { id: 2, label: 'Active Groups', value: '86', context: 'Active classes this term', icon: <LayersOutlined sx={{ fontSize: 20, color: '#64748b' }} /> },
    { id: 3, label: 'Avg Attendance', value: '84.5%', trend: '-1.2%', trendContext: 'vs last week', isPositive: false, icon: <TimelineOutlined sx={{ fontSize: 20, color: '#64748b' }} /> },
    { id: 4, label: 'Tasks Due', value: '128', context: 'Within next 48 hours', icon: <ErrorOutline sx={{ fontSize: 20, color: '#64748b' }} /> },
  ],
  attendance: [
    { dept: 'CS', value: 92 }, { dept: 'Eng', value: 78 }, { dept: 'Bus', value: 85 },
    { dept: 'Arts', value: 65 }, { dept: 'Sci', value: 80 }, { dept: 'Med', value: 72 }, { dept: 'Law', value: 55 },
  ],
  alerts: [
    { id: '2023098', name: 'Sarah Jenkins', group: 'CS-101 Introduction', issue: 'Low Attendance (45%)', type: 'danger', date: 'Today, 10:30 AM', action: 'View Profile' },
    { id: '2023112', name: 'Michael Chang', group: 'ENG-204 Thermodynamics', issue: '3 Tasks Overdue', type: 'warning', date: 'Yesterday', action: 'Contact' },
    { id: '20233345', name: 'Priya Patel', group: 'BUS-301 Marketing', issue: 'Absent 3 Consecutive', type: 'danger', date: 'Oct 24, 2023', action: 'View Profile' },
    { id: '2023011', name: 'James Wilson', group: 'CS-102 Data Structures', issue: 'Late Submission', type: 'warning', date: 'Oct 23, 2023', action: 'Review' },
  ]
};

const EducationDashboard = () => {
  const { width } = useWindowSize();
  const [viewType, setViewType] = useState('Weekly');

  // Breakpoints
  const isMobile = width <= 768;
  const isTablet = width <= 1024 && width > 768;

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        {/* 1. Header Metrics Grid */}
        <div style={{
          ...styles.metricsGrid,
          gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr 1fr' : 'repeat(4, 1fr)')
        }}>
          {DASHBOARD_DATA.metrics.map(m => (
            <div key={m.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.metricLabel}>{m.label}</span>
                <div style={styles.iconContainer}>{m.icon}</div>
              </div>
              <h2 style={styles.metricValue}>{m.value}</h2>
              <div style={styles.metricFooter}>
                {m.trend && (
                  <span style={{ ...styles.trend, color: m.isPositive ? '#10b981' : '#ef4444' }}>
                    {m.trend}
                  </span>
                )}
                <span style={styles.footerText}>{m.trendContext || m.context}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Charts Row */}
        <div style={{
          ...styles.chartRow,
          flexDirection: isTablet || isMobile ? 'column' : 'row'
        }}>
          {/* Attendance Bar Chart */}
          <div style={{ ...styles.card, flex: 2 }}>
            <div style={styles.cardHeader}>
              <h3 style={styles.sectionTitle}>Attendance by Department</h3>
              <div style={styles.toggleGroup}>
                {['Weekly', 'Monthly'].map(type => (
                  <button
                    key={type}
                    onClick={() => setViewType(type)}
                    style={viewType === type ? styles.toggleActive : styles.toggleInactive}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.barChartContainer}>
              {DASHBOARD_DATA.attendance.map((item, index) => (
                <div key={item.dept} style={styles.barColumn}>
                  <div style={styles.barArea}>
                    <div style={{
                      ...styles.bar,
                      height: `${item.value}%`,
                      backgroundColor: index % 2 === 0 ? '#3b82f6' : '#dbeafe'
                    }} />
                  </div>
                  <span style={styles.barLabel}>{item.dept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Task Completion Donut */}
          <div style={{ ...styles.card, flex: 0.8, alignItems: 'center', minWidth: isMobile ? 'auto' : '300px' }}>
            <div style={{ alignSelf: 'flex-start', marginBottom: '20px' }}>
              <h3 style={styles.sectionTitle}>Task Completion</h3>
            </div>
            <div style={styles.donutWrapper}>
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="75" fill="transparent" stroke="#eff6ff" strokeWidth="18" />
                <circle
                  cx="90" cy="90" r="75"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="18"
                  strokeDasharray="471"
                  strokeDashoffset={471 - (471 * 0.78)}
                  strokeLinecap="round"
                  transform="rotate(-90 90 90)"
                />
              </svg>
              <div style={styles.donutContent}>
                <span style={styles.donutPercent}>78%</span>
                <span style={styles.donutLabel}>Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Alerts Table */}
        <div style={{ ...styles.card, padding: 0, marginTop: '24px', overflow: 'hidden' }}>
          <div style={styles.tableHeader}>
            <h3 style={styles.sectionTitle}>Recent Alerts & Attention Needed</h3>
            <button style={styles.viewAllBtn}>View All</button>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Group / Class</th>
                  <th style={styles.th}>Issue Type</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {DASHBOARD_DATA.alerts.map(row => (
                  <tr key={row.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.studentName}>{row.name}</div>
                      <div style={styles.studentId}>ID: {row.id}</div>
                    </td>
                    <td style={styles.td}>{row.group}</td>
                    <td style={styles.td}>
                      <span style={row.type === 'danger' ? styles.badgeDanger : styles.badgeWarning}>
                        {row.issue}
                      </span>
                    </td>
                    <td style={styles.td}>{row.date}</td>
                    <td style={styles.td}>
                      <button style={styles.actionBtn}>{row.action}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Refined CSS Styles for Pixel-Perfect Layout ---
const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  wrapper: {
    width: '100%',
    maxWidth: '100%', // Changed to take full width
    padding: '2px',  // Consistent outer padding
    boxSizing: 'border-box',
  },
  metricsGrid: {
    display: 'grid',
    gap: '24px',
    marginBottom: '24px',
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px'
  },
  metricLabel: { fontSize: '14px', fontWeight: '500', color: '#64748b' },
  metricValue: { fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0', color: '#0f172a' },
  metricFooter: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
  trend: { fontWeight: '700' },
  footerText: { color: '#94a3b8' },
  iconContainer: { width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  chartRow: {
    display: 'flex',
    gap: '24px',
    width: '100%',
  },
  sectionTitle: { fontSize: '16px', fontWeight: '800', margin: 0, color: '#0f172a' },
  toggleGroup: { display: 'flex', gap: '20px' },
  toggleActive: { border: 'none', background: 'none', color: '#3b82f6', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
  toggleInactive: { border: 'none', background: 'none', color: '#94a3b8', paddingBottom: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },

  barChartContainer: {
    height: '240px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: '20px 20px 0 20px',
    marginTop: '20px'
  },
  barColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    flex: 1,
    maxWidth: '48px',
  },
  barArea: {
    flex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bar: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.8s ease-out'
  },
  barLabel: {
    marginTop: '16px',
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '700'
  },

  donutWrapper: { position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  donutContent: { position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  donutPercent: { fontSize: '32px', fontWeight: '800', color: '#0f172a' },
  donutLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: '600' },

  tableHeader: { padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  viewAllBtn: { border: 'none', background: 'none', color: '#64748b', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
  tableContainer: { width: '100%', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
  th: { padding: '12px 24px', color: '#94a3b8', fontSize: '12px', fontWeight: '700', borderBottom: '1px solid #f1f5f9' },
  td: { padding: '16px 24px', fontSize: '14px', borderBottom: '1px solid #f8fafc' },
  studentName: { fontWeight: '700', color: '#0f172a', fontSize: '15px' },
  studentId: { fontSize: '12px', color: '#94a3b8', marginTop: '2px', fontWeight: '600' },
  badgeDanger: { backgroundColor: '#fef2f2', color: '#ef4444', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' },
  badgeWarning: { backgroundColor: '#fff7ed', color: '#f97316', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' },
  actionBtn: { backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }
};

export default EducationDashboard;
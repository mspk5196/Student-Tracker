import React, { useState } from 'react';

// --- Static Data Structure (Dynamic ready) ---
const DASHBOARD_DATA = {
  metrics: [
    { id: 1, label: 'Total Students', value: '2,450', trend: '+5.2%', trendContext: 'from last semester', isPositive: true, icon: '👥' },
    { id: 2, label: 'Active Groups', value: '86', context: 'Active classes this term', icon: '📚' },
    { id: 3, label: 'Avg Attendance', value: '84.5%', trend: '-1.2%', trendContext: 'vs last week', isPositive: false, icon: '📈' },
    { id: 4, label: 'Tasks Due', value: '128', context: 'Within next 48 hours', icon: '⚠️' },
  ],
  attendance: [
    { dept: 'CS', value: 90 },
    { dept: 'Eng', value: 70 },
    { dept: 'Bus', value: 80 },
    { dept: 'Arts', value: 60 },
    { dept: 'Sci', value: 85 },
    { dept: 'Med', value: 75 },
    { dept: 'Law', value: 45 },
  ],
  alerts: [
    { id: '2023098', name: 'Sarah Jenkins', group: 'CS-101 Introduction', issue: 'Low Attendance (45%)', type: 'danger', date: 'Today, 10:30 AM', action: 'View Profile' },
    { id: '2023112', name: 'Michael Chang', group: 'ENG-204 Thermodynamics', issue: '3 Tasks Overdue', type: 'warning', date: 'Yesterday', action: 'Contact' },
    { id: '20233345', name: 'Priya Patel', group: 'BUS-301 Marketing', issue: 'Absent 3 Consecutive', type: 'danger', date: 'Oct 24, 2023', action: 'View Profile' },
    { id: '2023011', name: 'James Wilson', group: 'CS-102 Data Structures', issue: 'Late Submission', type: 'warning', date: 'Oct 23, 2023', action: 'Review' },
  ]
};

const EducationDashboard = () => {
  const [viewType, setViewType] = useState('Weekly');

  return (
    <div style={styles.container}>
      {/* 1. Header Metrics Grid */}
      <div style={styles.metricsGrid}>
        {DASHBOARD_DATA.metrics.map(m => (
          <div key={m.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.metricLabel}>{m.label}</span>
              <div style={styles.iconCircle}>{m.icon}</div>
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
      <div style={styles.chartRow}>
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
              <div key={item.dept} style={styles.barWrapper}>
                <div 
                   style={{ 
                     ...styles.bar, 
                     height: `${item.value}%`,
                     backgroundColor: index % 2 === 0 ? '#3b82f6' : '#93c5fd'
                   }} 
                />
                <span style={styles.barLabel}>{item.dept}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...styles.card, flex: 1, textAlign: 'center' }}>
          <h3 style={{ ...styles.sectionTitle, textAlign: 'left' }}>Task Completion</h3>
          <div style={styles.donutWrapper}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="#eff6ff" strokeWidth="15" />
              <circle 
                cx="80" cy="80" r="70" fill="transparent" stroke="#3b82f6" strokeWidth="15" 
                strokeDasharray="440" strokeDashoffset="96" strokeLinecap="round" 
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
      <div style={{ ...styles.card, padding: 0, marginTop: '24px' }}>
        <div style={styles.tableHeader}>
          <h3 style={styles.sectionTitle}>Recent Alerts & Attention Needed</h3>
          <button style={styles.viewAllBtn}>View All</button>
        </div>
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
  );
};

// --- Pixel Accurate Internal CSS Styles ---
const styles = {
  container: {
    padding: '32px',
    backgroundColor: '#f8fafc',
    fontFamily: '"Inter", sans-serif',
    minHeight: '100vh',
    color: '#1e293b'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  metricLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#64748b'
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#0f172a'
  },
  metricFooter: {
    display: 'flex',
    gap: '6px',
    fontSize: '12px'
  },
  trend: { fontWeight: '700' },
  footerText: { color: '#94a3b8' },
  iconCircle: {
    backgroundColor: '#f1f5f9',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chartRow: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    margin: 0
  },
  toggleGroup: {
    display: 'flex',
    gap: '16px'
  },
  toggleActive: {
    border: 'none',
    background: 'none',
    color: '#3b82f6',
    borderBottom: '2px solid #3b82f6',
    paddingBottom: '4px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  toggleInactive: {
    border: 'none',
    background: 'none',
    color: '#94a3b8',
    paddingBottom: '4px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  barChartContainer: {
    height: '240px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: '20px 10px 0 10px',
    marginTop: '20px'
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    width: '40px'
  },
  bar: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.5s ease'
  },
  barLabel: {
    marginTop: '12px',
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  donutWrapper: {
    position: 'relative',
    display: 'inline-block',
    marginTop: '40px'
  },
  donutContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column'
  },
  donutPercent: {
    fontSize: '28px',
    fontWeight: '700'
  },
  donutLabel: {
    fontSize: '12px',
    color: '#94a3b8'
  },
  tableHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  viewAllBtn: {
    border: 'none',
    background: 'none',
    color: '#94a3b8',
    fontWeight: '600',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  th: {
    padding: '16px 24px',
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  td: {
    padding: '20px 24px',
    fontSize: '14px',
    borderBottom: '1px solid #f8fafc'
  },
  studentName: { fontWeight: '700', color: '#1e293b' },
  studentId: { fontSize: '11px', color: '#94a3b8', marginTop: '4px', fontWeight: '600' },
  badgeDanger: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  badgeWarning: {
    backgroundColor: '#fff7ed',
    color: '#f97316',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  actionBtn: {
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

export default EducationDashboard;
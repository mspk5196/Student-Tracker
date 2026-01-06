import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  PeopleAltOutlined,
  LayersOutlined,
  TimelineOutlined,
  ErrorOutline,
  ChevronLeft,
  ChevronRight
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

// --- Custom Gauge Component with Material-style Animation ---
const AnimatedGauge = ({ percentage }) => {
  const [offset, setOffset] = useState(471); // Start at full circumference (invisible)
  const radius = 75;
  const circumference = 2 * Math.PI * radius; // Approx 471.24

  useEffect(() => {
    const timeout = setTimeout(() => {
      const progressOffset = circumference - (percentage / 100) * circumference;
      setOffset(progressOffset);
    }, 150);
    return () => clearTimeout(timeout);
  }, [percentage, circumference]);

  return (
    <div style={styles.donutWrapper}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle
          cx="90" cy="90" r={radius}
          fill="transparent"
          stroke="#eff6ff"
          strokeWidth="15"
        />
        <circle
          cx="90" cy="90" r={radius}
          fill="transparent"
          stroke="#3b82f6"
          strokeWidth="15"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      <div style={styles.donutContent}>
        <span style={styles.donutPercent}>{percentage}%</span>
        <span style={styles.donutLabel}>Completed</span>
      </div>
    </div>
  );
};

// --- Static Data ---
const DASHBOARD_DATA = {
  metrics: [
    { id: 1, label: 'Total Students', value: '2,450', trend: '+5.2%', trendContext: 'from last semester', isPositive: true, icon: <PeopleAltOutlined sx={{ fontSize: 20, color: '#64748b' }} /> },
    { id: 2, label: 'Active Groups', value: '86', context: 'Active classes this term', icon: <LayersOutlined sx={{ fontSize: 20, color: '#64748b' }} /> },
    { id: 3, label: 'Avg Attendance', value: '84.5%', trend: '-1.2%', trendContext: 'vs last week', isPositive: false, icon: <TimelineOutlined sx={{ fontSize: 20, color: '#64748b' }} /> },
    { id: 4, label: 'Tasks Due', value: '128', context: 'Within next 48 hours', icon: <ErrorOutline sx={{ fontSize: 20, color: '#64748b' }} /> },
  ],
  attendance: {
    Weekly: [
      { dept: 'Mech Eng', value: 92 }, { dept: 'Civil Eng', value: 78 }, { dept: 'Elec Eng', value: 85 },
      { dept: 'CS Eng', value: 95 }, { dept: 'Bio-Med', value: 72 }, { dept: 'Chem Eng', value: 80 },
      { dept: 'Aero Eng', value: 65 }, { dept: 'AI & DS', value: 88 }, { dept: 'Robotics', value: 55 }
    ],
    Monthly: [
      { dept: 'Mech Eng', value: 85 }, { dept: 'Civil Eng', value: 82 }, { dept: 'Elec Eng', value: 80 },
      { dept: 'CS Eng', value: 90 }, { dept: 'Bio-Med', value: 75 }, { dept: 'Chem Eng', value: 84 },
      { dept: 'Aero Eng', value: 70 }, { dept: 'AI & DS', value: 82 }, { dept: 'Robotics', value: 68 }
    ]
  },
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
  const navigate = useNavigate();

  // --- Pagination Logic ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(DASHBOARD_DATA.alerts.length / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlerts = DASHBOARD_DATA.alerts.slice(indexOfFirstItem, indexOfLastItem);

  const isMobile = width <= 768;
  const isTablet = width <= 1024 && width > 768;
  const currentAttendance = DASHBOARD_DATA.attendance[viewType];

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
                <span style={{ ...styles.trend, color: m.isPositive ? '#10b981' : '#ef4444' }}>{m.trend || ''}</span>
                <span style={styles.footerText}>{m.trendContext || m.context}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Charts Row */}
        <div style={{ ...styles.chartRow, flexDirection: isTablet || isMobile ? 'column' : 'row' }}>
          <div style={{ ...styles.card, flex: 2, minWidth: 0 }}>
            <div style={styles.cardHeader}>
              <h3 style={styles.sectionTitle}>Attendance by Engineering Dept.</h3>
              <div style={styles.toggleGroup}>
                {['Weekly', 'Monthly'].map(type => (
                  <button key={type} onClick={() => setViewType(type)} style={viewType === type ? styles.toggleActive : styles.toggleInactive}>{type}</button>
                ))}
              </div>
            </div>
            <div style={styles.scrollWrapper}>
              <div style={{ ...styles.barChartContainer, minWidth: `${currentAttendance.length * 75}px` }}>
                {currentAttendance.map((item, index) => (
                  <div key={item.dept} style={styles.barColumn}>
                    <div style={styles.barArea}>
                      <div style={{ ...styles.bar, height: `${item.value}%`, backgroundColor: index % 2 === 0 ? '#3b82f6' : '#dbeafe' }} />
                    </div>
                    <span style={styles.barLabel}>{item.dept}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, flex: 0.85, alignItems: 'center' }}>
            <div style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
              <h3 style={styles.sectionTitle}>Task Completion</h3>
            </div>
            <div style={styles.donutCenterContainer}>
              <AnimatedGauge percentage={78} />
            </div>
          </div>
        </div>

        {/* 3. Alerts Table with Pagination */}
        <div style={{ ...styles.card, padding: 0, marginTop: '24px', overflow: 'hidden' }}>
          <div style={styles.tableHeader}>
            <h3 style={styles.sectionTitle}>Recent Alerts & Attention Needed</h3>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Group / Class</th>
                  <th style={styles.th}>Issue Type</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentAlerts.map(row => (
                  <tr key={row.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.studentName}>{row.name}</div>
                      <div style={styles.studentId}>ID: {row.id}</div>
                    </td>
                    <td style={styles.td}><span style={styles.regularText}>{row.group}</span></td>
                    <td style={styles.td}>
                      <span style={row.type === 'danger' ? styles.badgeDanger : styles.badgeWarning}>{row.issue}</span>
                    </td>
                    <td style={styles.td}><span style={styles.regularText}>{row.date}</span></td>
                    <td style={styles.td}><button onClick={()=>navigate("/students")} style={styles.actionBtn}>{row.action}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div style={styles.paginationWrapper}>
            <div style={styles.paginationInfo}>
              Showing <span style={{ fontWeight: '600' }}>{indexOfFirstItem + 1}</span> to <span style={{ fontWeight: '600' }}>{Math.min(indexOfLastItem, DASHBOARD_DATA.alerts.length)}</span> of <span style={{ fontWeight: '600' }}>{DASHBOARD_DATA.alerts.length}</span> alerts
            </div>
            <div style={styles.paginationControls}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft sx={{ fontSize: 18 }} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={currentPage === pageNum ? styles.pageBtnActive : styles.pageBtn}
                >
                  {pageNum}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight sx={{ fontSize: 18 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '-apple-system, sans-serif', display: 'flex', justifyContent: 'center' },
  wrapper: { width: '100%', boxSizing: 'border-box' },
  metricsGrid: { display: 'grid', gap: '24px', marginBottom: '24px' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  metricLabel: { fontSize: '14px', fontWeight: '500', color: '#64748b' },
  metricValue: { fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0', color: '#1e293b' },
  metricFooter: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
  trend: { fontWeight: '600' },
  footerText: { color: '#94a3b8' },
  iconContainer: { width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  chartRow: { display: 'flex', gap: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 },
  toggleGroup: { display: 'flex', gap: '20px' },
  toggleActive: { border: 'none', background: 'none', color: '#3b82f6', borderBottom: '2px solid #3b82f6', paddingBottom: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  toggleInactive: { border: 'none', background: 'none', color: '#94a3b8', paddingBottom: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },

  scrollWrapper: { width: '100%', overflowX: 'auto', paddingBottom: '4px' },
  barChartContainer: { height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0' },
  barColumn: { display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', width: '50px', flexShrink: 0 },
  barArea: { flex: 1, width: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  bar: { width: '100%', borderRadius: '6px 6px 0 0', transition: 'height 0.8s ease' },
  barLabel: { marginTop: '14px', fontSize: '10px', color: '#94a3b8', fontWeight: '600', whiteSpace: 'nowrap' },

  donutCenterContainer: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' },
  donutWrapper: { position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  donutContent: { position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  donutPercent: { fontSize: '32px', fontWeight: '800', color: '#1e293b' },
  donutLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: '500' },

  tableHeader: { padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tableContainer: { width: '100%', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 24px', color: '#94a3b8', fontSize: '12px', textAlign: 'left', borderBottom: '1px solid #f8fafc', backgroundColor: '#fafbfc' },
  td: { padding: '16px 24px', borderBottom: '1px solid #f8fafc', verticalAlign: 'middle' },
  studentName: { fontWeight: '600', color: '#334155', fontSize: '14px' },
  studentId: { fontSize: '11px', color: '#94a3b8' },
  regularText: { color: '#64748b', fontSize: '14px' },
  badgeDanger: { backgroundColor: '#fff1f2', color: '#e11d48', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  badgeWarning: { backgroundColor: '#fffbeb', color: '#d97706', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  actionBtn: { backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', padding: '6px 16px', borderRadius: '6px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' },

  // Pagination Styles
  paginationWrapper: { padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', backgroundColor: '#ffffff' },
  paginationInfo: { fontSize: '13px', color: '#64748b' },
  paginationControls: { display: 'flex', gap: '8px', alignItems: 'center' },
  pageBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', padding: '0 6px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fff', color: '#64748b', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
  pageBtnActive: { display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', padding: '0 6px', border: '1px solid #3b82f6', borderRadius: '6px', backgroundColor: '#3b82f6', color: '#ffffff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }
};

export default EducationDashboard;
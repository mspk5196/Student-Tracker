import React from 'react';

const AttendanceView = ({ selectedGroup, period, academicYear, setAcademicYear, setPeriod }) => {
  
  // Mock Data
  const attendanceStats = { total: 45, present: 40, absent: 5 };
  
  const students = [
    { name: 'Alice Johnson', id: 'STU-001', lastSession: '2024-01-18', status: 'Present', sessionsPresent: 38, sessionsAbsent: 2, attendance: 95 },
    { name: 'Bob Smith', id: 'STU-002', lastSession: '2024-01-18', status: 'Present', sessionsPresent: 37, sessionsAbsent: 3, attendance: 92.5 },
    { name: 'Charlie Brown', id: 'STU-003', lastSession: '2024-01-17', status: 'Absent', sessionsPresent: 35, sessionsAbsent: 5, attendance: 87.5 },
    { name: 'Diana Prince', id: 'STU-004', lastSession: '2024-01-18', status: 'Present', sessionsPresent: 39, sessionsAbsent: 1, attendance: 97.5 },
    { name: 'Eve Adams', id: 'STU-005', lastSession: '2024-01-16', status: 'Absent', sessionsPresent: 34, sessionsAbsent: 6, attendance: 85 },
  ];

  const absentStudents = [
    { name: 'Charlie Brown', id: 'STU-003', date: '2024-01-17', session: 'Morning - 9:00 AM', reason: 'Medical appointment', status: 'Excused' },
    { name: 'Eve Adams', id: 'STU-005', date: '2024-01-16', session: 'Afternoon - 2:00 PM', reason: 'No reason provided', status: 'Uninformed' },
    { name: 'Frank Wilson', id: 'STU-006', date: '2024-01-15', session: 'Morning - 10:00 AM', reason: 'Family emergency', status: 'Follow-up Required' },
    { name: 'Grace Lee', id: 'STU-007', date: '2024-01-14', session: 'Afternoon - 3:00 PM', reason: 'Transportation issue', status: 'Pending Review' },
    { name: 'Henry Zhang', id: 'STU-008', date: '2024-01-13', session: 'Morning - 11:00 AM', reason: 'Multiple absences this week', status: 'At Risk' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return { bg: '#dcfce7', text: '#166534' };
      case 'Absent': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getFollowUpStatusStyle = (status) => {
    switch (status) {
      case 'Uninformed': return { bg: '#fee2e2', text: '#991b1b' };
      case 'Pending Review': return { bg: '#fef3c7', text: '#92400e' };
      case 'At Risk': return { bg: '#fee2e2', text: '#dc2626', fontWeight: 'bold' };
      case 'Follow-up Required': return { bg: '#ffedd5', text: '#9a3412' };
      case 'Excused': return { bg: '#dcfce7', text: '#166534' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div>
      {/* Contextual Filters */}
      <div style={styles.contextFilters}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Academic Year</label>
          <select style={styles.select} value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
            <option>2024 - 2025</option>
            <option>2023 - 2024</option>
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Period</label>
          <select style={styles.select} value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      <div style={styles.mainContent}>
        <p style={styles.sectionTitle}>Attendance view for: {selectedGroup} – {period}</p>
        
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Total Students</div>
            <div style={styles.statValue}>{attendanceStats.total}</div>
            <div style={styles.statSub}>All students in this group</div>
          </div>
          <div style={styles.statBox}>
            <div style={{...styles.statLabel, color: '#166534'}}>Total Present</div>
            <div style={{...styles.statValue, color: '#166534'}}>{attendanceStats.present}</div>
            <div style={styles.statSub}>Across selected period</div>
          </div>
          <div style={styles.statBox}>
            <div style={{...styles.statLabel, color: '#991b1b'}}>Total Absent</div>
            <div style={{...styles.statValue, color: '#991b1b'}}>{attendanceStats.absent}</div>
            <div style={styles.statSub}>Click a student for follow-up</div>
          </div>
        </div>

        <div style={styles.tableControls}>
          <button style={styles.filterBadgeActive}>All ({attendanceStats.total})</button>
          <button style={styles.filterBadge}>Present ({attendanceStats.present})</button>
          <button style={styles.filterBadge}>Absent ({attendanceStats.absent})</button>
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Student ID</th>
                <th style={styles.th}>Last Session</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Sessions Present</th>
                <th style={styles.th}>Sessions Absent</th>
                <th style={styles.th}>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const statusInfo = getStatusColor(student.status);
                return (
                  <tr key={index} style={styles.tr}>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>{student.id}</td>
                    <td style={styles.td}>{student.lastSession}</td>
                    <td style={styles.td}>
                      <span style={{ 
                        ...styles.statusBadge, 
                        backgroundColor: statusInfo.bg, 
                        color: statusInfo.text 
                      }}>
                        {student.status}
                      </span>
                    </td>
                    <td style={styles.td}>{student.sessionsPresent}</td>
                    <td style={styles.td}>{student.sessionsAbsent}</td>
                    <td style={styles.td}>{student.attendance}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h3 style={styles.sectionHeader}>Absent Students ({attendanceStats.absent})</h3>
        <p style={styles.sectionSubHeader}>Breakdown of the 5 absent counts for this period with reasons and follow-up.</p>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Student ID</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Session / Slot</th>
                <th style={styles.th}>Reason / Notes</th>
                <th style={styles.th}>Follow-up Status</th>
              </tr>
            </thead>
            <tbody>
              {absentStudents.map((student, index) => {
                const statusStyle = getFollowUpStatusStyle(student.status);
                return(
                  <tr key={index} style={styles.tr}>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>{student.id}</td>
                    <td style={styles.td}>{student.date}</td>
                    <td style={styles.td}>{student.session}</td>
                    <td style={styles.td}>{student.reason}</td>
                    <td style={styles.td}>
                      <span style={{ 
                        ...styles.statusBadge, 
                        backgroundColor: statusStyle.bg, 
                        color: statusStyle.text,
                        fontWeight: statusStyle.fontWeight || 'normal',
                        fontSize: '11px'
                      }}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
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

export default AttendanceView;

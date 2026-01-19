import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, TrendingUp, Award, Target, Plus, X } from 'lucide-react';

const SkillProficiencyView = ({ selectedGroup, academicYear, setAcademicYear }) => {
  
  // Available skills list
  const availableSkills = [
    { id: 1, name: 'HTML & CSS Fundamentals' },
    { id: 2, name: 'JavaScript ES6' },
    { id: 3, name: 'React Basics' },
    { id: 4, name: 'Node.js Backend' },
    { id: 5, name: 'CSS Flexbox & Grid' },
    { id: 6, name: 'TypeScript Basics' },
    { id: 7, name: 'MongoDB Database' },
    { id: 8, name: 'REST API Design' },
  ];

  // Selected skill (single dropdown selection)
  const [selectedSkill, setSelectedSkill] = useState('');

  const [statusFilter, setStatusFilter] = useState('All Status');

  // Mock Data - Student skill-wise completion status (matching DB structure)
  // This data shows multiple attempts per student per skill
  const studentSkillData = [
    { 
      rollNumber: '2024UAL1042',
      userId: '7376242AL218',
      name: 'Vikram S',
      year: 'II',
      courseName: 'HTML/CSS',
      venue: 'Vedanayagam',
      skillAttempts: [
        { 
          attempt: 1, 
          status: 'Cleared', 
          score: 98, 
          attendance: 'Present',
          slotDate: '2026-01-10',
          startTime: '09:00:00',
          endTime: '10:30:00'
        }
      ]
    },
    { 
      rollNumber: '2024UAL1043',
      userId: '7376243AL219',
      name: 'Priya R',
      year: 'II',
      courseName: 'HTML/CSS',
      venue: 'Vedanayagam',
      skillAttempts: [
        { 
          attempt: 1, 
          status: 'Not Cleared', 
          score: 45, 
          attendance: 'Present',
          slotDate: '2026-01-10',
          startTime: '09:00:00',
          endTime: '10:30:00'
        },
        { 
          attempt: 2, 
          status: 'Ongoing', 
          score: 68, 
          attendance: 'Present',
          slotDate: '2026-01-12',
          startTime: '11:00:00',
          endTime: '12:30:00'
        }
      ]
    },
    { 
      rollNumber: '2024UAL1044',
      userId: '7376244AL220',
      name: 'Rahul K',
      year: 'II',
      courseName: 'JavaScript ES6',
      venue: 'Vedanayagam',
      skillAttempts: [
        { 
          attempt: 1, 
          status: 'Cleared', 
          score: 85, 
          attendance: 'Present',
          slotDate: '2026-01-11',
          startTime: '14:00:00',
          endTime: '15:30:00'
        }
      ]
    },
    { 
      rollNumber: '2024UAL1045',
      userId: '7376245AL221',
      name: 'Sneha M',
      year: 'II',
      courseName: 'HTML/CSS',
      venue: 'Vedanayagam',
      skillAttempts: []  // Not attempted yet
    },
    { 
      rollNumber: '2024UAL1046',
      userId: '7376246AL222',
      name: 'Arjun P',
      year: 'II',
      courseName: 'JavaScript ES6',
      venue: 'Vedanayagam',
      skillAttempts: [
        { 
          attempt: 1, 
          status: 'Not Cleared', 
          score: 42, 
          attendance: 'Present',
          slotDate: '2026-01-09',
          startTime: '09:00:00',
          endTime: '10:30:00'
        },
        { 
          attempt: 2, 
          status: 'Not Cleared', 
          score: 55, 
          attendance: 'Present',
          slotDate: '2026-01-11',
          startTime: '14:00:00',
          endTime: '15:30:00'
        },
        { 
          attempt: 3, 
          status: 'Cleared', 
          score: 76, 
          attendance: 'Present',
          slotDate: '2026-01-13',
          startTime: '11:00:00',
          endTime: '12:30:00'
        }
      ]
    },
  ];

  // Filter student data based on selected skill
  const filteredStudentData = selectedSkill 
    ? studentSkillData.filter(student => 
        student.courseName.toLowerCase().includes(selectedSkill.toLowerCase().split(' ')[0])
      )
    : [];

  // Calculate skill stats dynamically from filtered student data
  const skillStats = {
    totalStudents: filteredStudentData.length,
    cleared: filteredStudentData.filter(s => 
      s.skillAttempts.length > 0 && 
      s.skillAttempts.some(a => a.status === 'Cleared')
    ).length,
    notCleared: filteredStudentData.filter(s => 
      s.skillAttempts.length > 0 && 
      s.skillAttempts.every(a => a.status === 'Not Cleared')
    ).length,
    notAttempted: filteredStudentData.filter(s => s.skillAttempts.length === 0).length,
    avgBestScore: filteredStudentData.filter(s => s.skillAttempts.length > 0).length > 0
      ? (filteredStudentData
          .filter(s => s.skillAttempts.length > 0)
          .reduce((acc, s) => {
            const bestScore = Math.max(...s.skillAttempts.map(a => a.score));
            return acc + bestScore;
          }, 0) / filteredStudentData.filter(s => s.skillAttempts.length > 0).length
        ).toFixed(1)
      : 0
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Cleared':
        return { 
          icon: <CheckCircle size={16} />, 
          bg: '#dcfce7', 
          text: '#166534',
          label: 'Cleared'
        };
      case 'Not Cleared':
        return { 
          icon: <XCircle size={16} />, 
          bg: '#fee2e2', 
          text: '#991b1b',
          label: 'Not Cleared'
        };
      case 'Ongoing':
        return { 
          icon: <Clock size={16} />, 
          bg: '#fef3c7', 
          text: '#92400e',
          label: 'Ongoing'
        };
      default:
        return { 
          icon: null, 
          bg: '#f3f4f6', 
          text: '#374151',
          label: status
        };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return '#166534'; // Green
    if (score >= 50) return '#92400e'; // Yellow
    return '#991b1b'; // Red
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
          <label style={styles.label}>Status Filter</label>
          <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All Status</option>
            <option>Cleared</option>
            <option>Not Cleared</option>
            <option>Ongoing</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Select Skill</label>
          <select 
            style={styles.select} 
            value={selectedSkill} 
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="">-- Select a Skill --</option>
            {availableSkills.map((skill) => (
              <option key={skill.id} value={skill.name}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.mainContent}>
        <p style={styles.sectionTitle}>Skill completion status for: {selectedGroup}</p>

        {/* Statistics Row */}
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <div style={styles.statIconWrapper}>
              <Award size={24} color="#3b82f6" />
            </div>
            <div>
              <div style={styles.statLabel}>Total Students</div>
              <div style={styles.statValue}>{skillStats.totalStudents}</div>
              <div style={styles.statSub}>Enrolled in skills</div>
            </div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statIconWrapper}>
              <CheckCircle size={24} color="#166534" />
            </div>
            <div>
              <div style={{...styles.statLabel, color: '#166534'}}>Cleared</div>
              <div style={{...styles.statValue, color: '#166534'}}>{skillStats.cleared}</div>
              <div style={styles.statSub}>Successfully completed</div>
            </div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statIconWrapper}>
              <XCircle size={24} color="#991b1b" />
            </div>
            <div>
              <div style={{...styles.statLabel, color: '#991b1b'}}>Not Cleared</div>
              <div style={{...styles.statValue, color: '#991b1b'}}>{skillStats.notCleared}</div>
              <div style={styles.statSub}>Need improvement</div>
            </div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statIconWrapper}>
              <Clock size={24} color="#f59e0b" />
            </div>
            <div>
              <div style={{...styles.statLabel, color: '#f59e0b'}}>Not Attempted</div>
              <div style={{...styles.statValue, color: '#f59e0b'}}>{skillStats.notAttempted}</div>
              <div style={styles.statSub}>Yet to start</div>
            </div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statIconWrapper}>
              <TrendingUp size={24} color="#8b5cf6" />
            </div>
            <div>
              <div style={{...styles.statLabel, color: '#8b5cf6'}}>Avg. Best Score</div>
              <div style={{...styles.statValue, color: '#8b5cf6'}}>{skillStats.avgBestScore}</div>
              <div style={styles.statSub}>Overall performance</div>
            </div>
          </div>
        </div>

        {/* Status Filter Badges */}
        <div style={styles.tableControls}>
          <button style={styles.filterBadgeActive}>All ({skillStats.totalStudents})</button>
          <button style={styles.filterBadge}>Cleared ({skillStats.cleared})</button>
          <button style={styles.filterBadge}>Not Cleared ({skillStats.notCleared})</button>
          <button style={styles.filterBadge}>Not Attempted ({skillStats.notAttempted})</button>
        </div>

        {/* Student Skill Attempts Table */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Roll Number</th>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Year</th>
                <th style={styles.th}>Skill / Course</th>
                <th style={styles.th}>Venue</th>
                <th style={styles.th}>Attempt #</th>
                <th style={styles.th}>Score</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Attendance</th>
                <th style={styles.th}>Slot Date</th>
                <th style={styles.th}>Time Slot</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudentData.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{...styles.td, textAlign: 'center', padding: '40px', color: '#9ca3af'}}>
                    {!selectedSkill 
                      ? 'Please select a skill to view student data'
                      : 'No student data found for the selected skill'}
                  </td>
                </tr>
              ) : (
                filteredStudentData.map((student) => 
                student.skillAttempts.length > 0 ? (
                  student.skillAttempts.map((attempt, attemptIdx) => {
                    const statusInfo = getStatusBadge(attempt.status);
                    return (
                      <tr key={`${student.rollNumber}-${attemptIdx}`} style={styles.tr}>
                        <td style={styles.td}>{student.rollNumber}</td>
                        <td style={styles.td}>{student.name}</td>
                        <td style={styles.td}>{student.year}</td>
                        <td style={styles.td}>{student.courseName}</td>
                        <td style={styles.td}>{student.venue}</td>
                        <td style={styles.td}>
                          <span style={{ 
                            fontWeight: '600',
                            backgroundColor: '#f3f4f6',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            {attempt.attempt}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={{ 
                            fontWeight: '600',
                            color: getScoreColor(attempt.score)
                          }}>
                            {attempt.score}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={{ 
                            ...styles.statusBadge, 
                            backgroundColor: statusInfo.bg, 
                            color: statusInfo.text,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            width: 'fit-content'
                          }}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={{ 
                            color: attempt.attendance === 'Present' ? '#166534' : '#991b1b'
                          }}>
                            {attempt.attendance}
                          </span>
                        </td>
                        <td style={styles.td}>{attempt.slotDate}</td>
                        <td style={styles.td}>
                          {attempt.startTime} - {attempt.endTime}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr key={student.rollNumber} style={styles.tr}>
                    <td style={styles.td}>{student.rollNumber}</td>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>{student.year}</td>
                    <td style={styles.td}>{student.courseName}</td>
                    <td style={styles.td}>{student.venue}</td>
                    <td style={styles.td} colSpan="6">
                      <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                        No attempts recorded yet
                      </span>
                    </td>
                  </tr>
                )
              ))}
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
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  statIconWrapper: {
    flexShrink: 0,
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
  },
  skillSelectorSection: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  skillSelectorHeader: {
    marginBottom: '16px',
  },
  skillSelectorTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  skillSelectorSubtitle: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
  },
  selectedSkillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
  },
  skillChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#eff6ff',
    border: '1px solid #3b82f6',
    borderRadius: '20px',
    padding: '8px 12px',
  },
  skillChipText: {
    fontSize: '14px',
    color: '#1e40af',
    fontWeight: '500',
  },
  skillChipRemove: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    color: '#1e40af',
    transition: 'color 0.2s',
  },
  addSkillButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#fff',
    border: '1px dashed #9ca3af',
    borderRadius: '20px',
    padding: '8px 16px',
    fontSize: '14px',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '500',
  },
  skillPickerDropdown: {
    marginTop: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #e5e7eb',
  },
  skillPickerTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
  },
  skillList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '8px',
  },
  skillOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
};

export default SkillProficiencyView;
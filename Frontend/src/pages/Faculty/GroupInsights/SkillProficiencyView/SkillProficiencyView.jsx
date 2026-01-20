import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, TrendingUp, Award, Target, Plus, X } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const SkillProficiencyView = ({ selectedVenue, selectedVenueName, initialSkill = '' }) => {
  
  // Selected skill (single dropdown selection)
  const [selectedSkill, setSelectedSkill] = useState(initialSkill);
  const [statusFilter, setStatusFilter] = useState('All Status');
  
  // Backend data states
  const [skillReports, setSkillReports] = useState([]);
  const [venueStudents, setVenueStudents] = useState([]); // All students in the venue
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch skill reports when venue is selected (passed from parent)
  useEffect(() => {
    const fetchSkillReports = async () => {
      if (!selectedVenue) {
        setSkillReports([]);
        setVenueStudents([]);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${API_URL}/skill-reports/faculty/venue/reports`,
          {
            venueId: selectedVenue,
            page: 1,
            limit: 1000, // Get all records for this view
            sortBy: 'last_slot_date',
            sortOrder: 'DESC',
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSkillReports(response.data.reports || []);
        setVenueStudents(response.data.venueStudents || []); // Get all venue students
      } catch (err) {
        console.error('Error fetching skill reports:', err);
        setError('Failed to load skill reports');
      } finally {
        setLoading(false);
      }
    };

    fetchSkillReports();
  }, [selectedVenue]);

  // Update selectedSkill when initialSkill changes
  useEffect(() => {
    if (initialSkill) {
      setSelectedSkill(initialSkill);
    }
  }, [initialSkill]);

  // Extract unique skills from reports
  const availableSkills = Array.from(
    new Set(skillReports.map(report => report.course_name))
  ).map((courseName, index) => ({
    id: index + 1,
    name: courseName
  }));

  // Transform backend data to frontend structure
  // Group reports by student and course to show all attempts
  const transformedData = skillReports.reduce((acc, report) => {
    const key = `${report.roll_number}-${report.course_name}`;
    
    if (!acc[key]) {
      acc[key] = {
        rollNumber: report.roll_number,
        studentId: report.student_id,
        userId: report.roll_number,
        name: report.student_name,
        year: report.year || 'N/A',
        courseName: report.course_name,
        venue: report.student_current_venue || report.excel_venue_name || 'N/A',
        skillAttempts: [],
        latestStatus: report.status
      };
    }

    // Add attempt - always add since all records have total_attempts >= 1
    acc[key].skillAttempts.push({
      attempt: report.total_attempts || 1,
      status: report.status,
      score: report.latest_score ?? report.best_score ?? 0,
      attendance: report.last_attendance || 'N/A',
      slotDate: report.last_slot_date ? new Date(report.last_slot_date).toISOString().split('T')[0] : 'N/A',
      startTime: report.last_start_time || 'N/A',
      endTime: report.last_end_time || 'N/A'
    });

    return acc;
  }, {});

  // Get students who have attempted the selected skill
  const studentsWithSkillData = Object.values(transformedData);

  // Build complete student list including "Not Attempted" students
  // Only calculate this when a skill is selected
  const getCompleteStudentList = () => {
    if (!selectedSkill) return [];
    
    // Get students who have attempted this specific skill
    const studentsWithThisSkill = studentsWithSkillData.filter(s => s.courseName === selectedSkill);
    const attemptedStudentIds = new Set(studentsWithThisSkill.map(s => s.rollNumber));
    
    // Get students who haven't attempted this skill (from venueStudents)
    const notAttemptedStudents = venueStudents
      .filter(vs => !attemptedStudentIds.has(vs.roll_number))
      .map(vs => ({
        rollNumber: vs.roll_number,
        studentId: vs.student_id,
        userId: vs.roll_number,
        name: vs.student_name,
        year: vs.year || 'N/A',
        courseName: selectedSkill,
        venue: selectedVenueName || 'N/A',
        skillAttempts: [], // Empty = Not Attempted
        latestStatus: 'Not Attempted'
      }));
    
    // Combine both lists
    return [...studentsWithThisSkill, ...notAttemptedStudents];
  };

  const allStudentsForSkill = getCompleteStudentList();

  // Apply status filter
  let filteredStudentData = allStudentsForSkill;
  
  if (statusFilter !== 'All Status') {
    filteredStudentData = allStudentsForSkill.filter(student => {
      if (statusFilter === 'Not Attempted') {
        return student.skillAttempts.length === 0;
      } else if (statusFilter === 'Cleared') {
        return student.skillAttempts.some(a => a.status === 'Cleared');
      } else if (statusFilter === 'Not Cleared') {
        return student.skillAttempts.some(a => a.status === 'Not Cleared') && 
               !student.skillAttempts.some(a => a.status === 'Cleared');
      } else if (statusFilter === 'Ongoing') {
        return student.skillAttempts.some(a => a.status === 'Ongoing');
      }
      return true;
    });
  }

  // Calculate skill stats from complete student list (before status filter)
  const skillStats = {
    totalStudents: allStudentsForSkill.length,
    cleared: allStudentsForSkill.filter(s => 
      s.skillAttempts.some(a => a.status === 'Cleared')
    ).length,
    notCleared: allStudentsForSkill.filter(s => 
      s.skillAttempts.some(a => a.status === 'Not Cleared') &&
      !s.skillAttempts.some(a => a.status === 'Cleared')
    ).length,
    ongoing: allStudentsForSkill.filter(s => 
      s.skillAttempts.some(a => a.status === 'Ongoing')
    ).length,
    notAttempted: allStudentsForSkill.filter(s => s.skillAttempts.length === 0).length,
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
      {/* Contextual Filters - removed venue selector, now uses parent's venue */}
      <div style={styles.contextFilters}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Status Filter</label>
          <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All Status</option>
            <option>Cleared</option>
            <option>Not Cleared</option>
            <option>Ongoing</option>
            <option>Not Attempted</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Select Skill</label>
          <select 
            style={styles.select} 
            value={selectedSkill} 
            onChange={(e) => setSelectedSkill(e.target.value)}
            disabled={availableSkills.length === 0}
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
        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>Loading skill reports...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#991b1b',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && selectedVenue && availableSkills.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '16px', color: '#64748b' }}>No skill reports found for this venue</div>
          </div>
        )}

        {!loading && !error && selectedSkill && (
          <>
        <p style={styles.sectionTitle}>Skill completion status for: {selectedVenueName}</p>

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
        </>
        )}
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
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, User } from 'lucide-react';
import useAuthStore from '../store/authStore';

const LateStudentsReport = ({ facultyId = null }) => {
  const { token } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [lateStudents, setLateStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedStudent, setExpandedStudent] = useState(null);

  const fetchLateStudents = async () => {
    setLoading(true);
    setError('');
    
    try {
      const url = facultyId 
        ? `${API_URL}/attendance/late-students/${facultyId}`
        : `${API_URL}/attendance/late-students`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setLateStudents(data.data);
      } else {
        setError(data.message || 'Failed to fetch late students');
      }
    } catch (err) {
      console.error('Error fetching late students:', err);
      setError('Failed to fetch late students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLateStudents();
    }
  }, [token, facultyId]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <AlertTriangle size={24} color="#EF4444" />
          <h2 style={styles.title}>Students Late 5+ Times</h2>
        </div>
        <button style={styles.refreshBtn} onClick={fetchLateStudents}>
          Refresh
        </button>
      </div>

      {error && (
        <div style={styles.errorBanner}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={styles.errorClose}>×</button>
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : lateStudents.length === 0 ? (
        <div style={styles.empty}>
          <AlertTriangle size={48} color="#9CA3AF" />
          <p>No students with 5+ late attendances</p>
        </div>
      ) : (
        <div style={styles. grid}>
          {lateStudents.map(student => (
            <div key={student.student_id} style={styles.card}>
              <div style={styles. cardHeader}>
                <div style={styles.avatar}>
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={styles. studentInfo}>
                  <div style={styles.studentName}>{student.name}</div>
                  <div style={styles.studentId}>ID: {student.studentId}</div>
                </div>
                <div style={styles.badge}>
                  {student.late_count} Late
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <User size={14} color="#9CA3AF" />
                  <span style={styles.infoText}>{student.department}</span>
                </div>
                <div style={styles. infoRow}>
                  <span style={styles.infoLabel}>Faculty:</span>
                  <span style={styles.infoText}>{student.faculty_name}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Year:</span>
                  <span style={styles.infoText}>
                    Year {student.year}, Semester {student.semester}
                  </span>
                </div>
              </div>

              <button 
                style={styles.expandBtn}
                onClick={() => setExpandedStudent(
                  expandedStudent === student. student_id ? null : student. student_id
                )}
              >
                {expandedStudent === student.student_id ? 'Hide' : 'View'} Late Sessions
              </button>

              {expandedStudent === student. student_id && (
                <div style={styles.sessions}>
                  {student.late_sessions.slice(0, 10).map((session, idx) => (
                    <div key={idx} style={styles. sessionItem}>
                      <Calendar size={12} color="#F59E0B" />
                      <span style={styles.sessionText}>{session}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    backgroundColor: '#F9FAFB',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: 0
  },
  refreshBtn: {
    padding:  '10px 20px',
    backgroundColor: '#3B82F6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    padding:  '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  errorClose: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#991B1B'
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: '#6B7280',
    fontSize: '16px'
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    color: '#6B7280'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    overflow: 'hidden'
  },
  cardHeader:  {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    borderBottom: '1px solid #F3F4F6'
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#FEE2E2',
    color: '#EF4444',
    display:  'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600'
  },
  studentInfo: {
    flex: 1
  },
  studentName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827'
  },
  studentId:  {
    fontSize: '13px',
    color: '#9CA3AF',
    marginTop: '2px'
  },
  badge: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600'
  },
  cardBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  infoRow: {
    display:  'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px'
  },
  infoLabel: {
    color: '#6B7280',
    fontWeight: '500'
  },
  infoText:  {
    color: '#111827'
  },
  expandBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    border: 'none',
    borderTop: '1px solid #E5E7EB',
    cursor: 'pointer',
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: '14px'
  },
  sessions: {
    padding: '16px 20px',
    backgroundColor: '#FFFBEB',
    borderTop: '1px solid #FDE68A',
    maxHeight: '200px',
    overflowY: 'auto'
  },
  sessionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    fontSize: '13px',
    color: '#92400E',
    borderBottom: '1px solid #FEF3C7'
  },
  sessionText: {
    flex: 1
  }
};

export default LateStudentsReport;
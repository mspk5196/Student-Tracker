import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../../store/useAuthStore';

// Material UI Icons
import EditIcon from '@mui/icons-material/EditOutlined';
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import AssignmentIndIcon from '@mui/icons-material/AssignmentIndOutlined';
import BookIcon from '@mui/icons-material/MenuBookOutlined';
import LayersIcon from '@mui/icons-material/LayersOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

// Tab Components
import Overview from './Overview/Overview';
import AttendanceDashboard from './Attendance/Attendance';
import TaskGrade from './Task&Grades/TaskGrade';
import Ranking from './Ranking/Ranking';

const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
    margin:'-25px'
  },
  backButton: {
    padding: '10px 18px',
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
  profileCard:  {
    display: 'flex',
    alignItems: 'center',
    background:  '#ffffff',
    border: '1px solid #eef2f6',
    borderRadius: '12px',
    padding: '32px',
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    marginBottom: '0px',
    paddingTop:'80px'
  },
  avatarContainer: {
    marginRight: '28px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    padding: '3px',
    background: 'white',
    border: '1.5px solid #d1e1fb',
  },
  avatarFallback: {
    width: '100px',
    height: '100px',
    borderRadius:  '50%',
    backgroundColor:  '#3B82F6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: '700',
    border: '1.5px solid #d1e1fb',
  },
  infoArea: {
    flexGrow: 1,
  },
  name: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 12px 0',
    letterSpacing: '-0.02em',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display:  'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#64748b',
    fontSize: '14px',
    fontWeight:  '500',
  },
  metaIcon: {
    fontSize: '16px',
    color: '#94a3b8',
  },
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
    transition: 'all 0.2s',
  },
  btnPrimary: {
    display:  'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: '#2563eb',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  navBar: {
    display: 'flex',
    gap: '35px',
    marginTop: '-12px',
    backgroundColor: '#fff',
    borderRadius: '0 0 12px 12px',
    padding: '0 32px',
    borderTop: 'none',
    position: 'sticky',
    top: '-25px',
    zIndex: 1000,
    borderBottom: '1px solid #f1f5f9',
    paddingTop: '10px',
  },
  tab: {
    padding: '14px 2px',
    fontSize: '15px',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: '0.2s ease',
    marginBottom: '-1px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent:  'center',
    alignItems: 'center',
    minHeight: '400px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  errorContainer: {
    padding: '24px',
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    borderRadius: '12px',
    margin: '20px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #FCA5A5',
  },
  errorButton: {
    padding: '10px 18px',
    backgroundColor: '#DC2626',
    color: 'white',
    border: 'none',
    borderRadius:  '8px',
    cursor:  'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  notFoundContainer: {
    padding: '60px 40px',
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius:  '12px',
    color: '#6B7280',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:  'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    display:  'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1F2937',
  },
  formGroup: {
    marginBottom:  '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent:  'flex-end',
    marginTop: '24px',
  },
};

const StudentHeader = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    department: '',
    year: '',
    semester: '',
    assigned_faculty_id: '',
    is_active: true,
  });

  const tabs = ['Overview', 'Attendance', 'Tasks & Grades', 'Ranking'];

  const fetchStudentDetails = async () => {
    setLoading(true);
    setError('');

    console.log('=== Student Fetch Debug ===');
    console.log('Student ID:', studentId);
    console.log('API URL:', API_URL);
    console.log('Token exists:', !!token);

    try {
      const url = `${API_URL}/students/${studentId}`;
      console.log('Full URL:', url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        console.log('✅ Student data loaded');
        setStudent(data.data);
        setEditForm({
          name: data.data.name,
          email: data.data.email,
          department: data.data.department,
          year: data.data.year,
          semester: data.data.semester,
          assigned_faculty_id: data.data.assigned_faculty_id || '',
          is_active: data.data.is_active,
        });
      } else {
        console.error('❌ API error:', data.message);
        setError(data.message || 'Failed to fetch student details');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(`Failed to fetch student details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && studentId) {
      fetchStudentDetails();
    } else {
      if (!token) setError('Authentication required');
      if (!studentId) setError('Student ID is missing');
      setLoading(false);
    }
  }, [token, studentId]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const response = await fetch(
        `${API_URL}/students/${studentId}/download-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_report_${student.studentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to download report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${API_URL}/students/${studentId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        alert('Student updated successfully!');
        setShowEditModal(false);
        fetchStudentDetails();
      } else {
        alert(data.message || 'Failed to update student');
      }
    } catch (err) {
      console.error('Error updating student:', err);
      alert('Failed to update student. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <div>Loading student details...</div>
            <div
              style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}
            >
              Student ID: {studentId}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div>
            <div>⚠️ {error}</div>
            <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>
              Student ID: {studentId} | API: {API_URL}
            </div>
          </div>
          <button
            onClick={() => navigate('/students')}
            style={styles.errorButton}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#B91C1C')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#DC2626')
            }
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div style={styles.container}>
        <div style={styles.notFoundContainer}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#374151',
            }}
          >
            Student Not Found
          </h2>
          <p style={{ marginBottom: '24px', color: '#6B7280' }}>
            The student you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/students')}
            style={styles.btnPrimary}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#1d4ed8')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#2563eb')
            }
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Main Profile Card */}
      <div style={styles.profileCard}>
        {/* Back Button inside card */}
        <button
          onClick={() => navigate('/students')}
          style={{
            ...styles.backButton,
            position: 'absolute',
            top: '20px',
            left: '20px',
            margin: '0',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1F2937')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#374151')}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          Back to Students
        </button>

        {/* Avatar */}
        <div style={styles.avatarContainer}>
          {student.image ? (
            <img src={student.image} alt={student.name} style={styles.avatar} />
          ) : (
            <div style={styles.avatarFallback}>{getInitials(student.name)}</div>
          )}
        </div>

        {/* Student Info */}
        <div style={styles.infoArea}>
          <h1 style={styles.name}>{student.name}</h1>

          <div style={styles.metaRow}>
            <span style={styles.metaItem}>
              <AssignmentIndIcon style={styles.metaIcon} /> ID:{' '}
              {student.studentId || student.id}
            </span>
            <span style={styles.metaItem}>
              <BookIcon style={styles.metaIcon} /> {student.department}
            </span>
            <span style={styles.metaItem}>
              <LayersIcon style={styles.metaIcon} /> Year {student.year}, Sem{' '}
              {student.semester}
            </span>
            <span style={styles.metaItem}>
              <PeopleIcon style={styles.metaIcon} /> Faculty:{' '}
              {student.facultyName || 'Not Assigned'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.btnGroup}>
          <button
            style={styles.btnOutline}
            onClick={handleDownloadReport}
            disabled={downloading}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <DownloadIcon sx={{ fontSize: 18 }} />
            {downloading ? 'Downloading...' : 'Download Report'}
          </button>
          <button
            style={styles.btnPrimary}
            onClick={handleEditProfile}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#1d4ed8')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#2563eb')
            }
          >
            <EditIcon sx={{ fontSize: 18 }} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={styles.navBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '14px 2px',
                fontSize: '15px',
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: '0.2s ease',
                marginBottom: '-1px',
                color: isActive ? '#2563eb' : '#64748b',
                borderBottom: isActive ? '3px solid #2563eb' : '3px solid transparent'
              }}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      {/* Tab Content */}
      <div style={{ marginTop: '20px' }}>
        {activeTab === 'Overview' && (
          <Overview student={student} studentId={studentId} />
        )}
        {activeTab === 'Attendance' && (
          <AttendanceDashboard studentId={studentId} student={student} />
        )}
        {activeTab === 'Tasks & Grades' && (
          <TaskGrade studentId={studentId} student={student} />
        )}
        {activeTab === 'Ranking' && (
          <Ranking studentId={studentId} student={student} />
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Student Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6B7280',
                }}
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Department</label>
                <input
                  type="text"
                  name="department"
                  value={editForm.department}
                  onChange={handleEditFormChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Year</label>
                  <select
                    name="year"
                    value={editForm.year}
                    onChange={handleEditFormChange}
                    style={styles.select}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Semester</label>
                  <select
                    name="semester"
                    value={editForm.semester}
                    onChange={handleEditFormChange}
                    style={styles.select}
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                    <option value="8">Semester 8</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  name="is_active"
                  value={editForm.is_active ? '1' : '0'}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      is_active: e.target.value === '1',
                    }))
                  }
                  style={styles.select}
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={styles.btnOutline}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  style={styles.btnPrimary}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHeader;
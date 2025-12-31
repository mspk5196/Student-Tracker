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
    padding: '30px',
    backgroundColor: '#fff',
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
  },
  backButton: {
    marginBottom: '24px',
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
    border: '1. 5px solid #d1e1fb',
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
  // Modal styles
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

  // --- Responsive Logic ---
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // --- Dynamic Styles ---
  const dynamicStyles = {
    container: {
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh',
      margin:'-25px',
    },
    backButton: {
      padding: '8px 14px',
      backgroundColor: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    profileCard: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'center' : 'center',
      justifyContent: isMobile ? 'center' : 'flex-start',
      background: '#ffffff',
      border: '1px solid #eef2f6',
      borderRadius: '12px',
      padding: isMobile ? '20px' : '32px',
      position: 'relative',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      marginBottom: '0px',
      paddingTop: isMobile ? '70px' : '80px',
      textAlign: isMobile ? 'center' : 'left',
    },
    avatarContainer: {
      marginRight: isMobile ? '0' : '28px',
      marginBottom: isMobile ? '16px' : '0',
      display:'flex',
      justifyContent: 'center',
    },
    avatar: {
      width: isMobile ? '80px' : '100px',
      height: isMobile ? '80px' : '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      padding: '3px',
      background: 'white',
      border: '1.5px solid #d1e1fb',
    },
    avatarFallback: {
      width: isMobile ? '80px' : '100px',
      height: isMobile ? '80px' : '100px',
      borderRadius: '50%',
      backgroundColor: '#3B82F6',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isMobile ? '28px' : '36px',
      fontWeight: '700',
      border: '1.5px solid #d1e1fb',
    },
    infoArea: {
      flexGrow: 1,
      width: isMobile ? '100%' : 'auto'
    },
    name: {
      fontSize: isMobile ? '22px' : '28px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 12px 0',
      letterSpacing: '-0.02em',
    },
    metaRow: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '12px' : '24px',
      flexWrap: 'wrap',
      justifyContent: isMobile ? 'center' : 'flex-start',
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#64748b',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '500',
    },
    metaIcon: {
      fontSize: '16px',
      color: '#94a3b8',
    },
    btnGroup: {
      position: isMobile ? 'static' : 'absolute',
      top: '32px',
      right: '32px',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '10px',
      marginTop: isMobile ? '24px' : '0',
      width: isMobile ? '100%' : 'auto'
    },
    btnOutline: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: isMobile ? 'center' : 'flex-start',
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
      justifyContent: isMobile ? 'center' : 'flex-start',
      gap: '8px',
      padding: '10px 18px',
      background: '#2563eb',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#fff',
      cursor: 'pointer',
    },
    navBar: {
      display: 'flex',
      gap: isMobile ? '20px' : '35px',
      marginTop:'-12px',
      backgroundColor: '#fff',
      borderRadius: '0 0 12px 12px',
      padding: isMobile ? '0 15px' : '0 32px',
      position: 'sticky',
      top:'-25px',
      zIndex: 1000,
      borderBottom: '1px solid #f1f5f9',
      paddingTop: '10px',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#6B7280',
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: isMobile ? '20px' : '32px',
      maxWidth: '500px',
      width: '95%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    formGroup: {
        marginBottom: '20px',
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
        boxSizing: 'border-box'
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
        boxSizing: 'border-box'
    },
  };

  // Logic functions remain unchanged
  const fetchStudentDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const url = `${API_URL}/students/${studentId}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
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
        setError(data.message || 'Failed to fetch student details');
      }
    } catch (err) {
      setError(`Failed to fetch student details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && studentId) fetchStudentDetails();
  }, [token, studentId]);

  const getInitials = (name) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`${API_URL}/students/${studentId}/download-report`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to download report');
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
      alert('Failed to download report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${API_URL}/students/${studentId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
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
      alert('Failed to update student. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={dynamicStyles.container}>
        <div style={dynamicStyles.loadingContainer}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <div>Loading details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div style={dynamicStyles.container}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>{error || 'Student not found'}</p>
          <button onClick={() => navigate('/students')} style={dynamicStyles.btnPrimary}>Back to Students</button>
        </div>
      </div>
    );
  }

  return (
    <div style={dynamicStyles.container}>
      <div style={dynamicStyles.profileCard}>
        <button
          onClick={() => navigate('/students')}
          style={{ ...dynamicStyles.backButton, position: 'absolute', top: '20px', left: '20px' }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          {!isMobile && 'Back to Students'}
        </button>

        <div style={dynamicStyles.avatarContainer}>
          {student.image ? (
            <img src={student.image} alt={student.name} style={dynamicStyles.avatar} />
          ) : (
            <div style={dynamicStyles.avatarFallback}>{getInitials(student.name)}</div>
          )}
        </div>

        <div style={dynamicStyles.infoArea}>
          <h1 style={dynamicStyles.name}>{student.name}</h1>
          <div style={dynamicStyles.metaRow}>
            <span style={dynamicStyles.metaItem}><AssignmentIndIcon style={dynamicStyles.metaIcon} /> ID: {student.studentId || student.id}</span>
            <span style={dynamicStyles.metaItem}><BookIcon style={dynamicStyles.metaIcon} /> {student.department}</span>
            <span style={dynamicStyles.metaItem}><LayersIcon style={dynamicStyles.metaIcon} /> Year {student.year}, Sem {student.semester}</span>
            <span style={dynamicStyles.metaItem}><PeopleIcon style={dynamicStyles.metaIcon} /> Faculty: {student.facultyName || 'N/A'}</span>
          </div>
        </div>

        <div style={dynamicStyles.btnGroup}>
          <button style={dynamicStyles.btnOutline} onClick={handleDownloadReport} disabled={downloading}>
            <DownloadIcon sx={{ fontSize: 18 }} />
            {downloading ? '...' : 'Report'}
          </button>
          <button style={dynamicStyles.btnPrimary} onClick={() => setShowEditModal(true)}>
            <EditIcon sx={{ fontSize: 18 }} /> Edit
          </button>
        </div>
      </div>

      <nav style={dynamicStyles.navBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '14px 2px',
                fontSize: '14px',
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? '#2563eb' : '#64748b',
                borderBottom: isActive ? '3px solid #2563eb' : '3px solid transparent'
              }}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: '20px' }}>
        {activeTab === 'Overview' && <Overview student={student} studentId={studentId} />}
        {activeTab === 'Attendance' && <AttendanceDashboard studentId={studentId} student={student} />}
        {activeTab === 'Tasks & Grades' && <TaskGrade studentId={studentId} student={student} />}
        {activeTab === 'Ranking' && <Ranking studentId={studentId} student={student} />}
      </div>

      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={dynamicStyles.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><CloseIcon /></button>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div style={dynamicStyles.formGroup}>
                <label style={dynamicStyles.label}>Name</label>
                <input type="text" name="name" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} style={dynamicStyles.input} required />
              </div>
              <div style={dynamicStyles.formGroup}>
                <label style={dynamicStyles.label}>Email</label>
                <input type="email" name="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} style={dynamicStyles.input} required />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ ...dynamicStyles.formGroup, flex: 1 }}>
                  <label style={dynamicStyles.label}>Year</label>
                  <select name="year" value={editForm.year} onChange={(e) => setEditForm({...editForm, year: e.target.value})} style={dynamicStyles.select}>
                    <option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option>
                  </select>
                </div>
                <div style={{ ...dynamicStyles.formGroup, flex: 1 }}>
                  <label style={dynamicStyles.label}>Sem</label>
                  <select name="semester" value={editForm.semester} onChange={(e) => setEditForm({...editForm, semester: e.target.value})} style={dynamicStyles.select}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={dynamicStyles.btnOutline}>Cancel</button>
                <button type="button" onClick={handleSaveEdit} style={dynamicStyles.btnPrimary}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHeader;
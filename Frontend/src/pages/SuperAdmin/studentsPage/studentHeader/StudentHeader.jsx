// import React, { useState } from 'react';
// // Correct Professional Icons from Material UI
// import EditIcon from '@mui/icons-material/EditOutlined';
// import DownloadIcon from '@mui/icons-material/DownloadOutlined';
// import AssignmentIndIcon from '@mui/icons-material/AssignmentIndOutlined'; // ID
// import BookIcon from '@mui/icons-material/MenuBookOutlined'; // Computer Science
// import LayersIcon from '@mui/icons-material/LayersOutlined'; // Year
// import PeopleIcon from '@mui/icons-material/PeopleOutlined'; // Group


// // Tabs component
// import Overview from './Overview/Overview';
// import AttendanceDashboard from './Attendance/Attendance';
// import TaskGrade from './Task&Grades/TaskGrade';
// import Ranking from './Ranking/Ranking';

// /**
//  * 1:1 Matching Data
//  */
// const DATA = {
//   name: "Emma Watson",
//   id: "20230045",
//   major: "Computer Science",
//   year: "3rd Year (Sem 5)",
//   group: "Group CS-A",
//   avatar: "https://i.pravatar.cc/150?u=s1" // Matching the profile look
// };

// const styles = {
//   container: {
//     padding: '30px',
//     backgroundColor: '#fff',
//     fontFamily: "'Inter', sans-serif",
//   },
//   // Main White Profile Box
//   profileCard: {
//     display: 'flex',
//     alignItems: 'center',
//     background: '#ffffff',
//     border: '1px solid #eef2f6',
//     borderRadius: '12px',
//     padding: '32px',
//     position: 'relative',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
//     marginBottom: '20px',
//   },
//   avatarContainer: {
//     marginRight: '28px',
//   },
//   avatar: {
//     width: '100px',
//     height: '100px',
//     borderRadius: '50%',
//     objectFit: 'cover',
//     // Perfect Circle Ring Style from Image
//     padding: '3px',
//     background: 'white',
//     border: '1.5px solid #d1e1fb',
//   },
//   infoArea: {
//     flexGrow: 1,
//   },
//   name: {
//     fontSize: '28px',
//     fontWeight: '700',
//     color: '#1e293b',
//     margin: '0 0 10px 0',
//     letterSpacing: '-0.02em',
//   },
//   metaRow: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '24px',
//     flexWrap: 'wrap',
//   },
//   metaItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '6px',
//     color: '#64748b',
//     fontSize: '14px',
//     fontWeight: '500',
//   },
//   metaIcon: {
//     fontSize: '16px',
//     color: '#94a3b8',
//   },
//   // Button Group Aligned to Top Right of card
//   btnGroup: {
//     position: 'absolute',
//     top: '32px',
//     right: '32px',
//     display: 'flex',
//     gap: '12px',
//   },
//   btnOutline: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     padding: '10px 18px',
//     background: '#fff',
//     border: '1px solid #e2e8f0',
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontWeight: '600',
//     color: '#334155',
//     cursor: 'pointer',
//   },
//   btnPrimary: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     padding: '10px 18px',
//     background: '#2563eb', // Pure profile blue
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontWeight: '600',
//     color: '#fff',
//     cursor: 'pointer',
//   },
//   // Tab Bar Style (Below the card)
//   navBar: {
//     display: 'flex',
//     gap: '35px',
//     marginTop: '10px',
//   },
//   tab: {
//     padding: '14px 2px',
//     fontSize: '15px',
//     fontWeight: '600',
//     background: 'none',
//     border: 'none',
//     cursor: 'pointer',
//     color: '#64748b',
//     borderBottom: '3px solid transparent',
//     transition: '0.2s ease',
//   },
//   tabActive: {
//     color: '#2563eb',
//     borderBottomColor: '#2563eb',
//   }
// };

// const StudentHeader = () => {
//   const [activeTab, setActiveTab] = useState('Overview');
//   const tabs = ['Overview', 'Attendance', 'Tasks & Grades', 'Ranking'];

//   return (
//     <div style={styles.container}>
      
//       {/* 1. Main Profile Card Wrapper */}
//       <div style={styles.profileCard}>
//         {/* Profile Circle Image */}
//         <div style={styles.avatarContainer}>
//           <img src={DATA.avatar} alt={DATA.name} style={styles.avatar} />
//         </div>

//         {/* Text Details Area */}
//         <div style={styles.infoArea}>
//           <h1 style={styles.name}>{DATA.name}</h1>
          
//           <div style={styles.metaRow}>
//             <span style={styles.metaItem}>
//               <AssignmentIndIcon style={styles.metaIcon} /> ID: {DATA.id}
//             </span>
//             <span style={styles.metaItem}>
//               <BookIcon style={styles.metaIcon} /> {DATA.major}
//             </span>
//             <span style={styles.metaItem}>
//               <LayersIcon style={styles.metaIcon} /> {DATA.year}
//             </span>
//             <span style={styles.metaItem}>
//               <PeopleIcon style={styles.metaIcon} /> {DATA.group}
//             </span>
//           </div>
//         </div>

//         {/* Buttons inside top-right card */}
//         <div style={styles.btnGroup}>
//           <button style={styles.btnOutline}>
//             <DownloadIcon sx={{ fontSize: 18 }} /> Download Report
//           </button>
//           <button style={styles.btnPrimary}>
//             <EditIcon sx={{ fontSize: 18 }} /> Edit Profile
//           </button>
//         </div>
//       </div>

//       {/* 2. Navigation Tabs (Correct List from Image) */}
//       <nav style={styles.navBar}>
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             style={{
//               ...styles.tab,
//               ...(activeTab === tab ? styles.tabActive : {borderBottom:'0px'})
//             }}
//           >
//             {tab}
//           </button>
//         ))}
//       </nav>

//       {/* 3. Component Content Area */}
//       <div style={{ marginTop: '20px' }}>
//         {activeTab === 'Overview' ? <Overview /> :
//         activeTab === 'Attendance' ? <AttendanceDashboard />:
//         activeTab === 'Tasks & Grades'? <TaskGrade/> : <Ranking/>}
//       </div>

//     </div>
//   );
// };

// export default StudentHeader;

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

// Tab Components
import Overview from './Overview/Overview';
import AttendanceDashboard from './Attendance/Attendance';
import TaskGrade from './Task&Grades/TaskGrade';
import Ranking from './Ranking/Ranking';

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f9fafb',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    minHeight:  '100vh',
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    marginBottom: '8px',
  },
  avatarContainer: {
    marginRight: '28px',
  },
  avatar:  {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit:  'cover',
    padding:  '3px',
    background:  'white',
    border: '2px solid #d1e1fb',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)',
  },
  avatarFallback: {
    width:  '100px',
    height:  '100px',
    borderRadius: '50%',
    backgroundColor: '#3B82F6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: '700',
    border: '2px solid #d1e1fb',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)',
  },
  infoArea: { flexGrow: 1 },
  name: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 12px 0',
    letterSpacing: '-0.02em',
  },
  metaRow: {
    display:  'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  metaItem:  {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
  },
  metaIcon: {
    fontSize: '18px',
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
    display: 'flex',
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
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
  },
  navBar: {
    display: 'flex',
    gap: '35px',
    marginTop: '10px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '0 32px',
    border: '1px solid #eef2f6',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  tab: {
    padding: '16px 2px',
    fontSize: '15px',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    borderBottom: '3px solid transparent',
    transition: '0.2s ease',
    marginBottom: '-1px', // Aligns with the borderBottom of navBar
  },
  tabActive: {
    color: '#2563eb',
    borderBottomColor: '#2563eb',
  },
  loadingContainer: {
    display:  'flex',
    justifyContent: 'center',
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
    padding:  '60px 40px',
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius:  '12px',
    color:  '#6B7280',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  }
};

const StudentHeader = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Attendance', 'Tasks & Grades', 'Ranking'];

  // Fetch single student data
  const fetchStudentDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/students/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStudent(data.data);
      } else {
        setError(data.message || 'Failed to fetch student details');
      }
    } catch (err) {
      console.error('Error fetching student:', err);
      setError('Failed to fetch student details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && studentId) {
      fetchStudentDetails();
    }
  }, [token, studentId]);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleDownloadReport = () => {
    console.log('Downloading report for student:', studentId);
    alert('Download Report functionality - Coming Soon!');
  };

  const handleEditProfile = () => {
    console.log('Editing profile for student:', studentId);
    alert('Edit Profile functionality - Coming Soon!');
  };

  // Loading State
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '16px',
              animation: 'pulse 1. 5s ease-in-out infinite'
            }}>
              📚
            </div>
            Loading student details...
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div style={styles. container}>
        <div style={styles.errorContainer}>
          <span>⚠️ {error}</span>
          <button 
            onClick={() => navigate('/students')}
            style={styles.errorButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!student) {
    return (
      <div style={styles. container}>
        <div style={styles.notFoundContainer}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
            Student Not Found
          </h2>
          <p style={{ marginBottom: '24px', color:  '#6B7280' }}>
            The student you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate('/students')}
            style={{
              ... styles.btnPrimary,
              margin: '0 auto'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            <ArrowBackIcon sx={{ fontSize:  18 }} />
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button 
        onClick={() => navigate('/students')}
        style={styles.backButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f9fafb';
          e. currentTarget.style.borderColor = '#d1d5db';
        }}
        onMouseLeave={(e) => {
          e.currentTarget. style.backgroundColor = 'white';
          e.currentTarget.style.borderColor = '#E5E7EB';
        }}
      >
        <ArrowBackIcon sx={{ fontSize:  18 }} />
        Back to Students
      </button>

      {/* Main Profile Card */}
      <div style={styles.profileCard}>
        {/* Avatar */}
        <div style={styles.avatarContainer}>
          {student.image ? (
            <img 
              src={student.image} 
              alt={student.name} 
              style={styles.avatar} 
            />
          ) : (
            <div style={styles.avatarFallback}>
              {getInitials(student.name)}
            </div>
          )}
        </div>

        {/* Student Info */}
        <div style={styles.infoArea}>
          <h1 style={styles.name}>{student. name}</h1>
          
          <div style={styles.metaRow}>
            <span style={styles.metaItem}>
              <AssignmentIndIcon style={styles.metaIcon} /> 
              ID: {student.studentId || student.id}
            </span>
            <span style={styles. metaItem}>
              <BookIcon style={styles.metaIcon} /> 
              {student.department}
            </span>
            <span style={styles.metaItem}>
              <LayersIcon style={styles.metaIcon} /> 
              {student.year} Year (Sem {student.semester})
            </span>
            <span style={styles.metaItem}>
              <PeopleIcon style={styles.metaIcon} /> 
              Faculty: {student.facultyName || 'Not Assigned'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.btnGroup}>
          <button 
            style={styles.btnOutline}
            onClick={handleDownloadReport}
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
            Download Report
          </button>
          <button 
            style={styles. btnPrimary}
            onClick={handleEditProfile}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            <EditIcon sx={{ fontSize: 18 }} /> 
            Edit Profile
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={styles.navBar}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ?  styles.tabActive : { borderBottom: '3px solid transparent' })
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Tab Content Area */}
      <div style={{ marginTop: '20px' }}>
        {activeTab === 'Overview' && <Overview student={student} studentId={studentId} />}
        {activeTab === 'Attendance' && <AttendanceDashboard studentId={studentId} student={student} />}
        {activeTab === 'Tasks & Grades' && <TaskGrade studentId={studentId} student={student} />}
        {activeTab === 'Ranking' && <Ranking studentId={studentId} student={student} />}
      </div>
    </div>
  );
};

export default StudentHeader;
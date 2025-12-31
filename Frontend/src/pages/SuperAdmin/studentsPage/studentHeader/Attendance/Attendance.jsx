import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../../../store/useAuthStore';
import {
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const AttendanceManagement = () => {
  const { token, user } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL;

  const [venues, setVenues] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('Morning');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ present: 0, late: 0, absent: 0 });

  // Fetch venues on component mount
  useEffect(() => {
    console.log('🔵 Component mounted, user:', user);
    if (user?. user_id) {
      fetchVenues();
    }
  }, [user, token, API_URL]);

  // Fetch students when venue is selected
  useEffect(() => {
    console.log('🟡 Venue changed:', selectedVenue);
    if (selectedVenue && selectedVenue !== '') {
      console.log('✅ Fetching students for venue:', selectedVenue);
      fetchStudents();
      createOrGetSession();
    } else {
      console.log('⚠️ No venue selected, clearing students');
      setStudents([]);
      setSessionId(null);
    }
  }, [selectedVenue, selectedDate, selectedTimeSlot]);

  // Update stats when students data changes
  useEffect(() => {
    updateStats();
  }, [students]);

  const fetchVenues = async () => {
    try {
      console.log('📍 Fetching venues for user:', user. user_id);
      const response = await fetch(`${API_URL}/attendance/venues/${user.user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('✅ Venues response:', data);

      if (data.success) {
        console.log('📋 Setting venues:', data.data);
        setVenues(data. data);
      } else {
        console.error('❌ Failed to fetch venues:', data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching venues:', error);
    }
  };

  const fetchStudents = async () => {
    if (!selectedVenue) {
      console.log('⚠️ fetchStudents called but no venue selected');
      return;
    }

    setLoading(true);
    try {
      console.log('📋 Fetching students for venue:', selectedVenue, 'user:', user.user_id);
      const response = await fetch(
        `${API_URL}/attendance/students/${selectedVenue}/${user.user_id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response. json();
      console.log('✅ Students response:', data);

      if (data.success) {
        const studentsWithStatus = data.data.map(student => ({
          ...student,
          status: '',
          remarks: ''
        }));
        console.log('👥 Setting students:', studentsWithStatus. length);
        setStudents(studentsWithStatus);
      } else {
        console.error('❌ Failed to fetch students:', data.message);
        setStudents([]);
      }
    } catch (error) {
      console.error('❌ Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const createOrGetSession = async () => {
    if (!selectedVenue) {
      console.log('⚠️ createOrGetSession called but no venue selected');
      return;
    }

    try {
      console.log('🔄 Creating/getting session for venue:', selectedVenue);
      const selectedVenueObj = venues.find(v => v.venue_id. toString() === selectedVenue.toString());
      const venueName = selectedVenueObj?. venue_name || 'Session';
      
      console.log('📝 Session details:', { venueName, date: selectedDate, timeSlot:  selectedTimeSlot });
      
      const response = await fetch(`${API_URL}/attendance/session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON. stringify({
          sessionName: venueName,
          date: selectedDate,
          timeSlot: selectedTimeSlot
        })
      });

      const data = await response.json();
      console.log('✅ Session response:', data);

      if (data.success) {
        console.log('🆔 Session ID:', data.data.session_id);
        setSessionId(data.data.session_id);
      } else {
        console.error('❌ Failed to create session:', data.message);
      }
    } catch (error) {
      console.error('❌ Error creating session:', error);
    }
  };

  const handleVenueChange = (e) => {
    const newVenue = e.target. value;
    console.log('🎯 Venue dropdown changed to:', newVenue);
    console.log('🔍 Type of new venue:', typeof newVenue);
    console.log('📋 Available venues:', venues);
    setSelectedVenue(newVenue);
  };

  const handleStatusChange = (studentId, newStatus) => {
    console.log('✏️ Status changed for student:', studentId, 'to:', newStatus);
    setStudents(prev =>
      prev.map(student =>
        student.student_id === studentId
          ? { ...student, status: newStatus }
          : student
      )
    );
  };

  const handleRemarksChange = (studentId, remarks) => {
    setStudents(prev =>
      prev.map(student =>
        student.student_id === studentId
          ? { ...student, remarks }
          : student
      )
    );
  };

  const updateStats = () => {
    const present = students.filter(s => s.status === 'present').length;
    const late = students. filter(s => s.status === 'late').length;
    const absent = students.filter(s => s.status === 'absent').length;
    setStats({ present, late, absent });
  };

  const handleSaveAttendance = async () => {
    if (!sessionId) {
      alert('Session not created. Please try again.');
      return;
    }

    const unmarkedStudents = students.filter(s => ! s.status);
    if (unmarkedStudents.length > 0) {
      const confirmSave = window.confirm(
        `${unmarkedStudents.length} students are unmarked. Do you want to continue?`
      );
      if (!confirmSave) return;
    }

    setSaving(true);

    try {
      console.log('💾 Saving attendance.. .');
      const attendanceData = students.map(student => ({
        student_id: student.student_id,
        status: student.status || 'absent',
        remarks: student.remarks
      }));

      const response = await fetch(`${API_URL}/attendance/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          facultyId: user.user_id,
          venueId: selectedVenue,
          sessionId: sessionId,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          attendance: attendanceData
        })
      });

      const data = await response.json();
      console.log('✅ Save response:', data);

      if (data.success) {
        alert('✅ Attendance saved successfully!');
      } else {
        alert('❌ ' + (data.message || 'Failed to save attendance'));
      }
    } catch (error) {
      console.error('❌ Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('🔴 Current state:', { 
    selectedVenue, 
    venuesCount: venues.length, 
    studentsCount: students.length,
    loading 
  });

  return (
    <div style={styles.container}>
      <style>{`
        .attendance-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f8fafc;
          min-height: 100vh;
          padding: 24px;
        }

        . header-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .controls-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        . form-group {
          display:  flex;
          flex-direction:  column;
          gap: 8px;
        }

        .form-label {
          font-size: 13px;
          font-weight:  600;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        . form-select, .form-input {
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size:  14px;
          outline: none;
          transition: all 0.2s;
          background: white;
        }

        .form-select:focus, .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .stats-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .stat-card {
          flex: 1;
          min-width: 150px;
          padding: 16px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-card.present { background: #dcfce7; }
        .stat-card.late { background: #fef3c7; }
        .stat-card.absent { background: #fee2e2; }

        . stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 24px;
          font-weight:  800;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          opacity: 0.7;
        }

        .students-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .students-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        . search-input {
          width: 100%;
          padding: 10px 10px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius:  8px;
          font-size: 14px;
          outline: none;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .save-btn {
          padding: 10px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .save-btn:hover: not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .save-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .students-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .students-table thead th {
          background: #f8fafc;
          padding: 12px 16px;
          text-align: left;
          font-size: 12px;
          font-weight:  700;
          color: #64748b;
          text-transform: uppercase;
          border-bottom: 2px solid #e2e8f0;
        }

        .students-table tbody td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .students-table tbody tr:hover {
          background: #f8fafc;
        }

        .student-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        . student-avatar {
          width:  40px;
          height:  40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: white;
        }

        .student-details {
          display: flex;
          flex-direction: column;
        }

        .student-name {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
        }

        .student-id {
          font-size: 12px;
          color: #94a3b8;
        }

        .status-buttons {
          display: flex;
          gap: 8px;
        }

        .status-btn {
          padding: 6px 16px;
          border:  1px solid #e2e8f0;
          border-radius: 6px;
          font-size:  13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .status-btn.active. present {
          background: #dcfce7;
          border-color: #86efac;
          color: #166534;
        }

        . status-btn.active.late {
          background: #fef3c7;
          border-color: #fde68a;
          color: #92400e;
        }

        .status-btn.active.absent {
          background: #fee2e2;
          border-color: #fecaca;
          color: #991b1b;
        }

        .remarks-input {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
          width: 100%;
          outline:  none;
        }

        . empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom:  16px;
          opacity: 0.3;
        }
      `}</style>

      <div className="attendance-container">
        {/* Header Controls */}
        <div className="header-card">
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
            Mark Attendance
          </h2>

          <div className="controls-grid">
            <div className="form-group">
              <label className="form-label">
                <SchoolIcon style={{ fontSize: 18 }} />
                Select Venue
              </label>
              <select
                className="form-select"
                value={selectedVenue}
                onChange={handleVenueChange}
              >
                <option value="">Choose a venue... </option>
                {venues.map(venue => (
                  <option key={`venue-${venue.venue_id}`} value={venue.venue_id}>
                    {venue. venue_name} ({venue.student_count} students)
                  </option>
                ))}
              </select>
              {/* Debug info */}
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                Selected: {selectedVenue || 'None'} | Venues loaded: {venues.length}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <CalendarIcon style={{ fontSize: 18 }} />
                Date
              </label>
              <input
                type="date"
                className="form-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <ScheduleIcon style={{ fontSize: 18 }} />
                Time Slot
              </label>
              <select
                className="form-select"
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
              >
                <option value="Morning">Morning (9:00 AM - 12:00 PM)</option>
                <option value="Afternoon">Afternoon (1:00 PM - 4:00 PM)</option>
                <option value="Evening">Evening (4:00 PM - 7:00 PM)</option>
              </select>
            </div>
          </div>

          {/* Stats Row */}
          {students.length > 0 && (
            <div className="stats-row" style={{ marginTop: '20px' }}>
              <div className="stat-card present">
                <div className="stat-icon" style={{ background: '#86efac' }}>
                  <CheckCircleIcon style={{ color: '#166534', fontSize: 22 }} />
                </div>
                <div className="stat-content">
                  <div className="stat-value" style={{ color: '#166534' }}>{stats.present}</div>
                  <div className="stat-label" style={{ color: '#166534' }}>Present</div>
                </div>
              </div>

              <div className="stat-card late">
                <div className="stat-icon" style={{ background:  '#fde68a' }}>
                  <AccessTimeIcon style={{ color: '#92400e', fontSize: 22 }} />
                </div>
                <div className="stat-content">
                  <div className="stat-value" style={{ color:  '#92400e' }}>{stats.late}</div>
                  <div className="stat-label" style={{ color: '#92400e' }}>Late</div>
                </div>
              </div>

              <div className="stat-card absent">
                <div className="stat-icon" style={{ background: '#fecaca' }}>
                  <CancelIcon style={{ color: '#991b1b', fontSize: 22 }} />
                </div>
                <div className="stat-content">
                  <div className="stat-value" style={{ color:  '#991b1b' }}>{stats.absent}</div>
                  <div className="stat-label" style={{ color: '#991b1b' }}>Absent</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Students List */}
        {selectedVenue && (
          <div className="students-card">
            <div className="students-header">
              <div className="search-box">
                <PersonIcon className="search-icon" style={{ fontSize: 20 }} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                className="save-btn"
                onClick={handleSaveAttendance}
                disabled={saving || students.length === 0}
              >
                <SaveIcon style={{ fontSize: 20 }} />
                {saving ?  'Saving...' : 'Save Attendance'}
              </button>
            </div>

            {loading ?  (
              <div className="empty-state">
                <div>Loading students...</div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  No Students Found
                </div>
                <div style={{ fontSize: '14px' }}>
                  {students.length === 0
                    ? 'No students enrolled in this venue'
                    :  'No students match your search'}
                </div>
              </div>
            ) : (
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={`student-${student.student_id}`}>
                      <td>
                        <div className="student-info">
                          <div
                            className="student-avatar"
                            style={{ background: student.avatarColor }}
                          >
                            {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div className="student-details">
                            <div className="student-name">{student.name}</div>
                            <div className="student-id">ID: {student.id}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>
                          {student.department}
                        </span>
                      </td>

                      <td>
                        <div className="status-buttons">
                          <button
                            className={`status-btn present ${student.status === 'present' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(student.student_id, 'present')}
                          >
                            Present
                          </button>
                          <button
                            className={`status-btn late ${student.status === 'late' ? 'active' : ''}`}
                            onClick={() => handleStatusChange(student.student_id, 'late')}
                          >
                            Late
                          </button>
                          <button
                            className={`status-btn absent ${student.status === 'absent' ? 'active' :  ''}`}
                            onClick={() => handleStatusChange(student.student_id, 'absent')}
                          >
                            Absent
                          </button>
                        </div>
                      </td>

                      <td>
                        <input
                          type="text"
                          className="remarks-input"
                          placeholder="Add remarks..."
                          value={student.remarks}
                          onChange={(e) => handleRemarksChange(student.student_id, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {! selectedVenue && (
          <div className="students-card">
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                Select a Venue to Begin
              </div>
              <div style={{ fontSize: '14px' }}>
                Choose a venue from the dropdown above to view students and mark attendance
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh'
  }
};

export default AttendanceManagement;
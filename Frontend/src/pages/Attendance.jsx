import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Attendance = () => {
  const { classes, students, markAttendance } = useApp();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});

  const handleClassChange = (e) => setSelectedClassId(e.target.value);
  
  const handleToggle = (studentId) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSave = () => {
    if (!selectedClassId) return;
    markAttendance(selectedClassId, date, attendanceData);
    alert('Attendance Saved!');
  };

  // Filter students by class
  const classStudents = selectedClassId 
    ? classes.find(c => c.id === selectedClassId)?.studentIds.map(id => students.find(s => s.id === id)).filter(Boolean)
    : [];

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Attendance Tracking</h2>
        <p style={{ color: 'var(--text-muted)' }}>Mark daily attendance for your classes.</p>
      </header>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Select Class</label>
          <select className="input-field" value={selectedClassId} onChange={handleClassChange}>
            <option value="">-- Choose Venue --</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date</label>
          <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      </div>

      {selectedClassId && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Students List</h3>
            <button className="btn-primary" onClick={handleSave}>Save Attendance</button>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)' }}>Student Name</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)' }}>Roll No</th>
                <th style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.length > 0 ? classStudents.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{student.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{student.rollNo}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleToggle(student.id)}
                      style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        background: attendanceData[student.id] ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: attendanceData[student.id] ? '#34d399' : '#f87171'
                      }}
                    >
                      {attendanceData[student.id] ? 'Present' : 'Absent'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No students mapped to this class yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendance;

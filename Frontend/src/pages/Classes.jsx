import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Users, UserPlus } from 'lucide-react';

const Classes = () => {
  const { classes, addClass, addStudent } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', room: '', subject: '' });
  const [studentData, setStudentData] = useState({ name: '', rollNo: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addClass(formData);
    setFormData({ name: '', room: '', subject: '' });
    setIsModalOpen(false);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (selectedClassId) {
      addStudent(studentData, selectedClassId);
      setStudentData({ name: '', rollNo: '' });
      setIsStudentModalOpen(false);
    }
  };

  const openStudentModal = (classId) => {
    setSelectedClassId(classId);
    setIsStudentModalOpen(true);
  };

  return (
    <div>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>My Classes</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your venues and students.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} />
          <span>Create Class</span>
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {classes.map((cls) => (
          <div key={cls.id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--primary), var(--secondary))' }}></div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{cls.name}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{cls.subject} • {cls.room}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-highlight)' }}>
              <Users size={18} />
              <span>{cls.studentIds.length} Students Enrolled</span>
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
               <button className="btn-icon" style={{ background: 'rgba(255,255,255,0.1)', flex: 1, fontSize: '0.875rem' }}>View Details</button>
               <button 
                onClick={() => openStudentModal(cls.id)}
                className="btn-icon" 
                style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', flex: 1, fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                 <UserPlus size={16} /> Add Student
               </button>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="glass-panel" style={{ padding: '3rem', gridColumn: '1 / -1', textAlign: 'center', borderStyle: 'dashed' }}>
            <p style={{ color: 'var(--text-muted)' }}>No classes found. Create one to get started.</p>
          </div>
        )}
      </div>

      {/* Create Class Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Create New Class</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Class Name</label>
                <input required type="text" className="input-field" placeholder="e.g. CS-Year-3-A" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Subject/Course</label>
                <input required type="text" className="input-field" placeholder="e.g. Web Development" 
                  value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Venue/Room</label>
                <input required type="text" className="input-field" placeholder="e.g. Lab 201" 
                  value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-icon" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Venue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isStudentModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Add Student</h3>
            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Student Name</label>
                <input required type="text" className="input-field" placeholder="e.g. John Doe" 
                  value={studentData.name} onChange={e => setStudentData({...studentData, name: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Roll Number</label>
                <input required type="text" className="input-field" placeholder="e.g. 21CS001" 
                  value={studentData.rollNo} onChange={e => setStudentData({...studentData, rollNo: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsStudentModalOpen(false)} className="btn-icon" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;

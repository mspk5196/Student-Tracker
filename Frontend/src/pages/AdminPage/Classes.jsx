import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Users, UserPlus, BookOpen, MapPin, Search, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Classes = () => {
  const { classes, addClass, addStudent } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({ name: '', room: '', subject: '' });
  const [studentData, setStudentData] = useState({ name: '', rollNo: '' });

  // Filter classes dynamically based on search
  const filteredClasses = useMemo(() => {
    return classes.filter(cls => 
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classes, searchTerm]);

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '20px' }}
    >
      {/* Header Section */}
      <header style={{ marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', background: 'linear-gradient(to right, #fff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Classroom Hub
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Organize your academic venues and student rosters.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', color: 'rgba(255,255,255,0.4)' }} />
            <input 
              type="text" 
              placeholder="Search classes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                padding: '0.6rem 1rem 0.6rem 2.5rem', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                color: 'white',
                outline: 'none',
                width: '250px'
              }} 
            />
          </div>
          
          <button 
            className="btn-primary" 
            onClick={() => setIsModalOpen(true)} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)' 
            }}
          >
            <Plus size={20} />
            <span>Create Class</span>
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <motion.div 
        layout
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
      >
        <AnimatePresence>
          {filteredClasses.map((cls) => (
            <motion.div
              layout
              key={cls.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              whileHover={{ y: -5 }}
              className="glass-panel"
              style={{ 
                padding: '1.5rem', 
                position: 'relative', 
                overflow: 'hidden', 
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)'
              }}
            >
              {/* Decorative Gradient Line */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '10px' }}>
                  <BookOpen size={20} color="#a78bfa" />
                </div>
                <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}>
                  ID: {cls.id.slice(0, 5)}
                </span>
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff', marginBottom: '0.25rem' }}>{cls.name}</h3>
              <p style={{ color: '#a78bfa', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>{cls.subject}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  <MapPin size={16} />
                  <span>{cls.room}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  <Users size={16} />
                  <span>{cls.studentIds?.length || 0} Students Enrolled</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                 <button 
                  className="btn-icon" 
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    flex: 1, 
                    fontSize: '0.85rem', 
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                 >
                   Details <ArrowRight size={14} />
                 </button>
                 <button 
                  onClick={() => {
                    setSelectedClassId(cls.id);
                    setIsStudentModalOpen(true);
                  }}
                  className="btn-icon" 
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))', 
                    color: '#ddd', 
                    flex: 1, 
                    fontSize: '0.85rem', 
                    borderRadius: '10px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.4rem' 
                  }}>
                   <UserPlus size={16} /> Add Student
                 </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredClasses.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              padding: '4rem', 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              border: '2px dashed rgba(255,255,255,0.1)',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.02)'
            }}
          >
            <div style={{ marginBottom: '1rem', opacity: 0.3 }}>
              <Plus size={48} style={{ margin: '0 auto' }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>
              {searchTerm ? "No classes match your search." : "Your classroom is empty. Create your first class!"}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* --- MODALS (Enhanced with AnimatePresence) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal title="Create New Class" onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <InputField label="Class Name" placeholder="e.g. Computer Science - A" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
              <InputField label="Subject" placeholder="e.g. Data Structures" value={formData.subject} onChange={v => setFormData({...formData, subject: v})} />
              <InputField label="Venue / Room" placeholder="e.g. Hall 4B" value={formData.room} onChange={v => setFormData({...formData, room: v})} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={cancelBtnStyle}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 2, borderRadius: '10px' }}>Create Venue</button>
              </div>
            </form>
          </Modal>
        )}

        {isStudentModalOpen && (
          <Modal title="Enroll New Student" onClose={() => setIsStudentModalOpen(false)}>
            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <InputField label="Student Name" placeholder="Full Name" value={studentData.name} onChange={v => setStudentData({...studentData, name: v})} />
              <InputField label="Roll Number" placeholder="ID Number" value={studentData.rollNo} onChange={v => setStudentData({...studentData, rollNo: v})} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsStudentModalOpen(false)} style={cancelBtnStyle}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 2, borderRadius: '10px' }}>Add to Class</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* --- REUSABLE SUB-COMPONENTS TO CLEAN UP THE UI --- */

const Modal = ({ children, title, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} 
      animate={{ scale: 1, y: 0 }} 
      exit={{ scale: 0.9, y: 20 }}
      className="glass-panel" 
      style={{ width: '100%', maxWidth: '450px', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.15)', background: '#111' }}
    >
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white' }}>{title}</h3>
      {children}
    </motion.div>
  </motion.div>
);

const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>{label}</label>
    <input 
      required 
      type={type} 
      className="input-field" 
      placeholder={placeholder} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      style={{
        width: '100%',
        padding: '0.8rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: 'white'
      }}
    />
  </div>
);

const cancelBtnStyle = {
  flex: 1,
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
  padding: '0.8rem',
  borderRadius: '10px',
  cursor: 'pointer'
};

export default Classes;
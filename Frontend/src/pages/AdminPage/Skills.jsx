import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const Skills = () => {
  const { classes, students, updateSkill } = useApp();
  const [selectedClassId, setSelectedClassId] = useState('');

  // Mock skills columns
  const skillColumns = ['React Basics', 'Components', 'State/Props', 'Hooks', 'Routing'];

  const classStudents = selectedClassId 
    ? classes.find(c => c.id === selectedClassId)?.studentIds.map(id => students.find(s => s.id === id)).filter(Boolean)
    : [];

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Skill Tracking Matrix</h2>
        <p style={{ color: 'var(--text-muted)' }}>Monitor student progress across key competencies.</p>
      </header>

      <div style={{ marginBottom: '2rem' }}>
        <select className="input-field" style={{ maxWidth: '300px' }} value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
          <option value="">-- Select Class to View Skills --</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {selectedClassId && (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ textAlign: 'left', padding: '1.5rem', minWidth: '200px' }}>Student</th>
                  {skillColumns.map(skill => (
                    <th key={skill} style={{ padding: '1.5rem', textAlign: 'center', whiteSpace: 'nowrap' }}>{skill}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classStudents.map(student => (
                  <tr key={student.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1.5rem', fontWeight: 500 }}>{student.name}</td>
                    {skillColumns.map(skill => {
                      const status = student.skills?.[skill] || 'Pending';
                      return (
                        <td key={skill} style={{ padding: '1rem', textAlign: 'center' }}>
                          <select 
                            value={status} 
                            onChange={(e) => updateSkill(student.id, skill, e.target.value)}
                            style={{ 
                              background: 'transparent', 
                              border: '1px solid var(--border-color)', 
                              color: status === 'Completed' ? '#34d399' : status === 'In Progress' ? '#fbbf24' : '#94a3b8',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {classStudents.length === 0 && (
                  <tr><td colSpan={skillColumns.length + 1} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;

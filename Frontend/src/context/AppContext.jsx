import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initial Mock Data or Load from LocalStorage
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('classes');
    return saved ? JSON.parse(saved) : [];
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('attendance');
    return saved ? JSON.parse(saved) : [];
  });

  // Effects to save data
  useEffect(() => { localStorage.setItem('classes', JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem('students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('attendance', JSON.stringify(attendance)); }, [attendance]);

  // Actions
  const addClass = (classData) => {
    const newClass = { ...classData, id: Date.now().toString(), studentIds: [] };
    setClasses([...classes, newClass]);
  };

  const addStudent = (studentData, classId) => {
    const newStudent = { ...studentData, id: Date.now().toString(), skills: {} };
    setStudents([...students, newStudent]);
    
    // Map student to class
    setClasses(classes.map(c => 
      c.id === classId ? { ...c, studentIds: [...c.studentIds, newStudent.id] } : c
    ));
  };

  const addTask = (taskData) => {
    const newTask = { ...taskData, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setTasks([...tasks, newTask]);
  };

  const markAttendance = (classId, date, records) => {
    // Check if record exists for this date and class
    const existingIndex = attendance.findIndex(a => a.classId === classId && a.date === date);
    if (existingIndex >= 0) {
      const updated = [...attendance];
      updated[existingIndex].records = records;
      setAttendance(updated);
    } else {
      setAttendance([...attendance, { id: Date.now().toString(), classId, date, records }]);
    }
  };

  const updateSkill = (studentId, skillName, status) => {
    setStudents(students.map(s => 
      s.id === studentId 
        ? { ...s, skills: { ...s.skills, [skillName]: status } } 
        : s
    ));
  };

  const value = {
    classes,
    students,
    tasks,
    attendance,
    addClass,
    addStudent,
    addTask,
    markAttendance,
    updateSkill
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);

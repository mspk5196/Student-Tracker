import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// MUI Icon Imports
import { 
  FolderOpen, 
  Assignment, 
  Groups, 
  Search, 
  Verified, 
  CalendarMonth, 
  ArrowForwardIos,
  ChevronRight,
  FactCheck,
  CheckCircle,
  Cancel,
  RemoveCircle,
  TrendingUp
} from '@mui/icons-material';

    // --- Custom Hook for Responsive Logic ---
    const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    });

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
    };

    const ClassDetails = () => {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const isMobile = width <= 768;

    // --- DATA SOURCE (JSON) ---
    const data = {
        course: {
        title: "React Fundamentals & Modern UI Design",
        code: "CS-204",
        semester: "Semester 3",
        batch: "Batch 2024",
        faculty: {
            name: "Dr. Sarah Connor",
            role: "Senior Professor, CSE",
            avatar: "https://i.pravatar.cc/150?u=sarah"
        },
        schedule: "Mon, Wed, Fri • 10:00 AM",
        enrolled: 42,
        status: "Active Group"
        },
        students: [
        { id: "20230015", name: "Emma Watson", dept: "Computer Science", year: "3rd Year", sem: "Sem 5", attendance: "94%", tasks: "12/12", img: "https://i.pravatar.cc/150?u=emma" },
        { id: "20230102", name: "Liam Johnson", dept: "Engineering", year: "2nd Year", sem: "Sem 3", attendance: "72%", tasks: "8/10", img: "https://i.pravatar.cc/150?u=liam" },
        { id: "20220955", name: "Noah Williams", dept: "Business", year: "4th Year", sem: "Sem 8", attendance: "88%", tasks: "15/15", img: "https://i.pravatar.cc/150?u=noah" },
        { id: "20230089", name: "James Miller", dept: "Computer Science", year: "2nd Year", sem: "Sem 4", attendance: "91%", tasks: "10/10", img: "https://i.pravatar.cc/150?u=james" },
        { id: "20230045", name: "Sophia Turner", dept: "Engineering", year: "3rd Year", sem: "Sem 5", attendance: "85%", tasks: "11/12", img: "https://i.pravatar.cc/150?u=sophia" },
        { id: "20230012", name: "Olivia Brown", dept: "Business", year: "1st Year", sem: "Sem 1", attendance: "98%", tasks: "5/5", img: "https://i.pravatar.cc/150?u=olivia" },
        ],
        skillStatus: [
        {
            id: 1,
            groupName: "HTML & CSS Fundamentals",
            venue: "Vedanayagam Hall",
            totalStudents: 42,
            completed: 28,
            notCompleted: 7,
            notAttempted: 7,
            averageScore: 78.5
        },
        {
            id: 2,
            groupName: "JavaScript ES6",
            venue: "Vedanayagam Hall",
            totalStudents: 42,
            completed: 15,
            notCompleted: 18,
            notAttempted: 9,
            averageScore: 65.2
        },
        {
            id: 3,
            groupName: "React Basics",
            venue: "CSE Lab 1",
            totalStudents: 42,
            completed: 22,
            notCompleted: 10,
            notAttempted: 10,
            averageScore: 72.8
        },
        {
            id: 4,
            groupName: "Node.js Backend",
            venue: "CSE Lab 2",
            totalStudents: 42,
            completed: 12,
            notCompleted: 15,
            notAttempted: 15,
            averageScore: 68.4
        }
        ]
    };

    // --- STATE ---
    const [searchTerm, setSearchTerm] = useState("");
    const [deptFilter, setDeptFilter] = useState("All Departments");
    const [yearFilter, setYearFilter] = useState("All Years");
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 4;

    // --- LOGIC ---
    const filteredStudents = useMemo(() => {
        return data.students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.includes(searchTerm);
        const matchesDept = deptFilter === "All Departments" || s.dept === deptFilter;
        const matchesYear = yearFilter === "All Years" || s.year === yearFilter;
        return matchesSearch && matchesDept && matchesYear;
        });
    }, [searchTerm, deptFilter, yearFilter]);

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    // --- STYLES ---
    const s = {
        container: { fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' },
        
        Wrapper: { padding: '0 0 10px 0' },
        headerCard: { 
        backgroundColor: '#eff6ff', 
        borderRadius: '16px', 
        padding: isMobile ? '20px' : '24px 32px', 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        borderLeft: '6px solid #3b82f6',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        gap: isMobile ? '20px' : '0'
        },
        
        facultySection: { display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' },
        avatarLarge: { width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' },
        badge: { 
        backgroundColor: '#dcfce7', 
        color: '#166534', 
        padding: '4px 12px', 
        borderRadius: '20px', 
        fontSize: '12px', 
        fontWeight: '600', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '4px' 
        },
        
        quickActions: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
        gap: '20px', 
        margin: '32px 0 40px 0' 
        },
        actionCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
        
        filterBar: { 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: '12px', 
        marginBottom: '24px', 
        alignItems: 'stretch' 
        },
        inputWrapper: { flex: 2, position: 'relative', display: 'flex', alignItems: 'center' },
        input: { width: '100%', padding: '12px 16px 12px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' },
        searchIcon: { position: 'absolute', left: '12px', color: '#94a3b8', fontSize: '20px' },
        select: { padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontSize: '14px', cursor: 'pointer', flex: 1 },
        
        studentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '24px' },
        
        pagination: { 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '40px', 
        padding: '20px 0', 
        borderTop: '1px solid #e2e8f0',
        gap: isMobile ? '20px' : '0'
        },
        pageBtn: { padding: '8px 16px', cursor: 'pointer', border: 'none', background: 'none', fontWeight: '600', fontSize: '14px' },
        pageNum: (active) => ({ 
        width: '36px', height: '36px', borderRadius: '8px', border: 'none', margin: '0 4px', cursor: 'pointer', fontWeight: '600',
        backgroundColor: active ? '#2563eb' : 'transparent', color: active ? 'white' : '#64748b', transition: '0.2s'
        })
    };

    return (
        <div style={s.container}>
        <div style={s.Wrapper}>
            <div style={s.headerCard}>
            <div>
                <h1 style={{ margin: '0 0 4px 0', fontSize: isMobile ? '20px' : '24px', color: '#1e293b', fontWeight: '800' }}>{data.course.title}</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px' }}>
                <span>{data.course.code}</span> • <span>{data.course.semester}</span> • <span>{data.course.batch}</span>
                </div>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                <div style={{ marginBottom: '12px' }}>
                <span style={s.badge}><Verified style={{ fontSize: '14px' }} /> {data.course.status}</span>
                </div>
                <div style={s.facultySection}>
                {!isMobile && (
                    <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>{data.course.faculty.name}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{data.course.faculty.role}</p>
                    </div>
                )}
                <img src={data.course.faculty.avatar} style={s.avatarLarge} alt="faculty" />
                {isMobile && (
                    <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>{data.course.faculty.name}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{data.course.faculty.role}</p>
                    </div>
                )}
                </div>
            </div>
            </div>
        </div>

        <div style={s.quickActions}>
            <div style={s.actionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <FolderOpen color="primary" />
                <h4 style={{ margin: 0, color: '#1e293b' }}>Course Materials</h4>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Access slides, PDFs, and reference materials.</p>
            <div onClick={()=>navigate("/tasks")} style={{ color: '#3b82f6', cursor: 'pointer', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Open Materials <ChevronRight style={{ fontSize: '18px' }} />
            </div>
            </div>

            <div style={s.actionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Assignment style={{ color: '#f59e0b' }} />
                <h4 style={{ margin: 0, color: '#1e293b' }}>Assessments</h4>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>View quizzes, assignments, and grades.</p>
            <div onClick={()=>navigate("/tasks")} style={{ color: '#3b82f6', cursor: 'pointer', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View Assessments <ChevronRight style={{ fontSize: '18px' }} />
            </div>
            </div>

            <div style={s.actionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <FactCheck style={{ color: '#10b981' }} />
                <h4 style={{ margin: 0, color: '#1e293b' }}>Attendance Tracker</h4>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Manage student presence and session logs.</p>
            <div onClick={()=>navigate("/attendance")} style={{ color: '#3b82f6', cursor: 'pointer', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Track Attendance <ChevronRight style={{ fontSize: '18px' }} />
            </div>
            </div>
        </div>

        {/* Skill Status Section */}
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', marginTop: '40px', color: '#1e293b' }}>
            <TrendingUp style={{ color: '#3b82f6' }} /> Skill Completion Status by Group
        </h3>

        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', 
            gap: '24px',
            marginBottom: '40px'
        }}>
            {data.skillStatus.map(skill => (
            <SkillStatusCard key={skill.id} skill={skill} />
            ))}
        </div>

        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', color: '#1e293b' }}>
            <Groups color="primary" /> Total Students Assigned
        </h3>

        <div style={s.filterBar}>
            <div style={s.inputWrapper}>
            <Search style={s.searchIcon} />
            <input 
                style={s.input} 
                placeholder="Search name or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
            <select style={s.select} onChange={(e) => setDeptFilter(e.target.value)}>
                <option>All Departments</option>
                <option>Computer Science</option>
                <option>Engineering</option>
                <option>Business</option>
            </select>
            <select style={s.select} onChange={(e) => setYearFilter(e.target.value)}>
                <option>All Years</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
            </select>
            </div>
        </div>

        <div style={s.studentGrid}>
            {currentStudents.map(student => (
            <StudentCard key={student.id} student={student} navigate={navigate} />
            ))}
        </div>

        <div style={s.pagination}>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
            Showing <b>{indexOfFirstStudent + 1}-{Math.min(indexOfLastStudent, filteredStudents.length)}</b> of <b>{filteredStudents.length}</b>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                style={{ ...s.pageBtn, color: currentPage === 1 ? '#cbd5e1' : '#64748b' }}
            >
                Prev
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
                <button 
                key={i} 
                onClick={() => setCurrentPage(i + 1)}
                style={s.pageNum(currentPage === i + 1)}
                >
                {i + 1}
                </button>
            ))}

            <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                style={{ ...s.pageBtn, color: currentPage === totalPages ? '#cbd5e1' : '#64748b' }}
            >
                Next
            </button>
            </div>
        </div>
        </div>
    );
    };

    const SkillStatusCard = ({ skill }) => {
    const [isHovered, setIsHovered] = useState(false);

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isHovered ? '2px solid #3b82f6' : '1px solid #f1f5f9',
        boxShadow: isHovered ? '0 12px 24px -8px rgba(59, 130, 246, 0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
        cursor: 'pointer'
    };

    const completionRate = ((skill.completed / skill.totalStudents) * 100).toFixed(1);

    return (
        <div
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
            {skill.groupName}
            </h4>
            <div style={{ 
            fontSize: '12px', 
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
            }}>
            <span style={{ 
                backgroundColor: '#f1f5f9', 
                padding: '2px 8px', 
                borderRadius: '6px',
                fontWeight: '600'
            }}>
                {skill.venue}
            </span>
            <span>•</span>
            <span>{skill.totalStudents} Students</span>
            </div>
        </div>

        {/* Completion Rate Progress Bar */}
        <div style={{ marginBottom: '20px' }}>
            <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px'
            }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Completion Rate</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>{completionRate}%</span>
            </div>
            <div style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#f1f5f9', 
            borderRadius: '10px',
            overflow: 'hidden'
            }}>
            <div style={{ 
                width: `${completionRate}%`, 
                height: '100%', 
                backgroundColor: '#10b981',
                transition: 'width 0.5s ease'
            }} />
            </div>
        </div>

        {/* Status Breakdown */}
        <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '20px'
        }}>
            {/* Completed */}
            <div style={{ 
            backgroundColor: '#f0fdf4', 
            borderRadius: '12px', 
            padding: '12px',
            textAlign: 'center',
            border: '1px solid #bbf7d0'
            }}>
            <CheckCircle style={{ fontSize: '20px', color: '#16a34a', marginBottom: '4px' }} />
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#16a34a' }}>
                {skill.completed}
            </div>
            <div style={{ fontSize: '10px', color: '#15803d', fontWeight: '600', textTransform: 'uppercase' }}>
                Completed
            </div>
            </div>

            {/* Not Completed */}
            <div style={{ 
            backgroundColor: '#fef2f2', 
            borderRadius: '12px', 
            padding: '12px',
            textAlign: 'center',
            border: '1px solid #fecaca'
            }}>
            <Cancel style={{ fontSize: '20px', color: '#dc2626', marginBottom: '4px' }} />
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#dc2626' }}>
                {skill.notCompleted}
            </div>
            <div style={{ fontSize: '10px', color: '#b91c1c', fontWeight: '600', textTransform: 'uppercase' }}>
                Not Cleared
            </div>
            </div>

            {/* Not Attempted */}
            <div style={{ 
            backgroundColor: '#fef3c7', 
            borderRadius: '12px', 
            padding: '12px',
            textAlign: 'center',
            border: '1px solid #fde68a'
            }}>
            <RemoveCircle style={{ fontSize: '20px', color: '#d97706', marginBottom: '4px' }} />
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#d97706' }}>
                {skill.notAttempted}
            </div>
            <div style={{ fontSize: '10px', color: '#b45309', fontWeight: '600', textTransform: 'uppercase' }}>
                Not Attempted
            </div>
            </div>
        </div>

        {/* Average Score */}
        <div style={{ 
            borderTop: '1px solid #f1f5f9',
            paddingTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Average Score</span>
            <span style={{ 
            fontSize: '20px', 
            fontWeight: '800', 
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
            }}>
            {skill.averageScore}
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>/100</span>
            </span>
        </div>
        </div>
    );
    };

    const StudentCard = ({ student, navigate }) => {
    const [isHovered, setIsHovered] = useState(false);

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isHovered ? '2px solid #3b82f6' : '1px solid #f1f5f9',
        boxShadow: isHovered ? '0 12px 24px -8px rgba(59, 130, 246, 0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
        cursor: 'pointer'
    };

    const labelStyle = { fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '4px' };
    const valueStyle = { fontSize: '14px', color: '#1e293b', fontWeight: '600' };

    return (
        <div
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <img src={student.img} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} alt="avatar" />
            <div>
                <div style={{ fontWeight: '800', fontSize: '16px', color: '#1e293b' }}>{student.name}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>ID: {student.id}</div>
            </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
            <div style={labelStyle}>Department</div>
            <div style={valueStyle}>{student.dept}</div>
            </div>

            <div style={{ marginBottom: '24px' }}>
            <div style={labelStyle}>Year</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={valueStyle}>{student.year}</span>
                <span style={{ fontSize: '11px', backgroundColor: '#eff6ff', color: '#3b82f6', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                {student.sem}
                </span>
            </div>
            </div>

            <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <div style={{ flex: 1 }}>
                <div style={labelStyle}>Attendance</div>
                <div style={{ ...valueStyle, color: '#10b981', fontSize: '18px', fontWeight: '800' }}>{student.attendance}</div>
            </div>
            <div style={{ flex: 1 }}>
                <div style={labelStyle}>Tasks</div>
                <div style={{ ...valueStyle, fontSize: '18px', fontWeight: '800' }}>{student.tasks}</div>
            </div>
            </div>
        </div>

        <div onClick={()=>navigate("/students")} style={{ 
            backgroundColor: '#eff6ff', 
            padding: '14px', 
            textAlign: 'center', 
            fontSize: '13px', 
            fontWeight: '700', 
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
        }}>
            View Profile <ArrowForwardIos style={{ fontSize: '12px' }} />
        </div>
        </div>
    );
    };

    export default ClassDetails;
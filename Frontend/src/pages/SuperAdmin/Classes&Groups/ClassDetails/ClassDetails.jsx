    import React, { useState, useMemo } from 'react';
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
    FactCheck
    } from '@mui/icons-material';

    const ClassDetails = () => {
    const navigate = useNavigate();

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
        
        // Non-sticky wrapper
        Wrapper: { 
        padding: '24px 0 10px 0',
        },
        headerCard: { 
        backgroundColor: '#eff6ff', 
        borderRadius: '16px', 
        padding: '24px 32px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderLeft: '6px solid #3b82f6',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        },
        
        facultySection: { display: 'flex', alignItems: 'center', gap: '12px' },
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
        
        // Updated Grid for 3 items
        quickActions: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px', 
        margin: '32px 0 40px 0' 
        },
        actionCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
        
        filterBar: { display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' },
        inputWrapper: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' },
        input: { width: '100%', padding: '15px 16px 15px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' },
        searchIcon: { position: 'absolute', left: '12px', color: '#94a3b8', fontSize: '20px' },
        select: { padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontSize: '14px', cursor: 'pointer' },
        
        studentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },
        
        pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', padding: '20px 0', borderTop: '1px solid #e2e8f0' },
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
                <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', color: '#1e293b', fontWeight: '800' }}>{data.course.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px' }}>
                <span>{data.course.code}</span> • <span>{data.course.semester}</span> • <span>{data.course.batch}</span>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ marginBottom: '12px' }}>
                <span style={s.badge}><Verified style={{ fontSize: '14px' }} /> {data.course.status}</span>
                </div>
                <div style={s.facultySection}>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>{data.course.faculty.name}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{data.course.faculty.role}</p>
                </div>
                <img src={data.course.faculty.avatar} style={s.avatarLarge} alt="faculty" />
                </div>
            </div>
            </div>
        </div>

        {/* --- QUICK ACTIONS (3 CARDS) --- */}
        <div style={s.quickActions}>
            {/* Materials */}
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

            {/* Assessments */}
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

            {/* NEW: Attendance Tracker */}
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

        {/* --- STUDENT LIST SECTION --- */}
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', color: '#1e293b' }}>
            <Groups color="primary" /> Total Students Assigned
        </h3>

        <div style={s.filterBar}>
            <div style={s.inputWrapper}>
            <Search style={s.searchIcon} />
            <input 
                style={s.input} 
                placeholder="Search by name or student ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
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

        {/* Student Grid */}
        <div style={s.studentGrid}>
            {currentStudents.map(student => (
            <StudentCard key={student.id} student={student} />
            ))}
        </div>

        {/* Pagination */}
        <div style={s.pagination}>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
            Showing <b>{indexOfFirstStudent + 1}-{Math.min(indexOfLastStudent, filteredStudents.length)}</b> of <b>{filteredStudents.length}</b> students
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

    // --- SUB-COMPONENT: STUDENT CARD ---
    const StudentCard = ({ student }) => {
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

        <div style={{ 
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
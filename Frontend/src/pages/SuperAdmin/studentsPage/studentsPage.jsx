    import React, { useState, useMemo } from 'react';

    const STUDENTS_DATA = [
    {
    id: "7376242AL999",
    name: "Emma Watson",
    email: "emma@test.com",
    image: null,
    department: "Computer Science",
    year: "3rd Year",
    section: "Sec-5",
    attendance: "96.5",
    tasks: "12/12"
    },
    {
    id: "8492156BM847",
    name: "Liam Johnson",
    email: "liam@test.com",
    image: "https://i.pravatar.cc/150?img=12",
    department: "Engineering",
    year: "2nd Year",
    section: "Sec-3",
    attendance: "72",
    tasks: "8/10"
    },
    {
    id: "9284736CN562",
    name: "Sophia Chen",
    email: "sophia@test.com",
    image: "https://i.pravatar.cc/150?img=45",
    department: "Arts & Humanities",
    year: "1st Year",
    section: "Sec-1",
    attendance: "98",
    tasks: "5/5"
    },
    {
    id: "5827361DK234",
    name: "Noah Williams",
    email: "noah@test.com",
    image: "https://i.pravatar.cc/150?img=13",
    department: "Business",
    year: "4th Year",
    section: "Sec-6",
    attendance: "84",
    tasks: "9/12"
    },
    {
    id: "3947182EM891",
    name: "James Miller",
    email: "james@test.com",
    image: "https://i.pravatar.cc/150?img=33",
    department: "Computer Science",
    year: "2nd Year",
    section: "Sec-4",
    attendance: "91",
    tasks: "10/10"
    },
    {
    id: "7261849FN445",
    name: "Ava Jones",
    email: "ava@test.com",
    image: null,
    department: "Engineering",
    year: "3rd Year",
    section: "Sec-2",
    attendance: "88",
    tasks: "11/12"
    }
    ];

    const StudentsPage = () => {
    const [search, setSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [yearFilter, setYearFilter] = useState('All Years');

    const departments = ['All Departments', ...new Set(STUDENTS_DATA.map(s => s.department))];
    const years = ['All Years', ...new Set(STUDENTS_DATA.map(s => s.year))];

    const filteredStudents = useMemo(() => {
    return STUDENTS_DATA.filter(student => {
        const matchesSearch = search === '' || 
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase()) ||
        student.id.toLowerCase().includes(search.toLowerCase());
        
        const matchesDepartment = departmentFilter === 'All Departments' || 
        student.department === departmentFilter;
        
        const matchesYear = yearFilter === 'All Years' || 
        student.year === yearFilter;

        return matchesSearch && matchesDepartment && matchesYear;
    });
    }, [search, departmentFilter, yearFilter]);

    const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
    };

    const getAttendanceColor = (attendance) => {
    const value = parseFloat(attendance);
    if (value >= 95) return '#10B981';
    if (value >= 85) return '#3B82F6';
    if (value >= 75) return '#F59E0B';
    return '#EF4444';
    };

    return (
    <div style={{
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
        padding: '32px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
        {/* Header */}
        <div style={{
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
        }}>
        <div style={{
            display: 'flex',
            gap: '16px',
            flex: 1,
            maxWidth: '800px'
        }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1 }}>
            <input
                type="text"
                placeholder="Search by name or student ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
            <svg style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#9CA3AF'
            }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            </div>

            {/* Department Filter */}
            <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{
                padding: '10px 32px 10px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                minWidth: '180px'
            }}
            >
            {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
            ))}
            </select>

            {/* Year Filter */}
            <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            style={{
                padding: '10px 32px 10px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                minWidth: '140px'
            }}
            >
            {years.map(year => (
                <option key={year} value={year}>{year}</option>
            ))}
            </select>
        </div>
        </div>

        {/* Students Grid */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px'
        }}>
        {filteredStudents.map(student => (
            <div key={student.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
            cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
            }}>
            {/* Student Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                {student.image ? (
                <img 
                    src={student.image} 
                    alt={student.name}
                    style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '12px'
                    }}
                />
                ) : (
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '600',
                    marginRight: '12px'
                }}>
                    {getInitials(student.name)}
                </div>
                )}
                <div style={{ flex: 1 }}>
                <div style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '3px'
                }}>
                    {student.name}
                </div>
                <div style={{
                    fontSize: '12px',
                    color: '#9CA3AF'
                }}>
                    ID: {student.id}
                </div>
                </div>
            </div>

            {/* Details */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
                }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Department</span>
                <span style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>
                    {student.department}
                </span>
                </div>
                <div style={{
                display: 'flex',
                justifyContent: 'space-between'
                }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>Year</span>
                <span style={{
                    fontSize: '14px',
                    color: '#111827',
                    fontWeight: '500',
                    backgroundColor: '#F3F4F6',
                    padding: '2px 8px',
                    borderRadius: '4px'
                }}>
                    {student.year} · {student.section}
                </span>
                </div>
            </div>

            {/* Stats */}
            <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '20px',
                borderTop: '1px solid #F3F4F6'
            }}>
                <div style={{ flex: 1 }}>
                <div style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '6px',
                    fontWeight: '500'
                }}>
                    ATTENDANCE
                </div>
                <div style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: getAttendanceColor(student.attendance)
                }}>
                    {student.attendance}%
                </div>
                </div>
                <div style={{ flex: 1 }}>
                <div style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '6px',
                    fontWeight: '500'
                }}>
                    TASKS
                </div>
                <div style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#3B82F6'
                }}>
                    {student.tasks}
                </div>
                </div>
            </div>

            {/* View Profile Link */}
            <div style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #F3F4F6',
                backgroundColor: '#EFF6FF',
                marginLeft: '-24px',
                marginRight: '-24px',
                marginBottom: '-24px',
                padding: '16px 24px',
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px'
            }}>
                <button style={{
                width: '100%',
                padding: '0',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#3B82F6',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '4px',
                transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#2563EB'}
                onMouseLeave={(e) => e.target.style.color = '#3B82F6'}>
                View Profile →
                </button>
            </div>
            </div>
        ))}
        </div>

        {/* No Results */}
        {filteredStudents.length === 0 && (
        <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6B7280'
        }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
            No students found
            </div>
            <div style={{ fontSize: '14px' }}>
            Try adjusting your search or filters
            </div>
        </div>
        )}
    </div>
    );
    };

    export default StudentsPage;
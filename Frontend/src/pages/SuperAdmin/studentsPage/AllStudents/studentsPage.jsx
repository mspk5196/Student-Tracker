// import React, { useState, useMemo, useEffect } from 'react';
// import useAuthStore from '../../../../store/useAuthStore'; // Adjust path as needed

// const StudentsPage = () => {
//   const { token } = useAuthStore();
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('All Departments');
//   const [yearFilter, setYearFilter] = useState('All Years');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Fetch students from backend
//   const fetchStudents = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch(`${API_URL}/students`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       const data = await response.json();

//       if (data.success) {
//         setStudents(data.data);
//       } else {
//         setError(data.message || 'Failed to fetch students');
//       }
//     } catch (err) {
//       console.error('Error fetching students:', err);
//       setError('Failed to fetch students');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchStudents();
//     }
//   }, [token]);

//   const departments = ['All Departments', ... new Set(students.map(s => s.department))];
//   const years = ['All Years', ... new Set(students.map(s => s.year))];

//   const filteredStudents = useMemo(() => {
//     return students.filter(student => {
//       const matchesSearch = search === '' ||
//         student.name.toLowerCase().includes(search.toLowerCase()) ||
//         student.email.toLowerCase().includes(search.toLowerCase()) ||
//         student.id.toLowerCase().includes(search.toLowerCase());

//       const matchesDepartment = departmentFilter === 'All Departments' ||
//         student.department === departmentFilter;

//       const matchesYear = yearFilter === 'All Years' ||
//         student.year === yearFilter;

//       return matchesSearch && matchesDepartment && matchesYear;
//     });
//   }, [students, search, departmentFilter, yearFilter]);

//   const getInitials = (name) => {
//     return name.charAt(0).toUpperCase();
//   };

//   const getAttendanceColor = (attendance) => {
//     const value = parseFloat(attendance);
//     if (value >= 95) return '#10B981';
//     if (value >= 85) return '#3B82F6';
//     if (value >= 75) return '#F59E0B';
//     return '#EF4444';
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       backgroundColor: '#F9FAFB',
//       padding: '32px',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//     }}>
//       {/* Error Message */}
//       {error && (
//         <div style={{
//           backgroundColor: '#fee2e2',
//           color: '#991b1b',
//           padding: '12px 16px',
//           borderRadius: '8px',
//           marginBottom: '20px',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           fontSize: '14px'
//         }}>
//           <span>{error}</span>
//           <button
//             onClick={() => setError('')}
//             style={{
//               background: 'none',
//               border: 'none',
//               fontSize: '24px',
//               color: '#991b1b',
//               cursor: 'pointer',
//               padding: '0 8px'
//             }}
//           >
//             ×
//           </button>
//         </div>
//       )}

//       {/* Header */}
//       <div style={{
//         marginBottom: '32px',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <div style={{
//           display: 'flex',
//           gap: '16px',
//           flex: 1,
//           maxWidth: '800px'
//         }}>
//           {/* Search */}
//           <div style={{ position: 'relative', flex: 1 }}>
//             <input
//               type="text"
//               placeholder="Search by name or student ID..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               style={{
//                 width: '100%',
//                 padding: '10px 16px 10px 40px',
//                 border: '1px solid #E5E7EB',
//                 borderRadius: '8px',
//                 fontSize: '14px',
//                 outline: 'none',
//                 transition: 'all 0.2s',
//                 boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
//               }}
//               onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
//               onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
//             />
//             <svg style={{
//               position: 'absolute',
//               left: '12px',
//               top: '50%',
//               transform: 'translateY(-50%)',
//               width: '20px',
//               height: '20px',
//               color: '#9CA3AF'
//             }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </div>

//           {/* Department Filter */}
//           <select
//             value={departmentFilter}
//             onChange={(e) => setDepartmentFilter(e.target.value)}
//             style={{
//               padding: '10px 32px 10px 16px',
//               border: '1px solid #E5E7EB',
//               borderRadius: '8px',
//               fontSize: '14px',
//               backgroundColor: 'white',
//               cursor: 'pointer',
//               outline: 'none',
//               appearance: 'none',
//               backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
//               backgroundRepeat: 'no-repeat',
//               backgroundPosition: 'right 12px center',
//               boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//               minWidth: '180px'
//             }}
//           >
//             {departments.map(dept => (
//               <option key={dept} value={dept}>{dept}</option>
//             ))}
//           </select>

//           {/* Year Filter */}
//           <select
//             value={yearFilter}
//             onChange={(e) => setYearFilter(e.target.value)}
//             style={{
//               padding: '10px 32px 10px 16px',
//               border: '1px solid #E5E7EB',
//               borderRadius: '8px',
//               fontSize: '14px',
//               backgroundColor: 'white',
//               cursor: 'pointer',
//               outline: 'none',
//               appearance: 'none',
//               backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
//               backgroundRepeat: 'no-repeat',
//               backgroundPosition: 'right 12px center',
//               boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//               minWidth: '140px'
//             }}
//           >
//             {years.map(year => (
//               <option key={year} value={year}>{year}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div style={{
//           textAlign: 'center',
//           padding: '60px 20px',
//           color: '#3B82F6',
//           fontSize: '16px',
//           fontWeight: '600'
//         }}>
//           Loading students...
//         </div>
//       )}

//       {/* Students Grid */}
//       {!loading && (
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
//           gap: '24px'
//         }}>
//           {filteredStudents.map(student => (
//             <div key={student.id} style={{
//               backgroundColor: 'white',
//               borderRadius: '12px',
//               padding: '24px',
//               boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//               transition: 'all 0.2s',
//               cursor: 'pointer'
//             }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
//                 e.currentTarget.style.transform = 'translateY(-2px)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
//                 e.currentTarget.style.transform = 'translateY(0)';
//               }}>
//               {/* Student Header */}
//               <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
//                 {student.image ? (
//                   <img
//                     src={student.image}
//                     alt={student.name}
//                     style={{
//                       width: '48px',
//                       height: '48px',
//                       borderRadius: '50%',
//                       objectFit: 'cover',
//                       marginRight: '12px'
//                     }}
//                   />
//                 ) : (
//                   <div style={{
//                     width: '48px',
//                     height: '48px',
//                     borderRadius: '50%',
//                     backgroundColor: '#3B82F6',
//                     color: 'white',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     fontSize: '20px',
//                     fontWeight: '600',
//                     marginRight: '12px'
//                   }}>
//                     {getInitials(student.name)}
//                   </div>
//                 )}
//                 <div style={{ flex: 1 }}>
//                   <div style={{
//                     fontSize: '15px',
//                     fontWeight: '600',
//                     color: '#111827',
//                     marginBottom: '3px'
//                   }}>
//                     {student.name}
//                   </div>
//                   <div style={{
//                     fontSize: '12px',
//                     color: '#9CA3AF'
//                   }}>
//                     ID: {student.id}
//                   </div>
//                 </div>
//               </div>

//               {/* Details */}
//               <div style={{ marginBottom: '20px' }}>
//                 <div style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   marginBottom: '12px'
//                 }}>
//                   <span style={{ fontSize: '14px', color: '#6B7280' }}>Department</span>
//                   <span style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>
//                     {student.department}
//                   </span>
//                 </div>
//                 <div style={{
//                   display: 'flex',
//                   justifyContent: 'space-between'
//                 }}>
//                   <span style={{ fontSize: '14px', color: '#6B7280' }}>Year</span>
//                   <span style={{
//                     fontSize: '14px',
//                     color: '#111827',
//                     fontWeight: '500',
//                     backgroundColor: '#F3F4F6',
//                     padding: '2px 8px',
//                     borderRadius: '4px'
//                   }}>
//                     {student.year} · {student.section}
//                   </span>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div style={{
//                 display: 'flex',
//                 gap: '12px',
//                 paddingTop: '20px',
//                 borderTop: '1px solid #F3F4F6'
//               }}>
//                 <div style={{ flex: 1 }}>
//                   <div style={{
//                     fontSize: '12px',
//                     color: '#6B7280',
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.5px',
//                     marginBottom: '6px',
//                     fontWeight: '500'
//                   }}>
//                     ATTENDANCE
//                   </div>
//                   <div style={{
//                     fontSize: '22px',
//                     fontWeight: '700',
//                     color: getAttendanceColor(student.attendance)
//                   }}>
//                     {student.attendance}%
//                   </div>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{
//                     fontSize: '12px',
//                     color: '#6B7280',
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.5px',
//                     marginBottom: '6px',
//                     fontWeight: '500'
//                   }}>
//                     TASKS
//                   </div>
//                   <div style={{
//                     fontSize: '22px',
//                     fontWeight: '700',
//                     color: '#3B82F6'
//                   }}>
//                     {student.tasks}
//                   </div>
//                 </div>
//               </div>

//               {/* View Profile Link */}
//               <div style={{
//                 marginTop: '20px',
//                 paddingTop: '16px',
//                 borderTop: '1px solid #F3F4F6',
//                 backgroundColor: '#EFF6FF',
//                 marginLeft: '-24px',
//                 marginRight: '-24px',
//                 marginBottom: '-24px',
//                 padding: '16px 24px',
//                 borderBottomLeftRadius: '12px',
//                 borderBottomRightRadius: '12px'
//               }}>
//                 <button style={{
//                   width: '100%',
//                   padding: '0',
//                   backgroundColor: 'transparent',
//                   border: 'none',
//                   color: '#3B82F6',
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   cursor: 'pointer',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'flex-end',
//                   gap: '4px',
//                   transition: 'color 0.2s'
//                 }}
//                   onMouseEnter={(e) => e.target.style.color = '#2563EB'}
//                   onMouseLeave={(e) => e.target.style.color = '#3B82F6'}>
//                   View Profile →
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* No Results */}
//       {!loading && filteredStudents.length === 0 && (
//         <div style={{
//           textAlign: 'center',
//           padding: '60px 20px',
//           color: '#6B7280'
//         }}>
//           <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
//           <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
//             No students found
//           </div>
//           <div style={{ fontSize: '14px' }}>
//             Try adjusting your search or filters
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentsPage;


import React, { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../../../../store/useAuthStore';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';

const StudentsPage = () => {
  const { token } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL;

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [yearFilter, setYearFilter] = useState('All Years');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [limit] = useState(20);

  // Filter options
  const [departments, setDepartments] = useState(['All Departments']);
  const [years, setYears] = useState(['All Years']);

  // Fetch filters
  const fetchFilters = async () => {
    try {
      const response = await fetch(`${API_URL}/students/filters`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setDepartments(['All Departments', ...data.data.departments]);
        setYears(['All Years', ...data.data.years]);
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  };

  // Fetch students with pagination
  const fetchStudents = async (page = 1, searchTerm = search, dept = departmentFilter, yr = yearFilter) => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: searchTerm,
        department: dept,
        year:  yr
      });

      const response = await fetch(`${API_URL}/students?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setStudents(data. data);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setTotalStudents(data.pagination.totalStudents);
      } else {
        setError(data.message || 'Failed to fetch students');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      setCurrentPage(1);
      fetchStudents(1, searchTerm, departmentFilter, yearFilter);
    }, 500),
    [departmentFilter, yearFilter]
  );

  useEffect(() => {
    if (token) {
      fetchFilters();
      fetchStudents();
    }
  }, [token]);

  useEffect(() => {
    if (search) {
      debouncedSearch(search);
    } else {
      fetchStudents(1, '', departmentFilter, yearFilter);
    }
  }, [search]);

  const handleDepartmentChange = (dept) => {
    setDepartmentFilter(dept);
    setCurrentPage(1);
    fetchStudents(1, search, dept, yearFilter);
  };

  const handleYearChange = (yr) => {
    setYearFilter(yr);
    setCurrentPage(1);
    fetchStudents(1, search, departmentFilter, yr);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchStudents(page, search, departmentFilter, yearFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color:  '#991b1b',
          padding:  '12px 16px',
          borderRadius:  '8px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems:  'center',
          fontSize: '14px'
        }}>
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#991b1b',
              cursor: 'pointer',
              padding: '0 8px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Header with search and filters */}
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
              id="student-search"
              name="search"
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
            id="department-filter"
            name="departmentFilter"
            value={departmentFilter}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            style={{
              padding: '10px 32px 10px 16px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1. 5L6 6.5L11 1.5' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
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
            id="year-filter"
            name="yearFilter"
            value={yearFilter}
            onChange={(e) => handleYearChange(e.target.value)}
            style={{
              padding: '10px 32px 10px 16px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              backgroundImage:  `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              boxShadow:  '0 1px 2px rgba(0,0,0,0.05)',
              minWidth: '140px'
            }}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>
          {totalStudents} students found
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#3B82F6',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          Loading students...
        </div>
      )}

      {/* Students Grid */}
      {!loading && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {students.map(student => (
              <div key={student. id} style={{
                backgroundColor:  'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget. style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget. style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                
                {/* Student Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  {student.image ?  (
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
                      fontSize:  '20px',
                      fontWeight: '600',
                      marginRight: '12px'
                    }}>
                      {getInitials(student.name)}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight:  '600',
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
                      fontWeight:  '500',
                      backgroundColor: '#F3F4F6',
                      padding: '2px 8px',
                      borderRadius:  '4px'
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
                      letterSpacing:  '0.5px',
                      marginBottom: '6px',
                      fontWeight: '500'
                    }}>
                      ATTENDANCE
                    </div>
                    <div style={{
                      fontSize: '22px',
                      fontWeight:  '700',
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
                      {student. tasks}
                    </div>
                  </div>
                </div>

                {/* View Profile Link */}
                <Link
                  to={`/students/${student.student_id}`}
                  style={{
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid #F3F4F6',
                    backgroundColor: '#EFF6FF',
                    marginLeft: '-24px',
                    marginRight:  '-24px',
                    marginBottom: '-24px',
                    padding: '16px 24px',
                    borderBottomLeftRadius: '12px',
                    borderBottomRightRadius: '12px',
                    display: 'block',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{
                    width: '100%',
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
                    onMouseEnter={(e) => e.currentTarget.style.color = '#2563EB'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#3B82F6'}
                  >
                    View Profile →
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '32px'
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  backgroundColor: currentPage === 1 ?  '#F3F4F6' : 'white',
                  color: currentPage === 1 ? '#9CA3AF' : '#374151',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Previous
              </button>

              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          backgroundColor: page === currentPage ? '#3B82F6' : 'white',
                          color: page === currentPage ? 'white' : '#374151',
                          cursor:  'pointer',
                          fontSize:  '14px',
                          fontWeight: '600',
                          minWidth: '40px'
                        }}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 3 || page === currentPage + 3) {
                    return <span key={page} style={{ padding: '8px', color: '#9CA3AF' }}>...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius:  '8px',
                  backgroundColor: currentPage === totalPages ? '#F3F4F6' :  'white',
                  color: currentPage === totalPages ? '#9CA3AF' : '#374151',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && students.length === 0 && (
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
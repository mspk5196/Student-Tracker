import React, { useState } from 'react';
import {
    Search,
    Add,
    MailOutline,
    Edit,
    Delete,
    KeyboardArrowDown
} from '@mui/icons-material';

// --- Mock Data ---
const FACULTY_DATA = [
    { id: 1, name: 'Dr. Sarah Wilson', role: 'Professor', dept: 'CSE', email: 's.wilson@uni.edu', status: 'Active', joinDate: '2020-03-15' },
    { id: 2, name: 'Prof. James Chen', role: 'Assistant Professor', dept: 'IT', email: 'j.chen@uni.edu', status: 'On Leave', joinDate: '2019-08-01' },
    { id: 3, name: 'Dr. Emily Parker', role: 'Lecturer', dept: 'AIDS', email: 'e.parker@uni.edu', status: 'Inactive', joinDate: '2021-01-10' },
    { id: 4, name: 'Mr. Robert Fox', role: 'Lab Instructor', dept: 'AIML', email: 'r.fox@uni.edu', status: 'Active', joinDate: '2022-05-20' },
    { id: 5, name: 'Dr. Linda Wong', role: 'Professor', dept: 'CSBS', email: 'l.wong@uni.edu', status: 'Active', joinDate: '2018-11-12' },
    { id: 6, name: 'Prof. Michael Brown', role: 'Associate Professor', dept: 'IT', email: 'm.brown@uni.edu', status: 'Active', joinDate: '2019-03-22' },
    { id: 7, name: 'Dr. Jennifer Lee', role: 'Lecturer', dept: 'AIML', email: 'j.lee@uni.edu', status: 'On Leave', joinDate: '2020-07-15' },
    { id: 8, name: 'Mr. David Martinez', role: 'Lab Instructor', dept: 'CSBS', email: 'd.martinez@uni.edu', status: 'Active', joinDate: '2021-09-01' },
    { id: 9, name: 'Dr. Susan Taylor', role: 'Professor', dept: 'CSE', email: 's.taylor@uni.edu', status: 'Active', joinDate: '2017-02-10' },
    { id: 10, name: 'Prof. Richard White', role: 'Assistant Professor', dept: 'BioTech', email: 'r.white@uni.edu', status: 'Inactive', joinDate: '2022-01-05' },
    { id: 11, name: 'Dr. Patricia Garcia', role: 'Lecturer', dept: 'E&I', email: 'p.garcia@uni.edu', status: 'Active', joinDate: '2020-11-20' },
    { id: 12, name: 'Mr. Thomas Anderson', role: 'Lab Instructor', dept: 'Mechatronics', email: 't.anderson@uni.edu', status: 'Active', joinDate: '2021-04-12' },
    { id: 13, name: 'Dr. Barbara Moore', role: 'Professor', dept: 'Mechanical', email: 'b.moore@uni.edu', status: 'On Leave', joinDate: '2016-08-30' },
    { id: 14, name: 'Prof. Christopher Hill', role: 'Associate Professor', dept: 'Electronics', email: 'c.hill@uni.edu', status: 'Active', joinDate: '2019-05-18' },
    { id: 15, name: 'Dr. Nancy Scott', role: 'Lecturer', dept: 'Electrical', email: 'n.scott@uni.edu', status: 'Active', joinDate: '2022-02-28' },
];

const FacultyAccounts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Get unique departments
    const departments = [...new Set(FACULTY_DATA.map(f => f.dept))];

    // Filter faculty based on search and filters
    const filteredData = FACULTY_DATA.filter(f => {
        const facultyId = `FAC-${f.id.toString().padStart(3, '0')}`;
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            facultyId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = !deptFilter || f.dept === deptFilter;
        const matchesStatus = !statusFilter || f.status === statusFilter;
        return matchesSearch && matchesDept && matchesStatus;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    // Pagination handlers
    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div style={styles.container}>
            {/* Filters & Search */}
            <div style={styles.controlsRow}>
                <div style={styles.searchWrapper}>
                    <Search sx={{ color: '#94a3b8', fontSize: 22 }} />
                    <input
                        type="text"
                        placeholder="Search faculty by name or ID..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div style={styles.filtersGroup}>
                    <div style={styles.selectWrapper}>
                        <select 
                            style={styles.select}
                            value={deptFilter}
                            onChange={(e) => {
                                setDeptFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Department</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        <KeyboardArrowDown style={styles.selectArrow} sx={{ fontSize: 20 }} />
                    </div>
                    <div style={styles.selectWrapper}>
                        <select 
                            style={styles.select}
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Status</option>
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <KeyboardArrowDown style={styles.selectArrow} sx={{ fontSize: 20 }} />
                    </div>
                    <button style={styles.addBtn}>
                        <Add sx={{ fontSize: 20 }} />
                        <span>Add New Faculty</span>
                    </button>
                </div>
            </div>

            {/* Faculty List Table */}
            <div style={styles.tableCard}>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.trHead}>
                                <th style={styles.th}>Faculty Name</th>
                                <th style={styles.th}>Department & Role</th>
                                <th style={styles.th}>Contact Info</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Joining Date</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((faculty) => (
                                <tr key={faculty.id} style={styles.trBody}>
                                    <td style={styles.td}>
                                        <div style={styles.profileCell}>
                                            <div style={styles.avatar}>{faculty.name.charAt(0)}</div>
                                            <div>
                                                <div style={styles.nameText}>{faculty.name}</div>
                                                <div style={styles.idText}>ID: FAC-{faculty.id.toString().padStart(3, '0')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.deptText}>{faculty.dept}</div>
                                        <div style={styles.roleText}>{faculty.role}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.contactRow}>
                                            <MailOutline sx={{ fontSize: 14, color: '#94a3b8' }} />
                                            <span>{faculty.email}</span>
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={
                                            faculty.status === 'Active' 
                                                ? styles.statusActive
                                                : faculty.status === 'On Leave'
                                                ? styles.statusOnLeave
                                                : styles.statusInactive
                                        }>
                                            {faculty.status}
                                        </span>
                                    </td>
                                    <td style={styles.td}>{faculty.joinDate}</td>
                                    <td style={styles.td}>
                                        <div style={styles.actionBtnsGroup}>
                                            <button style={styles.actionBtn}>
                                                <Edit sx={{ fontSize: 18, color: '#64748b' }} />
                                            </button>
                                            <button style={styles.actionBtn}>
                                                <Delete sx={{ fontSize: 18, color: '#64748b' }} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div style={styles.paginationWrapper}>
                    <div style={styles.showingText}>
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} faculty members
                    </div>
                    <div style={styles.paginationControls}>
                        <button 
                            style={{...styles.pageBtn, ...(currentPage === 1 ? styles.pageBtnDisabled : {})}}
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <button 
                            style={{...styles.pageBtn, ...(currentPage === totalPages ? styles.pageBtnDisabled : {})}}
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Styles ---
const styles = {
    container: { padding: '0', width: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    controlsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' },
    searchWrapper: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', flex: 1, minWidth: '250px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    searchInput: { border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: '#1e293b', background: 'transparent' },
    filtersGroup: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
    selectWrapper: { position: 'relative', minWidth: '150px' },
    select: { appearance: 'none', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b', padding: '10px 40px 10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%', outline: 'none' },
    selectArrow: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' },
    addBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', whiteSpace: 'nowrap' },
    tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
    trHead: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
    th: { padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' },
    trBody: { borderBottom: '1px solid #f1f5f9' },
    td: { padding: '16px 24px', fontSize: '14px', color: '#334155' },
    profileCell: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0 },
    nameText: { fontWeight: '600', color: '#0f172a' },
    idText: { fontSize: '12px', color: '#94a3b8', marginTop: '2px' },
    deptText: { fontWeight: '500', color: '#1e293b' },
    roleText: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
    contactRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' },
    statusActive: { backgroundColor: '#16A34A', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    statusOnLeave: { backgroundColor: '#F59E0B', color: 'black', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    statusInactive: { backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    actionBtnsGroup: { display: 'flex', gap: '8px', alignItems: 'center' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    paginationWrapper: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fafafa', flexWrap: 'wrap', gap: '12px' },
    showingText: { fontSize: '14px', color: '#64748b' },
    paginationControls: { display: 'flex', gap: '12px' },
    pageBtn: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#334155', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
    pageBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' }
};

export default FacultyAccounts;
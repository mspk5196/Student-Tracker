import React, { useState } from 'react';
import {
    Search,
    Add,
    MailOutline,
    Edit,
    Delete,
    KeyboardArrowDown,
    Close,
    CloudUpload,
    MoreVert
} from '@mui/icons-material';

// --- Mock Data ---
const FACULTY_DATA = [
    { id: 1, name: 'Dr. Sarah Wilson', role: 'Professor', dept: 'Computer Science', email: 's.wilson@uni.edu', status: 'Active', joinDate: '2020-03-15' },
    { id: 2, name: 'Prof. James Chen', role: 'Assistant Professor', dept: 'Engineering', email: 'j.chen@uni.edu', status: 'On Leave', joinDate: '2019-08-01' },
    { id: 3, name: 'Dr. Emily Parker', role: 'Lecturer', dept: 'Mathematics', email: 'e.parker@uni.edu', status: 'Inactive', joinDate: '2021-01-10' },
    { id: 4, name: 'Mr. Robert Fox', role: 'Lab Instructor', dept: 'Physics', email: 'r.fox@uni.edu', status: 'Active', joinDate: '2022-05-20' },
    { id: 5, name: 'Dr. Linda Wong', role: 'Professor', dept: 'Chemistry', email: 'l.wong@uni.edu', status: 'Active', joinDate: '2018-11-12' },
    { id: 6, name: 'Prof. Michael Brown', role: 'Associate Professor', dept: 'Biology', email: 'm.brown@uni.edu', status: 'Active', joinDate: '2019-03-22' },
    { id: 7, name: 'Dr. Jennifer Lee', role: 'Lecturer', dept: 'English', email: 'j.lee@uni.edu', status: 'On Leave', joinDate: '2020-07-15' },
    { id: 8, name: 'Mr. David Martinez', role: 'Lab Instructor', dept: 'Chemistry', email: 'd.martinez@uni.edu', status: 'Active', joinDate: '2021-09-01' },
    { id: 9, name: 'Dr. Susan Taylor', role: 'Professor', dept: 'History', email: 's.taylor@uni.edu', status: 'Active', joinDate: '2017-02-10' },
    { id: 10, name: 'Prof. Richard White', role: 'Assistant Professor', dept: 'Economics', email: 'r.white@uni.edu', status: 'Inactive', joinDate: '2022-01-05' },
    { id: 11, name: 'Dr. Patricia Garcia', role: 'Lecturer', dept: 'Psychology', email: 'p.garcia@uni.edu', status: 'Active', joinDate: '2020-11-20' },
    { id: 12, name: 'Mr. Thomas Anderson', role: 'Lab Instructor', dept: 'Physics', email: 't.anderson@uni.edu', status: 'Active', joinDate: '2021-04-12' },
    { id: 13, name: 'Dr. Barbara Moore', role: 'Professor', dept: 'Sociology', email: 'b.moore@uni.edu', status: 'On Leave', joinDate: '2016-08-30' },
    { id: 14, name: 'Prof. Christopher Hill', role: 'Associate Professor', dept: 'Political Science', email: 'c.hill@uni.edu', status: 'Active', joinDate: '2019-05-18' },
    { id: 15, name: 'Dr. Nancy Scott', role: 'Lecturer', dept: 'Art', email: 'n.scott@uni.edu', status: 'Active', joinDate: '2022-02-28' },
];

const FacultyAccounts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        facultyId: '',
        email: '',
        department: '',
        profilePic: null
    });
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

    // Modal handlers
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', designation: '', facultyId: '', email: '', department: '', profilePic: null });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profilePic: file }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        closeModal();
    };

    // Menu handlers
    const toggleMenu = (facultyId) => {
        setActiveMenu(activeMenu === facultyId ? null : facultyId);
    };

    const handleEdit = (faculty) => {
        console.log('Editing faculty:', faculty);
        setActiveMenu(null);
        // Add your edit logic here
    };

    const handleDelete = (faculty) => {
        console.log('Deleting faculty:', faculty);
        setActiveMenu(null);
        // Add your delete logic here
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
                    <button style={styles.addBtn} onClick={openModal}>
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
                                            <button 
                                                style={styles.actionBtn}
                                                onClick={() => toggleMenu(faculty.id)}
                                            >
                                                <MoreVert sx={{ fontSize: 18, color: '#64748b' }} />
                                            </button>
                                            {activeMenu === faculty.id && (
                                                <div style={styles.actionMenu}>
                                                    <button 
                                                        style={styles.menuItem}
                                                        onClick={() => handleEdit(faculty)}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                    >
                                                        <Edit sx={{ fontSize: 16 }} />
                                                        <span>Edit</span>
                                                    </button>
                                                    <button 
                                                        style={styles.menuItemDelete}
                                                        onClick={() => handleDelete(faculty)}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                    >
                                                        <Delete sx={{ fontSize: 16 }} />
                                                        <span>Delete</span>
                                                    </button>
                                                </div>
                                            )}
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

            {/* Add Faculty Modal */}
            {isModalOpen && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Add New Faculty</h2>
                            <button style={styles.closeBtn} onClick={closeModal}>
                                <Close sx={{ fontSize: 24, color: '#64748b' }} />
                            </button>
                        </div>

                        <div style={styles.form}>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter full name"
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Designation *</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Professor, Lecturer"
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Faculty ID *</label>
                                    <input
                                        type="text"
                                        name="facultyId"
                                        value={formData.facultyId}
                                        onChange={handleInputChange}
                                        placeholder="e.g., FAC-001"
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="example@uni.edu"
                                        style={styles.input}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Department *</label>
                                <div style={styles.selectWrapper}>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        style={styles.selectModal}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    <KeyboardArrowDown style={styles.selectArrow} sx={{ fontSize: 20 }} />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Profile Picture</label>
                                <div style={styles.uploadArea}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={styles.fileInput}
                                        id="profile-pic"
                                    />
                                    <label htmlFor="profile-pic" style={styles.uploadLabel}>
                                        <CloudUpload sx={{ fontSize: 32, color: '#94a3b8', marginBottom: '8px' }} />
                                        <span style={styles.uploadText}>
                                            {formData.profilePic ? formData.profilePic.name : 'Click to upload or drag and drop'}
                                        </span>
                                        <span style={styles.uploadSubtext}>PNG, JPG or JPEG (max. 5MB)</span>
                                    </label>
                                </div>
                            </div>

                            <div style={styles.modalFooter}>
                                <button type="button" style={styles.cancelBtn} onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="button" style={styles.submitBtn} onClick={handleSubmit}>
                                    Add Faculty
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
    actionBtnsGroup: { position: 'relative', display: 'flex', gap: '8px', alignItems: 'center' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    actionMenu: { 
        position: 'absolute', 
        right: '0', 
        top: '100%', 
        marginTop: '4px',
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 10,
        minWidth: '140px',
        overflow: 'hidden'
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        padding: '10px 16px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#334155',
        textAlign: 'left',
        transition: 'background-color 0.15s'
    },
    menuItemDelete: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        padding: '10px 16px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#ef4444',
        textAlign: 'left',
        transition: 'background-color 0.15s',
        borderTop: '1px solid #f1f5f9'
    },
    paginationWrapper: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fafafa', flexWrap: 'wrap', gap: '12px' },
    showingText: { fontSize: '14px', color: '#64748b' },
    paginationControls: { display: 'flex', gap: '12px' },
    pageBtn: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#334155', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
    pageBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
    
    // Modal Styles
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
    modalContent: { backgroundColor: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #e2e8f0' },
    modalTitle: { fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 },
    closeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    form: { padding: '24px' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#334155' },
    input: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#1e293b', outline: 'none', transition: 'border-color 0.2s' },
    selectModal: { appearance: 'none', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b', padding: '10px 40px 10px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', width: '100%', outline: 'none' },
    uploadArea: { border: '2px dashed #e2e8f0', borderRadius: '8px', padding: '24px', textAlign: 'center', backgroundColor: '#f8fafc', transition: 'border-color 0.2s' },
    fileInput: { display: 'none' },
    uploadLabel: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' },
    uploadText: { fontSize: '14px', color: '#64748b', fontWeight: '500', marginBottom: '4px' },
    uploadSubtext: { fontSize: '12px', color: '#94a3b8' },
    modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' },
    cancelBtn: { padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#64748b', backgroundColor: '#ffffff', cursor: 'pointer' },
    submitBtn: { padding: '10px 20px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#ffffff', backgroundColor: '#3b82f6', cursor: 'pointer' }
};

export default FacultyAccounts;
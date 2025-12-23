import React, { useState, useEffect } from 'react';
import {
    Search,
    Add,
    MailOutline,
    Edit,
    Delete,
    KeyboardArrowDown,
    Close,
    CloudUpload,
    MoreVert,
    Save,
    Cancel
} from '@mui/icons-material';
import useAuthStore from '../../../store/useAuthStore'; // Adjust path as needed

const FacultyAccounts = () => {
    const { token } = useAuthStore();
    const API_URL = import.meta.env.VITE_API_URL;

    const [facultyData, setFacultyData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [menuCoords, setMenuCoords] = useState(null);
    const [menuFaculty, setMenuFaculty] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        facultyId: '',
        email: '',
        department: '',
        profilePic: null
    });

    const [editFormData, setEditFormData] = useState({});

    const itemsPerPage = 6;

    // Get unique departments from faculty data
    const departments = [...new Set(facultyData.map(f => f.department))];

    // Fetch all faculties
    const fetchFaculties = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/faculty`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                setFacultyData(data.data);
            } else {
                setError(data.message || 'Failed to fetch faculties');
            }
        } catch (err) {
            console.error('Error fetching faculties:', err);
            setError('Failed to fetch faculties');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchFaculties();
        }
    }, [token]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // close menu if click is outside both the inline container and the portal menu
            if (activeMenu && !event.target.closest('.action-menu-container') && !event.target.closest('.action-menu-portal')) {
                setActiveMenu(null);
                setMenuCoords(null);
                setMenuFaculty(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeMenu]);

    // Filter faculty based on search and filters
    const filteredData = facultyData.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            f.facultyId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = ! deptFilter || f.department === deptFilter;
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
        setFormData({ 
            name: '', 
            designation: '', 
            facultyId: '', 
            email:  '', 
            department: '', 
            profilePic: null 
        });
        setError('');
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

    // Create new faculty
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/faculty`, {
                method: 'POST',
                headers:  {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    designation: formData.designation,
                    facultyId: formData.facultyId,
                    email: formData.email,
                    department: formData. department
                })
            });

            const data = await response.json();

            if (data.success) {
                await fetchFaculties(); // Refresh the list
                closeModal();
                alert('Faculty created successfully!');
            } else {
                setError(data.message || 'Failed to create faculty');
            }
        } catch (err) {
            console.error('Error creating faculty:', err);
            setError('Failed to create faculty');
        } finally {
            setLoading(false);
        }
    };

    // Menu handlers
    // Toggle the action menu and compute portal coordinates so the menu does not affect table layout
    const toggleMenu = (e, faculty) => {
        e.stopPropagation();
        const userId = faculty.user_id;
        if (activeMenu === userId) {
            setActiveMenu(null);
            setMenuCoords(null);
            setMenuFaculty(null);
            return;
        }

        // compute position from the clicked button
        const rect = e.currentTarget.getBoundingClientRect();
        const menuWidth = 160; // approx
        const menuHeight = 120; // approx
        const padding = 8;

        let left = rect.right;
        // avoid overflowing right edge
        if (left + menuWidth + padding > window.innerWidth) {
            left = Math.max(padding, window.innerWidth - menuWidth - padding);
        }

        let top = rect.bottom;
        // if menu would overflow bottom, show above the button
        if (top + menuHeight + padding > window.innerHeight) {
            top = Math.max(padding, rect.top - menuHeight);
        }

        setActiveMenu(userId);
        setMenuCoords({ top, left });
        setMenuFaculty(faculty);
    };

    // Start editing
    const handleEdit = (faculty) => {
        setEditingRow(faculty.user_id);
        setEditFormData({
            name: faculty.name,
            designation: faculty.designation,
            email: faculty.email,
            department: faculty.department,
            is_active: faculty.is_active
        });
        setActiveMenu(null);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingRow(null);
        setEditFormData({});
    };

    // Handle edit form change
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    // Save edited faculty
    const handleSaveEdit = async (userId) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/faculty/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON. stringify(editFormData)
            });

            const data = await response.json();

            if (data.success) {
                await fetchFaculties(); // Refresh the list
                setEditingRow(null);
                setEditFormData({});
                alert('Faculty updated successfully!');
            } else {
                setError(data.message || 'Failed to update faculty');
            }
        } catch (err) {
            console.error('Error updating faculty:', err);
            setError('Failed to update faculty');
        } finally {
            setLoading(false);
        }
    };

    // Delete faculty
    const handleDelete = async (faculty) => {
        if (! window.confirm(`Are you sure you want to delete ${faculty.name}?`)) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/faculty/${faculty.user_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                await fetchFaculties(); // Refresh the list
                alert('Faculty deleted successfully!');
            } else {
                setError(data.message || 'Failed to delete faculty');
            }
        } catch (err) {
            console.error('Error deleting faculty:', err);
            setError('Failed to delete faculty');
        } finally {
            setLoading(false);
            setActiveMenu(null);
        }
    };

    return (
        <div style={styles.container}>
            {/* Error Message */}
            {error && (
                <div style={styles.errorBanner}>
                    <span>{error}</span>
                    <button onClick={() => setError('')} style={styles.errorClose}>×</button>
                </div>
            )}

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
                    <button style={styles.addBtn} onClick={openModal} disabled={loading}>
                        <Add sx={{ fontSize: 20 }} />
                        <span>Add New Faculty</span>
                    </button>
                </div>
            </div>

            {/* Faculty List Table */}
            <div style={styles.tableCard}>
                {loading && <div style={styles.loadingOverlay}>Loading... </div>}
                
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
                            {currentData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ ... styles.td, textAlign: 'center', padding: '40px' }}>
                                        No faculty members found
                                    </td>
                                </tr>
                            ) : (
                                currentData. map((faculty) => (
                                    <tr key={faculty.user_id} style={styles.trBody}>
                                        {editingRow === faculty.user_id ? (
                                            // Edit Mode
                                            <>
                                                <td style={styles.td}>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={editFormData.name}
                                                        onChange={handleEditInputChange}
                                                        style={styles.inlineInput}
                                                    />
                                                </td>
                                                <td style={styles.td}>
                                                    <input
                                                        type="text"
                                                        name="department"
                                                        value={editFormData.department}
                                                        onChange={handleEditInputChange}
                                                        style={styles.inlineInput}
                                                        placeholder="Department"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="designation"
                                                        value={editFormData.designation}
                                                        onChange={handleEditInputChange}
                                                        style={{ ...styles.inlineInput, marginTop: '4px' }}
                                                        placeholder="Designation"
                                                    />
                                                </td>
                                                <td style={styles.td}>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={editFormData.email}
                                                        onChange={handleEditInputChange}
                                                        style={styles.inlineInput}
                                                    />
                                                </td>
                                                <td style={styles.td}>
                                                    <select
                                                        name="is_active"
                                                        value={editFormData.is_active}
                                                        onChange={handleEditInputChange}
                                                        style={styles.inlineSelect}
                                                    >
                                                        <option value={1}>Active</option>
                                                        <option value={0}>Inactive</option>
                                                    </select>
                                                </td>
                                                <td style={styles.td}>
                                                    {new Date(faculty.joinDate).toLocaleDateString()}
                                                </td>
                                                <td style={styles. td}>
                                                    <div style={styles.actionBtnsGroup}>
                                                        <button 
                                                            style={styles.saveBtn}
                                                            onClick={() => handleSaveEdit(faculty.user_id)}
                                                            disabled={loading}
                                                            title="Save"
                                                        >
                                                            <Save sx={{ fontSize: 18 }} />
                                                        </button>
                                                        <button 
                                                            style={styles.cancelBtnInline}
                                                            onClick={handleCancelEdit}
                                                            disabled={loading}
                                                            title="Cancel"
                                                        >
                                                            <Cancel sx={{ fontSize:  18 }} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            // View Mode
                                            <>
                                                <td style={styles.td}>
                                                    <div style={styles.profileCell}>
                                                        <div style={styles.avatar}>
                                                            {faculty.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div style={styles.nameText}>{faculty.name}</div>
                                                            <div style={styles.idText}>ID: {faculty.facultyId}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={styles. deptText}>{faculty.department}</div>
                                                    <div style={styles.roleText}>{faculty. designation}</div>
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
                                                <td style={styles.td}>
                                                    {new Date(faculty.joinDate).toLocaleDateString()}
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={styles.actionBtnsGroup} className="action-menu-container">
                                                        <button 
                                                            style={styles.actionBtn}
                                                            onClick={(e) => toggleMenu(e, faculty)}
                                                        >
                                                            <MoreVert sx={{ fontSize: 18, color: '#64748b' }} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
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
                            style={{... styles.pageBtn, ...(currentPage === 1 ?  styles.pageBtnDisabled : {})}}
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

                {/* Portal Action Menu (renders fixed so it doesn't affect table layout) */}
                {activeMenu && menuFaculty && menuCoords && (
                    <div
                        className="action-menu-portal"
                        style={{
                            ...styles.actionMenuPortal,
                            top: menuCoords.top,
                            left: menuCoords.left
                        }}
                    >
                        <button
                            style={styles.menuItem}
                            onClick={() => {
                                handleEdit(menuFaculty);
                                setActiveMenu(null);
                                setMenuCoords(null);
                                setMenuFaculty(null);
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <Edit sx={{ fontSize: 16 }} />
                            <span>Edit</span>
                        </button>
                        <button
                            style={styles.menuItemDelete}
                            onClick={() => {
                                handleDelete(menuFaculty);
                                setActiveMenu(null);
                                setMenuCoords(null);
                                setMenuFaculty(null);
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <Delete sx={{ fontSize: 16 }} />
                            <span>Delete</span>
                        </button>
                    </div>
                )}

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

                        <form onSubmit={handleSubmit} style={styles.form}>
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
                                        value={formData. department}
                                        onChange={handleInputChange}
                                        style={styles.selectModal}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        <option value="CSE">CSE</option>
                                        <option value="IT">IT</option>
                                        <option value="AIDS">AIDS</option>
                                        <option value="AIML">AIML</option>
                                        <option value="CSBS">CSBS</option>
                                        <option value="BioTech">BioTech</option>
                                        <option value="E&I">E&I</option>
                                        <option value="Mechatronics">Mechatronics</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Electrical">Electrical</option>
                                    </select>
                                    <KeyboardArrowDown style={styles. selectArrow} sx={{ fontSize:  20 }} />
                                </div>
                            </div>

                            <div style={styles.modalFooter}>
                                <button 
                                    type="button" 
                                    style={styles.cancelBtnModal} 
                                    onClick={closeModal}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    style={styles.submitBtn}
                                    disabled={loading}
                                >
                                    {loading ? 'Adding...' : 'Add Faculty'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Styles ---
const styles = {
    container: { 
        padding: '0', 
        width: '100%', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative'
    },
    errorBanner: {
        backgroundColor: '#fee2e2',
        color:  '#991b1b',
        padding:  '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px'
    },
    errorClose: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        color: '#991b1b',
        cursor: 'pointer',
        padding: '0 8px'
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        fontSize: '16px',
        fontWeight: '600',
        color: '#3b82f6'
    },
    controlsRow: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px', 
        gap: '16px', 
        flexWrap: 'wrap' 
    },
    searchWrapper: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '10px 16px', 
        flex: 1, 
        minWidth: '250px', 
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)' 
    },
    searchInput: { 
        border: 'none', 
        outline: 'none', 
        fontSize: '14px', 
        width: '100%', 
        color: '#1e293b', 
        background: 'transparent' 
    },
    filtersGroup: { 
        display: 'flex', 
        gap: '12px', 
        flexWrap: 'wrap' 
    },
    selectWrapper: { 
        position: 'relative', 
        minWidth: '150px' 
    },
    select: { 
        appearance: 'none', 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        color: '#64748b', 
        padding: '10px 40px 10px 16px', 
        borderRadius:  '8px', 
        fontSize: '14px', 
        fontWeight: '500', 
        cursor: 'pointer', 
        width: '100%', 
        outline: 'none' 
    },
    selectArrow: { 
        position:  'absolute', 
        right: '12px', 
        top: '50%', 
        transform:  'translateY(-50%)', 
        pointerEvents: 'none', 
        color: '#64748b' 
    },
    addBtn: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        backgroundColor: '#3b82f6', 
        color: '#ffffff', 
        border: 'none', 
        padding: '10px 20px', 
        borderRadius:  '8px', 
        fontSize: '14px', 
        fontWeight: '600', 
        cursor: 'pointer', 
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)', 
        whiteSpace: 'nowrap' 
    },
    tableCard: { 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0', 
        overflow: 'visible',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        position: 'relative'
    },
    tableWrapper: { 
        overflowX: 'auto',
        overflowY: 'visible'
    },
    table:  { 
        width: '100%', 
        borderCollapse: 'collapse', 
        textAlign: 'left', 
        minWidth: '800px' 
    },
    trHead: { 
        backgroundColor: '#f8fafc', 
        borderBottom: '1px solid #e2e8f0' 
    },
    th: { 
        padding: '16px 24px', 
        fontSize: '12px', 
        fontWeight:  '600', 
        color: '#64748b', 
        textTransform: 'uppercase', 
        letterSpacing: '0.5px', 
        whiteSpace: 'nowrap' 
    },
    trBody: { 
        borderBottom: '1px solid #f1f5f9' 
    },
    td: { 
        padding: '16px 24px', 
        fontSize: '14px', 
        color:  '#334155',
        position: 'relative'
    },
    profileCell: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px' 
    },
    avatar: { 
        width:  '40px', 
        height: '40px', 
        borderRadius: '50%', 
        backgroundColor: '#e0e7ff', 
        color: '#4f46e5', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontWeight: '700', 
        fontSize: '16px', 
        flexShrink: 0 
    },
    nameText:  { 
        fontWeight: '600', 
        color: '#0f172a' 
    },
    idText: { 
        fontSize: '12px', 
        color: '#94a3b8', 
        marginTop: '2px' 
    },
    deptText: { 
        fontWeight: '500', 
        color: '#1e293b' 
    },
    roleText: { 
        fontSize: '12px', 
        color: '#64748b', 
        marginTop: '2px' 
    },
    contactRow: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        fontSize: '13px', 
        color: '#475569' 
    },
    statusActive: { 
        backgroundColor: '#16A34A', 
        color:  'white', 
        padding:  '4px 12px', 
        borderRadius:  '20px', 
        fontSize: '12px', 
        fontWeight:  '600', 
        display: 'inline-block' 
    },
    statusOnLeave: { 
        backgroundColor:  '#F59E0B', 
        color: 'black', 
        padding: '4px 12px', 
        borderRadius: '20px', 
        fontSize: '12px', 
        fontWeight: '600', 
        display: 'inline-block' 
    },
    statusInactive: { 
        backgroundColor: '#f1f5f9', 
        color: '#475569', 
        padding: '4px 12px', 
        borderRadius: '20px', 
        fontSize: '12px', 
        fontWeight: '600', 
        display: 'inline-block' 
    },
    actionBtnsGroup: { 
        position: 'relative', 
        display: 'flex', 
        gap: '8px', 
        alignItems: 'center' 
    },
    actionBtn: { 
        background: 'none', 
        border:  'none', 
        cursor: 'pointer', 
        padding: '4px', 
        borderRadius: '4px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    actionMenu: { 
        position: 'absolute', 
        right: '0', 
        top: '100%', 
        marginTop: '4px',
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 100,
        minWidth: '140px',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    },
    actionMenuPortal: {
        position: 'fixed',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 8px 20px rgba(2,6,23,0.2)',
        zIndex: 3000,
        minWidth: '140px',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
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
        textAlign:  'left',
        transition:  'background-color 0.15s',
        borderTop: '1px solid #f1f5f9'
    },
    inlineInput: {
        width: '100%',
        padding: '6px 10px',
        border: '1px solid #e2e8f0',
        borderRadius:  '6px',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#ffffff'
    },
    inlineSelect: {
        width:  '100%',
        padding:  '6px 10px',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#ffffff',
        cursor: 'pointer'
    },
    saveBtn: {
        backgroundColor: '#10b981',
        color: '#ffffff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancelBtnInline: {
        backgroundColor: '#ef4444',
        color:  '#ffffff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paginationWrapper: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 24px', 
        borderTop: '1px solid #e2e8f0', 
        backgroundColor: '#fafafa', 
        flexWrap: 'wrap', 
        gap: '12px' 
    },
    showingText: { 
        fontSize: '14px', 
        color: '#64748b' 
    },
    paginationControls: { 
        display: 'flex', 
        gap: '12px' 
    },
    pageBtn: { 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        color: '#334155', 
        padding: '8px 16px', 
        borderRadius: '6px', 
        fontSize: '14px', 
        fontWeight: '500', 
        cursor: 'pointer' 
    },
    pageBtnDisabled: { 
        opacity: 0.5, 
        cursor: 'not-allowed' 
    },
    
    // Modal Styles
    modalOverlay: { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 1000, 
        padding: '20px' 
    },
    modalContent: { 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        width: '100%', 
        maxWidth:  '600px', 
        maxHeight:  '90vh', 
        overflowY: 'auto', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
    },
    modalHeader: { 
        display:  'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '24px', 
        borderBottom: '1px solid #e2e8f0' 
    },
    modalTitle: { 
        fontSize: '20px', 
        fontWeight:  '700', 
        color: '#0f172a', 
        margin: 0 
    },
    closeBtn: { 
        background:  'none', 
        border: 'none', 
        cursor: 'pointer', 
        padding: '4px', 
        borderRadius: '4px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    form: { 
        padding: '24px' 
    },
    formGrid: { 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        marginBottom: '20px' 
    },
    formGroup: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px', 
        marginBottom: '20px' 
    },
    label: { 
        fontSize:  '14px', 
        fontWeight: '600', 
        color: '#334155' 
    },
    input: { 
        padding:  '10px 16px', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        fontSize: '14px', 
        color: '#1e293b', 
        outline: 'none', 
        transition: 'border-color 0.2s' 
    },
    selectModal: { 
        appearance: 'none', 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        color: '#1e293b', 
        padding: '10px 40px 10px 16px', 
        borderRadius: '8px', 
        fontSize: '14px', 
        cursor: 'pointer', 
        width: '100%', 
        outline: 'none' 
    },
    uploadArea: { 
        border: '2px dashed #e2e8f0', 
        borderRadius: '8px', 
        padding: '24px', 
        textAlign:  'center', 
        backgroundColor: '#f8fafc', 
        transition: 'border-color 0.2s' 
    },
    fileInput: { 
        display:  'none' 
    },
    uploadLabel: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        cursor: 'pointer' 
    },
    uploadText: { 
        fontSize: '14px', 
        color:  '#64748b', 
        fontWeight: '500', 
        marginBottom: '4px' 
    },
    uploadSubtext: { 
        fontSize: '12px', 
        color:  '#94a3b8' 
    },
    modalFooter: { 
        display:  'flex', 
        justifyContent: 'flex-end', 
        gap:  '12px', 
        marginTop: '24px', 
        paddingTop: '24px', 
        borderTop:  '1px solid #e2e8f0' 
    },
    cancelBtnModal: { 
        padding: '10px 20px', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        fontSize: '14px', 
        fontWeight: '600', 
        color: '#64748b', 
        backgroundColor: '#ffffff', 
        cursor: 'pointer' 
    },
    submitBtn: { 
        padding: '10px 20px', 
        border: 'none', 
        borderRadius: '8px', 
        fontSize: '14px', 
        fontWeight: '600', 
        color: '#ffffff', 
        backgroundColor: '#3b82f6', 
        cursor: 'pointer' 
    }
};

export default FacultyAccounts;
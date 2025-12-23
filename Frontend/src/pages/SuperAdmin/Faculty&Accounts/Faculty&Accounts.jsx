import React, { useState } from 'react';
import {
    Search,
    FilterList,
    Add,
    MoreVert,
    MailOutline,
    Phone,
    School,
    Badge
} from '@mui/icons-material';

// --- Mock Data ---
const FACULTY_DATA = [
    { id: 1, name: 'Dr. Sarah Wilson', role: 'Professor', dept: 'Computer Science', email: 's.wilson@uni.edu', status: 'Active', joinDate: '2020-03-15' },
    { id: 2, name: 'Prof. James Chen', role: 'Assistant Professor', dept: 'Engineering', email: 'j.chen@uni.edu', status: 'On Leave', joinDate: '2019-08-01' },
    { id: 3, name: 'Dr. Emily Parker', role: 'Lecturer', dept: 'Mathematics', email: 'e.parker@uni.edu', status: 'Active', joinDate: '2021-01-10' },
    { id: 4, name: 'Mr. Robert Fox', role: 'Lab Instructor', dept: 'Physics', email: 'r.fox@uni.edu', status: 'Active', joinDate: '2022-05-20' },
    { id: 5, name: 'Dr. Linda Wong', role: 'Professor', dept: 'Chemistry', email: 'l.wong@uni.edu', status: 'Active', joinDate: '2018-11-12' },
];

const FacultyAccounts = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <div style={styles.headerRow}>
                <div>
                    <h2 style={styles.pageTitle}>Faculty & Accounts</h2>
                    <p style={styles.subTitle}>Manage access and profiles for all staff members</p>
                </div>
                <button style={styles.addBtn}>
                    <Add sx={{ fontSize: 20 }} />
                    <span>Add New Faculty</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div style={styles.controlsRow}>
                <div style={styles.searchWrapper}>
                    <Search sx={{ color: '#94a3b8', fontSize: 22 }} />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or email..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={styles.actionsGroup}>
                    <button style={styles.filterBtn}>
                        <FilterList sx={{ fontSize: 20 }} />
                        <span>Filter</span>
                    </button>
                    <button style={styles.exportBtn}>Export CSV</button>
                </div>
            </div>

            {/* Faculty List Table */}
            <div style={styles.tableCard}>
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
                        {FACULTY_DATA.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).map((faculty) => (
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
                                    <span style={faculty.status === 'Active' ? styles.statusActive : styles.statusInactive}>
                                        {faculty.status}
                                    </span>
                                </td>
                                <td style={styles.td}>{faculty.joinDate}</td>
                                <td style={styles.td}>
                                    <button style={styles.actionBtn}>
                                        <MoreVert sx={{ fontSize: 20, color: '#64748b' }} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Styles ---
const styles = {
    container: {
        padding: '0px',
        width: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    pageTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#0f172a',
        margin: '0 0 8px 0',
    },
    subTitle: {
        fontSize: '14px',
        color: '#64748b',
        margin: 0,
    },
    addBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    controlsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '16px',
        flexWrap: 'wrap',
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
        maxWidth: '400px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    searchInput: {
        border: 'none',
        outline: 'none',
        fontSize: '14px',
        width: '100%',
        color: '#1e293b',
    },
    actionsGroup: {
        display: 'flex',
        gap: '12px',
    },
    filterBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        color: '#64748b',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    exportBtn: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        color: '#64748b',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    tableCard: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
    },
    trHead: {
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
    },
    th: {
        padding: '16px 24px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    trBody: {
        borderBottom: '1px solid #f1f5f9',
    },
    td: {
        padding: '16px 24px',
        fontSize: '14px',
        color: '#334155',
    },
    profileCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#e0e7ff',
        color: '#4f46e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '16px',
    },
    nameText: {
        fontWeight: '600',
        color: '#0f172a',
    },
    idText: {
        fontSize: '12px',
        color: '#94a3b8',
        marginTop: '2px',
    },
    deptText: {
        fontWeight: '500',
        color: '#1e293b',
    },
    roleText: {
        fontSize: '12px',
        color: '#64748b',
        marginTop: '2px',
    },
    contactRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: '#475569',
    },
    statusActive: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
    },
    statusInactive: {
        backgroundColor: '#f1f5f9',
        color: '#475569',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
    },
    actionBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export default FacultyAccounts;

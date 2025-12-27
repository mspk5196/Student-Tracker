import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    BookOpen,
    Filter,
    ChevronRight,
    Search,
    TrendingUp,
    Info
} from 'lucide-react';

const StudentAttendance = () => {
    // --- MOCK DATA FOR STUDENT ATTENDANCE ---
    const ATTENDANCE_SUMMARY = {
        overall: 82,
        totalClasses: 120,
        present: 98,
        absent: 15,
        late: 7,
        standing: "Good Standing"
    };

    const SUBJECT_ATTENDANCE = [
        { id: 1, name: 'React Mastery Workshop', code: 'REACT-101', present: 28, total: 30, percent: 93, status: 'safe' },
        { id: 2, name: 'HTML & CSS Fundamentals', code: 'WEB-201', present: 22, total: 30, percent: 73, status: 'warning' },
        { id: 3, name: 'JavaScript Deep Dive', code: 'JS-301', present: 25, total: 30, percent: 83, status: 'safe' },
        { id: 4, name: 'UI/UX Design Principles', code: 'DESIGN-501', present: 23, total: 30, percent: 76, status: 'warning' }
    ];

    const ATTENDANCE_HISTORY = [
        { id: 101, date: '2024-10-24', subject: 'React Mastery Workshop', time: '09:00 AM - 10:30 AM', status: 'present' },
        { id: 102, date: '2024-10-24', subject: 'HTML & CSS Fundamentals', time: '10:30 AM - 12:00 PM', status: 'absent' },
        { id: 103, date: '2024-10-23', subject: 'JavaScript Deep Dive', time: '01:30 PM - 03:00 PM', status: 'present' },
        { id: 104, date: '2024-10-23', subject: 'UI/UX Design Principles', time: '03:00 PM - 04:30 PM', status: 'late' },
        { id: 105, date: '2024-10-22', subject: 'React Mastery Workshop', time: '09:00 AM - 10:30 AM', status: 'present' },
        { id: 106, date: '2024-10-22', subject: 'HTML & CSS Fundamentals', time: '10:30 AM - 12:00 PM', status: 'present' }
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    const filteredHistory = ATTENDANCE_HISTORY.filter(record => {
        const matchesSearch = record.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || record.status === filter;
        return matchesSearch && matchesFilter;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'present': return { color: '#10B981', bg: '#F0FDF4', icon: <CheckCircle2 size={16} /> };
            case 'absent': return { color: '#EF4444', bg: '#FEF2F2', icon: <XCircle size={16} /> };
            case 'late': return { color: '#F59E0B', bg: '#FFF7ED', icon: <Clock size={16} /> };
            default: return { color: '#6B7280', bg: '#F3F4F6', icon: <Info size={16} /> };
        }
    };

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}>My Attendance</h1>
                    <p style={styles.subtitle}>Track your presence and maintain your academic standing</p>
                </div>
                <div style={styles.standingBadge}>
                    <TrendingUp size={16} style={{ marginRight: 8 }} />
                    {ATTENDANCE_SUMMARY.standing}
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIconBox}><CheckCircle2 color="#10B981" /></div>
                    <div style={styles.statInfo}>
                        <span style={styles.statLabel}>Overall Attendance</span>
                        <span style={styles.statValue}>{ATTENDANCE_SUMMARY.overall}%</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIconBox}><BookOpen color="#2563EB" /></div>
                    <div style={styles.statInfo}>
                        <span style={styles.statLabel}>Total Classes</span>
                        <span style={styles.statValue}>{ATTENDANCE_SUMMARY.totalClasses}</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIconBox}><Clock color="#F59E0B" /></div>
                    <div style={styles.statInfo}>
                        <span style={styles.statLabel}>Present / Late</span>
                        <span style={styles.statValue}>{ATTENDANCE_SUMMARY.present} / {ATTENDANCE_SUMMARY.late}</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIconBox}><XCircle color="#EF4444" /></div>
                    <div style={styles.statInfo}>
                        <span style={styles.statLabel}>Absences</span>
                        <span style={styles.statValue}>{ATTENDANCE_SUMMARY.absent}</span>
                    </div>
                </div>
            </div>

            <div style={styles.mainLayout}>
                {/* Left Side: Subject-wise Breakdown */}
                <div style={styles.leftCol}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Course-wise Breakdown</h2>
                    </div>
                    <div style={styles.subjectList}>
                        {SUBJECT_ATTENDANCE.map(subject => (
                            <div key={subject.id} style={styles.subjectCard}>
                                <div style={styles.subjectInfo}>
                                    <div style={styles.subjectCode}>{subject.code}</div>
                                    <h3 style={styles.subjectName}>{subject.name}</h3>
                                    <div style={styles.classCounts}>
                                        {subject.present} of {subject.total} classes attended
                                    </div>
                                </div>
                                <div style={styles.percentGroup}>
                                    <div style={{
                                        ...styles.percentCircle,
                                        borderColor: subject.status === 'safe' ? '#10B981' : '#F59E0B'
                                    }}>
                                        {subject.percent}%
                                    </div>
                                    <span style={{
                                        ...styles.statusText,
                                        color: subject.status === 'safe' ? '#10B981' : '#F59E0B'
                                    }}>
                                        {subject.status === 'safe' ? 'Safe' : 'Watch out'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Attendance History */}
                <div style={styles.rightCol}>
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h2 style={styles.sectionTitle}>Recent History</h2>
                            <div style={styles.filterGroup}>
                                <div style={styles.searchBox}>
                                    <Search size={14} style={styles.searchIcon} />
                                    <input
                                        style={styles.searchInput}
                                        placeholder="Search Subject..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <select
                                    style={styles.filterSelect}
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="late">Late</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.historyList}>
                            {filteredHistory.map(record => {
                                const status = getStatusStyle(record.status);
                                return (
                                    <div key={record.id} style={styles.historyItem}>
                                        <div style={styles.historyLeft}>
                                            <div style={{ ...styles.statusIndicator, backgroundColor: status.bg, color: status.color }}>
                                                {status.icon}
                                            </div>
                                            <div style={styles.historyDetails}>
                                                <div style={styles.historySubject}>{record.subject}</div>
                                                <div style={styles.historyMeta}>
                                                    <Calendar size={12} style={{ marginRight: 4 }} /> {record.date}
                                                    <span style={{ margin: '0 8px' }}>•</span>
                                                    <Clock size={12} style={{ marginRight: 4 }} /> {record.time}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ ...styles.historyStatusText, color: status.color }}>
                                            {record.status.toUpperCase()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button style={styles.viewMoreBtn}>
                            View Full History <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '24px',
        backgroundColor: '#F8F9FA',
        minHeight: '100vh',
        fontFamily: '"Inter", sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#111827',
        margin: '0 0 8px 0'
    },
    subtitle: {
        fontSize: '15px',
        color: '#6B7280',
        margin: 0
    },
    standingBadge: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 16px',
        backgroundColor: '#ECFDF5',
        color: '#059669',
        borderRadius: '100px',
        fontWeight: '700',
        fontSize: '14px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '32px'
    },
    statCard: {
        backgroundColor: '#FFFFFF',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
    },
    statIconBox: {
        width: '48px',
        height: '48px',
        backgroundColor: '#F3F4F6',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    statInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    statLabel: {
        fontSize: '13px',
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: '4px'
    },
    statValue: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#111827'
    },
    mainLayout: {
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '24px'
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#111827',
        margin: 0
    },
    subjectList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    subjectCard: {
        backgroundColor: '#FFFFFF',
        padding: '20px 24px',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    subjectInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    subjectCode: {
        fontSize: '11px',
        fontWeight: '800',
        color: '#2563EB',
        backgroundColor: '#EFF6FF',
        width: 'fit-content',
        padding: '2px 8px',
        borderRadius: '4px',
        marginBottom: '4px'
    },
    subjectName: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#111827',
        margin: 0
    },
    classCounts: {
        fontSize: '13px',
        color: '#6B7280'
    },
    percentGroup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
    },
    percentCircle: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        border: '4px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '15px',
        fontWeight: '800',
        color: '#111827'
    },
    statusText: {
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    rightCol: {
        display: 'flex',
        flexDirection: 'column'
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        height: 'fit-content'
    },
    cardHeader: {
        padding: '24px',
        borderBottom: '1px solid #F3F4F6'
    },
    filterGroup: {
        display: 'flex',
        gap: '12px',
        marginTop: '16px'
    },
    searchBox: {
        position: 'relative',
        flex: 1
    },
    searchIcon: {
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9CA3AF'
    },
    searchInput: {
        width: '100%',
        padding: '8px 12px 8px 32px',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        fontSize: '13px',
        outline: 'none'
    },
    filterSelect: {
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        fontSize: '13px',
        color: '#374151',
        outline: 'none'
    },
    historyList: {
        display: 'flex',
        flexDirection: 'column'
    },
    historyItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #F3F4F6'
    },
    historyLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    statusIndicator: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    historyDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    historySubject: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1F2937'
    },
    historyMeta: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px',
        color: '#6B7280'
    },
    historyStatusText: {
        fontSize: '11px',
        fontWeight: '700'
    },
    viewMoreBtn: {
        padding: '16px',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#2563EB',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    }
};

export default StudentAttendance;

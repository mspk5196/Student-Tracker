import React, { useState, useEffect } from 'react';
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
    Info,
    ChevronLeft
} from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore';

const StudentAttendance = () => {
    const { user, token } = useAuthStore();
    const API_URL = import.meta.env.VITE_API_URL;

    // --- STATE MANAGEMENT ---
    const [attendanceSummary, setAttendanceSummary] = useState({
        overall: 0,
        totalClasses: 0,
        present: 0,
        absent: 0,
        late: 0,
        standing: "Loading..."
    });

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // --- FETCH DATA FROM BACKEND ---
    useEffect(() => {
        const fetchAttendanceData = async () => {
            if (!user?.user_id) return;

            setLoading(true);
            setError(null);

            try {
                // Fetch dashboard data
                const dashboardResponse = await fetch(
                    `${API_URL}/attendance/dashboard/${user.user_id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const dashboardData = await dashboardResponse.json();

                if (dashboardData.success) {
                    const data = dashboardData.data;
                    
                    // Set attendance summary
                    const presentCount = data.sessionStatus.find(s => s.label === 'Present')?.count || 0;
                    const lateCount = data.sessionStatus.find(s => s.label === 'Late')?.count || 0;
                    const absentCount = data.sessionStatus.find(s => s.label === 'Absent')?.count || 0;
                    const totalClasses = presentCount + lateCount + absentCount;
                    const overallPercent = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

                    setAttendanceSummary({
                        overall: overallPercent,
                        totalClasses: totalClasses,
                        present: presentCount,
                        absent: absentCount,
                        late: lateCount,
                        standing: overallPercent >= 75 ? "Good Standing" : "Warning"
                    });

                    // Set subject attendance
                    const subjects = data.subjects.map((sub, index) => ({
                        id: index + 1,
                        name: sub.name,
                        code: `VENUE-${index + 1}`,
                        present: sub.current,
                        total: sub.total,
                        percent: sub.percent,
                        status: sub.percent >= 75 ? 'safe' : 'warning'
                    }));
                    setSubjectAttendance(subjects);
                }

                // Fetch attendance history
                const historyResponse = await fetch(
                    `${API_URL}/attendance/history/${user.user_id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const historyData = await historyResponse.json();

                if (historyData.success) {
                    const history = historyData.data.map((record, index) => ({
                        id: record.attendance_id || index,
                        date: new Date(record.created_at).toISOString().split('T')[0],
                        subject: record.venue_name,
                        time: record.session_name || 'N/A',
                        status: record.is_present === 1 ? (record.is_late === 1 ? 'late' : 'present') : 'absent'
                    }));
                    setAttendanceHistory(history);
                }

            } catch (err) {
                console.error('❌ Error fetching attendance data:', err);
                setError('Failed to load attendance data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, [user, token, API_URL]);

    // Filter history based on search and filter
    const filteredHistory = attendanceHistory.filter(record => {
        const matchesSearch = record.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || record.status === filter;
        return matchesSearch && matchesFilter;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredHistory.length);
    const currentItems = filteredHistory.slice(startIndex, endIndex);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'present': return { color: '#10B981', bg: '#F0FDF4', icon: <CheckCircle2 size={16} /> };
            case 'absent': return { color: '#EF4444', bg: '#FEF2F2', icon: <XCircle size={16} /> };
            case 'late': return { color: '#F59E0B', bg: '#FFF7ED', icon: <Clock size={16} /> };
            default: return { color: '#6B7280', bg: '#F3F4F6', icon: <Info size={16} /> };
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 3;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 2) {
                pages.push(1, 2, 3);
            } else if (currentPage >= totalPages - 1) {
                pages.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }
        return pages;
    };

    return (
        <div style={styles.container}>
            {/* Responsive Styles Injection */}
            <style>{`
                @media (max-width: 768px) {
                    .header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 16px;
                    }
                    .standing-badge {
                        align-self: flex-start !important;
                    }
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 12px !important;
                    }
                    .main-layout {
                        grid-template-columns: 1fr !important;
                        gap: 24px !important;
                    }
                    .subject-card {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 16px;
                    }
                    .percent-group {
                        flex-direction: row !important;
                        width: 100%;
                        justify-content: space-between !important;
                        align-items: center;
                    }
                    .filter-group {
                        flex-direction: column !important;
                        gap: 12px;
                    }
                    .search-box {
                        width: 100% !important;
                    }
                    .history-item {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 12px;
                    }
                    .history-left {
                        width: 100%;
                    }
                    .history-status-text {
                        align-self: flex-end;
                    }
                    .pagination-container {
                        flex-direction: column !important;
                        align-items: center !important;
                        gap: 16px !important;
                        padding: 16px !important;
                    }
                    .pagination-info {
                        width: 100%;
                        text-align: center !important;
                    }
                    .pagination-controls {
                        width: 100%;
                        justify-content: center !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .stats-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .stat-card {
                        padding: 20px !important;
                    }
                    .container {
                        padding: 16px !important;
                    }
                    .section-title {
                        font-size: 16px !important;
                    }
                    .subject-name {
                        font-size: 14px !important;
                    }
                    .pagination-buttons {
                        flex-wrap: wrap !important;
                        justify-content: center !important;
                        gap: 8px !important;
                    }
                    .page-number {
                        min-width: 36px !important;
                        height: 36px !important;
                    }
                }
            `}</style>

            {/* Loading State */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ fontSize: '16px', color: '#64748b' }}>Loading attendance data...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div style={{ padding: '20px', backgroundColor: '#FEF2F2', borderRadius: '12px', marginBottom: '24px' }}>
                    <p style={{ color: '#EF4444', fontSize: '14px' }}>{error}</p>
                </div>
            )}

            {/* Content - Only show when not loading */}
            {!loading && !error && (
                <>
                    {/* Header Section */}
                    <header style={styles.header} className="header">
                        <div style={styles.headerLeft}>
                            <h1 style={styles.title}>My Attendance</h1>
                            <p style={styles.subtitle}>Track your presence and maintain your academic standing</p>
                        </div>
                        <div style={styles.standingBadge} className="standing-badge">
                            <TrendingUp size={16} style={{ marginRight: 8 }} />
                            {attendanceSummary.standing}
                        </div>
                    </header>

                    {/* Quick Stats Grid */}
                    <div style={styles.statsGrid} className="stats-grid">
                        <div style={styles.statCard}>
                            <div style={styles.statIconBox}><CheckCircle2 color="#10B981" /></div>
                            <div style={styles.statInfo}>
                                <span style={styles.statLabel}>Overall Attendance</span>
                                <span style={styles.statValue}>{attendanceSummary.overall}%</span>
                            </div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statIconBox}><BookOpen color="#2563EB" /></div>
                            <div style={styles.statInfo}>
                                <span style={styles.statLabel}>Total Classes</span>
                                <span style={styles.statValue}>{attendanceSummary.totalClasses}</span>
                            </div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statIconBox}><Clock color="#F59E0B" /></div>
                            <div style={styles.statInfo}>
                                <span style={styles.statLabel}>Present / Late</span>
                                <span style={styles.statValue}>{attendanceSummary.present} / {attendanceSummary.late}</span>
                            </div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={styles.statIconBox}><XCircle color="#EF4444" /></div>
                            <div style={styles.statInfo}>
                                <span style={styles.statLabel}>Absent</span>
                                <span style={styles.statValue}>{attendanceSummary.absent}</span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.mainLayout} className="main-layout">
                        {/* Left Side: Subject-wise Breakdown */}
                        <div style={styles.leftCol}>
                            <div style={styles.sectionHeader}>
                                <h2 style={styles.sectionTitle} className="section-title">Course-wise Breakdown</h2>
                            </div>
                            <div style={styles.subjectList}>
                                {subjectAttendance.length === 0 ? (
                                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                        No subject data available
                                    </div>
                                ) : (
                                    subjectAttendance.map(subject => (
                                        <div key={subject.id} style={styles.subjectCard} className="subject-card">
                                            <div style={styles.subjectInfo}>
                                                <div style={styles.subjectCode}>{subject.code}</div>
                                                <h3 style={styles.subjectName} className="subject-name">{subject.name}</h3>
                                                <div style={styles.classCounts}>
                                                    {subject.present} of {subject.total} classes attended
                                                </div>
                                            </div>
                                            <div style={styles.percentGroup} className="percent-group">
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
                                    ))
                                )}
                            </div>
                        </div>

                {/* Right Side: Attendance History */}
                <div style={styles.rightCol}>
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h2 style={styles.sectionTitle} className="section-title">Recent History</h2>
                            <div style={styles.filterGroup} className="filter-group">
                                <div style={styles.searchBox} className="search-box">
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
                            {currentItems.map(record => {
                                const status = getStatusStyle(record.status);
                                return (
                                    <div key={record.id} style={styles.historyItem} className="history-item">
                                        <div style={styles.historyLeft} className="history-left">
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
                                        <div style={{ ...styles.historyStatusText, color: status.color }} className="history-status-text">
                                            {record.status.toUpperCase()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Pagination Component */}
                        <div style={styles.paginationContainer} className="pagination-container">
                            <div style={styles.paginationInfo} className="pagination-info">
                                Showing {startIndex + 1}-{endIndex} of {filteredHistory.length} records
                            </div>
                            <div style={styles.paginationControls} className="pagination-controls">
                                <div style={styles.paginationButtons} className="pagination-buttons">
                                    <button
                                        style={{
                                            ...styles.paginationButton,
                                            ...styles.prevButton,
                                            opacity: currentPage === 1 ? 0.5 : 1
                                        }}
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={16} /> Prev
                                    </button>
                                    
                                    {getPageNumbers().map(page => (
                                        <button
                                            key={page}
                                            style={{
                                                ...styles.paginationButton,
                                                ...styles.pageNumber,
                                                backgroundColor: currentPage === page ? '#2563EB' : 'transparent',
                                                color: currentPage === page ? '#FFFFFF' : '#374151'
                                            }}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    
                                    <button
                                        style={{
                                            ...styles.paginationButton,
                                            ...styles.nextButton,
                                            opacity: currentPage === totalPages ? 0.5 : 1
                                        }}
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#F8F9FA',
        minHeight: '100vh',
        fontFamily: '"Inter", sans-serif',
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
    // Pagination Styles
    paginationContainer: {
        padding: '20px 24px',
        borderTop: '1px solid #F3F4F6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB'
    },
    paginationInfo: {
        fontSize: '14px',
        color: '#6B7280',
        fontWeight: '500'
    },
    paginationControls: {
        display: 'flex',
        alignItems: 'center'
    },
    paginationButtons: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    paginationButton: {
        padding: '8px 16px',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        color: '#374151',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s'
    },
    prevButton: {
        backgroundColor: '#FFFFFF',
        color: '#374151'
    },
    nextButton: {
        backgroundColor: '#FFFFFF',
        color: '#374151'
    },
    pageNumber: {
        minWidth: '40px',
        height: '40px',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #E5E7EB'
    }
};

export default StudentAttendance;
import React, { useState, useMemo, useEffect } from 'react';
import {
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    Save,
    Calendar,
    ChevronDown
} from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore';

const AttendanceManagement = () => {
    const { token, user } = useAuthStore();
    const API_URL = import.meta.env.VITE_API_URL;

    // --- Responsive Logic ---
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [venues, setVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [timeSlot, setTimeSlot] = useState('09:00 AM - 10:30 AM');
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sessionId, setSessionId] = useState(null);

    const TIME_SLOTS = [
        '09:00 AM - 10:30 AM',
        '10:30 AM - 12:30 PM',
        '01:30 PM - 03:00 PM',
        '03:00 PM - 04:30 PM'
    ];

    const fetchVenues = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/attendance/venues/${user.faculty_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success && data.data.length > 0) {
                setVenues(data.data);
                setSelectedVenue(data.data[0]);
            } else {
                setError('No venue allocations found');
            }
        } catch (err) {
            setError('Failed to fetch venues');
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        if (!selectedVenue) return;
        setLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/attendance/students/${selectedVenue.venue_id}/${user.faculty_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data = await response.json();
            if (data.success) {
                setStudents(data.data);
            } else {
                setError(data.message || 'Failed to fetch students');
            }
        } catch (err) {
            setError('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const initializeSession = async () => {
        if (!selectedVenue) return;
        try {
            const response = await fetch(`${API_URL}/attendance/session`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionName: selectedVenue.venue_name,
                    date,
                    timeSlot
                })
            });
            const data = await response.json();
            if (data.success) {
                setSessionId(data.data.session_id);
            }
        } catch (err) {
            console.error('Error initializing session:', err);
        }
    };

    useEffect(() => {
        if (token && user) fetchVenues();
    }, [token, user]);

    useEffect(() => {
        if (selectedVenue) {
            fetchStudents();
            initializeSession();
        }
    }, [selectedVenue, date, timeSlot]);

    const filteredStudents = useMemo(() => {
        return students.filter(
            s =>
                s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.id.toLowerCase().includes(search.toLowerCase())
        );
    }, [students, search]);

    const stats = useMemo(() => ({
        total: students.length,
        present: students.filter(s => s.status === 'present').length,
        absent: students.filter(s => s.status === 'absent').length,
        late: students.filter(s => s.status === 'late').length
    }), [students]);

    const updateStatus = (id, status) => {
        setStudents(prev =>
            prev.map(s => (s.id === id ? { ...s, status } : s))
        );
    };

    const updateRemark = (id, value) => {
        setStudents(prev =>
            prev.map(s => (s.id === id ? { ...s, remarks: value } : s))
        );
    };

    const markAllPresent = () => {
        setStudents(prev =>
            prev.map(s => ({ ...s, status: 'present' }))
        );
    };

    const handleTimeSlotChange = (slot) => {
        setTimeSlot(slot);
        setStudents(prev =>
            prev.map(s => ({ ...s, status: '', remarks: '' }))
        );
    };

    const saveAttendance = async () => {
        if (!sessionId) {
            alert('Session not initialized');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/attendance/save`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    facultyId: user.faculty_id,
                    venueId: selectedVenue.venue_id,
                    sessionId: sessionId,
                    date,
                    timeSlot,
                    attendance: students.map(s => ({
                        student_id: s.student_id,
                        status: s.status,
                        remarks: s.remarks
                    }))
                })
            });
            const data = await response.json();
            if (data.success) {
                alert('Attendance saved successfully!');
                setStudents(prev =>
                    prev.map(s => ({ ...s, status: '', remarks: '' }))
                );
            } else {
                setError(data.message || 'Failed to save attendance');
            }
        } catch (err) {
            setError('Failed to save attendance');
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- DYNAMIC STYLES ---------------- */
    const styles = {
        container: {
            backgroundColor: '#F9FAFB',
            minHeight: '100vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        errorBanner: {
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: isMobile ? '12px' : '14px'
        },
        errorClose: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#991B1B' },
        loading: { textAlign: 'center', padding: '40px', color: '#6B7280', fontSize: '16px' },
        card: {
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            padding: isMobile ? '16px' : '24px',
        },
        filterGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '12px' : '20px',
            paddingBottom: '24px',
            borderBottom: '1px solid #F3F4F6',
        },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
        label: { fontSize: '12px', fontWeight: '600', color: '#9CA3AF' },
        selectWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
        select: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#1F2937',
            appearance: 'none',
            outline: 'none',
        },
        selectDisabled: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#F3F4F6',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#6B7280',
            outline: 'none',
        },
        chevron: { position: 'absolute', right: '12px', color: '#9CA3AF', pointerEvents: 'none' },
        calendarIcon: { position: 'absolute', right: '12px', color: '#374151', pointerEvents: 'none' },

        statsStrip: { 
            display: 'flex', 
            gap: isMobile ? '20px' : '48px', 
            marginTop: '24px', 
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'space-between' : 'flex-start'
        },
        statItem: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: isMobile ? '40%' : 'auto' },
        statLabel: { fontSize: '12px', color: '#9CA3AF', fontWeight: '500' },
        statValueBlack: { fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#111827' },
        statValueGreen: { fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#10B981' },
        statValueRed: { fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#EF4444' },
        statValueOrange: { fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#F59E0B' },

        tableToolbar: {
            padding: isMobile ? '16px' : '24px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            borderBottom: '1px solid #F3F4F6',
            gap: '16px'
        },
        searchBox: { position: 'relative', display: 'flex', alignItems: 'center', width: isMobile ? '100%' : '280px' },
        searchIcon: { position: 'absolute', left: '12px', color: '#9CA3AF' },
        searchInput: {
            width: '100%',
            padding: '10px 12px 10px 40px',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#FAFBFC',
            outline: 'none',
        },
        btnSecondary: {
            padding: '10px 18px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFF',
            color: '#374151',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'center'
        },

        table: { display: 'flex', flexDirection: 'column' },
        thRow: {
            display: isMobile ? 'none' : 'flex',
            padding: '12px 24px',
            backgroundColor: '#FAFBFC',
            borderBottom: '1px solid #F3F4F6',
        },
        th: { fontSize: '13px', fontWeight: '600', color: '#9CA3AF' },
        tr: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            padding: isMobile ? '16px' : '18px 24px',
            alignItems: isMobile ? 'stretch' : 'center',
            borderBottom: '1px solid #F3F4F6',
            gap: isMobile ? '16px' : '0'
        },
        studentCell: { flex: 1.2, display: 'flex', alignItems: 'center', gap: '14px' },
        avatar: {
            width: '36px', height: '36px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#4B5563', fontSize: '12px', fontWeight: '600',
        },
        studentName: { fontSize: '14px', fontWeight: '600', color: '#111827' },
        studentId: { fontSize: '12px', color: '#9CA3AF', marginTop: '2px' },

        statusCell: { flex: 1.4, overflowX: isMobile ? 'auto' : 'visible' },
        toggleGroup: {
            display: 'flex',
            backgroundColor: '#F3F4F6',
            borderRadius: isMobile ? '8px' : '100px',
            padding: '3px',
            width: isMobile ? '100%' : 'fit-content',
        },
        toggleBtn: {
            flex: isMobile ? 1 : 'none',
            border: 'none', backgroundColor: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '10px 8px' : '8px 18px', borderRadius: isMobile ? '6px' : '100px',
            fontSize: isMobile ? '12px' : '13px', fontWeight: '600', color: '#9CA3AF', cursor: 'pointer',
            whiteSpace: 'nowrap'
        },
        toggleActivePresent: {
            flex: isMobile ? 1 : 'none',
            backgroundColor: '#FFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            padding: isMobile ? '10px 8px' : '8px 18px', borderRadius: isMobile ? '6px' : '100px',
            fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: '#10B981', border: 'none', cursor: 'pointer'
        },
        toggleActiveAbsent: {
            flex: isMobile ? 1 : 'none',
            backgroundColor: '#FFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '10px 8px' : '8px 18px', borderRadius: isMobile ? '6px' : '100px',
            fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: '#EF4444', border: 'none', cursor: 'pointer'
        },
        toggleActiveLate: {
            flex: isMobile ? 1 : 'none',
            backgroundColor: '#FFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '10px 8px' : '8px 18px', borderRadius: isMobile ? '6px' : '100px',
            fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: '#F59E0B', border: 'none', cursor: 'pointer'
        },

        remarksCell: { flex: 1 },
        remarkInput: {
            width: '100%', border: isMobile ? '1px solid #E5E7EB' : 'none', 
            background: isMobile ? '#FAFBFC' : 'transparent',
            padding: isMobile ? '8px 12px' : '0', borderRadius: isMobile ? '6px' : '0',
            fontSize: '14px', color: '#9CA3AF', outline: 'none'
        },
        remarkInputActive: {
            width: '100%', border: isMobile ? '1px solid #E5E7EB' : 'none', 
            background: isMobile ? '#FAFBFC' : 'transparent',
            padding: isMobile ? '8px 12px' : '0', borderRadius: isMobile ? '6px' : '0',
            fontSize: '14px', color: '#4B5563', outline: 'none'
        },

        footer: { 
            marginTop: '32px', 
            display: 'flex', 
            flexDirection: isMobile ? 'column-reverse' : 'row',
            justifyContent: 'flex-end', 
            alignItems: isMobile ? 'stretch' : 'center', 
            gap: isMobile ? '16px' : '32px',
            paddingBottom: isMobile ? '24px' : '0'
        },
        btnText: { background: 'none', border: 'none', fontWeight: '600', color: '#6B7280', fontSize: '14px', cursor: 'pointer', textAlign: 'center' },
        btnPrimary: {
            padding: '12px 28px', borderRadius: '10px',
            backgroundColor: '#2563EB', color: '#FFF', fontWeight: '700',
            fontSize: '15px', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)',
        }
    };

    return (
        <div style={styles.container}>
            {error && (
                <div style={styles.errorBanner}>
                    <span>{error}</span>
                    <button onClick={() => setError('')} style={styles.errorClose}>×</button>
                </div>
            )}

            <div style={styles.card}>
                <div style={styles.filterGrid}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Venue / Class</label>
                        <div style={styles.selectWrapper}>
                            <select
                                style={styles.select}
                                value={selectedVenue?.venloc_id || ''}
                                onChange={e =>
                                    setSelectedVenue(venues.find(v => v.venloc_id === parseInt(e.target.value)))
                                }
                                disabled={loading}
                            >
                                {venues.map(v => (
                                    <option key={v.venloc_id} value={v.venloc_id}>{v.venue_name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} style={styles.chevron} />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Date</label>
                        <div style={styles.selectWrapper}>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={styles.select}
                            />
                            <Calendar size={16} style={styles.calendarIcon} />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Time Slot</label>
                        <div style={styles.selectWrapper}>
                            <select
                                style={styles.select}
                                value={timeSlot}
                                onChange={(e) => handleTimeSlotChange(e.target.value)}
                            >
                                {TIME_SLOTS.map(slot => (
                                    <option key={slot}>{slot}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} style={styles.chevron} />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Faculty</label>
                        <input
                            type="text"
                            value={user?.name || ''}
                            readOnly
                            style={styles.selectDisabled}
                        />
                    </div>
                </div>

                <div style={styles.statsStrip}>
                    <div style={styles.statItem}>
                        <span style={styles.statLabel}>Total Students</span>
                        <span style={styles.statValueBlack}>{stats.total}</span>
                    </div>
                    <div style={styles.statItem}>
                        <span style={styles.statLabel}>Present</span>
                        <span style={styles.statValueGreen}>{stats.present}</span>
                    </div>
                    <div style={styles.statItem}>
                        <span style={styles.statLabel}>Absent</span>
                        <span style={styles.statValueRed}>{stats.absent}</span>
                    </div>
                    <div style={styles.statItem}>
                        <span style={styles.statLabel}>Late</span>
                        <span style={styles.statValueOrange}>{stats.late}</span>
                    </div>
                </div>
            </div>

            <div style={{ ...styles.card, marginTop: '24px', padding: 0 }}>
                <div style={styles.tableToolbar}>
                    <div style={styles.searchBox}>
                        <Search size={16} style={styles.searchIcon} />
                        <input
                            style={styles.searchInput}
                            placeholder="Search student..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button style={styles.btnSecondary} onClick={markAllPresent}>
                        Mark All Present
                    </button>
                </div>

                {loading ? (
                    <div style={styles.loading}>Loading students...</div>
                ) : (
                    <div style={styles.table}>
                        <div style={styles.thRow}>
                            <div style={{ ...styles.th, flex: 1.2 }}>Student</div>
                            <div style={{ ...styles.th, flex: 1.4 }}>Status</div>
                            <div style={{ ...styles.th, flex: 1 }}>Remarks</div>
                        </div>

                        {filteredStudents.map(s => (
                            <div key={s.id} style={styles.tr}>
                                <div style={styles.studentCell}>
                                    <div style={{ ...styles.avatar, backgroundColor: s.avatarColor || '#E5E7EB' }}>
                                        {s.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div style={styles.studentName}>{s.name}</div>
                                        <div style={styles.studentId}>{s.id}</div>
                                    </div>
                                </div>

                                <div style={styles.statusCell}>
                                    <div style={styles.toggleGroup}>
                                        <button
                                            style={s.status === 'present' ? styles.toggleActivePresent : styles.toggleBtn}
                                            onClick={() => updateStatus(s.id, 'present')}
                                        >
                                            <CheckCircle2 size={14} style={{ marginRight: isMobile ? '4px' : '6px' }} /> Present
                                        </button>
                                        <button
                                            style={s.status === 'absent' ? styles.toggleActiveAbsent : styles.toggleBtn}
                                            onClick={() => updateStatus(s.id, 'absent')}
                                        >
                                            <XCircle size={14} style={{ marginRight: isMobile ? '4px' : '6px' }} /> Absent
                                        </button>
                                        <button
                                            style={s.status === 'late' ? styles.toggleActiveLate : styles.toggleBtn}
                                            onClick={() => updateStatus(s.id, 'late')}
                                        >
                                            <Clock size={14} style={{ marginRight: isMobile ? '4px' : '6px' }} /> Late
                                        </button>
                                    </div>
                                </div>

                                <div style={styles.remarksCell}>
                                    <input
                                        style={s.remarks ? styles.remarkInputActive : styles.remarkInput}
                                        placeholder="Add remark..."
                                        value={s.remarks || ''}
                                        onChange={e => updateRemark(s.id, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={styles.footer}>
                <button style={styles.btnText}>Cancel</button>
                <button 
                    style={styles.btnPrimary} 
                    onClick={saveAttendance}
                    disabled={loading || students.filter(s => s.status).length === 0}
                >
                    <Save size={18} style={{ marginRight: '8px' }} />
                    {loading ? 'Saving...' : 'Save Attendance'}
                </button>
            </div>
        </div>
    );
};

export default AttendanceManagement;
// import React, { useState, useMemo, useEffect } from 'react';
// import {
//     Search,
//     CheckCircle2,
//     XCircle,
//     Clock,
//     Save,
//     Calendar,
//     ChevronDown
// } from 'lucide-react';
// import useAuthStore from '../../../store/useAuthStore';

// const AttendanceManagement = () => {
//     const { token, user } = useAuthStore();
//     const API_URL = import.meta.env.VITE_API_URL;

//     // --- Responsive Logic ---
//     const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//     const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 768);
//             setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
//         };
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     const [venues, setVenues] = useState([]);
//     const [selectedVenue, setSelectedVenue] = useState(null);
//     const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
//     const [timeSlot, setTimeSlot] = useState('09:00 AM - 10:30 AM');
//     const [students, setStudents] = useState([]);
//     const [search, setSearch] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [sessionId, setSessionId] = useState(null);

//     const TIME_SLOTS = [
//         '09:00 AM - 10:30 AM',
//         '10:30 AM - 12:30 PM',
//         '01:30 PM - 03:00 PM',
//         '03:00 PM - 04:30 PM'
//     ];

//     const fetchVenues = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(`${API_URL}/attendance/venues/${user.faculty_id}`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             const data = await response.json();
//             if (data.success && data.data.length > 0) {
//                 setVenues(data.data);
//                 setSelectedVenue(data.data[0]);
//             } else {
//                 setError('No venue allocations found');
//             }
//         } catch (err) {
//             setError('Failed to fetch venues');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchStudents = async () => {
//         if (!selectedVenue) return;
//         setLoading(true);
//         try {
//             const response = await fetch(
//                 `${API_URL}/attendance/students/${selectedVenue.venue_id}/${user.faculty_id}`,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );
//             const data = await response.json();
//             if (data.success) {
//                 setStudents(data.data);
//             } else {
//                 setError(data.message || 'Failed to fetch students');
//             }
//         } catch (err) {
//             setError('Failed to fetch students');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const initializeSession = async () => {
//         if (!selectedVenue) return;
//         try {
//             const response = await fetch(`${API_URL}/attendance/session`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     sessionName: selectedVenue.venue_name,
//                     date,
//                     timeSlot
//                 })
//             });
//             const data = await response.json();
//             if (data.success) {
//                 setSessionId(data.data.session_id);
//             }
//         } catch (err) {
//             console.error('Error initializing session:', err);
//         }
//     };

//     useEffect(() => {
//         if (token && user) fetchVenues();
//     }, [token, user]);

//     useEffect(() => {
//         if (selectedVenue) {
//             fetchStudents();
//             initializeSession();
//         }
//     }, [selectedVenue, date, timeSlot]);

//     const filteredStudents = useMemo(() => {
//         return students.filter(
//             s =>
//                 s.name.toLowerCase().includes(search.toLowerCase()) ||
//                 s.id.toLowerCase().includes(search.toLowerCase())
//         );
//     }, [students, search]);

//     const stats = useMemo(() => ({
//         total: students.length,
//         present: students.filter(s => s.status === 'present').length,
//         absent: students.filter(s => s.status === 'absent').length,
//         late: students.filter(s => s.status === 'late').length
//     }), [students]);

//     const updateStatus = (id, status) => {
//         setStudents(prev =>
//             prev.map(s => (s.id === id ? { ...s, status } : s))
//         );
//     };

//     const updateRemark = (id, value) => {
//         setStudents(prev =>
//             prev.map(s => (s.id === id ? { ...s, remarks: value } : s))
//         );
//     };

//     const markAllPresent = () => {
//         setStudents(prev =>
//             prev.map(s => ({ ...s, status: 'present' }))
//         );
//     };

//     const handleTimeSlotChange = (slot) => {
//         setTimeSlot(slot);
//         setStudents(prev =>
//             prev.map(s => ({ ...s, status: '', remarks: '' }))
//         );
//     };

//     const saveAttendance = async () => {
//         if (!sessionId) {
//             alert('Session not initialized');
//             return;
//         }
//         setLoading(true);
//         setError('');
//         try {
//             const response = await fetch(`${API_URL}/attendance/save`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     facultyId: user.faculty_id,
//                     venueId: selectedVenue.venue_id,
//                     sessionId: sessionId,
//                     date,
//                     timeSlot,
//                     attendance: students.map(s => ({
//                         student_id: s.student_id,
//                         status: s.status,
//                         remarks: s.remarks
//                     }))
//                 })
//             });
//             const data = await response.json();
//             if (data.success) {
//                 alert('Attendance saved successfully!');
//                 setStudents(prev =>
//                     prev.map(s => ({ ...s, status: '', remarks: '' }))
//                 );
//             } else {
//                 setError(data.message || 'Failed to save attendance');
//             }
//         } catch (err) {
//             setError('Failed to save attendance');
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ---------------- DYNAMIC STYLES ---------------- */
//     const styles = {
//         container: {
//             backgroundColor: '#F9FAFB',
//             minHeight: '100vh',
//             fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//         },
//         errorBanner: {
//             backgroundColor: '#FEE2E2',
//             color: '#991B1B',
//             padding: '12px 16px',
//             borderRadius: '8px',
//             marginBottom: '20px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             fontSize: isMobile ? '12px' : '14px'
//         },
//         errorClose: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#991B1B' },
//         loading: { textAlign: 'center', padding: '40px', color: '#6B7280', fontSize: '16px' },
//         card: {
//             backgroundColor: '#FFFFFF',
//             borderRadius: '12px',
//             border: '1px solid #E5E7EB',
//             boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
//             padding: isMobile ? '16px' : '24px',
//         },
//         filterGrid: {
//             display: 'grid',
//             gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(4, 1fr)',
//             gap: isMobile ? '12px' : '20px',
//             paddingBottom: '24px',
//             borderBottom: '1px solid #F3F4F6',
//         },
//         inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
//         label: { fontSize: '12px', fontWeight: '600', color: '#9CA3AF' },
//         selectWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
//         select: {
//             width: '100%',
//             padding: '12px',
//             backgroundColor: '#F9FAFB',
//             border: '1px solid #E5E7EB',
//             borderRadius: '8px',
//             fontSize: '14px',
//             color: '#1F2937',
//             appearance: 'none',
//             outline: 'none',
//         },
//         selectDisabled: {
//             width: '100%',
//             padding: '12px',
//             backgroundColor: '#F3F4F6',
//             border: '1px solid #E5E7EB',
//             borderRadius: '8px',
//             fontSize: '14px',
//             color: '#6B7280',
//             outline: 'none',
//         },
//         chevron: { position: 'absolute', right: '12px', color: '#9CA3AF', pointerEvents: 'none' },
//         calendarIcon: { position: 'absolute', right: '12px', color: '#374151', pointerEvents: 'none' },

//         statsStrip: { 
//             display: 'flex', 
//             gap: isMobile ? '20px' : '48px', 
//             marginTop: '24px', 
//             flexWrap: 'wrap',
//             justifyContent: isMobile ? 'space-between' : 'flex-start'
//         },
//         statItem: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: isMobile ? '40%' : 'auto' },
//         statLabel: { fontSize: '12px', color: '#9CA3AF', fontWeight: '500' },
//         statValueBlack: { fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#111827' },
//         statValueGreen: { fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#10B981' },
//         statValueRed: { fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#EF4444' },
//         statValueOrange: { fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#F59E0B' },

//         tableToolbar: {
//             padding: isMobile ? '16px' : '24px',
//             display: 'flex',
//             flexDirection: isMobile ? 'column' : 'row',
//             justifyContent: 'space-between',
//             alignItems: isMobile ? 'stretch' : 'center',
//             borderBottom: '1px solid #F3F4F6',
//             gap: '16px'
//         },
//         searchBox: { position: 'relative', display: 'flex', alignItems: 'center', width: isMobile ? '100%' : '280px' },
//         searchIcon: { position: 'absolute', left: '12px', color: '#9CA3AF' },
//         searchInput: {
//             width: '100%',
//             padding: '10px 12px 10px 40px',
//             border: '1px solid #E5E7EB',
//             borderRadius: '8px',
//             fontSize: '14px',
//             backgroundColor: '#FAFBFC',
//             outline: 'none',
//         },
//         btnSecondary: {
//             padding: '10px 18px',
//             borderRadius: '8px',
//             border: '1px solid #E5E7EB',
//             backgroundColor: '#FFF',
//             color: '#374151',
//             fontWeight: '600',
//             fontSize: '14px',
//             cursor: 'pointer',
//             textAlign: 'center'
//         },

//         table: { display: 'flex', flexDirection: 'column' },
//         thRow: {
//             display: isMobile ? 'none' : 'flex',
//             padding: '12px 24px',
//             backgroundColor: '#FAFBFC',
//             borderBottom: '1px solid #F3F4F6',
//         },
//         th: { fontSize: '13px', fontWeight: '600', color: '#9CA3AF' },
//         tr: {
//             display: 'flex',
//             flexDirection: isMobile ? 'column' : 'row',
//             padding: isMobile ? '16px' : '18px 24px',
//             alignItems: isMobile ? 'stretch' : 'center',
//             borderBottom: '1px solid #F3F4F6',
//             gap: isMobile ? '16px' : '0'
//         },
//         studentCell: { flex: 1.2, display: 'flex', alignItems: 'center', gap: '14px' },
//         avatar: {
//             width: '36px', height: '36px', borderRadius: '50%',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             color: '#4B5563', fontSize: '12px', fontWeight: '600',
//         },
//         studentName: { fontSize: '14px', fontWeight: '600', color: '#111827' },
//         studentId: { fontSize: '12px', color: '#9CA3AF', marginTop: '2px' },

//         statusCell: { flex: 1.4, overflowX: isMobile ? 'auto' : 'visible' },
//         toggleGroup: {
//             display: 'flex',
//             backgroundColor: '#F3F4F6',
//             borderRadius: isMobile ? '8px' : '100px',
//             padding: '3px',
//             width: isMobile ? '100%' : 'fit-content',
//         },
//         toggleBtn: {
//             flex: isMobile ? 1 : 'none',
//             border: 'none', backgroundColor: 'transparent',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             padding: isMobile ? '10px 8px' : '8px 18px', borderRadius: isMobile ? '6px' : '100px',
//             fontSize: isMobile ? '12px' : '13px', fontWeight: '600', color: '#9CA3AF', cursor: 'pointer',
//             whiteSpace: 'nowrap'
//         },
//         toggleActivePresent: {
//             flex: isMobile ? 1 : 'none',
//             backgroundColor: '#FFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center', 
//             padding: isMobile ? '10px 8px' : '8px 18px', borderRadius: isMobile ? '6px' : '100px',
//             fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: '#10B981', border: 'none', cursor: 'pointer'
//         },
//         toggleActiveAbsent: {
//             flex: isMobile ? 1 : 'none',
//             backgroundColor: '#FFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             padding: isMobile ? '10px 8px' : '8px 18px', borderRadius: isMobile ? '6px' : '100px',
//             fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: '#EF4444', border: 'none', cursor: 'pointer'
//         },
//         toggleActiveLate: {
//             flex: isMobile ? 1 : 'none',
//             backgroundColor: '#FFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             padding: isMobile ? '10px 8px' : '8px 18px', borderRadius: isMobile ? '6px' : '100px',
//             fontSize: isMobile ? '12px' : '13px', fontWeight: '700', color: '#F59E0B', border: 'none', cursor: 'pointer'
//         },

//         remarksCell: { flex: 1 },
//         remarkInput: {
//             width: '100%', border: isMobile ? '1px solid #E5E7EB' : 'none', 
//             background: isMobile ? '#FAFBFC' : 'transparent',
//             padding: isMobile ? '8px 12px' : '0', borderRadius: isMobile ? '6px' : '0',
//             fontSize: '14px', color: '#9CA3AF', outline: 'none'
//         },
//         remarkInputActive: {
//             width: '100%', border: isMobile ? '1px solid #E5E7EB' : 'none', 
//             background: isMobile ? '#FAFBFC' : 'transparent',
//             padding: isMobile ? '8px 12px' : '0', borderRadius: isMobile ? '6px' : '0',
//             fontSize: '14px', color: '#4B5563', outline: 'none'
//         },

//         footer: { 
//             marginTop: '32px', 
//             display: 'flex', 
//             flexDirection: isMobile ? 'column-reverse' : 'row',
//             justifyContent: 'flex-end', 
//             alignItems: isMobile ? 'stretch' : 'center', 
//             gap: isMobile ? '16px' : '32px',
//             paddingBottom: isMobile ? '24px' : '0'
//         },
//         btnText: { background: 'none', border: 'none', fontWeight: '600', color: '#6B7280', fontSize: '14px', cursor: 'pointer', textAlign: 'center' },
//         btnPrimary: {
//             padding: '12px 28px', borderRadius: '10px',
//             backgroundColor: '#2563EB', color: '#FFF', fontWeight: '700',
//             fontSize: '15px', border: 'none', cursor: 'pointer',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)',
//         }
//     };

//     return (
//         <div style={styles.container}>
//             {error && (
//                 <div style={styles.errorBanner}>
//                     <span>{error}</span>
//                     <button onClick={() => setError('')} style={styles.errorClose}>×</button>
//                 </div>
//             )}

//             <div style={styles.card}>
//                 <div style={styles.filterGrid}>
//                     <div style={styles.inputGroup}>
//                         <label style={styles.label}>Venue / Class</label>
//                         <div style={styles.selectWrapper}>
//                             <select
//                                 style={styles.select}
//                                 value={selectedVenue?.venloc_id || ''}
//                                 onChange={e =>
//                                     setSelectedVenue(venues.find(v => v.venloc_id === parseInt(e.target.value)))
//                                 }
//                                 disabled={loading}
//                             >
//                                 {venues.map(v => (
//                                     <option key={v.venloc_id} value={v.venloc_id}>{v.venue_name}</option>
//                                 ))}
//                             </select>
//                             <ChevronDown size={16} style={styles.chevron} />
//                         </div>
//                     </div>

//                     <div style={styles.inputGroup}>
//                         <label style={styles.label}>Date</label>
//                         <div style={styles.selectWrapper}>
//                             <input
//                                 type="date"
//                                 value={date}
//                                 onChange={(e) => setDate(e.target.value)}
//                                 style={styles.select}
//                             />
//                             <Calendar size={16} style={styles.calendarIcon} />
//                         </div>
//                     </div>

//                     <div style={styles.inputGroup}>
//                         <label style={styles.label}>Time Slot</label>
//                         <div style={styles.selectWrapper}>
//                             <select
//                                 style={styles.select}
//                                 value={timeSlot}
//                                 onChange={(e) => handleTimeSlotChange(e.target.value)}
//                             >
//                                 {TIME_SLOTS.map(slot => (
//                                     <option key={slot}>{slot}</option>
//                                 ))}
//                             </select>
//                             <ChevronDown size={16} style={styles.chevron} />
//                         </div>
//                     </div>

//                     <div style={styles.inputGroup}>
//                         <label style={styles.label}>Faculty</label>
//                         <input
//                             type="text"
//                             value={user?.name || ''}
//                             readOnly
//                             style={styles.selectDisabled}
//                         />
//                     </div>
//                 </div>

//                 <div style={styles.statsStrip}>
//                     <div style={styles.statItem}>
//                         <span style={styles.statLabel}>Total Students</span>
//                         <span style={styles.statValueBlack}>{stats.total}</span>
//                     </div>
//                     <div style={styles.statItem}>
//                         <span style={styles.statLabel}>Present</span>
//                         <span style={styles.statValueGreen}>{stats.present}</span>
//                     </div>
//                     <div style={styles.statItem}>
//                         <span style={styles.statLabel}>Absent</span>
//                         <span style={styles.statValueRed}>{stats.absent}</span>
//                     </div>
//                     <div style={styles.statItem}>
//                         <span style={styles.statLabel}>Late</span>
//                         <span style={styles.statValueOrange}>{stats.late}</span>
//                     </div>
//                 </div>
//             </div>

//             <div style={{ ...styles.card, marginTop: '24px', padding: 0 }}>
//                 <div style={styles.tableToolbar}>
//                     <div style={styles.searchBox}>
//                         <Search size={16} style={styles.searchIcon} />
//                         <input
//                             style={styles.searchInput}
//                             placeholder="Search student..."
//                             value={search}
//                             onChange={e => setSearch(e.target.value)}
//                         />
//                     </div>
//                     <button style={styles.btnSecondary} onClick={markAllPresent}>
//                         Mark All Present
//                     </button>
//                 </div>

//                 {loading ? (
//                     <div style={styles.loading}>Loading students...</div>
//                 ) : (
//                     <div style={styles.table}>
//                         <div style={styles.thRow}>
//                             <div style={{ ...styles.th, flex: 1.2 }}>Student</div>
//                             <div style={{ ...styles.th, flex: 1.4 }}>Status</div>
//                             <div style={{ ...styles.th, flex: 1 }}>Remarks</div>
//                         </div>

//                         {filteredStudents.map(s => (
//                             <div key={s.id} style={styles.tr}>
//                                 <div style={styles.studentCell}>
//                                     <div style={{ ...styles.avatar, backgroundColor: s.avatarColor || '#E5E7EB' }}>
//                                         {s.name.split(' ').map(n => n[0]).join('')}
//                                     </div>
//                                     <div>
//                                         <div style={styles.studentName}>{s.name}</div>
//                                         <div style={styles.studentId}>{s.id}</div>
//                                     </div>
//                                 </div>

//                                 <div style={styles.statusCell}>
//                                     <div style={styles.toggleGroup}>
//                                         <button
//                                             style={s.status === 'present' ? styles.toggleActivePresent : styles.toggleBtn}
//                                             onClick={() => updateStatus(s.id, 'present')}
//                                         >
//                                             <CheckCircle2 size={14} style={{ marginRight: isMobile ? '4px' : '6px' }} /> Present
//                                         </button>
//                                         <button
//                                             style={s.status === 'absent' ? styles.toggleActiveAbsent : styles.toggleBtn}
//                                             onClick={() => updateStatus(s.id, 'absent')}
//                                         >
//                                             <XCircle size={14} style={{ marginRight: isMobile ? '4px' : '6px' }} /> Absent
//                                         </button>
//                                         <button
//                                             style={s.status === 'late' ? styles.toggleActiveLate : styles.toggleBtn}
//                                             onClick={() => updateStatus(s.id, 'late')}
//                                         >
//                                             <Clock size={14} style={{ marginRight: isMobile ? '4px' : '6px' }} /> Late
//                                         </button>
//                                     </div>
//                                 </div>

//                                 <div style={styles.remarksCell}>
//                                     <input
//                                         style={s.remarks ? styles.remarkInputActive : styles.remarkInput}
//                                         placeholder="Add remark..."
//                                         value={s.remarks || ''}
//                                         onChange={e => updateRemark(s.id, e.target.value)}
//                                     />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             <div style={styles.footer}>
//                 <button style={styles.btnText}>Cancel</button>
//                 <button 
//                     style={styles.btnPrimary} 
//                     onClick={saveAttendance}
//                     disabled={loading || students.filter(s => s.status).length === 0}
//                 >
//                     <Save size={18} style={{ marginRight: '8px' }} />
//                     {loading ? 'Saving...' : 'Save Attendance'}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default AttendanceManagement;



import React, { useState, useMemo, useEffect } from 'react';
import {
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    Save,
    Calendar,
    ChevronDown,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore';

const AttendanceManagement = () => {
    const { token, user } = useAuthStore();
    const API_URL = import.meta.env.VITE_API_URL;


    // Responsive state
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

    // State variables
    const [venues, setVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [timeSlot, setTimeSlot] = useState('09:00 AM - 10:30 AM');
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const TIME_SLOTS = [
        '09:00 AM - 10:30 AM',
        '10:30 AM - 12:30 PM',
        '01:30 PM - 03:00 PM',
        '03:00 PM - 04:30 PM'
    ];


    const fetchVenues = async () => {
        if (!user) {
            setError('User information not available. Please login again.');
            return;
        }

        // Determine which ID to use
        const userId = user.user_id || user.id || user.faculty_id || 1;

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/attendance/venues/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.data.length > 0) {
                setVenues(data.data);
                setSelectedVenue(data.data[0]);
                setUserInfo(data.user_info);
            } else {
                setError(data.message || 'No venues found');
            }
        } catch (err) {
            console.error('❌ Error fetching venues:', err);
            setError('Failed to fetch venues. Please check connection.');
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        if (!selectedVenue) {
            setError('Please select a venue first');
            return;
        }

        
        setLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/attendance/students/${selectedVenue.venue_id}`,
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
            console.error('❌ Error fetching students:', err);
            setError('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const initializeSession = async () => {
        if (!selectedVenue || !user) return;
        
        try {
            const sessionData = {
                sessionName: `${selectedVenue.venue_name}_${user.name || 'User'}_${date}`,
                date,
                timeSlot
            };
            
            
            
            const response = await fetch(`${API_URL}/attendance/session`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sessionData)
            });
            
            const data = await response.json();
            
            
            if (data.success) {
                setSessionId(data.data.session_id);
               
            }
        } catch (err) {
            console.error(' Error initializing session:', err);
        }
    };

    const saveAttendance = async () => {
       
        
        // Validations
        if (!sessionId) {
            alert('Session not initialized. Please try again.');
            return;
        }
        
        const markedStudents = students.filter(s => s.status);
        if (markedStudents.length === 0) {
            alert('Please mark attendance for at least one student');
            return;
        }
        
        if (!selectedVenue) {
            alert('Please select a venue');
            return;
        }

        // Determine user ID to send
        const userId = user?.user_id || user?.id || user?.faculty_id || 1;

        const attendanceData = {
            facultyId: userId,
            venueId: selectedVenue.venue_id,
            sessionId: sessionId,
            date,
            timeSlot,
            attendance: markedStudents.map(s => ({
                student_id: s.student_id,
                status: s.status,
                remarks: s.remarks || null
            }))
        };


        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            
            const response = await fetch(`${API_URL}/attendance/save`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(attendanceData)
            });

           
            
            const responseText = await response.text();
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error(' Failed to parse JSON:', responseText);
                throw new Error('Invalid server response');
            }
            
            if (data.success) {
               
                setSuccess(`Attendance saved successfully! (${data.data?.total || markedStudents.length} students)`);
                
                // Clear marked status
                setStudents(prev => prev.map(s => ({ ...s, status: '', remarks: '' })));
                
                // Show success for 5 seconds
                setTimeout(() => setSuccess(''), 5000);
            } else {
                console.error(' Save failed:', data);
                setError(data.message || 'Failed to save attendance');
            }
        } catch (err) {
            console.error(' Error saving attendance:', err);
            setError('Failed to save attendance: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ====================== EVENT HANDLERS ======================
    const updateStatus = (id, status) => {
        setStudents(prev =>
            prev.map(s => (s.id === id ? { ...s, status, remarks: '' } : s))
        );
    };

    const updateRemark = (id, value) => {
        setStudents(prev =>
            prev.map(s => (s.id === id ? { ...s, remarks: value } : s))
        );
    };

    const markAllPresent = () => {
        setStudents(prev =>
            prev.map(s => ({ 
                ...s, 
                status: 'present',
                remarks: '' 
            }))
        );
    };

    const clearAllAttendance = () => {
        setStudents(prev =>
            prev.map(s => ({ 
                ...s, 
                status: '', 
                remarks: '' 
            }))
        );
    };

    const handleTimeSlotChange = (slot) => {
        setTimeSlot(slot);
        // Reset attendance when time slot changes
        setStudents(prev => prev.map(s => ({ ...s, status: '', remarks: '' })));
    };

    const handleVenueChange = (venueId) => {
        const venue = venues.find(v => v.venue_id === parseInt(venueId));
        setSelectedVenue(venue);
    };

    // ====================== USE EFFECTS ======================
    useEffect(() => {
        if (token && user) {
            fetchVenues();
        }
    }, [token, user]);

    useEffect(() => {
        if (selectedVenue) {
            fetchStudents();
            initializeSession();
        }
    }, [selectedVenue, date, timeSlot]);

    // ====================== COMPUTED VALUES ======================
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
        late: students.filter(s => s.status === 'late').length,
        marked: students.filter(s => s.status).length
    }), [students]);

    // ====================== STYLES ======================
    const styles = {
        container: {
            backgroundColor: '#F9FAFB',
            minHeight: '100vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: isMobile ? '16px' : '24px',
        },
        header: {
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '16px'
        },
        titleSection: {
            flex: 1
        },
        title: {
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px',
        },
        subtitle: {
            fontSize: '14px',
            color: '#6B7280',
        },
        alertBanner: {
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: isMobile ? '12px' : '14px'
        },
        errorBanner: {
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #FECACA',
        },
        successBanner: {
            backgroundColor: '#D1FAE5',
            color: '#065F46',
            border: '1px solid #A7F3D0',
        },
        alertClose: { 
            background: 'none', 
            border: 'none', 
            fontSize: '20px', 
            cursor: 'pointer', 
            color: 'inherit',
            padding: '0 0 0 12px'
        },
        loading: { 
            textAlign: 'center', 
            padding: '40px', 
            color: '#6B7280', 
            fontSize: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
        },
        card: {
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            padding: isMobile ? '16px' : '24px',
            marginBottom: '24px',
        },
        filterGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '12px' : '20px',
            paddingBottom: '24px',
            borderBottom: '1px solid #F3F4F6',
        },
        inputGroup: { 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px' 
        },
        label: { 
            fontSize: '12px', 
            fontWeight: '600', 
            color: '#9CA3AF',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        selectWrapper: { 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center' 
        },
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
            cursor: 'pointer',
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
        chevron: { 
            position: 'absolute', 
            right: '12px', 
            color: '#9CA3AF', 
            pointerEvents: 'none' 
        },
        calendarIcon: { 
            position: 'absolute', 
            right: '12px', 
            color: '#374151', 
            pointerEvents: 'none' 
        },
        statsStrip: { 
            display: 'flex', 
            gap: isMobile ? '16px' : '32px', 
            marginTop: '24px', 
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'space-between' : 'flex-start'
        },
        statItem: { 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '4px', 
            minWidth: isMobile ? '45%' : 'auto' 
        },
        statLabel: { 
            fontSize: '12px', 
            color: '#9CA3AF', 
            fontWeight: '500' 
        },
        statValue: { 
            fontSize: isMobile ? '20px' : '24px', 
            fontWeight: '700',
        },
        statValueBlack: { color: '#111827' },
        statValueGreen: { color: '#10B981' },
        statValueRed: { color: '#EF4444' },
        statValueOrange: { color: '#F59E0B' },
        statValueBlue: { color: '#3B82F6' },

        tableToolbar: {
            padding: isMobile ? '16px' : '24px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            borderBottom: '1px solid #F3F4F6',
            gap: '16px'
        },
        searchBox: { 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center', 
            width: isMobile ? '100%' : '280px' 
        },
        searchIcon: { 
            position: 'absolute', 
            left: '12px', 
            color: '#9CA3AF' 
        },
        searchInput: {
            width: '100%',
            padding: '10px 12px 10px 40px',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#FAFBFC',
            outline: 'none',
        },
        toolbarButtons: {
            display: 'flex',
            gap: '12px',
            width: isMobile ? '100%' : 'auto',
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
            textAlign: 'center',
            flex: isMobile ? 1 : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        },
        btnClear: {
            padding: '10px 18px',
            borderRadius: '8px',
            border: '1px solid #DC2626',
            backgroundColor: '#FFF',
            color: '#DC2626',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'center',
            flex: isMobile ? 1 : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        },

        table: { 
            display: 'flex', 
            flexDirection: 'column' 
        },
        thRow: {
            display: isMobile ? 'none' : 'flex',
            padding: '12px 24px',
            backgroundColor: '#FAFBFC',
            borderBottom: '1px solid #F3F4F6',
        },
        th: { 
            fontSize: '13px', 
            fontWeight: '600', 
            color: '#9CA3AF' 
        },
        tr: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            padding: isMobile ? '16px' : '18px 24px',
            alignItems: isMobile ? 'stretch' : 'center',
            borderBottom: '1px solid #F3F4F6',
            gap: isMobile ? '16px' : '0',
            backgroundColor: '#FFFFFF',
            transition: 'background-color 0.2s'
        },
        studentCell: { 
            flex: 1.2, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px' 
        },
        avatar: {
            width: '36px', 
            height: '36px', 
            borderRadius: '50%',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#4B5563', 
            fontSize: '12px', 
            fontWeight: '600',
            flexShrink: 0
        },
        studentInfo: {
            flex: 1,
            minWidth: 0 // For text truncation
        },
        studentName: { 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '2px'
        },
        studentId: { 
            fontSize: '12px', 
            color: '#9CA3AF',
        },
        studentDetails: {
            fontSize: '11px',
            color: '#6B7280',
            marginTop: '2px'
        },

        statusCell: { 
            flex: 1.4,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        toggleGroup: {
            display: 'flex',
            backgroundColor: '#F3F4F6',
            borderRadius: isMobile ? '8px' : '100px',
            padding: '3px',
            width: isMobile ? '100%' : 'fit-content',
        },
        toggleBtn: {
            flex: isMobile ? 1 : 'none',
            border: 'none', 
            backgroundColor: 'transparent',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: isMobile ? '10px 8px' : '8px 18px', 
            borderRadius: isMobile ? '6px' : '100px',
            fontSize: isMobile ? '12px' : '13px', 
            fontWeight: '600', 
            color: '#9CA3AF', 
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
        },
        toggleActivePresent: {
            flex: isMobile ? 1 : 'none',
            backgroundColor: '#FFF', 
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: isMobile ? '10px 8px' : '8px 18px', 
            borderRadius: isMobile ? '6px' : '100px',
            fontSize: isMobile ? '12px' : '13px', 
            fontWeight: '700', 
            color: '#10B981', 
            border: 'none', 
            cursor: 'pointer'
        },
        toggleActiveAbsent: {
            flex: isMobile ? 1 : 'none',
            backgroundColor: '#FFF', 
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: isMobile ? '10px 8px' : '8px 18px', 
            borderRadius: isMobile ? '6px' : '100px',
            fontSize: isMobile ? '12px' : '13px', 
            fontWeight: '700', 
            color: '#EF4444', 
            border: 'none', 
            cursor: 'pointer'
        },
        toggleActiveLate: {
            flex: isMobile ? 1 : 'none',
            backgroundColor: '#FFF', 
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: isMobile ? '10px 8px' : '8px 18px', 
            borderRadius: isMobile ? '6px' : '100px',
            fontSize: isMobile ? '12px' : '13px', 
            fontWeight: '700', 
            color: '#F59E0B', 
            border: 'none', 
            cursor: 'pointer'
        },
        statusIndicator: {
            fontSize: '11px',
            color: '#6B7280',
            fontStyle: 'italic'
        },

       remarksCell: { 
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
},
remarkInput: {
    width: '100%', 
    border: isMobile ? '1px solid #E5E7EB' : '1px solid transparent',
    borderBottom: isMobile ? '1px solid #E5E7EB' : '1px solid transparent',
    background: isMobile ? '#FAFBFC' : 'transparent',
    padding: isMobile ? '8px 12px' : '0', 
    borderRadius: isMobile ? '6px' : '0',
    fontSize: '14px', 
    color: '#9CA3AF', 
    outline: 'none',
    transition: 'all 0.2s'
},
remarkInputActive: {
    width: '100%', 
    border: isMobile ? '1px solid #E5E7EB' : '1px solid transparent',
    borderBottom: isMobile ? '1px solid #E5E7EB' : '1px solid #E5E7EB',
    background: isMobile ? '#FAFBFC' : 'transparent',
    padding: isMobile ? '8px 12px' : '0', 
    borderRadius: isMobile ? '6px' : '0',
    fontSize: '14px', 
    color: '#4B5563', 
    outline: 'none'
},
        remarkLabel: {
            fontSize: '11px',
            color: '#9CA3AF',
            fontStyle: 'italic'
        },

        footer: { 
            marginTop: '32px', 
            display: 'flex', 
            flexDirection: isMobile ? 'column-reverse' : 'row',
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'stretch' : 'center', 
            gap: isMobile ? '16px' : '32px',
            paddingBottom: isMobile ? '24px' : '0'
        },
        footerInfo: {
            fontSize: '13px',
            color: '#6B7280',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        },
        btnCancel: { 
            background: 'none', 
            border: 'none', 
            fontWeight: '600', 
            color: '#6B7280', 
            fontSize: '14px', 
            cursor: 'pointer', 
            textAlign: 'center',
            padding: isMobile ? '12px' : '0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        btnPrimary: {
            padding: '12px 28px', 
            borderRadius: '10px',
            backgroundColor: '#2563EB', 
            color: '#FFF', 
            fontWeight: '700',
            fontSize: '15px', 
            border: 'none', 
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)',
            opacity: (loading || stats.marked === 0) ? 0.5 : 1,
            pointerEvents: (loading || stats.marked === 0) ? 'none' : 'auto',
            transition: 'all 0.2s',
            gap: '8px'
        },
        loadingSpinner: {
            display: 'inline-block',
            width: '16px',
            height: '16px',
            border: '2px solid #ffffff',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
        }
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.titleSection}>
                    <h1 style={styles.title}>Attendance Management</h1>
                    <p style={styles.subtitle}>
                        {userInfo ? 
                            `Logged in as ${userInfo.name} (${userInfo.role}${userInfo.designation ? ` - ${userInfo.designation}` : ''})` : 
                            'Mark and manage student attendance'}
                    </p>
                </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div style={{ ...styles.alertBanner, ...styles.errorBanner }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                    <button onClick={() => setError('')} style={styles.alertClose}>×</button>
                </div>
            )}

            {success && (
                <div style={{ ...styles.alertBanner, ...styles.successBanner }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={16} />
                        <span>{success}</span>
                    </div>
                    <button onClick={() => setSuccess('')} style={styles.alertClose}>×</button>
                </div>
            )}

            {/* Filter Card */}
            <div style={styles.card}>
                <div style={styles.filterGrid}>
                    {/* Venue Selection */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            <span>Venue / Class</span>
                        </label>
                        <div style={styles.selectWrapper}>
                            <select
                                style={styles.select}
                                value={selectedVenue?.venue_id || ''}
                                onChange={(e) => handleVenueChange(e.target.value)}
                                disabled={loading || venues.length === 0}
                            >
                                {venues.length === 0 ? (
                                    <option value="">No venues available</option>
                                ) : (
                                    <>
                                        <option value="">Select a venue</option>
                                        {venues.map(v => (
                                            <option key={v.venue_id} value={v.venue_id}>
                                                {v.venue_name} 
                                                {v.assigned_faculty_name && ` (${v.assigned_faculty_name})`}
                                                {v.student_count > 0 && ` - ${v.student_count} students`}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                            <ChevronDown size={16} style={styles.chevron} />
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            <Calendar size={12} />
                            <span>Date</span>
                        </label>
                        <div style={styles.selectWrapper}>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={styles.select}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            <Calendar size={16} style={styles.calendarIcon} />
                        </div>
                    </div>

                    {/* Time Slot Selection */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            <Clock size={12} />
                            <span>Time Slot</span>
                        </label>
                        <div style={styles.selectWrapper}>
                            <select
                                style={styles.select}
                                value={timeSlot}
                                onChange={(e) => handleTimeSlotChange(e.target.value)}
                            >
                                {TIME_SLOTS.map(slot => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} style={styles.chevron} />
                        </div>
                    </div>

                    {/* User Info */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Current User</label>
                        <input
                            type="text"
                            value={userInfo ? 
                                `${userInfo.name} (${userInfo.role})` : 
                                (user?.name ? `${user.name}` : 'Loading...')}
                            readOnly
                            style={styles.selectDisabled}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div style={styles.statsStrip}>
                    <div style={styles.statItem}>
                        <span style={styles.statLabel}>Total Students</span>
                        <span style={{ ...styles.statValue, ...styles.statValueBlack }}>{stats.total}</span>
                    </div>
                    <div style={styles.statItem}>
                        <span style={styles.statLabel}>Present</span>
                        <span style={{ ...styles.statValue, ...styles.statValueGreen }}>{stats.present}</span>
                    </div>
                    <div style={styles.statItem}>
                        <span style={styles.statLabel}>Absent</span>
                        <span style={{ ...styles.statValue, ...styles.statValueRed }}>{stats.absent}</span>
                    </div>
                    <div style={styles.statItem}>
                        <span style={styles.statLabel}>Late</span>
                        <span style={{ ...styles.statValue, ...styles.statValueOrange }}>{stats.late}</span>
                    </div>
                    <div style={styles.statItem}>
                        <span style={styles.statLabel}>Marked</span>
                        <span style={{ ...styles.statValue, ...styles.statValueBlue }}>{stats.marked}</span>
                    </div>
                </div>
            </div>

            {/* Students Table Card */}
            <div style={{ ...styles.card, marginTop: '24px', padding: 0 }}>
                <div style={styles.tableToolbar}>
                    <div style={styles.searchBox}>
                        <Search size={16} style={styles.searchIcon} />
                        <input
                            style={styles.searchInput}
                            placeholder="Search student by name or ID..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div style={styles.toolbarButtons}>
                        <button style={styles.btnClear} onClick={clearAllAttendance}>
                            <XCircle size={14} />
                            Clear All
                        </button>
                        <button style={styles.btnSecondary} onClick={markAllPresent}>
                            <CheckCircle2 size={14} />
                            Mark All Present
                        </button>
                    </div>
                </div>

                {/* Loading/Empty States */}
                {loading && !students.length ? (
                    <div style={styles.loading}>
                        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
                        <div>Loading students...</div>
                    </div>
                ) : students.length === 0 ? (
                    <div style={styles.loading}>
                        <AlertCircle size={24} />
                        <div>{selectedVenue ? 'No students found in this venue' : 'Please select a venue'}</div>
                    </div>
                ) : (
                    <div style={styles.table}>
                        {/* Table Header - Desktop only */}
                        <div style={styles.thRow}>
                            <div style={{ ...styles.th, flex: 1.2 }}>Student</div>
                            <div style={{ ...styles.th, flex: 1.4 }}>Status</div>
                            <div style={{ ...styles.th, flex: 1 }}>Remarks (Optional)</div>
                        </div>

                        {/* Student Rows */}
                        {filteredStudents.map(s => (
                            <div key={s.id} style={{
                                ...styles.tr,
                                backgroundColor: s.status ? (s.status === 'present' ? '#F0F9FF' : 
                                                          s.status === 'absent' ? '#FEF2F2' : 
                                                          '#FFFBEB') : '#FFFFFF'
                            }}>
                                <div style={styles.studentCell}>
                                    <div style={{ ...styles.avatar, backgroundColor: s.avatarColor || '#E5E7EB' }}>
                                        {s.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div style={styles.studentInfo}>
                                        <div style={styles.studentName}>{s.name}</div>
                                        <div style={styles.studentId}>ID: {s.id}</div>
                                        {(isMobile || s.department) && (
                                            <div style={styles.studentDetails}>
                                                {s.department} • {s.group_name}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={styles.statusCell}>
                                    <div style={styles.toggleGroup}>
                                        <button
                                            style={s.status === 'present' ? styles.toggleActivePresent : styles.toggleBtn}
                                            onClick={() => updateStatus(s.id, 'present')}
                                            title="Mark Present"
                                        >
                                            <CheckCircle2 size={14} style={{ marginRight: isMobile ? '4px' : '6px' }} /> 
                                            {isMobile ? 'P' : 'Present'}
                                        </button>
                                        <button
                                            style={s.status === 'absent' ? styles.toggleActiveAbsent : styles.toggleBtn}
                                            onClick={() => updateStatus(s.id, 'absent')}
                                            title="Mark Absent"
                                        >
                                            <XCircle size={14} style={{ marginRight: isMobile ? '4px' : '6px' }} /> 
                                            {isMobile ? 'A' : 'Absent'}
                                        </button>
                                        <button
                                            style={s.status === 'late' ? styles.toggleActiveLate : styles.toggleBtn}
                                            onClick={() => updateStatus(s.id, 'late')}
                                            title="Mark Late"
                                        >
                                            <Clock size={14} style={{ marginRight: isMobile ? '4px' : '6px' }} /> 
                                            {isMobile ? 'L' : 'Late'}
                                        </button>
                                    </div>
                                    {s.status && (
                                        <div style={styles.statusIndicator}>
                                            Marked as <strong>{s.status}</strong>
                                        </div>
                                    )}
                                </div>

                                <div style={styles.remarksCell}>
                                    <input
                                        style={s.remarks || s.status ? styles.remarkInputActive : styles.remarkInput}
                                        placeholder={s.status ? "Add remark (optional)..." : "Mark status first"}
                                        value={s.remarks || ''}
                                        onChange={e => updateRemark(s.id, e.target.value)}
                                        disabled={!s.status}
                                    />
                                    {s.remarks && (
                                        <div style={styles.remarkLabel}>
                                            Remark added
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <div style={styles.footerInfo}>
                    <div>
                        <strong>Session ID:</strong> {sessionId || 'Not initialized'}
                    </div>
                    <div>
                        <strong>Venue:</strong> {selectedVenue?.venue_name || 'None selected'}
                    </div>
                    <div>
                        <strong>Date & Time:</strong> {date} • {timeSlot}
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button style={styles.btnCancel} onClick={clearAllAttendance}>
                        <XCircle size={14} />
                        Clear All
                    </button>
                    <button 
                        style={styles.btnPrimary} 
                        onClick={saveAttendance}
                        disabled={loading || stats.marked === 0}
                        title={stats.marked === 0 ? 'Mark at least one student' : 'Save attendance'}
                    >
                        {loading ? (
                            <>
                                <div style={styles.loadingSpinner}></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Attendance ({stats.marked} marked)
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* CSS Animations */}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    button:disabled {
                        cursor: not-allowed;
                    }
                    
                    select:disabled, input:disabled {
                        cursor: not-allowed;
                        opacity: 0.7;
                    }
                `}
            </style>
        </div>
    );
};

export default AttendanceManagement;
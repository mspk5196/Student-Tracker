// import React, { useState } from 'react';
// import {
//     MapPin,
//     Clock,
//     Calendar,
//     Users,
//     Search,
// } from 'lucide-react';

// const MyClassRoom = () => {
//     // --- MOCK DATA FOR STUDENT CLASSES & VENUES ---
//     const SCHEDULE = [
//         {
//             id: 1,
//             subject: 'React Mastery Workshop',
//             code: 'REACT-101',
//             type: 'Lecture',
//             time: '09:00 AM - 10:30 AM',
//             venue: 'Main Building - Hall A (Room 402)',
//             instructor: 'Prof. Sarah Johnson',
//             status: 'ongoing',
//             link: 'https://zoom.us/j/123456789'
//         },
//         {
//             id: 2,
//             subject: 'HTML & CSS Fundamentals',
//             code: 'WEB-201',
//             type: 'Laboratory',
//             time: '10:45 AM - 12:15 PM',
//             venue: 'IT Block - CS Lab 03',
//             instructor: 'Dr. James Wilson',
//             status: 'upcoming'
//         },
//         {
//             id: 3,
//             subject: 'JavaScript Deep Dive',
//             code: 'JS-301',
//             type: 'Workshop',
//             time: '01:30 PM - 03:00 PM',
//             venue: 'Main Building - Seminar Hall 2',
//             instructor: 'Prof. Michael Chen',
//             status: 'upcoming'
//         }
//     ];

//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [showDatePicker, setShowDatePicker] = useState(false);

//     const filteredSchedule = SCHEDULE.filter(item =>
//         item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.venue.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     // Format date as "Today, October 24, 2024"
//     const formatDate = (date) => {
//         const today = new Date();
//         const yesterday = new Date(today);
//         yesterday.setDate(yesterday.getDate() - 1);
//         const tomorrow = new Date(today);
//         tomorrow.setDate(tomorrow.getDate() + 1);
        
//         let dayString;
//         if (date.toDateString() === today.toDateString()) {
//             dayString = 'Today';
//         } else if (date.toDateString() === yesterday.toDateString()) {
//             dayString = 'Yesterday';
//         } else if (date.toDateString() === tomorrow.toDateString()) {
//             dayString = 'Tomorrow';
//         } else {
//             dayString = date.toLocaleDateString('en-US', { weekday: 'long' });
//         }
        
//         const dateString = date.toLocaleDateString('en-US', {
//             month: 'long',
//             day: 'numeric',
//             year: 'numeric'
//         });
        
//         return `${dayString}, ${dateString}`;
//     };

//     // Handle date selection
//     const handleDateSelect = (date) => {
//         setSelectedDate(date);
//         setShowDatePicker(false);
//     };

//     // Get days in month
//     const getDaysInMonth = (year, month) => {
//         return new Date(year, month + 1, 0).getDate();
//     };

//     // Render date picker
//     const renderDatePicker = () => {
//         const currentYear = selectedDate.getFullYear();
//         const currentMonth = selectedDate.getMonth();
//         const daysInMonth = getDaysInMonth(currentYear, currentMonth);
//         const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        
//         const days = [];
        
//         // Add empty cells for days before the first day of the month
//         for (let i = 0; i < firstDayOfMonth; i++) {
//             days.push(<div key={`empty-${i}`} style={styles.calendarDayEmpty}></div>);
//         }
        
//         // Add days of the month
//         for (let day = 1; day <= daysInMonth; day++) {
//             const date = new Date(currentYear, currentMonth, day);
//             const isSelected = date.toDateString() === selectedDate.toDateString();
//             const isToday = date.toDateString() === new Date().toDateString();
            
//             days.push(
//                 <button
//                     key={`day-${day}`}
//                     style={{
//                         ...styles.calendarDay,
//                         ...(isSelected ? styles.calendarDaySelected : {}),
//                         ...(isToday ? styles.calendarDayToday : {})
//                     }}
//                     onClick={() => handleDateSelect(date)}
//                 >
//                     {day}
//                     {isToday && !isSelected && <div style={styles.todayIndicator} />}
//                 </button>
//             );
//         }
        
//         const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
//             'July', 'August', 'September', 'October', 'November', 'December'];
        
//         const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
//         return (
//             <div style={styles.calendarPopup}>
//                 <div style={styles.calendarHeader}>
//                     <button 
//                         style={styles.calendarNavButton}
//                         onClick={() => {
//                             const newDate = new Date(selectedDate);
//                             newDate.setMonth(newDate.getMonth() - 1);
//                             setSelectedDate(newDate);
//                         }}
//                     >
//                         ‹
//                     </button>
//                     <div style={styles.calendarMonthYear}>
//                         {monthNames[currentMonth]} {currentYear}
//                     </div>
//                     <button 
//                         style={styles.calendarNavButton}
//                         onClick={() => {
//                             const newDate = new Date(selectedDate);
//                             newDate.setMonth(newDate.getMonth() + 1);
//                             setSelectedDate(newDate);
//                         }}
//                     >
//                         ›
//                     </button>
//                 </div>
                
//                 <div style={styles.calendarWeekdays}>
//                     {weekdays.map(day => (
//                         <div key={day} style={styles.calendarWeekday}>
//                             {day}
//                         </div>
//                     ))}
//                 </div>
                
//                 <div style={styles.calendarDays}>
//                     {days}
//                 </div>
                
//                 <div style={styles.calendarActions}>
//                     <button
//                         style={styles.todayButton}
//                         onClick={() => handleDateSelect(new Date())}
//                     >
//                         Today
//                     </button>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div style={styles.container}>
//             {/* Responsive Styles Injection */}
//             <style>{`
//                 @media (max-width: 768px) {
//                     .header-container {
//                         flex-direction: column;
//                         align-items: flex-start !important;
//                         gap: 16px;
//                     }
//                     .section-header {
//                         flex-direction: column;
//                         align-items: flex-start !important;
//                         gap: 12px;
//                     }
//                     .search-box {
//                         width: 100% !important;
//                     }
//                     .timeline-item {
//                         gap: 12px !important;
//                     }
//                     .time-label {
//                         width: 70px !important;
//                         text-align: left !important;
//                     }
//                     .class-card {
//                         flex-direction: column;
//                         align-items: flex-start !important;
//                         gap: 16px;
//                     }
//                     .card-actions {
//                         width: 100%;
//                         border-top: 1px solid #f3f4f6;
//                         padding-top: 12px;
//                     }
//                 }
//             `}</style>

//             {/* Header Section */}
//             <header style={styles.header} className="header-container">
//                 <div style={styles.headerLeft}>
//                     <h1 style={styles.title}>My Classroom</h1>
//                     <p style={styles.subtitle}>View your daily schedule and find your classroom locations</p>
//                 </div>
//                 <div style={styles.dateContainer}>
//                     <button 
//                         style={styles.dateDisplay}
//                         onClick={() => setShowDatePicker(!showDatePicker)}
//                     >
//                         <Calendar size={18} style={{ marginRight: 10 }} />
//                         <span>{formatDate(selectedDate)}</span>
//                     </button>
                    
//                     {showDatePicker && (
//                         <div style={styles.datePickerWrapper}>
//                             {renderDatePicker()}
//                         </div>
//                     )}
//                 </div>
//             </header>

//             <div style={styles.mainLayout}>
//                 {/* Full Width Side: Schedule Timeline */}
//                 <div style={styles.leftCol}>
//                     <div style={styles.sectionHeader} className="section-header">
//                         <h2 style={styles.sectionTitle}>
//                             {selectedDate.toDateString() === new Date().toDateString() 
//                                 ? "Today's Schedule" 
//                                 : `${formatDate(selectedDate)}'s Schedule`}
//                         </h2>
//                         <div style={styles.searchBox} className="search-box">
//                             <Search size={16} style={styles.searchIcon} />
//                             <input
//                                 style={styles.searchInput}
//                                 placeholder="Search classes..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                             />
//                         </div>
//                     </div>

//                     <div style={styles.timeline}>
//                         {filteredSchedule.map((item, index) => (
//                             <div key={item.id} style={styles.timelineItem} className="timeline-item">
//                                 <div style={styles.timeLabel} className="time-label">
//                                     <div style={styles.timeText}>{item.time.split(' - ')[0]}</div>
//                                     <div style={styles.timeSubtext}>{item.time.split(' - ')[1]}</div>
//                                 </div>

//                                 <div style={styles.itemConnector}>
//                                     <div style={{
//                                         ...styles.dot,
//                                         backgroundColor: item.status === 'ongoing' ? '#2563EB' : '#E5E7EB'
//                                     }} />
//                                     {index !== filteredSchedule.length - 1 && <div style={styles.line} />}
//                                 </div>

//                                 <div style={{
//                                     ...styles.classCard,
//                                     borderLeft: item.status === 'ongoing' ? '4px solid #2563EB' : '1px solid #E5E7EB'
//                                 }} className="class-card">
//                                     <div style={styles.cardMain}>
//                                         <div style={styles.cardTop}>
//                                             <span style={styles.subjectCode}>{item.code}</span>
//                                             <span style={{
//                                                 ...styles.typeBadge,
//                                                 backgroundColor: item.type === 'Laboratory' ? '#FDF2F8' : '#EFF6FF',
//                                                 color: item.type === 'Laboratory' ? '#DB2777' : '#2563EB'
//                                             }}>{item.type}</span>
//                                         </div>
//                                         <h3 style={styles.subjectName}>{item.subject}</h3>

//                                         <div style={styles.locationInfo}>
//                                             <MapPin size={16} color="#EF4444" style={{ marginRight: 8 }} />
//                                             <span style={styles.venueText}>{item.venue}</span>
//                                         </div>

//                                         <div style={styles.instructorDiv}>
//                                             <Users size={14} style={{ marginRight: 6 }} />
//                                             <span>{item.instructor}</span>
//                                         </div>
//                                     </div>

//                                     <div style={styles.cardActions} className="card-actions">
//                                             <div style={styles.statusText}>
//                                                 {item.status === 'ongoing' ? 'Ongoing Now' : 'Starts Soon'}
//                                             </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         backgroundColor: '#F9FAFB',
//         minHeight: '100vh',
//         fontFamily: '"Inter", sans-serif'
//     },
//     header: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '32px',
//         backgroundColor: '#FFFFFF',
//         padding: '24px',
//         borderRadius: '16px',
//         border: '1px solid #E5E7EB',
//         boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
//         position: 'relative'
//     },
//     title: {
//         fontSize: '26px',
//         fontWeight: '800',
//         color: '#111827',
//         margin: '0 0 6px 0'
//     },
//     subtitle: {
//         fontSize: '14px',
//         color: '#6B7280',
//         margin: 0
//     },
//     dateContainer: {
//         position: 'relative'
//     },
//     dateDisplay: {
//         display: 'flex',
//         alignItems: 'center',
//         padding: '10px 18px',
//         backgroundColor: '#F3F4F6',
//         borderRadius: '10px',
//         fontSize: '14px',
//         fontWeight: '600',
//         color: '#374151',
//         whiteSpace: 'nowrap',
//         border: 'none',
//         cursor: 'pointer',
//         transition: 'all 0.2s'
//     },
//     datePickerWrapper: {
//         position: 'absolute',
//         top: 'calc(100% + 10px)',
//         zIndex: 100
//     },
//     calendarPopup: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: '12px',
//         boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 20px 48px rgba(0,0,0,0.05)',
//         padding: '16px',
//         width: '280px',
//         border: '1px solid #E5E7EB'
//     },
//     calendarHeader: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '16px'
//     },
//     calendarNavButton: {
//         background: 'none',
//         border: 'none',
//         fontSize: '18px',
//         fontWeight: 'bold',
//         color: '#374151',
//         cursor: 'pointer',
//         padding: '4px 8px',
//         borderRadius: '4px',
//         transition: 'background-color 0.2s'
//     },
//     calendarMonthYear: {
//         fontSize: '14px',
//         fontWeight: '600',
//         color: '#111827'
//     },
//     calendarWeekdays: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(7, 1fr)',
//         marginBottom: '8px'
//     },
//     calendarWeekday: {
//         textAlign: 'center',
//         fontSize: '11px',
//         fontWeight: '600',
//         color: '#6B7280',
//         padding: '4px 0'
//     },
//     calendarDays: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(7, 1fr)',
//         gap: '2px'
//     },
//     calendarDay: {
//         height: '36px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: 'none',
//         border: 'none',
//         borderRadius: '6px',
//         fontSize: '13px',
//         fontWeight: '500',
//         color: '#374151',
//         cursor: 'pointer',
//         position: 'relative',
//         transition: 'all 0.2s'
//     },
//     calendarDayEmpty: {
//         height: '36px'
//     },
//     calendarDaySelected: {
//         backgroundColor: '#2563EB',
//         color: '#FFFFFF',
//         fontWeight: '600'
//     },
//     calendarDayToday: {
//         color: '#2563EB',
//         fontWeight: '600'
//     },
//     todayIndicator: {
//         position: 'absolute',
//         bottom: '4px',
//         width: '4px',
//         height: '4px',
//         borderRadius: '50%',
//         backgroundColor: '#2563EB'
//     },
//     calendarActions: {
//         marginTop: '16px',
//         paddingTop: '16px',
//         borderTop: '1px solid #E5E7EB'
//     },
//     todayButton: {
//         width: '100%',
//         padding: '8px 16px',
//         backgroundColor: '#F3F4F6',
//         border: '1px solid #E5E7EB',
//         borderRadius: '8px',
//         fontSize: '14px',
//         fontWeight: '600',
//         color: '#374151',
//         cursor: 'pointer',
//         transition: 'all 0.2s'
//     },
//     mainLayout: {
//         width: '100%',
//         maxWidth: '1200px',
//         margin: '0 auto'
//     },
//     leftCol: {
//         display: 'flex',
//         flexDirection: 'column',
//         width: '100%'
//     },
//     sectionHeader: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '24px'
//     },
//     sectionTitle: {
//         fontSize: '18px',
//         fontWeight: '700',
//         color: '#111827'
//     },
//     searchBox: {
//         position: 'relative',
//         width: '300px'
//     },
//     searchIcon: {
//         position: 'absolute',
//         left: '12px',
//         top: '50%',
//         transform: 'translateY(-50%)',
//         color: '#9CA3AF'
//     },
//     searchInput: {
//         width: '100%',
//         padding: '10px 12px 10px 40px',
//         borderRadius: '8px',
//         border: '1px solid #E5E7EB',
//         fontSize: '14px',
//         outline: 'none',
//         backgroundColor: '#FFFFFF'
//     },
//     timeline: {
//         display: 'flex',
//         flexDirection: 'column'
//     },
//     timelineItem: {
//         display: 'flex',
//         gap: '24px',
//         marginBottom: '4px'
//     },
//     timeLabel: {
//         width: '90px',
//         textAlign: 'right',
//         paddingTop: '20px',
//         flexShrink: 0
//     },
//     timeText: {
//         fontSize: '14px',
//         fontWeight: '700',
//         color: '#111827'
//     },
//     timeSubtext: {
//         fontSize: '11px',
//         color: '#9CA3AF',
//         marginTop: '2px'
//     },
//     itemConnector: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         paddingTop: '24px',
//         width: '20px',
//         flexShrink: 0
//     },
//     dot: {
//         width: '12px',
//         height: '12px',
//         borderRadius: '50%',
//         zIndex: 1
//     },
//     line: {
//         width: '2px',
//         flex: 1,
//         backgroundColor: '#E5E7EB',
//         marginTop: '4px'
//     },
//     classCard: {
//         flex: 1,
//         backgroundColor: '#FFFFFF',
//         borderRadius: '16px',
//         padding: '24px',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
//         marginBottom: '20px',
//         transition: 'all 0.2s hover'
//     },
//     cardMain: {
//         flex: 1
//     },
//     cardTop: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '12px',
//         marginBottom: '8px'
//     },
//     subjectCode: {
//         fontSize: '11px',
//         fontWeight: '800',
//         color: '#6B7280'
//     },
//     typeBadge: {
//         fontSize: '10px',
//         fontWeight: '700',
//         padding: '2px 8px',
//         borderRadius: '4px',
//         textTransform: 'uppercase'
//     },
//     subjectName: {
//         fontSize: '17px',
//         fontWeight: '700',
//         color: '#111827',
//         margin: '0 0 12px 0'
//     },
//     locationInfo: {
//         display: 'flex',
//         alignItems: 'center',
//         marginBottom: '8px'
//     },
//     venueText: {
//         fontSize: '14px',
//         fontWeight: '600',
//         color: '#374151'
//     },
//     instructorDiv: {
//         display: 'flex',
//         alignItems: 'center',
//         fontSize: '13px',
//         color: '#6B7280'
//     },
//     statusText: {
//         fontSize: '12px',
//         fontWeight: '700',
//         color: '#9CA3AF',
//         textTransform: 'uppercase',
//         letterSpacing: '0.05em',
//         whiteSpace: 'nowrap'
//     }
// };

// // Add hover effects
// styles.dateDisplay[':hover'] = {
//     backgroundColor: '#E5E7EB'
// };

// styles.calendarNavButton[':hover'] = {
//     backgroundColor: '#F3F4F6'
// };

// styles.calendarDay[':hover'] = {
//     backgroundColor: '#F3F4F6'
// };

// styles.todayButton[':hover'] = {
//     backgroundColor: '#E5E7EB'
// };

// export default MyClassRoom;


import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Calendar,
    Users,
    Loader2,
} from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore';

// --- FIXED SESSION DEFINITIONS ---
const SESSION_SLOTS = [
    { id: 1, label: 'Session 1', time: '08:45 AM - 10:30 AM' },
    { id: 2, label: 'Session 2', time: '10:30 AM - 12:30 PM' },
    { id: 3, label: 'Session 3', time: '01:30 PM - 03:00 PM' },
    { id: 4, label: 'Session 4', time: '03:00 PM - 04:30 PM' }
];

const MyClassRoom = () => {
    // --- AUTH & STATE ---
    const { token, user } = useAuthStore();
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // --- FETCH DATA ---
    const fetchSchedule = async (date) => {
        if (!token) return;
        setLoading(true);
        try {
            // Adjust for timezone to get correct YYYY-MM-DD
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - (offset * 60 * 1000));
            const dateStr = localDate.toISOString().split('T')[0];

            const response = await fetch(`${import.meta.env.VITE_API_URL}/schedule?date=${dateStr}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                setScheduleData(result.data || []);
            } else {
                setScheduleData([]);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setScheduleData([]);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when date changes
    useEffect(() => {
        fetchSchedule(selectedDate);
    }, [selectedDate, token]);

    // --- HELPER: GET STATUS ---
    const getSlotStatus = (slotTimeStr, date) => {
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        
        if (!isToday) return date > today ? 'upcoming' : 'completed';

        try {
            const [startStr, endStr] = slotTimeStr.split(' - ');
            
            const parseToMinutes = (str) => {
                const [time, mod] = str.trim().split(' ');
                let [h, m] = time.split(':').map(Number);
                if (h === 12 && mod === 'AM') h = 0;
                if (h !== 12 && mod === 'PM') h += 12;
                return h * 60 + m;
            };

            const currentMins = today.getHours() * 60 + today.getMinutes();
            const startMins = parseToMinutes(startStr);
            const endMins = parseToMinutes(endStr);

            if (currentMins >= startMins && currentMins <= endMins) return 'ongoing';
            if (currentMins < startMins) return 'upcoming';
            return 'completed';
        } catch (e) {
            return 'upcoming';
        }
    };

    const formatDate = (date) => {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // --- CALENDAR RENDERER ---
    const renderDatePicker = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);
        
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            
            days.push(
                <button
                    key={d}
                    style={{
                        ...styles.calendarDay,
                        ...(isSelected ? styles.calendarDaySelected : {}),
                        ...(isToday ? styles.calendarDayToday : {})
                    }}
                    onClick={() => { setSelectedDate(date); setShowDatePicker(false); }}
                >
                    {d}
                </button>
            );
        }

        return (
            <div style={styles.calendarPopup}>
                <div style={styles.calendarHeader}>
                    <button onClick={() => setSelectedDate(new Date(year, month - 1))} style={styles.navBtn}>‹</button>
                    <span style={{fontWeight: 600}}>{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => setSelectedDate(new Date(year, month + 1))} style={styles.navBtn}>›</button>
                </div>
                <div style={styles.calendarGrid}>
                    {['S','M','T','W','T','F','S'].map(d => <div key={d} style={styles.weekDay}>{d}</div>)}
                    {days}
                </div>
                <button style={styles.todayBtn} onClick={() => { setSelectedDate(new Date()); setShowDatePicker(false); }}>Today</button>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <style>{`
                @media (max-width: 768px) {
                    .header-container { flex-direction: column; align-items: flex-start !important; gap: 16px; }
                    .timeline-item { gap: 12px !important; }
                    .time-label { width: 80px !important; text-align: left !important; }
                    .class-card { flex-direction: column; align-items: flex-start !important; gap: 12px; }
                    .card-actions { width: 100%; border-top: 1px solid #f3f4f6; padding-top: 12px; margin-left: 0 !important; text-align: left !important; }
                }
            `}</style>

            {/* HEADER */}
            <header style={styles.header} className="header-container">
                <div>
                    <h1 style={styles.title}>My Classroom</h1>
                    <p style={styles.subtitle}>Welcome back, {user?.name || 'Student'}</p>
                </div>
                <div style={{position: 'relative'}}>
                    <button style={styles.dateDisplay} onClick={() => setShowDatePicker(!showDatePicker)}>
                        <Calendar size={18} style={{ marginRight: 10 }} />
                        <span>{selectedDate.toDateString() === new Date().toDateString() ? 'Today' : formatDate(selectedDate)}</span>
                    </button>
                    {showDatePicker && <div style={styles.datePickerWrapper}>{renderDatePicker()}</div>}
                </div>
            </header>

            {/* MAIN CONTENT */}
            <div style={styles.mainLayout}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Daily Schedule</h2>
                </div>

                {loading ? (
                    <div style={styles.loadingContainer}>
                        <Loader2 className="animate-spin" size={32} color="#2563EB" />
                    </div>
                ) : scheduleData.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>No schedule assigned for this date.</p>
                    </div>
                ) : (
                    <div style={styles.timeline}>
                        {SESSION_SLOTS.map((slot, index) => {
                            // LOGIC: Use the FIRST available class for the day and repeat it for all slots
                            const classData = scheduleData[0]; 
                            const status = getSlotStatus(slot.time, selectedDate);

                            return (
                                <div key={slot.id} style={styles.timelineItem} className="timeline-item">
                                    {/* Left: Time & Label */}
                                    <div style={styles.timeLabel} className="time-label">
                                        <div style={styles.timeText}>{slot.time.split(' - ')[0]}</div>
                                        <div style={styles.timeSubtext}>{slot.time.split(' - ')[1]}</div>
                                        <div style={styles.sessionLabel}>{slot.label}</div>
                                    </div>

                                    {/* Middle: Connector */}
                                    <div style={styles.connector}>
                                        <div style={{
                                            ...styles.dot,
                                            backgroundColor: status === 'ongoing' ? '#2563EB' : '#E5E7EB'
                                        }} />
                                        {index !== SESSION_SLOTS.length - 1 && <div style={styles.line} />}
                                    </div>

                                    {/* Right: Card */}
                                    <div style={{
                                        ...styles.classCard,
                                        borderLeft: status === 'ongoing' ? '4px solid #2563EB' : '4px solid #E5E7EB',
                                        opacity: status === 'completed' ? 0.6 : 1
                                    }} className="class-card">
                                        <div style={styles.cardContent}>
                                            
                                            
                                            <h3 style={styles.subjectName}>{classData.subject}</h3>
                                            
                                            <div style={styles.infoRow}>
                                                <MapPin size={16} color="#EF4444" />
                                                <span style={styles.venueText}>{classData.venue}</span>
                                            </div>
                                            
                                            <div style={styles.infoRow}>
                                                <Users size={16} color="#6B7280" />
                                                <span style={styles.instructorText}>{classData.instructor}</span>
                                            </div>
                                        </div>

                                        <div style={styles.cardActions} className="card-actions">
                                            <div style={{
                                                ...styles.statusBadge,
                                                color: status === 'ongoing' ? '#2563EB' : '#6B7280',
                                                backgroundColor: status === 'ongoing' ? '#EFF6FF' : 'transparent'
                                            }}>
                                                {status === 'ongoing' ? '• HAPPENING NOW' : status.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: '"Inter", sans-serif', paddingBottom: '40px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '24px', margin: '20px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' },
    title: { fontSize: '26px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' },
    subtitle: { fontSize: '14px', color: '#6B7280', margin: 0 },
    
    // Date Picker
    dateDisplay: { display: 'flex', alignItems: 'center', padding: '10px 16px', backgroundColor: '#F3F4F6', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#374151' },
    datePickerWrapper: { position: 'absolute', top: '110%', right: 0, zIndex: 50 },
    calendarPopup: { backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', width: '280px' },
    calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    navBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px' },
    calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '10px' },
    weekDay: { textAlign: 'center', fontSize: '12px', color: '#9CA3AF', fontWeight: 600 },
    calendarDay: { height: '32px', borderRadius: '6px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' },
    calendarDaySelected: { backgroundColor: '#2563EB', color: 'white' },
    calendarDayToday: { color: '#2563EB', fontWeight: 'bold' },
    todayBtn: { width: '100%', padding: '8px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },

    // Layout
    mainLayout: { maxWidth: '1000px', margin: '0 auto', padding: '0 20px' },
    sectionHeader: { marginBottom: '24px' },
    sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#111827' },
    
    loadingContainer: { display: 'flex', justifyContent: 'center', padding: '40px' },
    emptyState: { textAlign: 'center', padding: '40px', color: '#6B7280' },

    // Timeline
    timeline: { display: 'flex', flexDirection: 'column' },
    timelineItem: { display: 'flex', gap: '24px', marginBottom: '4px', minHeight: '130px' },
    
    timeLabel: { width: '110px', textAlign: 'right', paddingTop: '20px', flexShrink: 0 },
    timeText: { fontSize: '15px', fontWeight: '700', color: '#111827' },
    timeSubtext: { fontSize: '12px', color: '#6B7280' },
    sessionLabel: { fontSize: '10px', fontWeight: '800', color: '#9CA3AF', marginTop: '4px', textTransform: 'uppercase' },

    connector: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '24px', width: '20px', flexShrink: 0 },
    dot: { width: '12px', height: '12px', borderRadius: '50%', zIndex: 1 },
    line: { width: '2px', flex: 1, backgroundColor: '#E5E7EB', marginTop: '4px' },

    // Cards
    classCard: { flex: 1, backgroundColor: 'white', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', marginBottom: '20px', transition: 'all 0.2s' },
    cardContent: { flex: 1 },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
    codeBadge: { fontSize: '11px', fontWeight: '800', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '2px 6px', borderRadius: '4px' },
    lectureBadge: { fontSize: '10px', fontWeight: '700', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' },
    
    subjectName: { fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 10px 0' },
    
    infoRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' },
    venueText: { fontSize: '13px', fontWeight: '500', color: '#374151' },
    instructorText: { fontSize: '13px', color: '#6B7280' },

    cardActions: { marginLeft: '16px', minWidth: '100px', textAlign: 'right' },
    statusBadge: { fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px' },
};

export default MyClassRoom;
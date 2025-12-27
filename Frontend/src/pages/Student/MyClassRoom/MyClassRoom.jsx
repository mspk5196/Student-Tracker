import React, { useState } from 'react';
import {
    MapPin,
    Clock,
    Calendar,
    Users,
    BookOpen,
    Video,
    ChevronRight,
    Search,
    Bell
} from 'lucide-react';

const MyClassRoom = () => {
    // --- MOCK DATA FOR STUDENT CLASSES & VENUES ---
    const SCHEDULE = [
        {
            id: 1,
            subject: 'React Mastery Workshop',
            code: 'REACT-101',
            type: 'Lecture',
            time: '09:00 AM - 10:30 AM',
            venue: 'Main Building - Hall A (Room 402)',
            instructor: 'Prof. Sarah Johnson',
            status: 'ongoing',
            link: 'https://zoom.us/j/123456789'
        },
        {
            id: 2,
            subject: 'HTML & CSS Fundamentals',
            code: 'WEB-201',
            type: 'Laboratory',
            time: '10:45 AM - 12:15 PM',
            venue: 'IT Block - CS Lab 03',
            instructor: 'Dr. James Wilson',
            status: 'upcoming'
        },
        {
            id: 3,
            subject: 'JavaScript Deep Dive',
            code: 'JS-301',
            type: 'Workshop',
            time: '01:30 PM - 03:00 PM',
            venue: 'Main Building - Seminar Hall 2',
            instructor: 'Prof. Michael Chen',
            status: 'upcoming'
        }
    ];

    const [searchQuery, setSearchQuery] = useState('');

    const filteredSchedule = SCHEDULE.filter(item =>
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.venue.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.title}>My Classroom</h1>
                    <p style={styles.subtitle}>View your daily schedule and find your classroom locations</p>
                </div>
                <div style={styles.dateDisplay}>
                    <Calendar size={18} style={{ marginRight: 10 }} />
                    <span>Today, October 24, 2024</span>
                </div>
            </header>

            <div style={styles.mainLayout}>
                {/* Left Side: Schedule Timeline */}
                <div style={styles.leftCol}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>Today's Schedule</h2>
                        <div style={styles.searchBox}>
                            <Search size={16} style={styles.searchIcon} />
                            <input
                                style={styles.searchInput}
                                placeholder="Search classes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={styles.timeline}>
                        {filteredSchedule.map((item, index) => (
                            <div key={item.id} style={styles.timelineItem}>
                                <div style={styles.timeLabel}>
                                    <div style={styles.timeText}>{item.time.split(' - ')[0]}</div>
                                    <div style={styles.timeSubtext}>{item.time.split(' - ')[1]}</div>
                                </div>

                                <div style={styles.itemConnector}>
                                    <div style={{
                                        ...styles.dot,
                                        backgroundColor: item.status === 'ongoing' ? '#2563EB' : '#E5E7EB'
                                    }} />
                                    {index !== filteredSchedule.length - 1 && <div style={styles.line} />}
                                </div>

                                <div style={{
                                    ...styles.classCard,
                                    borderLeft: item.status === 'ongoing' ? '4px solid #2563EB' : '1px solid #E5E7EB'
                                }}>
                                    <div style={styles.cardMain}>
                                        <div style={styles.cardTop}>
                                            <span style={styles.subjectCode}>{item.code}</span>
                                            <span style={{
                                                ...styles.typeBadge,
                                                backgroundColor: item.type === 'Laboratory' ? '#FDF2F8' : '#EFF6FF',
                                                color: item.type === 'Laboratory' ? '#DB2777' : '#2563EB'
                                            }}>{item.type}</span>
                                        </div>
                                        <h3 style={styles.subjectName}>{item.subject}</h3>

                                        <div style={styles.locationInfo}>
                                            <MapPin size={16} color="#EF4444" style={{ marginRight: 8 }} />
                                            <span style={styles.venueText}>{item.venue}</span>
                                        </div>

                                        <div style={styles.instructorDiv}>
                                            <Users size={14} style={{ marginRight: 6 }} />
                                            <span>{item.instructor}</span>
                                        </div>
                                    </div>

                                    <div style={styles.cardActions}>
                                        {item.status === 'ongoing' && item.link ? (
                                            <button style={styles.joinBtn} onClick={() => window.open(item.link, '_blank')}>
                                                <Video size={16} style={{ marginRight: 8 }} />
                                                Join Live
                                            </button>
                                        ) : (
                                            <div style={styles.statusText}>
                                                {item.status === 'ongoing' ? 'Ongoing Now' : 'Starts Soon'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Map & Info */}
                <div style={styles.rightCol}>
                    <div style={styles.guideCard}>
                        <div style={styles.guideHeader}>
                            <div style={styles.iconCircle}><Info color="#2563EB" /></div>
                            <h3 style={styles.guideTitle}>Quick Navigation</h3>
                        </div>
                        <p style={styles.guideText}>Navigate through the campus easily using these room codes.</p>
                        <div style={styles.roomCodes}>
                            <div style={styles.roomCodeItem}>
                                <span style={styles.roomCode}>Hall A-Z</span>
                                <span style={styles.roomDesc}>Main Academic Block</span>
                            </div>
                            <div style={styles.roomCodeItem}>
                                <span style={styles.roomCode}>Lab 01-10</span>
                                <span style={styles.roomDesc}>IT & CS Innovation Block</span>
                            </div>
                            <div style={styles.roomCodeItem}>
                                <span style={styles.roomCode}>Seminar 1-5</span>
                                <span style={styles.roomDesc}>Conference Wing</span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.announcementCard}>
                        <div style={styles.annHeader}>
                            <Bell size={18} color="#F59E0B" />
                            <span style={styles.annTitle}>Announcements</span>
                        </div>
                        <div style={styles.annList}>
                            <div style={styles.annItem}>
                                <div style={styles.annDot} />
                                <span>Room 402 AC is under maintenance.</span>
                            </div>
                            <div style={styles.annItem}>
                                <div style={styles.annDot} />
                                <span>Extra lab session on Friday.</span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.contactSupport}>
                        <h4>Having trouble?</h4>
                        <button style={styles.supportBtn}>Contact Campus Admin</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '24px',
        backgroundColor: '#F9FAFB',
        minHeight: '100vh',
        fontFamily: '"Inter", sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        backgroundColor: '#FFFFFF',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
    },
    title: {
        fontSize: '26px',
        fontWeight: '800',
        color: '#111827',
        margin: '0 0 6px 0'
    },
    subtitle: {
        fontSize: '14px',
        color: '#6B7280',
        margin: 0
    },
    dateDisplay: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 18px',
        backgroundColor: '#F3F4F6',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151'
    },
    mainLayout: {
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '24px'
    },
    leftCol: {
        display: 'flex',
        flexDirection: 'column'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#111827'
    },
    searchBox: {
        position: 'relative',
        width: '240px'
    },
    searchIcon: {
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9CA3AF'
    },
    searchInput: {
        width: '100%',
        padding: '10px 12px 10px 40px',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#FFFFFF'
    },
    timeline: {
        display: 'flex',
        flexDirection: 'column'
    },
    timelineItem: {
        display: 'flex',
        gap: '24px',
        marginBottom: '4px'
    },
    timeLabel: {
        width: '80px',
        textAlign: 'right',
        paddingTop: '20px'
    },
    timeText: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#111827'
    },
    timeSubtext: {
        fontSize: '11px',
        color: '#9CA3AF',
        marginTop: '2px'
    },
    itemConnector: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '24px',
        width: '20px'
    },
    dot: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        zIndex: 1
    },
    line: {
        width: '2px',
        flex: 1,
        backgroundColor: '#E5E7EB',
        marginTop: '4px'
    },
    classCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        marginBottom: '20px',
        transition: 'all 0.2s hover',
        ':hover': {
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }
    },
    cardTop: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px'
    },
    subjectCode: {
        fontSize: '11px',
        fontWeight: '800',
        color: '#6B7280'
    },
    typeBadge: {
        fontSize: '10px',
        fontWeight: '700',
        padding: '2px 8px',
        borderRadius: '4px',
        textTransform: 'uppercase'
    },
    subjectName: {
        fontSize: '17px',
        fontWeight: '700',
        color: '#111827',
        margin: '0 0 12px 0'
    },
    locationInfo: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px'
    },
    venueText: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151'
    },
    instructorDiv: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '13px',
        color: '#6B7280'
    },
    joinBtn: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#2563EB',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '10px',
        fontWeight: '700',
        fontSize: '13px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
    },
    statusText: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    rightCol: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    guideCard: {
        backgroundColor: '#FFFFFF',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #E5E7EB'
    },
    guideHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
    },
    iconCircle: {
        width: '32px',
        height: '32px',
        backgroundColor: '#EFF6FF',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    guideTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#111827',
        margin: 0
    },
    guideText: {
        fontSize: '13px',
        color: '#6B7280',
        lineHeight: '1.5',
        marginBottom: '20px'
    },
    roomCodes: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    roomCodeItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#F9FAFB',
        borderRadius: '8px'
    },
    roomCode: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#2563EB'
    },
    roomDesc: {
        fontSize: '12px',
        color: '#6B7280'
    },
    announcementCard: {
        padding: '24px',
        backgroundColor: '#FFFBEB',
        borderRadius: '16px',
        border: '1px solid #FEF3C7'
    },
    annHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '16px'
    },
    annTitle: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#92400E'
    },
    annList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    annItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '13px',
        color: '#B45309'
    },
    annDot: {
        width: '6px',
        height: '6px',
        backgroundColor: '#F59E0B',
        borderRadius: '50%'
    },
    contactSupport: {
        textAlign: 'center',
        marginTop: 'auto',
        padding: '20px'
    },
    supportBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: 'transparent',
        border: '1px solid #E5E7EB',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#4B5563',
        cursor: 'pointer'
    }
};

const Info = ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

export default MyClassRoom;

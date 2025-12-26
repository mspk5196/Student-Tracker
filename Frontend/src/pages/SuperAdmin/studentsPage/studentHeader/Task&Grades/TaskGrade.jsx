import React, { useState, useRef, useEffect, useMemo } from 'react';

// --- SVGs & Icons ---
const Icons = {
    Faculty: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
    Venue: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
    Calendar: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ),
    Star: () => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    ),
    Clock: () => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ),
    ArrowLeft: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
    ),
    EmptyState: () => (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><path d="M20 12V8a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h6"/><path d="M12 11l-4-4m0 8l4-4m4 4l4-4m-4 0l4 4"/><circle cx="18" cy="18" r="4"/></svg>
    )
};

const TaskGrade = () => {
    // Current System Date (Mocked to match workshop data)
    const TODAY = "2025-12-25";

    // --- JSON DATA ---
const studentData = {
    currentSkill: {
        id: "W001",
        title: "Advanced React Patterns",
        faculty: "Dr. Sarah Smith",
        venue: "Lab 304 (Center Block)",
        duration: "10 Days (Dec 20 - Dec 30, 2025)",
        tasks: [
            { day: 1, date: "2025-12-20", title: "Higher Order Components", points: 50, grade: "A+", status: "Completed" },
            { day: 2, date: "2025-12-21", title: "Render Props & Context", points: 45, grade: "A", status: "Completed" },
            { day: 3, date: "2025-12-22", title: "Compound Components", points: 55, grade: "A+", status: "Completed" },
            { day: 4, date: "2025-12-23", title: "Control Props Pattern", points: 50, grade: "A+", status: "Completed" },
            { day: 5, date: "2025-12-24", title: "Custom Hooks Logic", points: 45, grade: "A", status: "Completed" },
            { day: 6, date: "2025-12-25", title: "State Management Systems", points: 0, grade: "In Progress", status: "Active" },
            { day: 7, date: "2025-12-26", title: "Performance Optimization", points: 0, grade: "Locked", status: "Upcoming" },
            { day: 8, date: "2025-12-27", title: "Error Boundaries & Recovery", points: 0, grade: "Locked", status: "Upcoming" },
            { day: 9, date: "2025-12-28", title: "Server Side Rendering", points: 0, grade: "Locked", status: "Upcoming" },
            { day: 10, date: "2025-12-29", title: "Final Architecture Review", points: 0, grade: "Locked", status: "Upcoming" }
        ]
    },
    history: [
        /* --- 2025 History --- */
        {
            id: "H001",
            title: "UI/UX Design Sprint",
            date: "Nov 10 - Nov 12, 2025",
            duration: "3 Days",
            faculty: "Prof. Alan Kay",
            grade: "A+",
            points: 120,
            tasks: [
                { day: 1, date: "2025-11-10", title: "User Research", points: 40, grade: "A", status: "Completed" },
                { day: 2, date: "2025-11-11", title: "Wireframing", points: 40, grade: "A+", status: "Completed" },
                { day: 3, date: "2025-11-12", title: "High-Fidelity Prototyping", points: 40, grade: "A+", status: "Completed" }
            ]
        },
        {
            id: "H002",
            title: "Node.js Backend Mastery",
            date: "Oct 15 - Oct 20, 2025",
            duration: "6 Days",
            faculty: "Ryan Dahl",
            grade: "A",
            points: 180,
            tasks: Array.from({ length: 6 }, (_, i) => ({
                day: i + 1,
                date: `2025-10-${15 + i}`,
                title: `Backend Lesson ${i + 1}`,
                points: 30,
                grade: "A",
                status: "Completed"
            }))
        },
        {
            id: "H003",
            title: "Cloud Architecture Seminar",
            date: "Aug 05, 2025",
            duration: "1 Day",
            faculty: "Dr. Werner Vogels",
            grade: "Participated",
            points: 50,
            tasks: [{ day: 1, date: "2025-08-05", title: "Serverless Concepts", points: 50, grade: "A+", status: "Completed" }]
        },
        {
            id: "H004",
            title: "Database Systems Deep Dive",
            date: "May 12 - May 16, 2025",
            duration: "5 Days",
            faculty: "Chris Date",
            grade: "B+",
            points: 140,
            tasks: Array.from({ length: 5 }, (_, i) => ({
                day: i + 1,
                date: `2025-05-${12 + i}`,
                title: `SQL Logic Day ${i + 1}`,
                points: 28,
                grade: "B+",
                status: "Completed"
            }))
        },
        {
            id: "H005",
            title: "Cybersecurity Workshop",
            date: "Mar 20 - Mar 22, 2025",
            duration: "3 Days",
            faculty: "Kevin Mitnick",
            grade: "A+",
            points: 150,
            tasks: [
                { day: 1, date: "2025-03-20", title: "Social Engineering", points: 50, grade: "A", status: "Completed" },
                { day: 2, date: "2025-03-21", title: "Network Hacking", points: 50, grade: "A+", status: "Completed" },
                { day: 3, date: "2025-03-22", title: "Defensive Coding", points: 50, grade: "A+", status: "Completed" }
            ]
        },

        /* --- 2024 History (Testing Previous Year Flow) --- */
        {
            id: "H2024-01",
            title: "Data Structures & Algorithms",
            date: "Dec 10 - Dec 15, 2024",
            duration: "6 Days",
            faculty: "Donald Knuth",
            grade: "A+",
            points: 300,
            tasks: Array.from({ length: 6 }, (_, i) => ({
                day: i + 1,
                date: `2024-12-${10 + i}`,
                title: `Algorithm Mastery ${i + 1}`,
                points: 50,
                grade: "A+",
                status: "Completed"
            }))
        },
        {
            id: "H2024-02",
            title: "JavaScript Fundamentals",
            date: "Aug 12 - Aug 15, 2024",
            duration: "4 Days",
            faculty: "Brendan Eich",
            grade: "A",
            points: 160,
            tasks: Array.from({ length: 4 }, (_, i) => ({
                day: i + 1,
                date: `2024-08-${12 + i}`,
                title: `JS Core Day ${i + 1}`,
                points: 40,
                grade: "A",
                status: "Completed"
            }))
        },
        {
            id: "H2024-03",
            title: "Web Accessibility (A11y)",
            date: "May 20, 2024",
            duration: "1 Day",
            faculty: "Marcy Sutton",
            grade: "A+",
            points: 80,
            tasks: [{ day: 1, date: "2024-05-20", title: "Screen Reader Testing", points: 80, grade: "A+", status: "Completed" }]
        },
        {
            id: "H2024-04",
            title: "Git & Version Control",
            date: "Feb 05 - Feb 06, 2024",
            duration: "2 Days",
            faculty: "Linus Torvalds",
            grade: "A",
            points: 90,
            tasks: [
                { day: 1, date: "2024-02-05", title: "Branching Strategies", points: 45, grade: "A", status: "Completed" },
                { day: 2, date: "2024-02-06", title: "Resolving Conflicts", points: 45, grade: "A", status: "Completed" }
            ]
        }
    ]
};

    // --- STATE ---
    const [viewingSkill, setViewingSkill] = useState(studentData.currentSkill);
    const [selectedDate, setSelectedDate] = useState(TODAY);
    const [performancePage, setPerformancePage] = useState(0);
    const [historyPage, setHistoryPage] = useState(0);
    const [selectedYear, setSelectedYear] = useState(2025);
    const topRef = useRef(null);

    const PERF_LIMIT = 6;
    const HIST_LIMIT = 5;

    // --- HELPERS ---
    const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Activity log derived from tasks for the heatmap
    const activityLog = useMemo(() => {
        const log = {};
        const allSkills = [studentData.currentSkill, ...studentData.history].filter(Boolean);
        allSkills.forEach(skill => {
            skill.tasks.forEach(task => {
                log[task.date] = (log[task.date] || 0) + task.points;
            });
        });
        return log;
    }, [studentData]);

    const currentDayInfo = useMemo(() => {
        if (!studentData.currentSkill) return "N/A";
        const task = studentData.currentSkill.tasks.find(t => t.date === TODAY);
        return task ? `Day ${String(task.day).padStart(2, '0')}` : "N/A";
    }, [studentData.currentSkill]);

    const handleSkillSelection = (skill, dateToHighlight = null) => {
        setViewingSkill(skill);
        setPerformancePage(0);
        if (dateToHighlight) {
            const index = skill.tasks.findIndex(t => t.date === dateToHighlight);
            setPerformancePage(Math.floor(index / PERF_LIMIT));
            setSelectedDate(dateToHighlight);
        } else {
            setSelectedDate(null);
        }
        scrollToTop();
    };

    const handleHeatMapClick = (dateStr) => {
        const allSkills = [studentData.currentSkill, ...studentData.history].filter(Boolean);
        const foundSkill = allSkills.find(s => s.tasks.some(t => t.date === dateStr));
        if (foundSkill) handleSkillSelection(foundSkill, dateStr);
    };

    const getHeatColor = (points) => {
        if (!points || points === 0) return '#f8fafc';
        if (points < 35) return '#dbeafe';
        if (points < 45) return '#60a5fa';
        return '#2563eb';
    };

    // --- STYLES ---
    const styles = {
        container: { fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#F8FAFF', padding: '40px 6%', minHeight: '100vh', color: '#1e293b' },
        headerCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '32px', borderLeft: '6px solid #2563eb', boxShadow: '0 4px 20px rgba(37, 99, 235, 0.05)', marginBottom: '35px', position: 'relative', border: '1px solid #f1f5f9' },
        badgeDay: { position: 'absolute', top: '25px', right: '25px', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '10px 18px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', textAlign: 'center', border: '1px solid #dbeafe' },
        sectionTitle: { fontSize: '20px', fontWeight: '800', marginBottom: '24px', color: '#0f172a' },
        perfCard: (isActive, isLocked) => ({
            backgroundColor: isActive ? '#f0f7ff' : '#fff', border: isActive ? '2px solid #3b82f6' : '1px solid #e2e8f0',
            borderRadius: '16px', padding: '24px', opacity: isLocked ? 0.5 : 1, transition: 'all 0.3s ease'
        }),
        returnBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', fontSize: '12px', fontWeight: '700', cursor: 'pointer', marginBottom: '16px', width: 'fit-content' },
        noRecords: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#94a3b8', textAlign: 'center', marginBottom: '40px' },
        heatMapWrapper: { backgroundColor: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0' },
        navBtn: { padding: '8px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }
    };

    // --- RENDER HELPERS ---
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const renderHeatMap = () => (
        <div style={styles.heatMapWrapper}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <span style={styles.sectionTitle}>Engagement Activity</span>
                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: '600' }}>
                    <option value="2025">Year 2025</option>
                    <option value="2024">Year 2024</option>
                </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px' }}>
                {months.map((month, mIdx) => {
                    const daysInMonth = new Date(selectedYear, mIdx + 1, 0).getDate();
                    return (
                        <div key={month} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 13px)', gridAutoFlow: 'column', gap: '4px' }}>
                                {[...Array(daysInMonth)].map((_, d) => {
                                    const dateStr = `${selectedYear}-${String(mIdx + 1).padStart(2, '0')}-${String(d + 1).padStart(2, '0')}`;
                                    const pts = activityLog[dateStr] || 0;
                                    return (
                                        <div key={d} onClick={() => handleHeatMapClick(dateStr)} style={{ width: '13px', height: '13px', backgroundColor: getHeatColor(pts), borderRadius: '3px', cursor: pts > 0 ? 'pointer' : 'default', border: pts > 0 ? 'none' : '1px solid #f1f5f9' }} />
                                    );
                                })}
                            </div>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textAlign: 'center' }}>{month}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const isShowingCurrent = viewingSkill?.id === studentData.currentSkill?.id;
    const hasData = studentData.currentSkill || (studentData.history && studentData.history.length > 0);

    return (
        <div style={styles.container} ref={topRef}>
            {!hasData ? (
                <div style={styles.noRecords}>
                    <Icons.EmptyState />
                    <h2 style={{ marginTop: '15px', color: '#475569' }}>No Learning Records Found</h2>
                    <p style={{ maxWidth: '300px', fontSize: '14px', lineHeight: '1.6' }}>You haven't enrolled in any skills or workshops yet. Check back later for your progress logs.</p>
                </div>
            ) : (
                <>
                    {/* Header Card */}
                    <div style={styles.headerCard}>
                        {!isShowingCurrent && (
                            <div style={styles.returnBtn} onClick={() => handleSkillSelection(studentData.currentSkill)}>
                                <Icons.ArrowLeft /> Back to Current Workshop
                            </div>
                        )}
                        <h1 style={{ margin: '0 0 24px 0', fontSize: '28px', fontWeight: '900' }}>{viewingSkill?.title || "Workshop Detail"}</h1>
                        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                            <div>
                                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900', marginBottom: '6px' }}>FACULTY</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}><Icons.Faculty /> {viewingSkill?.faculty}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900', marginBottom: '6px' }}>VENUE</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}><Icons.Venue /> {viewingSkill?.venue || "Archive"}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900', marginBottom: '6px' }}>DURATION</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}><Icons.Calendar /> {viewingSkill?.duration || viewingSkill?.date}</div>
                            </div>
                        </div>
                        {isShowingCurrent && (
                            <div style={styles.badgeDay}>CURRENT DAY<br /><span style={{ fontSize: '16px', fontWeight: '900' }}>{currentDayInfo}</span></div>
                        )}
                    </div>

                    {/* Daily Logs */}
                    <h3 style={styles.sectionTitle}>Daily Performance Log</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                        {viewingSkill?.tasks.slice(performancePage * PERF_LIMIT, (performancePage + 1) * PERF_LIMIT).map((task) => {
                            const isActive = task.date === selectedDate;
                            const isLocked = task.status === 'Upcoming';
                            return (
                                <div key={task.day} style={styles.perfCard(isActive, isLocked)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '900' }}>DAY {String(task.day).padStart(2, '0')} {isActive ? '(SELECTED)' : ''}</span>
                                        {task.points > 0 ? (
                                            <span style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: '11px', padding: '5px 12px', borderRadius: '25px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Star /> {task.points} Pts</span>
                                        ) : (
                                            <span style={{ color: '#64748b', fontSize: '11px', background: '#f8fafc', padding: '5px 12px', borderRadius: '25px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Clock /> {isLocked ? 'Locked' : 'Active'}</span>
                                        )}
                                    </div>
                                    <div style={{ fontWeight: '800', fontSize: '18px', marginBottom: '25px', lineHeight: '1.4' }}>{task.title}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>Grade</div>
                                            <div style={{ fontWeight: '900', fontSize: '18px', color: task.grade === 'A+' ? '#059669' : '#2563eb' }}>{task.grade}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>Status</div>
                                            <div style={{ fontWeight: '800', fontSize: '14px', color: isActive ? '#2563eb' : '#334155', marginTop: '4px' }}>{task.status}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {viewingSkill?.tasks.length > PERF_LIMIT && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', color: '#64748b', fontSize: '13px', alignItems: 'center' }}>
                            <span>Showing {performancePage * PERF_LIMIT + 1}-{Math.min((performancePage + 1) * PERF_LIMIT, viewingSkill.tasks.length)} of {viewingSkill.tasks.length} tasks</span>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button style={styles.navBtn} disabled={performancePage === 0} onClick={() => setPerformancePage(p => p - 1)}>Prev</button>
                                <button style={styles.navBtn} disabled={(performancePage + 1) * PERF_LIMIT >= viewingSkill.tasks.length} onClick={() => setPerformancePage(p => p + 1)}>Next</button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* HeatMap and History always visible */}
            <div style={{ marginTop: '50px' }}>
                {renderHeatMap()}
            </div>

            <h3 style={{ ...styles.sectionTitle, marginTop: '60px' }}>History & Event Log</h3>
            <div>
                {studentData.history.slice(historyPage * HIST_LIMIT, (historyPage + 1) * HIST_LIMIT).map(item => (
                    <div key={item.id} style={{ backgroundColor: '#fff', padding: '24px 30px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', cursor: 'pointer' }} onClick={() => handleSkillSelection(item)}>
                        <div>
                            <div style={{ fontWeight: '900', fontSize: '16px', marginBottom: '4px' }}>{item.title}</div>
                            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{item.date} • {item.duration} • {item.faculty}</div>
                        </div>
                        <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '10px 22px', borderRadius: '40px', fontWeight: '900', fontSize: '12px' }}>{item.grade} • {item.points} Pts</div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', color: '#64748b', fontSize: '13px', alignItems: 'center' }}>
                <span>Showing {historyPage * HIST_LIMIT + 1}-{Math.min((historyPage + 1) * HIST_LIMIT, studentData.history.length)} of {studentData.history.length} events</span>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={styles.navBtn} disabled={historyPage === 0} onClick={() => setHistoryPage(p => p - 1)}>Prev</button>
                    <button style={styles.navBtn} disabled={(historyPage + 1) * HIST_LIMIT >= studentData.history.length} onClick={() => setHistoryPage(p => p + 1)}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default TaskGrade;
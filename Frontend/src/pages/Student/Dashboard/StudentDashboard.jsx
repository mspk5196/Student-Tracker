import React, { useState, useEffect } from 'react';
import {
    BookOpen, Calendar, Clock, ClipboardCheck,
    MapPin, Users, ChevronRight, Plus,
    BarChart3, PieChart, MoreVertical, CheckCircle,
    AlertCircle, TrendingUp, TrendingDown,
    FileText, Video, Code, Database, Rocket, Award,
    Star, Target, ArrowRight, Bell
} from 'lucide-react';

// Static data for Student Dashboard
const STATIC_DATA = {
    stats: [
        { id: 1, label: 'Overall Attendance', value: '82%', sub: 'Last 30 days: +2.4%', icon: <Calendar size={20} />, badge: 'Good' },
        { id: 2, label: 'Pending Tasks', value: '3', sub: '2 due by tomorrow', icon: <ClipboardCheck size={20} />, badge: 'Urgent' },
        { id: 3, label: 'Current CGPA', value: '8.4', sub: 'Semester 5 progress', icon: <Award size={20} /> },
        { id: 4, label: 'Course Progress', value: '68%', sub: 'Target: 85% by Semester end', icon: <Target size={20} /> },
    ],

    schedule: [
        {
            id: 'CS-201',
            name: 'Data Structures & Algorithms',
            type: 'Lecture',
            time: '10:00 - 11:00 AM',
            loc: 'Lab 3',
            faculty: 'Dr. Rajesh Kumar',
            status: 'Ongoing',
            statusType: 'progress'
        },
        {
            id: 'CS-203',
            name: 'Database Systems',
            type: 'Laboratory',
            time: '11:15 AM - 12:15 PM',
            loc: 'Room 204',
            faculty: 'Prof. Meena Sharma',
            status: 'Upcoming',
            statusType: 'pending'
        },
        {
            id: 'CS-205',
            name: 'Operating Systems',
            type: 'Tutorial',
            time: '02:00 - 03:00 PM',
            loc: 'Seminar Hall',
            faculty: 'Dr. Amit Patel',
            status: 'Completed',
            statusType: 'completed'
        }
    ],

    tasks: [
        { id: 1, name: 'AVL Tree Rotations', subject: 'DSA', submitted: 0, total: 1, status: 'pending', deadline: 'Today' },
        { id: 2, name: 'SQL Normalization', subject: 'DBMS', submitted: 0, total: 1, status: 'progress', deadline: 'Tomorrow' },
        { id: 3, name: 'Memory Management', subject: 'OS', submitted: 1, total: 1, status: 'completed', deadline: 'Done' }
    ],

    grades: [
        { id: 1, subject: 'Mathematics IV', code: 'MTH-301', grade: 'A', score: '92/100', type: 'success' },
        { id: 2, subject: 'Web Development', code: 'CS-304', grade: 'A+', score: '98/100', type: 'success' },
        { id: 3, subject: 'Computer Networks', code: 'CS-302', grade: 'B+', score: '85/100', type: 'warning' },
    ],

    engagementData: {
        attendance: {
            labels: ['DSA', 'DBMS', 'OS', 'Math', 'Web'],
            datasets: [
                {
                    data: [92, 75, 83, 76, 88],
                    label: 'Attendance %',
                    color: '#2563eb'
                }
            ]
        },
        taskCompletion: {
            labels: ['Completed', 'Pending', 'Overdue'],
            data: [68, 22, 10],
            colors: ['#10b981', '#f59e0b', '#ef4444']
        },
        activity: Array.from({ length: 365 }, (_, i) => ({
            level: Math.floor(Math.random() * 5),
            date: new Date(2024, 0, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            tasks: [
                'Attended: Data Structures Class',
                'Submitted: Weekly Quiz 4',
                'Completed: 2 Library coding hours',
                'Forum Post: React Hooks discussion'
            ].slice(0, Math.floor(Math.random() * 4) + 1)
        }))
    }
};

// HeatMap Component
const ActivityHeatMap = ({ data }) => {
    const [hoveredDay, setHoveredDay] = React.useState(null);
    const [selectedYear, setSelectedYear] = React.useState('2024');
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const monthData = [];
    for (let i = 0; i < 12; i++) {
        monthData.push(data.slice(i * 30, (i + 1) * 30));
    }

    const getColor = (value) => {
        switch (value) {
            case 0: return '#f1f5f9';
            case 1: return '#bfdbfe';
            case 2: return '#60a5fa';
            case 3: return '#2563eb';
            case 4: return '#1e3a8a';
            default: return '#f1f5f9';
        }
    };

    return (
        <div className="heatmap-card" style={{
            background: 'white',
            borderRadius: '24px',
            border: '1px solid #f1f5f9',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: '22px',
                        fontWeight: 800,
                        color: '#0f172a',
                        letterSpacing: '-0.025em'
                    }}>
                        Academic Activity
                    </h3>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            style={{
                                appearance: 'none',
                                padding: '8px 40px 8px 16px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#f8fafc',
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#475569',
                                cursor: 'pointer',
                                outline: 'none',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        >
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                        <div style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            color: '#94a3b8'
                        }}>
                            <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} />
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    background: '#f8fafc',
                    padding: '10px 18px',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    flexShrink: 0
                }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Less</span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {[0, 1, 2, 3, 4].map(v => (
                            <div key={v} style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: getColor(v),
                                borderRadius: '3px',
                                border: '1px solid rgba(15, 23, 42, 0.05)'
                            }} />
                        ))}
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>More</span>
                </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div style={{
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch',
                msOverflowStyle: '-ms-autohiding-scrollbar',
                paddingBottom: '12px',
                marginBottom: '-12px'
            }}>
                <div style={{
                    display: 'flex',
                    minWidth: '1200px',
                    padding: '10px 0'
                }}>
                    {months.map((month, mIdx) => (
                        <div key={month} style={{
                            width: '100px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flexShrink: 0
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateRows: 'repeat(7, 12px)',
                                gridAutoFlow: 'column',
                                gap: '4px'
                            }}>
                                {monthData[mIdx] && monthData[mIdx].map((day, dIdx) => (
                                    <div
                                        key={dIdx}
                                        style={{
                                            width: '12px',
                                            height: '12px',
                                            backgroundColor: getColor(day.level),
                                            borderRadius: '3px',
                                            border: '1px solid #e2e8f0',
                                            transition: 'all 0.1s ease',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            boxSizing: 'border-box'
                                        }}
                                        onMouseEnter={(e) => {
                                            setHoveredDay(day);
                                            setMousePos({ x: e.clientX, y: e.clientY });
                                        }}
                                        onMouseMove={(e) => {
                                            setMousePos({ x: e.clientX, y: e.clientY });
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredDay(null);
                                        }}
                                    />
                                ))}
                            </div>
                            <span style={{
                                fontSize: '11px',
                                color: '#94a3b8',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                whiteSpace: 'nowrap'
                            }}>
                                {month}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {hoveredDay && (
                <div style={{
                    position: 'fixed',
                    top: `${mousePos.y + 15}px`,
                    left: `${mousePos.x + 15}px`,
                    background: 'rgba(15, 23, 42, 0.98)',
                    backdropFilter: 'blur(12px)',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    zIndex: 100,
                    width: '300px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    pointerEvents: 'none',
                    transition: 'top 0.1s ease-out, left 0.1s ease-out'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
                        <span style={{ fontWeight: 700, fontSize: '15px' }}>{hoveredDay.date}, {selectedYear}</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8', background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: '8px', fontWeight: 700 }}>
                            {hoveredDay.level === 0 ? 'REST DAY' : `LVL ${hoveredDay.level}`}
                        </span>
                    </div>

                    {hoveredDay.level === 0 ? (
                        <div style={{ fontSize: '13.5px', color: '#94a3b8', textAlign: 'center', padding: '12px 0', fontWeight: 500 }}>
                            No contribution has done for day
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {hoveredDay.tasks.map((task, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                                    <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)' }} />
                                    {task}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Scrollbar Styles */}
            <style>
                {`
                    .heatmap-card > div::-webkit-scrollbar {
                        height: 6px;
                    }
                    
                    .heatmap-card > div::-webkit-scrollbar-track {
                        background: #f1f5f9;
                        border-radius: 3px;
                        margin: 0 10px;
                    }
                    
                    .heatmap-card > div::-webkit-scrollbar-thumb {
                        background: #cbd5e1;
                        border-radius: 3px;
                    }
                    
                    .heatmap-card > div::-webkit-scrollbar-thumb:hover {
                        background: #94a3b8;
                    }
                `}
            </style>

        </div>
    );
};

const BarChart = ({ data }) => {
    const baseline = 100;
    return (
        <div style={{ padding: '24px 0 10px 0', marginTop: '25px' }}>
            {/* Added Scroll Container specifically for the bars */}
            <div style={{ 
                width: '100%', 
                overflowX: 'auto', 
                WebkitOverflowScrolling: 'touch',
                paddingBottom: '20px'
            }} className="barchart-scroll">
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    height: '180px',
                    gap: '20px',
                    paddingBottom: '30px',
                    borderBottom: '1px solid #f1f5f9',
                    position: 'relative',
                    minWidth: 'max-content', // This ensures it doesn't shrink on mobile
                    paddingRight: '10px'
                }}>
                    {data.labels.map((label, index) => {
                        const value = data.datasets[0].data[index];
                        const height = (value / baseline) * 100;
                        return (
                            <div key={index} style={{
                                width: '50px', // Fixed width per bar to allow horizontal scrolling
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: '100%',
                                justifyContent: 'flex-end',
                                position: 'relative',
                                flexShrink: 0
                            }}>
                                <div style={{ position: 'absolute', bottom: 0, width: '32px', height: '100%', backgroundColor: '#f1f5f9', borderRadius: '6px', zIndex: 1 }} />
                                <div style={{
                                    width: '32px',
                                    height: `${height}%`,
                                    backgroundColor: data.datasets[0].color,
                                    borderRadius: '6px',
                                    transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    zIndex: 2,
                                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                                }}>
                                    <span style={{ position: 'absolute', top: '-25px', fontSize: '12px', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap' }}>
                                        {value}%
                                    </span>
                                </div>
                                <span style={{ position: 'absolute', bottom: '-25px', fontSize: '11px', color: '#64748b', fontWeight: 700, textAlign: 'center', width: 'max-content' }}>
                                    {label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>Attendance by Subject</span>
                <div style={{ fontSize: '13px', color: '#22c55e', backgroundColor: '#f0fdf4', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <TrendingUp size={14} /> +2.4%
                </div>
            </div>
            <style>{`
                .barchart-scroll::-webkit-scrollbar { height: 4px; }
                .barchart-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

const DonutChart = ({ data }) => {
    const total = data.data.reduce((a, b) => a + b, 0);
    let accumulatedAngle = 0;
    return (
        <div style={{ padding: '8px 4px' }}>
            <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto' }}>
                <svg width="150" height="150" viewBox="0 0 100 100">
                    {data.data.map((value, index) => {
                        const percentage = (value / total) * 100;
                        const angle = (percentage / 100) * 360;
                        const startAngle = accumulatedAngle;
                        const endAngle = startAngle + angle;
                        accumulatedAngle = endAngle;
                        const startRad = (startAngle - 90) * (Math.PI / 180);
                        const endRad = (endAngle - 90) * (Math.PI / 180);
                        const x1 = 50 + 40 * Math.cos(startRad);
                        const y1 = 50 + 40 * Math.sin(startRad);
                        const x2 = 50 + 40 * Math.cos(endRad);
                        const y2 = 50 + 40 * Math.sin(endRad);
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        return (
                            <path key={index} d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`} fill={data.colors[index]} stroke="white" strokeWidth="2" />
                        );
                    })}
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#111827' }}>{data.data[0]}%</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Completed</div>
                </div>
            </div>
            <div style={{ marginTop: '16px' }}>
                {data.labels.map((label, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f9fafb' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: data.colors[index] }} />
                            <span style={{ fontSize: '13px', color: '#111827', fontWeight: 500 }}>{label}</span>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{data.data[index]}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StudentDashboard = () => {
    return (
        <div className="dashboard-wrapper">
            <style>{`
                .dashboard-wrapper {
                    background-color: #f9fafb;
                    min-height: 100vh;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    color: #111827;
                    padding: 24px;
                    max-width: 1920px;
                    margin: 0 auto;
                }
                .header h1 { font-size: 24px; font-weight: 600; margin-bottom: 32px; color: #374151; letter-spacing: -0.02em; }
                
                .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 40px; }
                .stat-card { 
                    background: white; 
                    padding: 28px 24px; 
                    border-radius: 16px; 
                    border: 1px solid #e5e7eb; 
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 12px rgba(0,0,0,0.08);
                    border-color: #d1d5db;
                }
                .stat-top { display: flex; justify-content: space-between; color: #6b7280; margin-bottom: 16px; font-size: 15px; font-weight: 500; }
                .stat-val { font-size: 36px; font-weight: 700; display: flex; align-items: center; gap: 10px; line-height: 1; }
                .stat-sub { font-size: 14px; color: #9ca3af; margin-top: 8px; }
                .pill-green { background: #dcfce7; color: #166534; font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 600; }
                .pill-blue { background: #dbeafe; color: #1e40af; font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 600; }

                .main-grid { 
                    display: grid; 
                    grid-template-columns: 1fr 480px; 
                    gap: 32px; 
                    align-items: start;
                }
                .left-content {
                    position: sticky;
                    top: 4px;
                    align-self: start;
                }

                @media (max-width: 1200px) {
                    .main-grid { grid-template-columns: 1fr; }
                    .stats-row { grid-template-columns: repeat(2, 1fr); }
                    .left-content { position: relative; top: 0; }
                }

                @media (max-width: 768px) {
                    .dashboard-wrapper { padding: 16px; }
                    .header h1 { font-size: 20px; margin-bottom: 24px; }
                    .stats-row { grid-template-columns: 1fr; gap: 16px; }
                    .class-card { flex-direction: column; align-items: flex-start; gap: 16px; }
                    .class-card .actions { width: 100%; }
                    .class-card .actions button { width: 100%; justify-content: center; }
                    .stat-val { font-size: 28px; }
                    .section-label { flex-direction: column; align-items: flex-start; gap: 12px; }
                    .section-label button { width: 100%; justify-content: center; }
                }
                
                .section-label { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
                .section-label h2 { font-size: 20px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
                .section-label p { font-size: 14px; color: #6b7280; margin-top: 4px; }

                .class-card { 
                    background: white; 
                    border: 1px solid #e5e7eb; 
                    border-radius: 16px; 
                    padding: 24px 28px; 
                    margin-bottom: 16px; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center;
                    transition: all 0.2s ease;
                }
                .class-card:hover {
                    border-color: #3b82f6;
                    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.12);
                }
                .class-info-top { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; flex-wrap: wrap; }
                .class-name { font-weight: 700; font-size: 16px; }
                .meta-row { display: flex; gap: 20px; font-size: 14px; color: #6b7280; flex-wrap: wrap; }
                .status-badge { font-size: 13px; padding: 4px 12px; border-radius: 6px; font-weight: 600; }
                .status-pending { background: #eff6ff; color: #2563eb; }
                .status-progress { background: #ecfdf5; color: #059669; }
                .status-completed { background: #f3f4f6; color: #6b7280; }

                .btn-primary { 
                    background: #2563eb; 
                    color: white; 
                    border: none; 
                    padding: 10px 20px; 
                    border-radius: 10px; 
                    font-size: 15px; 
                    font-weight: 600; 
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }

                .sidebar-card { 
                    background: white; 
                    border: 1px solid #e5e7eb; 
                    border-radius: 16px; 
                    padding: 24px; 
                    margin-bottom: 28px;
                }
                .sb-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .sb-title h3 { font-size: 17px; font-weight: 700; margin: 0; }
                .graph-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 24px;
                }

                .table-card { 
                    background: white; 
                    border: 1px solid #e5e7eb; 
                    border-radius: 16px; 
                    overflow-x: auto; 
                }
                .data-table { width: 100%; border-collapse: collapse; min-width: 500px; }
                .data-table th { 
                    background: #f9fafb; 
                    text-align: left; 
                    padding: 16px 20px; 
                    font-size: 13px; 
                    color: #6b7280; 
                    text-transform: uppercase; 
                    font-weight: 700; 
                    border-bottom: 1px solid #e5e7eb; 
                }
                .data-table td { padding: 16px 20px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
                .badge-flat { font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 8px; border-radius: 6px; }
                .type-success { color: #059669; background: #f0fdf4; }
                .type-warning { color: #d97706; background: #fffbeb; }

                .action-row { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 14px 0; 
                    border-bottom: 1px solid #f9fafb; 
                    cursor: pointer;
                }
                .action-row:last-child { border: none; }
                .at-text { font-size: 14px; font-weight: 600; }
                .as-text { font-size: 12px; color: #9ca3af; }
            `}</style>

            <header className="header">
                <h1>Overview of today's classes, attendance, and pending tasks</h1>
            </header>

            <div className="stats-row">
                {STATIC_DATA.stats.map(s => (
                    <div className="stat-card" key={s.id}>
                        <div className="stat-top">
                            <span>{s.label}</span>
                            <span style={{ color: '#d1d5db' }}>{s.icon}</span>
                        </div>
                        <div className="stat-val">
                            {s.value}
                            {s.badge && <span className={s.badge === 'Urgent' ? 'pill-blue' : 'pill-green'}>{s.badge}</span>}
                        </div>
                        <div className="stat-sub">{s.sub}</div>
                    </div>
                ))}
            </div>

            <div style={{ width: '100%', margin: '0 auto 40px auto' }}>
                <ActivityHeatMap data={STATIC_DATA.engagementData.activity} />
            </div>

            <div className="main-grid">
                <div className="left-content">
                    <div className="section-label">
                        <div>
                            <h2>Today's Schedule</h2>
                            <p>Upcoming classes and sessions</p>
                        </div>
                        <button className="btn-primary" onClick={() => window.location.hash = '#/roadmap'}>
                            <BookOpen size={18} /> View Roadmap
                        </button>
                    </div>

                    <div className="schedule-list">
                        {STATIC_DATA.schedule.map(c => (
                            <div className="class-card" key={c.id}>
                                <div>
                                    <div className="class-info-top">
                                        <span className="class-name">{c.id} {c.name}</span>
                                        <span className={`status-badge status-${c.statusType}`}>{c.status}</span>
                                    </div>
                                    <div className="meta-row">
                                        <span><Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {c.time}</span>
                                        <span><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {c.loc}</span>
                                        <span><Users size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {c.faculty}</span>
                                    </div>
                                </div>
                                <div className="actions">
                                    <button className="btn-primary" style={{ backgroundColor: 'white', color: '#2563eb', border: '1px solid #e5e7eb' }}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="section-label" style={{ marginTop: '40px' }}>
                        <div>
                            <h2>Assignments & Tasks</h2>
                            <p>Recent tasks requiring your attention</p>
                        </div>
                    </div>

                    <div className="table-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Assignment Name</th>
                                    <th>Subject</th>
                                    <th>Deadline</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {STATIC_DATA.tasks.map(t => (
                                    <tr key={t.id}>
                                        <td><span style={{ fontWeight: 700 }}>{t.name}</span></td>
                                        <td>{t.subject}</td>
                                        <td>{t.deadline}</td>
                                        <td>
                                            <span className={`badge-flat ${t.status === 'completed' ? 'type-success' : 'type-warning'}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="sidebar">
                    <div className="graph-card">
                        <div className="sb-title">
                            <h3>Attendance Engagement</h3>
                            <BarChart3 size={18} color="#2563eb" />
                        </div>
                        <BarChart data={STATIC_DATA.engagementData.attendance} />
                    </div>

                    <div className="graph-card">
                        <div className="sb-title">
                            <h3>Task Completion</h3>
                            <PieChart size={18} color="#10b981" />
                        </div>
                        <DonutChart data={STATIC_DATA.engagementData.taskCompletion} />
                    </div>

                    <div className="sidebar-card">
                        <div className="sb-title">
                            <h3>Recent Grades</h3>
                            <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}>View All</span>
                        </div>
                        <div className="action-list">
                            {STATIC_DATA.grades.map(g => (
                                <div className="action-row" key={g.id}>
                                    <div>
                                        <div className="at-text">{g.subject}</div>
                                        <div className="as-text">{g.code} • {g.score}</div>
                                    </div>
                                    <div className={`badge-flat type-${g.type}`} style={{ borderRadius: '4px', padding: '2px 6px' }}>{g.grade}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
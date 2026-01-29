import React, { useState, useRef, useEffect, useMemo } from 'react';
import { apiGet } from '../../../../../utils/api';

// --- SVGs & Icons ---
const Icons = {
  Faculty: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Venue: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Star: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Clock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  EmptyState: () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
      <path d="M20 12V8a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h6" />
      <path d="M12 11l-4-4m0 8l4-4m4 4l4-4m-4 0l4 4" />
      <circle cx="18" cy="18" r="4" />
    </svg>
  ),
};

const TaskGrade = ({ studentId }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const TODAY = new Date().toISOString().split('T')[0];

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [studentData, setStudentData] = useState(null);
  const [viewingWorkshop, setViewingWorkshop] = useState(null);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [performancePage, setPerformancePage] = useState(0);
  const [historyPage, setHistoryPage] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, date: '', points: 0, day: '' });
  
  const topRef = useRef(null);
  const PERF_LIMIT = 6;
  const HIST_LIMIT = 5;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (studentId) fetchTaskGradeData();
  }, [studentId]);

  useEffect(() => {
    if (studentData?.currentWorkshop) setViewingWorkshop(studentData.currentWorkshop);
  }, [studentData]);

  const fetchTaskGradeData = async () => {
    setLoading(true);
    try {
      const response = await apiGet(`/students/${studentId}/task-grade`);
      const data = await response.json();
      if (data.success) setStudentData(data.data);
    } catch (err) {
      console.error('Error fetching task grade:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });

  const activityLog = useMemo(() => {
    if (!studentData) return {};
    const log = {};
    const allWorkshops = [studentData.currentWorkshop, ...studentData.history].filter(Boolean);
    allWorkshops.forEach((workshop) => {
      workshop.tasks.forEach((task) => {
        log[task.date] = (log[task.date] || 0) + task.points;
      });
    });
    return log;
  }, [studentData]);

  const currentDayInfo = useMemo(() => {
    if (!studentData?.currentWorkshop) return 'N/A';
    const task = studentData.currentWorkshop.tasks.find((t) => t.date === TODAY);
    return task ? `Day ${String(task.day).padStart(2, '0')}` : 'N/A';
  }, [studentData]);

  const handleWorkshopSelection = (workshop, dateToHighlight = null) => {
    setViewingWorkshop(workshop);
    setPerformancePage(0);
    if (dateToHighlight) {
      const index = workshop.tasks.findIndex((t) => t.date === dateToHighlight);
      setPerformancePage(Math.floor(index / PERF_LIMIT));
      setSelectedDate(dateToHighlight);
    } else {
      setSelectedDate(null);
    }
    scrollToTop();
  };

  const handleHeatMapClick = (dateStr) => {
    if (!studentData) return;
    const allWorkshops = [studentData.currentWorkshop, ...studentData.history].filter(Boolean);
    const foundWorkshop = allWorkshops.find((w) => w.tasks.some((t) => t.date === dateStr));
    if (foundWorkshop) handleWorkshopSelection(foundWorkshop, dateStr);
  };

  const handleHeatMapHover = (e, dateStr, points) => {
    if (isMobile) return; // Tooltips are annoying on touch devices
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, date: `${dayName}, ${monthName} ${dayNum}`, points: points });
  };

  const handleHeatMapMove = (e) => {
    if (tooltip.visible) setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
  };

  const handleHeatMapLeave = () => setTooltip({ visible: false, x: 0, y: 0, date: '', points: 0 });

  const getHeatColor = (points) => {
    if (!points || points === 0) return '#f8fafc';
    if (points < 35) return '#dbeafe';
    if (points < 45) return '#60a5fa';
    return '#2563eb';
  };

  const styles = {
    container: { fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#F8FAFF', padding: isMobile ? '12px' : '15px', minHeight: '100vh', color: '#1e293b', borderRadius: '10px' },
    headerCard: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: isMobile ? '24px' : '32px',
      borderLeft: '6px solid #2563eb',
      boxShadow: '0 4px 20px rgba(37, 99, 235, 0.05)',
      marginBottom: '35px',
      position: 'relative',
      border: '1px solid #f1f5f9',
      display: 'flex',
      flexDirection: 'column'
    },
    badgeDay: {
      position: isMobile ? 'static' : 'absolute',
      top: '25px',
      right: '25px',
      alignSelf: isMobile ? 'flex-start' : 'auto',
      backgroundColor: '#eff6ff',
      color: '#1d4ed8',
      padding: '10px 18px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '800',
      textAlign: 'center',
      border: '1px solid #dbeafe',
      marginBottom: isMobile ? '20px' : '0'
    },
    sectionTitle: { fontSize: isMobile ? '18px' : '20px', fontWeight: '800', marginBottom: '24px', color: '#0f172a' },
    perfCard: (isActive, isLocked) => ({
      backgroundColor: isActive ? '#f0f7ff' : '#fff',
      border: isActive ? '2px solid #3b82f6' : '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '24px',
      opacity: isLocked ? 0.5 : 1,
      transition: 'all 0.3s ease',
    }),
    returnBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', fontSize: '12px', fontWeight: '700', cursor: 'pointer', marginBottom: '16px', width: 'fit-content' },
    heatMapWrapper: { backgroundColor: '#fff', padding: isMobile ? '20px' : '30px', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative' },
    navBtn: { padding: '8px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
    tooltip: { position: 'fixed', backgroundColor: '#1e293b', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', pointerEvents: 'none', zIndex: 9999, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', whiteSpace: 'nowrap', transform: 'translate(10px, -50%)' },
  };

  if (loading || !studentData) {
    return <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>Loading data...</div>;
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const renderHeatMap = () => (
    <div style={styles.heatMapWrapper}>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '25px', gap: '15px' }}>
        <span style={styles.sectionTitle}>Engagement Activity</span>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: '600', width: isMobile ? '100%' : 'auto' }}
        >
          <option value={new Date().getFullYear()}>Year {new Date().getFullYear()}</option>
          <option value={new Date().getFullYear() - 1}>Year {new Date().getFullYear() - 1}</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {months.map((month, mIdx) => {
          const daysInMonth = new Date(selectedYear, mIdx + 1, 0).getDate();
          return (
            <div key={month} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 13px)', gridAutoFlow: 'column', gap: '4px' }}>
                {[...Array(daysInMonth)].map((_, d) => {
                  const dateStr = `${selectedYear}-${String(mIdx + 1).padStart(2, '0')}-${String(d + 1).padStart(2, '0')}`;
                  const pts = activityLog[dateStr] || 0;
                  return (
                    <div
                      key={d}
                      onClick={() => handleHeatMapClick(dateStr)}
                      onMouseEnter={(e) => handleHeatMapHover(e, dateStr, pts)}
                      onMouseMove={handleHeatMapMove}
                      onMouseLeave={handleHeatMapLeave}
                      style={{ width: '13px', height: '13px', backgroundColor: getHeatColor(pts), borderRadius: '3px', cursor: pts > 0 ? 'pointer' : 'default', border: pts > 0 ? 'none' : '1px solid #f1f5f9' }}
                    />
                  );
                })}
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textAlign: 'center' }}>{month}</span>
            </div>
          );
        })}
      </div>
      {tooltip.visible && <div style={{ ...styles.tooltip, left: `${tooltip.x}px`, top: `${tooltip.y}px` }}><div>{tooltip.date}</div><div style={{ marginTop: '2px', color: '#94a3b8' }}>{tooltip.points} pts</div></div>}
    </div>
  );

  const isShowingCurrent = viewingWorkshop?.id === studentData.currentWorkshop?.id;
  const hasData = studentData.currentWorkshop || (studentData.history && studentData.history.length > 0);

  return (
    <div style={styles.container} ref={topRef}>
      {!hasData ? (
        <div style={styles.noRecords}>
          <Icons.EmptyState /><h2 style={{ marginTop: '15px', color: '#475569' }}>No Learning Records</h2>
          <p style={{ maxWidth: '300px', fontSize: '14px', lineHeight: '1.6' }}>Enrol in workshops to track your progress.</p>
        </div>
      ) : (
        <>
          <div style={styles.headerCard}>
            {!isShowingCurrent && studentData.currentWorkshop && (
              <div style={styles.returnBtn} onClick={() => handleWorkshopSelection(studentData.currentWorkshop)}><Icons.ArrowLeft /> Back</div>
            )}
            {isShowingCurrent && <div style={styles.badgeDay}>CURRENT DAY<br /><span style={{ fontSize: '16px', fontWeight: '900' }}>{currentDayInfo}</span></div>}
            <h1 style={{ margin: '0 0 24px 0', fontSize: isMobile ? '22px' : '28px', fontWeight: '900', lineHeight: '1.2' }}>{viewingWorkshop?.title}</h1>
            <div style={{ display: 'flex', gap: isMobile ? '20px' : '40px', flexWrap: 'wrap' }}>
              <div><div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900', marginBottom: '4px' }}>FACULTY</div><div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}><Icons.Faculty /> {viewingWorkshop?.faculty}</div></div>
              <div><div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900', marginBottom: '4px' }}>VENUE</div><div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}><Icons.Venue /> {viewingWorkshop?.venue || 'Archive'}</div></div>
              <div><div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900', marginBottom: '4px' }}>DURATION</div><div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}><Icons.Calendar /> {viewingWorkshop?.duration || viewingWorkshop?.date}</div></div>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>Daily Performance Log</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
            {viewingWorkshop?.tasks.slice(performancePage * PERF_LIMIT, (performancePage + 1) * PERF_LIMIT).map((task) => {
              const isActive = task.date === selectedDate;
              const isLocked = task.status === 'Upcoming';
              return (
                <div key={task.day} style={styles.perfCard(isActive, isLocked)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '900' }}>DAY {String(task.day).padStart(2, '0')}</span>
                    {task.points > 0 ? <span style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: '11px', padding: '5px 12px', borderRadius: '25px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Star /> {task.points} Pts</span> : <span style={{ color: '#64748b', fontSize: '11px', background: '#f8fafc', padding: '5px 12px', borderRadius: '25px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Clock /> {isLocked ? 'Locked' : 'Active'}</span>}
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '18px', marginBottom: '25px', lineHeight: '1.4' }}>{task.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>Grade</div><div style={{ fontWeight: '900', fontSize: '18px', color: task.grade === 'A+' ? '#059669' : '#2563eb' }}>{task.grade}</div></div>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '800' }}>Status</div><div style={{ fontWeight: '800', fontSize: '14px', color: isActive ? '#2563eb' : '#334155', marginTop: '4px' }}>{task.status}</div></div>
                  </div>
                </div>
              );
            })}
          </div>
          {viewingWorkshop?.tasks.length > PERF_LIMIT && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', color: '#64748b', fontSize: '13px', alignItems: 'center' }}>
              <span>{performancePage * PERF_LIMIT + 1}-{Math.min((performancePage + 1) * PERF_LIMIT, viewingWorkshop.tasks.length)} of {viewingWorkshop.tasks.length}</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={styles.navBtn} disabled={performancePage === 0} onClick={() => setPerformancePage((p) => p - 1)}>Prev</button>
                <button style={styles.navBtn} disabled={(performancePage + 1) * PERF_LIMIT >= viewingWorkshop.tasks.length} onClick={() => setPerformancePage((p) => p + 1)}>Next</button>
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: '50px' }}>{renderHeatMap()}</div>

      <h3 style={{ ...styles.sectionTitle, marginTop: '60px' }}>History & Event Log</h3>
      <div>
        {studentData.history.slice(historyPage * HIST_LIMIT, (historyPage + 1) * HIST_LIMIT).map((item) => (
          <div key={item.id} style={{ backgroundColor: '#fff', padding: isMobile ? '20px' : '24px 30px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '16px', cursor: 'pointer', gap: '15px' }} onClick={() => handleWorkshopSelection(item)}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: '900', fontSize: '16px', marginBottom: '4px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{item.title}</div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{item.date} • {item.duration}</div>
            </div>
            <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '8px 18px', borderRadius: '40px', fontWeight: '900', fontSize: '11px', whiteSpace: 'nowrap' }}>{item.grade} • {item.points} Pts</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', color: '#64748b', fontSize: '13px', alignItems: 'center' }}>
        <span>{historyPage * HIST_LIMIT + 1}-{Math.min((historyPage + 1) * HIST_LIMIT, studentData.history.length)} of {studentData.history.length}</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={styles.navBtn} disabled={historyPage === 0} onClick={() => setHistoryPage((p) => p - 1)}>Prev</button>
          <button style={styles.navBtn} disabled={(historyPage + 1) * HIST_LIMIT >= studentData.history.length} onClick={() => setHistoryPage((p) => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default TaskGrade;
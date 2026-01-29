import React, { useState, useEffect, useMemo, useRef } from 'react';
import { apiGet } from '../../../../../utils/api';
import { BorderAllRounded, RoundedCorner } from '@mui/icons-material';

const Overview = ({ studentId }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [studentData, setStudentData] = useState(null);
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const [showSkillToggle, setShowSkillToggle] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [hoveredPerf, setHoveredPerf] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [countTotal, setCountTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // --- Responsive State ---
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const skillContainerRef = useRef(null);

  const circ = 377;
  
  const completedPct = useMemo(() => {
    if (!studentData) return 0;
    return (studentData.taskStatus.completed / studentData.taskStatus.total) * circ;
  }, [studentData]);

  const progressPct = useMemo(() => {
    if (!studentData) return 0;
    return (studentData.taskStatus.inProgress / studentData.taskStatus.total) * circ;
  }, [studentData]);

  const linePath = useMemo(() => {
    if (!studentData?.weeklyActivity || studentData.weeklyActivity.length === 0) return 'M0,160';
    
    return studentData.weeklyActivity
      .map((d, i) => {
        const x = (i * 100) / Math.max(1, studentData.weeklyActivity.length - 1);
        const y = 160 - (d.value || 0) * 1.5;
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
  }, [studentData?.weeklyActivity]);

  useEffect(() => {
    if (studentId) {
      fetchOverviewData();
    }
  }, [studentId]);

  useEffect(() => {
    if (studentData) {
      setAnimated(true);
      let startTotal = 0;
      const duration = 1500;
      const interval = 20;
      const stepTotal = studentData.taskStatus.total / (duration / interval);

      const timer = setInterval(() => {
        startTotal += stepTotal;
        if (startTotal >= studentData.taskStatus.total) {
          setCountTotal(studentData.taskStatus.total);
          clearInterval(timer);
        } else {
          setCountTotal(Math.floor(startTotal));
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [studentData]);

  useEffect(() => {
    if (skillContainerRef.current && studentData) {
      const { scrollHeight } = skillContainerRef.current;
      if (scrollHeight > 92) {
        setShowSkillToggle(true);
      }
    }
  }, [studentData]);

  const fetchOverviewData = async () => {
    setLoading(true);
    try {
      const response = await apiGet(`/students/${studentId}/overview`);

      const data = await response.json();
      if (data.success) {
        setStudentData(data.data);
      }
    } catch (err) {
      console.error('Error fetching overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const toRoman = (num) => {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
    return romanNumerals[num - 1] || num;
  };

  const getLevel = (rating) => Math.ceil(rating / 20);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
        Loading overview data...
      </div>
    );
  }

  if (!studentData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
        No data available
      </div>
    );
  }

  return (
    <div style={{...styles.container, padding: isMobile ? '10px' : '15px'}} onMouseMove={handleMouseMove}>
      <style>{keyframes}</style>

      {hoveredPerf && !isMobile && (
        <div style={{ ...styles.mouseTooltip, left: mousePos.x + 15, top: mousePos.y - 40 }}>
          <div style={{ fontWeight: '800', marginBottom: '4px' }}>{hoveredPerf.subject}</div>
          <div style={{ color: '#2563eb' }}>You: {hoveredPerf.individual}%</div>
          <div style={{ color: '#94a3b8' }}>Avg: {hoveredPerf.average}%</div>
        </div>
      )}

      <div style={styles.layoutWrapper}>
        <div style={styles.mainColumn}>
          
          {/* Stats Row */}
          <div style={{...styles.statsRow, gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)'}}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>OVERALL ATTENDANCE</p>
              <h2 style={styles.statValue}>{studentData.overview.overallAttendance}%</h2>
              <p style={styles.statSubtext}>Class Average: {studentData.overview.classAverage}%</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>TASK COMPLETION</p>
              <h2 style={styles.statValue}>{studentData.overview.taskCompletion}%</h2>
              <p style={styles.statSubtext}>{studentData.overview.tasksSubmitted} Submitted</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>CGPA</p>
              <h2 style={styles.statValue}>{studentData.overview.cgpa}</h2>
              <p style={styles.statSubtext}>{studentData.overview.cgpaRank}</p>
            </div>
          </div>

          {/* Skills Section */}
          <div style={{...styles.card, padding: isMobile ? '20px' : '30px'}}>
            <h3 style={styles.cardTitle}>Skills Acquired</h3>
            <div
              ref={skillContainerRef}
              style={{
                ...styles.skillsGrid,
                maxHeight: skillsExpanded ? 'none' : '92px',
                overflow: 'hidden',
                transition: 'max-height 0.4s ease',
              }}
            >
              {studentData.skills.map((skill, index) => (
                <div key={index} style={styles.skillTablet}>
                  <span style={styles.skillName}>{skill.name}</span>
                  <span style={styles.skillLevelBadge}>Lvl {getLevel(skill.rating)}</span>
                </div>
              ))}
            </div>
            {showSkillToggle && (
              <div style={styles.expandRow}>
                <button style={styles.expandBtn} onClick={() => setSkillsExpanded(!skillsExpanded)}>
                  {skillsExpanded ? 'Show Less' : 'View All Skills'}
                </button>
              </div>
            )}
          </div>

          {/* Charts Row */}
          <div style={{...styles.chartsRow, flexDirection: isMobile ? 'column' : 'row'}}>
            {/* Activity Trend */}
            <div style={{ ...styles.card, flex: 2, padding: isMobile ? '20px' : '30px' }}>
              <h3 style={styles.cardTitle}>Daily Activity Trends</h3>
              <div style={styles.chartSpace}>
                <svg width="100%" height="180" style={{ overflow: 'visible' }}>
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: 1000,
                      strokeDashoffset: animated ? 0 : 1000,
                      transition: 'stroke-dashoffset 2s ease-in-out',
                    }}
                  />
                  {studentData.weeklyActivity.map((d, i) => (
                    <circle
                      key={i}
                      cx={`${(i * 100) / (studentData.weeklyActivity.length - 1)}%`}
                      cy={160 - d.value * 1.5}
                      r={4.5}
                      fill="#2563eb"
                    />
                  ))}
                </svg>
                <div style={styles.chartLabels}>
                  {studentData.weeklyActivity.map((d, i) => (
                    <span key={i} style={styles.xLabel}>{d.day}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Task Status Donut */}
            <div style={{ ...styles.card, flex: 1, textAlign: 'center', padding: isMobile ? '20px' : '30px' }}>
              <h3 style={{ ...styles.cardTitle, textAlign: 'left' }}>Task Status</h3>
              <div style={styles.donutWrapper}>
                <svg width="140" height="140" viewBox="0 0 150 150">
                  <circle cx="75" cy="75" r="60" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                  <circle cx="75" cy="75" r="60" fill="none" stroke="#2563eb" strokeWidth="16"
                    strokeDasharray={`${completedPct} ${circ}`}
                    transform="rotate(-90 75 75)"
                    style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                  />
                  <circle cx="75" cy="75" r="60" fill="none" stroke="#93c5fd" strokeWidth="16"
                    strokeDasharray={`${progressPct} ${circ}`}
                    strokeDashoffset={`-${completedPct}`}
                    transform="rotate(-90 75 75)"
                    style={{ transition: 'stroke-dasharray 1.5s ease-out 0.3s' }}
                  />
                  <text x="75" y="72" textAnchor="middle" fontSize="32" fontWeight="900" fill="#1e293b">{countTotal}</text>
                  <text x="75" y="92" textAnchor="middle" fontSize="10" fontWeight="800" fill="#94a3b8">TASKS</text>
                </svg>
              </div>
              <div style={styles.legend}>
                <div style={styles.legendItem}><div style={{ ...styles.dot, backgroundColor: '#2563eb' }} /> <span>Done</span></div>
                <div style={styles.legendItem}><div style={{ ...styles.dot, backgroundColor: '#93c5fd' }} /> <span>Progress</span></div>
              </div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div style={{ ...styles.card, padding: isMobile ? '20px' : '30px', ...(animated ? styles.animRise : {}) }}>
            <h3 style={styles.cardTitle}>Performance Analysis</h3>
            <div className="custom-scroll" style={styles.perfScrollContainer}>
              {studentData.performance.map((perf, index) => (
                <div key={index} style={styles.perfColumn}>
                  <div style={styles.barLabelGroup}>
                    <span style={styles.tinyLabel}>U</span>
                    <span style={styles.tinyLabel}>A</span>
                  </div>
                  <div style={{ ...styles.barFrame, backgroundColor: '#fcfdfe' }}>
                    <div style={{ ...styles.bar, backgroundColor: '#2563eb', height: animated ? `${perf.individual}%` : '0%'}} />
                    <div style={{ ...styles.bar, backgroundColor: '#cbd5e1', height: animated ? `${perf.average}%` : '0%'}} />
                  </div>
                  <p style={styles.subjectText}>{perf.subject}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#F8FAFF', minHeight: '100vh', borderRadius: '10px'},
  layoutWrapper: { maxWidth: '1400px', margin: '0 auto', display: 'flex' },
  mainColumn: { flex: 1, minWidth: 0 },
  mouseTooltip: { position: 'fixed', backgroundColor: '#fff', padding: '8px 14px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1.5px solid #f1f5f9', zIndex: 9999, fontSize: '12px', pointerEvents: 'none', display: 'flex', flexDirection: 'column' },
  statsRow: { display: 'grid', gap: '24px', marginBottom: '32px' },
  statCard: { backgroundColor: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
  statLabel: { fontSize: '10px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.8px', marginBottom: '10px' },
  statValue: { fontSize: '32px', fontWeight: '900', color: '#1e293b', marginBottom: '6px' },
  statSubtext: { fontSize: '13px', color: '#64748b', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #f1f5f9', marginBottom: '28px', boxShadow: '0 2px 15px rgba(0,0,0,0.01)' },
  cardTitle: { fontSize: '17px', fontWeight: '800', color: '#0f172a', marginBottom: '0', margin: 0 },
  skillsGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' },
  skillTablet: { display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', backgroundColor: '#fff', borderRadius: '10px', border: '1.5px solid #e2e8f0' },
  skillName: { fontSize: '12px', fontWeight: '700', color: '#334155' },
  skillLevelBadge: { fontSize: '9px', fontWeight: '900', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '10px' },
  expandRow: { display: 'flex', justifyContent: 'center', marginTop: '20px' },
  expandBtn: { background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '15px' },
  chartsRow: { display: 'flex', gap: '24px', marginBottom: '30px' },
  chartSpace: { marginTop: '25px' },
  chartLabels: { display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '0 5px' },
  xLabel: { fontSize: '10px', fontWeight: '800', color: '#cbd5e1' },
  donutWrapper: { margin: '20px auto', width: 'fit-content' },
  legend: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: '#64748b' },
  dot: { width: '10px', height: '10px', borderRadius: '10px' },
  perfScrollContainer: { display: 'flex', gap: '30px', overflowX: 'auto', padding: '25px 0 10px 0', scrollbarWidth: 'none' },
  perfColumn: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '75px' },
  barLabelGroup: { display: 'flex', gap: '6px', marginBottom: '8px' },
  tinyLabel: { fontSize: '8px', fontWeight: '900', color: '#cbd5e1' },
  barFrame: { height: '130px', width: '100%', borderRadius: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px', padding: '6px', transition: 'background 0.3s' },
  bar: { width: '12px', borderRadius: '10px', transition: 'height 1.2s cubic-bezier(0.17, 0.67, 0.83, 0.67)' },
  subjectText: { fontSize: '11px', fontWeight: '800', marginTop: '12px' },
  footerContainer: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' },
  footerPod: { textAlign: 'center', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', border: '1.5px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', boxSizing: 'border-box' },
  fLabel: { fontSize: '10px', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' },
  fValue: { fontSize: '20px', fontWeight: '900', color: '#1e293b' },
  animRise: { animation: 'fadeSlideUp 1s ease-out forwards' },
};

const keyframes = `
  @keyframes fadeSlideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .custom-scroll::-webkit-scrollbar { display: none; }
`;

export default Overview;
import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../../../store/useAuthStore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DoneIcon from '@mui/icons-material/Done';

const SUBJECT_SHADES = [
  "#2144BA", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", 
  "#06B6D4", "#F43F5E", "#10B981", "#6366F1", "#14B8A6"
];

const AttendanceDashboard = ({ studentId }) => {
  const { token } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [dashboardData, setDashboardData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnimate, setIsAnimate] = useState(false);
  const [hoveredData, setHoveredData] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [subPage, setSubPage] = useState(0);
  const [wsPage, setWsPage] = useState(0);
  const LIMIT = 5;

  useEffect(() => {
    if (token && studentId) {
      fetchAttendanceDashboard();
    }
  }, [token, studentId, selectedYear]);

  useEffect(() => {
    setIsAnimate(false);
    const timer = setTimeout(() => setIsAnimate(true), 100);
    return () => clearTimeout(timer);
  }, [dashboardData]);

  const fetchAttendanceDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/students/${studentId}/attendance-dashboard?year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
        const currentYear = new Date().getFullYear();
        setAvailableYears([currentYear.toString(), (currentYear - 1).toString()]);
      }
    } catch (err) {
      console.error('Error fetching attendance dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  if (loading || !dashboardData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
        Loading attendance data...
      </div>
    );
  }

  const paginatedSubjects = dashboardData.subjects.slice(subPage * LIMIT, (subPage + 1) * LIMIT);
  const paginatedSkills = dashboardData.skills.slice(wsPage * LIMIT, (wsPage + 1) * LIMIT);

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { background-color: #f8faff; font-family: 'Inter', sans-serif; padding: 15px; border-radius:10px; min-height: 100vh; color: #1e293b; overflow-x: hidden; }
        .section-grid { display: grid; gap: 20px; margin-bottom: 24px; width: 100%; grid-template-columns: 1fr; }
        
        /* Responsive Grid Logic */
        @media (min-width: 768px) {
          .top-stats { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
          .bottom-content { grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); }
        }

        @media (min-width: 1100px) {
          .middle-content { grid-template-columns: minmax(0, 2.5fr) 350px; }
        }

        .card { background: white; border-radius: 12px; padding: 20px; border: 1px solid #edf2f7; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02); display: flex; flex-direction: column; min-width: 0; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
        .header-title-lg { font-size: 18px; color: #1e293b; font-weight: 800; }
        .year-select { padding: 6px 12px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; font-weight: 600; cursor: pointer; outline: none; }
        
        .chart-scroll-wrapper { overflow-x: auto; padding-bottom: 10px; min-width: 0; -webkit-overflow-scrolling: touch; }
        .chart-container { height: 250px; display: flex; align-items: flex-end; gap: 24px; padding: 20px 10px 0 10px; min-width: 850px; border-bottom: 1px solid #f1f5f9; }
        .chart-col { display: flex; flex-direction: column; align-items: center; width: 60px; height: 100%; justify-content: flex-end; cursor: pointer; position: relative; }
        .bar-group { display: flex; align-items: flex-end; gap: 5px; height: 100%; }
        .bar { width: 14px; border-radius: 4px 4px 0 0; transition: height 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67); height: 0; }
        .bar-ac { background: #2144BA; }
        .bar-ws { background: #F59E0B; }
        .month-label { font-size: 11px; color: #94a3b8; font-weight: 700; margin-top: 10px; }
        
        .chart-tooltip { position: fixed; pointer-events: none; background: #1e293b; color: white; padding: 10px 14px; border-radius: 8px; font-size: 12px; z-index: 9999; box-shadow: 0 10px 15px rgba(0,0,0,0.2); transform: translate(-50%, -110%); line-height: 1.6; }
        
        .pagination-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid #f1f5f9; margin-top: auto; flex-wrap: wrap; gap: 10px; }
        .showing-text { color: #5e718d; font-size: 13px; }
        .page-btn { border: 1px solid #e2e8f0; background: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        
        .stat-val { font-size: 32px; font-weight: 800; margin: 8px 0; }
        @media (min-width: 768px) { .stat-val { font-size: 36px; } }
        
        .stat-sub { font-size: 13px; color: #64748b; font-weight: 500; }
        .status-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #f8fafc; }
        .status-icon { padding: 8px; border-radius: 8px; display: flex; }
        .bg-green { background: #DCFCE7; color: #166534; }
        .bg-orange { background: #FEF3C7; color: #92400e; }
        .bg-red { background: #FEE2E2; color: #991b1b; }
        .progress-bg { height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; transition: width 0.8s ease; }
      `}</style>

      {hoveredData && (
        <div className="chart-tooltip" style={{ left: mousePos.x, top: mousePos.y }}>
          <strong style={{fontSize: '14px'}}>{hoveredData.month} {selectedYear}</strong><br/>
          <span style={{color: '#93c5fd'}}>●</span> general: {hoveredData.general}%<br/>
          <span style={{color: '#fcd34d'}}>●</span> skill: {hoveredData.skill}%
        </div>
      )}

      {/* TOP SECTION */}
      <div className="section-grid top-stats">
        {dashboardData.overallStats.map((s, idx) => (
          <div className="card" key={idx}>
            <div className="card-title" style={{fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px'}}>{s.title}</div>
            <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className="section-grid middle-content">
        <div className="card chart-card">
          <div className="card-header">
            <div className="header-title-lg">Attendance Trends</div>
            <div style={{display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap'}}>
              <div style={{ display: 'flex', gap: '12px', fontSize: '10px', fontWeight: 800 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, background: '#2144BA' }} /> GENERAL</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, background: '#F59E0B' }} /> SKILL</span>
              </div>
              <select className="year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="chart-scroll-wrapper">
            <div className="chart-container">
              {dashboardData.chartData.map((d, i) => (
                <div 
                  className="chart-col" 
                  key={i} 
                  onMouseEnter={() => setHoveredData(d)} 
                  onMouseLeave={() => setHoveredData(null)} 
                  onMouseMove={handleMouseMove}
                >
                  <div className="bar-group">
                    <div className="bar bar-ac" style={{ height: isAnimate ? `${d.general}%` : '0%' }} />
                    <div className="bar bar-ws" style={{ height: isAnimate ? `${d.skill}%` : '0%' }} />
                  </div>
                  <div className="month-label">{d.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="header-title-lg" style={{marginBottom: '20px'}}>Session Status ({selectedYear})</div>
          {dashboardData.sessionStatus.map((item, i) => {
            const icons = {
              green: <CheckCircleOutlineIcon fontSize="small"/>,
              orange: <AccessTimeIcon fontSize="small"/>,
              red: <CancelOutlinedIcon fontSize="small"/>
            };
            return (
              <div className="status-row" key={i}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600}}>
                  <div className={`status-icon bg-${item.theme}`}>{icons[item.theme]}</div>
                  <span style={{fontSize: '14px'}}>{item.label}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '16px' }}>{item.count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="section-grid bottom-content">
        <div className="card">
          <div className="header-title-lg" style={{marginBottom: '20px'}}>Subject Attendance</div>
          <div style={{ flex: 1 }}>
            {paginatedSubjects.map((sub, i) => {
              const color = SUBJECT_SHADES[(subPage * LIMIT + i) % SUBJECT_SHADES.length];
              return (
                <div key={i} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px' }}>{sub.name}</span>
                    <span style={{ fontWeight: 900, fontSize: '13px' }}>{sub.percent}%</span>
                  </div>
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ width: isAnimate ? `${sub.percent}%` : '0%', background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination 
            currentPage={subPage} 
            totalCount={dashboardData.subjects.length} 
            type="subjects" 
            onNext={() => setSubPage(p => p + 1)} 
            onPrev={() => setSubPage(p => p - 1)}
          />
        </div>

        <div className="card">
          <div className="header-title-lg" style={{marginBottom: '20px'}}>Recent Skills</div>
          <div style={{ flex: 1 }}>
            {paginatedSkills.map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f8fafc', gap: '10px' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>{w.type} • {w.date}</div>
                </div>
                <Badge status={w.status} />
              </div>
            ))}
          </div>
          <Pagination 
            currentPage={wsPage} 
            totalCount={dashboardData.skills.length} 
            type="skills" 
            onNext={() => setWsPage(p => p + 1)} 
            onPrev={() => setWsPage(p => p - 1)}
          />
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalCount, type, onNext, onPrev }) => {
  const LIMIT = 5;
  const start = currentPage * LIMIT + 1;
  const end = Math.min((currentPage + 1) * LIMIT, totalCount);

  return (
    <div className="pagination-footer">
      <div className="showing-text">Showing <strong>{start}-{end}</strong> of {totalCount} {type}</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className={`page-btn ${currentPage === 0 ? 'disabled' : ''}`} onClick={currentPage > 0 ? onPrev : null}>Prev</button>
        <button className={`page-btn ${end >= totalCount ? 'disabled' : ''}`} onClick={end < totalCount ? onNext : null}>Next</button>
      </div>
    </div>
  );
};

const Badge = ({ status }) => {
  const themes = {
    Present: { bg: '#DCFCE7', text: '#166534', icon: <DoneIcon sx={{fontSize: 14}}/> },
    Late: { bg: '#FEF3C7', text: '#92400e', icon: <AccessTimeIcon sx={{fontSize: 14}}/> },
    Absent: { bg: '#FEE2E2', text: '#991b1b', icon: <CancelOutlinedIcon sx={{fontSize: 14}}/> },
  };
  const theme = themes[status];
  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
      {theme.icon} {status.toUpperCase()}
    </div>
  );
};

export default AttendanceDashboard;
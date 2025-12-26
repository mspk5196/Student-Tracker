import React, { useState, useEffect } from 'react';
// Material UI Icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DoneIcon from '@mui/icons-material/Done';

const SUBJECT_SHADES = [
  "#2144BA", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", 
  "#06B6D4", "#F43F5E", "#10B981", "#6366F1", "#14B8A6"
];

// Master Master JSON - Everything is extracted from here
const dashboardJSON = {
  availableYears: ["2025", "2024"],
  dataByYear: {
    "2025": {
      semester: 5,
      overallStats: [
        { title: "OVERALL ATTENDANCE", value: "94%", sub: "Total days: 142 / 151", color: "#10B981" },
        { title: "SKILL ATTENDANCE", value: "90%", sub: "Skill Attended: 45 / 50", color: "#1e293b" },
      ],
      sessionStatus: [
        { label: "Present", count: 133, theme: "green", icon: <CheckCircleOutlineIcon fontSize="small"/> },
        { label: "Late", count: 5, theme: "orange", icon: <AccessTimeIcon fontSize="small"/> },
        { label: "Absent", count: 4, theme: "red", icon: <CancelOutlinedIcon fontSize="small"/> },
      ],
      chartData: [
        { month: "Jan", general: 90, skill: 85 }, { month: "Feb", general: 85, skill: 70 },
        { month: "Mar", general: 92, skill: 88 }, { month: "Apr", general: 88, skill: 80 },
        { month: "May", general: 95, skill: 90 }, { month: "Jun", general: 70, skill: 50 },
        { month: "Jul", general: 65, skill: 55 }, { month: "Aug", general: 75, skill: 60 },
        { month: "Sep", general: 82, skill: 78 }, { month: "Oct", general: 85, skill: 80 },
        { month: "Nov", general: 88, skill: 84 }, { month: "Dec", general: 80, skill: 76 }
      ]
    },
    "2024": {
      semester: 3,
      overallStats: [
        { title: "OVERALL ATTENDANCE", value: "88%", sub: "Total days: 130 / 148", color: "#F59E0B" },
        { title: "SKILL ATTENDANCE", value: "82%", sub: "Skill Attended: 40 / 48", color: "#1e293b" },
      ],
      sessionStatus: [
        { label: "Present", count: 120, theme: "green", icon: <CheckCircleOutlineIcon fontSize="small"/> },
        { label: "Late", count: 10, theme: "orange", icon: <AccessTimeIcon fontSize="small"/> },
        { label: "Absent", count: 8, theme: "red", icon: <CancelOutlinedIcon fontSize="small"/> },
      ],
      chartData: [
        { month: "Jan", general: 80, skill: 70 }, { month: "Feb", general: 75, skill: 65 },
        { month: "Mar", general: 82, skill: 75 }, { month: "Apr", general: 85, skill: 78 },
        { month: "May", general: 88, skill: 82 }, { month: "Jun", general: 80, skill: 75 },
        { month: "Jul", general: 78, skill: 70 }, { month: "Aug", general: 82, skill: 75 },
        { month: "Sep", general: 85, skill: 78 }, { month: "Oct", general: 88, skill: 82 },
        { month: "Nov", general: 90, skill: 85 }, { month: "Dec", general: 85, skill: 80 }
      ]
    }
  },
  globalLists: {
    subjects: [
      { name: "Data Structures & Algorithms", current: 24, total: 24, percent: 100 },
      { name: "Database Management Systems", current: 22, total: 24, percent: 91 },
      { name: "Computer Networks", current: 20, total: 22, percent: 90 },
      { name: "Software Engineering", current: 22, total: 22, percent: 100 },
      { name: "Operating Systems", current: 18, total: 24, percent: 75 },
      { name: "Machine Learning", current: 20, total: 20, percent: 100 },
      { name: "Discrete Mathematics", current: 15, total: 22, percent: 68 },
      { name: "Mobile Development", current: 20, total: 20, percent: 100 },
    ],
    skills: [
      { name: "Advanced React Patterns", type: "skill", date: "Jan 15, 2025", status: "Present" },
      { name: "UI/UX Design Sprint", type: "Event", date: "Jan 12, 2025", status: "Present" },
      { name: "Cloud Architecture Seminar", type: "Seminar", date: "Jan 08, 2025", status: "Late" },
      { name: "Hackathon Kickoff", type: "Event", date: "Jan 05, 2025", status: "Absent" },
      { name: "Node.js Performance", type: "skill", date: "Dec 28, 2024", status: "Present" },
      { name: "Microservices Bootcamp", type: "Seminar", date: "Dec 20, 2024", status: "Present" },
    ]
  }
};

const AttendanceDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(dashboardJSON.availableYears[0]);
  const [isAnimate, setIsAnimate] = useState(false);
  const [hoveredData, setHoveredData] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Pagination states
  const [subPage, setSubPage] = useState(0);
  const [wsPage, setWsPage] = useState(0);
  const LIMIT = 5;

  const currentYearData = dashboardJSON.dataByYear[selectedYear];

  useEffect(() => {
    setIsAnimate(false);
    const timer = setTimeout(() => setIsAnimate(true), 100);
    return () => clearTimeout(timer);
  }, [selectedYear]);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const paginatedSubjects = dashboardJSON.globalLists.subjects.slice(subPage * LIMIT, (subPage + 1) * LIMIT);
  const paginatedskills = dashboardJSON.globalLists.skills.slice(wsPage * LIMIT, (wsPage + 1) * LIMIT);

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container { background-color: #f8faff; font-family: 'Inter', sans-serif; padding: 20px; min-height: 100vh; color: #1e293b; overflow-x: hidden; }
        .section-grid { display: grid; gap: 24px; margin-bottom: 24px; width: 100%; }
        
        .top-stats { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
        
        /* Fixed: Middle Content with relative shrinking */
        .middle-content { grid-template-columns: minmax(0, 2.5fr) 350px; }
        .bottom-content { grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); }

        @media (max-width: 1100px) {
          .middle-content { grid-template-columns: 1fr; }
          .bottom-content { grid-template-columns: 1fr; }
        }

        .card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #edf2f7; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02); display: flex; flex-direction: column; min-width: 0; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
        .header-title-lg { font-size: 18px; color: #1e293b; font-weight: 800; }

        /* Year Dropdown from JSON */
        .year-select { padding: 6px 12px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; font-weight: 600; cursor: pointer; outline: none; }

        /* Horizontal Scrollable View */
        .chart-scroll-wrapper { overflow-x: auto; padding-bottom: 10px; min-width: 0; }
        .chart-container { height: 250px; display: flex; align-items: flex-end; gap: 24px; padding: 20px 10px 0 10px; min-width: 850px; border-bottom: 1px solid #f1f5f9; }
        .chart-col { display: flex; flex-direction: column; align-items: center; width: 60px; height: 100%; justify-content: flex-end; cursor: pointer; position: relative; }
        .bar-group { display: flex; align-items: flex-end; gap: 5px; height: 100%; }
        .bar { width: 14px; border-radius: 4px 4px 0 0; transition: height 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67); height: 0; }
        .bar-ac { background: #2144BA; }
        .bar-ws { background: #F59E0B; }
        .month-label { font-size: 11px; color: #94a3b8; font-weight: 700; margin-top: 10px; }

        .chart-tooltip { position: fixed; pointer-events: none; background: #1e293b; color: white; padding: 10px 14px; border-radius: 8px; font-size: 12px; z-index: 9999; box-shadow: 0 10px 15px rgba(0,0,0,0.2); transform: translate(-50%, -110%); line-height: 1.6; }

        .pagination-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid #f1f5f9; margin-top: auto; }
        .showing-text { color: #5e718d; font-size: 14px; }
        .page-btn { border: 1px solid #e2e8f0; background: white; padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .page-btn:not(.disabled):hover { background: #f8fafc; border-color: #cbd5e1; }
        .page-btn.disabled { color: #cbd5e1; cursor: not-allowed; opacity: 0.6; }

        .stat-val { font-size: 36px; font-weight: 800; margin: 8px 0; }
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

      {/* --- TOP SECTION --- */}
      <div className="section-grid top-stats">
        {currentYearData.overallStats.map((s, idx) => (
          <div className="card" key={idx}>
            <div className="card-title" style={{fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px'}}>{s.title}</div>
            <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* --- MIDDLE SECTION --- */}
      <div className="section-grid middle-content">
        <div className="card chart-card">
          <div className="card-header">
            <div className="header-title-lg">Attendance Trends (Sem {currentYearData.semester})</div>
            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: 800 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, background: '#2144BA' }} /> GENERAL</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, background: '#F59E0B' }} /> SKILL</span>
              </div>
              <select className="year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {dashboardJSON.availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="chart-scroll-wrapper">
            <div className="chart-container">
              {currentYearData.chartData.map((d, i) => (
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
          {currentYearData.sessionStatus.map((item, i) => (
            <div className="status-row" key={i}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600}}>
                <div className={`status-icon bg-${item.theme}`}>{item.icon}</div>
                <span>{item.label}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '16px' }}>{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="section-grid bottom-content">
        <div className="card">
          <div className="header-title-lg" style={{marginBottom: '20px'}}>Skills attendance</div>
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
            totalCount={dashboardJSON.globalLists.subjects.length} 
            type="subjects" 
            onNext={() => setSubPage(p => p + 1)} 
            onPrev={() => setSubPage(p => p - 1)}
          />
        </div>

        <div className="card">
          <div className="header-title-lg" style={{marginBottom: '20px'}}>Recent Skills</div>
          <div style={{ flex: 1 }}>
            {paginatedskills.map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f8fafc' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{w.name}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>{w.type} • {w.date}</div>
                </div>
                <Badge status={w.status} />
              </div>
            ))}
          </div>
          <Pagination 
            currentPage={wsPage} 
            totalCount={dashboardJSON.globalLists.skills.length} 
            type="skills" 
            onNext={() => setWsPage(p => p + 1)} 
            onPrev={() => setWsPage(p => p - 1)}
          />
        </div>
      </div>
    </div>
  );
};

// --- Reusable Logic Components ---

const Pagination = ({ currentPage, totalCount, type, onNext, onPrev }) => {
  const LIMIT = 5;
  const start = currentPage * LIMIT + 1;
  const end = Math.min((currentPage + 1) * LIMIT, totalCount);

  return (
    <div className="pagination-footer">
      <div className="showing-text">Showing <strong>{start}-{end}</strong> of {totalCount} {type}</div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className={`page-btn ${currentPage === 0 ? 'disabled' : ''}`} onClick={currentPage > 0 ? onPrev : null}>Previous</button>
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
    <div style={{ backgroundColor: theme.bg, color: theme.text, padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
      {theme.icon} {status.toUpperCase()}
    </div>
  );
};

export default AttendanceDashboard;
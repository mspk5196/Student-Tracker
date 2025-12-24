import React from 'react';
// Material UI Icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DoneIcon from '@mui/icons-material/Done';

const AttendanceDashboard = () => {
  // --- Dynamic Data Objects ---
  const stats = [
    { title: "OVERALL ATTENDANCE", value: "94%", sub: "Total Sessions: 142 / 151", color: "#10B981" },
    { title: "ACADEMIC ATTENDANCE", value: "96%", sub: "Classes Attended: 88 / 92", color: "#1e293b" },
    { title: "WORKSHOP ATTENDANCE", value: "90%", sub: "Events Attended: 45 / 50", color: "#1e293b" },
  ];

  const chartData = [
    { month: "Aug", academic: 75, workshop: 60 },
    { month: "Sep", academic: 82, workshop: 78 },
    { month: "Oct", academic: 85, workshop: 80 },
    { month: "Nov", academic: 88, workshop: 84 },
    { month: "Dec", academic: 80, workshop: 76 },
    { month: "Jan", academic: 90, workshop: 85 },
  ];

  const subjects = [
    { name: "Data Structures & Algorithms", current: 24, total: 24, percent: 100, color: "#10B981" },
    { name: "Database Management Systems", current: 22, total: 24, percent: 91, color: "#2144BA" },
    { name: "Computer Networks", current: 20, total: 22, percent: 90, color: "#2144BA" },
    { name: "Software Engineering", current: 22, total: 22, percent: 100, color: "#10B981" },
  ];

  const workshops = [
    { name: "Advanced React Patterns", type: "Workshop", date: "Jan 15, 2024", status: "Present" },
    { name: "UI/UX Design Sprint", type: "Event", date: "Jan 12, 2024", status: "Present" },
    { name: "Cloud Architecture Seminar", type: "Seminar", date: "Jan 08, 2024", status: "Late" },
    { name: "Hackathon Kickoff", type: "Event", date: "Jan 05, 2024", status: "Absent" },
  ];

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container {
          background-color: #f8faff;
          font-family: 'Inter', sans-serif;
          padding: 3    px;
          min-height: 100vh;
          color: #1e293b;
        }

        .section-grid { display: grid; gap: 24px; margin-bottom: 24px; }
        .top-stats { grid-template-columns: repeat(3, 1fr); }
        .middle-content { grid-template-columns: 2fr 1fr; }
        .bottom-content { grid-template-columns: 1fr 1fr; }

        /* Universal Card Style */
        .card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #edf2f7;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .card-title { font-size: 14px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase; }
        .header-title-lg { font-size: 18px; color: #1e293b; text-transform: none; }

        .btn-outline {
          border: 1px solid #e2e8f0;
          background: white;
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-outline:hover { background: #f8fafc; border-color: #cbd5e1; }

        /* Stat Cards */
        .stat-val { font-size: 38px; font-weight: 800; margin: 8px 0; }
        .stat-sub { font-size: 14px; color: #64748b; font-weight: 500; }

        /* Custom Bar Chart */
        .chart-container { height: 250px; display: flex; align-items: flex-end; justify-content: space-between; padding-top: 20px; border-bottom: 1px solid #f1f5f9; position: relative; }
        .chart-col { display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; justify-content: flex-end; gap: 8px; }
        .bar-group { display: flex; align-items: flex-end; gap: 4px; height: 100%; width: 100%; justify-content: center; }
        .bar { width: 12px; border-radius: 4px 4px 0 0; transition: height 0.3s ease; }
        .bar-ac { background: #2144BA; }
        .bar-ws { background: #F59E0B; }
        .month-label { font-size: 12px; color: #94a3b8; font-weight: 600; margin-top: 10px; }

        /* Session Status List */
        .status-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; }
        .status-info { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600; }
        .status-icon { padding: 8px; border-radius: 8px; display: flex; }
        .bg-green { background: #DCFCE7; color: #166534; }
        .bg-orange { background: #FEF3C7; color: #92400e; }
        .bg-red { background: #FEE2E2; color: #991b1b; }
        .status-count { font-weight: 700; font-size: 15px; }

        /* Progress Bars */
        .subject-row { margin-bottom: 20px; }
        .subject-text { display: flex; justify-content: space-between; margin-bottom: 6px; align-items: baseline; }
        .progress-bg { height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; transition: width 0.4s; }

        /* Recent Workshop Items */
        .workshop-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #f8fafc; }
        .workshop-item:last-child { border-bottom: none; }
        .workshop-meta { font-size: 12px; color: #94a3b8; margin-top: 4px; }
        .badge { padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 4px; }
      `}</style>

      {/* --- TOP SECTION --- */}
      <div className="section-grid top-stats">
        {stats.map((s, idx) => (
          <div className="card" key={idx}>
            <div className="card-title">{s.title}</div>
            <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* --- MIDDLE SECTION --- */}
      <div className="section-grid middle-content">
        {/* Attendance Trends */}
        <div className="card">
          <div className="card-header">
            <div className="card-title header-title-lg">Attendance Trends (Sem 5)</div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 8, height: 8, background: '#2144BA', borderRadius: '2px' }} /> Academic
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 8, height: 8, background: '#F59E0B', borderRadius: '2px' }} /> Workshop
              </span>
            </div>
          </div>
          <div className="chart-container">
            {chartData.map((d, i) => (
              <div className="chart-col" key={i}>
                <div className="bar-group">
                  <div className="bar bar-ac" style={{ height: `${d.academic}%` }} />
                  <div className="bar bar-ws" style={{ height: `${d.workshop}%` }} />
                </div>
                <div className="month-label">{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Status */}
        <div className="card">
          <div className="card-title header-title-lg">Session Status</div>
          <div style={{ marginTop: '20px' }}>
            <StatusItem icon={<CheckCircleOutlineIcon fontSize="small"/>} label="Present" count="133" theme="green" />
            <StatusItem icon={<AccessTimeIcon fontSize="small"/>} label="Late" count="5" theme="orange" />
            <StatusItem icon={<CancelOutlinedIcon fontSize="small"/>} label="Absent" count="4" theme="red" />
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="section-grid bottom-content">
        {/* Academic Subjects */}
        <div className="card">
          <div className="card-header">
            <div className="card-title header-title-lg">Academic Subjects</div>
            <button className="btn-outline">Detailed Log</button>
          </div>
          {subjects.map((sub, i) => (
            <div className="subject-row" key={i}>
              <div className="subject-text">
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{sub.name}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{sub.current}/{sub.total} Sessions</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '14px' }}>{sub.percent}%</div>
              </div>
              <div className="progress-bg">
                <div className="progress-fill" style={{ width: `${sub.percent}%`, background: sub.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Workshops */}
        <div className="card">
          <div className="card-header">
            <div className="card-title header-title-lg">Recent Workshops</div>
            <button className="btn-outline">View All</button>
          </div>
          {workshops.map((w, i) => (
            <div className="workshop-item" key={i}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{w.name}</div>
                <div className="workshop-meta">{w.type} • {w.date}</div>
              </div>
              <Badge status={w.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Small Reusable Helper Components ---

const StatusItem = ({ icon, label, count, theme }) => (
  <div className="status-row">
    <div className="status-info">
      <div className={`status-icon bg-${theme}`}>{icon}</div>
      <span>{label}</span>
    </div>
    <div className="status-count">{count}</div>
  </div>
);

const Badge = ({ status }) => {
  const styles = {
    Present: { bg: '#DCFCE7', text: '#166534', icon: <DoneIcon sx={{fontSize: 14}}/> },
    Late: { bg: '#FEF3C7', text: '#92400e', icon: <AccessTimeIcon sx={{fontSize: 14}}/> },
    Absent: { bg: '#FEE2E2', text: '#991b1b', icon: <CancelOutlinedIcon sx={{fontSize: 14}}/> },
  };
  const theme = styles[status];

  return (
    <div className="badge" style={{ backgroundColor: theme.bg, color: theme.text }}>
      {theme.icon} {status}
    </div>
  );
};

export default AttendanceDashboard;
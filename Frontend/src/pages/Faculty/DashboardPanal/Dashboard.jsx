import React, { useState } from 'react';
import { 
  BookOpen, Calendar, Clock, ClipboardCheck, 
  MapPin, Users, ChevronRight, Plus, 
  BarChart3, PieChart, MoreVertical 
} from 'lucide-react';

const Dashboard = () => {
  // --- DYNAMIC DATA ---
  const [stats] = useState([
    { id: 1, label: 'My Classes', value: '6', sub: 'Across 3 departments', icon: <BookOpen size={18} /> },
    { id: 2, label: "Today's Sessions", value: '4', sub: '2 completed, 2 upcoming', icon: <Calendar size={18} /> },
    { id: 3, label: 'Attendance Pending', value: '2', sub: 'Mark within 24 hours', icon: <Clock size={18} />, badge: '2 groups' },
    { id: 4, label: 'Tasks to Review', value: '18', sub: 'Submissions awaiting review', icon: <ClipboardCheck size={18} /> },
  ]);

  const [classes] = useState([
    {
      id: 'CS-201',
      name: 'Data Structures (CS-A)',
      students: 45,
      status: 'Attendance pending',
      statusType: 'pending',
      time: '10:00 - 11:00 AM',
      loc: 'Lab 3',
      actions: ['Mark Attendance', 'View Class', 'Post Task']
    },
    {
      id: 'CS-105',
      name: 'Programming Basics (CS-B)',
      students: 52,
      status: 'In progress',
      statusType: 'progress',
      time: '11:15 AM - 12:15 PM',
      loc: 'Room 204',
      actions: ['Mark Attendance', 'Post Task']
    },
    {
      id: 'AI-310',
      name: 'Intro to AI (AI-A)',
      students: 38,
      status: 'Completed',
      statusType: 'completed',
      time: '02:00 - 03:00 PM',
      loc: 'Seminar Hall',
      actions: ['Edit Attendance', 'View Tasks']
    }
  ]);

  const [groups] = useState([
    { id: 'CS-201', title: 'Data Structures (CS-A)', schedule: 'Mon, Wed 10:00 AM', students: 45, attend: '92%', tasks: '2 active', status: 'On track', type: 'success' },
    { id: 'CS-105', title: 'Programming Basics (CS-B)', schedule: 'Tue, Thu 11:15 AM', students: 52, attend: '86%', tasks: '1 due today', status: 'Watch attendance', type: 'warning' },
    { id: 'AI-310', title: 'Intro to AI (AI-A)', schedule: 'Fri 02:00 PM', students: 38, attend: '78%', tasks: '3 pending reviews', status: 'Review tasks', type: 'info' },
  ]);

  return (
    <div className="dashboard-wrapper">
      {/* SCOPED CSS */}
      <style>{`
        .dashboard-wrapper {
          background-color: #f9fafb;
          min-height: 100vh;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #111827;
          padding: 32px;
        }
        .header h1 { font-size: 18px; font-weight: 600; margin-bottom: 24px; color: #374151; }
        
        /* Stats Grid */
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .stat-top { display: flex; justify-content: space-between; color: #6b7280; margin-bottom: 12px; font-size: 13px; font-weight: 500; }
        .stat-val { font-size: 26px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .stat-sub { font-size: 12px; color: #9ca3af; margin-top: 4px; }
        .pill-green { background: #dcfce7; color: #166534; font-size: 10px; padding: 2px 8px; border-radius: 20px; font-weight: 600; }

        /* Main Layout */
        .main-grid { display: grid; grid-template-columns: 1fr 360px; gap: 24px; }
        
        .section-label { margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
        .section-label h2 { font-size: 16px; font-weight: 700; margin: 0; }
        .section-label p { font-size: 12px; color: #6b7280; margin-top: 2px; }

        /* Class Cards */
        .class-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .class-info-top { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
        .class-name { font-weight: 700; font-size: 14px; }
        .std-count { background: #f3f4f6; font-size: 11px; padding: 2px 8px; border-radius: 4px; color: #4b5563; }
        .status-badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 600; }
        .status-pending { background: #ecfdf5; color: #059669; }
        .status-progress { background: #eff6ff; color: #2563eb; }
        .status-completed { background: #fff7ed; color: #ea580c; }
        .meta-row { display: flex; gap: 16px; font-size: 12px; color: #6b7280; }
        .btn-action { background: white; border: 1px solid #e5e7eb; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; margin-left: 8px; transition: 0.2s; }
        .btn-action:hover { background: #f9fafb; border-color: #d1d5db; }
        .btn-primary { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer; }

        /* Table */
        .table-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-top: 20px; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { background: #f9fafb; text-align: left; padding: 12px 16px; font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: 700; border-bottom: 1px solid #e5e7eb; }
        .data-table td { padding: 16px; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
        .grp-title { font-weight: 700; color: #111827; }
        .grp-sub { font-size: 11px; color: #9ca3af; }
        .badge-flat { font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; }
        .type-success { color: #059669; background: #f0fdf4; }
        .type-warning { color: #d97706; background: #fffbeb; }

        /* Sidebar */
        .sidebar-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
        .sb-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .sb-title h3 { font-size: 14px; font-weight: 700; margin: 0; }
        .mini-btn { font-size: 11px; color: #6b7280; border: 1px solid #e5e7eb; padding: 3px 8px; border-radius: 4px; background: none; }
        .review-stats { display: flex; border-bottom: 1px solid #f3f4f6; padding-bottom: 16px; margin-bottom: 16px; }
        .rs-item { flex: 1; }
        .rs-label { font-size: 10px; text-transform: uppercase; color: #9ca3af; font-weight: 700; }
        .rs-val { font-size: 18px; font-weight: 800; margin: 2px 0; }
        .txt-green { color: #10b981; }
        
        .action-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #f9fafb; cursor: pointer; }
        .action-row:last-child { border: none; }
        .at-text { font-size: 13px; font-weight: 600; }
        .as-text { font-size: 11px; color: #9ca3af; }
        .blue-link { color: #2563eb; font-size: 12px; font-weight: 700; display: block; text-align: center; margin-top: 10px; text-decoration: none; }
      `}</style>

      <header className="header">
        <h1>Overview of today's classes, attendance, and tasks</h1>
      </header>

      {/* 4 Top Cards */}
      <div className="stats-row">
        {stats.map(s => (
          <div className="stat-card" key={s.id}>
            <div className="stat-top">
              <span>{s.label}</span>
              <span style={{color: '#d1d5db'}}>{s.icon}</span>
            </div>
            <div className="stat-val">
              {s.value}
              {s.badge && <span className="pill-green">{s.badge}</span>}
            </div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="main-grid">
        {/* LEFT COLUMN */}
        <div className="left-content">
          <div className="section-label">
            <div>
              <h2>Today</h2>
              <p>Scheduled sessions with quick actions</p>
            </div>
            <button className="btn-primary"><Calendar size={16}/> Plan next week</button>
          </div>

          <div className="class-list">
            {classes.map(c => (
              <div className="class-card" key={c.id}>
                <div>
                  <div className="class-info-top">
                    <span className="class-name">{c.id} {c.name}</span>
                    <span className="std-count">{c.students} Students</span>
                    <span className={`status-badge status-${c.statusType}`}>{c.status}</span>
                  </div>
                  <div className="meta-row">
                    <span><Clock size={12} style={{verticalAlign:'middle', marginRight:'4px'}}/> {c.time}</span>
                    <span><MapPin size={12} style={{verticalAlign:'middle', marginRight:'4px'}}/> {c.loc}</span>
                  </div>
                </div>
                <div className="actions">
                  {c.actions.map(a => (
                    <button key={a} className="btn-action">{a}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Engagement Placeholder */}
          <div className="sidebar-card" style={{marginTop: '32px'}}>
             <div className="section-label" style={{marginBottom: '24px'}}>
                <h2>Engagement Overview</h2>
             </div>
             <div style={{display: 'flex', gap: '20px', height: '160px'}}>
                <div style={{flex: 1, background: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '12px'}}>
                    <BarChart3 size={24} style={{marginRight: '8px'}}/> Class-wise attendance bar chart
                </div>
                <div style={{flex: 1, background: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '12px'}}>
                    <PieChart size={24} style={{marginRight: '8px'}}/> Task completion donut chart
                </div>
             </div>
          </div>

          {/* Groups Table */}
          <div className="section-label" style={{marginTop: '32px'}}>
             <h2>My Groups</h2>
             <a href="#" className="blue-link" style={{margin:0}}>View all groups</a>
          </div>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Group / Class</th>
                  <th>Students</th>
                  <th>Avg Attendance</th>
                  <th>Tasks Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {groups.map(g => (
                  <tr key={g.id}>
                    <td>
                      <div className="grp-title">{g.id} {g.title}</div>
                      <div className="grp-sub">{g.schedule}</div>
                    </td>
                    <td>{g.students}</td>
                    <td>{g.attend}</td>
                    <td>{g.tasks}</td>
                    <td><span className={`badge-flat type-${g.type}`}>{g.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN (SIDEBAR) */}
        <div className="sidebar">
          <div className="sidebar-card">
            <div className="sb-title">
              <h3>Task Review Queue</h3>
              <button className="mini-btn">Open tasks</button>
            </div>
            <div className="review-stats">
              <div className="rs-item">
                <div className="rs-label">Pending reviews</div>
                <div className="rs-val">18</div>
                <div className="rs-label" style={{textTransform:'none', fontWeight: 400}}>Across 5 tasks</div>
              </div>
              <div className="rs-item" style={{borderLeft: '1px solid #f3f4f6', paddingLeft: '20px'}}>
                <div className="rs-label">Avg completion</div>
                <div className="rs-val txt-green">82%</div>
                <div className="rs-label" style={{textTransform:'none', fontWeight: 400}}>All active groups</div>
              </div>
            </div>
            <div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                 <div>
                    <div className="at-text">Assignment 3: Linked Lists</div>
                    <div className="as-text">CS-201 | 32 / 45 submitted</div>
                 </div>
                 <span className="status-badge" style={{background: '#fff7ed', color: '#c2410c'}}>Review</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                 <div>
                    <div className="at-text">Lab 2: Control Statements</div>
                    <div className="as-text">CS-105 | 40 / 52 submitted</div>
                 </div>
                 <span className="status-badge status-progress">In progress</span>
              </div>
            </div>
            <a href="#" className="blue-link">Go to Tasks & Submissions</a>
          </div>

          <div className="sidebar-card">
            <h3>Attendance Summary</h3>
            <div style={{background: '#f9fafb', padding: '16px', borderRadius: '8px', display:'flex', justifyContent:'space-between', margin: '16px 0'}}>
                <div>
                   <div className="rs-label">Overall</div>
                   <div className="rs-val" style={{fontSize: '22px'}}>88%</div>
                   <div className="as-text">Target: 90%</div>
                </div>
                <div style={{textAlign: 'right'}}>
                   <div className="rs-label">Sessions pending</div>
                   <div className="rs-val" style={{fontSize: '22px'}}>2</div>
                   <div className="as-text">Mark today</div>
                </div>
            </div>
            <div style={{fontSize: '12px', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>Highest group <span style={{color:'#111827', fontWeight:700}}>CS-201 94%</span></div>
                <div style={{display:'flex', justifyContent:'space-between'}}>Lowest group <span style={{color:'#ea580c', fontWeight:700}}>AI-310 78%</span></div>
            </div>
            <a href="#" className="blue-link">Open Attendance</a>
          </div>

          <div>
            <h3 style={{fontSize: '14px', marginBottom: '12px'}}>Quick Actions</h3>
            <div className="table-card" style={{marginTop: 0}}>
              {[
                {t: 'Mark attendance for a class', s: 'Opens attendance marking flow'},
                {t: 'Create a new task', s: 'Assign work linked to study material'},
                {t: 'Upload study material', s: 'Day-wise roadmap for your groups'},
                {t: 'View student performance', s: 'Open student tracking & profiles'}
              ].map((act, i) => (
                <div className="action-row" key={i} style={{padding: '16px'}}>
                  <div>
                    <div className="at-text">{act.t}</div>
                    <div className="as-text">{act.s}</div>
                  </div>
                  <ChevronRight size={16} color="#d1d5db" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
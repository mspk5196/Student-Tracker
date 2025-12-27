import React from 'react';
import {
    Rocket,
    Calendar,
    Clock,
    BookOpen,
    CheckCircle,
    FileText,
    Video,
    Code,
    Database,
    Book,
    MoreHorizontal
} from 'lucide-react';

const StudentDashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <header className="header">
                <div className="header-left">
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Welcome back, Arjun! <Rocket size={28} />
                    </h1>
                    <p className="header-subtext">
                        <span><Calendar size={14} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Today, Oct 24</span>
                        <span className="separator">•</span>
                        <span><Clock size={14} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Week 8 of 16</span>
                    </p>
                </div>
                <div className="stats-group">
                    <div className="stat-card">
                        <span className="stat-label">ATTENDANCE</span>
                        <span className="stat-value">82%</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-card">
                        <span className="stat-label">TASKS DUE</span>
                        <span className="stat-value">3</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-card">
                        <span className="stat-label">CGPA</span>
                        <span className="stat-value">8.4</span>
                    </div>
                </div>
            </header>

            <div className="main-layout">
                {/* Left Content Area */}
                <div className="content-left">
                    {/* Roadmap Section */}
                    <section className="card roadmap-card">
                        <div className="card-header">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <BookOpen size={18} color="#2563eb" /> Current Roadmap Track
                            </h3>
                            <button className="text-button">View Full Roadmap</button>
                        </div>
                        <div className="roadmap-body">
                            <p className="course-name">Data Structures & Algorithms</p>
                            <div className="module-info">
                                <h4>Module 4: Binary Trees & Graphs</h4>
                                <span className="progress-percent">65%</span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar" style={{ width: '65%' }}></div>
                            </div>
                            <div className="roadmap-steps">
                                <span>Basics</span>
                                <span>Arrays</span>
                                <span>Linked Lists</span>
                                <span className="active-step">Trees</span>
                                <span>Graphs</span>
                            </div>
                            <div className="resource-grid">
                                <div className="resource-item">
                                    <div className="icon-box pdf-icon">
                                        <FileText size={20} color="#ef4444" />
                                    </div>
                                    <div className="resource-details">
                                        <p className="resource-title">Lecture Notes: Trees</p>
                                        <p className="resource-meta">PDF • 2.4 MB</p>
                                    </div>
                                </div>
                                <div className="resource-item">
                                    <div className="icon-box video-icon">
                                        <Video size={20} color="#2563eb" />
                                    </div>
                                    <div className="resource-details">
                                        <p className="resource-title">Binary Search Trees</p>
                                        <p className="resource-meta">Video • 45 mins</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pending Tasks Section */}
                    <section className="card tasks-card">
                        <div className="card-header">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle size={18} color="#10b981" /> Pending Tasks
                            </h3>
                            <div className="card-header-right">
                                <span className="due-count">2 Due Today</span>
                                <button className="primary-button small">View All</button>
                            </div>
                        </div>
                        <div className="task-list">
                            <div className="task-item">
                                <div className="task-icon code-icon">
                                    <Code size={20} />
                                </div>
                                <div className="task-info">
                                    <p className="task-name">Implement AVL Tree Rotations</p>
                                    <p className="task-meta"><span className="due-today">Due Today, 11:59 PM</span> • DSA Lab</p>
                                </div>
                                <div className="task-action">
                                    <span className="badge urgent">Urgent</span>
                                    <button className="primary-button">Submit Now</button>
                                </div>
                            </div>

                            <div className="task-item">
                                <div className="task-icon db-icon">
                                    <Database size={20} />
                                </div>
                                <div className="task-info">
                                    <p className="task-name">SQL Normalization Case Study</p>
                                    <p className="task-meta">Due Tomorrow • DBMS</p>
                                </div>
                                <div className="task-action">
                                    <span className="badge pending">Pending</span>
                                    <button className="secondary-button">Start Task</button>
                                </div>
                            </div>

                            <div className="task-item">
                                <div className="task-icon book-icon">
                                    <Book size={20} />
                                </div>
                                <div className="task-info">
                                    <p className="task-name">Operating Systems Quiz 3</p>
                                    <p className="task-meta">Due Oct 28 • OS Theory</p>
                                </div>
                                <div className="task-action">
                                    <span className="badge upcoming">Upcoming</span>
                                    <button className="secondary-button">View Details</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Area */}
                <div className="sidebar">
                    {/* Up Next Section */}
                    <section className="card next-class-card">
                        <div className="next-header">
                            <span className="label">UP NEXT</span>
                            <Video size={16} color="#2563eb" />
                        </div>
                        <h4>Database Systems</h4>
                        <p className="class-meta">Lab 304 • Prof. Gupta</p>
                        <div className="timer">
                            <span><Clock size={14} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Starts in 15 mins</span>
                        </div>
                    </section>

                    {/* Attendance Section */}
                    <section className="card attendance-card">
                        <div className="card-header">
                            <h3>Attendance</h3>
                            <MoreHorizontal size={18} color="#64748b" style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="attendance-chart">
                            <div className="circular-progress">
                                <div className="inner-circle">
                                    <span className="big-percent">82%</span>
                                    <span className="label">Overall</span>
                                </div>
                            </div>
                        </div>
                        <p className="attendance-footer">
                            You've attended <strong>45/55</strong> classes. <br />
                            <span className="standing">Good Standing</span>
                        </p>
                    </section>

                    {/* Recent Grades Section */}
                    <section className="card grades-card">
                        <div className="card-header">
                            <h3>Recent Grades</h3>
                            <button className="text-button">History</button>
                        </div>
                        <div className="grade-list">
                            <div className="grade-item">
                                <div>
                                    <p className="subject">Mathematics IV</p>
                                    <p className="exam-type">Mid-term Exam</p>
                                </div>
                                <span className="grade-badge grade-a">A</span>
                            </div>
                            <div className="grade-item">
                                <div>
                                    <p className="subject">Web Development</p>
                                    <p className="exam-type">Project 1</p>
                                </div>
                                <span className="grade-badge grade-aplus">A+</span>
                            </div>
                            <div className="grade-item">
                                <div>
                                    <p className="subject">Comp. Networks</p>
                                    <p className="exam-type">Quiz 2</p>
                                </div>
                                <span className="grade-badge grade-bplus">B+</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        :root {
          --primary-blue: #2563eb; /* Solid Blue Header Color */
          --bg-gray: #f8fafc;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --border-color: #e2e8f0;
          --success: #10b981;
          --urgent: #ef4444;
          --pending: #f59e0b;
          --white: #ffffff;
        }

        .dashboard-container {
          font-family: 'Inter', -apple-system, sans-serif;
          background-color: var(--bg-gray);
          min-height: 100vh;
          padding: 4px;
          color: var(--text-main);
        }

        /* Header Styles */
        .header {
          background-color: var(--primary-blue);
          border-radius: 12px;
          padding: 32px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .header-subtext {
          font-size: 14px;
          opacity: 0.9;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stats-group {
          background: rgba(255, 255, 255, 0.1);
          padding: 16px 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
          opacity: 0.8;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
        }

        .stat-divider {
          width: 1px;
          height: 30px;
          background: rgba(255, 255, 255, 0.3);
        }

        /* Layout */
        .main-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
        }

        .card {
          background: var(--white);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          margin-bottom: 24px;
          overflow: hidden;
        }

        .card-header {
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
        }

        .card-header h3 {
          font-size: 15px;
          font-weight: 600;
          margin: 0;
          color: var(--text-main);
        }

        /* Roadmap Styles */
        .roadmap-body {
          padding: 20px;
        }

        .course-name {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .module-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 12px;
        }

        .module-info h4 {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
        }

        .progress-percent {
          font-weight: 700;
          color: var(--primary-blue);
        }

        .progress-bar-container {
          height: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .progress-bar {
          height: 100%;
          background: var(--primary-blue);
          border-radius: 4px;
        }

        .roadmap-steps {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-muted);
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 20px;
        }

        .active-step {
          color: var(--primary-blue);
          font-weight: 700;
          position: relative;
        }

        .active-step::after {
          content: '';
          position: absolute;
          bottom: -24px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 2px;
          background: var(--primary-blue);
        }

        .resource-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .resource-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }

        .icon-box {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-size: 18px;
        }

        .pdf-icon { background: #fff1f2; }
        .video-icon { background: #eff6ff; }

        .resource-title { font-size: 13px; font-weight: 600; margin: 0; }
        .resource-meta { font-size: 11px; color: var(--text-muted); margin: 2px 0 0 0; }

        /* Task Styles */
        .task-list {
          padding: 0 20px;
        }

        .task-item {
          display: flex;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .task-item:last-child { border-bottom: none; }

        .task-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          color: var(--primary-blue);
          font-weight: bold;
        }

        .task-info { flex: 1; }
        .task-name { font-weight: 600; margin: 0; font-size: 14px; }
        .task-meta { font-size: 12px; color: var(--text-muted); margin: 4px 0 0 0; }
        .due-today { color: #ef4444; font-weight: 500; }

        .task-action {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
          text-transform: uppercase;
        }

        .urgent { background: #fee2e2; color: #b91c1c; }
        .pending { background: #ffedd5; color: #9a3412; }
        .upcoming { background: #fef9c3; color: #854d0e; }

        /* Button Styles */
        .primary-button {
          background: var(--primary-blue);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .primary-button.small { padding: 4px 12px; }

        .secondary-button {
          background: white;
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .text-button {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 12px;
          cursor: pointer;
        }

        /* Sidebar Widgets */
        .next-class-card {
          background: #eff6ff;
          padding: 20px;
          border-color: #dbeafe;
        }

        .next-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .next-header .label {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
        }

        .next-class-card h4 { font-size: 16px; margin: 0 0 4px 0; }
        .class-meta { font-size: 12px; color: var(--text-muted); margin: 0 0 16px 0; }
        .timer { font-size: 13px; color: var(--primary-blue); font-weight: 600; }

        .attendance-card { padding: 20px; }
        .attendance-chart {
          display: flex;
          justify-content: center;
          padding: 20px 0;
        }

        .circular-progress {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: conic-gradient(var(--success) 82%, #f1f5f9 0);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .inner-circle {
          width: 110px;
          height: 110px;
          background: white;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .big-percent { font-size: 28px; font-weight: 800; }
        .inner-circle .label { font-size: 11px; color: var(--text-muted); }

        .attendance-footer { text-align: center; font-size: 12px; color: var(--text-muted); line-height: 1.5; }
        .standing { color: var(--success); font-weight: 700; }

        .grade-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .grade-item:last-child { border-bottom: none; }
        .subject { font-size: 13px; font-weight: 600; margin: 0; }
        .exam-type { font-size: 11px; color: var(--text-muted); margin: 2px 0 0 0; }

        .grade-badge {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
        }

        .grade-a { background: #eff6ff; color: #2563eb; }
        .grade-aplus { background: #f0fdf4; color: #16a34a; }
        .grade-bplus { background: #fff7ed; color: #ea580c; }
      ` }} />
        </div>
    );
};

export default StudentDashboard;
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MoreVertical, Clock, Users, Plus } from 'lucide-react';

const ClassesGrid = () => {
  const { searchQuery } = useOutletContext();

  const [classes] = useState([
    {
      id: 1,
      code: 'CS-201',
      title: 'Data Structures',
      section: 'CS-A',
      dept: 'Computer Science',
      sem: 'Sem 3',
      schedule: 'Mon 10:00 AM • Wed 10:00 AM',
      students: 45,
      total: 60,
      attendance: 92
    },
    {
      id: 2,
      code: 'CS-105',
      title: 'Programming Basics',
      section: 'CS-B',
      dept: 'Computer Science',
      sem: 'Sem 1',
      schedule: 'Tue 11:15 AM • Thu 11:15 AM',
      students: 52,
      total: 60,
      attendance: 86
    },
    {
      id: 3,
      code: 'AI-310',
      title: 'Intro to AI',
      section: 'AI-A',
      dept: 'Artificial Intelligence',
      sem: 'Sem 5',
      schedule: 'Fri 02:00 PM',
      students: 38,
      total: 40,
      attendance: 78
    },
    {
      id: 4,
      code: 'SE-402',
      title: 'Software Eng',
      section: 'SE-C',
      dept: 'Computer Science',
      sem: 'Sem 6',
      schedule: 'Mon 02:00 PM • Thu 10:00 AM',
      students: 41,
      total: 50,
      attendance: 95
    }
  ]);

  // --- FILTER LOGIC ---
  const filteredData = classes.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="classes-grid-content">
      <style>{`
        .classes-grid-content {
          padding-top: 20px;
          padding-bottom: 40px;
        }

        /* Grid */
        .class-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }

        /* Class Card */
        .class-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          padding: 24px;
          padding-bottom: 16px;
          position: relative;
        }

        .card-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .more-icon {
          position: absolute;
          right: 20px;
          top: 24px;
          color: #94a3b8;
          cursor: pointer;
        }

        .card-tags {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-top: 10px;
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        .tag-blue {
          background: #f1f5f9;
          color: #2563eb;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 800;
        }

        .card-body {
          padding: 0 24px 24px 24px;
          flex: 1;
        }

        .schedule-badge {
          background: #f0fdf4;
          color: #16a34a;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 20px;
          width: fit-content;
        }

        .stats-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .stats-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-weight: 500;
        }

        .stats-val {
          font-weight: 700;
          color: #334155;
        }

        .stats-val span {
          color: #cbd5e1;
          font-weight: 500;
        }

        .attendance-label {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .progress-bar {
          height: 6px;
          background: #f1f5f9;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 10px;
          transition: 0.5s ease;
        }

        .card-footer {
          padding: 24px;
          display: flex;
          gap: 12px;
          border-top: 1px solid #f1f5f9;
        }

        .btn {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-outline {
          background: white;
          border: 1px solid #e2e8f0;
          color: #475569;
        }

        .btn-primary {
          background: #2563eb;
          border: 1px solid #2563eb;
          color: white;
        }

        .btn-primary:hover { background: #1d4ed8; }

        /* Assign Card */
        .assign-card {
          border: 2px dashed #e2e8f0;
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          min-height: 350px;
        }

        .plus-circle {
          width: 48px;
          height: 48px;
          background: #eff6ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          margin-bottom: 16px;
        }

        .assign-text {
          font-size: 18px;
          font-weight: 600;
          color: #64748b;
        }
      `}</style>

      {/* --- GRID --- */}
      <div className="class-grid">
        {filteredData.map((item) => {
          // Dynamic Colors Logic
          const isHigh = item.attendance >= 90;
          const isMid = item.attendance >= 80 && item.attendance < 90;
          const statusColor = isHigh ? '#059669' : isMid ? '#d97706' : '#b91c1c';

          return (
            <div className="class-card" key={item.id}>
              <div className="card-header">
                <h3>{item.code} {item.title}</h3>
                <MoreVertical size={18} className="more-icon" />
                <div className="card-tags">
                  <span className="tag-blue">{item.section}</span>
                  <span>•</span>
                  <span>{item.dept}</span>
                  <span>•</span>
                  <span>{item.sem}</span>
                </div>
              </div>

              <div className="card-body">
                <div className="schedule-badge">
                  <Clock size={16} /> {item.schedule}
                </div>

                <div className="stats-row">
                  <div className="stats-label"><Users size={16} /> Total Students</div>
                  <div className="stats-val">{item.students} <span>/ {item.total}</span></div>
                </div>

                <div className="attendance-section">
                  <div className="attendance-label">
                    <span style={{ color: '#94a3b8' }}>Avg. Attendance</span>
                    <span style={{ color: statusColor }}>{item.attendance}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${item.attendance}%`,
                        backgroundColor: statusColor
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button className="btn btn-outline">View Details</button>
                <button className="btn btn-primary">Mark Attendance</button>
              </div>
            </div>
          );
        })}

        {/* --- ASSIGN NEW CLASS CARD --- */}
        <div className="class-card assign-card">
          <div className="plus-circle">
            <Plus size={24} />
          </div>
          <span className="assign-text">Assign New Class</span>
        </div>
      </div>
    </div>
  );
};

export default ClassesGrid;
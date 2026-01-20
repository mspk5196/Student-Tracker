import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  MoreVertical, Clock, Users, Plus,
  Calendar, BarChart3, FileText,
  ChevronRight, CheckCircle, XCircle, Edit2,
  Download, Eye, MessageSquare, Settings, TrendingUp
} from 'lucide-react';
import useAuthStore from '../../../../store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Attendance thresholds for status calculation
const attendanceThresholds = {
  excellent: 90,
  good: 80,
  warning: 70,
  critical: 60
};

const ClassesGrid = () => {
  const outletContext = useOutletContext() || {};
  const searchQuery = outletContext.searchQuery || '';
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalClasses: 0,
    totalStudents: 0,
    averageAttendance: 0,
    excellentClasses: 0,
    warningClasses: 0
  });

  // Fetch classes from API
  useEffect(() => {
    const fetchClasses = async () => {
      if (!token) {
        console.log('No token available, waiting...');
        return;
      }
      
      console.log('Fetching classes from:', `${API_URL}/faculty/my-classes`);
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/faculty/my-classes`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
          setClasses(data.data.classes || []);
          setFilteredClasses(data.data.classes || []);
          setSummary(data.data.summary || {});
        } else {
          setError(data.message || 'Failed to fetch classes');
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to fetch classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [token]);

  // Filter classes based on search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredClasses(classes);
      return;
    }
    
    let result = classes.filter(c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredClasses(result);
  }, [searchQuery, classes]);

  // Function to handle menu actions
  const handleMenuAction = (classId, action) => {
    setActiveMenu(null);

    switch (action) {
      case 'view':
        navigate(`/classes/${classId}`);
        break;
      case 'edit':
        alert('Editing functionality is currently restricted.');
        break;
      case 'attendance':
        alert(`Opening attendance for class ${classId}`);
        break;
      case 'tasks':
        alert(`Viewing tasks for class ${classId}`);
        break;
      case 'analytics':
        alert(`Opening analytics for class ${classId}`);
        break;
      case 'export':
        alert(`Exporting data for class ${classId}`);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this class?')) {
          setClasses(prev => prev.filter(c => c.id !== classId));
        }
        break;
    }
  };



  // Function to mark attendance
  const handleMarkAttendance = (classId) => {
    const updatedClasses = classes.map(c => {
      if (c.id === classId) {
        const newAttendance = Math.min(100, c.attendance + 5);
        return {
          ...c,
          attendance: newAttendance,
          status: newAttendance >= 90 ? 'excellent' :
            newAttendance >= 80 ? 'active' :
              newAttendance >= 70 ? 'warning' : 'critical'
        };
      }
      return c;
    });
    setClasses(updatedClasses);
    alert(`Attendance marked for ${classes.find(c => c.id === classId).code}`);
  };

  // Function to view details
  const handleViewDetails = (classId) => {
    navigate(`/classes/${classId}`);
  };

  // Function to get status color
  const getStatusColor = (attendance, status) => {
    if (status === 'excellent') return '#059669';
    if (status === 'warning') return '#d97706';
    if (status === 'critical') return '#dc2626';

    if (attendance >= 90) return '#059669';
    if (attendance >= 80) return '#16a34a';
    if (attendance >= 70) return '#d97706';
    return '#dc2626';
  };

  // Function to get status icon
  const getStatusIcon = (attendance, status) => {
    if (status === 'excellent' || attendance >= 90)
      return <CheckCircle size={14} />;
    if (status === 'warning' || attendance < 80)
      return <XCircle size={14} />;
    return <CheckCircle size={14} />;
  };

  return (
    <div className="classes-grid-content">

      <style>{`
        .classes-grid-content {
          padding: 20px 0 10px 0;
        }


        /* Stats Summary */
        .stats-summary {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          flex: 1;
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
        }

        .stat-change {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
        }

        .positive {
          color: #16a34a;
        }

        .negative {
          color: #dc2626;
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
          transition: all 0.3s ease;
          position: relative;
        }

        .class-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          border-color: #e2e8f0;
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
          padding-right: 30px;
        }

        .more-icon {
          position: absolute;
          right: 20px;
          top: 24px;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: 0.2s;
        }

        .more-icon:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .menu-dropdown {
          position: absolute;
          right: 20px;
          top: 50px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          min-width: 160px;
          z-index: 100;
        }

        .menu-item {
          padding: 10px 16px;
          font-size: 13px;
          color: #334155;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: 0.2s;
          border-bottom: 1px solid #f1f5f9;
        }

        .menu-item:last-child {
          border-bottom: none;
          color: #dc2626;
        }

        .menu-item:hover {
          background: #f8fafc;
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

        .additional-stats {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .additional-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #64748b;
        }

        .additional-stat-value {
          font-weight: 700;
          color: #334155;
        }

        .attendance-section {
          margin-bottom: 20px;
        }

        .attendance-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .attendance-status {
          display: flex;
          align-items: center;
          gap: 4px;
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .btn-outline {
          background: white;
          border: 1px solid #e2e8f0;
          color: #475569;
        }

        .btn-outline:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .btn-primary {
          background: #2563eb;
          border: 1px solid #2563eb;
          color: white;
        }

        .btn-primary:hover { 
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
        }

        .empty-state-icon {
          font-size: 48px;
          color: #cbd5e1;
          margin-bottom: 16px;
        }

        .empty-state-text {
          color: #64748b;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .empty-state-subtext {
          color: #94a3b8;
          font-size: 14px;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f1f5f9;
          border-top: 3px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #dc2626;
        }

        .error-icon {
          margin-bottom: 16px;
        }

        .retry-btn {
          margin-top: 16px;
          padding: 10px 20px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .retry-btn:hover {
          background: #1d4ed8;
        }
      `}</style>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your classes...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <XCircle size={48} className="error-icon" />
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      ) : (
        <>
      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-label">Total Classes</div>
          <div className="stat-value">{summary.totalClasses || classes.length}</div>
          <div className="stat-change positive">
            <TrendingUp size={12} /> Venues assigned
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">
            {summary.totalStudents || classes.reduce((sum, c) => sum + (c.students || 0), 0)}
          </div>
          <div className="stat-change positive">
            <TrendingUp size={12} /> Enrolled students
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Avg Attendance</div>
          <div className="stat-value">
            {summary.averageAttendance || (classes.length > 0 ? Math.round(classes.reduce((sum, c) => sum + (c.attendance || 0), 0) / classes.length) : 0)}%
          </div>
          <div className="stat-change positive">
            <TrendingUp size={12} /> Last 30 days
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="class-grid">
        {filteredClasses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FileText size={48} />
            </div>
            <div className="empty-state-text">No classes found</div>
            <div className="empty-state-subtext">
              Try adjusting your filters or contact administrator
            </div>
          </div>
        ) : (
          filteredClasses.map((item) => {
            const statusColor = getStatusColor(item.attendance, item.status);
            const StatusIcon = getStatusIcon(item.attendance, item.status);

            return (
              <div className="class-card" key={item.id}>
                <div className="card-header">
                  <h3>{item.code} {item.title}</h3>
                  <MoreVertical
                    size={18}
                    className="more-icon"
                    onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                  />

                  {activeMenu === item.id && (
                    <div className="menu-dropdown">
                      <div className="menu-item" onClick={() => handleMenuAction(item.id, 'view')}>
                        <Eye size={14} /> View Details
                      </div>
                      <div className="menu-item" onClick={() => handleMenuAction(item.id, 'edit')}>
                        <Edit2 size={14} /> Edit Class
                      </div>
                      <div className="menu-item" onClick={() => handleMenuAction(item.id, 'attendance')}>
                        <Calendar size={14} /> Attendance Report
                      </div>
                      <div className="menu-item" onClick={() => handleMenuAction(item.id, 'tasks')}>
                        <FileText size={14} /> View Tasks
                      </div>
                      <div className="menu-item" onClick={() => handleMenuAction(item.id, 'analytics')}>
                        <BarChart3 size={14} /> Analytics
                      </div>
                      <div className="menu-item" onClick={() => handleMenuAction(item.id, 'export')}>
                        <Download size={14} /> Export Data
                      </div>
                      <div className="menu-item" onClick={() => handleMenuAction(item.id, 'delete')}>
                        <XCircle size={14} /> Delete Class
                      </div>
                    </div>
                  )}

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
                    <div className="stats-label">
                      <Users size={16} /> Total Students
                    </div>
                    <div className="stats-val">
                      {item.students} <span>/ {item.total}</span>
                    </div>
                  </div>

                  <div className="additional-stats">
                    <div className="additional-stat">
                      <FileText size={14} />
                      <span>Tasks:</span>
                      <span className="additional-stat-value">{item.tasks} active</span>
                    </div>
                    <div className="additional-stat">
                      <MessageSquare size={14} />
                      <span>Pending:</span>
                      <span className="additional-stat-value">{item.pendingTasks}</span>
                    </div>
                  </div>

                  <div className="attendance-section">
                    <div className="attendance-label">
                      <span style={{ color: '#94a3b8' }}>Avg. Attendance</span>
                      <div className="attendance-status" style={{ color: statusColor }}>
                        {StatusIcon}
                        <span>{item.attendance}%</span>
                      </div>
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
                  <button
                    className="btn btn-outline"
                    onClick={() => handleViewDetails(item.id)}
                  >
                    <Eye size={14} /> View Details
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleMarkAttendance(item.id)}
                  >
                    <Calendar size={14} /> Mark Attendance
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
        </>
      )}
    </div>
  );
};

export default ClassesGrid;
import React, { useState, useEffect } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  Download,
  Upload,
  Link,
  ChevronRight,
  Calendar,
  User,
  Check,
  Code,
  Database,
  Layout,
  Server,
  ArrowLeft
} from "lucide-react";
import useAuthStore from "../../../store/useAuthStore";

const TasksAssignments = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token, user } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [submissionType, setSubmissionType] = useState("file"); // 'file' or 'link'
  const [selectedCourse, setSelectedCourse] = useState(null); // New state for course selection
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  // Courses Data
  const courses = [
    { id: 'frontend', name: 'Frontend Development', icon: Code, color: 'blue', desc: 'HTML, CSS, React' },
    { id: 'backend', name: 'Backend Development', icon: Server, color: 'green', desc: 'Node.js, API Design' },
    { id: 'devops', name: 'DevOps', icon: Database, color: 'purple', desc: 'CI/CD, Docker, K8s' },
    { id: 'react-native', name: 'React Native', icon: Layout, color: 'pink', desc: 'Mobile Development' },
  ];

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/tasks/student`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.success && data.data) {
          // Transform backend data to match UI format
          const allTasks = [];
          Object.values(data.data.groupedTasks || {}).forEach(group => {
            group.tasks.forEach(task => {
              allTasks.push({
                id: task.id,
                title: task.title,
                subject: task.courseType || 'frontend', // Use courseType from backend
                status: task.status, // 'pending', 'completed', 'revision', 'overdue'
                dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date',
                points: task.score,
                score: task.grade ? parseInt(task.grade.split('/')[0]) : null,
                assignedBy: task.instructor,
                description: task.description || 'No description provided',
                feedback: task.feedback,
                resources: task.materials || [],
                dayLabel: task.moduleTitle,
                skillFilter: task.skillFilter || '',
                submissionStatus: task.submissionStatus,
                submittedDate: task.submittedDate,
                fileName: task.fileName
              });
            });
          });
          setTasks(allTasks);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchTasks();
    }
  }, [token, API_URL]);

  const filteredTasks = tasks.filter((t) => {
    // First Filter by Course
    if (selectedCourse && t.subject !== selectedCourse) return false;

    // Then Filter by Status
    if (activeFilter === "pending")
      return t.status === "pending" || t.status === "overdue" || t.status === "revision";
    if (activeFilter === "submitted") return t.status === "pending";
    if (activeFilter === "graded") return t.status === "completed";
    return true;
  });

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  // Auto-select first task when entering a course
  useEffect(() => {
    if (selectedCourse && filteredTasks.length > 0) {
      setSelectedTaskId(filteredTasks[0].id);
    } else {
      setSelectedTaskId(null);
    }
  }, [selectedCourse, activeFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "revision":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      case "revision":
        return "Needs Revision";
      case "overdue":
        return "Overdue";
      default:
        return status;
    }
  };

  return (
    <div className="page-wrapper">
      <style>{`
        .page-wrapper {
          display: flex;
          height: 100vh;
          background-color: #f8fafc;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        /* Course Grid View */
        .course-grid-container {
          padding: 40px;
          flex: 1;
          overflow-y: auto;
        }

        .course-page-title {
          font-size: 28px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 8px;
          margin-top: -20px;
        }
        
        .course-page-subtitle {
          color: #64748b;
          margin-bottom: 32px;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .course-card-select {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .course-card-select:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.08);
          border-color: #cbd5e1;
        }

        .course-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .course-name-lg {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }
        
        .course-desc {
          font-size: 14px;
          color: #64748b;
        }

        .course-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }

        .stat-badge {
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }

        /* Sidebar Styling */
        .sidebar {
          width: 380px;
          background: white;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 16px;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .back-btn:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #f1f5f9;
        }

        .search-container {
          position: relative;
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          padding: 10px 12px 10px 36px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
          outline: none;
          background: #ffffff;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
        }

        .filter-pill {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-pill.active {
          background: #0f172a;
          color: white;
          border-color: #0f172a;
        }

        .filter-pill:hover:not(.active) {
            background: #f1f5f9;
        }

        .task-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .task-card {
          padding: 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .task-card:hover {
          border-color: #cbd5e1;
        }

        .task-card.active {
          border: 2px solid #3b82f6;
          background: #eff6ff;
        }

        .task-card-header {
           margin-bottom: 8px;
        }

        .card-day {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .card-title {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.4;
        }

        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
        }

        .subject-tag {
          font-size: 12px;
          color: #64748b;
        }

        .status-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          display: inline-block;
          border: 1px solid transparent;
        }

        /* Main Content Styling */
        .main-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px 48px;
        }

        .content-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 40px;
          max-width: 900px;
          margin: 0 auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .task-header {
           display: flex;
           justify-content: space-between;
           align-items: flex-start;
           margin-bottom: 24px;
           padding-bottom: 24px;
           border-bottom: 1px solid #f1f5f9;
        }

        .header-label {
           font-size: 12px;
           font-weight: 700;
           color: #3b82f6;
           text-transform: uppercase;
           margin-bottom: 8px;
           display: block;
        }

        .header-title {
           font-size: 28px;
           font-weight: 700;
           color: #1e293b;
           margin-bottom: 12px;
        }

        .meta-row {
           display: flex;
           gap: 24px;
           font-size: 14px;
           color: #64748b;
        }

        .meta-item {
           display: flex;
           align-items: center;
           gap: 6px;
        }

        .points-badge {
           background: #f1f5f9;
           padding: 6px 12px;
           border-radius: 8px;
           font-size: 13px;
           font-weight: 600;
           color: #334155;
        }

        .points-value {
           font-size: 28px;
           font-weight: 700;
           color: #0066FF;
           line-height: 1;
        }

        .score-display {
           text-align: right;
           display: flex;
           flex-direction: column;
           align-items: flex-end;
        }

        .section-title {
           font-size: 16px;
           font-weight: 600;
           color: #1e293b;
           margin-bottom: 16px;
           margin-top: 32px;
        }

        .description-text {
            color: #334155;
            line-height: 1.6;
            font-size: 15px;
            white-space: pre-wrap;
        }

        .resources-grid {
           display: flex;
           gap: 16px;
           flex-wrap: wrap;
        }

        .resource-btn {
           display: flex;
           align-items: center;
           gap: 10px;
           padding: 12px 16px;
           background: #ffffff;
           border: 1px solid #e2e8f0;
           border-radius: 8px;
           color: #475569;
           font-size: 14px;
           font-weight: 500;
           text-decoration: none;
           transition: all 0.2s;
           cursor: pointer;
        }

        .resource-btn:hover {
           background: #f8fafc;
           border-color: #cbd5e1;
           color: #1e293b;
        }

        .submission-area {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-top: 32px;
        }
        
        .submission-tabs {
            display: flex;
            gap: 24px;
            margin-bottom: 24px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .sub-tab {
            padding-bottom: 12px;
            font-size: 14px;
            font-weight: 600;
            color: #64748b;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-bottom: -1px;
        }
        
        .sub-tab.active {
            color: #0066FF;
            border-bottom-color: #0066FF;
        }

        .upload-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }

        .upload-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            height: 160px;
        }

        .upload-card:hover {
            border-color: #0066FF;
            box-shadow: 0 4px 12px rgba(0, 102, 255, 0.05);
        }

        .upload-label {
            margin-top: 12px;
            font-weight: 600;
            color: #1e293b;
        }

        .upload-sub {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
        }

        .submit-btn {
            background: #0066FF;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 24px;
            cursor: pointer;
            float: right;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.2s;
        }

        .submit-btn:hover {
            background: #005ce6;
        }

        .grad-feedback-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 24px;
          margin-top: 32px;
        }

        .feedback-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #166534;
          margin-bottom: 12px;
        }
        
        .feedback-text {
           font-size: 15px;
           color: #15803d;
           line-height: 1.5;
        }

        /* Utility classes */
        .text-red-500 { color: #ef4444; }
        .text-blue-500 { color: #3b82f6; }
        .text-gray-500 { color: #64748b; }
        .text-gray-400 { color: #94a3b8; }
        .font-bold { font-weight: 700; }
        .tracking-wider { letter-spacing: 0.05em; }
        .mt-1 { margin-top: 4px; }
        .ms-2 { margin-left: 8px; }
        .bg-yellow-50 { background-color: #fefce8; }
        .text-yellow-700 { color: #a16207; }
        .border-yellow-200 { border-color: #fef08a; }
        .bg-green-50 { background-color: #f0fdf4; }
        .text-green-700 { color: #15803d; }
        .border-green-200 { border-color: #bbf7d0; }
        .bg-blue-50 { background-color: #eff6ff; }
        .text-blue-700 { color: #1d4ed8; }
        .border-blue-200 { border-color: #bfdbfe; }
        .bg-red-50 { background-color: #fef2f2; }
        .text-red-700 { color: #b91c1c; }
        .border-red-200 { border-color: #fecaca; }
        .bg-gray-50 { background-color: #f9fafb; }
        .text-gray-700 { color: #374151; }

      `}</style>

      {/* CONDITIONAL RENDERING: COURSE SELECTION or TASK VIEW */}
      {!selectedCourse ? (
        /* COURSE SELECTION VIEW */
        <div className="course-grid-container">
           <h1 className="course-page-title">My Courses</h1>
           <p className="course-page-subtitle">Select a course to view assignments and tasks</p>
           
           <div className="courses-grid">
              {courses.map(course => (
                <div 
                   key={course.id} 
                   className="course-card-select"
                   onClick={() => setSelectedCourse(course.id)}
                >
                   <div className="course-icon-wrapper" style={{background: `var(--bg-${course.color})`}}>
                      <course.icon size={24} color={`var(--text-${course.color})`} />
                   </div>
                   <div>
                      <h3 className="course-name-lg">{course.name}</h3>
                      <p className="course-desc">{course.desc}</p>
                   </div>
                   
                   <div className="course-stats">
                     <span className="stat-badge">
                        {tasks.filter(t => t.subject === course.id && t.status === 'pending').length} Pending Tasks
                     </span>
                     <ChevronRight size={20} color="#cbd5e1" />
                   </div>
                </div>
              ))}
           </div>
           
           {/* Color Helpers (inline for now) */}
           <style>{`
             :root {
               --bg-blue: #eff6ff; --text-blue: #3b82f6;
               --bg-green: #f0fdf4; --text-green: #15803d;
               --bg-purple: #f3e8ff; --text-purple: #9333ea;
               --bg-pink: #fdf2f8; --text-pink: #db2777;
               --bg-orange: #fff7ed; --text-orange: #c2410c;
             }
           `}</style>
        </div>
      ) : (
        /* TASK VIEW (Layout containing Sidebar + Main Content) */
        <>
            {/* LEFT SIDEBAR */}
            <div className="sidebar">
              <div className="sidebar-header">
                {/* BACK BUTTON ADDED HERE */}
                <div 
                  className="back-btn" 
                  onClick={() => setSelectedCourse(null)}
                >
                   <ArrowLeft size={16} />
                   Back to Courses
                </div>

                <div className="search-container">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="search-input"
                  />
                </div>

                <div className="filter-tabs">
                  <button
                    className={`filter-pill ${activeFilter === "all" ? "active" : ""}`}
                    onClick={() => setActiveFilter("all")}
                  >
                    All ({tasks.filter((t) => t.subject === selectedCourse).length})
                  </button>
                  <button
                    className={`filter-pill ${activeFilter === "pending" ? "active" : ""}`}
                    onClick={() => setActiveFilter("pending")}
                  >
                    Pending (
                    {
                      tasks.filter(
                        (t) => t.subject === selectedCourse && (t.status === "pending" || t.status === "missing"),
                      ).length
                    }
                    )
                  </button>
                  <button
                    className={`filter-pill ${activeFilter === "submitted" ? "active" : ""}`}
                    onClick={() => setActiveFilter("submitted")}
                  >
                    Submitted
                  </button>
                  <button
                    className={`filter-pill ${activeFilter === "graded" ? "active" : ""}`}
                    onClick={() => setActiveFilter("graded")}
                  >
                    Graded
                  </button>
                </div>
              </div>

              <div className="task-list">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`task-card ${selectedTaskId === task.id ? "active" : ""}`}
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      <div className="task-card-header">
                        <span className="card-day">{task.dayLabel}</span>
                        <h4 className="card-title">{task.title}</h4>
                      </div>
                      <div className="card-meta">
                        <span className="subject-tag">{task.subject}</span>
                        <span
                          className={`status-badge ${getStatusColor(task.status)}`}
                        >
                          {getStatusLabel(task.status)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "40px 20px",
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: "14px",
                    }}
                  >
                     <div style={{background: '#f1f5f9', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto'}}>
                         <Check size={24} color="#cbd5e1" />
                     </div>
                     No {activeFilter === 'all' ? '' : `${activeFilter} `}tasks for {selectedCourse}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT MAIN CONTENT */}
            <div className="main-content">
              {selectedTask ? (
                <div className="content-card">
                  <div className="task-header">
                    <div>
                      <span className="header-label">{selectedTask.dayLabel}</span>
                      <h1 className="header-title">{selectedTask.title}</h1>
                      <div className="meta-row">
                        <div className="meta-item">
                          <User size={16} />
                          Assigned by: {selectedTask.assignedBy}
                        </div>
                        <div
                          className={`meta-item ${selectedTask.status === "missing" ? "text-red-500" : ""}`}
                        >
                          <Clock size={16} />
                          Due {selectedTask.dueDate}
                        </div>
                      </div>
                    </div>

                    <div className="score-display">
                      {selectedTask.status === "graded" ? (
                        <>
                          <div className="points-value" style={{ color: "#0066FF" }}>
                            {selectedTask.score}
                          </div>
                          <div
                            className="text-gray-500 font-bold tracking-wider"
                            style={{ fontSize: "10px", marginTop: "4px" }}
                          >
                            MAX POINTS
                          </div>
                        </>
                      ) : (
                        <div className="points-badge">
                          {selectedTask.points} Points
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="description-section">
                    <p className="description-text">{selectedTask.description}</p>
                  </div>

                  {/* Resources */}
                  {selectedTask.resources && selectedTask.resources.length > 0 && (
                    <>
                      <h3 className="section-title">Reference Material</h3>
                      <div className="resources-grid">
                        {selectedTask.resources.map((res, idx) => (
                          <a 
                            key={idx} 
                            href={res.type === "pdf" ? `http://localhost:5000${res.path}` : res.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            download={res.type === "pdf" ? res.name : undefined}
                            className="resource-btn"
                          >
                            {res.type === "pdf" ? (
                              <FileText size={18} className="text-red-500" />
                            ) : (
                              <Link size={18} className="text-blue-500" />
                            )}
                            {res.name}
                            {res.type === "pdf" && (
                              <Download size={14} className="text-gray-400 ms-2" />
                            )}
                          </a>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Submission Section */}
                  {selectedTask.status === "graded" ? (
                    <>
                      <div
                        className="submission-area"
                        style={{ background: "#f0f9ff", borderColor: "#bae6fd" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <h3
                              className="font-bold text-gray-800"
                              style={{ fontSize: "16px", margin: 0 }}
                            >
                              Your Submission
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              Submitted Oct 14 at 4:30 PM
                            </p>
                          </div>
                          <div className="resource-btn bg-white">
                            <FileText size={18} className="text-blue-500" />
                            my_submission_final.pdf
                          </div>
                        </div>
                      </div>

                      <div className="grad-feedback-box">
                        <div className="feedback-title">
                          <CheckCircle2 size={20} />
                          Faculty Feedback
                        </div>
                        <p className="feedback-text">{selectedTask.feedback}</p>
                      </div>
                    </>
                  ) : selectedTask.status === "submitted" ? (
                    <div
                      className="submission-area"
                      style={{ background: "#f0f9ff", borderColor: "#bae6fd" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <h3
                            className="font-bold text-gray-800"
                            style={{ fontSize: "16px", margin: 0 }}
                          >
                            Your Submission
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            Submitted yesterday at 4:30 PM
                          </p>
                        </div>
                        <div className="resource-btn bg-white">
                          <FileText size={18} className="text-blue-500" />
                          submission_v1.pdf
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="submission-area">
                      <h3 className="section-title" style={{ marginTop: 0 }}>
                        Your Submission
                      </h3>

                      <div className="submission-tabs">
                        <span
                          className={`sub-tab ${submissionType === "file" ? "active" : ""}`}
                          onClick={() => setSubmissionType("file")}
                        >
                          File Upload
                        </span>
                        <span
                          className={`sub-tab ${submissionType === "link" ? "active" : ""}`}
                          onClick={() => setSubmissionType("link")}
                        >
                          External Link
                        </span>
                      </div>

                      {submissionType === "file" ? (
                        <div className="upload-options">
                          <div className="upload-card">
                            <FileText size={32} color="#64748b" />
                            <span className="upload-label">Upload Document</span>
                            <span className="upload-sub">PDF or Word</span>
                          </div>
                          <div className="upload-card">
                            <Link size={32} color="#64748b" />
                            <span className="upload-label">Paste URL</span>
                            <span className="upload-sub">Drive, GitHub, etc.</span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="link-input-area"
                          style={{
                            padding: "30px",
                            textAlign: "center",
                            border: "1px dashed #cbd5e1",
                            borderRadius: "8px",
                            background: "white",
                          }}
                        >
                          <div
                            style={{
                              position: "relative",
                              maxWidth: "400px",
                              margin: "0 auto",
                            }}
                          >
                            <Link
                              size={16}
                              style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#94a3b8",
                              }}
                            />
                            <input
                              type="text"
                              placeholder="https://..."
                              style={{
                                width: "100%",
                                padding: "10px 12px 10px 36px",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                outline: "none",
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div style={{ overflow: "hidden" }}>
                        <button className="submit-btn">
                          <Upload size={18} />
                          Submit Assignment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                  }}
                >
                  <div style={{textAlign: 'center'}}>
                    <div style={{background: '#f1f5f9', padding: '20px', borderRadius: '50%', marginBottom:'20px', display: 'inline-flex'}}> 
                        <FileText size={48} color="#cbd5e1" />
                    </div>
                    <h3 style={{fontSize:'18px', fontWeight:600, color:'#475569', marginBottom:'8px'}}>No Task Selected</h3>
                    <p style={{fontSize:'14px'}}>Select a task from the list to view details</p>
                  </div>
                </div>
              )}
            </div>
        </>
      )}
    </div>
  );
};

export default TasksAssignments;
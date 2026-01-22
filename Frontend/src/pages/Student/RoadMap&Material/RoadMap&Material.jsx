import React, { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Lock,
  PlayCircle,
  FileText,
  Code,
  ExternalLink,
  MessageCircle,
  CheckSquare,
  ChevronRight,
  BookOpen
} from "lucide-react";
import useAuthStore from "../../../store/useAuthStore";

const StudentRoadmap = () => {
  const { token, user } = useAuthStore();
  const [roadmapData, setRoadmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  useEffect(() => {
    fetchRoadmapData();
  }, []);

  const fetchRoadmapData = async () => {
    setLoading(true);
    try {
      // Mock data generation (preserving original logic but enhancing for new UI)
      const frontendTopics = [
        "HTML5 Semantic Structure",
        "CSS3 Modern Styling",
        "JavaScript Fundamentals",
        "Advanced JavaScript & ES6+",
        "Git Version Control",
        "React Component Basics",
        "React Hooks & State",
        "Context API Management",
        "Redux Toolkit",
        "React Router & Navigation",
        "API Integration & Fetch",
        "Form Handling & Validation",
        "Tailwind CSS Styling",
        "Frontend Performance",
        "Final Capstone Project"
      ];

      const mockData = Array.from({ length: 15 }, (_, i) => ({
        roadmap_id: i + 1,
        title: frontendTopics[i],
        description: `Deep dive into ${frontendTopics[i]}. Master the core concepts and build real-world projects.`,
        day: (i + 1) * 3,
        is_completed: i < 2, // First 2 completed
        is_current: i === 2, // 3rd is current
        is_locked: i > 2,
        progress: i === 2 ? 65 : (i < 2 ? 100 : 0),
        resources: [
            { id: `doc-${i}`, name: "Concept Notes", type: "pdf", size: "1.8 MB" },
            { id: `vid-${i}`, name: "Video Lecture", type: "video", duration: "45 min" },
            { id: `prac-${i}`, name: "Practice Playground", type: "code", desc: "Live editor" },
            { id: `ref-${i}`, name: "MDN Reference", type: "link", desc: "External docs" }
        ],
        tasks: [
            { id: 1, title: "Write a program using if / else", time: "20 mins", completed: false },
            { id: 2, title: "Loop through an array and print values", time: "25 mins", completed: false },
            { id: 3, title: "Mini quiz: 10 JS basics questions", time: "15 mins", completed: false }
        ]
      }));

      // No network delay needed
      setRoadmapData(mockData);
      
      // Select the current active node by default
      const currentNode = mockData.find(n => n.is_current) || mockData[0];
      setSelectedNodeId(currentNode.roadmap_id);

    } catch (err) {
      console.error("Error fetching roadmap:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectedNode = roadmapData.find(n => n.roadmap_id === selectedNodeId) || roadmapData[0];
  const completedCount = roadmapData.filter(n => n.is_completed).length;
  const progressPercentage = roadmapData.length ? Math.round((completedCount / roadmapData.length) * 100) : 0;

  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText size={20} className="text-blue-500" />;
      case 'video': return <PlayCircle size={20} className="text-red-500" />;
      case 'code': return <Code size={20} className="text-purple-500" />;
      case 'link': return <ExternalLink size={20} className="text-gray-500" />;
      default: return <FileText size={20} />;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="page-container">
      <style>{`
        .page-container {
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: 'Inter', sans-serif;
          color: #1a202c;
          width: 100%;
          margin: 0;
        }

        /* Header Section - Matched to TaskHeader.jsx */
        .sticky-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
        }

        .left-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .dropdown-container {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 280px;
        }

        .dropdown-select {
          width: 100%;
          padding: 8px 36px 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          color: #1e293b;
          font-weight: 500;
          background-color: #ffffff;
          cursor: pointer;
          appearance: none;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 36px;
        }

        .right-section {
           display: flex;
           align-items: center;
           gap: 12px;
        }

        .overall-progress {
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 250px;
        }

        .progress-text {
          text-align: right;
        }

        .progress-percent {
          font-size: 18px;
          font-weight: 700;
          color: #2d3748;
          display: block;
        }

        .progress-detail {
          font-size: 13px;
          color: #718096;
        }

        .progress-bar-bg {
          flex: 1;
          height: 8px;
          background: #edf2f7;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: #10b981;
          border-radius: 4px;
        }

        /* Main Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 24px;
          height: calc(100vh - 60px);
          padding: 24px;
          max-width: 100%;
          margin: 0;
          box-sizing: border-box; /* Ensure padding is contained */
        }

        /* Timeline Column */
        .timeline-column {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .timeline-column::-webkit-scrollbar {
          width: 6px;
        }

        .timeline-column::-webkit-scrollbar-track {
          background: transparent;
        }

        .timeline-column::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .timeline-column::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }

        .timeline-header {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .timeline-title {
          font-size: 14px;
          font-weight: 600;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .timeline-track {
          position: relative;
          padding-left: 12px;
          min-height: 200px;
        }
        
        /* Vertical line */
        .timeline-track::before {
          content: '';
          position: absolute;
          left: 27px; /* Center of the 32px node (12px padding + 16px center - 1px width) */
          top: 0;
          bottom: 0; /* Full height */
          width: 2px;
          background: #e2e8f0;
          z-index: 0;
        }

        .timeline-node {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding-bottom: 40px;
          cursor: pointer;
          z-index: 1;
        }

        .timeline-node:last-child {
          padding-bottom: 0;
        }

        .node-marker {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          border: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: #94a3b8;
          flex-shrink: 0;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2; /* Sit above line */
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .timeline-node:hover .node-marker {
          border-color: #cbd5e1;
          transform: scale(1.05);
        }

        .timeline-node.completed .node-marker {
          background: #10b981;
          border: none;
          color: white;
          box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
        }

        .timeline-node.current .node-marker {
          background: #3b82f6;
          border: none;
          color: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.25);
        }

        .timeline-node.locked .node-marker {
          background: #f8fafc;
          border-color: #e2e8f0;
          color: #cbd5e1;
          box-shadow: none;
        }

        .node-content {
          flex: 1;
          transition: all 0.2s;
        }

        /* Restored box style for current node */
        .node-content.current {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 16px;
          margin-top: -8px; /* Align slightly better with marker */
        }

        .node-status-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 6px;
          display: inline-block;
        }

        .status-completed { color: #10b981; }
        .status-current { color: #3b82f6; }
        .status-locked { color: #94a3b8; }

        .node-title {
          font-size: 15px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
          line-height: 1.4;
          transition: color 0.2s;
        }
        
        .timeline-node.current .node-title {
          color: #1e3a8a;
          font-weight: 700;
        }

        .timeline-node.locked .node-title {
          color: #94a3b8;
        }

        .node-meta {
          font-size: 13px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }


        /* Detail Column */
        .detail-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .detail-column::-webkit-scrollbar {
          width: 6px;
        }

        .detail-column::-webkit-scrollbar-track {
          background: transparent;
        }

        .detail-column::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .detail-column::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }

        .detail-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .node-header-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .header-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #718096;
          font-weight: 500;
        }

        .node-progress-wrapper {
          text-align: right;
        }

        .node-progress-label {
          font-size: 12px;
          color: #718096;
          font-weight: 600;
          text-transform: uppercase;
        }

        .node-progress-bar {
          width: 150px;
          height: 6px;
          background: #edf2f7;
          border-radius: 3px;
          margin-top: 6px;
          overflow: hidden;
        }
        
        .node-progress-fill {
          height: 100%;
          background: #10b981;
          border-radius: 3px;
        }

        .main-title {
          font-size: 28px;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .main-description {
          font-size: 16px;
          color: #4a5568;
          line-height: 1.6;
        }

        .grid-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .subsection {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #edf2f7;
        }

        .subsection-title {
          font-size: 16px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Resources List */
        .resources-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .resource-item {
          display: flex;
          align-items: center;
          padding: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .resource-item:hover {
          border-color: #3b82f6;
        }

        .resource-icon-box {
          width: 40px;
          height: 40px;
          background: #f7fafc;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }

        .resource-details {
          flex: 1;
        }

        .resource-name {
          font-size: 14px;
          font-weight: 600;
          color: #2d3748;
          display: block;
        }

        .resource-meta {
          font-size: 12px;
          color: #718096;
        }

        /* Tasks List */
        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .task-item {
          display: flex;
          align-items: center;
          padding: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .task-checkbox-wrapper {
          margin-right: 12px;
        }

        .task-content {
          flex: 1;
        }

        .task-title {
          font-size: 14px;
          font-weight: 500;
          color: #2d3748;
          display: block;
        }

        .task-meta {
          font-size: 12px;
          color: #718096;
          margin-top: 2px;
        }

        .est-time {
          font-size: 12px;
          color: #3b82f6;
          font-weight: 600;
          background: #eff6ff;
          padding: 2px 8px;
          border-radius: 12px;
        }

        /* Action Buttons */
        .action-bar {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .btn {
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          border: none;
        }

        .btn-outline {
          background: white;
          border: 1px solid #e2e8f0;
          color: #4a5568;
        }

        .btn-outline:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .path-summary-card {
           background: #eff6ff;
           border-radius: 12px;
           padding: 20px;
           margin-bottom: 24px;
        }

        .path-summary-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e40af;
          margin-bottom: 12px;
        }
        
        .path-summary-list {
           display: flex;
           flex-direction: column;
           gap: 8px;
        }

        .path-step {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #1e3a8a;
        }

        /* Tailwind utilities helpers since native tailwind might not be available */
        .text-blue-500 { color: #3b82f6; }
        .text-blue-600 { color: #2563eb; }
        .text-red-500 { color: #ef4444; }
        .text-purple-500 { color: #a855f7; }
        .text-gray-500 { color: #6b7280; }
        .text-gray-400 { color: #9ca3af; }
        .text-gray-600 { color: #4b5563; }
        .text-gray-800 { color: #1f2937; }
        .text-green-500 { color: #10b981; }
        .text-green-600 { color: #059669; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-2 { gap: 8px; }
        .gap-3 { gap: 12px; }
        .mb-3 { margin-bottom: 12px; }
        .mb-6 { margin-bottom: 24px; }
        .mb-8 { margin-bottom: 32px; }
        .p-6 { padding: 24px; }
        .rounded-xl { border-radius: 12px; }
        .border { border-width: 1px; }
        .border-gray-100 { border-color: #f3f4f6; }
        .leading-relaxed { line-height: 1.625; }
        .w-5 { width: 1.25rem; }
        .h-5 { height: 1.25rem; }
        .text-sm { font-size: 0.875rem; }
        .text-xl { font-size: 1.25rem; }
        .opacity-70 { opacity: 0.7; }
        .bg-gray-50 { background-color: #f9fafb; }
        .space-y-6 > * + * { margin-top: 1.5rem; }

      `}</style>
      
      {/* Header - Matched to TaskHeader.jsx layout */}
      <div className="sticky-header">
         <div className="left-section">
             <div style={{ fontSize: '14px', color: '#64748b', marginRight: '8px' }}>Current Skill Track:</div>
             <div className="dropdown-container">
                <button className="dropdown-select">
                   Frontend Developer Roadmap
                </button>
                <div style={{ position: 'absolute', right: '10px', pointerEvents: 'none', display: 'flex' }}>
                  <ChevronRight size={14} color="#64748b" />
                </div>
             </div>
          </div>

          <div className="right-section">
            <div className="overall-progress">
              <div className="progress-text">
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{progressPercentage}% completed</span>
              </div>
              <div className="progress-bar-bg" style={{ width: '150px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '10px' }}>
                <div className="progress-bar-fill" style={{ width: `${progressPercentage}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '10px' }}></div>
              </div>
            </div>
          </div>
      </div>

      <div className="content-grid">
        {/* Left Column: Timeline */}
        <div className="timeline-column">
          <div className="timeline-header">
            <span className="timeline-title">Journey Timeline</span>
          </div>

          <div className="timeline-track">
            {roadmapData.map((node, index) => (
              <div 
                key={node.roadmap_id} 
                className={`timeline-node ${node.is_completed ? 'completed' : ''} ${node.roadmap_id === selectedNodeId ? 'current' : ''} ${node.is_locked ? 'locked' : ''}`}
                onClick={() => !node.is_locked && setSelectedNodeId(node.roadmap_id)}
              >
                <div className="node-marker">
                  {node.is_completed ? (
                    <Check size={18} strokeWidth={3} />
                  ) : node.is_locked ? (
                    <Lock size={14} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className={`node-content ${node.roadmap_id === selectedNodeId ? 'current' : ''}`}>
                  {/* Status Label Logic */}
                  {node.is_completed && <div className="node-status-label status-completed">COMPLETED</div>}
                  {node.roadmap_id === selectedNodeId && !node.is_completed && <div className="node-status-label status-current">IN PROGRESS</div>}
                  {node.is_locked && <div className="node-status-label status-locked">LOCKED</div>}

                  <div className="node-title">{node.title}</div>
                  
                  {/* Meta Info */}
                  {node.is_completed && (
                     <div className="node-meta">
                        All resources viewed
                     </div>
                  )}

                  {node.roadmap_id === selectedNodeId && (
                    <div className="node-meta" style={{ color: '#3b82f6' }}>
                      2 / 3 resources done
                    </div>
                  )}
                  
                  {node.is_locked && (
                     <div className="node-meta">
                      Complete previous step to unlock
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="detail-column">
          {selectedNode && (
            <div className="detail-card">
              <div className="node-header-info">
                <div className="header-breadcrumbs">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-500" />
                    <span className="font-semibold text-blue-600">Current Skill</span>
                  </div>
                  <span>•</span>
                  <span>Level {selectedNode.roadmap_id} / {roadmapData.length}</span>
                </div>
                <div className="node-progress-wrapper">
                    <div className="node-progress-label">Node Progress</div>
                    <div className="flex items-center gap-3">
                         <span className="text-xl font-bold text-gray-800">{selectedNode.progress || 0}%</span>
                         <div className="node-progress-bar">
                            <div className="node-progress-fill" style={{ width: `${selectedNode.progress || 0}%` }}></div>
                         </div>
                    </div>
                </div>
              </div>

              <h1 className="main-title">{selectedNode.title}</h1>
              <p className="main-description mb-8">{selectedNode.description}</p>

              <div className="grid-layout">
                {/* Left Sub-column */}
                <div className="space-y-6">
                   {/* Study Materials */}
                   <div className="subsection">
                     <h3 className="subsection-title">
                       <BookOpen size={18} />
                       Study materials
                     </h3>
                     <div className="resources-list">
                        {selectedNode.resources.map((res, idx) => (
                          <div key={idx} className="resource-item">
                            <div className="resource-icon-box">
                               {getResourceIcon(res.type)}
                            </div>
                            <div className="resource-details">
                                <span className="resource-name">{res.name}</span>
                                <span className="resource-meta">{res.type === 'pdf' ? res.size : res.desc || res.duration}</span>
                            </div>
                          </div>
                        ))}
                     </div>
                   </div>
                </div>

                {/* Right Sub-column */}
                <div className="space-y-6">
                  {/* Deep description */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                     <h3 className="font-bold text-gray-800 mb-3">What you will learn in this skill</h3>
                     <p className="text-gray-600 text-sm leading-relaxed">
                        Deep dive into core {selectedNode.title} concepts: variables, primitive and reference types, conditionals, loops, and basic functions. By the end of this level you should be comfortable writing small interactive scripts in the browser.
                     </p>
                  </div>

                  {/* Micro Tasks */}
                  <div className="subsection">
                    <h3 className="subsection-title">
                      <CheckSquare size={18} />
                      Today's micro-tasks
                    </h3>
                    <div className="tasks-list">
                       {selectedNode.tasks?.map((task, idx) => (
                         <div key={idx} className="task-item">
                           <div className="task-checkbox-wrapper">
                              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                           </div>
                           <div className="task-content">
                              <span className="task-title">{task.title}</span>
                           </div>
                           <span className="est-time">{task.time}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentRoadmap;
import React, { useEffect, useState } from 'react';
import {
    FileText,
    Youtube,
    Download,
    ExternalLink,
    CheckCircle2,
    Circle,
    BookOpen,
    Clock,
    ChevronRight,
    Search,
    Book
} from 'lucide-react';

const StudentRoadmap = () => {
    // --- MOCK DATA FOR STUDENT ROADMAPS ---
    const ROADMAP_DATA = {
        'REACT-101': {
            title: "React Mastery Workshop",
            instructor: "Prof. Sarah Johnson",
            modules: [
                {
                    id: 1,
                    day: 1,
                    title: "React Fundamentals & JSX",
                    description: "Introduction to React, understanding JSX, and creating your first components. We'll cover why React is used and how to set up a basic project environment.",
                    status: "completed",
                    resources: [
                        { id: 101, name: "React_Official_Docs.pdf", type: "PDF Document", kind: "pdf", url: "https://react.dev/learn" },
                        { id: 102, name: "JSX Tutorial Video", type: "Video Link", kind: "video", url: "https://www.youtube.com/watch?v=7fPXI_MnBOY" }
                    ]
                },
                {
                    id: 2,
                    day: 2,
                    title: "Components & Props",
                    description: "Learn about React components, props, and component composition. Understanding how to pass data between components and build reusable UI elements.",
                    status: "current",
                    resources: [
                        { id: 103, name: "Components_Guide.pdf", type: "PDF Document", kind: "pdf", url: "https://react.dev/learn/your-first-component" },
                        { id: 104, name: "Props Deep Dive", type: "Web Resource", kind: "link", url: "https://react.dev/learn/passing-props-to-a-component" }
                    ]
                },
                {
                    id: 3,
                    day: 3,
                    title: "State & Lifecycle",
                    description: "Introduction to hooks, specifically useState, and understanding the lifecycle of a React component.",
                    status: "locked",
                    resources: [
                        { id: 105, name: "State_Management.pdf", type: "PDF Document", kind: "pdf", url: "https://react.dev/learn/state-a-components-memory" }
                    ]
                }
            ]
        },
        'JS-301': {
            title: "JavaScript Deep Dive",
            instructor: "Prof. Michael Chen",
            modules: [
                {
                    id: 4,
                    day: 1,
                    title: "JavaScript ES6+ Features",
                    description: "Modern JavaScript features including arrow functions, destructuring, and modules.",
                    status: "completed",
                    resources: [
                        { id: 106, name: "ES6_Features.pdf", type: "PDF Document", kind: "pdf", url: "https://javascript.info/es-mod" },
                        { id: 107, name: "Async JavaScript Video", type: "Video Link", kind: "video", url: "https://www.youtube.com/watch?v=vn3tkfPZf8w" }
                    ]
                }
            ]
        }
    };

    const [selectedSkill, setSelectedSkill] = useState('REACT-101');
    const [searchQuery, setSearchQuery] = useState('');
    const [completedModules, setCompletedModules] = useState([1]);
    const [skillsTab, setSkillsTab] = useState('active');
    const [currentSkillPage, setCurrentSkillPage] = useState(1);
    const skillsPerPage = 5;

    const skillData = ROADMAP_DATA[selectedSkill];
    const modules = skillData?.modules || [];

    const skillKeys = Object.keys(ROADMAP_DATA);
    const filteredSkillKeys = skillKeys.filter((key) => {
        const skillModules = ROADMAP_DATA[key].modules || [];
        const allCompleted = skillModules.every(
            (m) => m.status === 'completed' || completedModules.includes(m.id)
        );
        const hasActive = skillModules.some(
            (m) => !(m.status === 'completed' || completedModules.includes(m.id))
        );

        if (skillsTab === 'active') return hasActive;
        if (skillsTab === 'completed') return allCompleted;
        return true;
    });

    const totalSkillPages = Math.ceil(filteredSkillKeys.length / skillsPerPage) || 1;
    const skillStartIdx = (currentSkillPage - 1) * skillsPerPage;
    const skillEndIdx = skillStartIdx + skillsPerPage;
    const paginatedSkillKeys = filteredSkillKeys.slice(skillStartIdx, skillEndIdx);

    useEffect(() => {
        if (!filteredSkillKeys.length) return;
        if (!filteredSkillKeys.includes(selectedSkill)) {
            setSelectedSkill(filteredSkillKeys[0]);
        }
    }, [filteredSkillKeys, selectedSkill]);

    useEffect(() => {
        // Reset page if current page exceeds new total after filtering
        if (currentSkillPage > totalSkillPages) {
            setCurrentSkillPage(1);
        }
    }, [currentSkillPage, totalSkillPages]);

    const SkillsPagination = ({ currentPage, totalPages, onPageChange }) => {
        const getPageNumbers = () => {
            const pages = [];
            const maxVisible = 3;

            if (totalPages <= maxVisible) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else if (currentPage <= 2) {
                pages.push(1, 2, 3);
            } else if (currentPage >= totalPages - 1) {
                pages.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(currentPage - 1, currentPage, currentPage + 1);
            }
            return pages;
        };

        if (totalPages <= 1) return null;

        const start = (currentPage - 1) * skillsPerPage + 1;
        const end = Math.min(currentPage * skillsPerPage, filteredSkillKeys.length);

        return (
            <div className="pagination-wrapper">
                <span className="pagination-info">
                    Showing {start}-{end} items
                </span>
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        className="pagination-btn"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        );
    };

    const handleResourceAction = (res) => {
        if (!res.url) {
            alert("No link available.");
            return;
        }
        window.open(res.url, '_blank');
    };

    const toggleComplete = (id) => {
        setCompletedModules(prev =>
            prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
        );
    };

    const calculateProgress = () => {
        if (!modules.length) return 0;
        const completed = modules.filter(m => completedModules.includes(m.id)).length;
        return Math.round((completed / modules.length) * 100);
    };

    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                }
                
                .page-wrapper {
                    font-family: "Inter", sans-serif;
                    background-color: #F8F9FB;
                    min-height: 100vh;
                }
                
                .header {
                    background-color: #FFFFFF;
                    padding: 32px;
                    border-radius: 16px;
                    border: 1px solid #E5E7EB;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .header-info {
                    flex: 1;
                }
                
                .breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    color: #6B7280;
                    margin-bottom: 12px;
                }
                
                .page-title {
                    font-size: 28px;
                    font-weight: 800;
                    color: #111827;
                    margin: 0 0 16px 0;
                }
                
                .instructor-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                    color: #4B5563;
                    font-weight: 500;
                }
                
                .avatar {
                    width: 28px;
                    height: 28px;
                    background-color: #E5E7EB;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: 700;
                }
                
                .progress-section {
                    width: 240px;
                }
                
                .progress-text {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                
                .progress-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #4B5563;
                }
                
                .progress-percent {
                    font-size: 13px;
                    font-weight: 800;
                    color: #0066FF;
                }
                
                .progress-bar-bg {
                    height: 8px;
                    background-color: #E5E7EB;
                    border-radius: 10px;
                    overflow: hidden;
                }
                
                .progress-bar-fill {
                    height: 100%;
                    background-color: #0066FF;
                    border-radius: 10px;
                    transition: width 0.5s ease-out;
                }
                
                .main-content {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 24px;
                    max-width: 1300px;
                    margin: 0 auto;
                }
                
                .roadmap-col {
                    display: flex;
                    flex-direction: column;
                }
                
                .module-list {
                    display: flex;
                    flex-direction: column;
                }
                
                .timeline-connector {
                    width: 3px;
                    height: 30px;
                    background-color: #0066FF;
                    margin-left: 31px;
                    opacity: 0.2;
                    border-radius: 3px;
                }
                
                .module-card {
                    background-color: #FFFFFF;
                    border-radius: 16px;
                    border: 1px solid #E5E7EB;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
                }
                
                .locked-card {
                    opacity: 0.7;
                    pointer-events: none;
                }
                
                .card-header {
                    padding: 20px 24px;
                    background-color: #F9FAFB;
                    border-bottom: 1px solid #F3F4F6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .card-header-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                
                .module-number {
                    width: 45px;
                    height: 45px;
                    background-color: #FFFFFF;
                    border: 2px solid #0066FF;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #0066FF;
                    font-size: 14px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                
                .module-number.completed {
                    background-color: #0066FF;
                    border: none;
                    color: #FFFFFF;
                }
                
                .module-title-group {
                    display: flex;
                    flex-direction: column;
                }
                
                .module-title {
                    font-size: 17px;
                    font-weight: 700;
                    color: #111827;
                    margin: 0;
                }
                
                .module-meta {
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    color: #6B7280;
                    margin-top: 4px;
                }
                
                .status-badge {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #6B7280;
                    letter-spacing: 0.05em;
                }
                
                .card-body {
                    padding: 24px;
                }
                
                .description {
                    font-size: 15px;
                    color: #4B5563;
                    line-height: 1.6;
                    margin: 0 0 24px 0;
                }
                
                .resource-header {
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 700;
                    color: #374151;
                    margin-bottom: 16px;
                    border-bottom: 1px solid #F3F4F6;
                    padding-bottom: 8px;
                }
                
                .resource-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                
                .resource-item {
                    display: flex;
                    align-items: center;
                    padding: 14px;
                    background-color: #F9FAFB;
                    border-radius: 10px;
                    border: 1px solid #F3F4F6;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .resource-item:hover {
                    background-color: #F3F4F6;
                }
                
                .resource-icon {
                    margin-right: 12px;
                    flex-shrink: 0;
                }
                
                .resource-name {
                    flex: 1;
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .resource-action {
                    color: #9CA3AF;
                    flex-shrink: 0;
                }
                
                .sidebar-col {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                
                .search-box {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                
                .search-icon {
                    position: absolute;
                    left: 12px;
                    color: #9CA3AF;
                }
                
                .search-input {
                    width: 100%;
                    padding: 12px 12px 12px 40px;
                    border-radius: 12px;
                    border: 1px solid #E5E7EB;
                    font-size: 14px;
                    outline: none;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                
                .section-heading {
                    font-size: 12px;
                    font-weight: 700;
                    color: #6B7280;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .skill-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .pagination-wrapper {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 16px;
                    padding: 12px 0;
                }

                .pagination-info {
                    font-size: 13px;
                    color: #6B7280;
                }

                .pagination {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }

                .pagination-btn, .pagination-number {
                    width: 36px;
                    height: 36px;
                    border: 1px solid #E5E7EB;
                    background: #FFFFFF;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #6B7280;
                    font-size: 14px;
                    font-weight: 600;
                }

                .pagination-btn:hover:not(:disabled), .pagination-number:hover {
                    border-color: #0066FF;
                    color: #0066FF;
                }

                .pagination-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .pagination-number.active {
                    background: #0066FF;
                    color: #FFFFFF;
                    border-color: #0066FF;
                }

                .skills-toggle {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .skills-tab-btn {
                    flex: 1;
                    padding: 10px 12px;
                    border: none;
                    border-radius: 8px;
                    background: #F3F4F6;
                    color: #6B7280;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .skills-tab-btn.active {
                    background: #0066FF;
                    color: #FFFFFF;
                }
                
                .skill-item {
                    padding: 16px;
                    background-color: #FFFFFF;
                    border-radius: 14px;
                    border: 1px solid #E5E7EB;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .skill-item:hover {
                    border-color: #0066FF;
                }
                
                .skill-item.active {
                    border-color: #0066FF;
                    box-shadow: 0 4px 6px -1px rgba(0, 102, 255, 0.1);
                }
                
                .skill-icon-box {
                    width: 40px;
                    height: 40px;
                    background-color: #F0F7FF;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: 700;
                    color: #0066FF;
                    flex-shrink: 0;
                }
                
                .skill-info {
                    flex: 1;
                }
                
                .skill-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: #111827;
                }
                
                .skill-code {
                    font-size: 12px;
                    color: #6B7280;
                    margin-top: 2px;
                }
                
                /* Mobile Responsive Styles */
                @media (max-width: 768px) {
                    .page-wrapper {
                    }
                    
                    .header {
                        flex-direction: column;
                        padding: 20px 16px;
                        border-radius: 12px;
                        margin-bottom: 16px;
                        gap: 20px;
                    }
                    
                    .breadcrumb {
                        font-size: 12px;
                    }
                    
                    .page-title {
                        font-size: 20px;
                    }
                    
                    .instructor-info {
                        font-size: 13px;
                    }
                    
                    .progress-section {
                        width: 100%;
                    }
                    
                    .main-content {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    
                    .sidebar-col {
                        order: -1;
                    }
                    
                    .skill-list {
                        flex-direction: row;
                        overflow-x: auto;
                        padding-bottom: 4px;
                    }
                    
                    .skill-item {
                        min-width: 200px;
                        padding: 12px;
                    }
                    
                    .skill-name {
                        font-size: 13px;
                    }
                    
                    .skill-code {
                        font-size: 11px;
                    }
                    
                    .timeline-connector {
                        height: 20px;
                        margin-left: 26px;
                    }
                    
                    .module-card {
                        border-radius: 12px;
                    }
                    
                    .card-header {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 16px;
                        gap: 12px;
                    }
                    
                    .card-header-left {
                        gap: 12px;
                    }
                    
                    .module-number {
                        width: 38px;
                        height: 38px;
                        font-size: 12px;
                    }
                    
                    .module-title {
                        font-size: 15px;
                    }
                    
                    .module-meta {
                        font-size: 11px;
                    }
                    
                    .status-badge {
                        font-size: 10px;
                        margin-left: 50px;
                    }
                    
                    .card-body {
                        padding: 16px;
                    }
                    
                    .description {
                        font-size: 14px;
                    }
                    
                    .resource-header {
                        font-size: 13px;
                    }
                    
                    .resource-grid {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }
                    
                    .resource-item {
                        padding: 12px;
                    }
                    
                    .resource-name {
                        font-size: 12px;
                    }
                    
                    .search-input {
                        padding: 10px 10px 10px 38px;
                        border-radius: 10px;
                        font-size: 13px;
                    }
                    
                    .section-heading {
                        font-size: 11px;
                    }
                }
            `}</style>
            
            <div className="page-wrapper">
                <header className="header">
                    <div className="header-info">
                        <div className="breadcrumb">
                            <Book size={16} /> Roadmap & Material / {selectedSkill}
                        </div>
                        <h1 className="page-title">{skillData?.title}</h1>
                        <div className="instructor-info">
                            <div className="avatar">IN</div>
                            <span>{skillData?.instructor}</span>
                        </div>
                    </div>
                    <div className="progress-section">
                        <div className="progress-text">
                            <span className="progress-label">Track Progress</span>
                            <span className="progress-percent">{calculateProgress()}%</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${calculateProgress()}%` }} />
                        </div>
                    </div>
                </header>

                <div className="main-content">
                    <div className="roadmap-col">
                        <div className="module-list">
                            {modules.map((module, index) => {
                                const isCompleted = completedModules.includes(module.id);
                                const isLocked = module.status === 'locked' && !isCompleted;

                                return (
                                    <div key={module.id}>
                                        {index !== 0 && <div className="timeline-connector" />}
                                        <div className={`module-card ${isLocked ? 'locked-card' : ''}`}>
                                            <div className="card-header">
                                                <div className="card-header-left">
                                                    <div
                                                        className={`module-number ${isCompleted ? 'completed' : ''}`}
                                                        onClick={() => toggleComplete(module.id)}
                                                    >
                                                        {isCompleted ? <CheckCircle2 size={24} /> : `D${module.day}`}
                                                    </div>
                                                    <div className="module-title-group">
                                                        <h3 className="module-title">{module.title}</h3>
                                                        <div className="module-meta">
                                                            <Clock size={12} style={{ marginRight: 4 }} /> Estimated 2-3 hours
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="status-badge">
                                                    {isCompleted ? 'Completed' : module.status === 'current' ? 'In Progress' : 'Pending'}
                                                </div>
                                            </div>

                                            <div className="card-body">
                                                <p className="description">{module.description}</p>

                                                <div className="resource-header">
                                                    <BookOpen size={16} style={{ marginRight: 8 }} />
                                                    Learning Resources
                                                </div>

                                                <div className="resource-grid">
                                                    {module.resources.map(res => (
                                                        <div
                                                            key={res.id}
                                                            className="resource-item"
                                                            onClick={() => handleResourceAction(res)}
                                                        >
                                                            <div className="resource-icon">
                                                                {res.kind === 'pdf' ? <FileText size={18} color="#ef4444" /> :
                                                                    res.kind === 'video' ? <Youtube size={18} color="#FF0000" /> :
                                                                        <ExternalLink size={18} color="#3B82F6" />}
                                                            </div>
                                                            <div className="resource-name">{res.name}</div>
                                                            <div className="resource-action">
                                                                {res.kind === 'pdf' ? <Download size={14} /> : <ChevronRight size={14} />}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="sidebar-col">
                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input
                                className="search-input"
                                placeholder="Search subjects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="skills-toggle">
                            <button
                                className={`skills-tab-btn ${skillsTab === 'active' ? 'active' : ''}`}
                                onClick={() => setSkillsTab('active')}
                            >
                                Active
                            </button>
                            <button
                                className={`skills-tab-btn ${skillsTab === 'completed' ? 'active' : ''}`}
                                onClick={() => setSkillsTab('completed')}
                            >
                                Completed
                            </button>
                        </div>
                        <div className="section-heading">Courses</div>
                        <div className="skill-list">
                            {paginatedSkillKeys.map(key => (
                                <div
                                    key={key}
                                    className={`skill-item ${selectedSkill === key ? 'active' : ''}`}
                                    onClick={() => setSelectedSkill(key)}
                                >
                                    <div className="skill-icon-box">
                                        {key.charAt(0)}
                                    </div>
                                    <div className="skill-info">
                                        <div className="skill-name">{ROADMAP_DATA[key].title}</div>
                                        <div className="skill-code">{key}</div>
                                    </div>
                                    {selectedSkill === key && <ChevronRight size={16} color="#0066FF" />}
                                </div>
                            ))}
                        </div>

                        <SkillsPagination
                            currentPage={currentSkillPage}
                            totalPages={totalSkillPages}
                            onPageChange={setCurrentSkillPage}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentRoadmap;
import React, { useState, useEffect } from 'react';
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
    const [completedModules, setCompletedModules] = useState([1]); // Mock some completed module IDs

    const skillData = ROADMAP_DATA[selectedSkill];
    const modules = skillData?.modules || [];

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
        <div style={styles.pageWrapper}>
            {/* Header with Stats */}
            <header style={styles.header}>
                <div style={styles.headerInfo}>
                    <div style={styles.breadcrumb}>
                        <Book size={16} /> Roadmap & Material / {selectedSkill}
                    </div>
                    <h1 style={styles.pageTitle}>{skillData?.title}</h1>
                    <div style={styles.instructorInfo}>
                        <div style={styles.avatar}>IN</div>
                        <span>{skillData?.instructor}</span>
                    </div>
                </div>
                <div style={styles.progressSection}>
                    <div style={styles.progressText}>
                        <span style={styles.progressLabel}>Track Progress</span>
                        <span style={styles.progressPercent}>{calculateProgress()}%</span>
                    </div>
                    <div style={styles.progressBarBg}>
                        <div style={{ ...styles.progressBarFill, width: `${calculateProgress()}%` }} />
                    </div>
                </div>
            </header>

            <div style={styles.mainContent}>
                {/* Left Side: Roadmap Steps */}
                <div style={styles.roadmapCol}>
                    <div style={styles.moduleList}>
                        {modules.map((module, index) => {
                            const isCompleted = completedModules.includes(module.id);
                            const isLocked = module.status === 'locked' && !isCompleted;

                            return (
                                <div key={module.id}>
                                    {index !== 0 && <div style={styles.timelineConnector} />}
                                    <div style={{
                                        ...styles.moduleCard,
                                        ...(isLocked ? styles.lockedCard : {})
                                    }}>
                                        <div style={styles.cardHeader}>
                                            <div style={styles.cardHeaderLeft}>
                                                <div
                                                    style={{
                                                        ...styles.moduleNumber,
                                                        ...(isCompleted ? styles.completedNumber : {})
                                                    }}
                                                    onClick={() => toggleComplete(module.id)}
                                                >
                                                    {isCompleted ? <CheckCircle2 size={24} /> : `D${module.day}`}
                                                </div>
                                                <div style={styles.moduleTitleGroup}>
                                                    <h3 style={styles.moduleTitle}>{module.title}</h3>
                                                    <div style={styles.moduleMeta}>
                                                        <Clock size={12} style={{ marginRight: 4 }} /> Estimated 2-3 hours
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={styles.statusBadge}>
                                                {isCompleted ? 'Completed' : module.status === 'current' ? 'In Progress' : 'Pending'}
                                            </div>
                                        </div>

                                        <div style={styles.cardBody}>
                                            <p style={styles.description}>{module.description}</p>

                                            <div style={styles.resourceHeader}>
                                                <BookOpen size={16} style={{ marginRight: 8 }} />
                                                Learning Resources
                                            </div>

                                            <div style={styles.resourceGrid}>
                                                {module.resources.map(res => (
                                                    <div
                                                        key={res.id}
                                                        style={styles.resourceItem}
                                                        onClick={() => handleResourceAction(res)}
                                                    >
                                                        <div style={styles.resourceIcon}>
                                                            {res.kind === 'pdf' ? <FileText size={18} color="#ef4444" /> :
                                                                res.kind === 'video' ? <Youtube size={18} color="#FF0000" /> :
                                                                    <ExternalLink size={18} color="#3B82F6" />}
                                                        </div>
                                                        <div style={styles.resourceName}>{res.name}</div>
                                                        <div style={styles.resourceAction}>
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

                {/* Right Side: Sidebar/Selection */}
                <div style={styles.sidebarCol}>
                    <div style={styles.searchBox}>
                        <Search size={18} style={styles.searchIcon} />
                        <input
                            style={styles.searchInput}
                            placeholder="Search subjects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div style={styles.sectionHeading}>Active Courses</div>
                    <div style={styles.skillList}>
                        {Object.keys(ROADMAP_DATA).map(key => (
                            <div
                                key={key}
                                style={{
                                    ...styles.skillItem,
                                    ...(selectedSkill === key ? styles.skillItemActive : {})
                                }}
                                onClick={() => setSelectedSkill(key)}
                            >
                                <div style={styles.skillIconBox}>
                                    {key.charAt(0)}
                                </div>
                                <div style={styles.skillInfo}>
                                    <div style={styles.skillName}>{ROADMAP_DATA[key].title}</div>
                                    <div style={styles.skillCode}>{key}</div>
                                </div>
                                {selectedSkill === key && <ChevronRight size={16} color="#0066FF" />}
                            </div>
                        ))}
                    </div>

                    <div style={styles.helpCard}>
                        <h4 style={styles.helpTitle}>Need Assistance?</h4>
                        <p style={styles.helpText}>If you're stuck on a module or can't access a resource, contact your instructor.</p>
                        <button style={styles.helpBtn}>Contact Prof</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        fontFamily: '"Inter", sans-serif',
        backgroundColor: '#F8F9FB',
        minHeight: '100vh',
        padding: '24px'
    },
    header: {
        backgroundColor: '#FFFFFF',
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    headerInfo: {
        flex: 1
    },
    breadcrumb: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: '#6B7280',
        marginBottom: '12px'
    },
    pageTitle: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#111827',
        margin: '0 0 16px 0'
    },
    instructorInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        color: '#4B5563',
        fontWeight: '500'
    },
    avatar: {
        width: '28px',
        height: '28px',
        backgroundColor: '#E5E7EB',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: '700'
    },
    progressSection: {
        width: '240px'
    },
    progressText: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
    },
    progressLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#4B5563'
    },
    progressPercent: {
        fontSize: '13px',
        fontWeight: '800',
        color: '#0066FF'
    },
    progressBarBg: {
        height: '8px',
        backgroundColor: '#E5E7EB',
        borderRadius: '10px',
        overflow: 'hidden'
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#0066FF',
        borderRadius: '10px',
        transition: 'width 0.5s ease-out'
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '24px',
        maxWidth: '1300px',
        margin: '0 auto'
    },
    roadmapCol: {
        display: 'flex',
        flexDirection: 'column'
    },
    moduleList: {
        display: 'flex',
        flexDirection: 'column'
    },
    timelineConnector: {
        width: '3px',
        height: '30px',
        backgroundColor: '#0066FF',
        marginLeft: '31px',
        opacity: 0.2,
        borderRadius: '3px'
    },
    moduleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
    },
    lockedCard: {
        opacity: 0.7,
        pointerEvents: 'none'
    },
    cardHeader: {
        padding: '20px 24px',
        backgroundColor: '#F9FAFB',
        borderBottom: '1px solid #F3F4F6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardHeaderLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    moduleNumber: {
        width: '45px',
        height: '45px',
        backgroundColor: '#FFFFFF',
        border: '2px solid #0066FF',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0066FF',
        fontSize: '14px',
        fontWeight: '800',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    completedNumber: {
        backgroundColor: '#0066FF',
        border: 'none',
        color: '#FFFFFF'
    },
    moduleTitleGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    moduleTitle: {
        fontSize: '17px',
        fontWeight: '700',
        color: '#111827',
        margin: 0
    },
    moduleMeta: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px',
        color: '#6B7280',
        marginTop: '4px'
    },
    statusBadge: {
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        color: '#6B7280',
        letterSpacing: '0.05em'
    },
    cardBody: {
        padding: '24px'
    },
    description: {
        fontSize: '15px',
        color: '#4B5563',
        lineHeight: '1.6',
        margin: '0 0 24px 0'
    },
    resourceHeader: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: '700',
        color: '#374151',
        marginBottom: '16px',
        borderBottom: '1px solid #F3F4F6',
        paddingBottom: '8px'
    },
    resourceGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
    },
    resourceItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '14px',
        backgroundColor: '#F9FAFB',
        borderRadius: '10px',
        border: '1px solid #F3F4F6',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    resourceIcon: {
        marginRight: '12px'
    },
    resourceName: {
        flex: 1,
        fontSize: '13px',
        fontWeight: '600',
        color: '#374151',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    resourceAction: {
        color: '#9CA3AF'
    },
    sidebarCol: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    searchBox: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    searchIcon: {
        position: 'absolute',
        left: '12px',
        color: '#9CA3AF'
    },
    searchInput: {
        width: '100%',
        padding: '12px 12px 12px 40px',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        fontSize: '14px',
        outline: 'none',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    sectionHeading: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    skillList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    skillItem: {
        padding: '16px',
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    skillItemActive: {
        borderColor: '#0066FF',
        boxShadow: '0 4px 6px -1px rgba(0, 102, 255, 0.1)'
    },
    skillIconBox: {
        width: '40px',
        height: '40px',
        backgroundColor: '#F0F7FF',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: '700',
        color: '#0066FF'
    },
    skillName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#111827'
    },
    skillCode: {
        fontSize: '12px',
        color: '#6B7280',
        marginTop: '2px'
    },
    helpCard: {
        backgroundColor: '#0066FF',
        padding: '24px',
        borderRadius: '16px',
        color: '#FFFFFF'
    },
    helpTitle: {
        fontSize: '16px',
        fontWeight: '700',
        margin: '0 0 10px 0'
    },
    helpText: {
        fontSize: '13px',
        opacity: 0.9,
        lineHeight: '1.5',
        margin: '0 0 20px 0'
    },
    helpBtn: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#FFFFFF',
        color: '#0066FF',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer'
    }
};

export default StudentRoadmap;

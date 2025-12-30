import React, { useState } from 'react';
import {
    ClipboardCheck,
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    CloudUpload,
    FileText,
    X,
    BookOpen,
    ExternalLink
} from 'lucide-react';

const TasksAssignments = () => {
    // --- MOCK DATA FOR STUDENT TASKS ---
    const INITIAL_TASKS = [
        {
            id: 1,
            title: 'React Hooks Implementation',
            subject: 'React Mastery Workshop',
            day: 1,
            dueDate: '2024-10-30',
            status: 'pending',
            score: 50,
            description: 'Implement useState and useEffect hooks in a simple counter application.'
        },
        {
            id: 2,
            title: 'Component Lifecycle Quiz',
            subject: 'React Mastery Workshop',
            day: 3,
            dueDate: '2024-11-05',
            status: 'completed',
            score: 100,
            submittedDate: '2024-11-04',
            grade: '95/100'
        },
        {
            id: 3,
            title: 'CSS Grid Layout Project',
            subject: 'HTML & CSS Fundamentals',
            day: 1,
            dueDate: '2024-11-01',
            status: 'overdue',
            score: 75,
            description: 'Create a responsive dashboard layout using CSS Grid.'
        }
    ];

    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [submissionType, setSubmissionType] = useState('file'); // 'file' or 'link'
    const [uploadFile, setUploadFile] = useState(null);
    const [externalLink, setExternalLink] = useState('');

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = activeFilter === 'all' || task.status === activeFilter;
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return { bg: '#F0FDF4', color: '#16A34A', icon: <CheckCircle2 size={14} /> };
            case 'overdue': return { bg: '#FEF2F2', color: '#EF4444', icon: <AlertCircle size={14} /> };
            default: return { bg: '#EFF6FF', color: '#2563EB', icon: <Clock size={14} /> };
        }
    };

    const handleFileUpload = (e) => {
        if (e.target.files[0]) {
            setUploadFile(e.target.files[0]);
        }
    };

    const submitAssignment = () => {
        if (submissionType === 'file' && !uploadFile) {
            alert("Please upload a file before submitting.");
            return;
        }
        if (submissionType === 'link' && !externalLink) {
            alert("Please provide a link before submitting.");
            return;
        }

        // Mock submit logic
        setTasks(prev => prev.map(t =>
            t.id === selectedTask.id ? {
                ...t,
                status: 'completed',
                submittedDate: new Date().toISOString().split('T')[0],
                submission: submissionType === 'file' ? { type: 'file', name: uploadFile.name } : { type: 'link', url: externalLink }
            } : t
        ));

        closeModal();
        alert("Assignment submitted successfully!");
    };

    const closeModal = () => {
        setSelectedTask(null);
        setUploadFile(null);
        setExternalLink('');
        setSubmissionType('file');
    };

    return (
        <div style={styles.pageWrapper}>
            {/* Header Section */}
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.iconContainer}>
                        <ClipboardCheck size={24} color="#2563EB" />
                    </div>
                    <div>
                        <h1 style={styles.pageTitle}>Tasks & Assignments</h1>
                        <p style={styles.subtext}>Manage your coursework and track submissions</p>
                    </div>
                </div>

                <div style={styles.filterGroup}>
                    <button
                        style={{ ...styles.filterBtn, ...(activeFilter === 'all' ? styles.filterBtnActive : {}) }}
                        onClick={() => setActiveFilter('all')}
                    >All Tasks</button>
                    <button
                        style={{ ...styles.filterBtn, ...(activeFilter === 'pending' ? styles.filterBtnActive : {}) }}
                        onClick={() => setActiveFilter('pending')}
                    >Pending</button>
                    <button
                        style={{ ...styles.filterBtn, ...(activeFilter === 'completed' ? styles.filterBtnActive : {}) }}
                        onClick={() => setActiveFilter('completed')}
                    >Completed</button>
                </div>
            </header>

            {/* Main Layout */}
            <div style={styles.mainLayout}>
                <div style={styles.contentCol}>
                    {/* Search Bar */}
                    <div style={styles.searchBar}>
                        <Search size={18} style={styles.searchIcon} />
                        <input
                            style={styles.searchInput}
                            placeholder="Search by task title or subject..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Task List */}
                    <div style={styles.taskList}>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map(task => {
                                const status = getStatusStyle(task.status);
                                return (
                                    <div key={task.id} style={styles.taskCard}>
                                        <div style={styles.taskHeader}>
                                            <div style={styles.subjectTag}>{task.subject}</div>
                                            <div style={{ ...styles.statusBadge, backgroundColor: status.bg, color: status.color }}>
                                                {status.icon}
                                                <span style={{ marginLeft: 6 }}>{task.status.toUpperCase()}</span>
                                            </div>
                                        </div>

                                        <h3 style={styles.taskTitle}>{task.title}</h3>
                                        <div style={styles.taskInfoRow}>
                                            <div style={styles.infoItem}>
                                                <Clock size={14} style={{ marginRight: 6 }} />
                                                Due: {task.dueDate}
                                            </div>
                                            <div style={styles.infoItem}>
                                                <BookOpen size={14} style={{ marginRight: 6 }} />
                                                Day {task.day}
                                            </div>
                                            <div style={styles.infoItem}>
                                                Max Score: {task.score}
                                            </div>
                                        </div>

                                        <div style={styles.cardFooter}>
                                            {task.status === 'completed' ? (
                                                <div style={styles.gradeInfo}>
                                                    Submitted on {task.submittedDate} • <strong>Grade: {task.grade || 'Pending'}</strong>
                                                </div>
                                            ) : (
                                                <button
                                                    style={styles.actionBtn}
                                                    onClick={() => setSelectedTask(task)}
                                                >
                                                    View Details & Submit <ChevronRight size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={styles.emptyState}>
                                <AlertCircle size={48} color="#94A3B8" />
                                <p>No tasks found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Sidebar - REMOVED AS REQUESTED */}
            </div>

            {/* Submission Modal */}
            {selectedTask && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Submit Assignment</h2>
                            <button
                                style={styles.closeBtn}
                                onClick={closeModal}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={styles.modalBody}>
                            <div style={styles.modalTaskInfo}>
                                <h4 style={styles.modalTaskName}>{selectedTask.title}</h4>
                                <p style={styles.modalTaskDesc}>{selectedTask.description || 'No additional instructions provided.'}</p>
                            </div>

                            {/* Submission Type Toggle */}
                            <div style={styles.typeToggle}>
                                <button
                                    style={{ ...styles.toggleBtn, ...(submissionType === 'file' ? styles.toggleBtnActive : {}) }}
                                    onClick={() => setSubmissionType('file')}
                                >
                                    File Upload
                                </button>
                                <button
                                    style={{ ...styles.toggleBtn, ...(submissionType === 'link' ? styles.toggleBtnActive : {}) }}
                                    onClick={() => setSubmissionType('link')}
                                >
                                    Link Submission
                                </button>
                            </div>

                            {submissionType === 'file' ? (
                                <div style={styles.uploadSection}>
                                    <input
                                        type="file"
                                        id="task-upload"
                                        hidden
                                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                        onChange={handleFileUpload}
                                    />
                                    <label htmlFor="task-upload" style={styles.uploadBox}>
                                        {uploadFile ? (
                                            <div style={styles.fileSelected}>
                                                <FileText size={32} color="#2563EB" />
                                                <span style={styles.fileName}>{uploadFile.name}</span>
                                                <span style={styles.fileSize}>{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        ) : (
                                            <>
                                                <CloudUpload size={32} color="#94A3B8" />
                                                <div style={styles.uploadPrompt}>Click to upload or drag and drop</div>
                                                <div style={styles.uploadSub}>PDF, Word Docs or Images (Max 10MB)</div>
                                            </>
                                        )}
                                    </label>
                                </div>
                            ) : (
                                <div style={styles.linkSection}>
                                    <label style={styles.inputLabel}>External URL (GitHub, Drive, etc)</label>
                                    <div style={styles.linkInputWrapper}>
                                        <ExternalLink size={18} style={styles.linkIcon} />
                                        <input
                                            style={styles.linkInput}
                                            placeholder="Place your link."
                                            value={externalLink}
                                            onChange={(e) => setExternalLink(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                style={{ ...styles.submitBtn, opacity: (uploadFile || externalLink) ? 1 : 0.6 }}
                                onClick={submitAssignment}
                            >
                                Submit Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    pageWrapper: {
        fontFamily: '"Inter", sans-serif',
        backgroundColor: '#F8F9FB',
        minHeight: '100vh',
        '@media (max-width: 768px)': {
            padding: '16px'
        }
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px',
        '@media (max-width: 768px)': {
            flexDirection: 'column',
            alignItems: 'stretch',
            marginBottom: '24px'
        }
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        '@media (max-width: 768px)': {
            gap: '12px'
        }
    },
    iconContainer: {
        width: '48px',
        height: '48px',
        backgroundColor: '#EFF6FF',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '@media (max-width: 768px)': {
            width: '40px',
            height: '40px',
            minWidth: '40px'
        }
    },
    pageTitle: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#1E293B',
        margin: 0,
        '@media (max-width: 768px)': {
            fontSize: '20px'
        }
    },
    subtext: {
        fontSize: '14px',
        color: '#64748B',
        margin: '4px 0 0 0',
        '@media (max-width: 768px)': {
            fontSize: '13px'
        }
    },
    filterGroup: {
        display: 'flex',
        backgroundColor: '#FFFFFF',
        padding: '4px',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        '@media (max-width: 768px)': {
            width: '100%',
            justifyContent: 'center',
            marginTop: '8px'
        }
    },
    filterBtn: {
        padding: '8px 16px',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '13px',
        fontWeight: '600',
        color: '#64748B',
        cursor: 'pointer',
        borderRadius: '8px',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        '@media (max-width: 768px)': {
            padding: '8px 12px',
            fontSize: '12px',
            flex: 1
        }
    },
    filterBtnActive: {
        backgroundColor: '#2563EB',
        color: '#FFFFFF'
    },
    mainLayout: {
        display: 'block',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    contentCol: {
        width: '100%'
    },
    searchBar: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px'
    },
    searchIcon: {
        position: 'absolute',
        left: '12px',
        color: '#94A3B8'
    },
    searchInput: {
        width: '100%',
        padding: '12px 12px 12px 40px',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#FFFFFF',
        '@media (max-width: 768px)': {
            fontSize: '16px', // Prevents zoom on iOS
            padding: '14px 14px 14px 40px'
        }
    },
    taskList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    taskCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        padding: '20px',
        border: '1px solid #E2E8F0',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '@media (max-width: 768px)': {
            padding: '16px',
            borderRadius: '12px'
        }
    },
    taskHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px'
    },
    subjectTag: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#2563EB',
        backgroundColor: '#EFF6FF',
        padding: '4px 10px',
        borderRadius: '6px',
        whiteSpace: 'nowrap',
        '@media (max-width: 768px)': {
            fontSize: '11px'
        }
    },
    statusBadge: {
        display: 'flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '700',
        whiteSpace: 'nowrap',
        '@media (max-width: 768px)': {
            fontSize: '10px',
            padding: '4px 8px'
        }
    },
    taskTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1E293B',
        margin: '0 0 12px 0',
        '@media (max-width: 768px)': {
            fontSize: '16px',
            lineHeight: '1.4'
        }
    },
    taskInfoRow: {
        display: 'flex',
        gap: '20px',
        fontSize: '13px',
        color: '#64748B',
        marginBottom: '20px',
        flexWrap: 'wrap',
        rowGap: '12px',
        '@media (max-width: 768px)': {
            gap: '16px',
            fontSize: '12px'
        }
    },
    infoItem: {
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        '@media (max-width: 768px)': {
            flex: '1 0 calc(50% - 8px)',
            minWidth: '140px'
        }
    },
    cardFooter: {
        borderTop: '1px solid #F1F5F9',
        paddingTop: '16px',
        display: 'flex',
        justifyContent: 'flex-end',
        '@media (max-width: 768px)': {
            paddingTop: '12px'
        }
    },
    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#2563EB',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        '@media (max-width: 768px)': {
            fontSize: '13px'
        }
    },
    gradeInfo: {
        fontSize: '13px',
        color: '#16A34A',
        fontWeight: '500',
        textAlign: 'right',
        '@media (max-width: 768px)': {
            fontSize: '12px',
            lineHeight: '1.4'
        }
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 40px',
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px dashed #CBD5E1',
        color: '#64748B',
        '@media (max-width: 768px)': {
            padding: '40px 20px'
        }
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        '@media (max-width: 768px)': {
            padding: '12px',
            alignItems: 'flex-end'
        }
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        overflow: 'hidden',
        maxHeight: '90vh',
        overflowY: 'auto',
        '@media (max-width: 768px)': {
            borderRadius: '16px 16px 0 0',
            maxHeight: '85vh',
            maxWidth: '100%'
        }
    },
    modalHeader: {
        padding: '20px 24px',
        borderBottom: '1px solid #F1F5F9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '@media (max-width: 768px)': {
            padding: '16px 20px',
            position: 'sticky',
            top: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 1
        }
    },
    modalTitle: {
        fontSize: '18px',
        fontWeight: '700',
        margin: 0,
        '@media (max-width: 768px)': {
            fontSize: '16px'
        }
    },
    closeBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#64748B',
        cursor: 'pointer',
        padding: '4px'
    },
    modalBody: {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        '@media (max-width: 768px)': {
            padding: '20px',
            gap: '16px'
        }
    },
    modalTaskInfo: {
        '@media (max-width: 768px)': {
            marginBottom: '8px'
        }
    },
    modalTaskName: {
        fontSize: '16px',
        fontWeight: '700',
        margin: '0 0 8px 0',
        '@media (max-width: 768px)': {
            fontSize: '15px'
        }
    },
    modalTaskDesc: {
        fontSize: '14px',
        color: '#64748B',
        lineHeight: '1.5',
        margin: 0,
        '@media (max-width: 768px)': {
            fontSize: '13px'
        }
    },
    uploadSection: {
        width: '100%'
    },
    uploadBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        border: '2px dashed #E2E8F0',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
        '@media (max-width: 768px)': {
            padding: '24px 16px'
        }
    },
    uploadPrompt: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1E293B',
        marginTop: '12px',
        textAlign: 'center',
        '@media (max-width: 768px)': {
            fontSize: '13px'
        }
    },
    uploadSub: {
        fontSize: '12px',
        color: '#94A3B8',
        marginTop: '4px',
        textAlign: 'center',
        '@media (max-width: 768px)': {
            fontSize: '11px'
        }
    },
    fileSelected: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        width: '100%'
    },
    fileName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1E293B',
        textAlign: 'center',
        wordBreak: 'break-word',
        width: '100%',
        '@media (max-width: 768px)': {
            fontSize: '13px'
        }
    },
    fileSize: {
        fontSize: '12px',
        color: '#94A3B8',
        '@media (max-width: 768px)': {
            fontSize: '11px'
        }
    },
    submitBtn: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#2563EB',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '10px',
        fontWeight: '700',
        fontSize: '15px',
        cursor: 'pointer',
        '@media (max-width: 768px)': {
            padding: '16px',
            fontSize: '16px',
            marginTop: '8px'
        }
    },
    typeToggle: {
        display: 'flex',
        gap: '10px',
        backgroundColor: '#F1F5F9',
        padding: '4px',
        borderRadius: '10px',
        '@media (max-width: 768px)': {
            gap: '8px'
        }
    },
    toggleBtn: {
        flex: 1,
        padding: '10px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#64748B',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        '@media (max-width: 768px)': {
            padding: '12px 8px',
            fontSize: '14px'
        }
    },
    toggleBtnActive: {
        backgroundColor: '#FFFFFF',
        color: '#2563EB',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    linkSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    inputLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#334155',
        '@media (max-width: 768px)': {
            fontSize: '14px'
        }
    },
    linkInputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    linkIcon: {
        position: 'absolute',
        left: '12px',
        color: '#94A3B8'
    },
    linkInput: {
        width: '100%',
        padding: '12px 12px 12px 40px',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        fontSize: '14px',
        outline: 'none',
        '@media (max-width: 768px)': {
            fontSize: '16px',
            padding: '14px 14px 14px 40px'
        }
    }
};

// Convert media queries to inline styles for React
const responsiveStyles = {};
Object.keys(styles).forEach(key => {
    if (typeof styles[key] === 'object' && styles[key]['@media (max-width: 768px)']) {
        const mobileStyles = styles[key]['@media (max-width: 768px)'];
        responsiveStyles[key] = {
            ...styles[key],
            '@media (max-width: 768px)': undefined
        };
        // We'll apply mobile styles through CSS classes instead
    } else {
        responsiveStyles[key] = styles[key];
    }
});

export default TasksAssignments;
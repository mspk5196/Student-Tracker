import React, { useState, useMemo, useEffect } from 'react';
import {
    PlusCircle,
    Search,
    Filter,
    RotateCw,
    MoreHorizontal,
    CloudUpload,
    Send,
    Calendar,
    ChevronDown,
    Link as LinkIcon
} from 'lucide-react';

const AssignmentDashboard = ({ selectedSkill }) => {
    // --- MASTER DATA WITH MULTIPLE SKILLS ---
    const SKILLS_DATA = {
        'REACT-101': [
            { id: 1, title: 'React Hooks Implementation', score: 50, group: 'REACT-101', day: 1, dueDate: '2024-10-30', status: 'Active' },
            { id: 2, title: 'Component Lifecycle Quiz', score: 100, group: 'REACT-101', day: 3, dueDate: '2024-11-05', status: 'Active' },
            { id: 3, title: 'State Management Exercise', score: 20, group: 'REACT-101', day: 5, dueDate: '2024-10-12', status: 'Inactive' },
        ],
        'WEB-201': [
            { id: 4, title: 'CSS Grid Layout Project', score: 75, group: 'WEB-201', day: 1, dueDate: '2024-11-01', status: 'Active' },
            { id: 5, title: 'HTML Semantic Tags Exercise', score: 50, group: 'WEB-201', day: 2, dueDate: '2024-10-25', status: 'Active' },
        ],
        'JS-301': [
            { id: 6, title: 'Async/Await Implementation', score: 100, group: 'JS-301', day: 1, dueDate: '2024-11-10', status: 'Active' },
            { id: 7, title: 'Closures and Scope Quiz', score: 30, group: 'JS-301', day: 3, dueDate: '2024-10-28', status: 'Inactive' },
        ],
        'NODE-401': [
            { id: 8, title: 'Express.js REST API', score: 100, group: 'NODE-401', day: 1, dueDate: '2024-11-15', status: 'Active' },
        ],
        'DESIGN-501': [
            { id: 9, title: 'Figma Prototype Project', score: 80, group: 'DESIGN-501', day: 1, dueDate: '2024-10-30', status: 'Active' },
            { id: 10, title: 'Color Theory Quiz', score: 40, group: 'DESIGN-501', day: 2, dueDate: '2024-10-20', status: 'Active' },
        ]
    };

    const CLASSES_DATA = {
        'REACT-101': ['REACT-101: React Mastery Workshop', 'REACT-102: Advanced React Patterns', 'REACT-103: React Native'],
        'WEB-201': ['WEB-201: HTML & CSS Fundamentals', 'WEB-202: Responsive Design', 'WEB-203: CSS Frameworks'],
        'JS-301': ['JS-301: JavaScript Deep Dive', 'JS-302: Modern JavaScript', 'JS-303: Design Patterns'],
        'NODE-401': ['NODE-401: Node.js Backend', 'NODE-402: Express Framework', 'NODE-403: Database Integration'],
        'DESIGN-501': ['DESIGN-501: UI/UX Principles', 'DESIGN-502: Wireframing', 'DESIGN-503: Prototyping']
    };

    const [assignments, setAssignments] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Active');

    /* -------- FORM STATE -------- */
    const [title, setTitle] = useState('');
    const [group, setGroup] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [score, setScore] = useState(100);
    const [day, setDay] = useState(1);
    const [description, setDescription] = useState('');
    const [materialType, setMaterialType] = useState('link');
    const [externalUrl, setExternalUrl] = useState('');
    const [files, setFiles] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);

    // Get current skill's classes
    const CLASSES = CLASSES_DATA[selectedSkill] || [];

    // Initialize assignments for the selected skill
    useEffect(() => {
        if (selectedSkill && SKILLS_DATA[selectedSkill]) {
            setAssignments(SKILLS_DATA[selectedSkill]);
        } else if (selectedSkill) {
            setAssignments([]);
        }
    }, [selectedSkill]);

    /* -------- FILTER LOGIC -------- */
    const filteredAssignments = useMemo(() => {
        return assignments.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
            const matchesFilter = statusFilter === 'All' || item.status === statusFilter;
            return matchesSearch && matchesFilter;
        });
    }, [assignments, search, statusFilter]);

    /* -------- FORM ACTIONS -------- */
    const resetForm = () => {
        setTitle('');
        setGroup('');
        setDueDate('');
        setScore(100);
        setDay(1);
        setDescription('');
        setMaterialType('link');
        setExternalUrl('');
        setFiles([]);
    };

    const publishAssignment = () => {
        if (!title || !group || !score) {
            alert('Please fill required fields');
            return;
        }

        const newAssignment = {
            id: Date.now(),
            title,
            group,
            day: parseInt(day),
            score,
            dueDate,
            status: 'Active',
            materialType: materialType,
            resources: materialType === 'file' ? files : [],
            url: materialType === 'link' ? externalUrl : ''
        };

        setAssignments(prev => [newAssignment, ...prev]);
        resetForm();
        alert('Assignment Published!');
    };

    /* -------- STATUS ACTION -------- */
    const toggleTaskStatus = (id, currentStatus) => {
        setAssignments(prev =>
            prev.map(a => a.id === id ? { ...a, status: currentStatus === 'Active' ? 'Inactive' : 'Active' } : a)
        );
        setOpenMenuId(null);
    };

    return (
        <div style={styles.container}>
            <div style={styles.layoutGrid}>
                {/* LEFT PANEL */}
                <div style={styles.formCard}>
                    <div style={styles.formHeader}>
                        <PlusCircle size={18} style={styles.headerIcon} />
                        <h3 style={styles.title}>Create New Assignment</h3>
                    </div>

                    <div style={styles.formBody}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.fieldLabel}>Assignment Title *</label>
                            <input
                                style={styles.textInput}
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder={`Add assignment for ${selectedSkill}`}
                            />
                        </div>

                        <div style={styles.splitRow}>
                            <div style={{ flex: 1 }}>
                                <label style={styles.fieldLabel}>Target Class / Group *</label>
                                <div style={styles.relativeWrapper}>
                                    <select
                                        style={styles.selectInput}
                                        value={group}
                                        onChange={e => setGroup(e.target.value)}
                                    >
                                        <option value="" hidden>Select a class...</option>
                                        {CLASSES.map(cls => <option key={cls}>{cls}</option>)}
                                    </select>
                                    <ChevronDown size={16} style={styles.dropdownIcon} />
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={styles.fieldLabel}>Select Day *</label>
                                <input
                                    type="number"
                                    style={styles.textInput}
                                    value={day}
                                    onChange={e => setDay(e.target.value)}
                                    min="1"
                                />
                            </div>
                        </div>

                        <div style={styles.splitRow}>
                            <div style={{ flex: 1 }}>
                                <label style={styles.fieldLabel}>Due Date</label>
                                <div style={styles.relativeWrapper}>
                                    <input
                                        type="date"
                                        style={styles.textInput}
                                        value={dueDate}
                                        onChange={e => setDueDate(e.target.value)}
                                    />
                                    <Calendar size={16} style={styles.dateIcon} />
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={styles.fieldLabel}>Max Score *</label>
                                <input
                                    type="number"
                                    style={styles.textInput}
                                    value={score}
                                    onChange={e => setScore(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.fieldLabel}>Description</label>
                            <textarea
                                style={styles.textareaInput}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Describe the assignment requirements..."
                            />
                        </div>

                        {/* STUDY MATERIAL - Either/Or Format */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.fieldLabel}>Study Material</label>
                            <div style={styles.tabToggleGroup}>
                                <button
                                    style={materialType === 'link' ? styles.toggleBtnActive : styles.toggleBtn}
                                    onClick={() => setMaterialType('link')}
                                >
                                    External Link
                                </button>
                                <button
                                    style={materialType === 'file' ? styles.toggleBtnActive : styles.toggleBtn}
                                    onClick={() => setMaterialType('file')}
                                >
                                    Upload File
                                </button>
                            </div>

                            {materialType === 'link' ? (
                                <div style={styles.relativeWrapper}>
                                    <input
                                        style={styles.textInput}
                                        placeholder="e.g. https://resource.link"
                                        value={externalUrl}
                                        onChange={e => setExternalUrl(e.target.value)}
                                    />
                                    <LinkIcon size={16} style={styles.dateIcon} />
                                </div>
                            ) : (
                                <div style={styles.uploadBox} onClick={() => document.getElementById('fileUpload').click()}>
                                    <CloudUpload size={28} style={styles.cloudIcon} />
                                    <input
                                        id="fileUpload"
                                        type="file"
                                        multiple
                                        accept=".pdf,.svg,.png,.jpg,.jpeg,.mp4,.webm,.zip"
                                        hidden
                                        onChange={(e) => setFiles([...e.target.files])}
                                    />
                                    <div style={styles.uploadText}>
                                        <span style={styles.blueLink}>Click to upload</span> images or PDFs
                                    </div>
                                    {files.map((f, i) => (
                                        <div key={i} style={styles.uploadSubtext}>{f.name}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={styles.formFooter}>
                        <button style={styles.primaryBtn} onClick={publishAssignment}>
                            <Send size={16} style={{ marginRight: 8 }} /> Publish Assignment
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div style={styles.listCard}>
                    <div style={styles.listHeader}>
                        <h3 style={styles.title}>Recent Assignments ({selectedSkill})</h3>
                    </div>

                    <div style={styles.filterBar}>
                        <div style={{ ...styles.relativeWrapper, flex: 1 }}>
                            <Search size={16} style={styles.searchInsideIcon} />
                            <input
                                style={styles.searchField}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search assignments..."
                            />
                        </div>

                        <div style={{ ...styles.relativeWrapper, width: '130px' }}>
                            <select
                                style={styles.filterSelect}
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>All</option>
                            </select>
                            <ChevronDown size={16} style={styles.dropdownIcon} />
                        </div>
                    </div>

                    <div style={styles.table}>
                        <div style={styles.tableHeaderRow}>
                            <div style={{ flex: 2.5 }}>Task Name</div>
                            <div style={{ flex: 1 }}>Group</div>
                            <div style={{ flex: 1 }}>Due Date</div>
                            <div style={{ flex: 1 }}>Status</div>
                            <div style={{ width: '40px' }}></div>
                        </div>

                        {filteredAssignments.length > 0 ? (
                            filteredAssignments.map(row => (
                                <div key={row.id} style={styles.tableRow}>
                                    <div style={{ flex: 2.5 }}>
                                        <div style={styles.boldText}>{row.title}</div>
                                        <div style={styles.subtitleText}>Day {row.day} | Max Score: {row.score}</div>
                                    </div>
                                    <div style={{ flex: 1 }}>{row.group}</div>
                                    <div style={{ flex: 1 }}>{row.dueDate || '--'}</div>
                                    <div style={{ flex: 1 }}>
                                        <span style={getStatusBadge(row.status)}>{row.status}</span>
                                    </div>
                                    <div style={{ width: '40px', position: 'relative' }}>
                                        <MoreHorizontal
                                            size={18}
                                            color="#94A3B8"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
                                        />
                                        {openMenuId === row.id && (
                                            <div style={{ position: 'absolute', right: 0, top: '22px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '6px', zIndex: 10, minWidth: '120px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                                <div style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px' }} onClick={() => toggleTaskStatus(row.id, row.status)}>
                                                    {row.status === 'Active' ? 'Set as Inactive' : 'Set as Active'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={styles.emptyState}>
                                No assignments found for {selectedSkill}. Create your first assignment!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* -------- BADGE STYLE LOGIC -------- */
const getStatusBadge = (status) => {
    const base = { padding: '4px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: '700' };
    if (status === 'Active') return { ...base, backgroundColor: '#E1F5FE', color: '#0288D1' };
    return { ...base, backgroundColor: '#FFEBEE', color: '#D32F2F' };
};

const styles = {
    container: {
        width: '100%',
        fontFamily: '"Inter", sans-serif',
        padding: '0 0',
    },
    layoutGrid: {
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        gap: '24px',
        maxHeight: '850px',
    },
    formCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E9EDF2',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
    },
    listCard: {
        flex: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E9EDF2',
        display: 'flex',
        flexDirection: 'column',
    },
    formHeader: {
        padding: '24px',
        borderBottom: '1px solid #F3F4F6',
        display: 'flex',
        alignItems: 'center',
    },
    headerIcon: { color: '#2563EB', marginRight: '10px' },
    title: { fontSize: '18px', fontWeight: '800', margin: 0, color: '#1F2937' },
    formBody: {
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    fieldLabel: { fontSize: '15px', fontWeight: '700', color: '#4B5563' },
    tabToggleGroup: {
        display: 'flex',
        backgroundColor: '#F3F4F6',
        padding: '5px',
        borderRadius: '8px',
        marginBottom: '12px'
    },
    toggleBtn: {
        flex: 1,
        padding: '10px',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '14px',
        fontWeight: '600',
        color: '#6B7280',
        cursor: 'pointer',
        borderRadius: '6px'
    },
    toggleBtnActive: {
        flex: 1,
        padding: '10px',
        border: 'none',
        backgroundColor: '#FFFFFF',
        fontSize: '14px',
        fontWeight: '700',
        color: '#2563EB',
        cursor: 'pointer',
        borderRadius: '6px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    textInput: {
        padding: '12px 14px',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        fontSize: '15px',
        outline: 'none',
        color: '#1F2937',
        width: '100%',
        boxSizing: 'border-box'
    },
    textareaInput: {
        padding: '12px 14px',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        fontSize: '15px',
        minHeight: '100px',
        outline: 'none',
        resize: 'none',
    },
    selectInput: {
        width: '100%',
        padding: '12px 14px',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        fontSize: '15px',
        appearance: 'none',
        backgroundColor: '#FFFFFF',
        outline: 'none',
        color: '#6B7280'
    },
    splitRow: { display: 'flex', gap: '16px' },
    relativeWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    dropdownIcon: { position: 'absolute', right: '12px', color: '#94A3B8', pointerEvents: 'none' },
    dateIcon: { position: 'absolute', right: '12px', color: '#4B5563', pointerEvents: 'none' },
    uploadBox: {
        padding: '28px',
        borderRadius: '8px',
        border: '2px dashed #D1D5DB',
        backgroundColor: '#EBF5FF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer'
    },
    cloudIcon: { color: '#94A3B8' },
    uploadText: { fontSize: '15px', color: '#4B5563', fontWeight: '500' },
    blueLink: { color: '#2563EB', fontWeight: '700' },
    uploadSubtext: { fontSize: '13px', color: '#94A3B8' },
    formFooter: {
        padding: '20px 24px',
        borderTop: '1px solid #F3F4F6',
        display: 'flex',
        gap: '12px',
        backgroundColor: '#FAFBFC'
    },
    primaryBtn: {
        flex: 1.5,
        padding: '14px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#2563EB',
        color: 'white',
        fontWeight: '700',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    listHeader: { padding: '24px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    utilActions: { display: 'flex', gap: '15px' },
    grayAction: { color: '#94A3B8', cursor: 'pointer' },
    filterBar: { padding: '0 30px 20px 30px', display: 'flex', gap: '12px' },
    searchInsideIcon: { position: 'absolute', left: '12px', color: '#94A3B8' },
    searchField: {
        width: '100%',
        padding: '12px 12px 12px 36px',
        borderRadius: '6px',
        border: '1px solid #F1F5F9',
        backgroundColor: '#F8FAFC',
        fontSize: '15px',
        outline: 'none'
    },
    filterSelect: {
        width: '100%',
        padding: '12px 12px',
        borderRadius: '6px',
        border: '1px solid #F1F5F9',
        backgroundColor: 'white',
        fontSize: '15px',
        appearance: 'none',
        outline: 'none',
        color: '#374151'
    },
    table: { display: 'flex', flexDirection: 'column', flex: 1 },
    tableHeaderRow: {
        display: 'flex',
        padding: '14px 30px',
        backgroundColor: '#F8F9FB',
        borderBottom: '1px solid #E9EDF2',
        color: '#94A3B8',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '0.2px'
    },
    tableRow: {
        display: 'flex',
        padding: '18px 30px',
        borderBottom: '1px solid #F8FAFC',
        alignItems: 'center',
        fontSize: '15px'
    },
    boldText: { fontWeight: '800', color: '#1F2937', marginBottom: '2px', fontSize: '16px' },
    subtitleText: { color: '#94A3B8', fontSize: '13px', fontWeight: '500' },
    emptyState: {
        padding: '40px 30px',
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: '14px',
        fontStyle: 'italic'
    }
};

export default AssignmentDashboard;
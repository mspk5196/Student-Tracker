import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Eye, Plus, Pencil, Trash2, FileText, Youtube, Download,
    ExternalLink, PlusCircle, ChevronDown, FileCode, X, Link as LinkIcon, Upload
} from 'lucide-react';
import AssignmentDashboard from '../Task-Assignment-page/Task&assignments';

/* ---------------- INITIAL DATA ---------------- */
const INITIAL_ROADMAP = [
    {
        id: 1,
        day: 1,
        title: "Introduction & Course Overview",
        description: "Welcome to CS-201! Today we will cover the syllabus and grading policy.",
        status: "published",
        resources: [
            { id: 101, name: "Syllabus_CS201.pdf", type: "PDF Document", kind: "pdf" },
            { id: 102, name: "Lecture 1 Recording", type: "Video Link", kind: "video" }
        ]
    }
];

const StudyRoadmap = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'roadmap';

    const [roadmap, setRoadmap] = useState(INITIAL_ROADMAP);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ title: '', description: '' });

    // Resource Modal State
    const [showResourceModal, setShowResourceModal] = useState(false);
    const [currentModuleId, setCurrentModuleId] = useState(null);
    const [newResource, setNewResource] = useState({
        name: '',
        kind: 'pdf', // pdf, video, link
        url: ''
    });

    /* ---------- DAY / MODULE HANDLERS ---------- */
    const addDay = () => {
        const nextDay = roadmap.length + 1;
        const newDay = {
            id: Date.now(),
            day: nextDay,
            title: `Day ${nextDay} Title`,
            status: 'draft',
            resources: []
        };
        setRoadmap([...roadmap, newDay]);
    };

    const setupDraft = (id) => {
        setRoadmap(prev => prev.map(item => 
            item.id === id ? { ...item, status: 'published', description: 'Enter module description here...' } : item
        ));
        const item = roadmap.find(r => r.id === id);
        startEdit({ ...item, title: item.title, description: '' });
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditData({ title: item.title, description: item.description });
    };

    const saveEdit = (id) => {
        setRoadmap(prev => prev.map(item =>
            item.id === id ? { ...item, title: editData.title, description: editData.description } : item
        ));
        setEditingId(null);
    };

    const deleteDay = (id) => setRoadmap(prev => prev.filter(item => item.id !== id));

    /* ---------- RESOURCE HANDLERS ---------- */
    const handleOpenResourceModal = (moduleId) => {
        setCurrentModuleId(moduleId);
        setShowResourceModal(true);
    };

    const handleAddResource = () => {
        if (!newResource.name) return alert("Please enter a name");

        const resourceObj = {
            id: Date.now(),
            name: newResource.name,
            kind: newResource.kind,
            type: newResource.kind === 'pdf' ? 'PDF Document' : 
                  newResource.kind === 'video' ? 'Video Link' : 'Web Resource'
        };

        setRoadmap(prev => prev.map(item => 
            item.id === currentModuleId 
            ? { ...item, resources: [...item.resources, resourceObj] } 
            : item
        ));

        // Reset
        setShowResourceModal(false);
        setNewResource({ name: '', kind: 'pdf', url: '' });
    };

    const getResourceIcon = (kind) => {
        switch (kind) {
            case 'pdf': return <FileText size={20} color="#EF4444" />;
            case 'video': return <Youtube size={20} color="#FF0000" />;
            case 'link': return <LinkIcon size={20} color="#3B82F6" />;
            default: return <FileText size={20} />;
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                {/* HEADER */}
                <div style={styles.header}>
                    <div style={styles.headerLeft}>
                        <div style={styles.tabContainer}>
                            <button onClick={() => setSearchParams({ tab: 'assignments' })} style={activeTab === 'assignments' ? styles.tabActive : styles.tabInactive}>Assignments</button>
                            <button onClick={() => setSearchParams({ tab: 'roadmap' })} style={activeTab === 'roadmap' ? styles.tabActive : styles.tabInactive}>Study Roadmap</button>
                        </div>
                        <div style={styles.dropdown}>
                            <span>CS-201: Data Structures</span>
                            <ChevronDown size={16} />
                        </div>
                    </div>
                    <div style={styles.headerRight}>
                        <button style={styles.studentViewBtn}><Eye size={18} /><span>Student View</span></button>
                        <button style={styles.addDayBtn} onClick={addDay}><Plus size={18} /><span>Add Day / Module</span></button>
                    </div>
                </div>

                {activeTab === 'assignments' ? (
                    <AssignmentDashboard />
                ) : (
                    <div style={styles.contentList}>
                        {roadmap.map((module, index) => (
                            <React.Fragment key={module.id}>
                                {index !== 0 && <div style={styles.connector} />}
                                <div style={styles.card}>
                                    {module.status === 'published' ? (
                                        <>
                                            <div style={styles.cardHeader}>
                                                <div style={styles.headerInfo}>
                                                    <div style={styles.dayBadge}>DAY {module.day}</div>
                                                    {editingId === module.id ? (
                                                        <input 
                                                            style={styles.titleInput}
                                                            value={editData.title} 
                                                            onChange={e => setEditData({...editData, title: e.target.value})} 
                                                        />
                                                    ) : (
                                                        <h3 style={styles.cardTitle}>{module.title}</h3>
                                                    )}
                                                </div>
                                                <div style={styles.headerActions}>
                                                    {editingId === module.id ? (
                                                        <button onClick={() => saveEdit(module.id)} style={styles.saveBtn}>Save</button>
                                                    ) : (
                                                        <button onClick={() => startEdit(module)} style={styles.iconBtn}><Pencil size={18} /></button>
                                                    )}
                                                    <button onClick={() => deleteDay(module.id)} style={styles.iconBtnRed}><Trash2 size={18} /></button>
                                                </div>
                                            </div>

                                            <div style={styles.cardBody}>
                                                {editingId === module.id ? (
                                                    <textarea 
                                                        style={styles.textArea}
                                                        value={editData.description} 
                                                        onChange={e => setEditData({...editData, description: e.target.value})} 
                                                    />
                                                ) : (
                                                    <p style={styles.description}>{module.description}</p>
                                                )}

                                                <div style={styles.resourceList}>
                                                    {module.resources?.map(res => (
                                                        <div key={res.id} style={styles.resourceItem}>
                                                            <div style={styles.resourceLeft}>
                                                                <div style={styles.resourceIconWrapper}>
                                                                    {getResourceIcon(res.kind)}
                                                                </div>
                                                                <div style={styles.resourceInfo}>
                                                                    <span style={styles.resName}>{res.name}</span>
                                                                    <span style={styles.resMeta}>{res.type}</span>
                                                                </div>
                                                            </div>
                                                            {res.kind === 'pdf' ? <Download size={18} style={styles.cursor} color="#9CA3AF" /> : <ExternalLink size={18} style={styles.cursor} color="#9CA3AF" />}
                                                        </div>
                                                    ))}
                                                </div>

                                                <button style={styles.addResourceBtn} onClick={() => handleOpenResourceModal(module.id)}>
                                                    <PlusCircle size={18} />
                                                    <span>Add Resource or File</span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div style={styles.draftCard}>
                                            <div style={styles.headerInfo}>
                                                <div style={styles.draftBadge}>DAY {module.day}</div>
                                                <h3 style={styles.draftTitle}>{module.title} (Draft)</h3>
                                            </div>
                                            <button style={styles.setupBtn} onClick={() => setupDraft(module.id)}>Setup Content</button>
                                        </div>
                                    )}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>

            {/* RESOURCE MODAL */}
            {showResourceModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3 style={{margin:0}}>Add Resource</h3>
                            <X style={styles.cursor} onClick={() => setShowResourceModal(false)} />
                        </div>
                        
                        <div style={styles.modalBody}>
                            <label style={styles.label}>Resource Title</label>
                            <input 
                                style={styles.input} 
                                placeholder="e.g. Lecture Notes or Tutorial Video" 
                                value={newResource.name}
                                onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                            />

                            <label style={styles.label}>Type</label>
                            <div style={styles.typeGrid}>
                                <button 
                                    onClick={() => setNewResource({...newResource, kind: 'pdf'})}
                                    style={newResource.kind === 'pdf' ? styles.activeType : styles.typeBtn}>
                                    <FileText size={18} /> PDF
                                </button>
                                <button 
                                    onClick={() => setNewResource({...newResource, kind: 'video'})}
                                    style={newResource.kind === 'video' ? styles.activeType : styles.typeBtn}>
                                    <Youtube size={18} /> Video
                                </button>
                                <button 
                                    onClick={() => setNewResource({...newResource, kind: 'link'})}
                                    style={newResource.kind === 'link' ? styles.activeType : styles.typeBtn}>
                                    <LinkIcon size={18} /> Link
                                </button>
                            </div>

                            <label style={styles.label}>{newResource.kind === 'pdf' ? 'Upload File' : 'Resource URL'}</label>
                            {newResource.kind === 'pdf' ? (
                                <div style={styles.filePlaceholder}>
                                    <Upload size={20} />
                                    <span>Choose PDF File</span>
                                </div>
                            ) : (
                                <input 
                                    style={styles.input} 
                                    placeholder="Enter URL" 
                                    value={newResource.url}
                                    onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                                />
                            )}
                        </div>

                        <div style={styles.modalFooter}>
                            <button style={styles.cancelBtn} onClick={() => setShowResourceModal(false)}>Cancel</button>
                            <button style={styles.confirmBtn} onClick={handleAddResource}>Add Resource</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    // ... Existing styles from your snippet ...
    pageWrapper: { backgroundColor: '#F8F9FB', minHeight: '100vh', padding: '4px 0', fontFamily: '"Inter", sans-serif' },
    container: { minWidth: '98%', margin: '0 auto', padding: '0 2px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    headerLeft: { display: 'flex', gap: '16px', alignItems: 'center' },
    tabContainer: { display: 'flex', backgroundColor: '#EDF0F3', padding: '4px', borderRadius: '8px' },
    tabActive: { padding: '8px 16px', border: 'none', borderRadius: '6px', backgroundColor: '#FFFFFF', fontSize: '14px', fontWeight: '500', color: '#374151', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    tabInactive: { padding: '8px 16px', border: 'none', backgroundColor: 'transparent', fontSize: '14px', fontWeight: '500', color: '#6B7280', cursor: 'pointer' },
    dropdown: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', color: '#374151' },
    headerRight: { display: 'flex', gap: '12px' },
    studentViewBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    addDayBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#0066FF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#FFFFFF', cursor: 'pointer' },
    contentList: { display: 'flex', flexDirection: 'column' },
    connector: { width: '1px', height: '24px', backgroundColor: '#E5E7EB', marginLeft: '32px' },
    card: { backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' },
    cardHeader: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6' },
    headerInfo: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
    dayBadge: { backgroundColor: '#0066FF', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '6px 10px', borderRadius: '6px' },
    cardTitle: { fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 },
    titleInput: { padding: '8px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '16px', fontWeight: '600', width: '70%' },
    headerActions: { display: 'flex', gap: '8px' },
    iconBtn: { background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '8px' },
    iconBtnRed: { background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px' },
    saveBtn: { backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
    cardBody: { padding: '24px' },
    textArea: { width: '100%', minHeight: '80px', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '16px' },
    description: { fontSize: '14px', color: '#6B7280', margin: '0 0 20px 0', lineHeight: 1.6 },
    resourceList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' },
    resourceItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '10px', border: '1px solid #F3F4F6' },
    resourceLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    resourceIconWrapper: { width: '40px', height: '40px', backgroundColor: '#F9FAFB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    resourceInfo: { display: 'flex', flexDirection: 'column' },
    resName: { fontSize: '14px', fontWeight: '600', color: '#374151' },
    resMeta: { fontSize: '12px', color: '#9CA3AF' },
    cursor: { cursor: 'pointer' },
    addResourceBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', backgroundColor: 'transparent', border: '1px dashed #E5E7EB', borderRadius: '10px', color: '#6B7280', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
    
    /* DRAFT */
    draftCard: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    draftBadge: { backgroundColor: '#9CA3AF', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '6px 10px', borderRadius: '6px' },
    draftTitle: { fontSize: '15px', color: '#9CA3AF', margin: 0 },
    setupBtn: { padding: '10px 20px', backgroundColor: '#0066FF', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },

    /* MODAL */
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#FFF', borderRadius: '16px', width: '450px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    modalBody: { display: 'flex', flexDirection: 'column', gap: '16px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none' },
    typeGrid: { display: 'flex', gap: '10px' },
    typeBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '13px' },
    activeType: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', border: '1px solid #0066FF', borderRadius: '8px', backgroundColor: '#F0F7FF', color: '#0066FF', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
    filePlaceholder: { padding: '24px', border: '2px dashed #E5E7EB', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '14px' },
    modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
    cancelBtn: { padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#FFF', cursor: 'pointer' },
    confirmBtn: { padding: '10px 16px', border: 'none', borderRadius: '8px', backgroundColor: '#0066FF', color: '#FFF', fontWeight: '600', cursor: 'pointer' }
};

export default StudyRoadmap;
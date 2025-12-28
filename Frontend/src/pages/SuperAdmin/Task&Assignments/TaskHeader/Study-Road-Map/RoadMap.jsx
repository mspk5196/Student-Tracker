import React, { useState, useEffect, useRef } from 'react';
import {
    Pencil, Trash2, FileText, Youtube, Download,
    ExternalLink, PlusCircle, X, Link as LinkIcon, Upload
} from 'lucide-react';

const StudyRoadmap = ({ selectedSkill, isActiveTab, addDayTrigger }) => {
    // --- Responsive State ---
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- ROADMAP DATA WITH MULTIPLE SKILLS ---
    const ROADMAP_DATA = {
        'REACT-101': [
            {
                id: 1,
                day: 1,
                title: "React Fundamentals & JSX",
                description: "Introduction to React, understanding JSX, and creating your first components.",
                status: "published",
                resources: [
                    { id: 101, name: "React_Official_Docs.pdf", type: "PDF Document", kind: "pdf", url: "https://react.dev/learn" },
                    { id: 102, name: "JSX Tutorial Video", type: "Video Link", kind: "video", url: "https://www.youtube.com" }
                ]
            },
            {
                id: 2,
                day: 2,
                title: "Components & Props",
                description: "Learn about React components, props, and component composition.",
                status: "published",
                resources: [
                    { id: 103, name: "Components_Guide.pdf", type: "PDF Document", kind: "pdf", url: "https://react.dev/learn/your-first-component" }
                ]
            }
        ],
        'WEB-201': [
            {
                id: 3,
                day: 1,
                title: "HTML5 Semantic Elements",
                description: "Learn about modern HTML5 semantic tags and their importance.",
                status: "published",
                resources: [
                    { id: 104, name: "HTML5_Cheatsheet.pdf", type: "PDF Document", kind: "pdf", url: "https://web.dev/learn/html/semantic-html" }
                ]
            }
        ],
        'JS-301': [
            {
                id: 4,
                day: 1,
                title: "JavaScript ES6+ Features",
                description: "Modern JavaScript features including arrow functions, destructuring, and modules.",
                status: "published",
                resources: [
                    { id: 105, name: "ES6_Features.pdf", type: "PDF Document", kind: "pdf", url: "https://javascript.info/es-mod" },
                    { id: 106, name: "Async JavaScript Video", type: "Video Link", kind: "video", url: "https://www.youtube.com" }
                ]
            }
        ]
    };

    const [allRoadmapData, setAllRoadmapData] = useState(ROADMAP_DATA);
    const [roadmap, setRoadmap] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ title: '', description: '' });
    const [lastAddDayTrigger, setLastAddDayTrigger] = useState(0);

    const [showResourceModal, setShowResourceModal] = useState(false);
    const [currentModuleId, setCurrentModuleId] = useState(null);
    const [newResource, setNewResource] = useState({ name: '', kind: 'pdf', url: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (selectedSkill) {
            const skillRoadmap = allRoadmapData[selectedSkill] || [];
            setRoadmap(skillRoadmap);
            setEditingId(null);
        }
    }, [selectedSkill, allRoadmapData]);

    useEffect(() => {
        if (addDayTrigger > lastAddDayTrigger && selectedSkill) {
            addDay();
            setLastAddDayTrigger(addDayTrigger);
        }
    }, [addDayTrigger, selectedSkill, lastAddDayTrigger]);

    const addDay = () => {
        if (!selectedSkill) return;
        let nextDay = roadmap.length === 0 ? 1 : Math.max(...roadmap.map(item => item.day)) + 1;
        const newDay = {
            id: Date.now(),
            day: nextDay,
            title: `${selectedSkill} - Day ${nextDay}`,
            description: 'Enter module description here...',
            status: 'draft',
            resources: []
        };
        const updatedRoadmap = [...roadmap, newDay];
        setRoadmap(updatedRoadmap);
        setAllRoadmapData(prev => ({ ...prev, [selectedSkill]: updatedRoadmap }));
    };

    const handleAddDay = () => addDay();

    const setupDraft = (id) => {
        const draftModule = roadmap.find(r => r.id === id);
        if (!draftModule) return;
        setEditingId(id);
        setEditData({ title: draftModule.title, description: draftModule.description || 'Enter module description here...' });
        const updatedRoadmap = roadmap.map(item => item.id === id ? { ...item, status: 'editing' } : item );
        setRoadmap(updatedRoadmap);
        setAllRoadmapData(prev => ({ ...prev, [selectedSkill]: updatedRoadmap }));
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditData({ title: item.title, description: item.description });
    };

    const saveEdit = (id) => {
        const updatedRoadmap = roadmap.map(item =>
            item.id === id ? { ...item, title: editData.title, description: editData.description, status: 'published' } : item
        );
        setRoadmap(updatedRoadmap);
        setAllRoadmapData(prev => ({ ...prev, [selectedSkill]: updatedRoadmap }));
        setEditingId(null);
    };

    const cancelEdit = (id) => {
        const updatedRoadmap = roadmap.map(item => item.id === id ? { ...item, status: 'draft' } : item );
        setRoadmap(updatedRoadmap);
        setAllRoadmapData(prev => ({ ...prev, [selectedSkill]: updatedRoadmap }));
        setEditingId(null);
    };

    const deleteDay = (id) => {
        const updatedRoadmap = roadmap.filter(item => item.id !== id);
        setRoadmap(updatedRoadmap);
        setAllRoadmapData(prev => ({ ...prev, [selectedSkill]: updatedRoadmap }));
    };

    const handleFileSelect = () => fileInputRef.current.click();
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setNewResource(prev => ({ ...prev, name: prev.name || file.name.replace('.pdf', '') }));
        }
    };

    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            setSelectedFile(files[0]);
            setNewResource(prev => ({ ...prev, name: prev.name || files[0].name.replace('.pdf', '') }));
        }
    };

    const removeSelectedFile = () => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

    const handleOpenResourceModal = (moduleId) => {
        setCurrentModuleId(moduleId);
        setShowResourceModal(true);
        setSelectedFile(null);
        setNewResource({ name: '', kind: 'pdf', url: '' });
    };

    const handleAddResource = () => {
        if (!newResource.name || (newResource.kind === 'pdf' && !selectedFile)) {
            alert("Please fill required info"); return;
        }
        const resourceObj = {
            id: Date.now(),
            name: newResource.name,
            kind: newResource.kind,
            type: newResource.kind === 'pdf' ? 'PDF Document' : newResource.kind === 'video' ? 'Video Link' : 'Web Resource',
            url: newResource.kind === 'pdf' && selectedFile ? URL.createObjectURL(selectedFile) : (newResource.url || ''),
        };
        const updatedRoadmap = roadmap.map(item => item.id === currentModuleId ? { ...item, resources: [...(item.resources || []), resourceObj] } : item );
        setRoadmap(updatedRoadmap);
        setAllRoadmapData(prev => ({ ...prev, [selectedSkill]: updatedRoadmap }));
        setShowResourceModal(false);
    };

    const getResourceIcon = (kind) => {
        switch (kind) {
            case 'pdf': return <FileText size={20} color="#EF4444" />;
            case 'video': return <Youtube size={20} color="#FF0000" />;
            case 'link': return <LinkIcon size={20} color="#3B82F6" />;
            default: return <FileText size={20} />;
        }
    };

    const handleResourceAction = (res) => {
        if (!res.url) return;
        if (res.kind === 'pdf') {
            const link = document.createElement('a'); link.href = res.url; link.target = "_blank";
            link.download = res.name.toLowerCase().endsWith('.pdf') ? res.name : `${res.name}.pdf`;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
        } else {
            window.open(res.url, '_blank');
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={{ ...styles.container }}>
                <div style={{ ...styles.skillHeader, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '12px' : '16px' }}>
                    <h2 style={{ ...styles.skillTitle, fontSize: isMobile ? '20px' : '24px' }}>
                        {selectedSkill === 'REACT-101' ? 'React Mastery Workshop' : selectedSkill}
                    </h2>
                    <div style={styles.skillInfo}>
                        <span style={styles.skillCode}>{selectedSkill}</span>
                        <span style={styles.moduleCount}>{roadmap.length} Modules</span>
                    </div>
                </div>

                <div style={styles.contentList}>
                    {roadmap.length === 0 ? (
                        <div style={styles.emptyState}>
                            <h3 style={{ color: '#6B7280', marginBottom: '12px' }}>No modules yet</h3>
                            <button style={styles.addDayBtn} onClick={handleAddDay}>
                                <PlusCircle size={18} />
                                <span>Add First Module</span>
                            </button>
                        </div>
                    ) : (
                        roadmap.map((module, index) => (
                            <React.Fragment key={module.id}>
                                {index !== 0 && <div style={styles.connector} />}
                                <div style={styles.card}>
                                    {module.status === 'draft' ? (
                                        <div style={{ ...styles.draftCard, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '16px' : '0' }}>
                                            <div style={styles.headerInfo}>
                                                <div style={styles.draftBadge}>DAY {module.day}</div>
                                                <h3 style={styles.draftTitle}>{module.title}</h3>
                                            </div>
                                            <button style={{ ...styles.setupBtn, width: isMobile ? '100%' : 'auto' }} onClick={() => setupDraft(module.id)}>Setup Content</button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ ...styles.cardHeader, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '12px' : '0' }}>
                                                <div style={styles.headerInfo}>
                                                    <div style={styles.dayBadge}>DAY {module.day}</div>
                                                    {editingId === module.id ? (
                                                        <input style={{ ...styles.titleInput, width: isMobile ? '100%' : '70%' }} value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} />
                                                    ) : (
                                                        <h3 style={styles.cardTitle}>{module.title}</h3>
                                                    )}
                                                </div>
                                                <div style={{ ...styles.headerActions, alignSelf: isMobile ? 'flex-end' : 'center' }}>
                                                    {editingId === module.id ? (
                                                        <><button onClick={() => saveEdit(module.id)} style={styles.saveBtn}>Save</button><button onClick={() => cancelEdit(module.id)} style={styles.cancelBtn}>Cancel</button></>
                                                    ) : (
                                                        <button onClick={() => startEdit(module)} style={styles.iconBtn}><Pencil size={18} /></button>
                                                    )}
                                                    <button onClick={() => deleteDay(module.id)} style={styles.iconBtnRed}><Trash2 size={18} /></button>
                                                </div>
                                            </div>
                                            <div style={{ ...styles.cardBody, padding: isMobile ? '16px' : '24px' }}>
                                                {editingId === module.id ? (
                                                    <textarea style={styles.textArea} value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} />
                                                ) : ( <p style={styles.description}>{module.description}</p> )}
                                                <div style={styles.resourceList}>
                                                    {module.resources?.map(res => (
                                                        <div key={res.id} style={{ ...styles.resourceItem, padding: isMobile ? '10px' : '14px 16px' }}>
                                                            <div style={styles.resourceLeft}>
                                                                <div style={styles.resourceIconWrapper}>{getResourceIcon(res.kind)}</div>
                                                                <div style={styles.resourceInfo}>
                                                                    <span style={{ ...styles.resName, maxWidth: isMobile ? '150px' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{res.name}</span>
                                                                    <span style={styles.resMeta}>{res.type}</span>
                                                                </div>
                                                            </div>
                                                            <Download size={18} style={styles.cursor} color="#0066FF" onClick={() => handleResourceAction(res)} />
                                                        </div>
                                                    ))}
                                                </div>
                                                <button style={styles.addResourceBtn} onClick={() => handleOpenResourceModal(module.id)}><PlusCircle size={18} /><span>Add Resource or File</span></button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </React.Fragment>
                        ))
                    )}
                    {roadmap.length > 0 && (
                        <div style={styles.addAnotherContainer}>
                            <button style={styles.addAnotherBtn} onClick={handleAddDay}><PlusCircle size={18} /><span>Add Another Day</span></button>
                        </div>
                    )}
                </div>
            </div>

            {showResourceModal && (
                <div style={styles.modalOverlay}>
                    <div style={{ ...styles.modalContent, width: isMobile ? '95%' : '450px' }}>
                        <div style={styles.modalHeader}><h3 style={{ margin: 0 }}>Add Resource</h3><X style={styles.cursor} onClick={() => setShowResourceModal(false)} /></div>
                        <div style={styles.modalBody}>
                            <label style={styles.label}>Resource Title</label>
                            <input style={styles.input} value={newResource.name} onChange={(e) => setNewResource({ ...newResource, name: e.target.value })} />
                            <label style={styles.label}>Type</label>
                            <div style={{ ...styles.typeGrid, flexDirection: isMobile ? 'column' : 'row' }}>
                                {['pdf', 'video', 'link'].map(t => (
                                    <button key={t} onClick={() => setNewResource({ ...newResource, kind: t })} style={newResource.kind === t ? styles.activeType : styles.typeBtn}>{t.toUpperCase()}</button>
                                ))}
                            </div>
                            <label style={styles.label}>{newResource.kind === 'pdf' ? 'Upload File' : 'Resource URL'}</label>
                            {newResource.kind === 'pdf' ? (
                                <div style={styles.filePlaceholder} onClick={handleFileSelect} onDragOver={handleDragOver} onDrop={handleDrop}>
                                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf" onChange={handleFileChange} />
                                    {selectedFile ? <span>{selectedFile.name}</span> : <span>Click or Drag PDF here</span>}
                                </div>
                            ) : ( <input style={styles.input} value={newResource.url} onChange={(e) => setNewResource({ ...newResource, url: e.target.value })} /> )}
                        </div>
                        <div style={styles.modalFooter}>
                            <button style={styles.cancelBtnModal} onClick={() => setShowResourceModal(false)}>Cancel</button>
                            <button style={styles.confirmBtn} onClick={handleAddResource}>Add Resource</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    pageWrapper: { backgroundColor: '#F8F9FB', fontFamily: '"Inter", sans-serif', minHeight: '100vh' },
    container: { width: '100%', boxSizing: 'border-box' },
    skillHeader: { marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #E5E7EB', display: 'flex' },
    skillTitle: { fontWeight: '700', color: '#111827', margin: '0' },
    skillInfo: { display: 'flex', gap: '16px', alignItems: 'center' },
    skillCode: { backgroundColor: '#0066FF', color: '#FFFFFF', padding: '4px 12px', borderRadius: '16px', fontSize: '14px', fontWeight: '600' },
    moduleCount: { color: '#6B7280', fontSize: '14px', fontWeight: '500' },
    draftCount: { backgroundColor: '#FEF3C7', color: '#92400E', padding: '4px 12px', borderRadius: '16px', fontSize: '14px', fontWeight: '500' },
    contentList: { display: 'flex', flexDirection: 'column' },
    emptyState: { backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '60px 40px', textAlign: 'center', border: '1px dashed #E5E7EB', marginTop: '20px' },
    addDayBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: '#0066FF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#FFFFFF', cursor: 'pointer', margin: '0 auto' },
    addAnotherContainer: { display: 'flex', justifyContent: 'center', marginTop: '24px', paddingBottom: '24px' },
    addAnotherBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#0066FF', cursor: 'pointer' },
    connector: { width: '3px', height: '32px', backgroundColor: '#0066FF', marginLeft: '19px', opacity: 0.2, borderRadius: '3px' },
    card: { backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden', marginBottom: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    cardHeader: { padding: '16px 20px', display: 'flex', borderBottom: '1px solid #F3F4F6' },
    headerInfo: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
    dayBadge: { backgroundColor: '#0066FF', color: '#FFFFFF', fontSize: '11px', fontWeight: '800', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    cardTitle: { fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 },
    titleInput: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', fontSize: '16px', fontWeight: '600', outline: 'none' },
    headerActions: { display: 'flex', gap: '8px' },
    iconBtn: { background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '8px' },
    iconBtnRed: { background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px' },
    saveBtn: { backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
    cancelBtn: { backgroundColor: '#6B7280', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
    cardBody: { padding: '24px' },
    textArea: { width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '16px', fontSize: '14px', outline: 'none', resize: 'vertical' },
    description: { fontSize: '14px', color: '#6B7280', margin: '0 0 20px 0', lineHeight: 1.6 },
    resourceList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' },
    resourceItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '10px', border: '1px solid #F3F4F6' },
    resourceLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    resourceIconWrapper: { width: '40px', height: '40px', backgroundColor: '#F9FAFB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    resourceInfo: { display: 'flex', flexDirection: 'column' },
    resName: { fontSize: '14px', fontWeight: '600', color: '#374151' },
    resMeta: { fontSize: '12px', color: '#9CA3AF' },
    cursor: { cursor: 'pointer' },
    addResourceBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', backgroundColor: 'transparent', border: '1px dashed #E5E7EB', borderRadius: '10px', color: '#6B7280', fontSize: '14px', cursor: 'pointer' },
    draftCard: { padding: '20px', display: 'flex', alignItems: 'center' },
    draftBadge: { backgroundColor: '#9CA3AF', color: '#FFFFFF', fontSize: '11px', fontWeight: '800', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    draftTitle: { fontSize: '15px', color: '#6B7280', margin: 0, fontStyle: 'italic' },
    setupBtn: { padding: '10px 20px', backgroundColor: '#0066FF', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#FFF', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    modalBody: { display: 'flex', flexDirection: 'column', gap: '16px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '14px' },
    typeGrid: { display: 'flex', gap: '10px' },
    typeBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '13px' },
    activeType: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', border: '1px solid #0066FF', borderRadius: '8px', backgroundColor: '#F0F7FF', color: '#0066FF', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
    filePlaceholder: { padding: '24px', border: '2px dashed #E5E7EB', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '14px', cursor: 'pointer', minHeight: '100px', justifyContent: 'center' },
    modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
    cancelBtnModal: { padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '14px' },
    confirmBtn: { padding: '10px 16px', border: 'none', borderRadius: '8px', backgroundColor: '#0066FF', color: '#FFF', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }
};

export default StudyRoadmap;
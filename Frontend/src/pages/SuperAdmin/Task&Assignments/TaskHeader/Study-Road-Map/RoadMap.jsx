import React, { useState, useEffect } from 'react';
import {
  Pencil, Trash2, FileText, Youtube, Download,
  ExternalLink, PlusCircle, X, Link as LinkIcon, Upload
} from 'lucide-react';

const StudyRoadmap = ({ selectedSkill, isActiveTab, addDayTrigger }) => {
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
          { id: 101, name: "React_Official_Docs.pdf", type: "PDF Document", kind: "pdf" },
          { id: 102, name: "JSX Tutorial Video", type: "Video Link", kind: "video" }
        ]
      },
      {
        id: 2,
        day: 2,
        title: "Components & Props",
        description: "Learn about React components, props, and component composition.",
        status: "published",
        resources: [
          { id: 103, name: "Components_Guide.pdf", type: "PDF Document", kind: "pdf" }
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
          { id: 104, name: "HTML5_Cheatsheet.pdf", type: "PDF Document", kind: "pdf" }
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
          { id: 105, name: "ES6_Features.pdf", type: "PDF Document", kind: "pdf" },
          { id: 106, name: "Async JavaScript Video", type: "Video Link", kind: "video" }
        ]
      }
    ]
  };

  // State to manage all roadmap data
  const [allRoadmapData, setAllRoadmapData] = useState(ROADMAP_DATA);
  const [roadmap, setRoadmap] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '' });
  const [lastAddDayTrigger, setLastAddDayTrigger] = useState(0);

  // Resource Modal State
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [newResource, setNewResource] = useState({
    name: '',
    kind: 'pdf',
    url: ''
  });

  // Initialize roadmap for selected skill
  useEffect(() => {
    if (selectedSkill) {
      const skillRoadmap = allRoadmapData[selectedSkill] || [];
      setRoadmap(skillRoadmap);
      setEditingId(null);
    }
  }, [selectedSkill, allRoadmapData]);

  // Handle add day trigger from parent - FIXED
  useEffect(() => {
    console.log("Add day trigger effect running:", { addDayTrigger, lastAddDayTrigger, selectedSkill });
    
    if (addDayTrigger > lastAddDayTrigger && selectedSkill) {
      console.log("Triggering addDay...");
      addDay();
      setLastAddDayTrigger(addDayTrigger);
    }
  }, [addDayTrigger, selectedSkill, lastAddDayTrigger]);

  /* ---------- DAY / MODULE HANDLERS ---------- */
  const addDay = () => {
    if (!selectedSkill) {
      console.error("No skill selected!");
      return;
    }
    
    console.log("Adding day for skill:", selectedSkill);
    
    // Get current roadmap for this skill from state, not from allRoadmapData
    console.log("Current roadmap from state:", roadmap);
    
    // Calculate next day number based on existing modules
    let nextDay;
    if (roadmap.length === 0) {
      nextDay = 1;
    } else {
      // Find the highest day number in current roadmap
      const maxDay = Math.max(...roadmap.map(item => item.day));
      nextDay = maxDay + 1;
    }
    
    console.log("Next day number:", nextDay);
    
    const newDay = {
      id: Date.now(),
      day: nextDay,
      title: `${selectedSkill} - Day ${nextDay}`,
      description: 'Enter module description here...',
      status: 'draft',
      resources: []
    };
    
    console.log("New day object:", newDay);
    
    // Create updated roadmap
    const updatedRoadmap = [...roadmap, newDay];
    
    // Update both states
    setRoadmap(updatedRoadmap);
    setAllRoadmapData(prev => ({
      ...prev,
      [selectedSkill]: updatedRoadmap
    }));
    
    console.log("Day added successfully! Total modules:", updatedRoadmap.length);
  };

  // Also provide a direct addDay function for the "Add First Module" button
  const handleAddDay = () => {
    console.log("Manual addDay triggered");
    addDay();
  };

  const setupDraft = (id) => {
    console.log("Setting up draft with ID:", id);
    
    // Find the draft module
    const draftModule = roadmap.find(r => r.id === id);
    if (!draftModule) {
      console.error("Draft module not found!");
      return;
    }
    
    console.log("Found draft module:", draftModule);
    
    // Set editing state to show the full edit UI
    setEditingId(id);
    setEditData({ 
      title: draftModule.title, 
      description: draftModule.description || 'Enter module description here...' 
    });
    
    // Change status to 'editing' so it shows the full UI
    const updatedRoadmap = roadmap.map(item =>
      item.id === id ? { ...item, status: 'editing' } : item
    );
    
    setRoadmap(updatedRoadmap);
    setAllRoadmapData(prev => ({
      ...prev,
      [selectedSkill]: updatedRoadmap
    }));
    
    console.log("Draft setup complete!");
  };

  const startEdit = (item) => {
    console.log("Starting edit for:", item.id);
    setEditingId(item.id);
    setEditData({ title: item.title, description: item.description });
  };

  const saveEdit = (id) => {
    console.log("Saving edit for:", id);
    
    const updatedRoadmap = roadmap.map(item =>
      item.id === id ? { 
        ...item, 
        title: editData.title, 
        description: editData.description, 
        status: 'published'
      } : item
    );
    
    // Update both states
    setRoadmap(updatedRoadmap);
    setAllRoadmapData(prev => ({
      ...prev,
      [selectedSkill]: updatedRoadmap
    }));
    
    setEditingId(null);
    console.log("Edit saved!");
  };

  const cancelEdit = (id) => {
    console.log("Canceling edit for:", id);
    
    const updatedRoadmap = roadmap.map(item =>
      item.id === id ? { ...item, status: 'draft' } : item
    );
    
    // Update both states
    setRoadmap(updatedRoadmap);
    setAllRoadmapData(prev => ({
      ...prev,
      [selectedSkill]: updatedRoadmap
    }));
    
    setEditingId(null);
    console.log("Edit canceled!");
  };

  const deleteDay = (id) => {
    console.log("Deleting day:", id);
    
    const updatedRoadmap = roadmap.filter(item => item.id !== id);
    
    // Update both states
    setRoadmap(updatedRoadmap);
    setAllRoadmapData(prev => ({
      ...prev,
      [selectedSkill]: updatedRoadmap
    }));
    
    console.log("Day deleted!");
  };

  /* ---------- RESOURCE HANDLERS ---------- */
  const handleOpenResourceModal = (moduleId) => {
    console.log("Opening resource modal for module:", moduleId);
    setCurrentModuleId(moduleId);
    setShowResourceModal(true);
  };

  const handleAddResource = () => {
    if (!newResource.name) {
      alert("Please enter a name");
      return;
    }

    console.log("Adding resource:", newResource);

    const resourceObj = {
      id: Date.now(),
      name: newResource.name,
      kind: newResource.kind,
      type: newResource.kind === 'pdf' ? 'PDF Document' :
        newResource.kind === 'video' ? 'Video Link' : 'Web Resource'
    };

    const updatedRoadmap = roadmap.map(item =>
      item.id === currentModuleId
        ? { ...item, resources: [...(item.resources || []), resourceObj] }
        : item
    );

    // Update both states
    setRoadmap(updatedRoadmap);
    setAllRoadmapData(prev => ({
      ...prev,
      [selectedSkill]: updatedRoadmap
    }));

    // Reset modal
    setShowResourceModal(false);
    setNewResource({ name: '', kind: 'pdf', url: '' });
    
    console.log("Resource added!");
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
        {/* Skill Header */}
        <div style={styles.skillHeader}>
          <h2 style={styles.skillTitle}>
            {selectedSkill === 'REACT-101' ? 'React Mastery Workshop' :
             selectedSkill === 'WEB-201' ? 'HTML & CSS Fundamentals' :
             selectedSkill === 'JS-301' ? 'JavaScript Deep Dive' :
             selectedSkill === 'NODE-401' ? 'Node.js Backend Development' :
             selectedSkill === 'DESIGN-501' ? 'UI/UX Design Principles' : selectedSkill}
          </h2>
          <div style={styles.skillInfo}>
            <span style={styles.skillCode}>{selectedSkill}</span>
            <span style={styles.moduleCount}>{roadmap.length} Module{roadmap.length !== 1 ? 's' : ''}</span>
            <span style={styles.draftCount}>
              {roadmap.filter(m => m.status === 'draft').length} Draft{roadmap.filter(m => m.status === 'draft').length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        <div style={styles.contentList}>
          {roadmap.length === 0 ? (
            <div style={styles.emptyState}>
              <h3 style={{ color: '#6B7280', marginBottom: '12px' }}>No modules yet</h3>
              <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>
                Click "Add Day / Module" to create your first module for {selectedSkill}
              </p>
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
                    <div style={styles.draftCard}>
                      <div style={styles.headerInfo}>
                        <div style={styles.draftBadge}>DAY {module.day}</div>
                        <h3 style={styles.draftTitle}>{module.title}</h3>
                      </div>
                      <button 
                        style={styles.setupBtn} 
                        onClick={() => setupDraft(module.id)}
                      >
                        Setup Content
                      </button>
                    </div>
                  ) : module.status === 'editing' || module.status === 'published' ? (
                    <>
                      <div style={styles.cardHeader}>
                        <div style={styles.headerInfo}>
                          <div style={styles.dayBadge}>DAY {module.day}</div>
                          {editingId === module.id ? (
                            <input
                              style={styles.titleInput}
                              value={editData.title}
                              onChange={e => setEditData({ ...editData, title: e.target.value })}
                              placeholder="Enter module title..."
                            />
                          ) : (
                            <h3 style={styles.cardTitle}>{module.title}</h3>
                          )}
                        </div>
                        <div style={styles.headerActions}>
                          {editingId === module.id ? (
                            <>
                              <button onClick={() => saveEdit(module.id)} style={styles.saveBtn}>
                                Save
                              </button>
                              <button onClick={() => cancelEdit(module.id)} style={styles.cancelBtn}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button onClick={() => startEdit(module)} style={styles.iconBtn}>
                              <Pencil size={18} />
                            </button>
                          )}
                          <button onClick={() => deleteDay(module.id)} style={styles.iconBtnRed}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div style={styles.cardBody}>
                        {editingId === module.id ? (
                          <textarea
                            style={styles.textArea}
                            value={editData.description}
                            onChange={e => setEditData({ ...editData, description: e.target.value })}
                            placeholder="Enter module description..."
                          />
                        ) : (
                          <p style={styles.description}>{module.description}</p>
                        )}

                        {module.resources && module.resources.length > 0 && (
                          <div style={styles.resourceList}>
                            {module.resources.map(res => (
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
                                {res.kind === 'pdf' ? 
                                  <Download size={18} style={styles.cursor} color="#9CA3AF" /> : 
                                  <ExternalLink size={18} style={styles.cursor} color="#9CA3AF" />
                                }
                              </div>
                            ))}
                          </div>
                        )}

                        <button 
                          style={styles.addResourceBtn} 
                          onClick={() => handleOpenResourceModal(module.id)}
                        >
                          <PlusCircle size={18} />
                          <span>Add Resource or File</span>
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </React.Fragment>
            ))
          )}
          
          {/* Add another day button */}
          {roadmap.length > 0 && (
            <div style={styles.addAnotherContainer}>
              <button style={styles.addAnotherBtn} onClick={handleAddDay}>
                <PlusCircle size={18} />
                <span>Add Another Day</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RESOURCE MODAL */}
      {showResourceModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>Add Resource</h3>
              <X style={styles.cursor} onClick={() => setShowResourceModal(false)} />
            </div>

            <div style={styles.modalBody}>
              <label style={styles.label}>Resource Title</label>
              <input
                style={styles.input}
                placeholder="e.g. Lecture Notes or Tutorial Video"
                value={newResource.name}
                onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
              />

              <label style={styles.label}>Type</label>
              <div style={styles.typeGrid}>
                <button
                  onClick={() => setNewResource({ ...newResource, kind: 'pdf' })}
                  style={newResource.kind === 'pdf' ? styles.activeType : styles.typeBtn}>
                  <FileText size={18} /> PDF
                </button>
                <button
                  onClick={() => setNewResource({ ...newResource, kind: 'video' })}
                  style={newResource.kind === 'video' ? styles.activeType : styles.typeBtn}>
                  <Youtube size={18} /> Video
                </button>
                <button
                  onClick={() => setNewResource({ ...newResource, kind: 'link' })}
                  style={newResource.kind === 'link' ? styles.activeType : styles.typeBtn}>
                  <LinkIcon size={18} /> Link
                </button>
              </div>

              <label style={styles.label}>
                {newResource.kind === 'pdf' ? 'Upload File' : 'Resource URL'}
              </label>
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
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                />
              )}
            </div>

            <div style={styles.modalFooter}>
              <button 
                style={styles.cancelBtnModal} 
                onClick={() => setShowResourceModal(false)}
              >
                Cancel
              </button>
              <button 
                style={styles.confirmBtn} 
                onClick={handleAddResource}
              >
                Add Resource
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
    backgroundColor: '#F8F9FB', 
    minHeight: 'calc(100vh - 120px)', 
    fontFamily: '"Inter", sans-serif' 
  },
  container: { 
    width: '100%', 
    maxWidth: '1400px', 
    margin: '0 auto', 
    padding: '20px' 
  },
  skillHeader: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #E5E7EB'
  },
  skillTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px 0'
  },
  skillInfo: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  skillCode: {
    backgroundColor: '#0066FF',
    color: '#FFFFFF',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '600'
  },
  moduleCount: {
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: '500'
  },
  draftCount: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500'
  },
  contentList: { 
    display: 'flex', 
    flexDirection: 'column' 
  },
  emptyState: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: '12px', 
    padding: '60px 40px', 
    textAlign: 'center', 
    border: '1px dashed #E5E7EB',
    marginTop: '20px'
  },
  addDayBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    backgroundColor: '#0066FF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#FFFFFF',
    cursor: 'pointer',
    margin: '0 auto'
  },
  addAnotherContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px dashed #E5E7EB'
  },
  addAnotherBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0066FF',
    cursor: 'pointer'
  },
  connector: { 
    width: '1px', 
    height: '24px', 
    backgroundColor: '#E5E7EB', 
    marginLeft: '32px' 
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: '12px', 
    border: '1px solid #E5E7EB', 
    overflow: 'hidden', 
    marginBottom: '16px' 
  },
  cardHeader: { 
    padding: '16px 20px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottom: '1px solid #F3F4F6' 
  },
  headerInfo: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    flex: 1 
  },
  dayBadge: { 
    backgroundColor: '#0066FF', 
    color: '#FFFFFF', 
    fontSize: '11px', 
    fontWeight: '700', 
    padding: '6px 10px', 
    borderRadius: '6px',
    minWidth: '60px',
    textAlign: 'center'
  },
  cardTitle: { 
    fontSize: '16px', 
    fontWeight: '600', 
    color: '#111827', 
    margin: 0 
  },
  titleInput: { 
    padding: '8px 12px', 
    borderRadius: '6px', 
    border: '1px solid #E5E7EB', 
    fontSize: '16px', 
    fontWeight: '600', 
    width: '70%',
    outline: 'none'
  },
  headerActions: { 
    display: 'flex', 
    gap: '8px' 
  },
  iconBtn: { 
    background: 'none', 
    border: 'none', 
    color: '#9CA3AF', 
    cursor: 'pointer', 
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconBtnRed: { 
    background: 'none', 
    border: 'none', 
    color: '#EF4444', 
    cursor: 'pointer', 
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveBtn: { 
    backgroundColor: '#10B981', 
    color: '#FFF', 
    border: 'none', 
    padding: '8px 16px', 
    borderRadius: '6px', 
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  cancelBtn: {
    backgroundColor: '#6B7280',
    color: '#FFF',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  cardBody: { 
    padding: '24px' 
  },
  textArea: { 
    width: '100%', 
    minHeight: '100px', 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #E5E7EB', 
    marginBottom: '16px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical'
  },
  description: { 
    fontSize: '14px', 
    color: '#6B7280', 
    margin: '0 0 20px 0', 
    lineHeight: 1.6 
  },
  resourceList: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '12px', 
    marginBottom: '16px' 
  },
  resourceItem: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '14px 16px', 
    borderRadius: '10px', 
    border: '1px solid #F3F4F6' 
  },
  resourceLeft: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '16px' 
  },
  resourceIconWrapper: { 
    width: '40px', 
    height: '40px', 
    backgroundColor: '#F9FAFB', 
    borderRadius: '8px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  resourceInfo: { 
    display: 'flex', 
    flexDirection: 'column' 
  },
  resName: { 
    fontSize: '14px', 
    fontWeight: '600', 
    color: '#374151' 
  },
  resMeta: { 
    fontSize: '12px', 
    color: '#9CA3AF' 
  },
  cursor: { 
    cursor: 'pointer' 
  },
  addResourceBtn: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '8px', 
    width: '100%', 
    padding: '14px', 
    backgroundColor: 'transparent', 
    border: '1px dashed #E5E7EB', 
    borderRadius: '10px', 
    color: '#6B7280', 
    fontSize: '14px', 
    fontWeight: '500', 
    cursor: 'pointer' 
  },
  draftCard: { 
    padding: '20px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  draftBadge: { 
    backgroundColor: '#9CA3AF', 
    color: '#FFFFFF', 
    fontSize: '11px', 
    fontWeight: '700', 
    padding: '6px 10px', 
    borderRadius: '6px',
    minWidth: '60px',
    textAlign: 'center'
  },
  draftTitle: { 
    fontSize: '15px', 
    color: '#6B7280', 
    margin: 0,
    fontStyle: 'italic'
  },
  setupBtn: { 
    padding: '10px 20px', 
    backgroundColor: '#0066FF', 
    color: '#FFFFFF', 
    border: 'none', 
    borderRadius: '8px', 
    fontSize: '14px', 
    fontWeight: '600', 
    cursor: 'pointer' 
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
    zIndex: 1000 
  },
  modalContent: { 
    backgroundColor: '#FFF', 
    borderRadius: '16px', 
    width: '450px', 
    padding: '24px', 
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' 
  },
  modalHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '24px' 
  },
  modalBody: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '16px' 
  },
  label: { 
    fontSize: '13px', 
    fontWeight: '600', 
    color: '#374151' 
  },
  input: { 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #E5E7EB', 
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  typeGrid: { 
    display: 'flex', 
    gap: '10px' 
  },
  typeBtn: { 
    flex: 1, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '8px', 
    padding: '10px', 
    border: '1px solid #E5E7EB', 
    borderRadius: '8px', 
    backgroundColor: '#FFF', 
    cursor: 'pointer', 
    fontSize: '13px' 
  },
  activeType: { 
    flex: 1, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '8px', 
    padding: '10px', 
    border: '1px solid #0066FF', 
    borderRadius: '8px', 
    backgroundColor: '#F0F7FF', 
    color: '#0066FF', 
    cursor: 'pointer', 
    fontSize: '13px', 
    fontWeight: '600' 
  },
  filePlaceholder: { 
    padding: '24px', 
    border: '2px dashed #E5E7EB', 
    borderRadius: '12px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: '8px', 
    color: '#6B7280', 
    fontSize: '14px' 
  },
  modalFooter: { 
    display: 'flex', 
    justifyContent: 'flex-end', 
    gap: '12px', 
    marginTop: '24px' 
  },
  cancelBtnModal: { 
    padding: '10px 16px', 
    border: '1px solid #E5E7EB', 
    borderRadius: '8px', 
    backgroundColor: '#FFF', 
    cursor: 'pointer',
    fontSize: '14px'
  },
  confirmBtn: { 
    padding: '10px 16px', 
    border: 'none', 
    borderRadius: '8px', 
    backgroundColor: '#0066FF', 
    color: '#FFF', 
    fontWeight: '600', 
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default StudyRoadmap;
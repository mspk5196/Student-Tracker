// import React, { useState, useEffect, useRef } from 'react';
// import {
//     Pencil, Trash2, FileText, Youtube, Download,
//     ExternalLink, PlusCircle, X, Link as LinkIcon, Upload
// } from 'lucide-react';

// const StudyRoadmap = ({ selectedSkill, isActiveTab, addDayTrigger }) => {
//     // --- ROADMAP DATA WITH MULTIPLE SKILLS ---
//     const ROADMAP_DATA = {
//         'REACT-101': [
//             {
//                 id: 1,
//                 day: 1,
//                 title: "React Fundamentals & JSX",
//                 description: "Introduction to React, understanding JSX, and creating your first components.",
//                 status: "published",
//                 resources: [
//                     { id: 101, name: "React_Official_Docs.pdf", type: "PDF Document", kind: "pdf", url: "https://react.dev/learn" },
//                     { id: 102, name: "JSX Tutorial Video", type: "Video Link", kind: "video", url: "https://www.youtube.com/watch?v=7fPXI_MnBOY" }
//                 ]
//             },
//             {
//                 id: 2,
//                 day: 2,
//                 title: "Components & Props",
//                 description: "Learn about React components, props, and component composition.",
//                 status: "published",
//                 resources: [
//                     { id: 103, name: "Components_Guide.pdf", type: "PDF Document", kind: "pdf", url: "https://react.dev/learn/your-first-component" }
//                 ]
//             }
//         ],
//         'WEB-201': [
//             {
//                 id: 3,
//                 day: 1,
//                 title: "HTML5 Semantic Elements",
//                 description: "Learn about modern HTML5 semantic tags and their importance.",
//                 status: "published",
//                 resources: [
//                     { id: 104, name: "HTML5_Cheatsheet.pdf", type: "PDF Document", kind: "pdf", url: "https://web.dev/learn/html/semantic-html" }
//                 ]
//             }
//         ],
//         'JS-301': [
//             {
//                 id: 4,
//                 day: 1,
//                 title: "JavaScript ES6+ Features",
//                 description: "Modern JavaScript features including arrow functions, destructuring, and modules.",
//                 status: "published",
//                 resources: [
//                     { id: 105, name: "ES6_Features.pdf", type: "PDF Document", kind: "pdf", url: "https://javascript.info/es-mod" },
//                     { id: 106, name: "Async JavaScript Video", type: "Video Link", kind: "video", url: "https://www.youtube.com/watch?v=vn3tkfPZf8w" }
//                 ]
//             }
//         ]
//     };

//     // State to manage all roadmap data
//     const [allRoadmapData, setAllRoadmapData] = useState(ROADMAP_DATA);
//     const [roadmap, setRoadmap] = useState([]);
//     const [editingId, setEditingId] = useState(null);
//     const [editData, setEditData] = useState({ title: '', description: '' });
//     const [lastAddDayTrigger, setLastAddDayTrigger] = useState(0);

//     // Resource Modal State
//     const [showResourceModal, setShowResourceModal] = useState(false);
//     const [currentModuleId, setCurrentModuleId] = useState(null);
//     const [newResource, setNewResource] = useState({
//         name: '',
//         kind: 'pdf',
//         url: ''
//     });
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [isDragging, setIsDragging] = useState(false);
//     const fileInputRef = useRef(null);

//     // Initialize roadmap for selected skill
//     useEffect(() => {
//         if (selectedSkill) {
//             const skillRoadmap = allRoadmapData[selectedSkill] || [];
//             setRoadmap(skillRoadmap);
//             setEditingId(null);
//         }
//     }, [selectedSkill, allRoadmapData]);

//     // Handle add day trigger from parent - FIXED
//     useEffect(() => {
//         console.log("Add day trigger effect running:", { addDayTrigger, lastAddDayTrigger, selectedSkill });

//         if (addDayTrigger > lastAddDayTrigger && selectedSkill) {
//             console.log("Triggering addDay...");
//             addDay();
//             setLastAddDayTrigger(addDayTrigger);
//         }
//     }, [addDayTrigger, selectedSkill, lastAddDayTrigger]);

//     /* ---------- DAY / MODULE HANDLERS ---------- */
//     const addDay = () => {
//         if (!selectedSkill) {
//             console.error("No skill selected!");
//             return;
//         }

//         console.log("Adding day for skill:", selectedSkill);

//         // Get current roadmap for this skill from state, not from allRoadmapData
//         console.log("Current roadmap from state:", roadmap);

//         // Calculate next day number based on existing modules
//         let nextDay;
//         if (roadmap.length === 0) {
//             nextDay = 1;
//         } else {
//             // Find the highest day number in current roadmap
//             const maxDay = Math.max(...roadmap.map(item => item.day));
//             nextDay = maxDay + 1;
//         }

//         console.log("Next day number:", nextDay);

//         const newDay = {
//             id: Date.now(),
//             day: nextDay,
//             title: `${selectedSkill} - Day ${nextDay}`,
//             description: 'Enter module description here...',
//             status: 'draft',
//             resources: []
//         };

//         console.log("New day object:", newDay);

//         // Create updated roadmap
//         const updatedRoadmap = [...roadmap, newDay];

//         // Update both states
//         setRoadmap(updatedRoadmap);
//         setAllRoadmapData(prev => ({
//             ...prev,
//             [selectedSkill]: updatedRoadmap
//         }));

//         console.log("Day added successfully! Total modules:", updatedRoadmap.length);
//     };

//     // Also provide a direct addDay function for the "Add First Module" button
//     const handleAddDay = () => {
//         console.log("Manual addDay triggered");
//         addDay();
//     };

//     const setupDraft = (id) => {
//         console.log("Setting up draft with ID:", id);

//         // Find the draft module
//         const draftModule = roadmap.find(r => r.id === id);
//         if (!draftModule) {
//             console.error("Draft module not found!");
//             return;
//         }

//         console.log("Found draft module:", draftModule);

//         // Set editing state to show the full edit UI
//         setEditingId(id);
//         setEditData({
//             title: draftModule.title,
//             description: draftModule.description || 'Enter module description here...'
//         });

//         // Change status to 'editing' so it shows the full UI
//         const updatedRoadmap = roadmap.map(item =>
//             item.id === id ? { ...item, status: 'editing' } : item
//         );

//         setRoadmap(updatedRoadmap);
//         setAllRoadmapData(prev => ({
//             ...prev,
//             [selectedSkill]: updatedRoadmap
//         }));

//         console.log("Draft setup complete!");
//     };

//     const startEdit = (item) => {
//         console.log("Starting edit for:", item.id);
//         setEditingId(item.id);
//         setEditData({ title: item.title, description: item.description });
//     };

//     const saveEdit = (id) => {
//         console.log("Saving edit for:", id);

//         const updatedRoadmap = roadmap.map(item =>
//             item.id === id ? {
//                 ...item,
//                 title: editData.title,
//                 description: editData.description,
//                 status: 'published'
//             } : item
//         );

//         // Update both states
//         setRoadmap(updatedRoadmap);
//         setAllRoadmapData(prev => ({
//             ...prev,
//             [selectedSkill]: updatedRoadmap
//         }));

//         setEditingId(null);
//         console.log("Edit saved!");
//     };

//     const cancelEdit = (id) => {
//         console.log("Canceling edit for:", id);

//         const updatedRoadmap = roadmap.map(item =>
//             item.id === id ? { ...item, status: 'draft' } : item
//         );

//         // Update both states
//         setRoadmap(updatedRoadmap);
//         setAllRoadmapData(prev => ({
//             ...prev,
//             [selectedSkill]: updatedRoadmap
//         }));

//         setEditingId(null);
//         console.log("Edit canceled!");
//     };

//     const deleteDay = (id) => {
//         console.log("Deleting day:", id);

//         const updatedRoadmap = roadmap.filter(item => item.id !== id);

//         // Update both states
//         setRoadmap(updatedRoadmap);
//         setAllRoadmapData(prev => ({
//             ...prev,
//             [selectedSkill]: updatedRoadmap
//         }));

//         console.log("Day deleted!");
//     };

//     /* ---------- ENHANCED FILE UPLOAD HANDLERS ---------- */
//     const handleFileSelect = () => {
//         fileInputRef.current.click();
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Check if file is PDF
//             if (file.type === 'application/pdf') {
//                 setSelectedFile(file);
//                 // Auto-fill resource name from filename
//                 const fileNameWithoutExt = file.name.replace('.pdf', '');
//                 setNewResource(prev => ({
//                     ...prev,
//                     name: prev.name || fileNameWithoutExt
//                 }));
//             } else {
//                 alert('Please select a PDF file');
//             }
//         }
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setIsDragging(true);
//     };

//     const handleDragLeave = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setIsDragging(false);
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setIsDragging(false);

//         const files = e.dataTransfer.files;
//         if (files.length > 0) {
//             const file = files[0];
//             if (file.type === 'application/pdf') {
//                 setSelectedFile(file);
//                 // Auto-fill resource name from filename
//                 const fileNameWithoutExt = file.name.replace('.pdf', '');
//                 setNewResource(prev => ({
//                     ...prev,
//                     name: prev.name || fileNameWithoutExt
//                 }));
//             } else {
//                 alert('Please drop a PDF file');
//             }
//         }
//     };

//     const removeSelectedFile = () => {
//         setSelectedFile(null);
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     /* ---------- RESOURCE HANDLERS ---------- */
//     const handleOpenResourceModal = (moduleId) => {
//         console.log("Opening resource modal for module:", moduleId);
//         setCurrentModuleId(moduleId);
//         setShowResourceModal(true);
//         // Reset file state when opening modal
//         setSelectedFile(null);
//         setNewResource({ name: '', kind: 'pdf', url: '' });
//     };

//     const handleAddResource = () => {
//         if (!newResource.name) {
//             alert("Please enter a name");
//             return;
//         }

//         if (newResource.kind === 'pdf' && !selectedFile) {
//             alert("Please select a PDF file");
//             return;
//         }

//         console.log("Adding resource:", newResource);

//         const resourceObj = {
//             id: Date.now(),
//             name: newResource.name,
//             kind: newResource.kind,
//             type: newResource.kind === 'pdf' ? 'PDF Document' :
//                 newResource.kind === 'video' ? 'Video Link' : 'Web Resource',
//             // Create a temporary Blob URL for real file downloading
//             url: newResource.kind === 'pdf' && selectedFile ? URL.createObjectURL(selectedFile) : (newResource.url || ''),
//             filename: selectedFile ? selectedFile.name : null
//         };

//         const updatedRoadmap = roadmap.map(item =>
//             item.id === currentModuleId
//                 ? { ...item, resources: [...(item.resources || []), resourceObj] }
//                 : item
//         );

//         // Update both states
//         setRoadmap(updatedRoadmap);
//         setAllRoadmapData(prev => ({
//             ...prev,
//             [selectedSkill]: updatedRoadmap
//         }));

//         // Reset modal
//         setShowResourceModal(false);
//         setNewResource({ name: '', kind: 'pdf', url: '' });
//         setSelectedFile(null);

//         console.log("Resource added!");
//     };

//     const getResourceIcon = (kind) => {
//         switch (kind) {
//             case 'pdf': return <FileText size={20} color="#EF4444" />;
//             case 'video': return <Youtube size={20} color="#FF0000" />;
//             case 'link': return <LinkIcon size={20} color="#3B82F6" />;
//             default: return <FileText size={20} />;
//         }
//     };

//     const handleResourceAction = (res) => {
//         if (!res.url || res.url === '') {
//             alert("No URL available for this resource.");
//             return;
//         }

//         // Handle PDF downloads specifically
//         if (res.kind === 'pdf') {
//             const link = document.createElement('a');
//             link.href = res.url;
//             link.target = "_blank";
//             // Ensure filename has .pdf extension for the file manager
//             const fileName = res.name.toLowerCase().endsWith('.pdf') ? res.name : `${res.name}.pdf`;
//             link.download = fileName;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);

//             // Optional: Show success feedback
//             console.log(`Downloading ${fileName}...`);
//         } else {
//             // For videos and links, just opening in new tab is standard
//             window.open(res.url, '_blank');
//         }
//     };

//     return (
//         <div style={styles.pageWrapper}>
//             <div style={styles.container}>
//                 {/* Skill Header */}
//                 <div style={styles.skillHeader}>
//                     <h2 style={styles.skillTitle}>
//                         {selectedSkill === 'REACT-101' ? 'React Mastery Workshop' :
//                             selectedSkill === 'WEB-201' ? 'HTML & CSS Fundamentals' :
//                                 selectedSkill === 'JS-301' ? 'JavaScript Deep Dive' :
//                                     selectedSkill === 'NODE-401' ? 'Node.js Backend Development' :
//                                         selectedSkill === 'DESIGN-501' ? 'UI/UX Design Principles' : selectedSkill}
//                     </h2>
//                     <div style={styles.skillInfo}>
//                         <span style={styles.skillCode}>{selectedSkill}</span>
//                         <span style={styles.moduleCount}>{roadmap.length} Module{roadmap.length !== 1 ? 's' : ''}</span>
//                         <span style={styles.draftCount}>
//                             {roadmap.filter(m => m.status === 'draft').length} Draft{roadmap.filter(m => m.status === 'draft').length !== 1 ? 's' : ''}
//                         </span>
//                     </div>
//                 </div>

//                 <div style={styles.contentList}>
//                     {roadmap.length === 0 ? (
//                         <div style={styles.emptyState}>
//                             <h3 style={{ color: '#6B7280', marginBottom: '12px' }}>No modules yet</h3>
//                             <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>
//                                 Click "Add Day / Module" to create your first module for {selectedSkill}
//                             </p>
//                             <button style={styles.addDayBtn} onClick={handleAddDay}>
//                                 <PlusCircle size={18} />
//                                 <span>Add First Module</span>
//                             </button>
//                         </div>
//                     ) : (
//                         roadmap.map((module, index) => (
//                             <React.Fragment key={module.id}>
//                                 {index !== 0 && <div style={styles.connector} />}
//                                 <div style={styles.card}>
//                                     {module.status === 'draft' ? (
//                                         <div style={styles.draftCard}>
//                                             <div style={styles.headerInfo}>
//                                                 <div style={styles.draftBadge}>DAY {module.day}</div>
//                                                 <h3 style={styles.draftTitle}>{module.title}</h3>
//                                             </div>
//                                             <button
//                                                 style={styles.setupBtn}
//                                                 onClick={() => setupDraft(module.id)}
//                                             >
//                                                 Setup Content
//                                             </button>
//                                         </div>
//                                     ) : module.status === 'editing' || module.status === 'published' ? (
//                                         <>
//                                             <div style={styles.cardHeader}>
//                                                 <div style={styles.headerInfo}>
//                                                     <div style={styles.dayBadge}>DAY {module.day}</div>
//                                                     {editingId === module.id ? (
//                                                         <input
//                                                             style={styles.titleInput}
//                                                             value={editData.title}
//                                                             onChange={e => setEditData({ ...editData, title: e.target.value })}
//                                                             placeholder="Enter module title..."
//                                                         />
//                                                     ) : (
//                                                         <h3 style={styles.cardTitle}>{module.title}</h3>
//                                                     )}
//                                                 </div>
//                                                 <div style={styles.headerActions}>
//                                                     {editingId === module.id ? (
//                                                         <>
//                                                             <button onClick={() => saveEdit(module.id)} style={styles.saveBtn}>
//                                                                 Save
//                                                             </button>
//                                                             <button onClick={() => cancelEdit(module.id)} style={styles.cancelBtn}>
//                                                                 Cancel
//                                                             </button>
//                                                         </>
//                                                     ) : (
//                                                         <button onClick={() => startEdit(module)} style={styles.iconBtn}>
//                                                             <Pencil size={18} />
//                                                         </button>
//                                                     )}
//                                                     <button onClick={() => deleteDay(module.id)} style={styles.iconBtnRed}>
//                                                         <Trash2 size={18} />
//                                                     </button>
//                                                 </div>
//                                             </div>

//                                             <div style={styles.cardBody}>
//                                                 {editingId === module.id ? (
//                                                     <textarea
//                                                         style={styles.textArea}
//                                                         value={editData.description}
//                                                         onChange={e => setEditData({ ...editData, description: e.target.value })}
//                                                         placeholder="Enter module description..."
//                                                     />
//                                                 ) : (
//                                                     <p style={styles.description}>{module.description}</p>
//                                                 )}

//                                                 {module.resources && module.resources.length > 0 && (
//                                                     <div style={styles.resourceList}>
//                                                         {module.resources.map(res => (
//                                                             <div key={res.id} style={styles.resourceItem}>
//                                                                 <div style={styles.resourceLeft}>
//                                                                     <div style={styles.resourceIconWrapper}>
//                                                                         {getResourceIcon(res.kind)}
//                                                                     </div>
//                                                                     <div style={styles.resourceInfo}>
//                                                                         <span style={styles.resName}>{res.name}</span>
//                                                                         <span style={styles.resMeta}>{res.type}</span>
//                                                                     </div>
//                                                                 </div>
//                                                                 {res.kind === 'pdf' ? (
//                                                                     <Download
//                                                                         size={18}
//                                                                         style={styles.cursor}
//                                                                         color="#0066FF"
//                                                                         onClick={(e) => { e.stopPropagation(); handleResourceAction(res); }}
//                                                                     />
//                                                                 ) : (
//                                                                     <ExternalLink
//                                                                         size={18}
//                                                                         style={styles.cursor}
//                                                                         color="#0066FF"
//                                                                         onClick={(e) => { e.stopPropagation(); handleResourceAction(res); }}
//                                                                     />
//                                                                 )}
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 )}

//                                                 <button
//                                                     style={styles.addResourceBtn}
//                                                     onClick={() => handleOpenResourceModal(module.id)}
//                                                 >
//                                                     <PlusCircle size={18} />
//                                                     <span>Add Resource or File</span>
//                                                 </button>
//                                             </div>
//                                         </>
//                                     ) : null}
//                                 </div>
//                             </React.Fragment>
//                         ))
//                     )}

//                     {/* Add another day button */}
//                     {roadmap.length > 0 && (
//                         <div style={styles.addAnotherContainer}>
//                             <button style={styles.addAnotherBtn} onClick={handleAddDay}>
//                                 <PlusCircle size={18} />
//                                 <span>Add Another Day</span>
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* RESOURCE MODAL */}
//             {showResourceModal && (
//                 <div style={styles.modalOverlay}>
//                     <div style={styles.modalContent}>
//                         <div style={styles.modalHeader}>
//                             <h3 style={{ margin: 0 }}>Add Resource</h3>
//                             <X style={styles.cursor} onClick={() => setShowResourceModal(false)} />
//                         </div>

//                         <div style={styles.modalBody}>
//                             <label style={styles.label}>Resource Title</label>
//                             <input
//                                 style={styles.input}
//                                 placeholder="e.g. Lecture Notes or Tutorial Video"
//                                 value={newResource.name}
//                                 onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
//                             />

//                             <label style={styles.label}>Type</label>
//                             <div style={styles.typeGrid}>
//                                 <button
//                                     onClick={() => setNewResource({ ...newResource, kind: 'pdf' })}
//                                     style={newResource.kind === 'pdf' ? styles.activeType : styles.typeBtn}>
//                                     <FileText size={18} /> PDF
//                                 </button>
//                                 <button
//                                     onClick={() => setNewResource({ ...newResource, kind: 'video' })}
//                                     style={newResource.kind === 'video' ? styles.activeType : styles.typeBtn}>
//                                     <Youtube size={18} /> Video
//                                 </button>
//                                 <button
//                                     onClick={() => setNewResource({ ...newResource, kind: 'link' })}
//                                     style={newResource.kind === 'link' ? styles.activeType : styles.typeBtn}>
//                                     <LinkIcon size={18} /> Link
//                                 </button>
//                             </div>

//                             <label style={styles.label}>
//                                 {newResource.kind === 'pdf' ? 'Upload File' : 'Resource URL'}
//                             </label>

//                             {newResource.kind === 'pdf' ? (
//                                 <>
//                                     {/* Hidden file input */}
//                                     <input
//                                         type="file"
//                                         ref={fileInputRef}
//                                         style={{ display: 'none' }}
//                                         accept=".pdf,application/pdf"
//                                         onChange={handleFileChange}
//                                     />

//                                     {/* Drag and drop area */}
//                                     <div
//                                         style={{
//                                             ...styles.filePlaceholder,
//                                             borderColor: isDragging ? '#0066FF' : '#E5E7EB',
//                                             backgroundColor: isDragging ? '#F0F7FF' : '#FFFFFF',
//                                             borderStyle: selectedFile ? 'solid' : 'dashed'
//                                         }}
//                                         onDragOver={handleDragOver}
//                                         onDragLeave={handleDragLeave}
//                                         onDrop={handleDrop}
//                                         onClick={handleFileSelect}
//                                     >
//                                         {selectedFile ? (
//                                             <div style={styles.filePreview}>
//                                                 <FileText size={24} color="#0066FF" />
//                                                 <div style={{ flex: 1, minWidth: 0 }}>
//                                                     <p style={{ margin: 0, fontWeight: '600', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                                                         {selectedFile.name}
//                                                     </p>
//                                                     <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6B7280' }}>
//                                                         {(selectedFile.size / 1024).toFixed(2)} KB
//                                                     </p>
//                                                 </div>
//                                                 <button
//                                                     type="button"
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         removeSelectedFile();
//                                                     }}
//                                                     style={{
//                                                         background: 'none',
//                                                         border: 'none',
//                                                         color: '#EF4444',
//                                                         cursor: 'pointer',
//                                                         padding: '4px'
//                                                     }}
//                                                 >
//                                                     <X size={18} />
//                                                 </button>
//                                             </div>
//                                         ) : (
//                                             <>
//                                                 <Upload size={20} />
//                                                 <span>Drag & drop a PDF file here or click to browse</span>
//                                                 <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '8px 0 0 0' }}>
//                                                     Only PDF files are accepted
//                                                 </p>
//                                             </>
//                                         )}
//                                     </div>

//                                     {/* Browse button (alternative to clicking the area) */}
//                                     {!selectedFile && (
//                                         <button
//                                             type="button"
//                                             onClick={handleFileSelect}
//                                             style={{
//                                                 marginTop: '8px',
//                                                 padding: '8px 16px',
//                                                 backgroundColor: '#F3F4F6',
//                                                 border: '1px solid #E5E7EB',
//                                                 borderRadius: '6px',
//                                                 cursor: 'pointer',
//                                                 fontSize: '14px',
//                                                 color: '#374151'
//                                             }}
//                                         >
//                                             Browse Files
//                                         </button>
//                                     )}
//                                 </>
//                             ) : (
//                                 <input
//                                     style={styles.input}
//                                     placeholder="Enter URL"
//                                     value={newResource.url}
//                                     onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
//                                 />
//                             )}
//                         </div>

//                         <div style={styles.modalFooter}>
//                             <button
//                                 style={styles.cancelBtnModal}
//                                 onClick={() => setShowResourceModal(false)}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 style={styles.confirmBtn}
//                                 onClick={handleAddResource}
//                             >
//                                 Add Resource
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// const styles = {
//     pageWrapper: {
//         backgroundColor: '#F8F9FB',
//         fontFamily: '"Inter", sans-serif'
//     },
//     container: {
//         width: '100%',
//         padding: '10px 5px'
//     },
//     skillHeader: {
//         marginBottom: '15px',
//         paddingBottom: '10px',
//         borderBottom: '1px solid #E5E7EB'
//     },
//     skillTitle: {
//         fontSize: '24px',
//         fontWeight: '700',
//         color: '#111827',
//         margin: '0 0 8px 0'
//     },
//     skillInfo: {
//         display: 'flex',
//         gap: '16px',
//         alignItems: 'center'
//     },
//     skillCode: {
//         backgroundColor: '#0066FF',
//         color: '#FFFFFF',
//         padding: '4px 12px',
//         borderRadius: '16px',
//         fontSize: '14px',
//         fontWeight: '600'
//     },
//     moduleCount: {
//         color: '#6B7280',
//         fontSize: '14px',
//         fontWeight: '500'
//     },
//     draftCount: {
//         backgroundColor: '#FEF3C7',
//         color: '#92400E',
//         padding: '4px 12px',
//         borderRadius: '16px',
//         fontSize: '14px',
//         fontWeight: '500'
//     },
//     contentList: {
//         display: 'flex',
//         flexDirection: 'column'
//     },
//     emptyState: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: '12px',
//         padding: '60px 40px',
//         textAlign: 'center',
//         border: '1px dashed #E5E7EB',
//         marginTop: '20px'
//     },
//     addDayBtn: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '8px',
//         padding: '10px 18px',
//         backgroundColor: '#0066FF',
//         border: 'none',
//         borderRadius: '8px',
//         fontSize: '14px',
//         fontWeight: '600',
//         color: '#FFFFFF',
//         cursor: 'pointer',
//         margin: '0 auto'
//     },
//     addAnotherContainer: {
//         display: 'flex',
//         justifyContent: 'center',
//         marginTop: '24px',
//         paddingTop: '24px',
//         borderTop: '1px dashed #E5E7EB'
//     },
//     addAnotherBtn: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '8px',
//         padding: '10px 18px',
//         backgroundColor: '#FFFFFF',
//         border: '1px solid #E5E7EB',
//         borderRadius: '8px',
//         fontSize: '14px',
//         fontWeight: '600',
//         color: '#0066FF',
//         cursor: 'pointer'
//     },
//     connector: {
//         width: '3px',
//         height: '32px',
//         backgroundColor: '#0066FF',
//         marginLeft: '19px',
//         opacity: 0.2,
//         borderRadius: '3px'
//     },
//     card: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: '16px',
//         border: '1px solid #E5E7EB',
//         overflow: 'hidden',
//         marginBottom: '4px',
//         boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
//     },
//     cardHeader: {
//         padding: '16px 20px',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         borderBottom: '1px solid #F3F4F6'
//     },
//     headerInfo: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '12px',
//         flex: 1
//     },
//     dayBadge: {
//         backgroundColor: '#0066FF',
//         color: '#FFFFFF',
//         fontSize: '11px',
//         fontWeight: '800',
//         width: '40px',
//         height: '40px',
//         borderRadius: '50%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         boxShadow: '0 4px 6px -1px rgba(0, 102, 255, 0.2)',
//         flexShrink: 0
//     },
//     cardTitle: {
//         fontSize: '16px',
//         fontWeight: '600',
//         color: '#111827',
//         margin: 0
//     },
//     titleInput: {
//         padding: '8px 12px',
//         borderRadius: '6px',
//         border: '1px solid #E5E7EB',
//         fontSize: '16px',
//         fontWeight: '600',
//         width: '70%',
//         outline: 'none'
//     },
//     headerActions: {
//         display: 'flex',
//         gap: '8px'
//     },
//     iconBtn: {
//         background: 'none',
//         border: 'none',
//         color: '#9CA3AF',
//         cursor: 'pointer',
//         padding: '8px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     iconBtnRed: {
//         background: 'none',
//         border: 'none',
//         color: '#EF4444',
//         cursor: 'pointer',
//         padding: '8px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     saveBtn: {
//         backgroundColor: '#10B981',
//         color: '#FFF',
//         border: 'none',
//         padding: '8px 16px',
//         borderRadius: '6px',
//         cursor: 'pointer',
//         fontSize: '14px',
//         fontWeight: '600'
//     },
//     cancelBtn: {
//         backgroundColor: '#6B7280',
//         color: '#FFF',
//         border: 'none',
//         padding: '8px 16px',
//         borderRadius: '6px',
//         cursor: 'pointer',
//         fontSize: '14px',
//         fontWeight: '600'
//     },
//     cardBody: {
//         padding: '24px'
//     },
//     textArea: {
//         width: '100%',
//         minHeight: '100px',
//         padding: '12px',
//         borderRadius: '8px',
//         border: '1px solid #E5E7EB',
//         marginBottom: '16px',
//         fontSize: '14px',
//         fontFamily: 'inherit',
//         outline: 'none',
//         resize: 'vertical'
//     },
//     description: {
//         fontSize: '14px',
//         color: '#6B7280',
//         margin: '0 0 20px 0',
//         lineHeight: 1.6
//     },
//     resourceList: {
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '12px',
//         marginBottom: '16px'
//     },
//     resourceItem: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: '14px 16px',
//         borderRadius: '10px',
//         border: '1px solid #F3F4F6'
//     },
//     resourceLeft: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '16px'
//     },
//     resourceIconWrapper: {
//         width: '40px',
//         height: '40px',
//         backgroundColor: '#F9FAFB',
//         borderRadius: '8px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     resourceInfo: {
//         display: 'flex',
//         flexDirection: 'column'
//     },
//     resName: {
//         fontSize: '14px',
//         fontWeight: '600',
//         color: '#374151'
//     },
//     resMeta: {
//         fontSize: '12px',
//         color: '#9CA3AF'
//     },
//     cursor: {
//         cursor: 'pointer'
//     },
//     addResourceBtn: {
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: '8px',
//         width: '100%',
//         padding: '14px',
//         backgroundColor: 'transparent',
//         border: '1px dashed #E5E7EB',
//         borderRadius: '10px',
//         color: '#6B7280',
//         fontSize: '14px',
//         fontWeight: '500',
//         cursor: 'pointer'
//     },
//     draftCard: {
//         padding: '20px',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//     },
//     draftBadge: {
//         backgroundColor: '#9CA3AF',
//         color: '#FFFFFF',
//         fontSize: '11px',
//         fontWeight: '800',
//         width: '40px',
//         height: '40px',
//         borderRadius: '50%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexShrink: 0
//     },
//     draftTitle: {
//         fontSize: '15px',
//         color: '#6B7280',
//         margin: 0,
//         fontStyle: 'italic'
//     },
//     setupBtn: {
//         padding: '10px 20px',
//         backgroundColor: '#0066FF',
//         color: '#FFFFFF',
//         border: 'none',
//         borderRadius: '8px',
//         fontSize: '14px',
//         fontWeight: '600',
//         cursor: 'pointer'
//     },
//     modalOverlay: {
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 1000
//     },
//     modalContent: {
//         backgroundColor: '#FFF',
//         borderRadius: '16px',
//         width: '450px',
//         padding: '24px',
//         boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
//     },
//     modalHeader: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '24px'
//     },
//     modalBody: {
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '16px'
//     },
//     label: {
//         fontSize: '13px',
//         fontWeight: '600',
//         color: '#374151'
//     },
//     input: {
//         padding: '12px',
//         borderRadius: '8px',
//         border: '1px solid #E5E7EB',
//         outline: 'none',
//         fontSize: '14px',
//         fontFamily: 'inherit'
//     },
//     typeGrid: {
//         display: 'flex',
//         gap: '10px'
//     },
//     typeBtn: {
//         flex: 1,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: '8px',
//         padding: '10px',
//         border: '1px solid #E5E7EB',
//         borderRadius: '8px',
//         backgroundColor: '#FFF',
//         cursor: 'pointer',
//         fontSize: '13px'
//     },
//     activeType: {
//         flex: 1,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: '8px',
//         padding: '10px',
//         border: '1px solid #0066FF',
//         borderRadius: '8px',
//         backgroundColor: '#F0F7FF',
//         color: '#0066FF',
//         cursor: 'pointer',
//         fontSize: '13px',
//         fontWeight: '600'
//     },
//     filePlaceholder: {
//         padding: '24px',
//         border: '2px dashed #E5E7EB',
//         borderRadius: '12px',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: '8px',
//         color: '#6B7280',
//         fontSize: '14px',
//         cursor: 'pointer',
//         transition: 'all 0.2s ease',
//         minHeight: '120px',
//         justifyContent: 'center'
//     },
//     filePreview: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '12px',
//         width: '100%',
//         padding: '12px',
//         backgroundColor: '#F9FAFB',
//         borderRadius: '8px',
//         border: '1px solid #E5E7EB'
//     },
//     modalFooter: {
//         display: 'flex',
//         justifyContent: 'flex-end',
//         gap: '12px',
//         marginTop: '24px'
//     },
//     cancelBtnModal: {
//         padding: '10px 16px',
//         border: '1px solid #E5E7EB',
//         borderRadius: '8px',
//         backgroundColor: '#FFF',
//         cursor: 'pointer',
//         fontSize: '14px'
//     },
//     confirmBtn: {
//         padding: '10px 16px',
//         border: 'none',
//         borderRadius: '8px',
//         backgroundColor: '#0066FF',
//         color: '#FFF',
//         fontWeight: '600',
//         cursor: 'pointer',
//         fontSize: '14px'
//     }
// };

// export default StudyRoadmap;


import React, { useState, useEffect, useRef } from 'react';
import {
    Pencil, Trash2, FileText, Youtube, Download,
    ExternalLink, PlusCircle, X, Link as LinkIcon, Upload
} from 'lucide-react';
import useAuthStore from '../../../../../store/useAuthStore';

const StudyRoadmap = ({ 
    selectedVenueId, 
    venueName, 
    venues, 
    isActiveTab, 
    addDayTrigger 
}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { token, user } = useAuthStore();
    
    const [roadmap, setRoadmap] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ title: '', description: '' });
    const [lastAddDayTrigger, setLastAddDayTrigger] = useState(0);
    const [loading, setLoading] = useState(false);
    const [facultyId, setFacultyId] = useState(null);

    // Resource Modal State
    const [showResourceModal, setShowResourceModal] = useState(false);
    const [currentModuleId, setCurrentModuleId] = useState(null);
    const [newResource, setNewResource] = useState({
        name: '',
        kind: 'pdf',
        url: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Get faculty ID from user data
    useEffect(() => {
        if (user && user.faculty_id) {
            setFacultyId(user.faculty_id);
        } else if (user && user.user_id) {
            // Fallback to user_id if faculty_id not in store
            setFacultyId(user.user_id);
        }
    }, [user]);

    // Fetch roadmap data for selected venue
    useEffect(() => {
        const fetchRoadmapData = async () => {
            if (!selectedVenueId || !facultyId) return;

            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/roadmap/${selectedVenueId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                console.log('Roadmap API Response:', data);
                
                if (data.success) {
                    setRoadmap(data.data);
                } else {
                    console.error('Failed to fetch roadmap:', data.message);
                    setRoadmap([]);
                }
            } catch (error) {
                console.error('Error fetching roadmap:', error);
                setRoadmap([]);
            } finally {
                setLoading(false);
            }
        };

        if (selectedVenueId && isActiveTab) {
            fetchRoadmapData();
            setEditingId(null);
        }
    }, [selectedVenueId, facultyId, token, API_URL, isActiveTab]);

    // Handle add day trigger from parent
    useEffect(() => {
        if (addDayTrigger > lastAddDayTrigger && selectedVenueId && facultyId && isActiveTab) {
            addDay();
            setLastAddDayTrigger(addDayTrigger);
        }
    }, [addDayTrigger, selectedVenueId, facultyId, lastAddDayTrigger, isActiveTab]);

    /* ---------- DAY / MODULE HANDLERS ---------- */
    const addDay = async () => {
        if (!selectedVenueId || !facultyId) {
            console.error("No venue selected or faculty ID missing!");
            alert('Please select a venue first');
            return;
        }

        try {
            // Calculate next day number
            let nextDay = 1;
            if (roadmap.length > 0) {
                const maxDay = Math.max(...roadmap.map(item => item.day));
                nextDay = maxDay + 1;
            }

            const newDay = {
                venue_id: selectedVenueId,
                faculty_id: facultyId,
                day: nextDay,
                title: `${venueName} - Day ${nextDay}`,
                description: 'Enter module description here...',
                status: 'draft'
            };

            console.log('Adding day:', newDay);

            // Send to backend
            const response = await fetch(`${API_URL}/roadmap`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDay)
            });

            const data = await response.json();
            console.log('Add day response:', data);
            
            if (data.success) {
                // Create local object with the returned ID
                const newModule = {
                    ...newDay,
                    roadmap_id: data.data.roadmap_id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    resources: []
                };

                const updatedRoadmap = [...roadmap, newModule];
                setRoadmap(updatedRoadmap);
                console.log("Day added successfully!");
            } else {
                alert('Failed to add day: ' + data.message);
            }
        } catch (error) {
            console.error('Error adding day:', error);
            alert('Failed to add day: ' + error.message);
        }
    };

    const handleAddDay = () => {
        addDay();
    };

    const setupDraft = (id) => {
        const draftModule = roadmap.find(r => r.roadmap_id === id);
        if (!draftModule) {
            alert('Module not found');
            return;
        }

        setEditingId(id);
        setEditData({
            title: draftModule.title,
            description: draftModule.description || 'Enter module description here...'
        });

        // Update status locally to 'editing'
        const updatedRoadmap = roadmap.map(item =>
            item.roadmap_id === id ? { ...item, status: 'editing' } : item
        );
        setRoadmap(updatedRoadmap);
    };

    const startEdit = (item) => {
        setEditingId(item.roadmap_id);
        setEditData({ title: item.title, description: item.description });
    };

    const saveEdit = async (id) => {
        try {
            const response = await fetch(`${API_URL}/roadmap/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: editData.title,
                    description: editData.description,
                    status: 'published'
                })
            });

            const data = await response.json();
            console.log('Save edit response:', data);
            
            if (data.success) {
                const updatedRoadmap = roadmap.map(item =>
                    item.roadmap_id === id ? {
                        ...item,
                        title: editData.title,
                        description: editData.description,
                        status: 'published'
                    } : item
                );

                setRoadmap(updatedRoadmap);
                setEditingId(null);
                alert('Module saved successfully!');
            } else {
                alert('Failed to save: ' + data.message);
            }
        } catch (error) {
            console.error('Error saving edit:', error);
            alert('Failed to save: ' + error.message);
        }
    };

    const cancelEdit = (id) => {
        const updatedRoadmap = roadmap.map(item =>
            item.roadmap_id === id ? { ...item, status: 'draft' } : item
        );
        setRoadmap(updatedRoadmap);
        setEditingId(null);
    };

    const deleteDay = async (id) => {
        if (!window.confirm('Are you sure you want to delete this module? This will also delete all associated resources.')) return;

        try {
            const response = await fetch(`${API_URL}/roadmap/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            console.log('Delete response:', data);
            
            if (data.success) {
                const updatedRoadmap = roadmap.filter(item => item.roadmap_id !== id);
                setRoadmap(updatedRoadmap);
                alert('Module deleted successfully!');
            } else {
                alert('Failed to delete: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting day:', error);
            alert('Failed to delete: ' + error.message);
        }
    };

    /* ---------- FILE UPLOAD HANDLERS ---------- */
    const handleFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type === 'application/pdf') {
                setSelectedFile(file);
                const fileNameWithoutExt = file.name.replace('.pdf', '');
                setNewResource(prev => ({
                    ...prev,
                    name: prev.name || fileNameWithoutExt
                }));
            } else {
                alert('Please select a PDF file');
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/pdf') {
                setSelectedFile(file);
                const fileNameWithoutExt = file.name.replace('.pdf', '');
                setNewResource(prev => ({
                    ...prev,
                    name: prev.name || fileNameWithoutExt
                }));
            } else {
                alert('Please drop a PDF file');
            }
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    /* ---------- RESOURCE HANDLERS ---------- */
    const handleOpenResourceModal = (moduleId) => {
        setCurrentModuleId(moduleId);
        setShowResourceModal(true);
        setSelectedFile(null);
        setNewResource({ name: '', kind: 'pdf', url: '' });
    };

    const handleAddResource = async () => {
        if (!newResource.name.trim()) {
            alert("Please enter a resource name");
            return;
        }

        if (newResource.kind === 'pdf' && !selectedFile) {
            alert("Please select a PDF file");
            return;
        }

        if (newResource.kind !== 'pdf' && !newResource.url.trim()) {
            alert("Please enter a URL");
            return;
        }

        try {
            let formData = new FormData();
            formData.append('roadmap_id', currentModuleId);
            formData.append('resource_name', newResource.name.trim());
            formData.append('resource_type', newResource.kind);
            
            if (newResource.kind === 'pdf' && selectedFile) {
                formData.append('file', selectedFile);
            } else {
                formData.append('resource_url', newResource.url.trim());
            }

            console.log('Adding resource:', {
                roadmap_id: currentModuleId,
                resource_name: newResource.name,
                resource_type: newResource.kind,
                hasFile: !!selectedFile
            });

            const response = await fetch(`${API_URL}/roadmap/resources`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            console.log('Add resource response:', data);
            
            if (data.success) {
                // Find the module and update its resources
                const updatedRoadmap = roadmap.map(item => {
                    if (item.roadmap_id === currentModuleId) {
                        const newResourceObj = {
                            resource_id: data.data.resource_id,
                            resource_name: newResource.name.trim(),
                            resource_type: newResource.kind,
                            resource_url: newResource.kind === 'pdf' ? null : newResource.url.trim(),
                            file_path: newResource.kind === 'pdf' ? data.data.file_path : null,
                            file_size: selectedFile?.size || null,
                            uploaded_at: new Date().toISOString()
                        };
                        return {
                            ...item,
                            resources: [...(item.resources || []), newResourceObj]
                        };
                    }
                    return item;
                });

                setRoadmap(updatedRoadmap);

                // Reset modal
                setShowResourceModal(false);
                setNewResource({ name: '', kind: 'pdf', url: '' });
                setSelectedFile(null);
                
                alert('Resource added successfully!');
            } else {
                alert('Failed to add resource: ' + data.message);
            }
        } catch (error) {
            console.error('Error adding resource:', error);
            alert('Failed to add resource: ' + error.message);
        }
    };

    const getResourceIcon = (kind) => {
        switch (kind) {
            case 'pdf': return <FileText size={20} color="#EF4444" />;
            case 'video': return <Youtube size={20} color="#FF0000" />;
            case 'link': return <LinkIcon size={20} color="#3B82F6" />;
            default: return <FileText size={20} />;
        }
    };

    const handleResourceAction = async (res) => {
        if (res.resource_type === 'pdf' && res.file_path) {
            // Download PDF file
            try {
                const response = await fetch(`${API_URL}/roadmap/resources/${res.resource_id}/download`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = res.resource_name.toLowerCase().endsWith('.pdf') 
                        ? res.resource_name 
                        : `${res.resource_name}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                } else {
                    const errorData = await response.json();
                    alert('Failed to download file: ' + (errorData.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error downloading file:', error);
                alert('Failed to download file: ' + error.message);
            }
        } else if (res.resource_url) {
            // Open external URL
            window.open(res.resource_url, '_blank', 'noopener noreferrer');
        } else {
            alert("No URL available for this resource.");
        }
    };

    const deleteResource = async (resourceId, roadmapId, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this resource?')) return;

        try {
            const response = await fetch(`${API_URL}/roadmap/resources/${resourceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            console.log('Delete resource response:', data);
            
            if (data.success) {
                // Update local state
                const updatedRoadmap = roadmap.map(item => {
                    if (item.roadmap_id === roadmapId) {
                        return {
                            ...item,
                            resources: item.resources.filter(r => r.resource_id !== resourceId)
                        };
                    }
                    return item;
                });

                setRoadmap(updatedRoadmap);
                alert('Resource deleted successfully!');
            } else {
                alert('Failed to delete resource: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting resource:', error);
            alert('Failed to delete resource: ' + error.message);
        }
    };

    if (!selectedVenueId) {
        return (
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={styles.emptyState}>
                        <h3 style={{ color: '#6B7280', marginBottom: '12px' }}>Select a Venue</h3>
                        <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>
                            Please select a venue from the dropdown above to view or create a roadmap
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={styles.loadingState}>
                        <p>Loading roadmap...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                {/* Venue Header */}
                <div style={styles.skillHeader}>
                    <h2 style={styles.skillTitle}>
                        {venueName || `Venue ${selectedVenueId}`}
                    </h2>
                    <div style={styles.skillInfo}>
                        <span style={styles.skillCode}>Venue ID: {selectedVenueId}</span>
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
                                Click "Add First Module" to create your first module for {venueName}
                            </p>
                            <button style={styles.addDayBtn} onClick={handleAddDay}>
                                <PlusCircle size={18} />
                                <span>Add First Module</span>
                            </button>
                        </div>
                    ) : (
                        roadmap.map((module, index) => (
                            <React.Fragment key={module.roadmap_id}>
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
                                                onClick={() => setupDraft(module.roadmap_id)}
                                            >
                                                Setup Content
                                            </button>
                                        </div>
                                    ) : module.status === 'editing' || module.status === 'published' ? (
                                        <>
                                            <div style={styles.cardHeader}>
                                                <div style={styles.headerInfo}>
                                                    <div style={styles.dayBadge}>DAY {module.day}</div>
                                                    {editingId === module.roadmap_id ? (
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
                                                    {editingId === module.roadmap_id ? (
                                                        <>
                                                            <button onClick={() => saveEdit(module.roadmap_id)} style={styles.saveBtn}>
                                                                Save
                                                            </button>
                                                            <button onClick={() => cancelEdit(module.roadmap_id)} style={styles.cancelBtn}>
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => startEdit(module)} style={styles.iconBtn}>
                                                            <Pencil size={18} />
                                                        </button>
                                                    )}
                                                    <button onClick={() => deleteDay(module.roadmap_id)} style={styles.iconBtnRed}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div style={styles.cardBody}>
                                                {editingId === module.roadmap_id ? (
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
                                                            <div key={res.resource_id} style={styles.resourceItem}>
                                                                <div style={styles.resourceLeft}>
                                                                    <div style={styles.resourceIconWrapper}>
                                                                        {getResourceIcon(res.resource_type)}
                                                                    </div>
                                                                    <div style={styles.resourceInfo}>
                                                                        <span style={styles.resName}>{res.resource_name}</span>
                                                                        <span style={styles.resMeta}>{res.resource_type === 'pdf' ? 'PDF Document' : 
                                                                             res.resource_type === 'video' ? 'Video Link' : 
                                                                             'Web Resource'}</span>
                                                                    </div>
                                                                </div>
                                                                <div style={styles.resourceActions}>
                                                                    {res.resource_type === 'pdf' ? (
                                                                        <Download
                                                                            size={18}
                                                                            style={styles.cursor}
                                                                            color="#0066FF"
                                                                            onClick={(e) => { e.stopPropagation(); handleResourceAction(res); }}
                                                                        />
                                                                    ) : (
                                                                        <ExternalLink
                                                                            size={18}
                                                                            style={styles.cursor}
                                                                            color="#0066FF"
                                                                            onClick={(e) => { e.stopPropagation(); handleResourceAction(res); }}
                                                                        />
                                                                    )}
                                                                    <Trash2
                                                                        size={18}
                                                                        style={{...styles.cursor, marginLeft: '8px', color: '#EF4444'}}
                                                                        onClick={(e) => deleteResource(res.resource_id, module.roadmap_id, e)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <button
                                                    style={styles.addResourceBtn}
                                                    onClick={() => handleOpenResourceModal(module.roadmap_id)}
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
                                <>
                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept=".pdf,application/pdf"
                                        onChange={handleFileChange}
                                    />

                                    {/* Drag and drop area */}
                                    <div
                                        style={{
                                            ...styles.filePlaceholder,
                                            borderColor: isDragging ? '#0066FF' : '#E5E7EB',
                                            backgroundColor: isDragging ? '#F0F7FF' : '#FFFFFF',
                                            borderStyle: selectedFile ? 'solid' : 'dashed'
                                        }}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={handleFileSelect}
                                    >
                                        {selectedFile ? (
                                            <div style={styles.filePreview}>
                                                <FileText size={24} color="#0066FF" />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ margin: 0, fontWeight: '600', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {selectedFile.name}
                                                    </p>
                                                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6B7280' }}>
                                                        {(selectedFile.size / 1024).toFixed(2)} KB
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeSelectedFile();
                                                    }}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#EF4444',
                                                        cursor: 'pointer',
                                                        padding: '4px'
                                                    }}
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={20} />
                                                <span>Drag & drop a PDF file here or click to browse</span>
                                                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '8px 0 0 0' }}>
                                                    Only PDF files are accepted
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {/* Browse button (alternative to clicking the area) */}
                                    {!selectedFile && (
                                        <button
                                            type="button"
                                            onClick={handleFileSelect}
                                            style={{
                                                marginTop: '8px',
                                                padding: '8px 16px',
                                                backgroundColor: '#F3F4F6',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                color: '#374151'
                                            }}
                                        >
                                            Browse Files
                                        </button>
                                    )}
                                </>
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

// Styles remain EXACTLY as in your original code
const styles = {
    pageWrapper: {
        backgroundColor: '#F8F9FB',
        fontFamily: '"Inter", sans-serif'
    },
    container: {
        width: '100%',
        padding: '10px 5px'
    },
    skillHeader: {
        marginBottom: '15px',
        paddingBottom: '10px',
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
        width: '3px',
        height: '32px',
        backgroundColor: '#0066FF',
        marginLeft: '19px',
        opacity: 0.2,
        borderRadius: '3px'
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        marginBottom: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
        fontWeight: '800',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 102, 255, 0.2)',
        flexShrink: 0
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
    resourceActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
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
        fontWeight: '800',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
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
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        minHeight: '120px',
        justifyContent: 'center'
    },
    filePreview: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '12px',
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
        border: '1px solid #E5E7EB'
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
    },
    loadingState: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#6B7280'
    }
};

export default StudyRoadmap;
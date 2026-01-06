// import React, { useState, useRef, useEffect } from 'react';
// import { Search, KeyboardArrowDown, MoreVert, Edit, Delete, Add, Groups, Upload, AutoAwesome } from '@mui/icons-material';
// import useAuthStore from '../../../store/useAuthStore';

// const GroupsClasses = () => {
//   const { token } = useAuthStore();
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [searchTerm, setSearchTerm] = useState('');
//   const [deptFilter, setDeptFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [editingGroup, setEditingGroup] = useState(null);
//   const [groups, setGroups] = useState([]);
//   const [venues, setVenues] = useState([]);
//   const [faculties, setFaculties] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedGroupForAllocation, setSelectedGroupForAllocation] = useState(null);

//   const menuRef = useRef(null);
//   const itemsPerPage = 5;

//   const [newGroup, setNewGroup] = useState({
//     group_code: '',
//     group_name: '',
//     venue_id: '',
//     faculty_id: '',
//     schedule_days: '',
//     schedule_time: '',
//     max_students: 50,
//     department: '',
//     status: 'Active'
//   });

//   const departments = [... new Set(groups.map(g => g.department))];

//   // Fetch groups
//   const fetchGroups = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch(`${API_URL}/groups`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       const data = await response.json();
//       if (data.success) {
//         setGroups(data.data);
//       } else {
//         setError(data.message || 'Failed to fetch groups');
//       }
//     } catch (err) {
//       console.error('Error fetching groups:', err);
//       setError('Failed to fetch groups');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch venues
//   const fetchVenues = async () => {
//     try {
//       const response = await fetch(`${API_URL}/groups/venues`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       const data = await response.json();
//       if (data.success) {
//         setVenues(data.data);
//       }
//     } catch (err) {
//       console.error('Error fetching venues:', err);
//     }
//   };

//   // Fetch faculties
//   const fetchFaculties = async () => {
//     try {
//       const response = await fetch(`${API_URL}/groups/faculties`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       const data = await response. json();
//       if (data.success) {
//         setFaculties(data.data);
//       }
//     } catch (err) {
//       console.error('Error fetching faculties:', err);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchGroups();
//       fetchVenues();
//       fetchFaculties();
//     }
//   }, [token]);

//   const filteredData = groups.filter(g => {
//     const matchesSearch = g.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                          g.event. toLowerCase().includes(searchTerm. toLowerCase()) || 
//                          g.faculty.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesDept = ! deptFilter || g.department === deptFilter;
//     const matchesStatus = !statusFilter || g.status === statusFilter;
//     return matchesSearch && matchesDept && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const startIdx = (currentPage - 1) * itemsPerPage;
//   const currentData = filteredData.slice(startIdx, startIdx + itemsPerPage);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef. current.contains(e.target)) setActiveMenu(null);
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const toggleMenu = (id) => setActiveMenu(activeMenu === id ?  null : id);

//   const handleEdit = (g) => { 
//     setEditingGroup(g); 
//     setActiveMenu(null); 
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this group?')) return;

//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/groups/${id}`, {
//         method: 'DELETE',
//         headers:  {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       const data = await response.json();
//       if (data.success) {
//         await fetchGroups();
//         alert('Group deleted successfully! ');
//       } else {
//         setError(data.message || 'Failed to delete group');
//       }
//     } catch (err) {
//       console.error('Error deleting group:', err);
//       setError('Failed to delete group');
//     } finally {
//       setLoading(false);
//       setActiveMenu(null);
//     }
//   };

//   const handleUpdate = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/groups/${editingGroup.id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           venue_id: editingGroup.venue_id,
//           schedule_days: editingGroup.schedule. split(' ')[0] + ' ' + editingGroup.schedule.split(' ')[1],
//           schedule_time: editingGroup.schedule.split(' ').slice(2).join(' '),
//           status: editingGroup.status,
//           max_students: editingGroup.total
//         })
//       });

//       const data = await response.json();
//       if (data.success) {
//         await fetchGroups();
//         setEditingGroup(null);
//         alert('Group updated successfully!');
//       } else {
//         setError(data.message || 'Failed to update group');
//       }
//     } catch (err) {
//       console.error('Error updating group:', err);
//       setError('Failed to update group');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateGroup = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/groups`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(newGroup)
//       });

//       const data = await response.json();
//       if (data.success) {
//         await fetchGroups();
//         setShowCreateModal(false);
//         setNewGroup({
//           group_code: '',
//           group_name:  '',
//           venue_id: '',
//           faculty_id: '',
//           schedule_days: '',
//           schedule_time: '',
//           max_students: 50,
//           department: '',
//           status: 'Active'
//         });
//         alert('Group created successfully!');
//       } else {
//         setError(data.message || 'Failed to create group');
//       }
//     } catch (err) {
//       console.error('Error creating group:', err);
//       setError('Failed to create group');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBulkUpload = async () => {
//     if (!selectedFile) {
//       alert('Please select a file');
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       const response = await fetch(`${API_URL}/groups/bulk-upload`, {
//         method: 'POST',
//         headers:  {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       const data = await response.json();
//       if (data.success) {
//         setShowBulkUploadModal(false);
//         setSelectedFile(null);
//         alert(data.message);
//       } else {
//         setError(data.message || 'Failed to upload file');
//       }
//     } catch (err) {
//       console.error('Error uploading file:', err);
//       setError('Failed to upload file');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAutoAllocate = async (groupId) => {
//     if (!window.confirm('Auto-allocate students to this group based on skills?')) return;

//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/groups/${groupId}/auto-allocate`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       const data = await response.json();
//       if (data.success) {
//         await fetchGroups();
//         alert(data.message);
//       } else {
//         setError(data. message || 'Failed to allocate students');
//       }
//     } catch (err) {
//       console.error('Error allocating students:', err);
//       setError('Failed to allocate students');
//     } finally {
//       setLoading(false);
//       setActiveMenu(null);
//     }
//   };

//   return (
//     <div style={s.container}>
//       {error && (
//         <div style={s. errorBanner}>
//           <span>{error}</span>
//           <button onClick={() => setError('')} style={s.errorClose}>×</button>
//         </div>
//       )}

//       <div style={s.topBar}>
//         <div style={s.searchWrapper}>
//           <Search sx={{ color: '#94a3b8', fontSize: 22 }} />
//           <input 
//             type="text" 
//             placeholder="Search classes, code or faculty..." 
//             style={s.searchInput} 
//             value={searchTerm} 
//             onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
//           />
//         </div>
//         <div style={s.filtersWrapper}>
//           <div style={s.selectWrapper}>
//             <select 
//               style={s.select} 
//               value={deptFilter} 
//               onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
//             >
//               <option value="">Department</option>
//               {departments. map(d => <option key={d} value={d}>{d}</option>)}
//             </select>
//             <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
//           </div>
//           <div style={s. selectWrapper}>
//             <select 
//               style={s.select} 
//               value={statusFilter} 
//               onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
//             >
//               <option value="">Status</option>
//               <option value="Active">Active</option>
//               <option value="Review">Review</option>
//               <option value="Inactive">Inactive</option>
//             </select>
//             <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
//           </div>
//           <button style={s.uploadBtn} onClick={() => setShowBulkUploadModal(true)}>
//             <Upload sx={{ fontSize:  20 }} />
//             <span>Bulk Upload Students</span>
//           </button>
//           <button style={s.addBtn} onClick={() => setShowCreateModal(true)}>
//             <Add sx={{ fontSize: 20 }} />
//             <span>Create New Group</span>
//           </button>
//         </div>
//       </div>

//       <div style={s.tableCard}>
//         {loading && <div style={s.loadingOverlay}>Loading...</div>}
        
//         <div style={s.tableWrapper}>
//           <table style={s.table}>
//             <thead>
//               <tr style={s.trHead}>
//                 <th style={s.th}>Group Name & Code</th>
//                 <th style={s.th}>Faculty</th>
//                 <th style={s.th}>Schedule</th>
//                 <th style={s.th}>Students</th>
//                 <th style={s.th}>Status</th>
//                 <th style={s.th}>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentData.map(g => (
//                 <tr key={g.id} style={s.trBody}>
//                   <td style={s.td}>
//                     <div style={s.groupNameCell}>
//                       <div style={s.groupCode}>{g.code}</div>
//                       <div style={s.venueName}>{g.venue}</div>
//                       <div style={s.eventName}>{g.event}</div>
//                     </div>
//                   </td>
//                   <td style={s.td}>
//                     <div style={s.facultyCell}>
//                       <div style={s.avatar}>{g.faculty. charAt(0)}</div>
//                       <span style={s.facultyName}>{g.faculty}</span>
//                     </div>
//                   </td>
//                   <td style={s.td}>
//                     <div style={s.scheduleText}>
//                       {g.schedule.split(' ')[0]} {g.schedule.split(' ')[1]}
//                     </div>
//                     <div style={s.scheduleTime}>
//                       {g.schedule. split(' ').slice(2).join(' ')}
//                     </div>
//                   </td>
//                   <td style={s.td}>
//                     <div style={s.studentsCell}>
//                       <Groups sx={{ fontSize: 18, color: '#94a3b8' }} />
//                       <span>{g.students} / {g.total}</span>
//                     </div>
//                   </td>
//                   <td style={s. td}>
//                     <span style={
//                       g.status === 'Active' 
//                         ? s.statusActive 
//                         : g.status === 'Review' 
//                         ? s.statusReview 
//                         : s.statusInactive
//                     }>
//                       {g.status}
//                     </span>
//                   </td>
//                   <td style={s.td}>
//                     <div style={s.actionCell}>
//                       <button style={s.actionBtn} onClick={() => toggleMenu(g.id)}>
//                         <MoreVert sx={{ fontSize: 18, color: '#64748b' }} />
//                       </button>
//                       {activeMenu === g.id && (
//                         <div ref={menuRef} style={s.actionMenu}>
//                           <button 
//                             style={s.menuItem} 
//                             onClick={() => handleEdit(g)} 
//                             onMouseEnter={(e) => e.currentTarget. style.backgroundColor = '#f8fafc'} 
//                             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                           >
//                             <Edit sx={{ fontSize: 16 }} />
//                             <span>Edit</span>
//                           </button>
//                           <button 
//                             style={s.menuItem} 
//                             onClick={() => handleAutoAllocate(g.id)} 
//                             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'} 
//                             onMouseLeave={(e) => e.currentTarget.style. backgroundColor = 'transparent'}
//                           >
//                             <AutoAwesome sx={{ fontSize: 16, color: '#3b82f6' }} />
//                             <span style={{color: '#3b82f6'}}>Auto Allocate</span>
//                           </button>
//                           <button 
//                             style={s.menuItemDelete} 
//                             onClick={() => handleDelete(g.id)} 
//                             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'} 
//                             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                           >
//                             <Delete sx={{ fontSize: 16 }} />
//                             <span>Delete</span>
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div style={s.pagination}>
//           <div style={s.paginationText}>
//             Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, filteredData.length)} of {filteredData.length} groups
//           </div>
//           <div style={s.paginationBtns}>
//             <button 
//               style={{... s.pageBtn, ...(currentPage === 1 ?  s.pageBtnDisabled : {})}} 
//               onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
//               disabled={currentPage === 1}
//             >
//               Previous
//             </button>
//             <button 
//               style={{...s.pageBtn, ...(currentPage === totalPages ? s.pageBtnDisabled : {})}} 
//               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Create Group Modal */}
//       {showCreateModal && (
//         <div style={s.modalOverlay} onClick={() => setShowCreateModal(false)}>
//           <div style={s.modalLarge} onClick={(e) => e.stopPropagation()}>
//             <div style={s.modalHeader}>
//               <h2 style={s.modalTitle}>Create New Group</h2>
//               <button style={s.closeBtn} onClick={() => setShowCreateModal(false)}>
//                 <Delete sx={{ fontSize: 24, color: '#64748b' }} />
//               </button>
//             </div>
//             <div style={s.form}>
//               <div style={s.formGrid}>
//                 <div style={s.formGroup}>
//                   <label style={s.label}>Group Code *</label>
//                   <input
//                     style={s.input}
//                     value={newGroup.group_code}
//                     onChange={(e) => setNewGroup({... newGroup, group_code: e.target.value})}
//                     placeholder="e.g., CS-101"
//                   />
//                 </div>
//                 <div style={s.formGroup}>
//                   <label style={s.label}>Group Name *</label>
//                   <input
//                     style={s.input}
//                     value={newGroup.group_name}
//                     onChange={(e) => setNewGroup({...newGroup, group_name: e.target. value})}
//                     placeholder="e.g., Full-Stack Workshop"
//                   />
//                 </div>
//               </div>

//               <div style={s.formGrid}>
//                 <div style={s.formGroup}>
//                   <label style={s.label}>Venue *</label>
//                   <div style={s.selectWrapper}>
//                     <select
//                       style={s.selectModal}
//                       value={newGroup.venue_id}
//                       onChange={(e) => setNewGroup({...newGroup, venue_id: e.target.value})}
//                     >
//                       <option value="">Select Venue</option>
//                       {venues.map(v => (
//                         <option key={v.venue_id} value={v.venue_id}>{v.venue_name}</option>
//                       ))}
//                     </select>
//                     <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
//                   </div>
//                 </div>
//                 <div style={s.formGroup}>
//                   <label style={s.label}>Faculty *</label>
//                   <div style={s.selectWrapper}>
//                     <select
//                       style={s.selectModal}
//                       value={newGroup. faculty_id}
//                       onChange={(e) => setNewGroup({...newGroup, faculty_id: e.target.value})}
//                     >
//                       <option value="">Select Faculty</option>
//                       {faculties.map(f => (
//                         <option key={f.faculty_id} value={f.faculty_id}>
//                           {f.faculty_name} - {f.department}
//                         </option>
//                       ))}
//                     </select>
//                     <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
//                   </div>
//                 </div>
//               </div>

//               <div style={s.formGrid}>
//                 <div style={s.formGroup}>
//                   <label style={s.label}>Schedule Days *</label>
//                   <input
//                     style={s.input}
//                     value={newGroup.schedule_days}
//                     onChange={(e) => setNewGroup({...newGroup, schedule_days: e.target.value})}
//                     placeholder="e.g., Mon, Wed"
//                   />
//                 </div>
//                 <div style={s.formGroup}>
//                   <label style={s.label}>Schedule Time *</label>
//                   <input
//                     style={s.input}
//                     value={newGroup.schedule_time}
//                     onChange={(e) => setNewGroup({...newGroup, schedule_time: e.target.value})}
//                     placeholder="e.g., 10:00 - 11:30"
//                   />
//                 </div>
//               </div>

//               <div style={s.formGrid}>
//                 <div style={s.formGroup}>
//                   <label style={s.label}>Department *</label>
//                   <input
//                     style={s.input}
//                     value={newGroup.department}
//                     onChange={(e) => setNewGroup({... newGroup, department: e.target.value})}
//                     placeholder="e.g., Computer Science"
//                   />
//                 </div>
//                 <div style={s.formGroup}>
//                   <label style={s.label}>Max Students *</label>
//                   <input
//                     type="number"
//                     style={s.input}
//                     value={newGroup.max_students}
//                     onChange={(e) => setNewGroup({...newGroup, max_students: parseInt(e.target.value)})}
//                   />
//                 </div>
//               </div>

//               <div style={s.modalFooter}>
//                 <button type="button" style={s.cancelBtn} onClick={() => setShowCreateModal(false)}>
//                   Cancel
//                 </button>
//                 <button 
//                   type="button" 
//                   style={s.submitBtn} 
//                   onClick={handleCreateGroup}
//                   disabled={loading}
//                 >
//                   {loading ? 'Creating...' : 'Create Group'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Group Modal */}
//       {editingGroup && (
//         <div style={s.modalOverlay} onClick={() => setEditingGroup(null)}>
//           <div style={s.modal} onClick={(e) => e.stopPropagation()}>
//             <div style={s.modalHeader}>
//               <h2 style={s.modalTitle}>Edit Schedule</h2>
//               <button style={s.closeBtn} onClick={() => setEditingGroup(null)}>
//                 <Delete sx={{ fontSize: 24, color: '#64748b' }} />
//               </button>
//             </div>
//             <div style={s. form}>
//               <div style={s.formGroup}>
//                 <label style={s.label}>Venue *</label>
//                 <div style={s.selectWrapper}>
//                   <select 
//                     style={s.selectModal} 
//                     value={editingGroup.venue_id} 
//                     onChange={(e) => setEditingGroup({...editingGroup, venue_id: e.target.value})}
//                   >
//                     {venues.map(v => (
//                       <option key={v. venue_id} value={v. venue_id}>{v.venue_name}</option>
//                     ))}
//                   </select>
//                   <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
//                 </div>
//               </div>
//               <div style={s.formGroup}>
//                 <label style={s.label}>Schedule *</label>
//                 <input
//                   style={s.input}
//                   value={editingGroup.schedule}
//                   onChange={(e) => setEditingGroup({...editingGroup, schedule: e.target.value})}
//                 />
//               </div>
//               <div style={s.formGroup}>
//                 <label style={s. label}>Max Students *</label>
//                 <input
//                   type="number"
//                   style={s.input}
//                   value={editingGroup.total}
//                   onChange={(e) => setEditingGroup({...editingGroup, total: parseInt(e.target.value)})}
//                 />
//               </div>
//               <div style={s.formGroup}>
//                 <label style={s.label}>Status *</label>
//                 <div style={s.selectWrapper}>
//                   <select 
//                     style={s.selectModal} 
//                     value={editingGroup.status} 
//                     onChange={(e) => setEditingGroup({...editingGroup, status: e.target.value})}
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Review">Review</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                   <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
//                 </div>
//               </div>
//               <div style={s.modalFooter}>
//                 <button type="button" style={s.cancelBtn} onClick={() => setEditingGroup(null)}>
//                   Cancel
//                 </button>
//                 <button 
//                   type="button" 
//                   style={s.submitBtn} 
//                   onClick={handleUpdate}
//                   disabled={loading}
//                 >
//                   {loading ? 'Saving...' : 'Save Changes'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bulk Upload Modal */}
//       {showBulkUploadModal && (
//         <div style={s.modalOverlay} onClick={() => setShowBulkUploadModal(false)}>
//           <div style={s.modal} onClick={(e) => e.stopPropagation()}>
//             <div style={s.modalHeader}>
//               <h2 style={s.modalTitle}>Bulk Upload Students</h2>
//               <button style={s.closeBtn} onClick={() => setShowBulkUploadModal(false)}>
//                 <Delete sx={{ fontSize: 24, color: '#64748b' }} />
//               </button>
//             </div>
//             <div style={s.form}>
//               <div style={s.uploadInstructions}>
//                 <p style={s.instructionTitle}>CSV Format Required:</p>
//                 <p style={s.instructionText}>
//                   name, email, studentId, department, year, semester, skills, proficiency_levels
//                 </p>
//                 <p style={s.instructionNote}>
//                   * Skills and proficiency levels should be comma-separated<br/>
//                   * Example: "Python,JavaScript,React" and "Advanced,Intermediate,Beginner"
//                 </p>
//               </div>
//               <div style={s.formGroup}>
//                 <label style={s.label}>Select CSV File *</label>
//                 <input
//                   type="file"
//                   accept=".csv"
//                   onChange={(e) => setSelectedFile(e.target.files[0])}
//                   style={s.fileInput}
//                 />
//                 {selectedFile && (
//                   <div style={s.fileName}>{selectedFile.name}</div>
//                 )}
//               </div>
//               <div style={s. modalFooter}>
//                 <button type="button" style={s.cancelBtn} onClick={() => setShowBulkUploadModal(false)}>
//                   Cancel
//                 </button>
//                 <button 
//                   type="button" 
//                   style={s.submitBtn} 
//                   onClick={handleBulkUpload}
//                   disabled={loading || !selectedFile}
//                 >
//                   {loading ? 'Uploading...' : 'Upload'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const s = {
//   container: { padding: '0', width: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', position: 'relative' },
//   errorBanner: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' },
//   errorClose: { background: 'none', border: 'none', fontSize: '24px', color: '#991b1b', cursor: 'pointer', padding: '0 8px' },
//   loadingOverlay: { position: 'absolute', top: 0, left:  0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, fontSize: '16px', fontWeight: '600', color: '#3b82f6' },
//   topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' },
//   searchWrapper: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding:  '10px 16px', flex: 1, minWidth: '250px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
//   searchInput: { border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: '#1e293b', background: 'transparent' },
//   filtersWrapper: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
//   selectWrapper: { position: 'relative', minWidth: '150px' },
//   select: { appearance: 'none', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b', padding: '10px 40px 10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%', outline: 'none' },
//   selectArrow: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' },
//   uploadBtn: { display: 'flex', alignItems:  'center', gap: '8px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', whiteSpace: 'nowrap' },
//   addBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor:  '#3b82f6', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor:  'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', whiteSpace: 'nowrap' },
//   tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', position: 'relative' },
//   tableWrapper: { overflowX: 'auto' },
//   table: { width:  '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
//   trHead: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
//   th: { padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' },
//   trBody: { borderBottom: '1px solid #f1f5f9' },
//   td: { padding: '16px 24px', fontSize: '14px', color: '#334155' },
//   groupNameCell: { display: 'flex', flexDirection: 'column', gap:  '2px' },
//   groupCode: { fontWeight: '600', color: '#0f172a' },
//   venueName: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
//   eventName: { fontSize: '12px', color: '#94a3b8' },
//   facultyCell: { display: 'flex', alignItems: 'center', gap:  '12px' },
//   avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor:  '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0 },
//   facultyName: { fontWeight: '500', color: '#1e293b' },
//   scheduleText: { fontWeight: '500', color: '#1e293b' },
//   scheduleTime: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
//   studentsCell: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' },
//   statusActive: { backgroundColor: '#16A34A', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
//   statusReview: { backgroundColor: '#F59E0B', color: 'black', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
//   statusInactive: { backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display:  'inline-block' },
//   actionCell: { position: 'relative' },
//   actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems:  'center', justifyContent: 'center' },
//   actionMenu: { position: 'absolute', right: '0', top: '100%', marginTop: '4px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius:  '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', zIndex: 100, minWidth: '180px', overflow: 'hidden' },
//   menuItem: { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#334155', textAlign: 'left', transition: 'background-color 0.15s' },
//   menuItemDelete: { display: 'flex', alignItems:  'center', gap: '8px', width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#ef4444', textAlign: 'left', transition: 'background-color 0.15s', borderTop: '1px solid #f1f5f9' },
//   pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fafafa', flexWrap: 'wrap', gap: '12px' },
//   paginationText: { fontSize: '14px', color: '#64748b' },
//   paginationBtns: { display: 'flex', gap: '12px' },
//   pageBtn: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#334155', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
//   pageBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
//   modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor:  'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
//   modal: { backgroundColor:  '#ffffff', borderRadius: '12px', width: '100%', maxWidth:  '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
//   modalLarge: { backgroundColor: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
//   modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #e2e8f0' },
//   modalTitle: { fontSize:  '20px', fontWeight: '700', color: '#0f172a', margin: 0 },
//   closeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems:  'center', justifyContent:  'center' },
//   form: { padding: '24px' },
//   formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap:  '20px', marginBottom: '20px' },
//   formGroup: { display:  'flex', flexDirection: 'column', gap: '8px' },
//   label: { fontSize: '14px', fontWeight:  '600', color: '#334155' },
//   input: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius:  '8px', fontSize: '14px', outline: 'none' },
//   selectModal: { appearance: 'none', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b', padding: '10px 40px 10px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', width: '100%', outline: 'none' },
//   uploadInstructions: { backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '8px', marginBottom: '20px' },
//   instructionTitle: { fontSize: '14px', fontWeight: '600', color: '#0369a1', marginBottom: '8px', margin: 0 },
//   instructionText: { fontSize: '13px', color: '#075985', fontFamily: 'monospace', margin: '8px 0' },
//   instructionNote: { fontSize: '12px', color: '#0c4a6e', margin: '8px 0 0 0', lineHeight: '1.5' },
//   fileInput: { padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
//   fileName: { fontSize:  '13px', color: '#10b981', fontWeight: '500', marginTop: '8px' },
//   modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' },
//   cancelBtn: { padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight:  '600', color: '#64748b', backgroundColor: '#ffffff', cursor: 'pointer' },
//   submitBtn: { padding:  '10px 20px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#ffffff', backgroundColor: '#3b82f6', cursor: 'pointer' }
// };

// export default GroupsClasses;


import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  KeyboardArrowDown, 
  MoreVert, 
  Edit, 
  Delete, 
  Add, 
  Groups, 
  Upload, 
  Person,
  LocationOn,
  Close,
  GetApp,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import useAuthStore from '../../../store/useAuthStore';

const GroupsClasses = () => {
  const { token } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingVenue, setEditingVenue] = useState(null);
  const [venues, setVenues] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showRangeAllocateModal, setShowRangeAllocateModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showAssignFacultyModal, setShowAssignFacultyModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venueStudents, setVenueStudents] = useState([]);
  
  // Faculty search and availability
  const [facultySearch, setFacultySearch] = useState('');
  const [availableFaculties, setAvailableFaculties] = useState({ available: [], current: null, total: 0 });
  const [loadingFaculties, setLoadingFaculties] = useState(false);

  // Success/Failure Modal States
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultModal, setResultModal] = useState({
    type: 'success',
    title: '',
    message: ''
  });

  const menuRef = useRef(null);
  const itemsPerPage = 5;

  const [newVenue, setNewVenue] = useState({
    venue_name: '',
    capacity:  50,
    location: '',
    assigned_faculty_id: ''
  });

  const [rangeAllocation, setRangeAllocation] = useState({
    rollNumberFrom: '',
    rollNumberTo: ''
  });

  const [facultyAssignment, setFacultyAssignment] = useState({
    venue_id: '',
    faculty_id: ''
  });

  // Show Result Modal Function
  const showResult = (type, title, message) => {
    setResultModal({ type, title, message });
    setShowResultModal(true);
  };

  const fetchVenues = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/groups/venues`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        setVenues(data. data);
      } else {
        setError(data.message || 'Failed to fetch venues');
      }
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError('Failed to fetch venues');
    } finally {
      setLoading(false);
    }
  };

  // Fetch faculties (only unassigned)
  const fetchFaculties = async () => {
    try {
      const response = await fetch(`${API_URL}/groups/faculties/available`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setFaculties(data.data. available. filter(f => f.workload === 0));
      }
    } catch (err) {
      console.error('Error fetching faculties:', err);
    }
  };

  // Fetch available faculties with workload info
  const fetchAvailableFaculties = async (venueId, search = '') => {
    setLoadingFaculties(true);
    try {
      const url = new URL(`${API_URL}/groups/faculties/available`);
      if (venueId) url.searchParams.append('venueId', venueId);
      if (search) url.searchParams.append('search', search);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setAvailableFaculties(data.data);
      }
    } catch (err) {
      console.error('Error fetching available faculties:', err);
    } finally {
      setLoadingFaculties(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchVenues();
      fetchFaculties();
    }
  }, [token]);

  useEffect(() => {
    if (showAssignFacultyModal) {
      const timer = setTimeout(() => {
        fetchAvailableFaculties(facultyAssignment.venue_id, facultySearch);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [facultySearch, showAssignFacultyModal]);

  const filteredData = venues.filter(v => {
    const matchesSearch = v.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (v.faculty_name && v.faculty_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (v.location && v.location. toLowerCase().includes(searchTerm. toLowerCase()));
    const matchesStatus = ! statusFilter || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setActiveMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (id) => setActiveMenu(activeMenu === id ?  null : id);

  const handleEdit = (venue) => { 
    setEditingVenue({
      venue_id: venue.venue_id,
      venue_name: venue.venue_name,
      capacity: venue.capacity,
      location: venue.location,
      assigned_faculty_id: venue.faculty_id,
      status: venue.status
    }); 
    setActiveMenu(null); 
  };

  const handleDelete = async (id) => {
    if (! window.confirm('Delete this venue?  All students will be removed.')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups/venues/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization':  `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        await fetchVenues();
        showResult('success', 'Venue Deleted', data.message);
      } else {
        showResult('error', 'Deletion Failed', data.message);
      }
    } catch (err) {
      console.error('Error deleting venue:', err);
      showResult('error', 'Deletion Failed', 'Failed to delete venue.  Please try again.');
    } finally {
      setLoading(false);
      setActiveMenu(null);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups/venues/${editingVenue.venue_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingVenue)
      });
      const data = await response.json();
      if (data.success) {
        await fetchVenues();
        setEditingVenue(null);
        showResult('success', 'Venue Updated', data.message);
      } else {
        showResult('error', 'Update Failed', data.message);
      }
    } catch (err) {
      console.error('Error updating venue:', err);
      showResult('error', 'Update Failed', 'Failed to update venue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVenue = async () => {
    if (!newVenue.venue_name || !newVenue.capacity) {
      showResult('error', 'Missing Information', 'Please fill in venue name and capacity.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups/venues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVenue)
      });

      const data = await response. json();
      if (data.success) {
        await fetchVenues();
        setShowCreateModal(false);
        setNewVenue({
          venue_name: '',
          capacity: 50,
          location: '',
          assigned_faculty_id: ''
        });
        showResult('success', 'Venue Created', data.message);
      } else {
        showResult('error', 'Creation Failed', data.message);
      }
    } catch (err) {
      console.error('Error creating venue:', err);
      showResult('error', 'Creation Failed', 'Failed to create venue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      showResult('error', 'No File Selected', 'Please select an Excel file to upload.');
      return;
    }

    if (!selectedVenue) {
      showResult('error', 'No Venue Selected', 'Please select a venue first.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await fetch(`${API_URL}/groups/venues/${selectedVenue.venue_id}/bulk-upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setShowBulkUploadModal(false);
        setSelectedFile(null);
        setSelectedVenue(null);
        await fetchVenues();
        showResult('success', 'Upload Successful', data.message);
      } else {
        showResult('error', 'Upload Failed', data.message);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      showResult('error', 'Upload Failed', 'Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRangeAllocate = async () => {
    if (!rangeAllocation. rollNumberFrom || !rangeAllocation.rollNumberTo) {
      showResult('error', 'Missing Information', 'Please enter both roll numbers.');
      return;
    }

    if (! selectedVenue) {
      showResult('error', 'No Venue Selected', 'Please select a venue first.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups/venues/${selectedVenue.venue_id}/allocate-range`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rangeAllocation)
      });

      const data = await response. json();
      if (data.success) {
        setShowRangeAllocateModal(false);
        setRangeAllocation({ rollNumberFrom: '', rollNumberTo: '' });
        setSelectedVenue(null);
        await fetchVenues();
        showResult('success', 'Allocation Successful', data.message);
      } else {
        showResult('error', 'Allocation Failed', data.message);
      }
    } catch (err) {
      console.error('Error allocating students:', err);
      showResult('error', 'Allocation Failed', 'Failed to allocate students.  Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudents = async (venue) => {
    setSelectedVenue(venue);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups/venues/${venue.venue_id}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setVenueStudents(data.data);
        setShowStudentsModal(true);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      showResult('error', 'Fetch Failed', 'Failed to fetch students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm('Remove this student from venue?')) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/groups/venues/${selectedVenue. venue_id}/students/${studentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        await handleViewStudents(selectedVenue);
        await fetchVenues();
        showResult('success', 'Student Removed', data.message);
      } else {
        showResult('error', 'Removal Failed', data.message);
      }
    } catch (err) {
      console.error('Error removing student:', err);
      showResult('error', 'Removal Failed', 'Failed to remove student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignFaculty = async () => {
    if (!facultyAssignment.faculty_id) {
      showResult('error', 'No Faculty Selected', 'Please select a faculty to assign.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/groups/venues/${facultyAssignment.venue_id}/assign-faculty`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ faculty_id: facultyAssignment.faculty_id })
        }
      );

      const data = await response.json();
      if (data.success) {
        setShowAssignFacultyModal(false);
        setFacultyAssignment({ venue_id: '', faculty_id: '' });
        setFacultySearch('');
        await fetchVenues();
        await fetchFaculties(); // Refresh available faculties
        showResult('success', 'Faculty Assigned', data.message);
      } else {
        showResult('error', 'Assignment Failed', data.message);
      }
    } catch (err) {
      console.error('Error assigning faculty:', err);
      showResult('error', 'Assignment Failed', 'Failed to assign faculty. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openAssignFacultyModal = async (venue) => {
    setFacultyAssignment({
      venue_id: venue.venue_id,
      faculty_id:  venue.faculty_id || ''
    });
    setShowAssignFacultyModal(true);
    setActiveMenu(null);
    setFacultySearch('');
    
    await fetchAvailableFaculties(venue. venue_id);
  };

  // const downloadExcelTemplate = () => {
  //   const csvContent = "data:text/csv;charset=utf-8,name,email,rollNumber,department,year,semester\nJohn Doe,john@example. com,7376242AL101,Computer Science,2,3\nJane Smith,jane@example.com,7376242AL102,Computer Science,2,3";
  //   const link = document.createElement('a');
  //   link.setAttribute('href', csvContent);
  //   link.setAttribute('download', 'student_upload_template');
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  return (
    <div style={s.container}>
      {error && (
        <div style={s.errorBanner}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={s.errorClose}>×</button>
        </div>
      )}
   <div>
   </div>
      <div style={s.topBar}>
        <div style={s.searchWrapper}>
          <Search sx={{ color: '#94a3b8', fontSize: 22 }} />
          <input 
            type="text" 
            placeholder="Search venues, faculty or location..." 
            style={s.searchInput} 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          />
        </div>
        <div style={s.filtersWrapper}>
          <div style={s.selectWrapper}>
            <select 
              style={s.select} 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target. value); setCurrentPage(1); }}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
          </div>
          <button style={s.addBtn} onClick={() => setShowCreateModal(true)}>
            <Add sx={{ fontSize: 20 }} />
            <span>Create Venue</span>
          </button>
        </div>
      </div>

      <div style={s.tableCard}>
        {loading && <div style={s.loadingOverlay}>Loading...</div>}
        <div style={s.tableWrapper}>
          <table style={s.table}>
            <thead>
              <tr style={s.trHead}>
                <th style={s.th}>Venue Details</th>
                <th style={s.th}>Assigned Faculty</th>
                <th style={s.th}>Capacity</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(v => (
                <tr key={v.venue_id} style={s.trBody}>
                  <td style={s.td}>
                    <div style={s.venueCell}>
                      <div style={s.venueName}>{v.venue_name}</div>
                      <div style={s.venueLocation}>
                        <LocationOn sx={{ fontSize: 14, color: '#94a3b8' }} />
                        {v.location || 'No location'}
                      </div>
                    </div>
                  </td>
                  <td style={s.td}>
                    {v.faculty_name ?  (
                      <div style={s.facultyCell}>
                        <div style={s.avatar}>{v.faculty_name. charAt(0)}</div>
                        <div>
                          <div style={s.facultyName}>{v.faculty_name}</div>
                          <div style={s.facultyDept}>{v.faculty_department}</div>
                        </div>
                      </div>
                    ) : (
                      <span style={s.noFaculty}>Not Assigned</span>
                    )}
                  </td>
                  <td style={s.td}>
                    <div style={s.capacityCell}>
                      <Groups sx={{ fontSize: 18, color: '#94a3b8' }} />
                      <span style={{
                        color: v.current_students >= v.capacity ?  '#ef4444' : '#10b981',
                        fontWeight: '700'
                      }}>
                        {v.current_students} / {v.capacity}
                      </span>
                    </div>
                  </td>
                  <td style={s.td}>
                    <span style={v.status === 'Active' ?  s.statusActive : s.statusInactive}>
                      {v.status}
                    </span>
                  </td>
                  <td style={s. td}>
                    <div style={s.actionCell}>
                      <button style={s.actionBtn} onClick={() => toggleMenu(v.venue_id)}>
                        <MoreVert sx={{ fontSize: 18, color: '#64748b' }} />
                      </button>
                      {activeMenu === v.venue_id && (
                        <div ref={menuRef} style={s.actionMenu}>
                          <button 
                            style={s.menuItem} 
                            onClick={() => handleEdit(v)} 
                            onMouseEnter={(e) => e.currentTarget. style.backgroundColor = '#f8fafc'} 
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Edit sx={{ fontSize: 16 }} />
                            <span>Edit Venue</span>
                          </button>
                          <button 
                            style={s.menuItem} 
                            onClick={() => openAssignFacultyModal(v)} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'} 
                            onMouseLeave={(e) => e.currentTarget.style. backgroundColor = 'transparent'}
                          >
                            <Person sx={{ fontSize: 16, color: '#3b82f6' }} />
                            <span style={{color: '#3b82f6'}}>Assign Faculty</span>
                          </button>
                          <button 
                            style={s.menuItem} 
                            onClick={() => {
                              setSelectedVenue(v);
                              setShowBulkUploadModal(true);
                              setActiveMenu(null);
                            }} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'} 
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Upload sx={{ fontSize: 16, color: '#10b981' }} />
                            <span style={{color: '#10b981'}}>Upload Students</span>
                          </button>
                          <button 
                            style={s.menuItem} 
                            onClick={() => {
                              setSelectedVenue(v);
                              setShowRangeAllocateModal(true);
                              setActiveMenu(null);
                            }} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'} 
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Groups sx={{ fontSize: 16, color: '#f59e0b' }} />
                            <span style={{color:  '#f59e0b'}}>Allocate Range</span>
                          </button>
                          <button 
                            style={s.menuItem} 
                            onClick={() => {
                              handleViewStudents(v);
                              setActiveMenu(null);
                            }} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} 
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Groups sx={{ fontSize: 16 }} />
                            <span>View Students</span>
                          </button>
                          <button 
                            style={s. menuItemDelete} 
                            onClick={() => handleDelete(v.venue_id)} 
                            onMouseEnter={(e) => e.currentTarget. style.backgroundColor = '#fef2f2'} 
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Delete sx={{ fontSize: 16 }} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={s.pagination}>
          <div style={s.paginationText}>
            Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, filteredData. length)} of {filteredData.length} venues
          </div>
          <div style={s.paginationBtns}>
            <button style={{...s.pageBtn, ...(currentPage === 1 ? s.pageBtnDisabled : {})}} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
            <button style={{...s.pageBtn, ...(currentPage === totalPages ? s.pageBtnDisabled : {})}} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      </div>

      {/* Result Modal (Success/Error) */}
      {showResultModal && (
        <div style={s.modalOverlay} onClick={() => setShowResultModal(false)}>
          <div style={s.resultModal} onClick={(e) => e.stopPropagation()}>
            <div style={s. resultIconContainer}>
              {resultModal. type === 'success' ? (
                <CheckCircle sx={{ fontSize: 64, color: '#10b981' }} />
              ) : (
                <ErrorIcon sx={{ fontSize: 64, color: '#ef4444' }} />
              )}
            </div>
            <h2 style={s.resultTitle}>{resultModal.title}</h2>
            <p style={s.resultMessage}>{resultModal.message}</p>
            <button 
              style={resultModal.type === 'success' ? s. resultBtnSuccess : s.resultBtnError}
              onClick={() => setShowResultModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Create Venue Modal */}
      {showCreateModal && (
        <div style={s.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Create New Venue</h2>
              <button style={s.closeBtn} onClick={() => setShowCreateModal(false)}>
                <Close sx={{ fontSize: 24, color: '#64748b' }} />
              </button>
            </div>
            <div style={s.form}>
              <div style={s.formGroup}>
                <label style={s.label}>Venue Name *</label>
                <input
                  style={s.input}
                  value={newVenue.venue_name}
                  onChange={(e) => setNewVenue({...newVenue, venue_name: e.target.value})}
                  placeholder="e.g., Auditorium A"
                />
              </div>
              <div style={s. formGroup}>
                <label style={s.label}>Capacity *</label>
                <input
                  type="number"
                  style={s.input}
                  value={newVenue.capacity}
                  onChange={(e) => setNewVenue({...newVenue, capacity: parseInt(e.target.value)})}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s. label}>Location</label>
                <input
                  style={s.input}
                  value={newVenue. location}
                  onChange={(e) => setNewVenue({... newVenue, location: e. target.value})}
                  placeholder="e.g., Building A, Floor 2"
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>
                  Assign Faculty (Optional)
                  <span style={s.labelHint}>Only unassigned faculties shown</span>
                </label>
                <div style={s. selectWrapper}>
                  <select
                    style={s.selectModal}
                    value={newVenue.assigned_faculty_id}
                    onChange={(e) => setNewVenue({... newVenue, assigned_faculty_id: e.target.value})}
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map(f => (
                      <option key={f. faculty_id} value={f. faculty_id}>
                        {f.faculty_name} - {f.department}
                      </option>
                    ))}
                  </select>
                  <KeyboardArrowDown style={s. selectArrow} sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  style={s.submitBtn} 
                  onClick={handleCreateVenue}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Venue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Venue Modal */}
      {editingVenue && (
        <div style={s.modalOverlay} onClick={() => setEditingVenue(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Edit Venue</h2>
              <button style={s.closeBtn} onClick={() => setEditingVenue(null)}>
                <Close sx={{ fontSize: 24, color: '#64748b' }} />
              </button>
            </div>
            <div style={s. form}>
              <div style={s.formGroup}>
                <label style={s.label}>Venue Name *</label>
                <input
                  style={s.input}
                  value={editingVenue.venue_name}
                  onChange={(e) => setEditingVenue({... editingVenue, venue_name: e.target.value})}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s. label}>Capacity *</label>
                <input
                  type="number"
                  style={s.input}
                  value={editingVenue.capacity}
                  onChange={(e) => setEditingVenue({...editingVenue, capacity: parseInt(e.target.value)})}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Location</label>
                <input
                  style={s.input}
                  value={editingVenue.location}
                  onChange={(e) => setEditingVenue({... editingVenue, location: e.target.value})}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s. label}>Status *</label>
                <div style={s.selectWrapper}>
                  <select
                    style={s.selectModal}
                    value={editingVenue. status}
                    onChange={(e) => setEditingVenue({... editingVenue, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div style={s. modalFooter}>
                <button type="button" style={s. cancelBtn} onClick={() => setEditingVenue(null)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  style={s.submitBtn} 
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Assign Faculty Modal */}
      {showAssignFacultyModal && (
        <div style={s. modalOverlay} onClick={() => {
          setShowAssignFacultyModal(false);
          setFacultySearch('');
        }}>
          <div style={s.modalLarge} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Assign Faculty to Venue</h2>
              <button style={s.closeBtn} onClick={() => {
                setShowAssignFacultyModal(false);
                setFacultySearch('');
              }}>
                <Close sx={{ fontSize: 24, color: '#64748b' }} />
              </button>
            </div>
            
            <div style={s.form}>
              {/* Search Bar */}
              <div style={s.formGroup}>
                <label style={s.label}>Search Faculty</label>
                <div style={s.searchWrapper}>
                  <Search sx={{ color: '#94a3b8', fontSize: 20 }} />
                  <input
                    style={s.searchInput}
                    value={facultySearch}
                    onChange={(e) => setFacultySearch(e.target.value)}
                    placeholder="Search by name, department or email..."
                  />
                </div>
              </div>

              {/* Currently Assigned Faculty */}
              {availableFaculties.current && (
                <div style={s.currentFacultyBox}>
                  <p style={s.currentLabel}>Currently Assigned: </p>
                  <div style={s.facultyCard}>
                    <div style={s.facultyCardHeader}>
                      <div style={s.avatar}>
                        {availableFaculties.current. faculty_name.charAt(0)}
                      </div>
                      <div style={s.facultyCardInfo}>
                        <div style={s.facultyCardName}>
                          {availableFaculties.current.faculty_name}
                        </div>
                        <div style={s. facultyCardDept}>
                          {availableFaculties. current.department} • {availableFaculties.current.designation}
                        </div>
                      </div>
                    </div>
                    <div style={s.workloadBadge(1)}>
                      Current
                    </div>
                  </div>
                </div>
              )}

              {/* Available Faculties List */}
              <div style={s.formGroup}>
                <label style={s.label}>
                  Select Faculty * 
                  <span style={s.labelHint}>
                    ({availableFaculties.available?. length || 0} available)
                  </span>
                </label>

                {loadingFaculties ? (
                  <div style={s.loadingBox}>Loading faculties...</div>
                ) : availableFaculties.available?.length === 0 ? (
                  <div style={s.emptyBox}>
                    <Person sx={{ fontSize: 40, color: '#cbd5e1' }} />
                    <p>No unassigned faculties found</p>
                    <p style={{fontSize: '12px', color: '#94a3b8', marginTop: '8px'}}>
                      All faculties are currently assigned to venues
                    </p>
                  </div>
                ) : (
                  <div style={s.facultyListContainer}>
                    {availableFaculties.available?.map(faculty => (
                      <div
                        key={faculty.faculty_id}
                        style={{
                          ... s.facultyListItem,
                          ...(facultyAssignment.faculty_id === faculty.faculty_id ?  s.facultyListItemSelected : {})
                        }}
                        onClick={() => setFacultyAssignment({... facultyAssignment, faculty_id:  faculty.faculty_id})}
                      >
                        <div style={s.facultyListLeft}>
                          <div style={s.avatar}>
                            {faculty.faculty_name.charAt(0)}
                          </div>
                          <div style={s.facultyListInfo}>
                            <div style={s.facultyListName}>
                              {faculty.faculty_name}
                            </div>
                            <div style={s. facultyListDept}>
                              {faculty.department} • {faculty.designation}
                            </div>
                          </div>
                        </div>
                        <div style={s.facultyListRight}>
                          <div style={s.workloadBadgeSmall(0)}>
                            {faculty.workload_status}
                          </div>
                          {facultyAssignment.faculty_id === faculty.faculty_id && (
                            <div style={s. selectedCheckmark}>✓</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={s.modalFooter}>
                <button 
                  type="button" 
                  style={s.cancelBtn} 
                  onClick={() => {
                    setShowAssignFacultyModal(false);
                    setFacultySearch('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  style={s.submitBtn} 
                  onClick={handleAssignFaculty}
                  disabled={loading || !facultyAssignment.faculty_id}
                >
                  {loading ? 'Assigning...' : 'Assign Faculty'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div style={s.modalOverlay} onClick={() => setShowBulkUploadModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Bulk Upload Students to {selectedVenue?. venue_name}</h2>
              <button style={s.closeBtn} onClick={() => setShowBulkUploadModal(false)}>
                <Close sx={{ fontSize: 24, color: '#64748b' }} />
              </button>
            </div>
            <div style={s.form}>
              <div style={s.uploadInstructions}>
                <p style={s.instructionTitle}>Excel Format Required:</p>
                <p style={s.instructionText}>
                  Columns: name, email, rollNumber, department, year, semester
                </p>
                <p style={s.instructionNote}>
                  * Available capacity: {selectedVenue?.capacity - selectedVenue?.current_students} students<br/>
                  * Only . xlsx and .xls files are accepted
                </p>
                {/* <button 
                  style={s. downloadTemplateBtn}
                  onClick={downloadExcelTemplate}
                >
                  <GetApp sx={{ fontSize: 16 }} />
                  Download Template
                </button> */}
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Select Excel File *</label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  style={s.fileInput}
                />
                {selectedFile && (
                  <div style={s.fileName}>{selectedFile.name}</div>
                )}
              </div>
              <div style={s. modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowBulkUploadModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  style={s.submitBtn} 
                  onClick={handleBulkUpload}
                  disabled={loading || !selectedFile}
                >
                  {loading ? 'Uploading.. .' : 'Upload Students'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Range Allocation Modal */}
      {showRangeAllocateModal && (
        <div style={s.modalOverlay} onClick={() => setShowRangeAllocateModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Allocate Students by Roll Number Range</h2>
              <button style={s.closeBtn} onClick={() => setShowRangeAllocateModal(false)}>
                <Close sx={{ fontSize: 24, color: '#64748b' }} />
              </button>
            </div>
            <div style={s.form}>
              <div style={s.infoBox}>
                <p style={s.infoTitle}>Venue: {selectedVenue?.venue_name}</p>
                <p style={s.infoText}>Available Capacity: {selectedVenue?. capacity - selectedVenue?.current_students} students</p>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>From Roll Number *</label>
                <input
                  style={s. input}
                  value={rangeAllocation.rollNumberFrom}
                  onChange={(e) => setRangeAllocation({...rangeAllocation, rollNumberFrom: e.target.value})}
                  placeholder="e.g., 7376242AL101"
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>To Roll Number *</label>
                <input
                  style={s. input}
                  value={rangeAllocation.rollNumberTo}
                  onChange={(e) => setRangeAllocation({... rangeAllocation, rollNumberTo: e.target.value})}
                  placeholder="e.g., 7376242AL150"
                />
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowRangeAllocateModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  style={s.submitBtn} 
                  onClick={handleRangeAllocate}
                  disabled={loading}
                >
                  {loading ? 'Allocating...' : 'Allocate Students'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Students Modal */}
      {showStudentsModal && (
        <div style={s.modalOverlay} onClick={() => setShowStudentsModal(false)}>
          <div style={s.modalLarge} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Students in {selectedVenue?.venue_name}</h2>
              <button style={s.closeBtn} onClick={() => setShowStudentsModal(false)}>
                <Close sx={{ fontSize: 24, color: '#64748b' }} />
              </button>
            </div>
            <div style={s.studentsListContainer}>
              {venueStudents.length === 0 ? (
                <div style={s.emptyState}>No students allocated yet</div>
              ) : (
                <table style={s.studentsTable}>
                  <thead>
                    <tr style={s.trHead}>
                      <th style={s.th}>Roll Number</th>
                      <th style={s.th}>Name</th>
                      <th style={s.th}>Department</th>
                      <th style={s.th}>Year/Sem</th>
                      <th style={s.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venueStudents.map(student => (
                      <tr key={student.student_id} style={s.trBody}>
                        <td style={s.td}>{student.rollNumber}</td>
                        <td style={s.td}>{student.name}</td>
                        <td style={s.td}>{student.department}</td>
                        <td style={s.td}>{student.year}/{student.semester}</td>
                        <td style={s.td}>
                          <button
                            style={s.removeBtn}
                            onClick={() => handleRemoveStudent(student.student_id)}
                          >
                            <Delete sx={{ fontSize: 16 }} />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  container: { padding: '0', width: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', position: 'relative' },
  errorBanner: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display:  'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' },
  errorClose: { background: 'none', border: 'none', fontSize: '24px', color: '#991b1b', cursor: 'pointer', padding: '0 8px' },
  loadingOverlay: { position: 'absolute', top: 0, left:  0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, fontSize: '16px', fontWeight: '600', color: '#3b82f6' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' },
  searchWrapper: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius:  '8px', padding: '10px 16px', flex: 1, minWidth: '250px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: '#1e293b', background: 'transparent' },
  filtersWrapper: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  selectWrapper: { position: 'relative', minWidth: '150px' },
  select: { appearance: 'none', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b', padding: '10px 40px 10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%', outline: 'none' },
  selectArrow: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' },
  addBtn: { display: 'flex', alignItems:  'center', gap: '8px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', whiteSpace: 'nowrap' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', position: 'relative' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
  trHead: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '16px', fontSize: '12px', color: '#64748b', textAlign: 'left', textTransform: 'uppercase' },
  trBody: { borderBottom: '1px solid #f1f5f9' },
  td: { padding:  '16px 24px', fontSize: '14px', color: '#334155' },
  venueCell: { display: 'flex', flexDirection: 'column', gap:  '4px' },
  venueName: { fontWeight: '700', color: '#0f172a', fontSize: '15px' },
  venueLocation: { fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap:  '4px' },
  facultyCell: { display: 'flex', alignItems: 'center', gap:  '12px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0 },
  facultyName: { fontWeight: '600', color: '#1e293b', fontSize: '14px' },
  facultyDept: { fontSize: '12px', color: '#64748b' },
  noFaculty: { color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' },
  capacityCell: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
  statusActive: { backgroundColor: '#16A34A', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
  statusInactive: { backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display:  'inline-block' },
  actionCell: { position: 'relative' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems:  'center', justifyContent: 'center' },
  actionMenu: { position: 'absolute', right: '0', top: '100%', marginTop: '4px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', zIndex: 100, minWidth: '200px', overflow: 'hidden' },
  menuItem: { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#334155', textAlign: 'left', transition: 'background-color 0.15s' },
  menuItemDelete: { display: 'flex', alignItems:  'center', gap: '8px', width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#ef4444', textAlign: 'left', transition: 'background-color 0.15s', borderTop: '1px solid #f1f5f9' },
  pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e2e8f0', backgroundColor:  '#fafafa', flexWrap: 'wrap', gap: '12px' },
  paginationText: { fontSize: '14px', color: '#64748b' },
  paginationBtns: { display: 'flex', gap: '12px' },
  pageBtn: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#334155', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  pageBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor:  'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { backgroundColor: '#ffffff', borderRadius: '12px', width:  '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
  modalLarge: { backgroundColor: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #e2e8f0' },
  modalTitle: { fontSize:  '20px', fontWeight: '700', color: '#0f172a', margin: 0 },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems:  'center', justifyContent:  'center' },
  form: { padding: '24px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#334155' },
  labelHint: { fontSize: '12px', fontWeight: '500', color: '#94a3b8', marginLeft: '8px' },
  input: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  selectModal: { appearance: 'none', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b', padding: '10px 40px 10px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', width: '100%', outline: 'none' },
  uploadInstructions: { backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '8px', marginBottom: '20px' },
  instructionTitle: { fontSize: '14px', fontWeight: '600', color: '#0369a1', marginBottom: '8px', margin: 0 },
  instructionText: { fontSize: '13px', color: '#075985', fontFamily: 'monospace', margin: '8px 0' },
  instructionNote: { fontSize: '12px', color: '#0c4a6e', margin: '8px 0 0 0', lineHeight: '1.5' },
  fileInput: { padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  fileName: { fontSize: '13px', color: '#10b981', fontWeight: '500', marginTop: '8px' },
  downloadTemplateBtn: { marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  infoBox: { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' },
  infoTitle: { fontSize:  '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' },
  infoText: { fontSize: '13px', color:  '#64748b', margin: 0 },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' },
  cancelBtn: { padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#64748b', backgroundColor: '#ffffff', cursor: 'pointer' },
  submitBtn: { padding: '10px 20px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#ffffff', backgroundColor: '#3b82f6', cursor: 'pointer' },
  studentsListContainer: { padding: '24px', maxHeight: '500px', overflowY: 'auto' },
  studentsTable: { width: '100%', borderCollapse: 'collapse' },
  emptyState: { textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '15px' },
  removeBtn: { display: 'flex', alignItems:  'center', gap: '4px', padding: '6px 12px', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },

  // Result Modal Styles
  resultModal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '400px',
    padding: '40px 32px',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  resultIconContainer: {
    marginBottom: '24px'
  },
  resultTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '12px'
  },
  resultMessage: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '28px'
  },
  resultBtnSuccess: {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight:  '600',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
  },
  resultBtnError: {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)' },
 currentFacultyBox: { backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #bae6fd' }, currentLabel: { fontSize: '13px', fontWeight: '700', color: '#0369a1', marginBottom: '12px' }, loadingBox: { padding: '40px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '8px' }, emptyBox: { padding: '40px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '8px' }, facultyCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0f2fe' }, facultyCardHeader: { display: 'flex', alignItems: 'center', gap: '12px' }, facultyCardInfo: { display: 'flex', flexDirection: 'column', gap: '4px' }, facultyCardName: { fontSize: '15px', fontWeight: '700', color: '#0f172a' }, facultyCardDept: { fontSize: '13px', color: '#64748b' }, workloadBadge: (count) => ({ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', backgroundColor: count === 0 ? '#d1fae5' : count === 1 ? '#dbeafe' : '#fef3c7', color: count === 0 ? '#065f46' : count === 1 ? '#1e40af' : '#92400e' }), facultyListContainer: { maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fafafa' }, facultyListItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: '#fff' }, facultyListItemSelected: { backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6' }, facultyListLeft: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }, facultyListInfo: { display: 'flex', flexDirection: 'column', gap: '4px' }, facultyListName: { fontSize: '15px', fontWeight: '600', color: '#0f172a' }, facultyListDept: { fontSize: '13px', color: '#64748b' }, facultyListVenues: { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }, facultyListRight: { display: 'flex', alignItems: 'center', gap: '12px' }, workloadBadgeSmall: (count) => ({ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap', backgroundColor: count === 0 ? '#d1fae5' : '#fef3c7', color: count === 0 ? '#065f46' : '#92400e' }), selectedCheckmark: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700' } };

export default GroupsClasses;
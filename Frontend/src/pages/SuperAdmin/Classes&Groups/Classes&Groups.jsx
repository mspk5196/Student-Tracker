import React, { useState, useRef, useEffect } from 'react';
import { Search, KeyboardArrowDown, MoreVert, Edit, Delete, Add, Groups, Upload, AutoAwesome, Close } from '@mui/icons-material';
import useAuthStore from '../../../store/useAuthStore';

const GroupsClasses = () => {
  const { token } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL;

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [venues, setVenues] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const menuRef = useRef(null);
  const itemsPerPage = 5;

  const [newGroup, setNewGroup] = useState({
    group_code: '',
    group_name: '',
    venue_id: '',
    faculty_id: '',
    schedule_days: '',
    schedule_time: '',
    max_students: 50,
    department: '',
    status: 'Active'
  });

  const departments = [... new Set(groups.map(g => g.department))];

  const fetchGroups = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/groups`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) setGroups(data.data);
      else setError(data.message || 'Failed to fetch groups');
    } catch (err) {
      setError('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await fetch(`${API_URL}/groups/venues`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) setVenues(data.data);
    } catch (err) {}
  };

  const fetchFaculties = async () => {
    try {
      const response = await fetch(`${API_URL}/groups/faculties`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) setFaculties(data.data);
    } catch (err) {}
  };

  useEffect(() => {
    if (token) {
      fetchGroups();
      fetchVenues();
      fetchFaculties();
    }
  }, [token]);

  const filteredData = groups.filter(g => {
    const matchesSearch = g.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         g.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         g.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !deptFilter || g.department === deptFilter;
    const matchesStatus = !statusFilter || g.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
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

  const toggleMenu = (id) => setActiveMenu(activeMenu === id ? null : id);
  const handleEdit = (g) => { setEditingGroup(g); setActiveMenu(null); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this group?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) { await fetchGroups(); alert('Group deleted successfully!'); }
      else setError(data.message || 'Failed to delete group');
    } catch (err) { setError('Failed to delete group'); }
    finally { setLoading(false); setActiveMenu(null); }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups/${editingGroup.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venue_id: editingGroup.venue_id,
          schedule_days: editingGroup.schedule.split(' ')[0] + ' ' + editingGroup.schedule.split(' ')[1],
          schedule_time: editingGroup.schedule.split(' ').slice(2).join(' '),
          status: editingGroup.status,
          max_students: editingGroup.total
        })
      });
      const data = await response.json();
      if (data.success) { await fetchGroups(); setEditingGroup(null); alert('Group updated successfully!'); }
      else setError(data.message || 'Failed to update group');
    } catch (err) { setError('Failed to update group'); }
    finally { setLoading(false); }
  };

  const handleCreateGroup = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup)
      });
      const data = await response.json();
      if (data.success) {
        await fetchGroups();
        setShowCreateModal(false);
        setNewGroup({ group_code: '', group_name: '', venue_id: '', faculty_id: '', schedule_days: '', schedule_time: '', max_students: 50, department: '', status: 'Active' });
        alert('Group created successfully!');
      } else setError(data.message || 'Failed to create group');
    } catch (err) { setError('Failed to create group'); }
    finally { setLoading(false); }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await fetch(`${API_URL}/groups/bulk-upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (data.success) { setShowBulkUploadModal(false); setSelectedFile(null); alert(data.message); }
      else setError(data.message || 'Failed to upload file');
    } catch (err) { setError('Failed to upload file'); }
    finally { setLoading(false); }
  };

  const handleAutoAllocate = async (groupId) => {
    if (!window.confirm('Auto-allocate students?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/auto-allocate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) { await fetchGroups(); alert(data.message); }
      else setError(data.message || 'Failed to allocate students');
    } catch (err) { setError('Failed to allocate students'); }
    finally { setLoading(false); setActiveMenu(null); }
  };

  return (
    <div style={s.container}>
      {error && (
        <div style={s.errorBanner}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={s.errorClose}>×</button>
        </div>
      )}

      <div style={s.topBar}>
        <div style={s.searchWrapper}>
          <Search sx={{ color: '#94a3b8', fontSize: 22 }} />
          <input type="text" placeholder="Search classes..." style={s.searchInput} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <div style={s.filtersWrapper}>
          <div style={s.selectWrapper}>
            <select style={s.select} value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">Department</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
          </div>
          <button style={s.uploadBtn} onClick={() => setShowBulkUploadModal(true)}><Upload sx={{ fontSize: 20 }} /><span>Bulk Upload</span></button>
          <button style={s.addBtn} onClick={() => setShowCreateModal(true)}><Add sx={{ fontSize: 20 }} /><span>Create Group</span></button>
        </div>
      </div>

      <div style={s.tableCard}>
        {loading && <div style={s.loadingOverlay}>Loading...</div>}
        <div style={s.tableWrapper}>
          <table style={s.table}>
            <thead>
              <tr style={s.trHead}>
                <th style={s.th}>Group Name & Code</th>
                <th style={s.th}>Faculty</th>
                <th style={s.th}>Schedule</th>
                <th style={s.th}>Students</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(g => (
                <tr key={g.id} style={s.trBody}>
                  <td style={s.td}><div style={s.groupNameCell}><div style={s.groupCode}>{g.code}</div><div style={s.venueName}>{g.venue}</div></div></td>
                  <td style={s.td}><div style={s.facultyCell}><div style={s.avatar}>{g.faculty.charAt(0)}</div><span style={s.facultyName}>{g.faculty}</span></div></td>
                  <td style={s.td}><div style={s.scheduleText}>{g.schedule.split(' ')[0]}</div><div style={s.scheduleTime}>{g.schedule.split(' ').slice(2).join(' ')}</div></td>
                  <td style={s.td}><div style={{justifyContent:"start", display:'flex' , alignItems:'center'}}><Groups sx={{ fontSize: 18 }} /><span style={{marginLeft:'10px'}} >{g.students} / {g.total}</span></div></td>
                  <td style={s.td}><span style={g.status === 'Active' ? s.statusActive : s.statusInactive}>{g.status}</span></td>
                  <td style={s.td}>
                    <div style={s.actionCell}>
                      <button style={s.actionBtn} onClick={() => toggleMenu(g.id)}><MoreVert sx={{ fontSize: 18 }} /></button>
                      {activeMenu === g.id && (
                        <div ref={menuRef} style={s.actionMenu}>
                          <button style={s.menuItem} onClick={() => handleEdit(g)}><Edit sx={{ fontSize: 16 }} /><span>Edit</span></button>
                          <button style={s.menuItem} onClick={() => handleAutoAllocate(g.id)}><AutoAwesome sx={{ fontSize: 16, color: '#3b82f6' }} /><span>Auto Allocate</span></button>
                          <button style={s.menuItemDelete} onClick={() => handleDelete(g.id)}><Delete sx={{ fontSize: 16 }} /><span>Delete</span></button>
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
          <div style={s.paginationText}>Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, filteredData.length)} of {filteredData.length}</div>
          <div style={s.paginationBtns}>
            <button style={{...s.pageBtn, ...(currentPage === 1 ? s.pageBtnDisabled : {})}} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
            <button style={{...s.pageBtn, ...(currentPage === totalPages ? s.pageBtnDisabled : {})}} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      </div>

      {/* Edit Group Modal (Fixed Arrow Positioning) */}
      {editingGroup && (
        <div style={s.modalOverlay} onClick={() => setEditingGroup(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Edit Schedule</h2>
              <button style={s.closeBtn} onClick={() => setEditingGroup(null)}><Close sx={{ fontSize: 24 }} /></button>
            </div>
            <div style={s.form}>
              <div style={{ ...s.formGroup, marginBottom: '20px' }}>
                <label style={s.label}>Venue *</label>
                <div style={s.selectWrapper}>
                  <select style={s.selectModal} value={editingGroup.venue_id} onChange={(e) => setEditingGroup({...editingGroup, venue_id: e.target.value})}>
                    {venues.map(v => (<option key={v.venue_id} value={v.venue_id}>{v.venue_name}</option>))}
                  </select>
                  <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div style={{ ...s.formGroup, marginBottom: '20px' }}>
                <label style={s.label}>Schedule *</label>
                <input style={s.input} value={editingGroup.schedule} onChange={(e) => setEditingGroup({...editingGroup, schedule: e.target.value})} />
              </div>
              <div style={{ ...s.formGroup, marginBottom: '20px' }}>
                <label style={s.label}>Max Students *</label>
                <input type="number" style={s.input} value={editingGroup.total} onChange={(e) => setEditingGroup({...editingGroup, total: parseInt(e.target.value)})} />
              </div>
              <div style={{ ...s.formGroup, marginBottom: '20px' }}>
                <label style={s.label}>Status *</label>
                <div style={s.selectWrapper}>
                  <select style={s.selectModal} value={editingGroup.status} onChange={(e) => setEditingGroup({...editingGroup, status: e.target.value})}>
                    <option value="Active">Active</option>
                    <option value="Review">Review</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => setEditingGroup(null)}>Cancel</button>
                <button type="button" style={s.submitBtn} onClick={handleUpdate} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal and Upload Modal remain same... */}
      {showCreateModal && (
        <div style={s.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div style={s.modalLarge} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Create New Group</h2>
              <button style={s.closeBtn} onClick={() => setShowCreateModal(false)}><Close sx={{ fontSize: 24 }} /></button>
            </div>
            <div style={s.form}>
              <div style={s.formGrid}>
                <div style={s.formGroup}><label style={s.label}>Group Code *</label><input style={s.input} value={newGroup.group_code} onChange={(e) => setNewGroup({...newGroup, group_code: e.target.value})} /></div>
                <div style={s.formGroup}><label style={s.label}>Group Name *</label><input style={s.input} value={newGroup.group_name} onChange={(e) => setNewGroup({...newGroup, group_name: e.target.value})} /></div>
                <div style={s.formGroup}>
                  <label style={s.label}>Venue *</label>
                  <div style={s.selectWrapper}>
                    <select style={s.selectModal} value={newGroup.venue_id} onChange={(e) => setNewGroup({...newGroup, venue_id: e.target.value})}>
                      <option value="">Select Venue</option>
                      {venues.map(v => (<option key={v.venue_id} value={v.venue_id}>{v.venue_name}</option>))}
                    </select>
                    <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
                  </div>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Faculty *</label>
                  <div style={s.selectWrapper}>
                    <select style={s.selectModal} value={newGroup.faculty_id} onChange={(e) => setNewGroup({...newGroup, faculty_id: e.target.value})}>
                      <option value="">Select Faculty</option>
                      {faculties.map(f => (<option key={f.faculty_id} value={f.faculty_id}>{f.faculty_name}</option>))}
                    </select>
                    <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
                  </div>
                </div>
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="button" style={s.submitBtn} onClick={handleCreateGroup}>{loading ? 'Creating...' : 'Create'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBulkUploadModal && (
        <div style={s.modalOverlay} onClick={() => setShowBulkUploadModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Bulk Upload</h2>
              <button style={s.closeBtn} onClick={() => setShowBulkUploadModal(false)}><Close sx={{ fontSize: 24 }} /></button>
            </div>
            <div style={s.form}>
              <input type="file" accept=".csv" onChange={(e) => setSelectedFile(e.target.files[0])} style={s.fileInput} />
              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowBulkUploadModal(false)}>Cancel</button>
                <button type="button" style={s.submitBtn} onClick={handleBulkUpload} disabled={!selectedFile}>Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  container: { padding: '0', width: '100%', fontFamily: 'sans-serif', position: 'relative' },
  errorBanner: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' },
  errorClose: { background: 'none', border: 'none', cursor: 'pointer' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' },
  searchWrapper: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', flex: '1 1 300px' },
  searchInput: { border: 'none', outline: 'none', width: '100%' },
  filtersWrapper: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  selectWrapper: { position: 'relative', width: '100%' },
  select: { appearance: 'none', backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '10px 35px 10px 12px', borderRadius: '8px', width: '100%', outline: 'none' },
  selectArrow: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' },
  uploadBtn: { display: 'flex', gap: '8px', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' },
  addBtn: { display: 'flex', gap: '8px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '800px' },
  trHead: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '16px', fontSize: '12px', color: '#64748b', textAlign: 'left', textTransform: 'uppercase' },
  trBody: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '16px', fontSize: '14px' },
  groupNameCell: { display: 'flex', flexDirection: 'column' },
  groupCode: { fontWeight: '600' },
  venueName: { fontSize: '12px', color: '#64748b' },
  facultyCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statusActive: { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' },
  statusInactive: { backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' },
  actionCell: { position: 'relative' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer' },
  actionMenu: { position: 'absolute', right: 0, top: '100%', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', zIndex: 100, minWidth: '160px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  menuItem: { display: 'flex', gap: '8px', padding: '10px', width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' },
  menuItemDelete: { display: 'flex', gap: '8px', padding: '10px', width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', borderTop: '1px solid #f1f5f9' },
  pagination: { display: 'flex', justifyContent: 'space-between', padding: '16px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' },
  paginationBtns: { display: 'flex', gap: '8px' },
  pageBtn: { padding: '6px 12px', border: '1px solid #e2e8f0', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer' },
  pageBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '15px' },
  modal: { backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '450px' },
  modalLarge: { backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #e2e8f0' },
  modalTitle: { margin: 0, fontSize: '18px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer' },
  form: { padding: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
  label: { fontSize: '14px', fontWeight: '600' },
  input: { padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' },
  selectModal: { appearance: 'none', backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '10px 35px 10px 12px', borderRadius: '8px', width: '100%', outline: 'none' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  cancelBtn: { padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer' },
  submitBtn: { padding: '10px 20px', border: 'none', borderRadius: '8px', background: '#3b82f6', color: '#fff', cursor: 'pointer' },
  fileInput: { width: '100%' }
};

export default GroupsClasses;
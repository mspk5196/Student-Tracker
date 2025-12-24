import React, { useState, useRef, useEffect } from 'react';
import { Search, KeyboardArrowDown, MoreVert, Edit, Delete, Add, Groups, Upload, AutoAwesome } from '@mui/icons-material';
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
  const [selectedGroupForAllocation, setSelectedGroupForAllocation] = useState(null);

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

  // Fetch groups
  const fetchGroups = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/groups`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setGroups(data.data);
      } else {
        setError(data.message || 'Failed to fetch groups');
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  // Fetch venues
  const fetchVenues = async () => {
    try {
      const response = await fetch(`${API_URL}/groups/venues`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setVenues(data.data);
      }
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  };

  // Fetch faculties
  const fetchFaculties = async () => {
    try {
      const response = await fetch(`${API_URL}/groups/faculties`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response. json();
      if (data.success) {
        setFaculties(data.data);
      }
    } catch (err) {
      console.error('Error fetching faculties:', err);
    }
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
                         g.event. toLowerCase().includes(searchTerm. toLowerCase()) || 
                         g.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = ! deptFilter || g.department === deptFilter;
    const matchesStatus = !statusFilter || g.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef. current.contains(e.target)) setActiveMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (id) => setActiveMenu(activeMenu === id ?  null : id);

  const handleEdit = (g) => { 
    setEditingGroup(g); 
    setActiveMenu(null); 
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this group?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups/${id}`, {
        method: 'DELETE',
        headers:  {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        await fetchGroups();
        alert('Group deleted successfully! ');
      } else {
        setError(data.message || 'Failed to delete group');
      }
    } catch (err) {
      console.error('Error deleting group:', err);
      setError('Failed to delete group');
    } finally {
      setLoading(false);
      setActiveMenu(null);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups/${editingGroup.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          venue_id: editingGroup.venue_id,
          schedule_days: editingGroup.schedule. split(' ')[0] + ' ' + editingGroup.schedule.split(' ')[1],
          schedule_time: editingGroup.schedule.split(' ').slice(2).join(' '),
          status: editingGroup.status,
          max_students: editingGroup.total
        })
      });

      const data = await response.json();
      if (data.success) {
        await fetchGroups();
        setEditingGroup(null);
        alert('Group updated successfully!');
      } else {
        setError(data.message || 'Failed to update group');
      }
    } catch (err) {
      console.error('Error updating group:', err);
      setError('Failed to update group');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGroup)
      });

      const data = await response.json();
      if (data.success) {
        await fetchGroups();
        setShowCreateModal(false);
        setNewGroup({
          group_code: '',
          group_name:  '',
          venue_id: '',
          faculty_id: '',
          schedule_days: '',
          schedule_time: '',
          max_students: 50,
          department: '',
          status: 'Active'
        });
        alert('Group created successfully!');
      } else {
        setError(data.message || 'Failed to create group');
      }
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_URL}/groups/bulk-upload`, {
        method: 'POST',
        headers:  {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setShowBulkUploadModal(false);
        setSelectedFile(null);
        alert(data.message);
      } else {
        setError(data.message || 'Failed to upload file');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAllocate = async (groupId) => {
    if (!window.confirm('Auto-allocate students to this group based on skills?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/auto-allocate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        await fetchGroups();
        alert(data.message);
      } else {
        setError(data. message || 'Failed to allocate students');
      }
    } catch (err) {
      console.error('Error allocating students:', err);
      setError('Failed to allocate students');
    } finally {
      setLoading(false);
      setActiveMenu(null);
    }
  };

  return (
    <div style={s.container}>
      {error && (
        <div style={s. errorBanner}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={s.errorClose}>×</button>
        </div>
      )}

      <div style={s.topBar}>
        <div style={s.searchWrapper}>
          <Search sx={{ color: '#94a3b8', fontSize: 22 }} />
          <input 
            type="text" 
            placeholder="Search classes, code or faculty..." 
            style={s.searchInput} 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          />
        </div>
        <div style={s.filtersWrapper}>
          <div style={s.selectWrapper}>
            <select 
              style={s.select} 
              value={deptFilter} 
              onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Department</option>
              {departments. map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
          </div>
          <div style={s. selectWrapper}>
            <select 
              style={s.select} 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Review">Review</option>
              <option value="Inactive">Inactive</option>
            </select>
            <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
          </div>
          <button style={s.uploadBtn} onClick={() => setShowBulkUploadModal(true)}>
            <Upload sx={{ fontSize:  20 }} />
            <span>Bulk Upload Students</span>
          </button>
          <button style={s.addBtn} onClick={() => setShowCreateModal(true)}>
            <Add sx={{ fontSize: 20 }} />
            <span>Create New Group</span>
          </button>
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
                  <td style={s.td}>
                    <div style={s.groupNameCell}>
                      <div style={s.groupCode}>{g.code}</div>
                      <div style={s.venueName}>{g.venue}</div>
                      <div style={s.eventName}>{g.event}</div>
                    </div>
                  </td>
                  <td style={s.td}>
                    <div style={s.facultyCell}>
                      <div style={s.avatar}>{g.faculty. charAt(0)}</div>
                      <span style={s.facultyName}>{g.faculty}</span>
                    </div>
                  </td>
                  <td style={s.td}>
                    <div style={s.scheduleText}>
                      {g.schedule.split(' ')[0]} {g.schedule.split(' ')[1]}
                    </div>
                    <div style={s.scheduleTime}>
                      {g.schedule. split(' ').slice(2).join(' ')}
                    </div>
                  </td>
                  <td style={s.td}>
                    <div style={s.studentsCell}>
                      <Groups sx={{ fontSize: 18, color: '#94a3b8' }} />
                      <span>{g.students} / {g.total}</span>
                    </div>
                  </td>
                  <td style={s. td}>
                    <span style={
                      g.status === 'Active' 
                        ? s.statusActive 
                        : g.status === 'Review' 
                        ? s.statusReview 
                        : s.statusInactive
                    }>
                      {g.status}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={s.actionCell}>
                      <button style={s.actionBtn} onClick={() => toggleMenu(g.id)}>
                        <MoreVert sx={{ fontSize: 18, color: '#64748b' }} />
                      </button>
                      {activeMenu === g.id && (
                        <div ref={menuRef} style={s.actionMenu}>
                          <button 
                            style={s.menuItem} 
                            onClick={() => handleEdit(g)} 
                            onMouseEnter={(e) => e.currentTarget. style.backgroundColor = '#f8fafc'} 
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Edit sx={{ fontSize: 16 }} />
                            <span>Edit</span>
                          </button>
                          <button 
                            style={s.menuItem} 
                            onClick={() => handleAutoAllocate(g.id)} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'} 
                            onMouseLeave={(e) => e.currentTarget.style. backgroundColor = 'transparent'}
                          >
                            <AutoAwesome sx={{ fontSize: 16, color: '#3b82f6' }} />
                            <span style={{color: '#3b82f6'}}>Auto Allocate</span>
                          </button>
                          <button 
                            style={s.menuItemDelete} 
                            onClick={() => handleDelete(g.id)} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'} 
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
            Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, filteredData.length)} of {filteredData.length} groups
          </div>
          <div style={s.paginationBtns}>
            <button 
              style={{... s.pageBtn, ...(currentPage === 1 ?  s.pageBtnDisabled : {})}} 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button 
              style={{...s.pageBtn, ...(currentPage === totalPages ? s.pageBtnDisabled : {})}} 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div style={s.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div style={s.modalLarge} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Create New Group</h2>
              <button style={s.closeBtn} onClick={() => setShowCreateModal(false)}>
                <Delete sx={{ fontSize: 24, color: '#64748b' }} />
              </button>
            </div>
            <div style={s.form}>
              <div style={s.formGrid}>
                <div style={s.formGroup}>
                  <label style={s.label}>Group Code *</label>
                  <input
                    style={s.input}
                    value={newGroup.group_code}
                    onChange={(e) => setNewGroup({... newGroup, group_code: e.target.value})}
                    placeholder="e.g., CS-101"
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Group Name *</label>
                  <input
                    style={s.input}
                    value={newGroup.group_name}
                    onChange={(e) => setNewGroup({...newGroup, group_name: e.target. value})}
                    placeholder="e.g., Full-Stack Workshop"
                  />
                </div>
              </div>

              <div style={s.formGrid}>
                <div style={s.formGroup}>
                  <label style={s.label}>Venue *</label>
                  <div style={s.selectWrapper}>
                    <select
                      style={s.selectModal}
                      value={newGroup.venue_id}
                      onChange={(e) => setNewGroup({...newGroup, venue_id: e.target.value})}
                    >
                      <option value="">Select Venue</option>
                      {venues.map(v => (
                        <option key={v.venue_id} value={v.venue_id}>{v.venue_name}</option>
                      ))}
                    </select>
                    <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
                  </div>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Faculty *</label>
                  <div style={s.selectWrapper}>
                    <select
                      style={s.selectModal}
                      value={newGroup. faculty_id}
                      onChange={(e) => setNewGroup({...newGroup, faculty_id: e.target.value})}
                    >
                      <option value="">Select Faculty</option>
                      {faculties.map(f => (
                        <option key={f.faculty_id} value={f.faculty_id}>
                          {f.faculty_name} - {f.department}
                        </option>
                      ))}
                    </select>
                    <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
                  </div>
                </div>
              </div>

              <div style={s.formGrid}>
                <div style={s.formGroup}>
                  <label style={s.label}>Schedule Days *</label>
                  <input
                    style={s.input}
                    value={newGroup.schedule_days}
                    onChange={(e) => setNewGroup({...newGroup, schedule_days: e.target.value})}
                    placeholder="e.g., Mon, Wed"
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Schedule Time *</label>
                  <input
                    style={s.input}
                    value={newGroup.schedule_time}
                    onChange={(e) => setNewGroup({...newGroup, schedule_time: e.target.value})}
                    placeholder="e.g., 10:00 - 11:30"
                  />
                </div>
              </div>

              <div style={s.formGrid}>
                <div style={s.formGroup}>
                  <label style={s.label}>Department *</label>
                  <input
                    style={s.input}
                    value={newGroup.department}
                    onChange={(e) => setNewGroup({... newGroup, department: e.target.value})}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Max Students *</label>
                  <input
                    type="number"
                    style={s.input}
                    value={newGroup.max_students}
                    onChange={(e) => setNewGroup({...newGroup, max_students: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  style={s.submitBtn} 
                  onClick={handleCreateGroup}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {editingGroup && (
        <div style={s.modalOverlay} onClick={() => setEditingGroup(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Edit Schedule</h2>
              <button style={s.closeBtn} onClick={() => setEditingGroup(null)}>
                <Delete sx={{ fontSize: 24, color: '#64748b' }} />
              </button>
            </div>
            <div style={s. form}>
              <div style={s.formGroup}>
                <label style={s.label}>Venue *</label>
                <div style={s.selectWrapper}>
                  <select 
                    style={s.selectModal} 
                    value={editingGroup.venue_id} 
                    onChange={(e) => setEditingGroup({...editingGroup, venue_id: e.target.value})}
                  >
                    {venues.map(v => (
                      <option key={v. venue_id} value={v. venue_id}>{v.venue_name}</option>
                    ))}
                  </select>
                  <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Schedule *</label>
                <input
                  style={s.input}
                  value={editingGroup.schedule}
                  onChange={(e) => setEditingGroup({...editingGroup, schedule: e.target.value})}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s. label}>Max Students *</label>
                <input
                  type="number"
                  style={s.input}
                  value={editingGroup.total}
                  onChange={(e) => setEditingGroup({...editingGroup, total: parseInt(e.target.value)})}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Status *</label>
                <div style={s.selectWrapper}>
                  <select 
                    style={s.selectModal} 
                    value={editingGroup.status} 
                    onChange={(e) => setEditingGroup({...editingGroup, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Review">Review</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => setEditingGroup(null)}>
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

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div style={s.modalOverlay} onClick={() => setShowBulkUploadModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Bulk Upload Students</h2>
              <button style={s.closeBtn} onClick={() => setShowBulkUploadModal(false)}>
                <Delete sx={{ fontSize: 24, color: '#64748b' }} />
              </button>
            </div>
            <div style={s.form}>
              <div style={s.uploadInstructions}>
                <p style={s.instructionTitle}>CSV Format Required:</p>
                <p style={s.instructionText}>
                  name, email, studentId, department, year, semester, skills, proficiency_levels
                </p>
                <p style={s.instructionNote}>
                  * Skills and proficiency levels should be comma-separated<br/>
                  * Example: "Python,JavaScript,React" and "Advanced,Intermediate,Beginner"
                </p>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Select CSV File *</label>
                <input
                  type="file"
                  accept=".csv"
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
                  {loading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  container: { padding: '0', width: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', position: 'relative' },
  errorBanner: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' },
  errorClose: { background: 'none', border: 'none', fontSize: '24px', color: '#991b1b', cursor: 'pointer', padding: '0 8px' },
  loadingOverlay: { position: 'absolute', top: 0, left:  0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, fontSize: '16px', fontWeight: '600', color: '#3b82f6' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' },
  searchWrapper: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding:  '10px 16px', flex: 1, minWidth: '250px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: '#1e293b', background: 'transparent' },
  filtersWrapper: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  selectWrapper: { position: 'relative', minWidth: '150px' },
  select: { appearance: 'none', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b', padding: '10px 40px 10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%', outline: 'none' },
  selectArrow: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' },
  uploadBtn: { display: 'flex', alignItems:  'center', gap: '8px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', whiteSpace: 'nowrap' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor:  '#3b82f6', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor:  'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', whiteSpace: 'nowrap' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', position: 'relative' },
  tableWrapper: { overflowX: 'auto' },
  table: { width:  '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
  trHead: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' },
  trBody: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '16px 24px', fontSize: '14px', color: '#334155' },
  groupNameCell: { display: 'flex', flexDirection: 'column', gap:  '2px' },
  groupCode: { fontWeight: '600', color: '#0f172a' },
  venueName: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  eventName: { fontSize: '12px', color: '#94a3b8' },
  facultyCell: { display: 'flex', alignItems: 'center', gap:  '12px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor:  '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0 },
  facultyName: { fontWeight: '500', color: '#1e293b' },
  scheduleText: { fontWeight: '500', color: '#1e293b' },
  scheduleTime: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  studentsCell: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' },
  statusActive: { backgroundColor: '#16A34A', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
  statusReview: { backgroundColor: '#F59E0B', color: 'black', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
  statusInactive: { backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display:  'inline-block' },
  actionCell: { position: 'relative' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems:  'center', justifyContent: 'center' },
  actionMenu: { position: 'absolute', right: '0', top: '100%', marginTop: '4px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius:  '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', zIndex: 100, minWidth: '180px', overflow: 'hidden' },
  menuItem: { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#334155', textAlign: 'left', transition: 'background-color 0.15s' },
  menuItemDelete: { display: 'flex', alignItems:  'center', gap: '8px', width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#ef4444', textAlign: 'left', transition: 'background-color 0.15s', borderTop: '1px solid #f1f5f9' },
  pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fafafa', flexWrap: 'wrap', gap: '12px' },
  paginationText: { fontSize: '14px', color: '#64748b' },
  paginationBtns: { display: 'flex', gap: '12px' },
  pageBtn: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#334155', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  pageBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor:  'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { backgroundColor:  '#ffffff', borderRadius: '12px', width: '100%', maxWidth:  '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
  modalLarge: { backgroundColor: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #e2e8f0' },
  modalTitle: { fontSize:  '20px', fontWeight: '700', color: '#0f172a', margin: 0 },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems:  'center', justifyContent:  'center' },
  form: { padding: '24px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap:  '20px', marginBottom: '20px' },
  formGroup: { display:  'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight:  '600', color: '#334155' },
  input: { padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius:  '8px', fontSize: '14px', outline: 'none' },
  selectModal: { appearance: 'none', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b', padding: '10px 40px 10px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', width: '100%', outline: 'none' },
  uploadInstructions: { backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '8px', marginBottom: '20px' },
  instructionTitle: { fontSize: '14px', fontWeight: '600', color: '#0369a1', marginBottom: '8px', margin: 0 },
  instructionText: { fontSize: '13px', color: '#075985', fontFamily: 'monospace', margin: '8px 0' },
  instructionNote: { fontSize: '12px', color: '#0c4a6e', margin: '8px 0 0 0', lineHeight: '1.5' },
  fileInput: { padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  fileName: { fontSize:  '13px', color: '#10b981', fontWeight: '500', marginTop: '8px' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' },
  cancelBtn: { padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight:  '600', color: '#64748b', backgroundColor: '#ffffff', cursor: 'pointer' },
  submitBtn: { padding:  '10px 20px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#ffffff', backgroundColor: '#3b82f6', cursor: 'pointer' }
};

export default GroupsClasses;
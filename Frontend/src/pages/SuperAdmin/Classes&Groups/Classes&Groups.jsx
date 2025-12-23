import React, { useState, useRef, useEffect } from 'react';
import { Search, KeyboardArrowDown, MoreVert, Edit, Delete, Add, Groups } from '@mui/icons-material';

const GROUPS_DATA = [
  { id: 1, code: 'CS-101', venue: 'Learning Centre IV 4th Floor', event: 'Full-Stack Workshop', faculty: 'Dr. Sarah L.', schedule: 'Mon, Wed 10:00 - 11:30', students: 45, total: 50, status: 'Active', department: 'Computer Science' },
  { id: 2, code: 'ENG-204', venue: 'Engineering Lab A', event: 'Thermodynamics Session', faculty: 'Prof. Chen', schedule: 'Tue, Thu 09:00 - 10:30', students: 28, total: 30, status: 'Active', department: 'Engineering' },
  { id: 3, code: 'BUS-301', venue: 'Business Hall 2nd Floor', event: 'Marketing Strategy Seminar', faculty: 'Jessica M.', schedule: 'Mon, Wed 14:00 - 15:30', students: 58, total: 60, status: 'Active', department: 'Business' },
  { id: 4, code: 'CS-102', venue: 'Computer Lab B', event: 'Data Structures Practice', faculty: 'David Kim', schedule: 'Fri 09:00 - 12:00', students: 32, total: 35, status: 'Review', department: 'Computer Science' },
  { id: 5, code: 'ART-105', venue: 'Art Studio Main', event: 'History of Renaissance Art', faculty: 'M. Kowalski', schedule: 'Tue, Thu 13:00 - 14:30', students: 18, total: 25, status: 'Inactive', department: 'Arts' },
  { id: 6, code: 'PHY-201', venue: 'Physics Lab 3rd Floor', event: 'Quantum Mechanics Workshop', faculty: 'Dr. Anderson', schedule: 'Mon, Fri 11:00 - 12:30', students: 22, total: 25, status: 'Active', department: 'Physics' },
  { id: 7, code: 'CHEM-301', venue: 'Chemistry Lab A', event: 'Organic Chemistry Practical', faculty: 'Prof. Martinez', schedule: 'Wed 14:00 - 17:00', students: 15, total: 20, status: 'Active', department: 'Chemistry' },
  { id: 8, code: 'MATH-105', venue: 'Mathematics Building Room 201', event: 'Calculus Tutorial', faculty: 'Dr. Parker', schedule: 'Tue, Thu 10:00 - 11:30', students: 40, total: 45, status: 'Active', department: 'Mathematics' },
  { id: 9, code: 'ENG-305', venue: 'Engineering Workshop', event: 'Robotics Design Lab', faculty: 'Prof. Chen', schedule: 'Mon, Wed 15:00 - 16:30', students: 25, total: 30, status: 'Active', department: 'Engineering' },
  { id: 10, code: 'BIO-202', venue: 'Biology Lab 1st Floor', event: 'Microbiology Practical', faculty: 'Dr. Brown', schedule: 'Thu 09:00 - 12:00', students: 20, total: 25, status: 'Review', department: 'Biology' }
];

const VENUE_OPTIONS = ['Learning Centre IV 4th Floor', 'Engineering Lab A', 'Business Hall 2nd Floor', 'Computer Lab B', 'Art Studio Main', 'Physics Lab 3rd Floor', 'Chemistry Lab A', 'Mathematics Building Room 201'];
const SCHEDULE_OPTIONS = ['Mon, Wed 10:00 - 11:30', 'Tue, Thu 09:00 - 10:30', 'Mon, Wed 14:00 - 15:30', 'Fri 09:00 - 12:00', 'Tue, Thu 13:00 - 14:30', 'Mon, Fri 11:00 - 12:30'];

const GroupsClasses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groups, setGroups] = useState(GROUPS_DATA);
  const menuRef = useRef(null);
  const itemsPerPage = 5;

  const departments = [...new Set(GROUPS_DATA.map(g => g.department))];

  const filteredData = groups.filter(g => {
    const matchesSearch = g.code.toLowerCase().includes(searchTerm.toLowerCase()) || g.event.toLowerCase().includes(searchTerm.toLowerCase()) || g.faculty.toLowerCase().includes(searchTerm.toLowerCase());
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
  const handleDelete = (id) => { if (window.confirm('Delete this group?')) setGroups(groups.filter(g => g.id !== id)); setActiveMenu(null); };
  const handleUpdate = () => { setGroups(groups.map(g => g.id === editingGroup.id ? editingGroup : g)); setEditingGroup(null); };

  return (
    <div style={s.container}>
      <div style={s.topBar}>
        <div style={s.searchWrapper}>
          <Search sx={{ color: '#94a3b8', fontSize: 22 }} />
          <input type="text" placeholder="Search classes, code or faculty..." style={s.searchInput} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <div style={s.filtersWrapper}>
          <div style={s.selectWrapper}>
            <select style={s.select} value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">Department</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
          </div>
          <div style={s.selectWrapper}>
            <select style={s.select} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Review">Review</option>
              <option value="Inactive">Inactive</option>
            </select>
            <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
          </div>
          <button style={s.addBtn}><Add sx={{ fontSize: 20 }} /><span>Create New Group</span></button>
        </div>
      </div>

      <div style={s.tableCard}>
        <div style={s.tableWrapper}>
          <table style={s.table}>
            <thead><tr style={s.trHead}><th style={s.th}>Group Name & Code</th><th style={s.th}>Faculty</th><th style={s.th}>Schedule</th><th style={s.th}>Students</th><th style={s.th}>Status</th><th style={s.th}>Action</th></tr></thead>
            <tbody>
              {currentData.map(g => (
                <tr key={g.id} style={s.trBody}>
                  <td style={s.td}><div style={s.groupNameCell}><div style={s.groupCode}>{g.code}</div><div style={s.venueName}>{g.venue}</div><div style={s.eventName}>{g.event}</div></div></td>
                  <td style={s.td}><div style={s.facultyCell}><div style={s.avatar}>{g.faculty.charAt(0)}</div><span style={s.facultyName}>{g.faculty}</span></div></td>
                  <td style={s.td}><div style={s.scheduleText}>{g.schedule.split(' ')[0]} {g.schedule.split(' ')[1]}</div><div style={s.scheduleTime}>{g.schedule.split(' ').slice(2).join(' ')}</div></td>
                  <td style={s.td}><div style={s.studentsCell}><Groups sx={{ fontSize: 18, color: '#94a3b8' }} /><span>{g.students} / {g.total}</span></div></td>
                  <td style={s.td}><span style={g.status === 'Active' ? s.statusActive : g.status === 'Review' ? s.statusReview : s.statusInactive}>{g.status}</span></td>
                  <td style={s.td}>
                    <div style={s.actionCell}>
                      <button style={s.actionBtn} onClick={() => toggleMenu(g.id)}><MoreVert sx={{ fontSize: 18, color: '#64748b' }} /></button>
                      {activeMenu === g.id && (
                        <div ref={menuRef} style={s.actionMenu}>
                          <button style={s.menuItem} onClick={() => handleEdit(g)} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}><Edit sx={{ fontSize: 16 }} /><span>Edit</span></button>
                          <button style={s.menuItemDelete} onClick={() => handleDelete(g.id)} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}><Delete sx={{ fontSize: 16 }} /><span>Delete</span></button>
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
          <div style={s.paginationText}>Showing {startIdx + 1}-{Math.min(startIdx + itemsPerPage, filteredData.length)} of {filteredData.length} groups</div>
          <div style={s.paginationBtns}>
            <button style={{...s.pageBtn, ...(currentPage === 1 ? s.pageBtnDisabled : {})}} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
            <button style={{...s.pageBtn, ...(currentPage === totalPages ? s.pageBtnDisabled : {})}} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      </div>

      {editingGroup && (
        <div style={s.modalOverlay} onClick={() => setEditingGroup(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}><h2 style={s.modalTitle}>Edit Schedule</h2><button style={s.closeBtn} onClick={() => setEditingGroup(null)}><Delete sx={{ fontSize: 24, color: '#64748b' }} /></button></div>
            <div style={s.form}>
              <div style={s.formGroup}>
                <label style={s.label}>Venue *</label>
                <div style={s.selectWrapper}>
                  <select style={s.selectModal} value={editingGroup.venue} onChange={(e) => setEditingGroup({...editingGroup, venue: e.target.value})}>
                    {VENUE_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Schedule *</label>
                <div style={s.selectWrapper}>
                  <select style={s.selectModal} value={editingGroup.schedule} onChange={(e) => setEditingGroup({...editingGroup, schedule: e.target.value})}>
                    {SCHEDULE_OPTIONS.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                  </select>
                  <KeyboardArrowDown style={s.selectArrow} sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div style={s.modalFooter}>
                <button type="button" style={s.cancelBtn} onClick={() => setEditingGroup(null)}>Cancel</button>
                <button type="button" style={s.submitBtn} onClick={handleUpdate}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  container: { padding: '0', width: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' },
  searchWrapper: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', flex: 1, minWidth: '250px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', width: '100%', color: '#1e293b', background: 'transparent' },
  filtersWrapper: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  selectWrapper: { position: 'relative', minWidth: '150px' },
  select: { appearance: 'none', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#64748b', padding: '10px 40px 10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%', outline: 'none' },
  selectArrow: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', whiteSpace: 'nowrap' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
  trHead: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' },
  trBody: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '16px 24px', fontSize: '14px', color: '#334155' },
  groupNameCell: { display: 'flex', flexDirection: 'column', gap: '2px' },
  groupCode: { fontWeight: '600', color: '#0f172a' },
  venueName: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  eventName: { fontSize: '12px', color: '#94a3b8' },
  facultyCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0 },
  facultyName: { fontWeight: '500', color: '#1e293b' },
  scheduleText: { fontWeight: '500', color: '#1e293b' },
  scheduleTime: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  studentsCell: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' },
  statusActive: { backgroundColor: '#16A34A', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
  statusReview: { backgroundColor: '#F59E0B', color: 'black', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
  statusInactive: { backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
  actionCell: { position: 'relative' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  actionMenu: { position: 'absolute', right: '0', top: '100%', marginTop: '4px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', zIndex: 10, minWidth: '140px', overflow: 'hidden' },
  menuItem: { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#334155', textAlign: 'left', transition: 'background-color 0.15s' },
  menuItemDelete: { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#ef4444', textAlign: 'left', transition: 'background-color 0.15s', borderTop: '1px solid #f1f5f9' },
  pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#fafafa', flexWrap: 'wrap', gap: '12px' },
  paginationText: { fontSize: '14px', color: '#64748b' },
  paginationBtns: { display: 'flex', gap: '12px' },
  pageBtn: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#334155', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  pageBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { backgroundColor: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #e2e8f0' },
  modalTitle: { fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  form: { padding: '24px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#334155' },
  selectModal: { appearance: 'none', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b', padding: '10px 40px 10px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', width: '100%', outline: 'none' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' },
  cancelBtn: { padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#64748b', backgroundColor: '#ffffff', cursor: 'pointer' },
  submitBtn: { padding: '10px 20px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#ffffff', backgroundColor: '#3b82f6', cursor: 'pointer' }
};

export default GroupsClasses;
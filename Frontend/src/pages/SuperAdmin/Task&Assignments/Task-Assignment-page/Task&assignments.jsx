import React, { useState, useMemo } from 'react';
import {
  PlusCircle,
  Search,
  Filter,
  RotateCw,
  MoreHorizontal,
  CloudUpload,
  Send,
  Calendar,
  ChevronDown
} from 'lucide-react';

/* ---------------- STATIC MASTER DATA ---------------- */

const INITIAL_ASSIGNMENTS = [
  { id: 1, title: 'Sorting Algorithms Impl.', score: 50, group: 'CS-201', dueDate: '2024-10-30', status: 'Active' },
  { id: 2, title: 'Database Design Schema', score: 100, group: 'CS-305', dueDate: '2024-11-05', status: 'Active' },
  { id: 3, title: 'Week 4: Reading Quiz', score: 20, group: 'ENG-101', dueDate: '2024-10-12', status: 'Closed' },
];

const CLASSES = ['CS-201', 'CS-305', 'ENG-101', 'PHY-102', 'CS-400'];

const AssignmentDashboard = () => {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active');

  /* -------- FORM STATE -------- */
  const [title, setTitle] = useState('');
  const [group, setGroup] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [score, setScore] = useState(100);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

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
    setDescription('');
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
      score,
      dueDate,
      status: 'Active',
      resources: files
    };

    setAssignments(prev => [newAssignment, ...prev]);
    resetForm();
    alert('Assignment Published!');
  };

  /* -------- STATUS ACTION -------- */
  const closeAssignment = (id) => {
    setAssignments(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'Closed' } : a)
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
              <input style={styles.textInput} value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Target Class / Group *</label>
              <div style={styles.relativeWrapper}>
                <select style={styles.selectInput} value={group} onChange={e => setGroup(e.target.value)}>
                  <option value="" hidden>Select a class...</option>
                  {CLASSES.map(cls => <option key={cls}>{cls}</option>)}
                </select>
                <ChevronDown size={16} style={styles.dropdownIcon} />
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
                <input type="number" style={styles.textInput} value={score} onChange={e => setScore(e.target.value)} />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Description</label>
              <textarea style={styles.textareaInput} value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            {/* STUDY MATERIAL */}
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Study Material</label>
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
                  <span style={styles.blueLink}>Click to upload</span> files
                </div>
                {files.map((f, i) => (
                  <div key={i} style={styles.uploadSubtext}>{f.name}</div>
                ))}
              </div>
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
            <h3 style={styles.title}>Recent Assignments</h3>
            <div style={styles.utilActions}>
              <Filter size={18} style={styles.grayAction} />
              <RotateCw size={18} style={styles.grayAction} onClick={() => { setSearch(''); setStatusFilter('Active'); }} />
            </div>
          </div>

          <div style={styles.filterBar}>
            <div style={{ ...styles.relativeWrapper, flex: 1 }}>
              <Search size={16} style={styles.searchInsideIcon} />
              <input style={styles.searchField} value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div style={{ ...styles.relativeWrapper, width: '130px' }}>
              <select style={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option>Active</option>
                <option>Closed</option>
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

            {filteredAssignments.map(row => (
              <div key={row.id} style={styles.tableRow}>
                <div style={{ flex: 2.5 }}>
                  <div style={styles.boldText}>{row.title}</div>
                  <div style={styles.subtitleText}>Max Score: {row.score}</div>
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
                    <div style={{ position: 'absolute', right: 0, top: '22px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
                      <div style={{ padding: '8px 12px', cursor: 'pointer' }} onClick={() => closeAssignment(row.id)}>
                        Close Task
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

/* -------- BADGE STYLE LOGIC -------- */
const getStatusBadge = (status) => {
  const base = { padding: '3px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: '700' };
  if (status === 'Active') return { ...base, backgroundColor: '#E1F5FE', color: '#0288D1' };
  return { ...base, backgroundColor: '#FFEBEE', color: '#D32F2F' };
};

const styles = {
  container: {
    width: '100%',
    fontFamily: '"Inter", sans-serif',
  },
  layoutGrid: {
    width: '100%',
    maxWidth: '100%', // Updated to fill the parent container
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
  title: { fontSize: '15px', fontWeight: '800', margin: 0, color: '#1F2937' },

  formBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  fieldLabel: { fontSize: '12px', fontWeight: '700', color: '#4B5563' },
  required: { color: '#DC2626' },
  textInput: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    fontSize: '13px',
    outline: 'none',
    color: '#1F2937',
    width: '100%',
    boxSizing: 'border-box'
  },
  textareaInput: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    fontSize: '13px',
    minHeight: '100px',
    outline: 'none',
    resize: 'none',
  },
  selectInput: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    fontSize: '13px',
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
  uploadText: { fontSize: '13px', color: '#4B5563', fontWeight: '500' },
  blueLink: { color: '#2563EB', fontWeight: '700' },
  uploadSubtext: { fontSize: '11px', color: '#94A3B8' },

  formFooter: {
    padding: '20px 24px',
    borderTop: '1px solid #F3F4F6',
    display: 'flex',
    gap: '12px',
    backgroundColor: '#FAFBFC'
  },
  primaryBtn: {
    flex: 1.5,
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563EB',
    color: 'white',
    fontWeight: '700',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  secondaryBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    backgroundColor: 'white',
    color: '#6B7280',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer'
  },

  listHeader: { padding: '24px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  utilActions: { display: 'flex', gap: '15px' },
  grayAction: { color: '#94A3B8', cursor: 'pointer' },
  filterBar: { padding: '0 30px 20px 30px', display: 'flex', gap: '12px' },
  searchInsideIcon: { position: 'absolute', left: '12px', color: '#94A3B8' },
  searchField: {
    width: '100%',
    padding: '10px 10px 10px 36px',
    borderRadius: '6px',
    border: '1px solid #F1F5F9',
    backgroundColor: '#F8FAFC',
    fontSize: '13px',
    outline: 'none'
  },
  filterSelect: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #F1F5F9',
    backgroundColor: 'white',
    fontSize: '13px',
    appearance: 'none',
    outline: 'none',
    color: '#374151'
  },

  table: { display: 'flex', flexDirection: 'column' },
  tableHeaderRow: {
    display: 'flex',
    padding: '14px 30px',
    backgroundColor: '#F8F9FB',
    borderBottom: '1px solid #E9EDF2',
    color: '#94A3B8',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.2px'
  },
  tableRow: {
    display: 'flex',
    padding: '18px 30px',
    borderBottom: '1px solid #F8FAFC',
    alignItems: 'center',
    fontSize: '13px'
  },
  boldText: { fontWeight: '800', color: '#1F2937', marginBottom: '2px' },
  subtitleText: { color: '#94A3B8', fontSize: '11px', fontWeight: '500' }
};

export default AssignmentDashboard;
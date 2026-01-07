import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Upload,
  Search,
  Filter,
  Download,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  Calendar,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminSkillReport = () => {
  // Upload States
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);

  // Table States
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const limit = 5;

  // Define loadReports first to avoid initialization errors
  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/skill-reports/faculty/venue/reports`,
        {
          venueId: selectedVenue || null,
          page: currentPage,
          limit,
          status: statusFilter,
          date: dateFilter,
          search: searchTerm,
          sortBy: 'updated_at',
          sortOrder: 'DESC'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReports(response.data.reports || []);
      setStatistics(response.data.statistics);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [selectedVenue, currentPage, statusFilter, dateFilter, searchTerm]);

  const loadVenues = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/skill-reports/faculty/venues`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVenues(response.data.venues || []);
      if (response.data.venues && response.data.venues.length > 0) {
        setSelectedVenue(response.data.venues[0].venue_id);
      }
    } catch (err) {
      console.error('Error loading venues:', err);
    }
  }, []);

  // Load venues on mount
  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  // Load reports when venue/filters change
  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedVenue, statusFilter, dateFilter, searchTerm]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadResult(null);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/skill-reports/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      setUploadResult(response.data);
      setSelectedFile(null);
      
      // Reload reports if a venue is selected
      if (selectedVenue) {
        loadReports();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = () => {
    // Search is now integrated into loadReports
    setCurrentPage(1);
    loadReports();
  };

  // Backend handles all filtering, no need for client-side filter

  const getStatusBadge = (status) => {
    const styles = {
      Cleared: { bg: '#10b981', icon: CheckCircle },
      'Not Cleared': { bg: '#ef4444', icon: XCircle },
      Ongoing: { bg: '#f59e0b', icon: Clock },
    };

    const config = styles[status] || styles.Ongoing;
    const Icon = config.icon;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: config.bg }}>
        <Icon size={16} />
        <span style={{ fontWeight: '500' }}>{status}</span>
      </div>
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFilter('');
    setCurrentPage(1);
    if (selectedVenue) {
      loadReports();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Skill Reports Management</h1>
          <p style={styles.subtitle}>Upload and manage student skill reports</p>
        </div>
      </div>

      {/* Upload Section - Admin Only */}
      <div style={styles.uploadSection}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileSpreadsheet size={24} color="#3b82f6" />
              <h2 style={styles.cardTitle}>Upload Skill Report</h2>
            </div>
          </div>

          <div style={styles.cardBody}>
            <div style={styles.uploadArea}>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                style={styles.fileInput}
                id="file-upload"
                disabled={uploading}
              />
              <label htmlFor="file-upload" style={styles.fileLabel}>
                <Upload size={32} color="#9ca3af" />
                <span style={styles.fileLabelText}>
                  {selectedFile ? selectedFile.name : 'Choose Excel file or drag and drop'}
                </span>
                <span style={styles.fileLabelHint}>XLSX or XLS (Max 10MB)</span>
              </label>
            </div>

            {selectedFile && !uploading && (
              <button onClick={handleUpload} style={styles.uploadButton}>
                <Upload size={20} />
                Upload File
              </button>
            )}

            {uploading && (
              <div style={styles.progressContainer}>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
                </div>
                <p style={styles.progressText}>{uploadProgress}% Uploaded</p>
              </div>
            )}

            {uploadResult && (
              <div style={styles.resultCard}>
                <div style={styles.resultHeader}>
                  <CheckCircle size={24} color="#10b981" />
                  <h3 style={styles.resultTitle}>Upload Complete</h3>
                </div>
                <div style={styles.resultStats}>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Total Records:</span>
                    <span style={styles.statValue}>{uploadResult.summary?.totalRecords || 0}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Processed:</span>
                    <span style={{ ...styles.statValue, color: '#10b981' }}>{uploadResult.summary?.processed || 0}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Inserted:</span>
                    <span style={{ ...styles.statValue, color: '#3b82f6' }}>{uploadResult.summary?.inserted || 0}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Updated:</span>
                    <span style={{ ...styles.statValue, color: '#f59e0b' }}>{uploadResult.summary?.updated || 0}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Errors:</span>
                    <span style={{ ...styles.statValue, color: '#ef4444' }}>{uploadResult.summary?.errors || 0}</span>
                  </div>
                </div>
                {uploadResult.summary?.errorDetails && uploadResult.summary.errorDetails.length > 0 && (
                  <div style={styles.errorDetails}>
                    <p style={styles.errorTitle}>Error Details:</p>
                    <ul style={styles.errorList}>
                      {uploadResult.summary.errorDetails.map((err, idx) => (
                        <li key={idx} style={styles.errorItem}>
                          Row {err.row}: {err.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div style={styles.errorCard}>
                <AlertCircle size={20} color="#ef4444" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reports Table Section */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Student Skill Reports</h2>
          <button onClick={loadReports} style={styles.refreshButton} disabled={loading}>
            <RefreshCw size={18} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        {statistics && (
          <div style={styles.statsGrid}>
            <div style={{ ...styles.statCard, borderLeft: '4px solid #3b82f6' }}>
              <Users size={24} color="#3b82f6" />
              <div>
                <p style={styles.statCardValue}>{statistics.total || 0}</p>
                <p style={styles.statCardLabel}>Total Students</p>
              </div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '4px solid #10b981' }}>
              <CheckCircle size={24} color="#10b981" />
              <div>
                <p style={styles.statCardValue}>{statistics.cleared || 0}</p>
                <p style={styles.statCardLabel}>Cleared</p>
              </div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '4px solid #ef4444' }}>
              <XCircle size={24} color="#ef4444" />
              <div>
                <p style={styles.statCardValue}>{statistics.not_cleared || 0}</p>
                <p style={styles.statCardLabel}>Not Cleared</p>
              </div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '4px solid #f59e0b' }}>
              <Clock size={24} color="#f59e0b" />
              <div>
                <p style={styles.statCardValue}>{statistics.ongoing || 0}</p>
                <p style={styles.statCardLabel}>Ongoing</p>
              </div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '4px solid #8b5cf6' }}>
              <TrendingUp size={24} color="#8b5cf6" />
              <div>
                <p style={styles.statCardValue}>{statistics.avg_best_score || 0}</p>
                <p style={styles.statCardLabel}>Avg. Best Score</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={styles.filtersContainer}>
          <div style={styles.filterRow}>
            <div style={styles.searchBox}>
              <Search size={20} color="#6b7280" />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={styles.searchInput}
              />
              {searchTerm && (
                <button onClick={() => { setSearchTerm(''); loadReports(); }} style={styles.clearButton}>
                  ×
                </button>
              )}
            </div>

            <select
              value={selectedVenue || ''}
              onChange={(e) => {
                setSelectedVenue(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.select}
            >
              <option value="">All Venues</option>
              {venues.map((venue) => (
                <option key={venue.venue_id} value={venue.venue_id}>
                  {venue.venue_name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.select}
            >
              <option value="">All Status</option>
              <option value="Cleared">Cleared</option>
              <option value="Not Cleared">Not Cleared</option>
              <option value="Ongoing">Ongoing</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.select}
            />

            <button onClick={resetFilters} style={styles.resetButton}>
              <RefreshCw size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={styles.tableContainer}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <RefreshCw size={32} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
              <p>Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div style={styles.emptyState}>
              <FileSpreadsheet size={48} color="#9ca3af" />
              <p style={styles.emptyText}>No skill reports found</p>
              <p style={styles.emptyHint}>Upload an Excel file to get started</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>Roll No</th>
                  <th style={styles.tableHeader}>Student Name</th>
                  <th style={styles.tableHeader}>Course</th>
                  <th style={styles.tableHeader}>Test Venue</th>
                  <th style={styles.tableHeader}>Current Venue</th>
                  <th style={styles.tableHeader}>Attempts</th>
                  <th style={styles.tableHeader}>Best Score</th>
                  <th style={styles.tableHeader}>Latest Score</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Last Date</th>
                  <th style={styles.tableHeader}>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, idx) => (
                  <tr key={report.id || idx} style={styles.tableRow}>
                    <td style={styles.tableCell}>{report.roll_number}</td>
                    <td style={styles.tableCell}>
                      <div>
                        <div style={styles.studentName}>{report.student_name}</div>
                        <div style={styles.studentEmail}>{report.email}</div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>{report.course_name}</td>
                    <td style={styles.tableCell}>{report.excel_venue_name}</td>
                    <td style={styles.tableCell}>{report.student_current_venue || 'N/A'}</td>
                    <td style={styles.tableCell}>{report.total_attempts}</td>
                    <td style={styles.tableCell}>
                      <span style={styles.scoreBadge}>{report.best_score || 'N/A'}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.scoreBadge}>{report.latest_score || 'N/A'}</span>
                    </td>
                    <td style={styles.tableCell}>{getStatusBadge(report.status)}</td>
                    <td style={styles.tableCell}>
                      {report.last_slot_date ? new Date(report.last_slot_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.attendanceBadge,
                        backgroundColor: report.last_attendance === 'Present' ? '#d1fae5' : '#fee2e2',
                        color: report.last_attendance === 'Present' ? '#065f46' : '#991b1b',
                      }}>
                        {report.last_attendance || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div style={styles.pagination}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={styles.paginationButton}
            >
              Previous
            </button>
            <span style={styles.paginationInfo}>
              Page {currentPage} of {pagination.totalPages} ({pagination.total} records)
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages}
              style={styles.paginationButton}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <style>{keyframes}</style>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1600px',
    margin: '0 auto',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  uploadSection: {
    marginBottom: '24px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  cardHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  cardBody: {
    padding: '24px',
  },
  uploadArea: {
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f9fafb',
    marginBottom: '16px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  fileLabelText: {
    fontSize: '16px',
    color: '#374151',
    fontWeight: '500',
  },
  fileLabelHint: {
    fontSize: '14px',
    color: '#9ca3af',
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%',
    justifyContent: 'center',
  },
  progressContainer: {
    marginTop: '16px',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    transition: 'width 0.3s ease',
  },
  progressText: {
    textAlign: 'center',
    marginTop: '8px',
    fontSize: '14px',
    color: '#6b7280',
  },
  resultCard: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    border: '1px solid #bbf7d0',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  resultTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#166534',
    margin: 0,
  },
  resultStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 12px',
    backgroundColor: 'white',
    borderRadius: '6px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
  },
  errorDetails: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#fef2f2',
    borderRadius: '6px',
    border: '1px solid #fecaca',
  },
  errorTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: '8px',
  },
  errorList: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#dc2626',
  },
  errorItem: {
    marginBottom: '4px',
  },
  errorCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#991b1b',
    fontSize: '14px',
    marginTop: '16px',
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  statCardValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  statCardLabel: {
    fontSize: '13px',
    color: '#6b7280',
    margin: 0,
  },
  filtersContainer: {
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  filterRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: '1 1 300px',
    padding: '8px 12px',
    backgroundColor: '#f9fafb',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '14px',
    color: '#111827',
  },
  clearButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '0 4px',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
    backgroundColor: 'white',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '150px',
  },
  resetButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '12px',
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#6b7280',
    margin: 0,
  },
  emptyHint: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    backgroundColor: '#f9fafb',
  },
  tableHeader: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #e5e7eb',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s ease',
  },
  tableCell: {
    padding: '16px',
    fontSize: '14px',
    color: '#374151',
  },
  studentName: {
    fontWeight: '500',
    color: '#111827',
    marginBottom: '2px',
  },
  studentEmail: {
    fontSize: '12px',
    color: '#6b7280',
  },
  scoreBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
  },
  attendanceBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderTop: '1px solid #e5e7eb',
  },
  paginationButton: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  paginationInfo: {
    fontSize: '14px',
    color: '#6b7280',
  },
};

const keyframes = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export default AdminSkillReport;

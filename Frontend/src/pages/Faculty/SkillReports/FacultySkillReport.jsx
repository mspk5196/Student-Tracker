import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Search,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  Calendar,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const FacultySkillReport = () => {
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
    if (!selectedVenue) return;

    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/skill-reports/faculty/venue/reports`,
        {
          venueId: selectedVenue,
          page: currentPage,
          limit,
          status: statusFilter,
          date: dateFilter,
          search: searchTerm,
          sortBy: 'updated_at',
          sortOrder: 'DESC',
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
      setError(err.response?.data?.message || 'Failed to load venues');
    }
  }, []);

  // Load venues on mount
  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  // Load reports when venue/filters change
  useEffect(() => {
    if (selectedVenue) {
      loadReports();
    }
  }, [loadReports]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedVenue, statusFilter, dateFilter, searchTerm]);

  const handleSearch = () => {
    // Search is now integrated into loadReports
    setCurrentPage(1);
    loadReports();
  };

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
          <h1 style={styles.title}>Student Skill Reports</h1>
          <p style={styles.subtitle}>View and track student performance</p>
        </div>
      </div>

      {/* Reports Table Section */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Skill Reports</h2>
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
                <button
                  onClick={() => {
                    setSearchTerm('');
                    loadReports();
                  }}
                  style={styles.clearButton}
                >
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
              {venues.length === 0 ? (
                <option value="">No Venues Assigned</option>
              ) : (
                venues.map((venue) => (
                  <option key={venue.venue_id} value={venue.venue_id}>
                    {venue.venue_name}
                  </option>
                ))
              )}
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
              placeholder="Filter by date"
            />

            <button onClick={resetFilters} style={styles.resetButton}>
              <RefreshCw size={16} />
              Reset
            </button>
          </div>
        </div>

        {error && (
          <div style={styles.errorCard}>
            <XCircle size={20} color="#ef4444" />
            <span>{error}</span>
          </div>
        )}

        {/* Student Skill Reports Table Removed - Data now available in Group Insights */}
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <FileSpreadsheet size={48} color="#3b82f6" style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
            Skill Reports Now in Group Insights
          </h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Student skill proficiency data has been moved to the Group Insights page for better organization and analysis.
          </p>
        </div>
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
  exportButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
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
  errorCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    fontSize: '14px',
    margin: '0 24px 16px 24px',
    borderRadius: '6px',
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
    whiteSpace: 'nowrap',
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
    transition: 'all 0.3s ease',
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

export default FacultySkillReport;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Search,
  RefreshCw,
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LIMIT = 10;

const FacultySkillReport = () => {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');

  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }, []);

  const loadVenues = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/skill-reports/faculty/venues`, {
        headers: authHeaders,
      });
      setVenues(Array.isArray(res.data?.venues) ? res.data.venues : []);
    } catch (e) {
      // Non-blocking: faculty can still load reports without venue list.
      console.error('Failed to load venues', e);
    }
  }, [authHeaders]);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        venueId: selectedVenue ? selectedVenue : null,
        page: currentPage,
        limit: LIMIT,
        status: statusFilter || undefined,
        date: dateFilter || undefined,
        search: searchTerm || undefined,
        sortBy: 'last_slot_date',
        sortOrder: 'DESC',
      };

      const res = await axios.post(`${API_URL}/skill-reports/faculty/venue/reports`, payload, {
        headers: authHeaders,
      });

      setReports(Array.isArray(res.data?.reports) ? res.data.reports : []);
      setStatistics(res.data?.statistics || null);
      setPagination(res.data?.pagination || null);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load course progress');
    } finally {
      setLoading(false);
    }
  }, [authHeaders, currentPage, dateFilter, searchTerm, selectedVenue, statusFilter]);

  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Reset paging when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedVenue, statusFilter, dateFilter, searchTerm]);

  const statusBadge = (status) => {
    const map = {
      Cleared: { color: '#10b981', Icon: CheckCircle, bg: '#ecfdf5', border: '#a7f3d0' },
      'Not Cleared': { color: '#ef4444', Icon: XCircle, bg: '#fef2f2', border: '#fecaca' },
      Ongoing: { color: '#f59e0b', Icon: Clock, bg: '#fffbeb', border: '#fde68a' },
    };
    const cfg = map[status] || map.Ongoing;
    const Icon = cfg.Icon;

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        whiteSpace: 'nowrap',
      }}>
        <Icon size={14} />
        {status || 'Ongoing'}
      </span>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Course Progress</h1>
          <p style={styles.subtitle}>View student course/skill progress (latest attempt per course)</p>
        </div>
        <button
          style={styles.refreshButton}
          onClick={() => loadReports()}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardHeaderLeft}>
            <Filter size={18} />
            <span style={styles.cardHeaderTitle}>Filters</span>
          </div>
        </div>

        <div style={styles.cardBody}>
          <div style={styles.filtersRow}>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              style={styles.select}
            >
              <option value="">All My Venues</option>
              {venues.map((v) => (
                <option key={v.venue_id} value={String(v.venue_id)}>
                  {v.venue_name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
              onChange={(e) => setDateFilter(e.target.value)}
              style={styles.dateInput}
            />

            <div style={styles.searchBox}>
              <Search size={16} color="#6b7280" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name / roll no / course"
                style={styles.searchInput}
              />
              {searchTerm && (
                <button style={styles.clearButton} onClick={() => setSearchTerm('')} aria-label="Clear search">
                  ×
                </button>
              )}
            </div>

            <button
              style={styles.resetButton}
              onClick={() => {
                setSelectedVenue('');
                setStatusFilter('');
                setDateFilter('');
                setSearchTerm('');
                setCurrentPage(1);
              }}
              disabled={loading}
            >
              Reset
            </button>
          </div>

          {error && (
            <div style={styles.errorBar}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {statistics && (
            <div style={styles.statsRow}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Total</div>
                <div style={styles.statValue}>{statistics.total ?? 0}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Cleared</div>
                <div style={styles.statValue}>{statistics.cleared ?? 0}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Not Cleared</div>
                <div style={styles.statValue}>{statistics.not_cleared ?? 0}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Ongoing</div>
                <div style={styles.statValue}>{statistics.ongoing ?? 0}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Avg Best Score</div>
                <div style={styles.statValue}>{statistics.avg_best_score ?? 0}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardHeaderLeft}>
            <span style={styles.cardHeaderTitle}>Progress Report</span>
            {pagination?.total != null && (
              <span style={styles.smallMuted}>({pagination.total} records)</span>
            )}
          </div>
        </div>

        <div style={styles.tableWrap}>
          {loading ? (
            <div style={styles.loading}>Loading…</div>
          ) : reports.length === 0 ? (
            <div style={styles.empty}>No records found for current filters.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Attempts</th>
                  <th style={styles.th}>Best</th>
                  <th style={styles.th}>Latest</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Last Slot</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.studentName}>{r.student_name}</div>
                      <div style={styles.smallMuted}>{r.roll_number}</div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.courseName}>{r.course_name}</div>
                      {r.excel_venue_name && (
                        <div style={styles.smallMuted}>{r.excel_venue_name}</div>
                      )}
                    </td>
                    <td style={styles.td}>{r.total_attempts ?? '-'}</td>
                    <td style={styles.td}>{r.best_score ?? '-'}</td>
                    <td style={styles.td}>{r.latest_score ?? '-'}</td>
                    <td style={styles.td}>{statusBadge(r.status)}</td>
                    <td style={styles.td}>{r.last_slot_date ? String(r.last_slot_date).slice(0, 10) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pagination?.totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={styles.pageButton}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={loading || currentPage <= 1}
            >
              Prev
            </button>
            <div style={styles.smallMuted}>
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <button
              style={styles.pageButton}
              onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={loading || currentPage >= pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultySkillReport;

const styles = {
  container: {
    padding: 24,
    maxWidth: 1600,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 18,
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: '#111827',
  },
  subtitle: {
    margin: '6px 0 0 0',
    color: '#6b7280',
    fontSize: 14,
  },
  refreshButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: '1px solid #e5e7eb',
    background: 'white',
    padding: '10px 14px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 600,
    color: '#111827',
  },
  card: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 18,
  },
  cardHeader: {
    padding: '14px 16px',
    borderBottom: '1px solid #f3f4f6',
    background: '#fbfbfb',
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderTitle: {
    fontWeight: 800,
    color: '#111827',
  },
  cardBody: {
    padding: 16,
  },
  filtersRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  select: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    minWidth: 180,
    background: 'white',
  },
  dateInput: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    minWidth: 160,
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    padding: '10px 12px',
    minWidth: 320,
    flex: '1 1 320px',
    background: 'white',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: 14,
  },
  clearButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 18,
    lineHeight: 1,
    color: '#6b7280',
  },
  resetButton: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    background: 'white',
    cursor: 'pointer',
    fontWeight: 700,
    color: '#111827',
  },
  errorBar: {
    marginTop: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 12,
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    fontWeight: 600,
  },
  statsRow: {
    marginTop: 14,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: 12,
  },
  statCard: {
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 12,
    background: 'white',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  statValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: 900,
    color: '#111827',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  theadRow: {
    background: '#f9fafb',
  },
  th: {
    textAlign: 'left',
    padding: '12px 14px',
    fontSize: 12,
    fontWeight: 900,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderBottom: '1px solid #e5e7eb',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid #f3f4f6',
  },
  td: {
    padding: '12px 14px',
    fontSize: 14,
    color: '#111827',
    verticalAlign: 'top',
  },
  studentName: {
    fontWeight: 800,
  },
  courseName: {
    fontWeight: 700,
  },
  smallMuted: {
    fontSize: 12,
    color: '#6b7280',
  },
  loading: {
    padding: 18,
    color: '#6b7280',
    fontWeight: 700,
  },
  empty: {
    padding: 18,
    color: '#6b7280',
    fontWeight: 700,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderTop: '1px solid #f3f4f6',
    background: '#fbfbfb',
  },
  pageButton: {
    padding: '8px 12px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    background: 'white',
    cursor: 'pointer',
    fontWeight: 800,
    color: '#111827',
  },
};

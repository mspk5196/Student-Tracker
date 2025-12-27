import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Calendar, X, ChevronDown, Users, Building } from 'lucide-react';

const ClassHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    semester: null,
    department: null,
    status: null,
    attendance: null
  });

  const [filterOptions, setFilterOptions] = useState({
    semesters: [
      { id: 'all', label: 'All Semesters', value: null },
      { id: '1', label: 'Semester 1', value: '1' },
      { id: '2', label: 'Semester 2', value: '2' },
      { id: '3', label: 'Semester 3', value: '3' },
      { id: '4', label: 'Semester 4', value: '4' },
      { id: '5', label: 'Semester 5', value: '5' },
      { id: '6', label: 'Semester 6', value: '6' }
    ],
    departments: [
      { id: 'all', label: 'All Departments', value: null, color: '#64748b' },
      { id: 'cs', label: 'Computer Science', value: 'Computer Science', color: '#3b82f6' },
      { id: 'ai', label: 'Artificial Intelligence', value: 'Artificial Intelligence', color: '#10b981' },
      { id: 'se', label: 'Software Engineering', value: 'Software Engineering', color: '#8b5cf6' },
      { id: 'ce', label: 'Computer Engineering', value: 'Computer Engineering', color: '#f59e0b' },
      { id: 'it', label: 'Information Technology', value: 'Information Technology', color: '#ef4444' }
    ],
    statuses: [
      { id: 'all', label: 'All Status', value: null },
      { id: 'active', label: 'Active', value: 'active' },
      { id: 'completed', label: 'Completed', value: 'completed' },
      { id: 'upcoming', label: 'Upcoming', value: 'upcoming' }
    ],
    attendanceRanges: [
      { id: 'all', label: 'All Attendance', value: null },
      { id: 'excellent', label: '90%+', value: '90' },
      { id: 'good', label: '80-89%', value: '80' },
      { id: 'average', label: '70-79%', value: '70' },
      { id: 'needs_attention', label: 'Below 70%', value: 'below70' }
    ]
  });

  const activeTab = location.pathname.endsWith('/all') ? 'All Classes' : 'My Classes';

  const handleTabChange = (tab) => {
    if (tab === 'My Classes') {
      navigate('/classes');
    } else {
      navigate('/classes/all');
    }
  };

  const handleFilterSelect = (filterType, value, label) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value === null ? null : { value, label }
    }));

    // Close respective modal
    if (filterType === 'semester') setShowSemesterModal(false);
    if (filterType === 'department') setShowDepartmentModal(false);
    if (filterType === 'status' || filterType === 'attendance') setShowFilterModal(false);

    // Show success notification
    if (value !== null) {
      showNotification(`${filterType.charAt(0).toUpperCase() + filterType.slice(1)} filter applied: ${label}`);
    }
  };

  const clearFilter = (filterType) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: null
    }));
    showNotification(`${filterType.charAt(0).toUpperCase() + filterType.slice(1)} filter cleared`);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      semester: null,
      department: null,
      status: null,
      attendance: null
    });
    setSearchQuery('');
    showNotification('All filters cleared');
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounced search notification
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      if (value.trim()) {
        showNotification(`Searching for: "${value}"`);
      }
    }, 500);
  };

  const showNotification = (message) => {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
        document.head.removeChild(style);
      }, 300);
    }, 3000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + F for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.querySelector('.search-wrapper input')?.focus();
      }
      // Esc to close modals
      if (e.key === 'Escape') {
        setShowFilterModal(false);
        setShowSemesterModal(false);
        setShowDepartmentModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).filter(f => f !== null).length;

  return (
    <div className="class-header-container">
      {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Advanced Filters</h3>
              <button className="close-btn" onClick={() => setShowFilterModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="filter-section">
              <h4>Status</h4>
              <div className="filter-options">
                {filterOptions.statuses.map(option => (
                  <button
                    key={option.id}
                    className={`filter-option-btn ${activeFilters.status?.value === option.value ? 'active' : ''}`}
                    onClick={() => handleFilterSelect('status', option.value, option.label)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Attendance Range</h4>
              <div className="filter-options">
                {filterOptions.attendanceRanges.map(option => (
                  <button
                    key={option.id}
                    className={`filter-option-btn ${activeFilters.attendance?.value === option.value ? 'active' : ''}`}
                    onClick={() => handleFilterSelect('attendance', option.value, option.label)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-clear" onClick={() => {
                clearFilter('status');
                clearFilter('attendance');
              }}>
                Clear Selection
              </button>
              <button className="btn-apply" onClick={() => setShowFilterModal(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Semester Modal */}
      {showSemesterModal && (
        <div className="modal-overlay" onClick={() => setShowSemesterModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select Semester</h3>
              <button className="close-btn" onClick={() => setShowSemesterModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="filter-options">
              {filterOptions.semesters.map(option => (
                <button
                  key={option.id}
                  className={`filter-option-btn ${activeFilters.semester?.value === option.value ? 'active' : ''}`}
                  onClick={() => handleFilterSelect('semester', option.value, option.label)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Department Modal */}
      {showDepartmentModal && (
        <div className="modal-overlay" onClick={() => setShowDepartmentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select Department</h3>
              <button className="close-btn" onClick={() => setShowDepartmentModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="filter-options">
              {filterOptions.departments.map(option => (
                <button
                  key={option.id}
                  className={`filter-option-btn ${activeFilters.department?.value === option.value ? 'active' : ''}`}
                  onClick={() => handleFilterSelect('department', option.value, option.label)}
                  style={{
                    borderLeft: `4px solid ${option.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Building size={16} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .class-header-container {
          margin: -24px -24px 0 -24px;
          background-color: #f8fafc;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 40px;
          background-color: #f8fafc;
          position: sticky;
          top: -24px;
          z-index: 10;
          flex-wrap: wrap;
          gap: 16px;
          border-bottom: 1px solid #e2e8f0;
          margin-top: 0;
        }

        .content-area {
          padding: 8px 40px 0 40px;
        }

        .tab-group {
          background: #e2e8f0;
          padding: 4px;
          border-radius: 8px;
          display: flex;
          gap: 4px;
        }

        .tab-btn {
          padding: 8px 20px;
          border-radius: 6px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          color: #64748b;
          background: transparent;
        }

        .tab-btn.active {
          background: white;
          color: #1e293b;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .tab-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.5);
        }

        .filters {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-wrapper {
          position: relative;
        }

        .search-wrapper input {
          padding: 10px 12px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          width: 300px;
          font-size: 14px;
          outline: none;
          background: white;
          transition: all 0.3s;
        }

        .search-wrapper input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          width: 320px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          color: #1e293b;
          transition: all 0.2s;
          position: relative;
        }

        .filter-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .filter-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .filter-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Active Filters Bar */
        .active-filters-bar {
          padding: 12px 40px;
          background: #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          color: #475569;
        }

        .filter-tag .remove-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 2px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .filter-tag .remove-btn:hover {
          background: #f1f5f9;
          color: #64748b;
        }

        .clear-all-btn {
          margin-left: auto;
          padding: 4px 12px;
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          font-size: 12px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-all-btn:hover {
          background: white;
          border-color: #cbd5e1;
          color: #475569;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 400px;
          max-width: 90vw;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }

        .close-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .filter-section {
          padding: 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .filter-section:last-child {
          border-bottom: none;
        }

        .filter-section h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-option-btn {
          padding: 10px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .filter-option-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .filter-option-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .btn-clear {
          padding: 10px 20px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-clear:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #475569;
        }

        .btn-apply {
          padding: 10px 20px;
          background: #3b82f6;
          border: 1px solid #3b82f6;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-apply:hover {
          background: #2563eb;
          border-color: #2563eb;
        }

        /* Stats Summary */
        .stats-summary {
          display: flex;
          gap: 20px;
          padding: 8px 40px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 20px;
          background: #e2e8f0;
        }

        /* Quick Actions */
        .quick-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-left: auto;
        }

        .quick-action-btn {
          padding: 6px 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 12px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .quick-action-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #475569;
        }
      `}</style>

      <div className="header-actions">
        <div className="tab-group">
          <button
            className={`tab-btn ${activeTab === 'My Classes' ? 'active' : ''}`}
            onClick={() => handleTabChange('My Classes')}
          >
            My Classes
          </button>
          <button
            className={`tab-btn ${activeTab === 'All Classes' ? 'active' : ''}`}
            onClick={() => handleTabChange('All Classes')}
          >
            All Classes
          </button>
        </div>

        <div className="filters">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by class, subject, or faculty"
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  showNotification(`Searching for: "${searchQuery}"`);
                }
              }}
            />
          </div>

          <button
            className={`filter-btn ${showFilterModal ? 'active' : ''}`}
            onClick={() => setShowFilterModal(!showFilterModal)}
          >
            <Filter size={16} /> Filter
            {(activeFilters.status || activeFilters.attendance) && (
              <span className="filter-badge">
                {[activeFilters.status, activeFilters.attendance].filter(Boolean).length}
              </span>
            )}
          </button>

          <button
            className={`filter-btn ${showSemesterModal ? 'active' : ''}`}
            onClick={() => setShowSemesterModal(!showSemesterModal)}
          >
            <Calendar size={16} /> Semester
            {activeFilters.semester && (
              <span className="filter-badge">1</span>
            )}
          </button>

          <button
            className={`filter-btn ${showDepartmentModal ? 'active' : ''}`}
            onClick={() => setShowDepartmentModal(!showDepartmentModal)}
          >
            <Building size={16} /> Department
            {activeFilters.department && (
              <span className="filter-badge">1</span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-summary">
        <div className="stat-item">
          <div className="stat-value">{activeTab === 'My Classes' ? '6' : '42'}</div>
          <div className="stat-label">Classes</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-value">{activeTab === 'My Classes' ? '215' : '1,850'}</div>
          <div className="stat-label">Students</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-value">87%</div>
          <div className="stat-label">Avg Attendance</div>
        </div>

        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => showNotification('Export initiated')}>
            <ChevronDown size={12} /> Export
          </button>
          <button className="quick-action-btn" onClick={() => showNotification('Refresh complete')}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Active Filters Bar */}
      {activeFilterCount > 0 && (
        <div className="active-filters-bar">
          {activeFilters.semester && (
            <div className="filter-tag">
              <span>Semester: {activeFilters.semester.label}</span>
              <button className="remove-btn" onClick={() => clearFilter('semester')}>
                <X size={12} />
              </button>
            </div>
          )}

          {activeFilters.department && (
            <div className="filter-tag">
              <span>Department: {activeFilters.department.label}</span>
              <button className="remove-btn" onClick={() => clearFilter('department')}>
                <X size={12} />
              </button>
            </div>
          )}

          {activeFilters.status && (
            <div className="filter-tag">
              <span>Status: {activeFilters.status.label}</span>
              <button className="remove-btn" onClick={() => clearFilter('status')}>
                <X size={12} />
              </button>
            </div>
          )}

          {activeFilters.attendance && (
            <div className="filter-tag">
              <span>Attendance: {activeFilters.attendance.label}</span>
              <button className="remove-btn" onClick={() => clearFilter('attendance')}>
                <X size={12} />
              </button>
            </div>
          )}

          <button className="clear-all-btn" onClick={clearAllFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      <div className="content-area">
        <Outlet context={{
          searchQuery,
          activeFilters,
          clearFilter,
          clearAllFilters
        }} />
      </div>
    </div>
  );
};

export default ClassHeader;
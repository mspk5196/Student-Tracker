import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Calendar } from 'lucide-react';

const ClassHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const activeTab = location.pathname.endsWith('/all') ? 'All Classes' : 'My Classes';

  const handleTabChange = (tab) => {
    if (tab === 'My Classes') {
      navigate('/classes');
    } else {
      navigate('/classes/all');
    }
  };

  return (
    <div className="class-header-container">
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
          padding: 24px 40px;
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
          padding: 20px 40px 0 40px;
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

        .filters {
          display: flex;
          gap: 12px;
          align-items: center;
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="filter-btn"><Filter size={16} /> Filter</button>
          <button className="filter-btn"><Calendar size={16} /> Semester</button>
        </div>
      </div>

      <div className="content-area">
        <Outlet context={{ searchQuery }} />
      </div>
    </div>
  );
};

export default ClassHeader;

import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const ClassTableDashboard = () => {
    const { searchQuery } = useOutletContext();

    // --- 1. MOCK DATA ---
    const initialData = [
        { id: 1, code: 'CS-201', name: 'Data Structures', section: 'Section A', sem: 'Sem 3', subject: 'Data Structures', subCode: 'CS-201', faculty: 'Dr. Priya Singh', facultyImg: 'https://i.pravatar.cc/150?u=1', scheduleDays: 'Mon, Wed', scheduleTime: '10:00 AM', students: 60, status: 'Active' },
        { id: 2, code: 'CS-105', name: 'Programming Basics', section: 'Section B', sem: 'Sem 1', subject: 'Programming Fund.', subCode: 'CS-105', faculty: 'Prof. Alan Grant', facultyImg: 'https://i.pravatar.cc/150?u=2', scheduleDays: 'Tue, Thu', scheduleTime: '11:15 AM', students: 58, status: 'Active' },
        { id: 3, code: 'AI-310', name: 'Intro to AI', section: 'Section A', sem: 'Sem 5', subject: 'Artificial Intel.', subCode: 'AI-310', faculty: 'Dr. Sarah Connor', facultyImg: 'https://i.pravatar.cc/150?u=3', scheduleDays: 'Fri', scheduleTime: '02:00 PM', students: 40, status: 'Active' },
        { id: 4, code: 'SE-402', name: 'Software Eng', section: 'Section C', sem: 'Sem 6', subject: 'Software Eng', subCode: 'SE-402', faculty: 'Prof. John Doe', facultyImg: 'https://i.pravatar.cc/150?u=4', scheduleDays: 'Mon, Thu', scheduleTime: '02:00 PM', students: 50, status: 'Active' },
        { id: 5, code: 'DB-205', name: 'Database Systems', section: 'Section B', sem: 'Sem 4', subject: 'Database Mgmt', subCode: 'DB-205', faculty: 'Dr. Emily Chen', facultyImg: 'https://i.pravatar.cc/150?u=5', scheduleDays: 'Wed, Fri', scheduleTime: '09:00 AM', students: 65, status: 'Inactive' },
        { id: 6, code: 'MT-101', name: 'Calculus I', section: 'Section A', sem: 'Sem 1', subject: 'Mathematics', subCode: 'MT-101', faculty: 'Dr. Robert Fox', facultyImg: 'https://i.pravatar.cc/150?u=6', scheduleDays: 'Mon, Wed', scheduleTime: '08:00 AM', students: 45, status: 'Active' },
    ];

    // --- 2. STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // --- 3. FUNCTIONAL LOGIC ---

    // Filter data based on search
    const filteredData = useMemo(() => {
        let data = initialData;

        // Filter by Search Query
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            data = data.filter(item =>
                item.name.toLowerCase().includes(q) ||
                item.code.toLowerCase().includes(q) ||
                item.faculty.toLowerCase().includes(q)
            );
        }
        return data;
    }, [searchQuery]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="table-content-wrapper">
            {/* --- INLINE CSS --- */}
            <style>{`
        .table-content-wrapper {
          padding-top: 20px;
          padding-bottom: 40px;
        }

        /* Table Card */
        .table-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        thead {
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
        }

        th {
          padding: 16px 24px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: capitalize;
        }

        td {
          padding: 16px 24px;
          border-bottom: 1px solid #f8fafc;
          vertical-align: middle;
        }

        .class-title {
          font-weight: 700;
          font-size: 14px;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .sub-text {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        .faculty-info {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
        }

        .faculty-img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.active { background: #f0fdf4; color: #16a34a; }
        .status-badge.inactive { background: #f1f5f9; color: #64748b; }

        .action-dots {
          color: #94a3b8;
          cursor: pointer;
        }

        /* Footer */
        .table-footer {
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
        }

        .pagination {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .page-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          color: #64748b;
        }

        .page-btn.active {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

            {/* --- TABLE CARD --- */}
            <div className="table-card">
                <table>
                    <thead>
                        <tr>
                            <th>Class / Group Name</th>
                            <th>Subject & Code</th>
                            <th>Assigned Faculty</th>
                            <th>Schedule</th>
                            <th>Students</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="class-title">{item.code} {item.name}</div>
                                    <div className="sub-text">{item.section} • {item.sem}</div>
                                </td>
                                <td>
                                    <div className="class-title" style={{ fontWeight: 500 }}>{item.subject}</div>
                                    <div className="sub-text">{item.subCode}</div>
                                </td>
                                <td>
                                    <div className="faculty-info">
                                        <img src={item.facultyImg} alt="" className="faculty-img" />
                                        {item.faculty}
                                    </div>
                                </td>
                                <td>
                                    <div className="class-title" style={{ fontWeight: 500 }}>{item.scheduleDays}</div>
                                    <div className="sub-text">{item.scheduleTime}</div>
                                </td>
                                <td><div className="class-title" style={{ fontWeight: 500 }}>{item.students}</div></td>
                                <td>
                                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td><MoreHorizontal className="action-dots" size={20} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* --- FOOTER / PAGINATION --- */}
                <div className="table-footer">
                    <div className="sub-text">
                        Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
                        {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} classes
                    </div>

                    <div className="pagination">
                        <button
                            className="page-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="page-btn"
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassTableDashboard;
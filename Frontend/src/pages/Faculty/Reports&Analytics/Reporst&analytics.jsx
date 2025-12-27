import React, { useState, useMemo, useEffect } from 'react';
// Material Icons
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DescriptionIcon from '@mui/icons-material/Description'; // PDF
import CodeIcon from '@mui/icons-material/Code'; // CPP
import FolderZipIcon from '@mui/icons-material/FolderZip'; // ZIP
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

// Mock Initial Data
const MOCK_SUBMISSIONS = [
    { id: '2023001', name: 'John Doe', date: 'Oct 24, 10:30 AM', file: 'linked_list_impl.cpp', status: 'Pending Review', grade: '', action: 'Save', type: 'code', isLate: false, course: 'CS-201' },
    { id: '2023015', name: 'Sarah Smith', date: 'Oct 23, 04:15 PM', file: 'project_v1.zip', status: 'Graded', grade: '92', action: 'Edit', type: 'zip', isLate: false, course: 'CS-201' },
    { id: '2023042', name: 'Mike Peters', date: 'Oct 25, 09:00 AM', file: 'assignment_final.pdf', status: 'Needs Revision', grade: '65', action: 'Update', isLate: true, course: 'CS-201' },
    { id: '2023088', name: 'Emily Chen', date: 'Oct 24, 11:45 AM', file: 'data_structs.cpp', status: 'Pending Review', grade: '', action: 'Save', type: 'code', isLate: false, course: 'CS-202' },
    { id: '2023090', name: 'Alex Hall', date: 'Oct 24, 02:30 PM', file: 'test_sort.cpp', status: 'Pending Review', grade: '', action: 'Save', type: 'code', isLate: false, course: 'CS-201' },
    { id: '2023095', name: 'Zoe Kemp', date: 'Oct 23, 09:15 AM', file: 'manual_v1.pdf', status: 'Graded', grade: '88', action: 'Edit', type: 'pdf', isLate: false, course: 'CS-202' },
    { id: '2023099', name: 'Brian Lux', date: 'Oct 26, 10:00 AM', file: 'analysis.pdf', status: 'Pending Review', grade: '', action: 'Save', type: 'pdf', isLate: true, course: 'CS-201' },
    { id: '2023102', name: 'Tim Cook', date: 'Oct 22, 11:00 AM', file: 'main.cpp', status: 'Graded', grade: '95', action: 'Edit', type: 'code', isLate: false, course: 'CS-201' },
];

const ReportsAnalytics = () => {
    // --- States ---
    const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        status: 'All Statuses',
        course: 'All Courses',
        assignment: 'All Assignments' // For now purely visual as we don't have assignment ID in mock data
    });

    // Menu States
    const [anchorElStatus, setAnchorElStatus] = useState(null);
    const [anchorElCourse, setAnchorElCourse] = useState(null);

    const itemsPerPage = 5;

    // --- Computed Stats ---
    const stats = useMemo(() => {
        const total = submissions.length;
        const pending = submissions.filter(s => s.status === 'Pending Review').length;
        const late = submissions.filter(s => s.isLate).length;

        const gradedSubs = submissions.filter(s => s.grade && !isNaN(s.grade));
        const avgScore = gradedSubs.length > 0
            ? Math.round(gradedSubs.reduce((acc, curr) => acc + Number(curr.grade), 0) / gradedSubs.length)
            : 0;

        return { total, pending, late, avgScore };
    }, [submissions]);

    // --- Filtering Logic ---
    const filteredSubmissions = useMemo(() => {
        return submissions.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.includes(searchTerm);
            const matchesStatus = filters.status === 'All Statuses' || item.status === filters.status;
            const matchesCourse = filters.course === 'All Courses' || item.course === filters.course;

            return matchesSearch && matchesStatus && matchesCourse;
        });
    }, [searchTerm, submissions, filters]);

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSubmissions.slice(indexOfFirstItem, indexOfLastItem);

    // --- Handlers ---
    const handleGradeChange = (id, newVal) => {
        // Validating numeric input (0-100) or empty
        if (newVal !== '' && (isNaN(newVal) || newVal < 0 || newVal > 100)) return;

        setSubmissions(prev => prev.map(sub =>
            sub.id === id ? { ...sub, grade: newVal } : sub
        ));
    };

    const handleAction = (id, currentAction) => {
        setSubmissions(prev => prev.map(sub => {
            if (sub.id !== id) return sub;

            if (currentAction === 'Save' || currentAction === 'Update') {
                if (sub.grade === '') {
                    alert('Please enter a grade before saving.');
                    return sub; // Do nothing if grade is empty
                }
                const isRevision = Number(sub.grade) < 50; // Logic: < 50 needs revision
                return {
                    ...sub,
                    status: isRevision ? 'Needs Revision' : 'Graded',
                    action: isRevision ? 'Update' : 'Edit'
                };
            } else if (currentAction === 'Edit') {
                // When clicking edit, we might want to make it look active or just depend on the input field being available.
                // In this implementation, the input is always available unless we disable it. 
                // Let's toggle the status briefly or just keep it as graded but allow editing.
                // For better UX, let's switch action back to 'Save' so user confirms changes.
                return { ...sub, action: 'Save' };
            }
            return sub;
        }));
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "ID,Name,Date,File,Status,Grade\n"
            + filteredSubmissions.map(e => `${e.id},${e.name},${e.date},${e.file},${e.status},${e.grade}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "student_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'code': return <CodeIcon sx={{ fontSize: 18 }} />;
            case 'zip': return <FolderZipIcon sx={{ fontSize: 18 }} />;
            case 'pdf': return <DescriptionIcon sx={{ fontSize: 18 }} />;
            default: return <DescriptionIcon sx={{ fontSize: 18 }} />;
        }
    };

    return (
        <div className="dashboard-wrapper">
            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

            .dashboard-wrapper {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
            min-height: 100vh;
            padding: 2px;
            color: #1e293b;
            }

            /* Stats Section */
            .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            margin-bottom: 32px;
            }

            .stat-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            transition: transform 0.2s ease;
            }

            .stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

            .stat-label { font-size: 14px; color: #64748b; margin-bottom: 8px; font-weight: 500; }
            .stat-value { font-size: 32px; font-weight: 700; margin-bottom: 12px; display: block; }

            .stat-trend {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 600;
            }

            .trend-up { color: #10b981; }
            .trend-down { color: #f43f5e; }
            .trend-neutral { color: #f97316; }

            /* Toolbar */
            .toolbar {
            display: flex;
            justify-content: space-between;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
            }

            .filters { display: flex; gap: 12px; flex-wrap: wrap; }

            .btn-ui {
            background: white;
            border: 1px solid #e2e8f0;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #475569;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: all 0.2s;
            }

            .btn-ui:hover { background: #f1f5f9; border-color: #cbd5e1; }
            .btn-ui.active { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }

            .search-box {
            position: relative;
            width: 320px;
            }

            .search-box input {
            width: 100%;
            padding: 10px 10px 10px 42px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            }

            .search-box input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }

            /* Table */
            .table-wrap {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            overflow: hidden;
            }

            table { width: 100%; border-collapse: collapse; }
            th { 
            background: #fcfdfe; 
            padding: 16px 24px; 
            text-align: left; 
            font-size: 12px; 
            text-transform: uppercase; 
            color: #64748b; 
            letter-spacing: 0.05em; 
            }

            td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; transition: background 0.1s; vertical-align: middle; }
            tr:hover td { background: #f8fafc; }

            .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #eff6ff;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #3b82f6;
            font-weight: 700;
            font-size: 14px;
            flex-shrink: 0;
            }

            .file-attachment {
            color: #2563eb;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            padding: 4px 8px;
            border-radius: 6px;
            }
            .file-attachment:hover { background: #eff6ff; }

            /* Status Badge UI */
            .status-tag {
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            border: 1px solid transparent;
            width: fit-content;
            }

            .tag-pending { background: #fffcf0; border-color: #fde68a; color: #d97706; }
            .tag-graded { background: #f0fdf4; border-color: #bcf3cc; color: #166534; }
            .tag-revision { background: #fef2f2; border-color: #fecaca; color: #991b1b; }

            /* Action Buttons */
            .save-btn { background: #2563eb; color: white; padding: 8px 24px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
            .save-btn:hover { background: #1d4ed8; transform: translateY(-1px); }
            .edit-btn { background: white; border: 1px solid #e2e8f0; color: #475569; padding: 8px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
            .edit-btn:hover { background: #f1f5f9; }

            .mark-pill {
            display: flex;
            align-items: center;
            gap: 10px;
            }
            .mark-pill input { 
                width: 50px; 
                padding: 6px; 
                border: 1px solid #e2e8f0; 
                border-radius: 6px; 
                text-align: center; 
                font-weight: 600; 
                transition: all 0.2s;
            }
            .mark-pill input:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); }
            .mark-pill input:disabled { background: #f1f5f9; color: #94a3b8; }

            .pagination-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            background: #fcfdfe;
            border-top: 1px solid #e2e8f0;
            }
        `}</style>

            {/* --- STATS CARDS --- */}
            <div className="stats-grid">
                <StatCard
                    title="Total Submissions"
                    value={stats.total}
                    trend={<><ArrowUpwardIcon sx={{ fontSize: 16 }} /> +{submissions.length - MOCK_SUBMISSIONS.length + 3} this week</>}
                    color="trend-up"
                />
                <StatCard
                    title="Pending Grading"
                    value={stats.pending}
                    trend={<><AccessTimeIcon sx={{ fontSize: 16 }} /> Needs Action</>}
                    color="trend-neutral"
                />
                <StatCard
                    title="Average Score"
                    value={`${stats.avgScore}%`}
                    trend={<><ArrowUpwardIcon sx={{ fontSize: 16 }} /> Top 10% class avg</>}
                    color="trend-up"
                />
                <StatCard
                    title="Late Submissions"
                    value={stats.late}
                    trend={<><ArrowDownwardIcon sx={{ fontSize: 16 }} /> -2 vs last week</>}
                    color="trend-down"
                />
            </div>

            {/* --- TOOLBAR --- */}
            <div className="toolbar">
                <div className="filters">
                    {/* Course Filter */}
                    <div onClick={(e) => setAnchorElCourse(e.currentTarget)} className={`btn-ui ${filters.course !== 'All Courses' ? 'active' : ''}`}>
                        {filters.course} <ExpandMoreIcon fontSize="small" />
                    </div>
                    <Menu
                        anchorEl={anchorElCourse}
                        open={Boolean(anchorElCourse)}
                        onClose={() => setAnchorElCourse(null)}
                    >
                        <MenuItem onClick={() => { setFilters({ ...filters, course: 'All Courses' }); setAnchorElCourse(null); }}>All Courses</MenuItem>
                        <MenuItem onClick={() => { setFilters({ ...filters, course: 'CS-201' }); setAnchorElCourse(null); }}>CS-201: Data Structures</MenuItem>
                        <MenuItem onClick={() => { setFilters({ ...filters, course: 'CS-202' }); setAnchorElCourse(null); }}>CS-202: Algorithms</MenuItem>
                    </Menu>

                    {/* Status Filter */}
                    <div onClick={(e) => setAnchorElStatus(e.currentTarget)} className={`btn-ui ${filters.status !== 'All Statuses' ? 'active' : ''}`}>
                        {filters.status} <ExpandMoreIcon fontSize="small" />
                    </div>
                    <Menu
                        anchorEl={anchorElStatus}
                        open={Boolean(anchorElStatus)}
                        onClose={() => setAnchorElStatus(null)}
                    >
                        <MenuItem onClick={() => { setFilters({ ...filters, status: 'All Statuses' }); setAnchorElStatus(null); }}>All Statuses</MenuItem>
                        <MenuItem onClick={() => { setFilters({ ...filters, status: 'Pending Review' }); setAnchorElStatus(null); }}>Pending Review</MenuItem>
                        <MenuItem onClick={() => { setFilters({ ...filters, status: 'Graded' }); setAnchorElStatus(null); }}>Graded</MenuItem>
                        <MenuItem onClick={() => { setFilters({ ...filters, status: 'Needs Revision' }); setAnchorElStatus(null); }}>Needs Revision</MenuItem>
                    </Menu>
                </div>
                <div className="filters">
                    <div className="search-box">
                        <SearchIcon sx={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search student or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-ui" style={{ fontWeight: 700 }} onClick={handleExport}>
                        <FileDownloadIcon sx={{ fontSize: 20 }} /> Export Report
                    </button>
                </div>
            </div>

            {/* --- MAIN TABLE --- */}
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Submission Date</th>
                            <th>File Attachment</th>
                            <th>Status</th>
                            <th>Mark / Grade</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                    No submissions found.
                                </td>
                            </tr>
                        ) : (
                            currentItems.map((student) => (
                                <tr key={student.id}>
                                    <td>
                                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                            <div className="avatar" style={student.name.startsWith('M') ? { background: '#fef3c7', color: '#b45309' } : {}}>
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{student.name}</div>
                                                <div style={{ fontSize: 12, color: '#94a3b8' }}>ID: {student.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 500, fontSize: 13, color: student.isLate ? '#f43f5e' : '#64748b' }}>
                                            {student.date}
                                            {student.isLate && <span style={{ display: 'inline-block', marginLeft: 4, fontSize: 10, background: '#ffe4e6', color: '#e11d48', padding: '1px 4px', borderRadius: 4 }}>LATE</span>}
                                        </span>
                                    </td>
                                    <td>
                                        <a href="#" className="file-attachment">
                                            {getFileIcon(student.type)} {student.file}
                                        </a>
                                    </td>
                                    <td>
                                        <div className={`status-tag ${student.status === 'Graded' ? 'tag-graded' :
                                                student.status === 'Needs Revision' ? 'tag-revision' : 'tag-pending'
                                            }`}>
                                            {student.status}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="mark-pill">
                                            <input
                                                type="text"
                                                value={student.grade}
                                                onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                                placeholder="--"
                                                disabled={student.status === 'Graded' && student.action !== 'Update' && student.action !== 'Save' && student.action === 'Edit'}
                                            />
                                            <span style={{ fontSize: 14, color: '#94a3b8' }}>/ 100</span>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className={student.action === 'Save' || student.action === 'Update' ? 'save-btn' : 'edit-btn'}
                                            onClick={() => handleAction(student.id, student.action)}
                                        >
                                            {student.action}
                                        </button>
                                    </td>
                                </tr>
                            )))}
                    </tbody>
                </table>

                {/* --- PAGINATION FOOTER --- */}
                <div className="pagination-bar">
                    <div style={{ fontSize: 14, color: '#64748b' }}>
                        Showing <b>{currentItems.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredSubmissions.length)}</b> of <b>{filteredSubmissions.length}</b> submissions
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <button
                            className="btn-ui"
                            style={{ padding: '5px 8px' }}
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            <ChevronLeftIcon />
                        </button>
                        {totalPages > 0 && [...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className="btn-ui"
                                style={{
                                    padding: '6px 14px',
                                    background: (i + 1) === currentPage ? '#2563eb' : 'white',
                                    color: (i + 1) === currentPage ? 'white' : '#64748b',
                                    borderColor: (i + 1) === currentPage ? '#2563eb' : '#e2e8f0'
                                }}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="btn-ui"
                            style={{ padding: '5px 8px' }}
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Stat Component
const StatCard = ({ title, value, trend, color }) => (
    <div className="stat-card">
        <span className="stat-label">{title}</span>
        <span className="stat-value">{value}</span>
        <div className={`stat-trend ${color}`}>
            {trend}
        </div>
    </div>
);

export default ReportsAnalytics;
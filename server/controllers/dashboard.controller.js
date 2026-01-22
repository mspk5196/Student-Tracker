import db from '../config/db.js';

// Get dashboard metrics
export const getDashboardMetrics = async (req, res) => {
  try {
    
    // Get user info from request (added by auth middleware)
    const userId = req.user?.userId || req.user?.user_id || req.user?.id;
    
    // 1. Total Students Count - Count directly from students table
    const [totalStudentsResult] = await db.query(`
      SELECT COUNT(*) as total_count FROM students WHERE 1=1
    `);
    const totalStudents = totalStudentsResult[0]?.total_count || 0;

    // 2. Active Groups Count - Count from groups table where status is Active
    const [activeGroupsResult] = await db.query(`
      SELECT COUNT(*) as total_count FROM \`groups\` WHERE status = 'Active'
    `);
    const activeGroups = activeGroupsResult[0]?.total_count || 0;

    // 3. Average Attendance Percentage
    const [attendanceResult] = await db.query(`
      SELECT 
        COUNT(*) as total_sessions,
        SUM(is_present) as present_count,
        ROUND((SUM(is_present) / COUNT(*)) * 100, 1) as avg_attendance
      FROM attendance
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    const avgAttendance = attendanceResult[0]?.avg_attendance || 0;
    const attendanceTrend = 0; // You can calculate trend by comparing with previous period

    // 4. Tasks Due (within next 2 days)
    const [tasksDueResult] = await db.query(`
      SELECT COUNT(*) as due_count FROM tasks
      WHERE due_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 2 DAY)
      AND status = 'Active'
    `);
    const tasksDue = tasksDueResult[0]?.due_count || 0;

    const metrics = [
      { 
        id: 1, 
        label: 'Total Students', 
        value: totalStudents.toString(), 
        trend: '+0%', 
        trendContext: 'from last semester', 
        isPositive: true 
      },
      { 
        id: 2, 
        label: 'Active Groups', 
        value: activeGroups.toString(), 
        context: 'Active classes this term' 
      },
      { 
        id: 3, 
        label: 'Avg Attendance', 
        value: `${avgAttendance}%`, 
        trend: attendanceTrend >= 0 ? `+${attendanceTrend}%` : `${attendanceTrend}%`, 
        trendContext: 'vs last week', 
        isPositive: attendanceTrend >= 0 
      },
      { 
        id: 4, 
        label: 'Tasks Due', 
        value: tasksDue.toString(), 
        context: 'Within next 48 hours' 
      },
    ];

    res.status(200).json({ 
      success: true, 
      data: metrics,
      user_id: userId
    });
  } catch (error) {
    console.error(' Error fetching dashboard metrics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard metrics',
      error: error.message 
    });
  }
};

// Get attendance by department/venue
export const getAttendanceByDepartment = async (req, res) => {
  try {
    const { period } = req.query; // 'Weekly' or 'Monthly'

    let dateFilter = '';
    if (period === 'Weekly') {
      dateFilter = 'AND a.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    } else if (period === 'Monthly') {
      dateFilter = 'AND a.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
    }

    const [attendanceData] = await db.query(`
      SELECT 
        v.venue_name as dept,
        COUNT(*) as total_sessions,
        SUM(a.is_present) as present_count,
        ROUND((SUM(a.is_present) / COUNT(*)) * 100, 0) as attendance_percentage
      FROM attendance a
      INNER JOIN venue v ON a.venue_id = v.venue_id
      WHERE 1=1 ${dateFilter}
      GROUP BY v.venue_id, v.venue_name
      ORDER BY attendance_percentage DESC
      LIMIT 10
    `);

    const formattedData = attendanceData.map(item => ({
      dept: item.dept,
      value: item.attendance_percentage
    }));

    // If no data, return some defaults
    if (formattedData.length === 0) {
      const [allVenues] = await db.query(`
        SELECT venue_name as dept FROM venue WHERE status = 'Active' LIMIT 5
      `);
      formattedData.push(...allVenues.map(v => ({ dept: v.dept, value: 0 })));
    }


    res.status(200).json({ 
      success: true, 
      data: formattedData,
      period: period || 'Weekly'
    });
  } catch (error) {
    console.error('❌ Error fetching attendance by department:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch attendance data',
      error: error.message 
    });
  }
};

// Get task completion percentage
export const getTaskCompletion = async (req, res) => {
  try {
    const [taskStats] = await db.query(`
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN ts.status = 'Graded' THEN 1 ELSE 0 END) as completed_tasks,
        ROUND((SUM(CASE WHEN ts.status = 'Graded' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 0) as completion_percentage
      FROM task_submissions ts
      INNER JOIN tasks t ON ts.task_id = t.task_id
      WHERE t.status = 'Active'
        AND ts.submitted_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    const completionPercentage = taskStats[0]?.completion_percentage || 0;

    res.status(200).json({ 
      success: true, 
      data: {
        percentage: completionPercentage,
        label: 'Task Completion',
        total: taskStats[0]?.total_tasks || 0,
        completed: taskStats[0]?.completed_tasks || 0
      }
    });
  } catch (error) {
    console.error('❌ Error fetching task completion:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch task completion data',
      error: error.message 
    });
  }
};

// Get alerts with pagination - FIXED VERSION
export const getAlerts = async (req, res) => {
  try {
    const { page = 1, limit = 3, search = '', issueType = 'all', sortBy = 'date', sortOrder = 'desc' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Get all alerts without pagination first (simpler approach)
    const [lowAttendanceAlerts] = await db.query(`
      SELECT s.student_id as id, u.name, u.ID as roll_number,
      CONCAT(v.venue_name, ' - ', g.group_name) as group_name,
      'Low Attendance (< 60%)' as issue, 
      'danger' as type, 
      MAX(a.created_at) as last_date,
      COUNT(*) as session_count,
      SUM(a.is_present) as present_count,
      ROUND((SUM(a.is_present) / COUNT(*)) * 100, 0) as attendance_percentage
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      INNER JOIN group_students gs ON s.student_id = gs.student_id
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      INNER JOIN venue v ON g.venue_id = v.venue_id
      INNER JOIN attendance a ON s.student_id = a.student_id
      WHERE gs.status = 'Active'
        AND a.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY s.student_id, u.name, u.ID, v.venue_name, g.group_name
      HAVING attendance_percentage < 60
      ORDER BY attendance_percentage ASC
    `);

    const [overdueTasksAlerts] = await db.query(`
      SELECT DISTINCT
        s.student_id as id,
        u.name,
        u.ID as roll_number,
        t.title as group_name,
        CONCAT('Task Overdue: ', t.title) as issue,
        'warning' as type,
        t.due_date as last_date
      FROM task_submissions ts
      INNER JOIN students s ON ts.student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      INNER JOIN tasks t ON ts.task_id = t.task_id
      WHERE ts.status = 'Pending Review'
        AND t.due_date < NOW()
        AND t.status = 'Active'
      ORDER BY t.due_date ASC
    `);

    const [consecutiveAbsenceAlerts] = await db.query(`
      SELECT DISTINCT
        s.student_id as id,
        u.name,
        u.ID as roll_number,
        v.venue_name as group_name,
        '3+ Consecutive Absences' as issue,
        'danger' as type,
        MAX(a.created_at) as last_date
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      INNER JOIN attendance a ON s.student_id = a.student_id
      INNER JOIN venue v ON a.venue_id = v.venue_id
      WHERE a.is_present = 0
        AND a.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY s.student_id, u.name, u.ID, v.venue_name
      HAVING COUNT(*) >= 3
      ORDER BY last_date DESC
    `);

    // Combine all alerts
    let allAlerts = [
      ...lowAttendanceAlerts.map(a => ({
        id: a.roll_number || a.id,
        name: a.name,
        group: a.group_name,
        issue: `${a.issue} (${a.attendance_percentage}%)`,
        type: a.type,
        date: formatDate(a.last_date),
        dateRaw: a.last_date,
        attendance_percentage: a.attendance_percentage
      })),
      ...overdueTasksAlerts.map(a => ({
        id: a.roll_number || a.id,
        name: a.name,
        group: a.group_name,
        issue: a.issue,
        type: a.type,
        date: formatDate(a.last_date),
        dateRaw: a.last_date
      })),
      ...consecutiveAbsenceAlerts.map(a => ({
        id: a.roll_number || a.id,
        name: a.name,
        group: a.group_name,
        issue: a.issue,
        type: a.type,
        date: formatDate(a.last_date),
        dateRaw: a.last_date
      }))
    ];

    // Apply search filter
    if (search && search.trim().length > 0) {
      const searchLower = search.toLowerCase().trim();
      allAlerts = allAlerts.filter(alert => 
        alert.name.toLowerCase().includes(searchLower) ||
        alert.id.toString().toLowerCase().includes(searchLower) ||
        alert.group.toLowerCase().includes(searchLower) ||
        alert.issue.toLowerCase().includes(searchLower)
      );
    }

    // Apply issue type filter
    if (issueType && issueType !== 'all') {
      if (issueType === 'danger' || issueType === 'warning') {
        allAlerts = allAlerts.filter(alert => alert.type === issueType);
      } else if (issueType === 'attendance') {
        allAlerts = allAlerts.filter(alert => alert.issue.includes('Attendance') || alert.issue.includes('Absence'));
      } else if (issueType === 'task') {
        allAlerts = allAlerts.filter(alert => alert.issue.includes('Task'));
      } else if (issueType === 'absence') {
        allAlerts = allAlerts.filter(alert => alert.issue.includes('Absence'));
      }
    }

    // Apply sorting
    allAlerts.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'issue':
          comparison = a.issue.localeCompare(b.issue);
          break;
        case 'date':
        default:
          comparison = new Date(b.dateRaw || 0) - new Date(a.dateRaw || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Apply pagination
    const totalAlerts = allAlerts.length;
    const totalPages = Math.ceil(totalAlerts / limitNum);
    const paginatedAlerts = allAlerts.slice(offset, offset + limitNum);

    res.status(200).json({ 
      success: true, 
      data: paginatedAlerts,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalItems: totalAlerts,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    console.error('❌ Error fetching alerts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch alerts',
      error: error.message 
    });
  }
};



// Helper function to format dates
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
}
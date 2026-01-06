import db from '../config/db.js';
import PDFDocument from 'pdfkit';

// Helper function to get year suffix
function getYearSuffix(year) {
  if (year === 1) return 'st';
  if (year === 2) return 'nd';
  if (year === 3) return 'rd';
  return 'th';
}

// Get all students with pagination and server-side search/filter
export const getAllStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      department = '',
      year = ''
    } = req.query;

    const offset = (page - 1) * limit;

    // Build WHERE clause for search and filters
    let whereConditions = ['u.role_id = 3'];
    let queryParams = [];

    // Search condition (name, email, or studentId)
    if (search) {
      whereConditions. push('(u.name LIKE ? OR u.email LIKE ? OR u.ID LIKE ?)');
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    // Department filter
    if (department && department !== 'All Departments') {
      whereConditions.push('u.department = ?');
      queryParams.push(department);
    }

    // Year filter
    if (year && year !== 'All Years') {
      const yearNumber = parseInt(year. replace(/\D/g, ''));
      if (! isNaN(yearNumber)) {
        whereConditions.push('s.year = ?');
        queryParams.push(yearNumber);
      }
    }

    const whereClause = whereConditions. join(' AND ');

    // Get total count for pagination
    const [countResult] = await db. query(`
      SELECT COUNT(*) as total
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      WHERE ${whereClause}
    `, queryParams);

    const totalStudents = countResult[0].total;
    const totalPages = Math.ceil(totalStudents / limit);

    // Get paginated students
    const [students] = await db. query(`
      SELECT 
        s. student_id,
        s. year,
        s.semester,
        u.user_id,
        u.name,
        u.email,
        u.ID as studentId,
        u.department,
        u.created_at as joinDate,
        u.is_active,
        f.faculty_id,
        fu.name as facultyName,
        COALESCE(
          (SELECT ROUND((SUM(CASE WHEN a.is_present = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 1)
           FROM attendance a
           WHERE a.student_id = s. student_id), 0
        ) as attendance,
        COALESCE(
          (SELECT COUNT(*)
           FROM student_report sr
           WHERE sr.student_id = s.student_id), 0
        ) as completedTasks,
        COALESCE(
          (SELECT COUNT(*)
           FROM student_report sr
           WHERE sr.student_id = s.student_id 
           AND sr.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)), 0
        ) as totalTasks
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN faculties f ON s.assigned_faculty_id = f.faculty_id
      LEFT JOIN users fu ON f. user_id = fu.user_id
      WHERE ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT ?  OFFSET ?
    `, [...queryParams, parseInt(limit), offset]);

    const formattedStudents = students.map(student => ({
      id: student.studentId,
      name: student.name,
      email: student.email,
      image: null,
      department: student.department,
      year: `${student.year}${getYearSuffix(student.year)} Year`,
      section: `Semester ${student.semester}`,
      attendance: student.attendance.toString(),
      tasks: `${student.completedTasks}/${student.totalTasks}`,
      student_id: student.student_id,
      user_id: student.user_id,
      semester: student.semester,
      facultyName: student.facultyName || 'Not Assigned',
      is_active: student.is_active,
      joinDate: student. joinDate
    }));

    res.status(200).json({
      success: true,
      data: formattedStudents,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalStudents,
        limit:  parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
};

// Get single student by ID
export const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;

    const [student] = await db.query(`
      SELECT 
        s.student_id,
        s.year,
        s.semester,
        s.assigned_faculty_id,
        u.user_id,
        u.name,
        u.email,
        u.ID as studentId,
        u.department,
        u.created_at as joinDate,
        u.is_active,
        f.faculty_id,
        fu.name as facultyName,
        COALESCE(
          (SELECT ROUND((SUM(CASE WHEN a.is_present = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 1)
           FROM attendance a
           WHERE a.student_id = s.student_id), 0
        ) as attendance,
        COALESCE(
          (SELECT COUNT(*)
           FROM student_report sr
           WHERE sr. student_id = s.student_id), 0
        ) as completedTasks,
        COALESCE(
          (SELECT COUNT(*)
           FROM student_report sr
           WHERE sr.student_id = s.student_id 
           AND sr.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)), 0
        ) as totalTasks
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN faculties f ON s.assigned_faculty_id = f.faculty_id
      LEFT JOIN users fu ON f. user_id = fu.user_id
      WHERE s.student_id = ?  AND u.role_id = 3
    `, [studentId]);

    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const formattedStudent = {
      student_id: student[0].student_id,
      user_id: student[0].user_id,
      id: student[0].studentId,
      studentId: student[0].studentId,
      name: student[0]. name,
      email: student[0].email,
      department: student[0].department,
      year: student[0].year,
      semester: student[0].semester,
      section: `Semester ${student[0].semester}`,
      attendance: student[0].attendance.toString(),
      tasks: `${student[0].completedTasks}/${student[0].totalTasks}`,
      completedTasks: student[0]. completedTasks,
      totalTasks: student[0].totalTasks,
      facultyName: student[0].facultyName || 'Not Assigned',
      is_active: student[0].is_active,
      joinDate: student[0]. joinDate,
      image: null
    };

    res.status(200).json({ success: true, data: formattedStudent });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student'
    });
  }
};

// Download student report as PDF
export const downloadStudentReport = async (req, res) => {
  try {
    const { studentId } = req.params;

    const [student] = await db.query(`
      SELECT 
        s.student_id,
        s.year,
        s.semester,
        u.name,
        u.email,
        u.ID as studentId,
        u.department,
        fu.name as facultyName,
        COALESCE(
          (SELECT ROUND((SUM(CASE WHEN a.is_present = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 1)
           FROM attendance a
           WHERE a.student_id = s.student_id), 0
        ) as attendance,
        (SELECT COUNT(*) FROM student_report sr WHERE sr.student_id = s.student_id) as completedTasks,
        (SELECT AVG(sr.rating) FROM student_report sr WHERE sr.student_id = s.student_id) as avgRating
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN faculties f ON s.assigned_faculty_id = f.faculty_id
      LEFT JOIN users fu ON f.user_id = fu.user_id
      WHERE s.student_id = ?  AND u.role_id = 3
    `, [studentId]);

    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const studentData = student[0];

    // Create PDF
    const doc = new PDFDocument();
    const filename = `student_report_${studentData.studentId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // PDF Content
    doc.fontSize(20).text('Student Performance Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${studentData.name}`);
    doc.text(`Student ID: ${studentData.studentId}`);
    doc.text(`Email: ${studentData.email}`);
    doc.text(`Department: ${studentData.department}`);
    doc.text(`Year: ${studentData.year}, Semester: ${studentData.semester}`);
    doc.text(`Faculty: ${studentData.facultyName || 'Not Assigned'}`);
    doc.moveDown();
    doc.text(`Attendance: ${studentData.attendance}%`);
    doc.text(`Completed Tasks: ${studentData.completedTasks}`);
    doc.text(`Average Rating: ${studentData.avgRating ?  studentData.avgRating.toFixed(1) : 'N/A'}/10`);
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });

    doc.end();

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
};

// Get available departments and years for filters
export const getFilters = async (req, res) => {
  try {
    const [departments] = await db.query(`
      SELECT DISTINCT u.department
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      WHERE u.role_id = 3
      ORDER BY u.department
    `);

    const [years] = await db.query(`
      SELECT DISTINCT s.year
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      WHERE u.role_id = 3
      ORDER BY s.year
    `);

    res.status(200).json({
      success: true,
      data: {
        departments:  departments.map(d => d.department),
        years: years.map(y => `${y. year}${getYearSuffix(y. year)} Year`)
      }
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch filters' });
  }
};

// Create new student
export const createStudent = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { name, email, studentId, department, year, semester, assigned_faculty_id } = req. body;

    if (!name || !email || !studentId || !department || !year || !semester) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const [existingEmail] = await connection.query(
      'SELECT email FROM users WHERE email = ?',
      [email]
    );

    if (existingEmail.length > 0) {
      return res. status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const [existingId] = await connection.query(
      'SELECT ID FROM users WHERE ID = ?',
      [studentId]
    );

    if (existingId.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Student ID already exists'
      });
    }

    await connection.beginTransaction();

    const [userResult] = await connection.query(
      `INSERT INTO users (role_id, name, email, ID, department, created_at, is_active) 
       VALUES (3, ?, ?, ?, ?, NOW(), 1)`,
      [name, email, studentId, department]
    );

    const userId = userResult.insertId;

    await connection.query(
      'INSERT INTO students (user_id, year, semester, assigned_faculty_id) VALUES (?, ?, ?, ?)',
      [userId, year, semester, assigned_faculty_id || 0]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { userId, studentId }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create student'
    });
  } finally {
    connection.release();
  }
};

// Update student
export const updateStudent = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { studentId } = req.params;
    const { name, email, department, year, semester, assigned_faculty_id, is_active } = req.body;

    if (!name || ! email || !department || !year || !semester) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const [existingStudent] = await connection.query(
      'SELECT s.student_id, s.user_id FROM students s INNER JOIN users u ON s.user_id = u.user_id WHERE s.student_id = ?  AND u.role_id = 3',
      [studentId]
    );

    if (existingStudent.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const userId = existingStudent[0].user_id;

    const [emailCheck] = await connection.query(
      'SELECT user_id FROM users WHERE email = ?  AND user_id != ?',
      [email, userId]
    );

    if (emailCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    await connection.beginTransaction();

    await connection.query(
      `UPDATE users 
       SET name = ?, email = ?, department = ?, is_active = ?  
       WHERE user_id = ?`,
      [name, email, department, is_active !== undefined ? is_active : 1, userId]
    );

    await connection.query(
      'UPDATE students SET year = ?, semester = ?, assigned_faculty_id = ?  WHERE student_id = ?',
      [year, semester, assigned_faculty_id || 0, studentId]
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message:  'Student updated successfully'
    });

  } catch (error) {
    await connection. rollback();
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student'
    });
  } finally {
    connection.release();
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { studentId } = req. params;

    const [existingStudent] = await connection.query(
      'SELECT s.student_id, s.user_id FROM students s INNER JOIN users u ON s.user_id = u.user_id WHERE s.student_id = ? AND u.role_id = 3',
      [studentId]
    );

    if (existingStudent.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const userId = existingStudent[0].user_id;

    await connection.beginTransaction();

    await connection.query('DELETE FROM students WHERE student_id = ?', [studentId]);
    await connection.query('DELETE FROM users WHERE user_id = ?', [userId]);

    await connection. commit();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      message:  'Failed to delete student'
    });
  } finally {
    connection.release();
  }
};

// Get student statistics
export const getStudentStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as totalStudents,
        COUNT(CASE WHEN u.is_active = 1 THEN 1 END) as activeStudents,
        COUNT(CASE WHEN u. is_active = 0 THEN 1 END) as inactiveStudents
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      WHERE u.role_id = 3
    `);

    res.status(200).json({ success: true, data: stats[0] });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student statistics'
    });
  }
};

// Get student attendance dashboard data
export const getStudentAttendanceDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { year = new Date().getFullYear() } = req.query;

    // Get overall stats - FIXED:  Removed sessions table dependency
    const [overallStats] = await db.query(`
      SELECT 
        COALESCE(ROUND((SUM(CASE WHEN a.is_present = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT a.attendance_id), 0)) * 100, 1), 0) as overallAttendance,
        COUNT(DISTINCT a.attendance_id) as totalDays,
        COUNT(DISTINCT CASE WHEN a.is_present = 1 THEN a.attendance_id END) as presentDays
      FROM attendance a
      WHERE a.student_id = ?  AND YEAR(a.created_at) = ?
    `, [studentId, year]);

    // Get session status
    const [sessionStatus] = await db.query(`
      SELECT 
        COUNT(CASE WHEN is_present = 1 AND COALESCE(is_late, 0) = 0 THEN 1 END) as present,
        COUNT(CASE WHEN COALESCE(is_late, 0) = 1 THEN 1 END) as late,
        COUNT(CASE WHEN is_present = 0 THEN 1 END) as absent
      FROM attendance
      WHERE student_id = ?  AND YEAR(created_at) = ?
    `, [studentId, year]);

    // Get monthly chart data - COMPLETELY FIXED GROUP BY
    const [chartData] = await db.query(`
      SELECT 
        MONTH(created_at) as month,
        ROUND(AVG(CASE WHEN is_present = 1 THEN 100 ELSE 0 END), 1) as general,
        0 as skill
      FROM attendance
      WHERE student_id = ? AND YEAR(created_at) = ?
      GROUP BY MONTH(created_at)
      ORDER BY MONTH(created_at)
    `, [studentId, year]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedChartData = monthNames.map((month, index) => {
      const monthData = chartData.find(m => m.month === index + 1);
      return {
        month,
        general: monthData ? monthData.general : 0,
        skill: monthData ? monthData.skill : 0
      };
    });

    // Simple subjects - no complex joins
    const subjects = [
      { name: "Data Structures & Algorithms", current: 24, total: 24, percent: 100 },
      { name: "Database Management Systems", current: 22, total:  24, percent: 91 },
      { name: "Computer Networks", current: 20, total: 22, percent: 90 },
      { name: "Software Engineering", current: 22, total: 22, percent: 100 },
      { name: "Operating Systems", current: 18, total: 24, percent: 75 },
      { name: "Machine Learning", current: 20, total: 20, percent: 100 }
    ];

    // Simple skills - no complex joins
    const skills = [
      { name:  "Advanced React Patterns", type: "Workshop", date: "Jan 15, 2025", status: "Present" },
      { name: "UI/UX Design Sprint", type: "Event", date: "Jan 12, 2025", status: "Present" },
      { name: "Cloud Architecture", type: "Seminar", date: "Jan 08, 2025", status: "Late" },
      { name:  "Hackathon Kickoff", type: "Event", date: "Jan 05, 2025", status: "Absent" },
      { name:  "Node.js Performance", type: "Workshop", date:  "Dec 28, 2024", status: "Present" }
    ];

    res.status(200).json({
      success: true,
      data: {
        overallStats:  [
          {
            title: "OVERALL ATTENDANCE",
            value:  `${overallStats[0].overallAttendance}%`,
            sub: `Total days: ${overallStats[0]. presentDays} / ${overallStats[0].totalDays}`,
            color: overallStats[0].overallAttendance >= 90 ? "#10B981" : overallStats[0].overallAttendance >= 75 ? "#F59E0B" : "#EF4444"
          },
          {
            title: "SKILL ATTENDANCE",
            value: "90%",
            sub: "Skill Attended: 45 / 50",
            color: "#1e293b"
          }
        ],
        sessionStatus: [
          { label: "Present", count: sessionStatus[0].present, theme: "green" },
          { label: "Late", count: sessionStatus[0].late, theme: "orange" },
          { label: "Absent", count: sessionStatus[0].absent, theme: "red" }
        ],
        chartData: formattedChartData,
        subjects:  subjects,
        skills: skills
      }
    });
  } catch (error) {
    console.error('Error fetching attendance dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance dashboard',
      error: error.message
    });
  }
};

// Get student overview data
export const getStudentOverview = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get student personal info first
    const [studentInfo] = await db.query(`
      SELECT 
        u.name, u.email, u.ID as studentId,
        s.year as currentSemester
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      WHERE s.student_id = ?
    `, [studentId]);

    if (studentInfo.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Get basic overview stats
    const [overview] = await db.query(`
      SELECT 
        COALESCE(ROUND((SUM(CASE WHEN a. is_present = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT a.attendance_id), 0)) * 100, 0), 0) as overallAttendance
      FROM attendance a
      WHERE a.student_id = ? 
    `, [studentId]);

    // Simple skills
    const skills = [
      { name: "Data Structures", rating: 84 },
      { name: "Python Programming", rating: 94 },
      { name: "SQL & Databases", rating: 84 },
      { name: "Web Development", rating: 84 },
      { name: "Research Methodology", rating: 82 },
      { name: "Team Leadership", rating: 84 },
      { name: "Cloud Computing", rating: 78 },
      { name: "Machine Learning", rating: 92 },
      { name: "Cyber Security", rating: 85 }
    ];

    // Get weekly activity - COMPLETELY FIXED - Proper GROUP BY
    const [weeklyActivityRaw] = await db.query(`
      SELECT 
        DATE(created_at) as activity_date,
        COUNT(*) * 10 as value
      FROM attendance
      WHERE student_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 9 DAY)
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
      LIMIT 9
    `, [studentId]);

    // Format weekly activity with day names
    const weeklyActivity = weeklyActivityRaw.map(row => {
      const date = new Date(row.activity_date);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return {
        day: dayNames[date.getDay()],
        value: Math.min(row.value, 100)
      };
    });

    // Default if no data
    const defaultWeeklyActivity = [
      { day: 'Mon', value: 35 },
      { day: 'Tue', value: 65 },
      { day: 'Wed', value: 42 },
      { day: 'Thu', value: 45 },
      { day: 'Fri', value: 58 },
      { day: 'Sat', value: 25 },
      { day: 'Sun', value: 48 }
    ];

    const taskStatus = {
      completed: 8,
      inProgress: 4,
      total: 14
    };

    const performance = [
      { subject: "DSA", individual: 92, average: 75 },
      { subject: "Web", individual: 88, average: 78 },
      { subject: "SQL", individual: 95, average: 82 },
      { subject: "Math", individual: 78, average: 85 },
      { subject: "Algo", individual: 85, average:  72 },
      { subject: "Python", individual: 94, average: 80 },
      { subject: "Network", individual: 88, average: 78 },
      { subject: "Leader", individual: 96, average: 85 },
      { subject: "OS", individual: 82, average: 74 },
      { subject: "AI", individual: 91, average: 79 }
    ];

    const credits = { earned: 18, total: 20 };

    res.status(200).json({
      success: true,
      data: {
        name: studentInfo[0].name,
        email: studentInfo[0].email,
        phone: "+1 (555) 123-4567",
        dateOfBirth: "April 15, 2002",
        enrollmentDate: "Sept 01, 2021",
        advisor: "Dr. Alan Grant",
        currentSemester:  studentInfo[0].currentSemester,
        profilePic: "",
        overview: {
          overallAttendance: overview[0].overallAttendance,
          classAverage: 88,
          taskCompletion: 85,
          tasksSubmitted: "12/14",
          cgpa: 3.8,
          cgpaRank: "Top 5% of Class"
        },
        skills: skills,
        weeklyActivity: weeklyActivity. length > 0 ? weeklyActivity : defaultWeeklyActivity,
        taskStatus: taskStatus,
        performance: performance,
        credits: credits,
        semesterGPA: 3.92
      }
    });
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overview',
      error: error.message
    });
  }
};
// Get student ranking data
export const getStudentRanking = async (req, res) => {
  try {
    const { studentId } = req. params;

    // Get all students with global points
    const [students] = await db.query(`
      SELECT 
        s.student_id as id,
        u.name,
        '' as profilePic,
        COALESCE(SUM(sr.rating * 10), 0) as globalPoints,
        COALESCE(SUM(CASE WHEN sr.task_type = 'React' THEN sr.rating * 10 ELSE 0 END), 0) as reactPoints,
        COALESCE(SUM(CASE WHEN sr.task_type = 'HTML' THEN sr.rating * 10 ELSE 0 END), 0) as htmlPoints,
        COALESCE(SUM(CASE WHEN sr. task_type = 'UIUX' THEN sr.rating * 10 ELSE 0 END), 0) as uiuxPoints,
        COALESCE(SUM(CASE WHEN sr.task_type = 'JS' THEN sr.rating * 10 ELSE 0 END), 0) as jsPoints,
        COALESCE(SUM(CASE WHEN sr. task_type = 'Node' THEN sr.rating * 10 ELSE 0 END), 0) as nodePoints
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN student_report sr ON sr.student_id = s.student_id
      WHERE u.role_id = 3
      GROUP BY s.student_id, u.name
      ORDER BY globalPoints DESC
    `);

    // Format students data
    const formattedStudents = students.map(s => ({
      id: s. id. toString(),
      name: s.name + (s.id. toString() === studentId ? " (You)" : ""),
      profilePic: s.profilePic,
      points: {
        global: s.globalPoints,
        react: s.reactPoints,
        html: s.htmlPoints,
        uiux: s. uiuxPoints,
        js: s.jsPoints,
        node: s.nodePoints
      }
    }));

    // Get workshops
    const [workshops] = await db.query(`
      SELECT 
        'react' as id, 'Advanced React' as title, 'In Progress (Day 3)' as status
      UNION ALL
      SELECT 'html', 'HTML & CSS Basics', 'Jan 10 - Jan 12'
      UNION ALL
      SELECT 'uiux', 'UI/UX Sprint', 'Jan 05 - Jan 08'
      UNION ALL
      SELECT 'js', 'JS Fundamentals', 'Dec 15 - Dec 20'
      UNION ALL
      SELECT 'node', 'Node.js Backend', 'Nov 20 - Nov 25'
    `);

    res.status(200).json({
      success: true,
      data: {
        me: { 
          id: studentId, 
          name: formattedStudents. find(s => s.id === studentId)?.name || "You" 
        },
        students: formattedStudents,
        workshops: workshops
      }
    });
  } catch (error) {
    console.error('Error fetching ranking:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ranking' });
  }
};


// Get student task and grade data
export const getStudentTaskGrade = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Verify student exists
    const [studentCheck] = await db.query(`
      SELECT student_id FROM students WHERE student_id = ?
    `, [studentId]);

    if (studentCheck.length === 0) {
      return res.status(404).json({ success: false, message:  'Student not found' });
    }

    // Sample current workshop - hardcoded for now
    const currentWorkshop = {
      id: 'W001',
      title: 'Advanced React Patterns',
      faculty: 'Dr. Sarah Smith',
      venue: 'Lab 304 (Center Block)',
      duration: '10 Days (Dec 20 - Dec 30, 2025)',
      tasks: [
        { day: 1, date: '2025-12-20', title: 'Higher Order Components', points: 50, grade: 'A+', status: 'Completed' },
        { day: 2, date: '2025-12-21', title: 'Render Props & Context', points: 45, grade: 'A', status: 'Completed' },
        { day: 3, date: '2025-12-22', title: 'Compound Components', points: 55, grade: 'A+', status: 'Completed' },
        { day: 4, date: '2025-12-23', title: 'Control Props Pattern', points: 50, grade: 'A+', status: 'Completed' },
        { day: 5, date: '2025-12-24', title: 'Custom Hooks Logic', points: 45, grade: 'A', status: 'Completed' },
        { day: 6, date: '2025-12-25', title: 'State Management Systems', points: 0, grade: 'In Progress', status: 'Active' },
        { day: 7, date: '2025-12-26', title: 'Performance Optimization', points: 0, grade: 'Locked', status: 'Upcoming' },
        { day: 8, date: '2025-12-27', title: 'Error Boundaries', points: 0, grade:  'Locked', status: 'Upcoming' }
      ]
    };

    // Sample history
    const history = [
      {
        id: 'H001',
        title: 'UI/UX Design Sprint',
        date: 'Nov 10 - Nov 12, 2025',
        duration: '3 Days',
        faculty: 'Prof. Alan Kay',
        grade: 'A+',
        points: 120,
        tasks: [
          { day: 1, date: '2025-11-10', title: 'User Research', points: 40, grade: 'A', status: 'Completed' },
          { day: 2, date: '2025-11-11', title: 'Wireframing', points: 40, grade: 'A+', status: 'Completed' },
          { day: 3, date: '2025-11-12', title: 'High-Fidelity Prototyping', points: 40, grade: 'A+', status: 'Completed' }
        ]
      },
      {
        id: 'H002',
        title: 'Node.js Backend Mastery',
        date: 'Oct 15 - Oct 20, 2025',
        duration: '6 Days',
        faculty: 'Ryan Dahl',
        grade:  'A',
        points:  180,
        tasks: [
          { day: 1, date: '2025-10-15', title: 'Express Basics', points: 30, grade: 'A', status: 'Completed' },
          { day: 2, date: '2025-10-16', title: 'REST APIs', points: 30, grade: 'A', status: 'Completed' },
          { day: 3, date: '2025-10-17', title: 'Middleware', points: 30, grade:  'A', status: 'Completed' }
        ]
      },
      {
        id: 'H003',
        title:  'Cloud Architecture Seminar',
        date: 'Aug 05, 2025',
        duration:  '1 Day',
        faculty: 'Dr. Werner Vogels',
        grade:  'Participated',
        points: 50,
        tasks: [
          { day: 1, date:  '2025-08-05', title: 'Serverless Concepts', points: 50, grade: 'A+', status: 'Completed' }
        ]
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        currentWorkshop: currentWorkshop,
        history: history
      }
    });
  } catch (error) {
    console.error('Error fetching task grade:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task grade data',
      error: error.message
    });
  }
};

import db from '../config/db.js';

// ====================== HELPER FUNCTIONS ======================
function getRandomColor() {
  const colors = ['#C0C6D8', '#9CA3AF', '#EBE0D9', '#D1D5DB', '#B4B8C5'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Get user info by any ID (user_id, faculty_id, or id)
const getUserInfo = async (userId) => {
  try {
    // Try to find by user_id first
    let [userInfo] = await db.query(`
      SELECT 
        u.user_id, 
        u.name, 
        u.role_id, 
        r.role,
        f.faculty_id,
        f.designation
      FROM users u
      LEFT JOIN role r ON u.role_id = r.role_id
      LEFT JOIN faculties f ON u.user_id = f.user_id
      WHERE u.user_id = ? OR f.faculty_id = ? OR u.ID = ?
    `, [userId, userId, userId]);

    if (userInfo.length === 0) {
      return null;
    }

    return userInfo[0];
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

// Ensure user has faculty_id (create if needed for admins)
const ensureFacultyId = async (userId) => {
  const user = await getUserInfo(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  // If user already has faculty_id, return it
  if (user.faculty_id) {
    return user.faculty_id;
  }

  // If user is admin and doesn't have faculty_id, create one
  if (user.role === 'admin') {
    
    const [result] = await db.query(`
      INSERT INTO faculties (user_id, designation) 
      VALUES (?, 'Administrator')
    `, [user.user_id]);

    return result.insertId;
  }

  // For non-admin users without faculty_id
  throw new Error('User is not a faculty member');
};

// ====================== CONTROLLER FUNCTIONS ======================

// Get ALL venues (for any user)
export const getVenueAllocations = async (req, res) => {
  try {
    const { facultyId } = req.params;
    

    // Get user info
    const user = await getUserInfo(facultyId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Get ALL active venues
    const [allocations] = await db.query(`
      SELECT 
        v.venue_id,
        v.venue_name,
        v.capacity,
        v.assigned_faculty_id,
        COUNT(DISTINCT gs.student_id) as student_count,
        u.name as assigned_faculty_name
      FROM venue v
      LEFT JOIN \`groups\` g ON v.venue_id = g.venue_id
      LEFT JOIN group_students gs ON g.group_id = gs.group_id AND gs.status = 'Active'
      LEFT JOIN faculties f ON v.assigned_faculty_id = f.faculty_id
      LEFT JOIN users u ON f.user_id = u.user_id
      WHERE v.status = 'Active'
      GROUP BY v.venue_id
      ORDER BY v.venue_name
    `);


    res.status(200).json({ 
      success: true, 
      data: allocations,
      user_info: {
        user_id: user.user_id,
        faculty_id: user.faculty_id,
        name: user.name,
        role: user.role,
        designation: user.designation
      }
    });
  } catch (error) {
    console.error('❌ Error fetching venues:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch venues',
      error: error.message 
    });
  }
};

// Get students for a specific venue
export const getStudentsForVenue = async (req, res) => {
  try {
    const { venueId } = req.params;
    const [students] = await db.query(`
      SELECT 
        s.student_id,
        u.user_id,
        u.name,
        u.ID as roll_number,
        u.email,
        u.department,
        gs.group_id,
        g.group_name
      FROM group_students gs
      INNER JOIN students s ON gs.student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ?  
        AND gs.status = 'Active'
        AND u.is_active = 1
      ORDER BY u.name
    `, [venueId]);

    const formattedStudents = students.map(student => ({
      id: student.roll_number,
      student_id: student.student_id,
      name: student.name,
      email: student.email,
      department: student.department,
      group_name: student.group_name,
      status: '',
      remarks: '',
      avatarColor: getRandomColor()
    }));

    res.status(200).json({ 
      success: true, 
      data: formattedStudents,
      venue_id: venueId,
      count: students.length
    });
  } catch (error) {
    console.error('❌ Error fetching students:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch students',
      error: error.message 
    });
  }
};

// Get or create attendance session
export const getOrCreateSession = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { sessionName, date, timeSlot } = req.body;

    if (!sessionName || !date || !timeSlot) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: sessionName, date, timeSlot' 
      });
    }

    // Clean up session name
    const cleanSessionName = sessionName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const cleanTimeSlot = timeSlot.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_:-]/g, '');
    const fullSessionName = `${cleanSessionName}_${date}_${cleanTimeSlot}`;


    // Check if session already exists
    const [existingSession] = await connection.query(
      'SELECT session_id FROM attendance_session WHERE session_name = ?',
      [fullSessionName]
    );

    if (existingSession.length > 0) {
      return res.status(200).json({ 
        success: true, 
        data: { 
          session_id: existingSession[0].session_id, 
          existing: true,
          session_name: fullSessionName
        }
      });
    }

    // Create new session
    const [result] = await connection.query(
      'INSERT INTO attendance_session (session_name, created_at) VALUES (?, NOW())',
      [fullSessionName]
    );

    res.status(201).json({ 
      success: true, 
      data: { 
        session_id: result.insertId, 
        existing: false,
        session_name: fullSessionName
      }
    });

  } catch (error) {
    console.error('❌ Error with session:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process session',
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Save attendance - MAIN FUNCTION
export const saveAttendance = async (req, res) => {

  const connection = await db.getConnection();
  
  try {
    const { 
      facultyId,  // This can be user_id or faculty_id
      venueId, 
      sessionId, 
      date, 
      timeSlot,
      attendance 
    } = req.body;

    // Validation
    if (!facultyId || !venueId || !sessionId || !attendance || attendance.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Ensure user has faculty_id (create for admin if needed)
    const actualFacultyId = await ensureFacultyId(facultyId);

    // Verify session exists
    const [sessionCheck] = await connection.query(
      'SELECT session_id FROM attendance_session WHERE session_id = ?',
      [sessionId]
    );

    if (sessionCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Verify venue exists
    const [venueCheck] = await connection.query(
      'SELECT venue_id FROM venue WHERE venue_id = ? AND status = "Active"',
      [venueId]
    );

    if (venueCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }

    await connection.beginTransaction();

    let insertedCount = 0;
    let updatedCount = 0;

    // Process each attendance record
    for (const record of attendance) {
      
      const isPresent = record.status === 'present' ? 1 : 0;
      const isLate = record.status === 'late' ? 1 : 0;
      const remarks = record.remarks || null;

      // Check if attendance already exists for this student in this session
      const [existingRecord] = await connection.query(`
        SELECT attendance_id FROM attendance 
        WHERE student_id = ? AND session_id = ?
      `, [record.student_id, sessionId]);

      if (existingRecord.length > 0) {
        // Update existing record
        await connection.query(`
          UPDATE attendance 
          SET 
            is_present = ?, 
            remarks = ?, 
            is_late = ?, 
            faculty_id = ?,
            updated_at = NOW()
          WHERE student_id = ? AND session_id = ?
        `, [isPresent, remarks, isLate, actualFacultyId, record.student_id, sessionId]);
        updatedCount++;
      } else {
        // Insert new record
        await connection.query(`
          INSERT INTO attendance 
          (student_id, faculty_id, venue_id, session_id, is_present, is_late, remarks, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `, [record.student_id, actualFacultyId, venueId, sessionId, isPresent, isLate, remarks]);
        insertedCount++;
            }
    }

    await connection.commit();

    res.status(201).json({ 
      success: true, 
      message: 'Attendance saved successfully',
      data: {
        inserted: insertedCount,
        updated: updatedCount,
        total: attendance.length,
        faculty_id: actualFacultyId,
        session_id: sessionId
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('❌ Error saving attendance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save attendance',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    connection.release();
    }
};

// Get students who are late 5+ times
export const getLateStudents = async (req, res) => {
  try {
    const { facultyId } = req.params;
    let query = `
      SELECT 
        s.student_id,
        u.user_id,
        u.name,
        u.ID as roll_number,
        u.email,
        u.department,
        COUNT(CASE WHEN a.is_late = 1 THEN 1 END) as late_count,
        GROUP_CONCAT(
          CONCAT(ats.session_name, ' - ', DATE_FORMAT(a.created_at, '%Y-%m-%d %H:%i'))
          ORDER BY a.created_at DESC
          SEPARATOR '||'
        ) as late_sessions
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      INNER JOIN attendance a ON s.student_id = a.student_id
      INNER JOIN attendance_session ats ON a.session_id = ats.session_id
      WHERE a.is_late = 1
    `;

    const params = [];

    if (facultyId && facultyId !== 'all') {
      query += ` AND a.faculty_id = ?`;
      params.push(facultyId);
    }

    query += `
      GROUP BY s.student_id
      HAVING late_count >= 5
      ORDER BY late_count DESC, u.name
    `;

    const [students] = await db.query(query, params);


    const formattedStudents = students.map(student => ({
      student_id: student.student_id,
      name: student.name,
      roll_number: student.roll_number,
      email: student.email,
      department: student.department,
      late_count: student.late_count,
      late_sessions: student.late_sessions ? student.late_sessions.split('||') : []
    }));

    res.status(200).json({ 
      success: true, 
      data: formattedStudents,
      count: students.length
    });
  } catch (error) {
    console.error('❌ Error fetching late students:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch late students',
      error: error.message 
    });
  }
};

// Get attendance history for a student
export const getStudentAttendanceHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    const [history] = await db.query(`
      SELECT 
        a.attendance_id,
        a.is_present,
        a.is_late,
        a.remarks,
        a.created_at,
        ats.session_name,
        v.venue_name,
        u.name as faculty_name
      FROM attendance a
      INNER JOIN attendance_session ats ON a.session_id = ats.session_id
      INNER JOIN venue v ON a.venue_id = v.venue_id
      INNER JOIN faculties f ON a.faculty_id = f.faculty_id
      INNER JOIN users u ON f.user_id = u.user_id
      WHERE a.student_id = ? 
      ORDER BY a.created_at DESC
      LIMIT 50
    `, [studentId]);

    res.status(200).json({ 
      success: true, 
      data: history,
      count: history.length
    });
  } catch (error) {
    console.error('❌ Error fetching attendance history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch attendance history',
      error: error.message 
    });
  }
};

// Get attendance dashboard data for a student
export const getStudentAttendanceDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { year } = req.query;

    const currentYear = year || new Date().getFullYear();

    // Get overall attendance stats
    const [overallStats] = await db.query(`
      SELECT 
        COUNT(*) as total_sessions,
        SUM(CASE WHEN is_present = 1 THEN 1 ELSE 0 END) as present_count,
        SUM(CASE WHEN is_late = 1 THEN 1 ELSE 0 END) as late_count,
        ROUND((SUM(CASE WHEN is_present = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 0) as attendance_percentage
      FROM attendance
      WHERE student_id = ?
        AND YEAR(created_at) = ?
    `, [studentId, currentYear]);

    // Get venue-wise (subject) attendance
    const [subjectStats] = await db.query(`
      SELECT 
        v.venue_name as name,
        COUNT(*) as total,
        SUM(CASE WHEN a.is_present = 1 THEN 1 ELSE 0 END) as current,
        ROUND((SUM(CASE WHEN a.is_present = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 0) as percent
      FROM attendance a
      INNER JOIN venue v ON a.venue_id = v.venue_id
      WHERE a.student_id = ?
        AND YEAR(a.created_at) = ?
      GROUP BY v.venue_id
      ORDER BY v.venue_name
    `, [studentId, currentYear]);

    // Get recent skills/events attendance
    const [recentSkills] = await db.query(`
      SELECT 
        v.venue_name as name,
        'Workshop' as type,
        DATE_FORMAT(a.created_at, '%b %d, %Y') as date,
        CASE 
          WHEN a.is_present = 1 AND a.is_late = 0 THEN 'Present'
          WHEN a.is_late = 1 THEN 'Late'
          ELSE 'Absent'
        END as status
      FROM attendance a
      INNER JOIN venue v ON a.venue_id = v.venue_id
      WHERE a.student_id = ?
        AND YEAR(a.created_at) = ?
      ORDER BY a.created_at DESC
      LIMIT 10
    `, [studentId, currentYear]);

    // Get month-wise attendance for chart
    const [monthlyStats] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%b') as month,
        ROUND((SUM(CASE WHEN is_present = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 0) as general,
        ROUND((SUM(CASE WHEN is_present = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 0) as skill
      FROM attendance
      WHERE student_id = ?
        AND YEAR(created_at) = ?
      GROUP BY MONTH(created_at)
      ORDER BY MONTH(created_at)
    `, [studentId, currentYear]);

    const stats = overallStats[0];
    const absentCount = stats.total_sessions - stats.present_count - stats.late_count;

    const dashboardData = {
      overallStats: [
        {
          title: "OVERALL ATTENDANCE",
          value: `${stats.attendance_percentage}%`,
          sub: `Total days: ${stats.present_count} / ${stats.total_sessions}`,
          color: stats.attendance_percentage >= 75 ? "#10B981" : "#F59E0B"
        },
        {
          title: "SKILL ATTENDANCE",
          value: `${stats.attendance_percentage}%`,
          sub: `Skill Attended: ${stats.present_count} / ${stats.total_sessions}`,
          color: "#1e293b"
        }
      ],
      sessionStatus: [
        { label: "Present", count: stats.present_count, theme: "green" },
        { label: "Late", count: stats.late_count, theme: "orange" },
        { label: "Absent", count: absentCount, theme: "red" }
      ],
      subjects: subjectStats,
      skills: recentSkills,
      chartData: monthlyStats
    };

    res.status(200).json({ 
      success: true, 
      data: dashboardData,
      student_id: studentId,
      year: currentYear
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard data',
      error: error.message 
    });
  }
};

// Test endpoint
export const testAttendance = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Attendance controller is working!',
    timestamp: new Date().toISOString(),
    user: req.user
  });
};
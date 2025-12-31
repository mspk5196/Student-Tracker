// import db from '../config/db.js';

// // Get all venue allocations for a faculty
// export const getVenueAllocations = async (req, res) => {
//   try {
//     const { facultyId } = req.params;

//     const [allocations] = await db.query(`
//       SELECT 
//         va. venloc_id,
//         va.faculty_id,
//         va.venue_id,
//         va.valid_till,
//         v.venue_name,
//         f.faculty_id,
//         u.name as faculty_name
//       FROM venue_allocation va
//       INNER JOIN venue v ON va.venue_id = v.venue_id
//       INNER JOIN faculties f ON va.faculty_id = f.faculty_id
//       INNER JOIN users u ON f. user_id = u.user_id
//       WHERE va.faculty_id = ?  AND va.valid_till >= NOW()
//       ORDER BY v.venue_name
//     `, [facultyId]);

//     res.status(200).json({ success: true, data: allocations });
//   } catch (error) {
//     console.error('Error fetching venue allocations:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch venue allocations' });
//   }
// };

// // Get students for a specific venue/class
// export const getStudentsForVenue = async (req, res) => {
//   try {
//     const { venueId, facultyId } = req.params;

//     const [students] = await db.query(`
//       SELECT 
//         s.student_id,
//         u.user_id,
//         u.name,
//         u.ID as studentId,
//         u.email,
//         u.department,
//         s.year,
//         s.semester
//       FROM students s
//       INNER JOIN users u ON s.user_id = u.user_id
//       INNER JOIN mapping_history mh ON s.student_id = mh.student_id
//       WHERE mh.venue_id = ? 
//         AND mh.faculty_id = ? 
//         AND u.is_active = 1
//       GROUP BY s.student_id
//       ORDER BY u.name
//     `, [venueId, facultyId]);

//     const formattedStudents = students.map(student => ({
//       id:  student.studentId,
//       student_id: student.student_id,
//       name: student.name,
//       email: student.email,
//       department: student.department,
//       year: student.year,
//       semester: student.semester,
//       status: '',
//       remarks: '',
//       avatarColor: getRandomColor()
//     }));

//     res.status(200).json({ success: true, data: formattedStudents });
//   } catch (error) {
//     console.error('Error fetching students:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch students' });
//   }
// };

// // Get or create attendance session
// export const getOrCreateSession = async (req, res) => {
//   const connection = await db.getConnection();
  
//   try {
//     const { sessionName, date, timeSlot } = req.body;

//     const fullSessionName = `${sessionName}_${date}_${timeSlot}`;

//     // Check if session already exists
//     const [existingSession] = await connection.query(
//       'SELECT session_id FROM attendance_session WHERE session_name = ?',
//       [fullSessionName]
//     );

//     if (existingSession.length > 0) {
//       return res.status(200).json({ 
//         success: true, 
//         data: { session_id: existingSession[0].session_id, existing:  true }
//       });
//     }

//     // Create new session
//     const [result] = await connection.query(
//       'INSERT INTO attendance_session (session_name) VALUES (?)',
//       [fullSessionName]
//     );

//     res.status(201).json({ 
//       success: true, 
//       data:  { session_id: result.insertId, existing: false }
//     });

//   } catch (error) {
//     console.error('Error with session:', error);
//     res.status(500).json({ success: false, message: 'Failed to process session' });
//   } finally {
//     connection.release();
//   }
// };

// // Save attendance
// export const saveAttendance = async (req, res) => {
//   const connection = await db.getConnection();
  
//   try {
//     const { 
//       facultyId, 
//       venueId, 
//       sessionId, 
//       date, 
//       timeSlot,
//       attendance 
//     } = req.body;

//     // Validation
//     if (!facultyId || !venueId || !sessionId || !attendance || attendance.length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Missing required fields' 
//       });
//     }

//     await connection.beginTransaction();

//     // Check if attendance already exists for this session
//     const [existingAttendance] = await connection.query(
//       'SELECT attendance_id FROM attendance WHERE session_id = ?  LIMIT 1',
//       [sessionId]
//     );

//     if (existingAttendance.length > 0) {
//       // Update existing attendance
//       for (const record of attendance) {
//         const isPresent = record.status === 'present' ?  1 : 0;
//         const isLate = record.status === 'late' ? 1 : 0;
        
//         await connection.query(`
//           UPDATE attendance 
//           SET is_present = ?, remarks = ?, is_late = ? 
//           WHERE student_id = ? AND session_id = ?
//         `, [isPresent, record.remarks || null, isLate, record.student_id, sessionId]);
//       }
//     } else {
//       // Insert new attendance records
//       for (const record of attendance) {
//         const isPresent = record.status === 'present' ? 1 : 0;
//         const isLate = record.status === 'late' ? 1 :  0;
        
//         await connection.query(`
//           INSERT INTO attendance 
//           (student_id, faculty_id, venue_id, session_id, is_present, is_late, remarks, created_at) 
//           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
//         `, [
//           record.student_id, 
//           facultyId, 
//           venueId, 
//           sessionId, 
//           isPresent,
//           isLate,
//           record.remarks || null
//         ]);
//       }
//     }

//     await connection.commit();

//     res.status(201).json({ 
//       success: true, 
//       message: 'Attendance saved successfully' 
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error('Error saving attendance:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to save attendance' 
//     });
//   } finally {
//     connection.release();
//   }
// };

// // Get students who are late 5+ times
// export const getLateStudents = async (req, res) => {
//   try {
//     const { facultyId } = req.params;

//     let query = `
//       SELECT 
//         s.student_id,
//         u.user_id,
//         u.name,
//         u.ID as studentId,
//         u.email,
//         u. department,
//         s.year,
//         s.semester,
//         s.assigned_faculty_id,
//         fu.name as faculty_name,
//         COUNT(CASE WHEN a.is_late = 1 THEN 1 END) as late_count,
//         GROUP_CONCAT(
//           CONCAT(ats.session_name, ' - ', a.created_at)
//           ORDER BY a.created_at DESC
//           SEPARATOR '||'
//         ) as late_sessions
//       FROM students s
//       INNER JOIN users u ON s.user_id = u.user_id
//       LEFT JOIN faculties f ON s.assigned_faculty_id = f.faculty_id
//       LEFT JOIN users fu ON f.user_id = fu.user_id
//       LEFT JOIN attendance a ON s.student_id = a.student_id
//       LEFT JOIN attendance_session ats ON a. session_id = ats.session_id
//       WHERE a.is_late = 1
//     `;

//     const params = [];

//     // If facultyId is provided, filter by that faculty
//     if (facultyId) {
//       query += ` AND s.assigned_faculty_id = ? `;
//       params.push(facultyId);
//     }

//     query += `
//       GROUP BY s.student_id
//       HAVING late_count >= 5
//       ORDER BY late_count DESC, u.name
//     `;

//     const [students] = await db.query(query, params);

//     const formattedStudents = students. map(student => ({
//       student_id: student.student_id,
//       name: student.name,
//       studentId: student.studentId,
//       email: student.email,
//       department: student.department,
//       year: student.year,
//       semester: student.semester,
//       faculty_name: student.faculty_name || 'Not Assigned',
//       late_count:  student.late_count,
//       late_sessions: student.late_sessions ?  student.late_sessions.split('||') : []
//     }));

//     res.status(200).json({ success: true, data: formattedStudents });
//   } catch (error) {
//     console.error('Error fetching late students:', error);
//     res.status(500).json({ success: false, message: 'Failed to fetch late students' });
//   }
// };

// // Get attendance history for a student
// export const getStudentAttendanceHistory = async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const [history] = await db. query(`
//       SELECT 
//         a.attendance_id,
//         a.is_present,
//         a.is_late,
//         a.remarks,
//         a.created_at,
//         ats.session_name,
//         v.venue_name,
//         u.name as faculty_name
//       FROM attendance a
//       INNER JOIN attendance_session ats ON a.session_id = ats.session_id
//       INNER JOIN venue v ON a.venue_id = v.venue_id
//       INNER JOIN faculties f ON a.faculty_id = f.faculty_id
//       INNER JOIN users u ON f. user_id = u.user_id
//       WHERE a.student_id = ? 
//       ORDER BY a.created_at DESC
//       LIMIT 50
//     `, [studentId]);

//     res.status(200).json({ success: true, data:  history });
//   } catch (error) {
//     console.error('Error fetching attendance history:', error);
//     res.status(500).json({ success: false, message:  'Failed to fetch attendance history' });
//   }
// };

// // Helper function for random avatar colors
// function getRandomColor() {
//   const colors = ['#C0C6D8', '#9CA3AF', '#EBE0D9', '#D1D5DB', '#B4B8C5'];
//   return colors[Math. floor(Math.random() * colors.length)];
// }

import db from '../config/db.js';

// Get ALL venues (not just assigned to faculty)
export const getVenueAllocations = async (req, res) => {
  try {
    const { facultyId } = req.params;

    console.log('📍 Fetching all venues for faculty_id:', facultyId);

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

    console.log('✅ Found venues:', allocations.length);

    res.status(200).json({ success: true, data: allocations });
  } catch (error) {
    console.error('❌ Error fetching venues:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch venues' });
  }
};

// Get ALL students for a specific venue
export const getStudentsForVenue = async (req, res) => {
  try {
    const { venueId, facultyId } = req.params;

    console.log('📋 Fetching students for venue:', venueId);

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
      INNER JOIN users u ON s.user_id = u. user_id
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ?  
        AND gs.status = 'Active'
        AND u.is_active = 1
      ORDER BY u.name
    `, [venueId]);

    console.log('✅ Found students:', students.length);

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

    res.status(200).json({ success: true, data: formattedStudents });
  } catch (error) {
    console.error('❌ Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
};

// Get or create attendance session
export const getOrCreateSession = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { sessionName, date, timeSlot } = req.body;

    if (!sessionName || !date || ! timeSlot) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields:  sessionName, date, timeSlot' 
      });
    }

    const fullSessionName = `${sessionName}_${date}_${timeSlot}`;

    console.log('🔍 Checking session:', fullSessionName);

    const [existingSession] = await connection. query(
      'SELECT session_id FROM attendance_session WHERE session_name = ? ',
      [fullSessionName]
    );

    if (existingSession.length > 0) {
      console.log('✅ Session exists:', existingSession[0].session_id);
      return res.status(200).json({ 
        success: true, 
        data: { session_id: existingSession[0].session_id, existing:  true }
      });
    }

    const [result] = await connection.query(
      'INSERT INTO attendance_session (session_name, created_at) VALUES (?, NOW())',
      [fullSessionName]
    );

    console.log('✅ Created new session:', result.insertId);

    res.status(201).json({ 
      success: true, 
      data: { session_id:  result.insertId, existing: false }
    });

  } catch (error) {
    console.error('❌ Error with session:', error);
    res.status(500).json({ success: false, message: 'Failed to process session' });
  } finally {
    connection.release();
  }
};

// Save attendance
export const saveAttendance = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { 
      facultyId, 
      venueId, 
      sessionId, 
      date, 
      timeSlot,
      attendance 
    } = req.body;

    console.log('💾 Saving attendance:', { 
      facultyId, 
      venueId, 
      sessionId, 
      recordCount: attendance?. length 
    });

    if (!facultyId || !venueId || !sessionId || !attendance || attendance.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields:  facultyId, venueId, sessionId, attendance' 
      });
    }

    await connection.beginTransaction();

    const [existingAttendance] = await connection.query(
      'SELECT attendance_id FROM attendance WHERE session_id = ?  LIMIT 1',
      [sessionId]
    );

    if (existingAttendance.length > 0) {
      console.log('📝 Updating existing attendance records');
      for (const record of attendance) {
        const isPresent = record.status === 'present' ?  1 : 0;
        const isLate = record.status === 'late' ? 1 : 0;
        
        await connection.query(`
          UPDATE attendance 
          SET is_present = ?, remarks = ?, is_late = ?, updated_at = NOW()
          WHERE student_id = ? AND session_id = ?
        `, [isPresent, record.remarks || null, isLate, record.student_id, sessionId]);
      }
    } else {
      console.log('➕ Inserting new attendance records');
      for (const record of attendance) {
        const isPresent = record.status === 'present' ? 1 : 0;
        const isLate = record.status === 'late' ? 1 :  0;
        
        await connection.query(`
          INSERT INTO attendance 
          (student_id, faculty_id, venue_id, session_id, is_present, is_late, remarks, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `, [
          record.student_id, 
          facultyId, 
          venueId, 
          sessionId, 
          isPresent,
          isLate,
          record.remarks || null
        ]);
      }
    }

    await connection.commit();

    console.log('✅ Attendance saved successfully');

    res.status(201).json({ 
      success: true, 
      message: 'Attendance saved successfully' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('❌ Error saving attendance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save attendance',
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Get students who are late 5+ times
export const getLateStudents = async (req, res) => {
  try {
    const { facultyId } = req.params;

    console.log('⏰ Fetching late students');

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
      INNER JOIN attendance_session ats ON a.session_id = ats. session_id
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

    console.log('✅ Found late students:', students.length);

    const formattedStudents = students. map(student => ({
      student_id: student.student_id,
      name: student.name,
      roll_number: student.roll_number,
      email: student.email,
      department: student.department,
      late_count: student.late_count,
      late_sessions: student.late_sessions ?  student.late_sessions.split('||') : []
    }));

    res.status(200).json({ success: true, data: formattedStudents });
  } catch (error) {
    console.error('❌ Error fetching late students:', error);
    res.status(500).json({ success: false, message:  'Failed to fetch late students' });
  }
};

// Get attendance history for a student
export const getStudentAttendanceHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    console.log('📊 Fetching attendance history for student:', studentId);

    const [history] = await db.query(`
      SELECT 
        a. attendance_id,
        a. is_present,
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

    console.log('✅ Found history records:', history.length);

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error('❌ Error fetching attendance history:', error);
    res.status(500).json({ success: false, message:  'Failed to fetch attendance history' });
  }
};

// Get attendance dashboard data for a student
export const getStudentAttendanceDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { year } = req.query;

    console.log('📊 Fetching attendance dashboard for student:', studentId, 'year:', year);

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

    console.log('✅ Dashboard data prepared');

    res.status(200).json({ success: true, data:  dashboardData });
  } catch (error) {
    console.error('❌ Error fetching dashboard:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};

// Helper function
function getRandomColor() {
  const colors = ['#C0C6D8', '#9CA3AF', '#EBE0D9', '#D1D5DB', '#B4B8C5'];
  return colors[Math. floor(Math.random() * colors.length)];
}
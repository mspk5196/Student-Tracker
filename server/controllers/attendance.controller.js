import db from '../config/db.js';

// Get all venue allocations for a faculty
export const getVenueAllocations = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const [allocations] = await db.query(`
      SELECT 
        va. venloc_id,
        va.faculty_id,
        va.venue_id,
        va.valid_till,
        v.venue_name,
        f.faculty_id,
        u.name as faculty_name
      FROM venue_allocation va
      INNER JOIN venue v ON va.venue_id = v.venue_id
      INNER JOIN faculties f ON va.faculty_id = f.faculty_id
      INNER JOIN users u ON f. user_id = u.user_id
      WHERE va.faculty_id = ?  AND va.valid_till >= NOW()
      ORDER BY v.venue_name
    `, [facultyId]);

    res.status(200).json({ success: true, data: allocations });
  } catch (error) {
    console.error('Error fetching venue allocations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch venue allocations' });
  }
};

// Get students for a specific venue/class
export const getStudentsForVenue = async (req, res) => {
  try {
    const { venueId, facultyId } = req.params;

    const [students] = await db.query(`
      SELECT 
        s.student_id,
        u.user_id,
        u.name,
        u.ID as studentId,
        u.email,
        u.department,
        s.year,
        s.semester
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      INNER JOIN mapping_history mh ON s.student_id = mh.student_id
      WHERE mh.venue_id = ? 
        AND mh.faculty_id = ? 
        AND u.is_active = 1
      GROUP BY s.student_id
      ORDER BY u.name
    `, [venueId, facultyId]);

    const formattedStudents = students.map(student => ({
      id:  student.studentId,
      student_id: student.student_id,
      name: student.name,
      email: student.email,
      department: student.department,
      year: student.year,
      semester: student.semester,
      status: '',
      remarks: '',
      avatarColor: getRandomColor()
    }));

    res.status(200).json({ success: true, data: formattedStudents });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
};

// Get or create attendance session
export const getOrCreateSession = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { sessionName, date, timeSlot } = req.body;

    const fullSessionName = `${sessionName}_${date}_${timeSlot}`;

    // Check if session already exists
    const [existingSession] = await connection.query(
      'SELECT session_id FROM attendance_session WHERE session_name = ?',
      [fullSessionName]
    );

    if (existingSession.length > 0) {
      return res.status(200).json({ 
        success: true, 
        data: { session_id: existingSession[0].session_id, existing:  true }
      });
    }

    // Create new session
    const [result] = await connection.query(
      'INSERT INTO attendance_session (session_name) VALUES (?)',
      [fullSessionName]
    );

    res.status(201).json({ 
      success: true, 
      data:  { session_id: result.insertId, existing: false }
    });

  } catch (error) {
    console.error('Error with session:', error);
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

    // Validation
    if (!facultyId || !venueId || !sessionId || !attendance || attendance.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    await connection.beginTransaction();

    // Check if attendance already exists for this session
    const [existingAttendance] = await connection.query(
      'SELECT attendance_id FROM attendance WHERE session_id = ?  LIMIT 1',
      [sessionId]
    );

    if (existingAttendance.length > 0) {
      // Update existing attendance
      for (const record of attendance) {
        const isPresent = record.status === 'present' ?  1 : 0;
        const isLate = record.status === 'late' ? 1 : 0;
        
        await connection.query(`
          UPDATE attendance 
          SET is_present = ?, remarks = ?, is_late = ? 
          WHERE student_id = ? AND session_id = ?
        `, [isPresent, record.remarks || null, isLate, record.student_id, sessionId]);
      }
    } else {
      // Insert new attendance records
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

    res.status(201).json({ 
      success: true, 
      message: 'Attendance saved successfully' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error saving attendance:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save attendance' 
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
        u.ID as studentId,
        u.email,
        u. department,
        s.year,
        s.semester,
        s.assigned_faculty_id,
        fu.name as faculty_name,
        COUNT(CASE WHEN a.is_late = 1 THEN 1 END) as late_count,
        GROUP_CONCAT(
          CONCAT(ats.session_name, ' - ', a.created_at)
          ORDER BY a.created_at DESC
          SEPARATOR '||'
        ) as late_sessions
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN faculties f ON s.assigned_faculty_id = f.faculty_id
      LEFT JOIN users fu ON f.user_id = fu.user_id
      LEFT JOIN attendance a ON s.student_id = a.student_id
      LEFT JOIN attendance_session ats ON a. session_id = ats.session_id
      WHERE a.is_late = 1
    `;

    const params = [];

    // If facultyId is provided, filter by that faculty
    if (facultyId) {
      query += ` AND s.assigned_faculty_id = ? `;
      params.push(facultyId);
    }

    query += `
      GROUP BY s.student_id
      HAVING late_count >= 5
      ORDER BY late_count DESC, u.name
    `;

    const [students] = await db.query(query, params);

    const formattedStudents = students. map(student => ({
      student_id: student.student_id,
      name: student.name,
      studentId: student.studentId,
      email: student.email,
      department: student.department,
      year: student.year,
      semester: student.semester,
      faculty_name: student.faculty_name || 'Not Assigned',
      late_count:  student.late_count,
      late_sessions: student.late_sessions ?  student.late_sessions.split('||') : []
    }));

    res.status(200).json({ success: true, data: formattedStudents });
  } catch (error) {
    console.error('Error fetching late students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch late students' });
  }
};

// Get attendance history for a student
export const getStudentAttendanceHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    const [history] = await db. query(`
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
      INNER JOIN users u ON f. user_id = u.user_id
      WHERE a.student_id = ? 
      ORDER BY a.created_at DESC
      LIMIT 50
    `, [studentId]);

    res.status(200).json({ success: true, data:  history });
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ success: false, message:  'Failed to fetch attendance history' });
  }
};

// Helper function for random avatar colors
function getRandomColor() {
  const colors = ['#C0C6D8', '#9CA3AF', '#EBE0D9', '#D1D5DB', '#B4B8C5'];
  return colors[Math. floor(Math.random() * colors.length)];
}
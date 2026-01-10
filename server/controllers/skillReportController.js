import db from '../config/db.js';
import xlsx from 'xlsx';

/**
 * Upload skill reports from Excel - Admin only
 */
export const uploadSkillReport = async (req, res) => {
  // Check admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can upload skill reports' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const connection = await db.getConnection();

  try {
    // Parse Excel
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty' });
    }

    if (data.length > 5000) {
      return res.status(400).json({ message: 'Maximum 5000 records allowed per upload' });
    }

    // Pre-fetch lookups for performance
    const [allStudents] = await connection.execute(
      `SELECT s.student_id, u.ID as roll_number, u.name, u.email, u.user_id
       FROM students s 
       JOIN users u ON s.user_id = u.user_id`
    );

    const [allVenues] = await connection.execute(
      `SELECT venue_id, venue_name FROM venue`
    );

    // Create lookup maps with validation
    const studentMap = new Map();
    allStudents.forEach(s => {
      const key = s.roll_number.toLowerCase().trim();
      if (studentMap.has(key)) {
        console.warn(`Duplicate roll number found: ${s.roll_number} (student_id: ${s.student_id} vs ${studentMap.get(key).student_id})`);
      }
      studentMap.set(key, s);
    });
    
    console.log(`Student map built with ${studentMap.size} entries from ${allStudents.length} records`);

    const venueMap = new Map();
    allVenues.forEach(v => {
      venueMap.set(v.venue_name.toLowerCase().trim(), v.venue_id);
    });

    await connection.beginTransaction();

    const BATCH_SIZE = 100;
    let processedCount = 0;
    let updatedCount = 0;
    let insertedCount = 0;
    const errors = [];

    // Process in batches
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      
      for (let j = 0; j < batch.length; j++) {
        const row = batch[j];
        const rowIndex = i + j + 2;

        try {
          const result = await processRow(connection, row, rowIndex, studentMap, venueMap);
          if (result.success) {
            processedCount++;
            if (result.isUpdate) updatedCount++;
            else insertedCount++;
          } else {
            errors.push({ row: rowIndex, message: result.error });
          }
        } catch (error) {
          errors.push({ row: rowIndex, message: error.message });
        }
      }
    }

    await connection.commit();

    // Log first few Excel column names for debugging
    const firstRow = data[0];
    const columnNames = firstRow ? Object.keys(firstRow) : [];
    console.log('Excel columns detected:', columnNames);

    res.status(200).json({
      message: 'Skill reports uploaded successfully',
      summary: {
        totalRecords: data.length,
        processed: processedCount,
        inserted: insertedCount,
        updated: updatedCount,
        errors: errors.length,
        errorDetails: errors.slice(0, 50),
        columnsDetected: columnNames
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to process upload', error: error.message });
  } finally {
    connection.release();
  }
};

/**
 * Get roll number from row - handles various column name formats
 */
function getRollNumberFromRow(row) {
  // Try various possible column names (case-insensitive check)
  const possibleKeys = Object.keys(row);
  
  // Priority order: roll_number variants, then ID variants
  const rollNumberPatterns = [
    /^roll_?number$/i,
    /^roll_?no$/i,
    /^rollno$/i,
    /^student_?id$/i,
    /^reg_?no$/i,
    /^registration_?number$/i,
    /^id$/i,
    /^user_?id$/i
  ];
  
  for (const pattern of rollNumberPatterns) {
    const matchedKey = possibleKeys.find(key => pattern.test(key.trim()));
    if (matchedKey && row[matchedKey]) {
      return row[matchedKey].toString().trim();
    }
  }
  
  // Direct property access as fallback
  return (row.roll_number || row.Roll_Number || row['Roll Number'] || row.rollNumber || 
          row.rollno || row.RollNo || row['Roll No'] || 
          row.user_id || row.ID || row.id || '').toString().trim();
}

/**
 * Process single row from Excel
 * Expected columns: roll_number, name, email, course_name, venue, attendance, score, status, slot_date, start_time, end_time
 */
async function processRow(connection, row, rowIndex, studentMap, venueMap) {
  // Extract fields - use flexible roll number extraction
  const rollNumber = getRollNumberFromRow(row);
  const courseName = (row.course_name || '').toString().trim();
  const excelVenueName = (row.venue || '').toString().trim();
  const score = parseFloat(row.score) || 0;
  const status = validateStatus(row.status);
  const attendance = validateAttendance(row.attendance);
  const slotDate = parseExcelDate(row.slot_date);
  const startTime = parseExcelTime(row.start_time);
  const endTime = parseExcelTime(row.end_time);

  // Validate required fields
  if (!rollNumber || !courseName || !excelVenueName) {
    return { 
      success: false, 
      error: `Missing required fields - roll_number: ${rollNumber}, course_name: ${courseName}, venue: ${excelVenueName}` 
    };
  }

  // Find student - first try from pre-fetched map
  let student = studentMap.get(rollNumber.toLowerCase().trim());
  
  // If not found in map, try direct database lookup as fallback
  // This handles edge cases like special characters, encoding issues, etc.
  if (!student) {
    try {
      const [dbStudent] = await connection.execute(
        `SELECT s.student_id, u.ID as roll_number, u.name, u.email 
         FROM students s 
         JOIN users u ON s.user_id = u.user_id
         WHERE LOWER(TRIM(u.ID)) = LOWER(TRIM(?))`,
        [rollNumber]
      );
      
      if (dbStudent.length > 0) {
        student = dbStudent[0];
        console.log(`Row ${rowIndex}: Found student via DB lookup - Roll: ${rollNumber} -> student_id: ${student.student_id}`);
      }
    } catch (lookupError) {
      console.error(`Row ${rowIndex}: DB lookup failed for ${rollNumber}:`, lookupError.message);
    }
  }
  
  if (!student) {
    return { success: false, error: `Student not found: ${rollNumber}. Please verify the roll number exists in the system.` };
  }
  
  // Debug log to trace mapping issues
  console.log(`Row ${rowIndex}: Processing - Excel Roll: ${rollNumber} -> DB student_id: ${student.student_id}, DB roll: ${student.roll_number}`);

  // Get student's current venue allocation and faculty through their group
  const [studentVenue] = await connection.execute(
    `SELECT g.venue_id, g.faculty_id 
     FROM group_students gs
     JOIN \`groups\` g ON gs.group_id = g.group_id
     WHERE gs.student_id = ? AND gs.status = 'Active'
     LIMIT 1`,
    [student.student_id]
  );

  const studentVenueId = studentVenue.length > 0 ? studentVenue[0].venue_id : null;
  const facultyId = studentVenue.length > 0 ? studentVenue[0].faculty_id : null;

  // Check if record exists (student + course_name + excel venue name)
  const [existing] = await connection.execute(
    `SELECT id, total_attempts, best_score, status FROM student_skills 
     WHERE student_id = ? AND course_name = ? AND excel_venue_name = ?`,
    [student.student_id, courseName, excelVenueName]
  );

  if (existing.length > 0) {
    // UPDATE existing record
    const currentBest = parseFloat(existing[0].best_score) || 0;
    const newBestScore = Math.max(currentBest, score);
    const newAttempts = (existing[0].total_attempts || 0) + 1;
    
    // Status update logic: Update to new status from Excel
    // If previously Cleared and new status is Not Cleared, keep as Cleared
    let finalStatus = status;
    if (existing[0].status === 'Cleared' && status === 'Not Cleared') {
      finalStatus = 'Cleared'; // Once cleared, always cleared
    }

    await connection.execute(
      `UPDATE student_skills SET
        total_attempts = ?,
        best_score = ?,
        latest_score = ?,
        status = ?,
        student_venue_id = ?,
        faculty_id = ?,
        last_attendance = ?,
        last_slot_date = ?,
        last_start_time = ?,
        last_end_time = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [newAttempts, newBestScore, score, finalStatus, studentVenueId, facultyId, attendance, slotDate, startTime, endTime, existing[0].id]
    );

    return { success: true, isUpdate: true };

  } else {
    // INSERT new record - each course_name is a separate row for the student
    await connection.execute(
      `INSERT INTO student_skills 
        (student_id, skill_id, course_name, excel_venue_name, student_venue_id, faculty_id,
         total_attempts, best_score, latest_score, status, last_attendance, 
         last_slot_date, last_start_time, last_end_time, created_at, updated_at)
       VALUES (?, NULL, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [student.student_id, courseName, excelVenueName, studentVenueId, facultyId, 
       score, score, status, attendance, slotDate, startTime, endTime]
    );

    return { success: true, isUpdate: false };
  }
}

/**
 * Validate status
 */
function validateStatus(status) {
  const normalized = (status || '').toString().trim().toLowerCase();
  if (normalized === 'cleared') return 'Cleared';
  if (normalized === 'not cleared') return 'Not Cleared';
  return 'Ongoing';
}

/**
 * Validate attendance
 */
function validateAttendance(attendance) {
  const normalized = (attendance || '').toString().trim().toLowerCase();
  if (normalized === 'present') return 'Present';
  if (normalized === 'absent') return 'Absent';
  return null;
}

/**
 * Parse Excel date
 */
function parseExcelDate(dateValue) {
  if (!dateValue) return null;
  
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  
  if (typeof dateValue === 'number') {
    const date = new Date((dateValue - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  
  const parsed = new Date(dateValue);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  
  return null;
}

/**
 * Parse Excel time
 */
function parseExcelTime(timeValue) {
  if (!timeValue) return null;
  
  if (typeof timeValue === 'string') {
    // Handle "HH:MM:SS" or "HH:MM"
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeValue)) {
      return timeValue.length === 5 ? `${timeValue}:00` : timeValue;
    }
    // Handle "09:00 AM" format
    const match = timeValue.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2];
      const period = match[3];
      
      if (period) {
        if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
        if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
      }
      
      return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    }
  }
  
  if (typeof timeValue === 'number' && timeValue < 1) {
    const totalMinutes = Math.round(timeValue * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }
  
  return null;
}

/**
 * Get venues assigned to faculty
 */
export const getFacultyVenues = async (req, res) => {
  try {
    // Admin can see all venues
    if (req.user.role === 'admin') {
      const [venues] = await db.execute(
        `SELECT DISTINCT v.venue_id, v.venue_name, v.location, v.capacity
         FROM venue v
         ORDER BY v.venue_name`
      );
      return res.status(200).json({ venues });
    }

    // Get faculty_id from user
    const [faculty] = await db.execute(
      `SELECT faculty_id FROM faculties WHERE user_id = ?`,
      [req.user.user_id]
    );

    if (faculty.length === 0) {
      return res.status(403).json({ message: 'Faculty record not found' });
    }

    const facultyId = faculty[0].faculty_id;

    const [venues] = await db.execute(
      `SELECT DISTINCT v.venue_id, v.venue_name, v.location, v.capacity
       FROM venue v
       LEFT JOIN venue_allocation va ON v.venue_id = va.venue_id
       WHERE v.assigned_faculty_id = ? OR va.faculty_id = ? 
       ORDER BY v.venue_name`,
      [facultyId, facultyId]
    );

    res.status(200).json({ venues });

  } catch (error) {
    console.error('Error fetching faculty venues:', error);
    res.status(500).json({ message: 'Failed to fetch venues', error: error.message });
  }
};

/**
 * Get skill reports for faculty's venue
 */
export const getSkillReportsForFaculty = async (req, res) => {
  try {
    const { venueId, page = 1, limit = 50, status, date, search, sortBy = 'updated_at', sortOrder = 'DESC' } = req.body;
    
    console.log('Date filter received:', date); // Debug log
    
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get faculty_id for access control
    let facultyId = null;
    let facultyVenueIds = [];
    
    if (req.user.role !== 'admin') {
      // Get faculty_id
      const [faculty] = await db.execute(
        `SELECT faculty_id FROM faculties WHERE user_id = ?`,
        [req.user.user_id]
      );

      if (faculty.length === 0) {
        return res.status(403).json({ message: 'Faculty record not found' });
      }

      const facultyId = faculty[0].faculty_id;

      // Verify faculty has access to THIS specific venue
      const [venueAccess] = await db.execute(
        `SELECT v.venue_id, v.venue_name FROM venue v 
         LEFT JOIN venue_allocation va ON v.venue_id = va.venue_id
         WHERE v.venue_id = ? AND (v.assigned_faculty_id = ? OR va.faculty_id = ?)`,
        [parseInt(venueId), facultyId, facultyId]
      );

      if (venueId && venueAccess.length === 0) {
        return res.status(403).json({ message: 'You do not have access to this venue' });
      }
      
      // Get all accessible venues for this faculty
      const [accessibleVenues] = await db.execute(
        `SELECT DISTINCT v.venue_id FROM venue v 
         LEFT JOIN venue_allocation va ON v.venue_id = va.venue_id
         WHERE v.assigned_faculty_id = ? OR va.faculty_id = ?`,
        [facultyId, facultyId]
      );
      facultyVenueIds = accessibleVenues.map(v => v.venue_id);
    }

    // Build query - Show students whose current venue matches the selected venue
    let query = `
      SELECT 
        ss.id,
        u.ID as roll_number,
        u.name as student_name,
        u.email,
        u.department,
        ss.course_name,
        ss.excel_venue_name,
        sv.venue_name as student_current_venue,
        ss.total_attempts,
        ss.best_score,
        ss.latest_score,
        ss.status,
        ss.last_attendance,
        ss.last_slot_date,
        ss.last_start_time,
        ss.last_end_time,
        ss.updated_at
      FROM student_skills ss
      JOIN students s ON ss.student_id = s.student_id
      JOIN users u ON s.user_id = u.user_id
      LEFT JOIN venue sv ON ss.student_venue_id = sv.venue_id
      WHERE 1=1`;

    const params = [];
    
    // If specific venue selected, filter by it
    if (venueId) {
      query += ' AND ss.student_venue_id = ?';
      params.push(parseInt(venueId));
    } else if (facultyVenueIds.length > 0) {
      // For faculty viewing all venues, only show their accessible venues
      query += ` AND ss.student_venue_id IN (${facultyVenueIds.join(',')})`;
    }

    if (status && ['Cleared', 'Not Cleared', 'Ongoing'].includes(status)) {
      query += ' AND ss.status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND DATE(ss.last_slot_date) = ?';
      params.push(date);
    }

    // Add search filter for name or roll number
    if (search && search.trim().length > 0) {
      query += ' AND (u.name LIKE ? OR u.ID LIKE ? OR ss.course_name LIKE ?)';
      const searchPattern = `%${search.trim()}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Sort
    const allowedSortColumns = ['updated_at', 'best_score', 'total_attempts', 'status'];
    const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'updated_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    // Use direct string concatenation for ORDER BY column and LIMIT/OFFSET values
    query += ` ORDER BY ss.${sortColumn} ${order} LIMIT ${limitNum} OFFSET ${offsetNum}`;

    // Execute query with proper error handling
    let reports = [];
    try {
      [reports] = await db.execute(query, params);
    } catch (queryError) {
      console.error('Query execution error:', queryError);
      console.error('Query:', query);
      console.error('Params:', params);
      return res.status(500).json({ 
        message: 'Failed to fetch skill reports',
        error: queryError.message 
      });
    }

    // Get total count
    let countQuery = `SELECT COUNT(*) as total 
      FROM student_skills ss
      JOIN students s ON ss.student_id = s.student_id
      JOIN users u ON s.user_id = u.user_id
      WHERE 1=1`;
    const countParams = [];
    
    if (venueId) {
      countQuery += ' AND ss.student_venue_id = ?';
      countParams.push(parseInt(venueId));
    } else if (facultyVenueIds.length > 0) {
      countQuery += ` AND ss.student_venue_id IN (${facultyVenueIds.join(',')})`;
    }

    if (status && ['Cleared', 'Not Cleared', 'Ongoing'].includes(status)) {
      countQuery += ' AND ss.status = ?';
      countParams.push(status);
    }

    if (date) {
      countQuery += ' AND DATE(ss.last_slot_date) = ?';
      countParams.push(date);
    }

    if (search && search.trim().length > 0) {
      countQuery += ' AND (u.name LIKE ? OR u.ID LIKE ? OR ss.course_name LIKE ?)';
      const searchPattern = `%${search.trim()}%`;
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Get statistics
    let statsQuery = `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN ss.status = 'Cleared' THEN 1 ELSE 0 END) as cleared,
        SUM(CASE WHEN ss.status = 'Not Cleared' THEN 1 ELSE 0 END) as not_cleared,
        SUM(CASE WHEN ss.status = 'Ongoing' THEN 1 ELSE 0 END) as ongoing,
        ROUND(AVG(ss.best_score), 2) as avg_best_score
      FROM student_skills ss
      JOIN students s ON ss.student_id = s.student_id
      JOIN users u ON s.user_id = u.user_id
      WHERE 1=1`;
    const statsParams = [];
    
    if (venueId) {
      statsQuery += ' AND ss.student_venue_id = ?';
      statsParams.push(parseInt(venueId));
    } else if (facultyVenueIds.length > 0) {
      statsQuery += ` AND ss.student_venue_id IN (${facultyVenueIds.join(',')})`;
    }

    if (status && ['Cleared', 'Not Cleared', 'Ongoing'].includes(status)) {
      statsQuery += ' AND ss.status = ?';
      statsParams.push(status);
    }

    if (date) {
      statsQuery += ' AND DATE(ss.last_slot_date) = ?';
      statsParams.push(date);
    }

    if (search && search.trim().length > 0) {
      statsQuery += ' AND (u.name LIKE ? OR u.ID LIKE ? OR ss.course_name LIKE ?)';
      const searchPattern = `%${search.trim()}%`;
      statsParams.push(searchPattern, searchPattern, searchPattern);
    }

    const [stats] = await db.execute(statsQuery, statsParams);

    // Return response even if no data
    res.status(200).json({
      venue: venueId ? { venue_id: venueId, venue_name: 'Selected Venue' } : { venue_name: 'All Venues' },
      reports: reports || [],
      statistics: stats[0] || {
        total: 0,
        cleared: 0,
        not_cleared: 0,
        ongoing: 0,
        avg_best_score: 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total || 0,
        totalPages: Math.ceil((total || 0) / parseInt(limit))
      },
      message: reports.length === 0 ? 'No skill reports found for this venue' : undefined
    });

  } catch (error) {
    console.error('Error in getSkillReportsForFaculty:', error);
    res.status(500).json({ 
      message: 'Failed to fetch skill reports',
      error: error.message 
    });
  }
};

/**
 * Search students by name - Faculty
 */
export const searchStudentSkillReports = async (req, res) => {
  try {
    const { query: searchQuery } = req.body;

    if (!searchQuery || searchQuery.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    let venueIds = [];
    let placeholders = '';
    
    // Admin can search all venues
    if (req.user.role === 'admin') {
      const [allVenues] = await db.execute(`SELECT venue_id FROM venue`);
      if (allVenues.length === 0) {
        return res.status(200).json({ reports: [] });
      }
      venueIds = allVenues.map(v => v.venue_id);
    } else {
      // Get faculty_id
      const [faculty] = await db.execute(
        `SELECT faculty_id FROM faculties WHERE user_id = ?`,
        [req.user.user_id]
      );

      if (faculty.length === 0) {
        return res.status(403).json({ message: 'Faculty record not found' });
      }

      const facultyId = faculty[0].faculty_id;

      // Get faculty's assigned venues
      const [assignedVenues] = await db.execute(
        `SELECT v.venue_id FROM venue v 
         LEFT JOIN venue_allocation va ON v.venue_id = va.venue_id
         WHERE v.assigned_faculty_id = ? OR va.faculty_id = ?`,
        [facultyId, facultyId]
      );

      if (assignedVenues.length === 0) {
        return res.status(200).json({ reports: [] });
      }

      venueIds = assignedVenues.map(v => v.venue_id);
    }

    placeholders = venueIds.map(() => '?').join(',');

    const sqlQuery = `
      SELECT 
        ss.id,
        u.ID as roll_number,
        u.name as student_name,
        u.email,
        u.department,
        ss.course_name,
        v.venue_name,
        ss.total_attempts,
        ss.best_score,
        ss.latest_score,
        ss.status,
        ss.last_slot_date,
        ss.updated_at
      FROM student_skills ss
      JOIN students s ON ss.student_id = s.student_id
      JOIN users u ON s.user_id = u.user_id
      JOIN venue v ON ss.venue_id = v.venue_id
      WHERE ss.venue_id IN (${placeholders})
        AND (u.name LIKE ? OR u.ID LIKE ? OR ss.course_name LIKE ?)
      ORDER BY u.name ASC
      LIMIT 100
    `;

    const searchPattern = `%${searchQuery}%`;
    const params = [...venueIds, searchPattern, searchPattern, searchPattern];

    const [reports] = await db.execute(sqlQuery, params);

    res.status(200).json({ reports });

  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

/**
 * Get skill reports for logged-in student
 */
export const getSkillReportsForStudent = async (req, res) => {
  try {
    // Get student_id
    const [student] = await db.execute(
      `SELECT student_id FROM students WHERE user_id = ?`,
      [req.user.user_id]
    );

    if (student.length === 0) {
      return res.status(403).json({ message: 'Student record not found' });
    }

    const studentId = student[0].student_id;

    const [reports] = await db.execute(
      `SELECT 
        ss.id,
        ss.course_name,
        v.venue_name,
        ss.total_attempts,
        ss.best_score,
        ss.latest_score,
        ss.status,
        ss.last_attendance,
        ss.last_slot_date,
        ss.last_start_time,
        ss.last_end_time,
        ss.created_at,
        ss.updated_at
      FROM student_skills ss
      LEFT JOIN venue v ON ss.venue_id = v.venue_id
      WHERE ss.student_id = ? 
      ORDER BY ss.updated_at DESC`,
      [studentId]
    );

    // Calculate summary
    const summary = {
      totalCourses: reports.length,
      cleared: reports.filter(r => r.status === 'Cleared').length,
      notCleared: reports.filter(r => r.status === 'Not Cleared').length,
      ongoing: reports.filter(r => r.status === 'Ongoing').length,
      totalAttempts: reports.reduce((sum, r) => sum + (r.total_attempts || 0), 0),
      averageBestScore: reports.length > 0
        ? (reports.reduce((sum, r) => sum + (parseFloat(r.best_score) || 0), 0) / reports.length).toFixed(2)
        : 0
    };

    res.status(200).json({ reports, summary });

  } catch (error) {
    console.error('Error fetching student reports:', error);
    res.status(500).json({ message: 'Failed to fetch skill reports', error: error.message });
  }
};
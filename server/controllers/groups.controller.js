import db from '../config/db.js';
import xlsx from 'xlsx';

// ===== VENUE MANAGEMENT =====

// Get all venues
export const getAllVenues = async (req, res) => {
  try {
    const [venues] = await db.query(`
      SELECT 
        v.venue_id,
        v.venue_name,
        v.capacity,
        v.location,
        v.status,
        v.created_at,
        f.faculty_id,
        u.name as faculty_name,
        u.email as faculty_email,
        u.department as faculty_department,
        COUNT(DISTINCT gs.student_id) as current_students
      FROM venue v
      LEFT JOIN faculties f ON v.assigned_faculty_id = f.faculty_id
      LEFT JOIN users u ON f.user_id = u.user_id
      LEFT JOIN \`groups\` g ON v.venue_id = g.venue_id
      LEFT JOIN group_students gs ON g.group_id = gs.group_id AND gs.status = 'Active'
      GROUP BY v.venue_id
      ORDER BY v.venue_name
    `);

    res.status(200).json({ success: true, data: venues });
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch venues' });
  }
};

// Create new venue
export const createVenue = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { venue_name, capacity, location, assigned_faculty_id } = req.body;

    if (!venue_name || !capacity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Venue name and capacity are required' 
      });
    }

    // Check if venue name already exists
    const [existing] = await connection.query(
      'SELECT venue_id FROM venue WHERE venue_name = ?',
      [venue_name]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Venue name already exists.  Please choose a different name.' 
      });
    }

    // Check if faculty is already assigned to another venue
    if (assigned_faculty_id) {
      const [facultyCheck] = await connection.query(
        `SELECT v.venue_name, u.name as faculty_name
         FROM venue v 
         INNER JOIN faculties f ON v. assigned_faculty_id = f. faculty_id
         INNER JOIN users u ON f.user_id = u.user_id
         WHERE v.assigned_faculty_id = ? AND v.status = 'Active'`,
        [assigned_faculty_id]
      );

      if (facultyCheck.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: `${facultyCheck[0].faculty_name} is already assigned to "${facultyCheck[0].venue_name}".  Please choose a different faculty.` 
        });
      }
    }

    await connection.beginTransaction();

    const [result] = await connection.query(`
      INSERT INTO venue (venue_name, capacity, location, assigned_faculty_id, status, created_at) 
      VALUES (?, ?, ?, ?, 'Active', NOW())
    `, [venue_name, capacity, location || '', assigned_faculty_id || null]);

    await connection.commit();

    res.status(201).json({ 
      success: true, 
      message: 'Venue created successfully! ',
      data: { venue_id: result.insertId }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating venue:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create venue.  Please try again.' 
    });
  } finally {
    connection.release();
  }
};

// Update venue
export const updateVenue = async (req, res) => {
  const connection = await db. getConnection();
  
  try {
    const { venueId } = req.params;
    const { venue_name, capacity, location, assigned_faculty_id, status } = req.body;

    // Check if venue name already exists (excluding current venue)
    const [existing] = await connection.query(
      'SELECT venue_id FROM venue WHERE venue_name = ? AND venue_id != ?',
      [venue_name, venueId]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message:  'Venue name already exists.  Please choose a different name.' 
      });
    }

    await connection.beginTransaction();

    await connection.query(`
      UPDATE venue 
      SET venue_name = ?, capacity = ?, location = ?, assigned_faculty_id = ?, status = ?  
      WHERE venue_id = ?
    `, [venue_name, capacity, location, assigned_faculty_id, status, venueId]);

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: 'Venue updated successfully!' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating venue:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update venue. Please try again.' 
    });
  } finally {
    connection.release();
  }
};

// Delete venue
export const deleteVenue = async (req, res) => {
  const connection = await db. getConnection();
  
  try {
    const { venueId } = req.params;

    // Check if venue has students
    const [students] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ? AND gs.status = 'Active'
    `, [venueId]);

    if (students[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete venue with ${students[0].count} active students.  Please remove students first.` 
      });
    }

    await connection.beginTransaction();

    // Delete related groups first
    await connection.query('DELETE FROM \`groups\` WHERE venue_id = ?', [venueId]);

    // Delete venue
    await connection.query('DELETE FROM venue WHERE venue_id = ?', [venueId]);

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: 'Venue deleted successfully!' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error deleting venue:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete venue. Please try again.' 
    });
  } finally {
    connection.release();
  }
};

// Assign/Change faculty for venue
export const assignFacultyToVenue = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { venueId } = req.params;
    const { faculty_id } = req. body;

    if (!faculty_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faculty ID is required' 
      });
    }

    // Get current venue info
    const [currentVenue] = await connection.query(
      'SELECT venue_name FROM venue WHERE venue_id = ? ',
      [venueId]
    );

    if (currentVenue.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Venue not found' 
      });
    }

    // Check if faculty is already assigned to another venue
    const [facultyCheck] = await connection.query(
      `SELECT v.venue_id, v.venue_name, u.name as faculty_name
       FROM venue v 
       INNER JOIN faculties f ON v.assigned_faculty_id = f.faculty_id
       INNER JOIN users u ON f. user_id = u.user_id
       WHERE v.assigned_faculty_id = ? AND v.venue_id != ?  AND v.status = 'Active'`,
      [faculty_id, venueId]
    );

    if (facultyCheck. length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `${facultyCheck[0].faculty_name} is already assigned to "${facultyCheck[0].venue_name}". A faculty can only be assigned to one venue at a time.` 
      });
    }

    await connection. beginTransaction();

    await connection.query(
      'UPDATE venue SET assigned_faculty_id = ? WHERE venue_id = ? ',
      [faculty_id, venueId]
    );

    await connection.commit();

    // Get faculty name for success message
    const [facultyInfo] = await connection.query(
      `SELECT u.name as faculty_name FROM faculties f
       INNER JOIN users u ON f.user_id = u.user_id
       WHERE f.faculty_id = ? `,
      [faculty_id]
    );

    res.status(200).json({ 
      success: true, 
      message: `${facultyInfo[0].faculty_name} has been assigned to ${currentVenue[0].venue_name} successfully!` 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error assigning faculty:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to assign faculty. Please try again.' 
    });
  } finally {
    connection.release();
  }
};

// Get all available faculties for venue assignment
export const getAvailableFaculties = async (req, res) => {
  try {
    const { venueId, search } = req.query;

    let query = `
      SELECT 
        f.faculty_id,
        u.name as faculty_name,
        u.email,
        u.department,
        f.designation,
        v.venue_id as assigned_venue_id,
        v.venue_name as assigned_venue_name,
        CASE 
          WHEN v.venue_id = ? THEN 1 
          WHEN v.venue_id IS NULL THEN 0
          ELSE -1
        END as assignment_status
      FROM faculties f
      INNER JOIN users u ON f.user_id = u. user_id
      LEFT JOIN venue v ON f.faculty_id = v.assigned_faculty_id AND v.status = 'Active'
      WHERE u.is_active = 1
    `;

    const params = [venueId || 0];

    // Add search filter
    if (search) {
      query += ` AND (u.name LIKE ? OR u.department LIKE ?  OR u.email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY assignment_status DESC, u.name ASC`;

    const [faculties] = await db. query(query, params);

    // Separate faculties
    let currentlyAssigned = null;
    let availableFaculties = [];

    faculties.forEach(faculty => {
      if (faculty. assignment_status === 1) {
        // Currently assigned to this venue
        currentlyAssigned = {
          ... faculty,
          workload: 1,
          workload_status: 'Current'
        };
      } else if (faculty.assignment_status === 0) {
        // Not assigned to any venue
        availableFaculties.push({
          ...faculty,
          workload: 0,
          workload_status: 'Available',
          venue_names: null
        });
      }
      // assignment_status === -1 means assigned to another venue, exclude from list
    });

    res.status(200).json({ 
      success: true, 
      data: {
        available:  availableFaculties,
        current: currentlyAssigned,
        total: availableFaculties.length + (currentlyAssigned ? 1 : 0)
      }
    });

  } catch (error) {
    console.error('Error fetching available faculties:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch available faculties' });
  }
};

// ===== STUDENT ALLOCATION =====

// Bulk upload students to venue via Excel
export const bulkUploadStudentsToVenue = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { venueId } = req. params;

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded.  Please select an Excel file.' 
      });
    }

    // Get venue details and check capacity
    const [venues] = await connection.query(
      'SELECT * FROM venue WHERE venue_id = ? ',
      [venueId]
    );

    if (venues.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Venue not found' 
      });
    }

    const venue = venues[0];

    // Get current student count
    const [currentCount] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ? AND gs.status = 'Active'
    `, [venueId]);

    const availableSlots = venue.capacity - currentCount[0].count;

    // Parse Excel file
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message:  'Excel file is empty.  Please add student data and try again.' 
      });
    }

    if (data.length > availableSlots) {
      return res.status(400).json({ 
        success: false, 
        message: `Venue capacity exceeded. Available slots: ${availableSlots}, Students in file: ${data.length}` 
      });
    }

    await connection.beginTransaction();

    // Get or create default group for venue
    let [groups] = await connection.query(
      'SELECT group_id FROM \`groups\` WHERE venue_id = ?  LIMIT 1',
      [venueId]
    );

    let groupId;
    if (groups.length === 0) {
      const [groupResult] = await connection.query(`
        INSERT INTO \`groups\` 
        (group_code, group_name, venue_id, faculty_id, schedule_days, schedule_time, max_students, department, status, created_at) 
        VALUES (?, ?, ?, ?, 'Mon, Wed', '10:00 - 12:00', ?, 'General', 'Active', NOW())
      `, [`VENUE-${venueId}`, venue.venue_name, venueId, venue.assigned_faculty_id, venue.capacity]);
      
      groupId = groupResult.insertId;
    } else {
      groupId = groups[0]. group_id;
    }

    let studentsAdded = 0;
    let studentsSkipped = 0;
    const errors = [];

    for (const row of data) {
      const { name, email, rollNumber, department, year, semester } = row;

      if (!name || !email || !rollNumber) {
        errors.push(`Row skipped: Missing required fields (name, email, or rollNumber)`);
        studentsSkipped++;
        continue;
      }

      try {
        // Check if student exists
        const [existingUser] = await connection.query(
          'SELECT user_id FROM users WHERE email = ?  OR ID = ?',
          [email, rollNumber]
        );

        let userId;
        let studentId;

        if (existingUser.length === 0) {
          // Insert new student
          const [userResult] = await connection.query(
            `INSERT INTO users (role_id, name, email, ID, department, created_at, is_active) 
             VALUES (3, ?, ?, ?, ?, NOW(), 1)`,
            [name, email, rollNumber, department || 'General']
          );

          userId = userResult.insertId;

          const [studentResult] = await connection. query(
            'INSERT INTO students (user_id, year, semester, assigned_faculty_id) VALUES (?, ?, ?, ? )',
            [userId, year || 1, semester || 1, venue. assigned_faculty_id || 0]
          );

          studentId = studentResult.insertId;
        } else {
          userId = existingUser[0].user_id;

          const [student] = await connection.query(
            'SELECT student_id FROM students WHERE user_id = ? ',
            [userId]
          );

          if (student.length === 0) {
            const [studentResult] = await connection. query(
              'INSERT INTO students (user_id, year, semester, assigned_faculty_id) VALUES (?, ?, ?, ?)',
              [userId, year || 1, semester || 1, venue.assigned_faculty_id || 0]
            );
            studentId = studentResult.insertId;
          } else {
            studentId = student[0].student_id;
          }
        }

        // Check if already allocated
        const [existing] = await connection.query(
          'SELECT id FROM group_students WHERE student_id = ? AND group_id = ?  AND status = "Active"',
          [studentId, groupId]
        );

        if (existing.length === 0) {
          await connection.query(
            'INSERT INTO group_students (group_id, student_id, allocation_date, status) VALUES (?, ?, NOW(), "Active")',
            [groupId, studentId]
          );
          studentsAdded++;
        } else {
          studentsSkipped++;
          errors.push(`${name} (${rollNumber}) already allocated to this venue`);
        }

      } catch (err) {
        studentsSkipped++;
        errors. push(`Error processing ${name} (${rollNumber}): ${err.message}`);
      }
    }

    await connection.commit();

    res.status(201).json({ 
      success: true, 
      message: `Successfully uploaded! Added:  ${studentsAdded} students, Skipped: ${studentsSkipped}`,
      data: {
        studentsAdded,
        studentsSkipped,
        errors:  errors.slice(0, 10)
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error bulk uploading students:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload students. Please check the file format and try again.',
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Allocate students by roll number range
export const allocateStudentsByRollRange = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { venueId } = req.params;
    const { rollNumberFrom, rollNumberTo } = req. body;

    if (!rollNumberFrom || !rollNumberTo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both roll numbers are required' 
      });
    }

    // Get venue details
    const [venues] = await connection.query(
      'SELECT * FROM venue WHERE venue_id = ?',
      [venueId]
    );

    if (venues.length === 0) {
      return res. status(404).json({ 
        success: false, 
        message: 'Venue not found' 
      });
    }

    const venue = venues[0];

    // Get current student count
    const [currentCount] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      WHERE g.venue_id = ? AND gs.status = 'Active'
    `, [venueId]);

    const availableSlots = venue.capacity - currentCount[0].count;

    // Find students in roll number range
    const [students] = await connection.query(`
      SELECT s.student_id, u.name, u.ID as rollNumber
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      WHERE u.ID BETWEEN ? AND ?
        AND u.role_id = 3
        AND u.is_active = 1
        AND NOT EXISTS (
          SELECT 1 FROM group_students gs
          INNER JOIN \`groups\` g ON gs.group_id = g.group_id
          WHERE gs.student_id = s.student_id 
            AND g.venue_id = ? 
            AND gs. status = 'Active'
        )
      ORDER BY u.ID
    `, [rollNumberFrom, rollNumberTo, venueId]);

    if (students.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: `No unallocated students found in the range ${rollNumberFrom} to ${rollNumberTo}` 
      });
    }

    if (students.length > availableSlots) {
      return res. status(400).json({ 
        success: false, 
        message: `Venue capacity exceeded. Available:  ${availableSlots}, Found: ${students.length} students` 
      });
    }

    await connection.beginTransaction();

    // Get or create default group for venue
    let [groups] = await connection. query(
      'SELECT group_id FROM \`groups\` WHERE venue_id = ? LIMIT 1',
      [venueId]
    );

    let groupId;
    if (groups. length === 0) {
      const [groupResult] = await connection.query(`
        INSERT INTO \`groups\` 
        (group_code, group_name, venue_id, faculty_id, schedule_days, schedule_time, max_students, department, status, created_at) 
        VALUES (?, ?, ?, ?, 'Mon, Wed', '10:00 - 12:00', ?, 'General', 'Active', NOW())
      `, [`VENUE-${venueId}`, venue.venue_name, venueId, venue.assigned_faculty_id, venue.capacity]);
      
      groupId = groupResult.insertId;
    } else {
      groupId = groups[0].group_id;
    }

    // Allocate students
    for (const student of students) {
      await connection.query(
        'INSERT INTO group_students (group_id, student_id, allocation_date, status) VALUES (?, ?, NOW(), "Active")',
        [groupId, student. student_id]
      );
    }

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: `Successfully allocated ${students.length} students (${rollNumberFrom} to ${rollNumberTo}) to ${venue.venue_name}! `,
      data: {
        allocated: students.length,
        students: students.map(s => ({ name: s.name, rollNumber: s.rollNumber }))
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error allocating students by range:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to allocate students. Please try again.',
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Get students in a venue
export const getVenueStudents = async (req, res) => {
  try {
    const { venueId } = req.params;

    const [students] = await db.query(`
      SELECT 
        gs.id,
        s.student_id,
        u.name,
        u.email,
        u.ID as rollNumber,
        u.department,
        s.year,
        s.semester,
        gs.allocation_date,
        gs.status
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      INNER JOIN students s ON gs.student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      WHERE g.venue_id = ? 
      ORDER BY u.ID
    `, [venueId]);

    res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error('Error fetching venue students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch venue students' });
  }
};

// Remove student from venue
export const removeStudentFromVenue = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { venueId, studentId } = req.params;

    await connection.beginTransaction();

    await connection.query(`
      UPDATE group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      SET gs.status = 'Dropped'
      WHERE g.venue_id = ? AND gs.student_id = ?
    `, [venueId, studentId]);

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: 'Student removed from venue successfully!' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error removing student:', error);
    res.status(500).json({ 
      success: false, 
      message:  'Failed to remove student.  Please try again.' 
    });
  } finally {
    connection.release();
  }
};

// Get all faculties (basic list)
export const getAllFacultiesForGroups = async (req, res) => {
  try {
    const [faculties] = await db.query(`
      SELECT 
        f.faculty_id,
        u.name as faculty_name,
        u.email,
        u.department,
        f.designation
      FROM faculties f
      INNER JOIN users u ON f.user_id = u.user_id
      WHERE u.is_active = 1
      ORDER BY u.name
    `);

    res.status(200).json({ success: true, data:  faculties });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch faculties' });
  }
};

// Search venues
export const searchVenues = async (req, res) => {
  try {
    const { search } = req.query;

    const [venues] = await db.query(`
      SELECT 
        v.venue_id,
        v.venue_name,
        v.capacity,
        v.location,
        v.status,
        f.faculty_id,
        u.name as faculty_name,
        COUNT(DISTINCT gs.student_id) as current_students
      FROM venue v
      LEFT JOIN faculties f ON v.assigned_faculty_id = f.faculty_id
      LEFT JOIN users u ON f.user_id = u.user_id
      LEFT JOIN \`groups\` g ON v.venue_id = g.venue_id
      LEFT JOIN group_students gs ON g. group_id = gs.group_id AND gs.status = 'Active'
      WHERE v.venue_name LIKE ? OR v.location LIKE ? OR u.name LIKE ?
      GROUP BY v.venue_id
      ORDER BY v.venue_name
    `, [`%${search}%`, `%${search}%`, `%${search}%`]);

    res.status(200).json({ success: true, data: venues });
  } catch (error) {
    console.error('Error searching venues:', error);
    res.status(500).json({ success: false, message:  'Failed to search venues' });
  }
};
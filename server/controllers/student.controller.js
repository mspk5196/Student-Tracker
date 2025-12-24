import db from '../config/db.js';

// Get all students with their details
export const getAllStudents = async (req, res) => {
  try {
    const [students] = await db.query(`
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
           WHERE sr. student_id = s.student_id), 0
        ) as completedTasks,
        COALESCE(
          (SELECT COUNT(*)
           FROM student_report sr
           WHERE sr. student_id = s.student_id 
           AND sr.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)), 0
        ) as totalTasks
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN faculties f ON s.assigned_faculty_id = f.faculty_id
      LEFT JOIN users fu ON f.user_id = fu.user_id
      WHERE u.role_id = 3
      ORDER BY u.created_at DESC
    `);
    
    const formattedStudents = students.map(student => ({
      id:  student.studentId,
      name: student. name,
      email: student. email,
      image: null, // Add profile picture logic later if needed
      department: student.department,
      year: `${student.year}${getYearSuffix(student.year)} Year`,
      section: `Semester ${student.semester}`,
      attendance: student.attendance. toString(),
      tasks: `${student.completedTasks}/${student.totalTasks}`,
      student_id: student.student_id,
      user_id: student.user_id,
      facultyName: student.facultyName || 'Not Assigned',
      is_active: student.is_active
    }));
    
    res.status(200).json({ success: true, data: formattedStudents });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
};

// Helper function to get year suffix
function getYearSuffix(year) {
  if (year === 1) return 'st';
  if (year === 2) return 'nd';
  if (year === 3) return 'rd';
  return 'th';
}

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
        ) as completedTasks
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

    res.status(200).json({ success: true, data: student[0] });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch student' 
    });
  }
};

// Create new student
export const createStudent = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { name, email, studentId, department, year, semester, assigned_faculty_id } = req.body;

    // Validation
    if (!name || !email || !studentId || !department || !year || !semester) {
      return res.status(400).json({ 
        success: false, 
        message:  'All fields are required' 
      });
    }

    // Check if email already exists
    const [existingEmail] = await connection.query(
      'SELECT email FROM users WHERE email = ?',
      [email]
    );
    
    if (existingEmail.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }

    // Check if student ID already exists
    const [existingId] = await connection.query(
      'SELECT ID FROM users WHERE ID = ?',
      [studentId]
    );
    
    if (existingId. length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student ID already exists' 
      });
    }

    await connection.beginTransaction();

    // Insert into users table (role_id = 3 for student)
    const [userResult] = await connection.query(
      `INSERT INTO users (role_id, name, email, ID, department, created_at, is_active) 
       VALUES (3, ?, ?, ?, ?, NOW(), 1)`,
      [name, email, studentId, department]
    );

    const userId = userResult.insertId;

    // Insert into students table
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

    // Validation
    if (!name || !email || ! department || !year || !semester) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if student exists
    const [existingStudent] = await connection. query(
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

    // Check if email is being changed and if it already exists
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

    // Update users table
    await connection.query(
      `UPDATE users 
       SET name = ?, email = ?, department = ?, is_active = ? 
       WHERE user_id = ?`,
      [name, email, department, is_active !== undefined ? is_active : 1, userId]
    );

    // Update students table
    await connection.query(
      'UPDATE students SET year = ?, semester = ?, assigned_faculty_id = ? WHERE student_id = ?',
      [year, semester, assigned_faculty_id || 0, studentId]
    );

    await connection. commit();

    res.status(200).json({ 
      success: true, 
      message:  'Student updated successfully' 
    });

  } catch (error) {
    await connection.rollback();
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
    const { studentId } = req.params;

    // Check if student exists
    const [existingStudent] = await connection.query(
      'SELECT s.student_id, s.user_id FROM students s INNER JOIN users u ON s.user_id = u.user_id WHERE s.student_id = ? AND u.role_id = 3',
      [studentId]
    );
    
    if (existingStudent.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message:  'Student not found' 
      });
    }

    const userId = existingStudent[0]. user_id;

    await connection.beginTransaction();

    // Delete from students table first (foreign key constraint)
    await connection. query('DELETE FROM students WHERE student_id = ?', [studentId]);

    // Delete from users table
    await connection.query('DELETE FROM users WHERE user_id = ?', [userId]);

    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: 'Student deleted successfully' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error deleting student:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete student' 
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
    console.log('🔹 STUDENT STATS:', stats[0]);
    res.status(200).json({ success: true, data: stats[0] });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch student statistics' 
    });
  }
};
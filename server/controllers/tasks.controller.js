import db from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/tasks';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|svg|png|jpg|jpeg|mp4|webm|zip|cpp|py|js|java|c|txt|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || 
                     file.mimetype === 'text/x-c++src' || 
                     file.mimetype === 'text/x-python' ||
                     file.mimetype === 'text/plain';
    
    if (extname || mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only documents, images, videos, and code files are allowed'));
    }
  }
});

// backend/controllers/tasks.controller.js
// backend/controllers/tasks.controller.js

export const getVenuesForFaculty = async (req, res) => {
  try {
    const { faculty_id } = req.params;

    console.log('📥 Getting venues for faculty_id:', faculty_id);

    // ✅ FIX: JOIN with role table to get role name
    const [adminCheck] = await db.query(`
      SELECT r.role 
      FROM users u 
      JOIN role r ON u.role_id = r. role_id
      WHERE u.user_id = ?  
    `, [faculty_id]);

    console.log('👤 User role check:', adminCheck);

    let query;
    let params;

    if (adminCheck. length > 0 && adminCheck[0].role === 'admin') {
      // Admin sees ALL venues
      console.log('👑 Admin user - showing all venues');
      
      query = `
        SELECT 
          v.venue_id,
          v.venue_name,
          v.capacity,
          COUNT(DISTINCT gs.student_id) as student_count
        FROM venue v
        LEFT JOIN \`groups\` g ON v.venue_id = g.venue_id
        LEFT JOIN group_students gs ON g.group_id = gs.group_id AND gs.status = 'Active'
        WHERE v.status = 'Active'
        GROUP BY v.venue_id
        ORDER BY v.venue_name
      `;
      params = [];
      
    } else {
      // Faculty sees only assigned venues
      console.log('👨‍🏫 Faculty user - showing assigned venues');
      
      // Get faculty_id from user_id
      const [faculty] = await db.query('SELECT faculty_id FROM faculties WHERE user_id = ?', [faculty_id]);
      
      if (faculty.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Faculty record not found'
        });
      }
      
      query = `
        SELECT 
          v.venue_id,
          v.venue_name,
          v.capacity,
          COUNT(DISTINCT gs.student_id) as student_count
        FROM venue v
        LEFT JOIN \`groups\` g ON v.venue_id = g.venue_id
        LEFT JOIN group_students gs ON g.group_id = gs. group_id AND gs.status = 'Active'
        WHERE v.assigned_faculty_id = ?  AND v.status = 'Active'
        GROUP BY v.venue_id
        ORDER BY v. venue_name
      `;
      params = [faculty[0].faculty_id];
    }

    const [venues] = await db.query(query, params);

    console.log('✅ Found venues:', venues. length, venues);

    res.status(200).json({
      success: true,
      data: venues
    });
    
  } catch (error) {
    console.error('❌ Error fetching venues:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch venues'
    });
  }
};
// Create new task/assignment
export const createTask = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { title, description, venue_id, faculty_id, day, due_date, max_score, material_type, external_url } = req.body;

    if (!title || !venue_id || !faculty_id || !day || !max_score) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields:  title, venue, faculty, day, and max score'
      });
    }

    await connection.beginTransaction();

    // Insert task
    const [taskResult] = await connection.query(`
      INSERT INTO tasks (title, description, venue_id, faculty_id, day, due_date, max_score, material_type, external_url, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', NOW())
    `, [title, description || '', venue_id, faculty_id, day, due_date || null, max_score, material_type, external_url || null]);

    const taskId = taskResult.insertId;

    // If files were uploaded, save them
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await connection.query(`
          INSERT INTO task_files (task_id, file_name, file_path, file_type, file_size, uploaded_at)
          VALUES (?, ?, ?, ?, ?, NOW())
        `, [taskId, file.originalname, file.path, file. mimetype, file.size]);
      }
    }

    // Get all students in this venue and create submission records
    const [students] = await connection.query(`
      SELECT DISTINCT s.student_id
      FROM group_students gs
      INNER JOIN \`groups\` g ON gs.group_id = g.group_id
      INNER JOIN students s ON gs.student_id = s.student_id
      WHERE g.venue_id = ? AND gs.status = 'Active'
    `, [venue_id]);

    // Create submission records for all students (initially Pending Review)
    if (students.length > 0) {
      const submissionValues = students.map(s => `(${taskId}, ${s.student_id}, 'Pending Review', NOW())`).join(',');
      await connection.query(`
        INSERT INTO task_submissions (task_id, student_id, status, submitted_at)
        VALUES ${submissionValues}
      `);
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Assignment published successfully! ',
      data: { task_id: taskId, students_count: students.length }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create assignment'
    });
  } finally {
    connection.release();
  }
};

// Get all tasks for a venue
export const getTasksByVenue = async (req, res) => {
  try {
    const { venue_id } = req.params;
    const { status } = req.query;

    let query = `
      SELECT 
        t.task_id,
        t.title,
        t.description,
        t.day,
        t.due_date,
        t.max_score,
        t.material_type,
        t.external_url,
        t.status,
        t.created_at,
        v.venue_name,
        u.name as faculty_name,
        COUNT(DISTINCT ts.submission_id) as total_submissions,
        COUNT(DISTINCT CASE WHEN ts.status = 'Pending Review' THEN ts.submission_id END) as pending_submissions,
        COUNT(DISTINCT CASE WHEN ts.status = 'Graded' THEN ts. submission_id END) as graded_submissions
      FROM tasks t
      INNER JOIN venue v ON t.venue_id = v.venue_id
      INNER JOIN faculties f ON t.faculty_id = f.faculty_id
      INNER JOIN users u ON f.user_id = u.user_id
      LEFT JOIN task_submissions ts ON t.task_id = ts.task_id
      WHERE t.venue_id = ? 
    `;

    const params = [venue_id];

    if (status && status !== 'All') {
      query += ` AND t.status = ? `;
      params.push(status);
    }

    query += ` GROUP BY t.task_id ORDER BY t.created_at DESC`;

    const [tasks] = await db.query(query, params);

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
};

// Get task details with files
export const getTaskDetails = async (req, res) => {
  try {
    const { task_id } = req.params;

    const [tasks] = await db.query(`
      SELECT 
        t.*,
        v.venue_name,
        u.name as faculty_name
      FROM tasks t
      INNER JOIN venue v ON t.venue_id = v.venue_id
      INNER JOIN faculties f ON t.faculty_id = f. faculty_id
      INNER JOIN users u ON f.user_id = u.user_id
      WHERE t.task_id = ? 
    `, [task_id]);

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const [files] = await db.query(`
      SELECT file_id, file_name, file_path, file_type, file_size
      FROM task_files
      WHERE task_id = ?
    `, [task_id]);

    res.status(200).json({
      success: true,
      data: {
        ... tasks[0],
        files
      }
    });
  } catch (error) {
    console.error('Error fetching task details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task details'
    });
  }
};

// Toggle task status (Active/Inactive)
export const toggleTaskStatus = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status.  Must be Active or Inactive'
      });
    }

    await db.query(`
      UPDATE tasks
      SET status = ?, updated_at = NOW()
      WHERE task_id = ?
    `, [status, task_id]);

    res.status(200).json({
      success: true,
      message: `Task set to ${status} successfully! `
    });
  } catch (error) {
    console.error('Error toggling task status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task status'
    });
  }
};

// Get submissions for a task with PAGINATION and SEARCH (from backend)
export const getTaskSubmissions = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { status, search, page = 1, limit = 5 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Base query conditions
    let whereConditions = ['ts.task_id = ?'];
    let params = [task_id];

    // Status filter
    if (status && status !== 'All Statuses') {
      whereConditions.push('ts.status = ?');
      params.push(status);
    }

    // Search filter (searches in name and roll number)
    if (search && search.trim() !== '') {
      whereConditions.push('(u.name LIKE ? OR u. ID LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions. join(' AND ');

    // Get total count for pagination
    const [countResult] = await db.query(`
      SELECT COUNT(*) as total
      FROM task_submissions ts
      INNER JOIN students s ON ts.student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      WHERE ${whereClause}
    `, params);

    const total = countResult[0].total;

    // Get paginated data
    const query = `
      SELECT 
        ts.submission_id,
        ts.submitted_at,
        ts.file_name,
        ts.file_path,
        ts.status,
        ts.grade,
        ts.feedback,
        ts.is_late,
        s.student_id,
        u.ID as student_roll,
        u.name as student_name,
        u.email as student_email,
        u.department
      FROM task_submissions ts
      INNER JOIN students s ON ts. student_id = s.student_id
      INNER JOIN users u ON s.user_id = u.user_id
      WHERE ${whereClause}
      ORDER BY ts.submitted_at DESC
      LIMIT ? OFFSET ?
    `;

    const [submissions] = await db.query(query, [... params, parseInt(limit), parseInt(offset)]);

    res.status(200).json({
      success: true,
      data:  submissions,
      pagination: {
        total,
        page:  parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions'
    });
  }
};

// Grade a submission
export const gradeSubmission = async (req, res) => {
  try {
    const { submission_id } = req.params;
    const { grade, feedback, faculty_id } = req.body;

    // Validate grade
    const gradeNum = parseFloat(grade);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid grade between 0 and 100'
      });
    }

    // Determine status based on grade
    let submissionStatus;
    if (gradeNum >= 50) {
      submissionStatus = 'Graded';
    } else {
      submissionStatus = 'Needs Revision';
    }

    await db.query(`
      UPDATE task_submissions
      SET 
        grade = ?,
        feedback = ?,
        status = ?,
        graded_at = NOW(),
        graded_by = ?
      WHERE submission_id = ?
    `, [gradeNum, feedback || null, submissionStatus, faculty_id, submission_id]);

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully!',
      data: { status: submissionStatus }
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to grade submission'
    });
  }
};

// Student submits file for assignment
export const submitAssignmentFile = async (req, res) => {
  try {
    const { submission_id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Check if submission exists and get task details
    const [submissions] = await db.query(`
      SELECT ts.*, t.due_date
      FROM task_submissions ts
      INNER JOIN tasks t ON ts. task_id = t.task_id
      WHERE ts.submission_id = ?
    `, [submission_id]);

    if (submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    const isLate = submissions[0].due_date && new Date() > new Date(submissions[0].due_date);

    // Update submission with file
    await db.query(`
      UPDATE task_submissions
      SET 
        file_name = ?,
        file_path = ?,
        is_late = ?,
        submitted_at = NOW()
      WHERE submission_id = ? 
    `, [req.file.originalname, req.file.path, isLate, submission_id]);

    res.status(200).json({
      success: true,
      message: 'File submitted successfully!'
    });
  } catch (error) {
    console.error('Error submitting file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit file'
    });
  }
};

// backend/controllers/tasks.controller.js

/// backend/controllers/tasks.controller.js

export const getVenuesByEmail = async (req, res) => {
  try {
    const { email } = req. params;
    
    console.log('📧 Getting venues for email:', email);

    // ✅ Get user with role using JOIN
    const [users] = await db.query(`
      SELECT u.user_id, r.role 
      FROM users u
      JOIN role r ON u.role_id = r.role_id
      WHERE u.email = ?  
    `, [email]);
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const user = users[0];
    console.log('👤 Found user:', user);
    
    let venues;
    
    // If admin, show ALL venues
    if (user.role === 'admin') {
      console.log('👑 Admin user - fetching all venues');
      
      [venues] = await db.query(`
        SELECT 
          v. venue_id,
          v. venue_name,
          v. capacity,
          COUNT(DISTINCT gs.student_id) as student_count
        FROM venue v
        LEFT JOIN \`groups\` g ON v.venue_id = g.venue_id
        LEFT JOIN group_students gs ON g. group_id = gs.group_id AND gs.status = 'Active'
        WHERE v.status = 'Active'
        GROUP BY v.venue_id
        ORDER BY v.venue_name
      `);
      
    } else if (user.role === 'faculty') {
      console.log('👨‍🏫 Faculty user - fetching assigned venues');
      
      // Get faculty_id
      const [faculty] = await db.query('SELECT faculty_id FROM faculties WHERE user_id = ? ', [user.user_id]);
      
      if (faculty. length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Faculty record not found' 
        });
      }
      
      // Get assigned venues
      [venues] = await db. query(`
        SELECT 
          v.venue_id,
          v.venue_name,
          v.capacity,
          COUNT(DISTINCT gs.student_id) as student_count
        FROM venue v
        LEFT JOIN \`groups\` g ON v.venue_id = g.venue_id
        LEFT JOIN group_students gs ON g.group_id = gs. group_id AND gs.status = 'Active'
        WHERE v.assigned_faculty_id = ?  AND v.status = 'Active'
        GROUP BY v.venue_id
        ORDER BY v. venue_name
      `, [faculty[0].faculty_id]);
      
    } else {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized role' 
      });
    }
    
    console.log('✅ Found venues:', venues. length);
    
    res.status(200).json({
      success: true,
      data: venues
    });
    
  } catch (error) {
    console.error('❌ Error fetching venues:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch venues'
    });
  }
};
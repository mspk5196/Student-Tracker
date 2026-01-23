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
    // Get user ID from JWT token
    const userId = req.user.user_id;


    // ✅ FIX: JOIN with role table to get role name
    const [adminCheck] = await db.query(`
      SELECT r.role 
      FROM users u 
      JOIN role r ON u.role_id = r. role_id
      WHERE u.user_id = ?  
    `, [userId]);

    let query;
    let params;

    if (adminCheck. length > 0 && adminCheck[0].role === 'admin') {
      
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
      
      // Get faculty_id from user_id
      const [faculty] = await db.query('SELECT faculty_id FROM faculties WHERE user_id = ?', [userId]);
      
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

    res.status(200).json({
      success: true,
      data: venues
    });
    
  } catch (error) {
    console.error(' Error fetching venues:', error);
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
    const { title, description, venue_id, day, due_date, max_score, material_type, external_url, skill_filter, course_type, apply_to_all_venues } = req.body;

    if (!title || !venue_id || !day || !max_score) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, venue, day, and max score'
      });
    }

    // Get faculty_id from JWT token
    const userId = req.user.user_id;
    let faculty_id;

    if (req.user.role === 'admin') {
      // Admin can create tasks - try to get their faculty_id, or use the venue's assigned faculty
      const [faculty] = await connection.query('SELECT faculty_id FROM faculties WHERE user_id = ?', [userId]);
      if (faculty.length > 0) {
        faculty_id = faculty[0].faculty_id;
      } else {
        // Admin is not a faculty - use the venue's assigned faculty instead
        const [venueData] = await connection.query('SELECT assigned_faculty_id FROM venue WHERE venue_id = ?', [venue_id]);
        if (venueData.length > 0 && venueData[0].assigned_faculty_id) {
          faculty_id = venueData[0].assigned_faculty_id;
        } else {
          // No faculty assigned to venue - get any active faculty as fallback
          const [anyFaculty] = await connection.query('SELECT faculty_id FROM faculties LIMIT 1');
          if (anyFaculty.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'No faculty available. Please create a faculty account first.'
            });
          }
          faculty_id = anyFaculty[0].faculty_id;
        }
      }
    } else {
      // Faculty must use their own faculty_id
      const [faculty] = await connection.query('SELECT faculty_id FROM faculties WHERE user_id = ?', [userId]);
      if (faculty.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'User is not registered as faculty'
        });
      }
      faculty_id = faculty[0].faculty_id;

      // Check if faculty is assigned to this venue
      const [venueCheck] = await connection.query(`
        SELECT venue_id FROM venue WHERE venue_id = ? AND assigned_faculty_id = ?
      `, [venue_id, faculty_id]);

      if (venueCheck.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to create tasks for this venue'
        });
      }
    }

    await connection.beginTransaction();

    // Determine venues to create tasks for
    let targetVenues = [];
    let group_id = null;
    
    if (apply_to_all_venues === 'true' || apply_to_all_venues === true) {
      // Get all active venues
      const [allVenues] = await connection.query(`
        SELECT venue_id FROM venue WHERE status = 'Active'
      `);
      targetVenues = allVenues.map(v => v.venue_id);
      
      // Generate unique group_id for this batch
      group_id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    } else {
      // Single venue
      targetVenues = [parseInt(venue_id)];
    }

    const createdTasks = [];
    let totalStudents = 0;

    // Create task for each target venue
    for (const target_venue_id of targetVenues) {
      // Get venue's faculty or use the provided one
      let venue_faculty_id = faculty_id;
      
      if (apply_to_all_venues) {
        // For multi-venue, try to use each venue's assigned faculty
        const [venueData] = await connection.query(
          'SELECT assigned_faculty_id FROM venue WHERE venue_id = ?', 
          [target_venue_id]
        );
        if (venueData.length > 0 && venueData[0].assigned_faculty_id) {
          venue_faculty_id = venueData[0].assigned_faculty_id;
        }
      }

      // Insert task
      const [taskResult] = await connection.query(`
        INSERT INTO tasks (group_id, title, description, venue_id, faculty_id, day, due_date, max_score, material_type, external_url, skill_filter, course_type, status, is_template, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, NOW())
      `, [group_id, title, description || '', target_venue_id, venue_faculty_id, day, due_date || null, max_score, material_type, external_url || null, skill_filter || null, course_type || null, group_id ? 1 : 0]);

      const taskId = taskResult.insertId;
      createdTasks.push({ task_id: taskId, venue_id: target_venue_id });

      // If files were uploaded, save them for each task
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          await connection.query(`
            INSERT INTO task_files (task_id, file_name, file_path, file_type, file_size, uploaded_at)
            VALUES (?, ?, ?, ?, ?, NOW())
          `, [taskId, file.originalname, file.path, file.mimetype, file.size]);
        }
      }

      // Get all students in this venue
      const [students] = await connection.query(`
        SELECT DISTINCT s.student_id
        FROM group_students gs
        INNER JOIN \`groups\` g ON gs.group_id = g.group_id
        INNER JOIN students s ON gs.student_id = s.student_id
        WHERE g.venue_id = ? AND gs.status = 'Active'
      `, [target_venue_id]);

      // Filter students based on skill_filter if provided
      let eligibleStudents = students;
      
      if (skill_filter && skill_filter.trim()) {
        console.log(`Filtering students for skill: ${skill_filter}`);
        
        // Get students who have CLEARED this skill
        const [clearedStudents] = await connection.query(`
          SELECT DISTINCT student_id
          FROM student_skills
          WHERE course_name = ? AND status = 'Cleared'
        `, [skill_filter.trim()]);
        
        const clearedStudentIds = new Set(clearedStudents.map(s => s.student_id));
        
        // Only include students who have NOT cleared the skill
        eligibleStudents = students.filter(s => !clearedStudentIds.has(s.student_id));
        
        console.log(`Total students in venue: ${students.length}, Eligible students: ${eligibleStudents.length}`);
      }

      // Create submission records for eligible students only
      if (eligibleStudents.length > 0) {
        const submissionValues = eligibleStudents.map(s => `(${taskId}, ${s.student_id}, 'Pending Review', NOW())`).join(',');
        await connection.query(`
          INSERT INTO task_submissions (task_id, student_id, status, submitted_at)
          VALUES ${submissionValues}
        `);
        totalStudents += eligibleStudents.length;
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: apply_to_all_venues 
        ? `Assignment published to ${targetVenues.length} venues successfully!` 
        : 'Assignment published successfully!',
      data: { 
        tasks: createdTasks,
        group_id: group_id,
        venues_count: targetVenues.length,
        students_count: totalStudents 
      }
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
        t.skill_filter,
        t.course_type,
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

// Get tasks from ALL venues
export const getTasksAllVenues = async (req, res) => {
  try {
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
        t.skill_filter,
        t.course_type,
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
    `;

    const params = [];

    if (status && status !== 'All') {
      query += ` WHERE t.status = ? `;
      params.push(status);
    }

    query += ` GROUP BY t.task_id ORDER BY v.venue_name, t.created_at DESC`;

    const [tasks] = await db.query(query, params);

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching all tasks:', error);
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
    const { grade, feedback } = req.body;

    // Get faculty_id from JWT token
    const userId = req.user.user_id;
    
    // Get faculty_id from user_id
    const [faculty] = await db.query('SELECT faculty_id FROM faculties WHERE user_id = ?', [userId]);
    const faculty_id = faculty.length > 0 ? faculty[0].faculty_id : userId;

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
      submissionStatus = 'Graded'; // Successfully completed
    } else {
      submissionStatus = 'Needs Revision'; // Failed - student must resubmit
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

    // If grade < 50%, log that student needs to resubmit
    if (gradeNum < 50) {
      console.log(`Student scored ${gradeNum}% (below 50%) - Task will be shown again for resubmission`);
    }

    res.status(200).json({
      success: true,
      message: gradeNum >= 50 
        ? 'Submission graded successfully!' 
        : 'Submission graded. Student needs to resubmit (score below 50%).',
      data: { 
        status: submissionStatus,
        needsResubmission: gradeNum < 50
      }
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

export const getVenuesByEmail = async (req, res) => {
  try {
    const { email } = req. params;
  

    //  Get user with role using JOIN
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
    
    let venues;
    
    // If admin, show ALL venues
    if (user.role === 'admin') {
      
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
    
    
    res.status(200).json({
      success: true,
      data: venues
    });
    
  } catch (error) {
    console.error(' Error fetching venues:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch venues'
    });
  }
};

// ============ STUDENT TASK FUNCTIONS ============

// Get all tasks/assignments for a student
export const getStudentTasks = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // Get student info and their venue
    const [studentInfo] = await db.query(`
      SELECT 
        s.student_id, 
        u.ID as roll_number, 
        gs.group_id, 
        g.venue_id, 
        v.venue_name
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN group_students gs ON s.student_id = gs.student_id AND gs.status = 'Active'
      LEFT JOIN \`groups\` g ON gs.group_id = g.group_id
      LEFT JOIN venue v ON g.venue_id = v.venue_id
      WHERE s.user_id = ?
    `, [user_id]);

    if (studentInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or not assigned to any venue'
      });
    }

    const { student_id, venue_id, venue_name } = studentInfo[0];

    console.log('Student Info:', { student_id, venue_id, venue_name, user_id });

    if (!venue_id) {
      return res.status(200).json({
        success: true,
        message: 'Student not assigned to any venue',
        data: {
          venue_name: null,
          venue_id: null,
          student_id: student_id,
          groupedTasks: {}
        }
      });
    }

    // Get student's cleared skills to filter tasks
    const [studentSkills] = await db.query(`
      SELECT DISTINCT course_name, status
      FROM student_skills
      WHERE student_id = ?
    `, [student_id]);

    // Create a set of cleared skills for quick lookup
    const clearedSkills = new Set(
      studentSkills
        .filter(skill => skill.status === 'Cleared')
        .map(skill => skill.course_name)
    );

    console.log('Student cleared skills:', Array.from(clearedSkills));

    // Get all tasks for the student's venue
    const [tasks] = await db.query(`
      SELECT 
        t.task_id,
        t.title,
        t.description,
        t.day,
        t.due_date,
        t.max_score,
        t.material_type,
        t.external_url,
        t.skill_filter,
        t.course_type,
        t.status as task_status,
        t.created_at,
        u.name as faculty_name,
        ts.submission_id,
        ts.file_name,
        ts.file_path,
        ts.submitted_at,
        ts.grade,
        ts.feedback,
        ts.is_late,
        ts.status as submission_status
      FROM tasks t
      INNER JOIN faculties f ON t.faculty_id = f.faculty_id
      LEFT JOIN users u ON f.user_id = u.user_id
      LEFT JOIN task_submissions ts ON t.task_id = ts.task_id AND ts.student_id = ?
      WHERE t.venue_id = ? AND t.status = 'Active'
      ORDER BY t.day ASC, t.created_at ASC
    `, [student_id, venue_id]);

    console.log(`Found ${tasks.length} tasks for venue_id ${venue_id} before skill filtering`);

    // Filter tasks based on skill_filter and revision status
    const filteredTasks = tasks.filter(task => {
      // ALWAYS show tasks that need revision (grade < 50%)
      if (task.submission_status === 'Needs Revision') {
        console.log(`Task "${task.title}" needs revision - showing to student`);
        return true;
      }
      
      // If no skill_filter is set, show to everyone (unless already graded successfully)
      if (!task.skill_filter) {
        // Hide tasks that are already graded successfully (grade >= 50%)
        if (task.submission_status === 'Graded' && task.grade >= 50) {
          return false;
        }
        return true;
      }
      
      // If skill_filter is set, only show if student has NOT cleared that skill
      const hasCleared = clearedSkills.has(task.skill_filter);
      console.log(`Task "${task.title}" - Skill Filter: ${task.skill_filter}, Student Cleared: ${hasCleared}, Show: ${!hasCleared}`);
      
      // Hide if student has cleared the skill AND task is already graded successfully
      if (hasCleared && task.submission_status === 'Graded' && task.grade >= 50) {
        return false;
      }
      
      return !hasCleared;
    });

    console.log(`Showing ${filteredTasks.length} tasks after skill filtering and revision check`);

    // Debug: Check all tasks in the venue regardless of status
    const [allVenueTasks] = await db.query(`
      SELECT task_id, title, status, venue_id FROM tasks WHERE venue_id = ?
    `, [venue_id]);
    console.log(`Total tasks in venue ${venue_id}:`, allVenueTasks);

    // Get materials for each task
    const tasksWithResources = await Promise.all(filteredTasks.map(async (task) => {
      // Parse materials from task if they exist
      let materials = [];
      if (task.material_type && task.external_url) {
        materials.push({
          type: task.material_type,
          name: task.title,
          fileUrl: task.material_type === 'file' ? task.external_url : null,
          url: task.material_type === 'link' ? task.external_url : null
        });
      }

      // Determine overall status
      let overallStatus = 'pending';
      if (task.submission_status === 'Needs Revision') {
        overallStatus = 'revision'; // Student needs to resubmit
      } else if (task.submission_status === 'Graded' && task.grade >= 50) {
        overallStatus = 'completed';
      } else if (task.submission_id) {
        overallStatus = 'pending'; // Submitted but not graded yet
      } else if (task.due_date && new Date(task.due_date) < new Date()) {
        overallStatus = 'overdue';
      }

      return {
        id: task.task_id,
        day: task.day,
        title: task.title,
        description: task.description,
        dueDate: task.due_date,
        status: overallStatus,
        score: task.max_score,
        materialType: task.material_type,
        skillFilter: task.skill_filter || '',
        courseType: task.course_type || '',
        moduleTitle: `Day ${task.day}`,
        instructor: task.faculty_name || 'Faculty',
        submittedDate: task.submitted_at,
        grade: task.grade ? `${task.grade}/${task.max_score}` : null,
        feedback: task.feedback,
        isLate: task.is_late,
        fileName: task.file_name,
        filePath: task.file_path,
        submissionStatus: task.submission_status,
        materials: materials
      };
    }));

    // Group tasks by module/subject
    const groupedTasks = tasksWithResources.reduce((acc, task) => {
      const key = `DAY-${task.day}`;
      if (!acc[key]) {
        acc[key] = {
          title: `Day ${task.day}`,
          instructor: task.instructor,
          tasks: []
        };
      }
      acc[key].tasks.push(task);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        venue_name,
        venue_id,
        student_id,
        groupedTasks
      }
    });
  } catch (error) {
    console.error('Error fetching student tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
};

// Submit task assignment
export const submitTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { submission_type, link_url } = req.body;
    const user_id = req.user.user_id;
    const file = req.file;

    // Get student_id
    const [student] = await db.query(`
      SELECT student_id FROM students WHERE user_id = ?
    `, [user_id]);

    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const student_id = student[0].student_id;

    // Verify task exists and is active
    const [task] = await db.query(`
      SELECT task_id, due_date FROM tasks WHERE task_id = ? AND status = 'Active'
    `, [task_id]);

    if (task.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not available'
      });
    }

    // Check if already submitted
    const [existing] = await db.query(`
      SELECT submission_id FROM task_submissions 
      WHERE task_id = ? AND student_id = ?
    `, [task_id, student_id]);

    const due_date = task[0].due_date;
    const is_late = due_date && new Date() > new Date(due_date);

    if (file && file.originalname) {
      // File submission
      if (existing.length > 0) {
        // Update existing submission
        await db.query(`
          UPDATE task_submissions 
          SET file_name = ?, file_path = ?, is_late = ?, 
              submitted_at = NOW(), status = 'Pending Review'
          WHERE submission_id = ?
        `, [file.originalname, file.path, is_late, existing[0].submission_id]);

        return res.status(200).json({
          success: true,
          message: 'Assignment resubmitted successfully!'
        });
      } else {
        // Create new submission
        await db.query(`
          INSERT INTO task_submissions 
          (task_id, student_id, file_name, file_path, is_late, submitted_at, status)
          VALUES (?, ?, ?, ?, ?, NOW(), 'Pending Review')
        `, [task_id, student_id, file.originalname, file.path, is_late]);

        return res.status(201).json({
          success: true,
          message: 'Assignment submitted successfully!'
        });
      }
    } else if (link_url) {
      // Link submission - store in file_path as URL
      if (existing.length > 0) {
        // Update existing submission
        await db.query(`
          UPDATE task_submissions 
          SET file_name = 'Link Submission', file_path = ?, is_late = ?, 
              submitted_at = NOW(), status = 'Pending Review'
          WHERE submission_id = ?
        `, [link_url, is_late, existing[0].submission_id]);

        return res.status(200).json({
          success: true,
          message: 'Link submitted successfully!'
        });
      } else {
        // Create new submission
        await db.query(`
          INSERT INTO task_submissions 
          (task_id, student_id, file_name, file_path, is_late, submitted_at, status)
          VALUES (?, ?, 'Link Submission', ?, ?, NOW(), 'Pending Review')
        `, [task_id, student_id, link_url, is_late]);

        return res.status(201).json({
          success: true,
          message: 'Link submitted successfully!'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either a file or a link'
      });
    }
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit assignment',
      error: error.message
    });
  }
};

// Download submission file
export const downloadSubmission = async (req, res) => {
  try {
    const { submission_id } = req.params;
    const user_id = req.user.user_id;

    // Get student_id and verify ownership
    const [student] = await db.query(`
      SELECT s.student_id 
      FROM students s
      WHERE s.user_id = ?
    `, [user_id]);

    if (student.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const [submission] = await db.query(`
      SELECT file_path, submission_type 
      FROM task_submissions 
      WHERE submission_id = ? AND student_id = ?
    `, [submission_id, student[0].student_id]);

    if (submission.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    if (!submission[0].file_path) {
      return res.status(404).json({
        success: false,
        message: 'No file attached to this submission'
      });
    }

    res.download(submission[0].file_path);
  } catch (error) {
    console.error('Error downloading submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download file'
    });
  }
};

// Sync task submissions for students added after task creation
export const syncTaskSubmissions = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { venue_id } = req.params;
    
    // Get all tasks for this venue
    const [tasks] = await connection.query(`
      SELECT task_id, skill_filter 
      FROM tasks 
      WHERE venue_id = ? AND status = 'active'
    `, [venue_id]);
    
    let totalSubmissionsCreated = 0;
    
    for (const task of tasks) {
      // Get all students in this venue
      const [students] = await connection.query(`
        SELECT DISTINCT s.student_id 
        FROM students s
        INNER JOIN student_venue sv ON s.student_id = sv.student_id
        WHERE sv.venue_id = ? AND s.status = 'active'
      `, [venue_id]);
      
      // Filter students based on skill_filter
      let eligibleStudents = students;
      
      if (task.skill_filter && task.skill_filter.trim()) {
        const [clearedStudents] = await connection.query(`
          SELECT DISTINCT student_id 
          FROM student_skills
          WHERE course_name = ? AND status = 'Cleared'
        `, [task.skill_filter.trim()]);
        
        const clearedStudentIds = new Set(clearedStudents.map(s => s.student_id));
        eligibleStudents = students.filter(s => !clearedStudentIds.has(s.student_id));
      }
      
      // Check which students don't have submissions yet
      if (eligibleStudents.length > 0) {
        const studentIds = eligibleStudents.map(s => s.student_id);
        
        const [existingSubmissions] = await connection.query(`
          SELECT student_id 
          FROM task_submissions 
          WHERE task_id = ? AND student_id IN (?)
        `, [task.task_id, studentIds]);
        
        const existingStudentIds = new Set(existingSubmissions.map(s => s.student_id));
        const newStudents = eligibleStudents.filter(s => !existingStudentIds.has(s.student_id));
        
        // Create submissions for new students
        if (newStudents.length > 0) {
          const submissionValues = newStudents.map(student => 
            `(${task.task_id}, ${student.student_id}, 'Pending Review', NULL, NULL, NULL, NULL, NULL, NOW())`
          ).join(',');
          
          await connection.query(`
            INSERT INTO task_submissions 
            (task_id, student_id, status, file_path, submission_type, submitted_at, grade, feedback, created_at)
            VALUES ${submissionValues}
          `);
          
          totalSubmissionsCreated += newStudents.length;
          console.log(`Created ${newStudents.length} submissions for task ${task.task_id}`);
        }
      }
    }
    
    await connection.commit();
    
    res.json({
      success: true,
      message: `Successfully synced task submissions. Created ${totalSubmissionsCreated} new submissions.`,
      data: {
        tasksProcessed: tasks.length,
        submissionsCreated: totalSubmissionsCreated
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error syncing task submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync task submissions',
      error: error.message
    });
  } finally {
    connection.release();
  }
};
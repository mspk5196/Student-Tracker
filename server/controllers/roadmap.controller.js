// controllers/roadmap.controller.js
import db from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for resource uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/roadmap';
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Get roadmap for a venue
export const getRoadmapByVenue = async (req, res) => {
  try {
    const { venue_id } = req.params;
    const user_id = req.user.user_id; // Get user_id from JWT token

    console.log('Fetching roadmap for venue:', venue_id, 'user:', user_id);

    // Get user role first
    const [user] = await db.query(`
      SELECT role_id FROM users WHERE user_id = ?
    `, [user_id]);

    if (user.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }

    const userRole = user[0].role_id;
    let faculty_id = null;

    // If user is faculty, get their faculty_id
    if (userRole === 2) { // Faculty role
      const [faculty] = await db.query(`
        SELECT faculty_id FROM faculties WHERE user_id = ?
      `, [user_id]);

      if (faculty.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'User is not registered as faculty'
        });
      }
      faculty_id = faculty[0].faculty_id;
    }

    // Get all roadmap modules for the venue
    // Admin can see all, faculty can only see their own
    let query = '';
    let params = [];

    if (userRole === 1) { // Admin
      query = `
        SELECT 
          r.roadmap_id,
          r.day,
          r.title,
          r.description,
          r.status,
          r.created_at,
          r.updated_at,
          r.faculty_id,
          u.name as faculty_name,
          f.user_id as faculty_user_id
        FROM roadmap r
        LEFT JOIN faculties f ON r.faculty_id = f.faculty_id
        LEFT JOIN users u ON f.user_id = u.user_id
        WHERE r.venue_id = ? 
        ORDER BY r.day ASC
      `;
      params = [venue_id];
    } else if (userRole === 2 && faculty_id) { // Faculty
      query = `
        SELECT 
          r.roadmap_id,
          r.day,
          r.title,
          r.description,
          r.status,
          r.created_at,
          r.updated_at,
          r.faculty_id
        FROM roadmap r
        WHERE r.venue_id = ? 
          AND r.faculty_id = ?
        ORDER BY r.day ASC
      `;
      params = [venue_id, faculty_id];
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view roadmap'
      });
    }

    const [modules] = await db.query(query, params);
    console.log('Found modules:', modules.length);

    // Get resources for each module
    for (let module of modules) {
      const [resources] = await db.query(`
        SELECT 
          resource_id,
          resource_name,
          resource_type,
          resource_url,
          file_path,
          file_size,
          uploaded_at
        FROM roadmap_resources
        WHERE roadmap_id = ?
        ORDER BY uploaded_at ASC
      `, [module.roadmap_id]);

      module.resources = resources || [];
    }

    res.status(200).json({
      success: true,
      data: modules
    });
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roadmap'
    });
  }
};

// Create new roadmap module
export const createRoadmapModule = async (req, res) => {
  try {
    const { venue_id, day, title, description, status } = req.body;
    const user_id = req.user.user_id; // Get user_id from JWT

    console.log('Creating module:', { venue_id, day, title, user_id });

    if (!venue_id || !day || !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide venue_id, day, and title'
      });
    }

    // Get user role and determine faculty_id from JWT only
    let actual_faculty_id;

    if (req.user.role === 'admin') {
      // Admin can create modules - use their user_id or get faculty_id if exists
      const [faculty] = await db.query(`
        SELECT faculty_id FROM faculties WHERE user_id = ?
      `, [user_id]);
      actual_faculty_id = faculty.length > 0 ? faculty[0].faculty_id : user_id;
    } else if (req.user.role === 'faculty') {
      // Faculty must use their own faculty_id
      const [faculty] = await db.query(`
        SELECT faculty_id FROM faculties WHERE user_id = ?
      `, [user_id]);

      if (faculty.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'User is not registered as faculty'
        });
      }

      // Always use the faculty's own faculty_id from JWT
      actual_faculty_id = faculty[0].faculty_id;
    } else {
      return res.status(403).json({
        success: false,
        message: 'User role not authorized to create modules'
      });
    }

    // Check if day already exists for this venue and faculty
    const [existing] = await db.query(`
      SELECT roadmap_id FROM roadmap
      WHERE venue_id = ? AND faculty_id = ? AND day = ?
    `, [venue_id, actual_faculty_id, day]);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Day ${day} already exists for this venue`
      });
    }

    const [result] = await db.query(`
      INSERT INTO roadmap (venue_id, faculty_id, day, title, description, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `, [venue_id, actual_faculty_id, day, title, description || '', status || 'draft']);

    res.status(201).json({
      success: true,
      message: 'Roadmap module created successfully!',
      data: { roadmap_id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating roadmap module:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create roadmap module',
      error: error.message
    });
  }
};

// Update roadmap module
export const updateRoadmapModule = async (req, res) => {
  try {
    const { roadmap_id } = req.params;
    const { title, description, status } = req.body;
    const user_id = req.user.user_id;

    console.log('Updating module:', roadmap_id, { title, status });

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Get user role
    const [user] = await db.query(`
      SELECT role_id FROM users WHERE user_id = ?
    `, [user_id]);

    if (user.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }

    const userRole = user[0].role_id;
    let faculty_id = null;

    // If user is faculty, get their faculty_id
    if (userRole === 2) {
      const [faculty] = await db.query(`
        SELECT faculty_id FROM faculties WHERE user_id = ?
      `, [user_id]);

      if (faculty.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'User is not a faculty member'
        });
      }
      faculty_id = faculty[0].faculty_id;
    }

    let whereClause = '';
    let params = [];

    if (userRole === 1) { // Admin can update any module
      whereClause = 'roadmap_id = ?';
      params = [title, description || '', status || 'published', roadmap_id];
    } else if (userRole === 2 && faculty_id) { // Faculty can only update their own
      whereClause = 'roadmap_id = ? AND faculty_id = ?';
      params = [title, description || '', status || 'published', roadmap_id, faculty_id];
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this module'
      });
    }

    const [result] = await db.query(`
      UPDATE roadmap
      SET title = ?, description = ?, status = ?, updated_at = NOW()
      WHERE ${whereClause}
    `, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Module not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Roadmap module updated successfully!'
    });
  } catch (error) {
    console.error('Error updating roadmap module:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update roadmap module'
    });
  }
};

// Delete roadmap module
export const deleteRoadmapModule = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { roadmap_id } = req.params;
    const user_id = req.user.user_id;

    console.log('Deleting module:', roadmap_id);

    await connection.beginTransaction();

    // Get user role
    const [user] = await connection.query(`
      SELECT role_id FROM users WHERE user_id = ?
    `, [user_id]);

    if (user.length === 0) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }

    const userRole = user[0].role_id;
    let faculty_id = null;

    // If user is faculty, get their faculty_id
    if (userRole === 2) {
      const [faculty] = await connection.query(`
        SELECT faculty_id FROM faculties WHERE user_id = ?
      `, [user_id]);

      if (faculty.length === 0) {
        await connection.rollback();
        return res.status(403).json({
          success: false,
          message: 'User is not a faculty member'
        });
      }
      faculty_id = faculty[0].faculty_id;
    }

    // Build where clause based on user role
    let whereClause = '';
    let params = [];

    if (userRole === 1) { // Admin can delete any module
      whereClause = 'roadmap_id = ?';
      params = [roadmap_id];
    } else if (userRole === 2 && faculty_id) { // Faculty can only delete their own
      whereClause = 'roadmap_id = ? AND faculty_id = ?';
      params = [roadmap_id, faculty_id];
    } else {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this module'
      });
    }

    // Get module to verify it exists
    const [module] = await connection.query(`
      SELECT roadmap_id FROM roadmap WHERE ${whereClause}
    `, params);

    if (module.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Module not found or unauthorized'
      });
    }

    // Get all resource files to delete them
    const [resources] = await connection.query(`
      SELECT file_path FROM roadmap_resources
      WHERE roadmap_id = ? AND file_path IS NOT NULL
    `, [roadmap_id]);

    // Delete files from filesystem
    for (const resource of resources) {
      if (resource.file_path && fs.existsSync(resource.file_path)) {
        try {
          fs.unlinkSync(resource.file_path);
          console.log('Deleted file:', resource.file_path);
        } catch (fileError) {
          console.warn('Failed to delete file:', resource.file_path, fileError.message);
        }
      }
    }

    // Delete resources from database
    await connection.query(`
      DELETE FROM roadmap_resources WHERE roadmap_id = ?
    `, [roadmap_id]);

    // Delete roadmap module
    await connection.query(`
      DELETE FROM roadmap WHERE roadmap_id = ?
    `, [roadmap_id]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Roadmap module deleted successfully!'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting roadmap module:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete roadmap module'
    });
  } finally {
    connection.release();
  }
};

// Add resource to roadmap module
export const addResourceToModule = async (req, res) => {
  try {
    const { roadmap_id, resource_name, resource_type, resource_url } = req.body;
    const file = req.file;
    const user_id = req.user.user_id;

    console.log('Adding resource:', { roadmap_id, resource_name, resource_type, hasFile: !!file, user_id });

    if (!roadmap_id || !resource_name || !resource_type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roadmap_id, resource_name, and resource_type'
      });
    }

    // Validate resource type
    if (!['pdf', 'video', 'link'].includes(resource_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource type. Must be pdf, video, or link'
      });
    }

    // Get user role
    const [user] = await db.query(`
      SELECT role_id FROM users WHERE user_id = ?
    `, [user_id]);

    if (user.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }

    const userRole = user[0].role_id;
    let faculty_id = null;

    // If user is faculty, get their faculty_id
    if (userRole === 2) {
      const [faculty] = await db.query(`
        SELECT faculty_id FROM faculties WHERE user_id = ?
      `, [user_id]);

      if (faculty.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'User is not a faculty member'
        });
      }
      faculty_id = faculty[0].faculty_id;
    }

    // Verify the module belongs to the user (or admin can access any)
    let verifyQuery = '';
    let verifyParams = [];

    if (userRole === 1) { // Admin can add resource to any module
      verifyQuery = 'SELECT roadmap_id FROM roadmap WHERE roadmap_id = ?';
      verifyParams = [roadmap_id];
    } else if (userRole === 2 && faculty_id) { // Faculty can only add to their own
      verifyQuery = 'SELECT roadmap_id FROM roadmap WHERE roadmap_id = ? AND faculty_id = ?';
      verifyParams = [roadmap_id, faculty_id];
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to add resource to this module'
      });
    }

    const [verify] = await db.query(verifyQuery, verifyParams);

    if (verify.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to add resource to this module'
      });
    }

    let filePath = null;
    let fileSize = null;
    let url = resource_url || null;

    // If it's a PDF upload
    if (resource_type === 'pdf') {
      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a PDF file'
        });
      }
      filePath = file.path;
      fileSize = file.size;
      url = null;
    } else {
      // For video or link, URL is required
      if (!resource_url) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a resource URL'
        });
      }
    }

    const [result] = await db.query(`
      INSERT INTO roadmap_resources (roadmap_id, resource_name, resource_type, resource_url, file_path, file_size, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `, [roadmap_id, resource_name, resource_type, url, filePath, fileSize]);

    res.status(201).json({
      success: true,
      message: 'Resource added successfully!',
      data: {
        resource_id: result.insertId,
        file_path: filePath
      }
    });
  } catch (error) {
    console.error('Error adding resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add resource'
    });
  }
};

// Delete resource from roadmap module
export const deleteResourceFromModule = async (req, res) => {
  try {
    const { resource_id } = req.params;
    const user_id = req.user.user_id;

    console.log('Deleting resource:', resource_id);

    // Get user role
    const [user] = await db.query(`
      SELECT role_id FROM users WHERE user_id = ?
    `, [user_id]);

    if (user.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }

    const userRole = user[0].role_id;
    let faculty_id = null;

    // If user is faculty, get their faculty_id
    if (userRole === 2) {
      const [faculty] = await db.query(`
        SELECT faculty_id FROM faculties WHERE user_id = ?
      `, [user_id]);

      if (faculty.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'User is not a faculty member'
        });
      }
      faculty_id = faculty[0].faculty_id;
    }

    // Get resource details and verify ownership
    let query = '';
    let params = [];

    if (userRole === 1) { // Admin can delete any resource
      query = `
        SELECT rr.file_path, rr.roadmap_id 
        FROM roadmap_resources rr
        WHERE rr.resource_id = ?
      `;
      params = [resource_id];
    } else if (userRole === 2 && faculty_id) { // Faculty can only delete their own
      query = `
        SELECT rr.file_path, rr.roadmap_id 
        FROM roadmap_resources rr
        JOIN roadmap r ON rr.roadmap_id = r.roadmap_id
        WHERE rr.resource_id = ? AND r.faculty_id = ?
      `;
      params = [resource_id, faculty_id];
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete resource'
      });
    }

    const [resources] = await db.query(query, params);

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found or unauthorized'
      });
    }

    // Delete file from filesystem if it exists
    const filePath = resources[0].file_path;
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log('Deleted resource file:', filePath);
      } catch (fileError) {
        console.warn('Failed to delete file:', filePath, fileError.message);
      }
    }

    // Delete from database
    await db.query(`
      DELETE FROM roadmap_resources WHERE resource_id = ?
    `, [resource_id]);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully!'
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource'
    });
  }
};

// Get roadmap for students (by their venue)
export const getStudentRoadmap = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    console.log('Fetching roadmap for student user:', user_id);

    // Get student info and their venue
    const [student] = await db.query(`
      SELECT 
        s.student_id,
        u.name,
        u.ID as roll_number,
        g.venue_id,
        v.venue_name
      FROM students s
      INNER JOIN users u ON s.user_id = u.user_id
      LEFT JOIN group_students gs ON s.student_id = gs.student_id AND gs.status = 'Active'
      LEFT JOIN \`groups\` g ON gs.group_id = g.group_id
      LEFT JOIN venue v ON g.venue_id = v.venue_id
      WHERE s.user_id = ?
      LIMIT 1
    `, [user_id]);

    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const venue_id = student[0].venue_id;

    if (!venue_id) {
      return res.status(200).json({
        success: true,
        message: 'No venue assigned yet',
        data: [],
        venue: null
      });
    }

    // Get all roadmap modules for the student's venue
    const [modules] = await db.query(`
      SELECT 
        r.roadmap_id,
        r.day,
        r.title,
        r.description,
        r.status,
        r.created_at,
        r.updated_at,
        r.faculty_id,
        u.name as faculty_name,
        v.venue_name,
        v.venue_id
      FROM roadmap r
      LEFT JOIN faculties f ON r.faculty_id = f.faculty_id
      LEFT JOIN users u ON f.user_id = u.user_id
      LEFT JOIN venue v ON r.venue_id = v.venue_id
      WHERE r.venue_id = ?
      ORDER BY r.day ASC
    `, [venue_id]);

    console.log('Found modules for student:', modules.length);

    // Get resources for each module
    for (let module of modules) {
      const [resources] = await db.query(`
        SELECT 
          resource_id,
          resource_name,
          resource_type,
          resource_url,
          file_path,
          file_size,
          uploaded_at
        FROM roadmap_resources
        WHERE roadmap_id = ?
        ORDER BY uploaded_at ASC
      `, [module.roadmap_id]);

      module.resources = resources || [];
    }

    res.status(200).json({
      success: true,
      data: modules,
      venue: {
        venue_id: venue_id,
        venue_name: student[0].venue_name
      }
    });
  } catch (error) {
    console.error('Error fetching student roadmap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roadmap'
    });
  }
};

// Get resource file (for download)
export const getResourceFile = async (req, res) => {
  try {
    const { resource_id } = req.params;
    const user_id = req.user.user_id;

    console.log('Downloading resource:', resource_id);

    // Get user role
    const [user] = await db.query(`
      SELECT role_id FROM users WHERE user_id = ?
    `, [user_id]);

    if (user.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }

    const userRole = user[0].role_id;
    let faculty_id = null;
    let student_venue_id = null;

    // If user is faculty, get their faculty_id
    if (userRole === 2) {
      const [faculty] = await db.query(`
        SELECT faculty_id FROM faculties WHERE user_id = ?
      `, [user_id]);

      if (faculty.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'User is not a faculty member'
        });
      }
      faculty_id = faculty[0].faculty_id;
    }

    // If user is student, get their venue_id
    if (userRole === 3) {
      const [student] = await db.query(`
        SELECT g.venue_id
        FROM students s
        LEFT JOIN group_students gs ON s.student_id = gs.student_id AND gs.status = 'Active'
        LEFT JOIN \`groups\` g ON gs.group_id = g.group_id
        WHERE s.user_id = ?
        LIMIT 1
      `, [user_id]);

      if (student.length === 0 || !student[0].venue_id) {
        return res.status(403).json({
          success: false,
          message: 'Student not found or no venue assigned'
        });
      }
      student_venue_id = student[0].venue_id;
    }

    // Verify access before allowing download
    let query = '';
    let params = [];

    if (userRole === 1) { // Admin can download any resource
      query = `
        SELECT rr.resource_name, rr.file_path, rr.resource_type
        FROM roadmap_resources rr
        WHERE rr.resource_id = ?
      `;
      params = [resource_id];
    } else if (userRole === 2 && faculty_id) { // Faculty can only download their own
      query = `
        SELECT rr.resource_name, rr.file_path, rr.resource_type
        FROM roadmap_resources rr
        JOIN roadmap r ON rr.roadmap_id = r.roadmap_id
        WHERE rr.resource_id = ? AND r.faculty_id = ?
      `;
      params = [resource_id, faculty_id];
    } else if (userRole === 3 && student_venue_id) { // Students can download resources from their venue
      query = `
        SELECT rr.resource_name, rr.file_path, rr.resource_type
        FROM roadmap_resources rr
        JOIN roadmap r ON rr.roadmap_id = r.roadmap_id
        WHERE rr.resource_id = ? AND r.venue_id = ?
      `;
      params = [resource_id, student_venue_id];
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to download resource'
      });
    }

    const [resources] = await db.query(query, params);

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found or unauthorized'
      });
    }

    const resource = resources[0];

    if (resource.resource_type !== 'pdf' || !resource.file_path) {
      return res.status(400).json({
        success: false,
        message: 'This resource is not a downloadable file'
      });
    }

    if (!fs.existsSync(resource.file_path)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Set proper headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resource.resource_name}.pdf"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(resource.file_path);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download resource'
    });
  }
};

import db from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for resource uploads
const storage = multer. diskStorage({
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

    // Get all roadmap modules for the venue
    const [modules] = await db.query(`
      SELECT 
        r.roadmap_id,
        r. day,
        r.title,
        r.description,
        r.status,
        r.created_at,
        r.updated_at
      FROM roadmap r
      WHERE r.venue_id = ? 
      ORDER BY r.day ASC
    `, [venue_id]);

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

      module.resources = resources;
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
    const { venue_id, faculty_id, day, title, description, status } = req.body;

    if (!venue_id || !faculty_id || !day || !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide venue_id, faculty_id, day, and title'
      });
    }

    // Check if day already exists for this venue
    const [existing] = await db.query(`
      SELECT roadmap_id FROM roadmap
      WHERE venue_id = ? AND day = ?
    `, [venue_id, day]);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Day ${day} already exists for this venue`
      });
    }

    const [result] = await db.query(`
      INSERT INTO roadmap (venue_id, faculty_id, day, title, description, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `, [venue_id, faculty_id, day, title, description || '', status || 'draft']);

    res.status(201).json({
      success: true,
      message: 'Roadmap module created successfully! ',
      data: { roadmap_id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating roadmap module:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create roadmap module'
    });
  }
};

// Update roadmap module
export const updateRoadmapModule = async (req, res) => {
  try {
    const { roadmap_id } = req.params;
    const { title, description, status } = req. body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    await db.query(`
      UPDATE roadmap
      SET title = ?, description = ?, status = ?, updated_at = NOW()
      WHERE roadmap_id = ? 
    `, [title, description || '', status || 'published', roadmap_id]);

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

    await connection.beginTransaction();

    // Get all resource files to delete them
    const [resources] = await connection.query(`
      SELECT file_path FROM roadmap_resources
      WHERE roadmap_id = ?  AND file_path IS NOT NULL
    `, [roadmap_id]);

    // Delete files from filesystem
    for (const resource of resources) {
      if (resource.file_path && fs.existsSync(resource. file_path)) {
        fs.unlinkSync(resource.file_path);
      }
    }

    // Delete resources from database (cascade will handle this, but explicit is better)
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
      message:  'Roadmap module deleted successfully!'
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

    if (!roadmap_id || !resource_name || !resource_type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide roadmap_id, resource_name, and resource_type'
      });
    }

    // Validate resource type
    if (! ['pdf', 'video', 'link'].includes(resource_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource type.  Must be pdf, video, or link'
      });
    }

    let filePath = null;
    let fileSize = null;
    let url = resource_url || null;

    // If it's a PDF upload
    if (resource_type === 'pdf') {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a PDF file'
        });
      }
      filePath = req.file.path;
      fileSize = req.file.size;
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
        resource_id: result. insertId,
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

    // Get resource details first
    const [resources] = await db.query(`
      SELECT file_path FROM roadmap_resources WHERE resource_id = ?
    `, [resource_id]);

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Delete file from filesystem if it exists
    const filePath = resources[0].file_path;
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
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

// Get resource file (for download)
export const getResourceFile = async (req, res) => {
  try {
    const { resource_id } = req.params;

    const [resources] = await db.query(`
      SELECT resource_name, file_path, resource_type
      FROM roadmap_resources
      WHERE resource_id = ?
    `, [resource_id]);

    if (resources.length === 0) {
      return res. status(404).json({
        success: false,
        message:  'Resource not found'
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

    res.download(resource.file_path, resource.resource_name);
  } catch (error) {
    console.error('Error downloading resource:', error);
    res.status(500).json({
      success: false,
      message:  'Failed to download resource'
    });
  }
};
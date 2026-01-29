import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  uploadSkillReport,
  getSkillReportsForFaculty,
  getSkillReportsForStudent,
  searchStudentSkillReports,
  getFacultyVenues
} from '../controllers/skillReportController.js';
import multer from 'multer';

const router = express. Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  },
  limits: { 
    fileSize: 100 * 1024 * 1024  // Increased to 100MB for very large Excel files (5000+ records)
  }
});

// Admin routes
router.post('/upload', authenticate, upload.single('file'), uploadSkillReport);

// Faculty routes
router.get('/faculty/venues', authenticate, getFacultyVenues);
router.post('/faculty/venue/reports', authenticate, getSkillReportsForFaculty);
router.post('/faculty/search', authenticate, searchStudentSkillReports);

// Student routes
router.get('/student/my-reports', authenticate, getSkillReportsForStudent); 

// Error handling middleware for multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the limit of 100MB'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }
  
  if (err.message === 'Only Excel files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Only Excel files (.xlsx, .xls) are allowed'
    });
  }
  
  // Other errors
  if (err) {
    console.error('Skill report route error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'An error occurred'
    });
  }
  
  next();
});

export default router;
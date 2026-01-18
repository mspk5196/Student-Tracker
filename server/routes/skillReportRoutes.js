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
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Admin routes
router.post('/upload', authenticate, upload.single('file'), uploadSkillReport);

// Faculty routes
router.get('/faculty/venues', authenticate, getFacultyVenues);
router.post('/faculty/venue/reports', authenticate, getSkillReportsForFaculty);
router.post('/faculty/search', authenticate, searchStudentSkillReports);

// Student routes
router.get('/student/my-reports', authenticate, getSkillReportsForStudent); 

export default router;
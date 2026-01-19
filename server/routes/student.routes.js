


import express from 'express';
import multer from 'multer';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
  downloadStudentReport,
  getFilters,
  getStudentAttendanceDashboard,
  getStudentOverview,
  getStudentRanking,
  getStudentTaskGrade,
  bulkUploadStudents
} from '../controllers/student.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Configure multer for Excel file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
    }
  }
});

// All routes are protected
router.get('/', authenticate, getAllStudents);
router.get('/filters', authenticate, getFilters);
router.get('/stats', authenticate, getStudentStats);
router.post('/bulk-upload', authenticate, upload.single('file'), bulkUploadStudents);
router.get('/:studentId', authenticate, getStudentById);
router.get('/:studentId/download-report', authenticate, downloadStudentReport);
router.get('/:studentId/attendance-dashboard', authenticate, getStudentAttendanceDashboard);
router.get('/:studentId/overview', authenticate, getStudentOverview);
router.get('/:studentId/ranking', authenticate, getStudentRanking);
router.post('/', authenticate, createStudent);
router.put('/:studentId', authenticate, updateStudent);
router.delete('/:studentId', authenticate, deleteStudent);
router.get('/:studentId/task-grade', authenticate, getStudentTaskGrade);

export default router;
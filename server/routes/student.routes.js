// import express from 'express';
// import {
//   getAllStudents,
//   getStudentById,
//   createStudent,
//   updateStudent,
//   deleteStudent,
//   getStudentStats,
//   downloadStudentReport,
//   getFilters
// } from '../controllers/student.controller.js';
// import { authenticate } from '../middleware/auth.middleware.js';

// const router = express.Router();

// // All routes are protected
// router.get('/', authenticate, getAllStudents);
// router.get('/filters', authenticate, getFilters);
// router.get('/stats', authenticate, getStudentStats);
// router.get('/:studentId', authenticate, getStudentById);
// router.get('/:studentId/download-report', authenticate, downloadStudentReport);
// router.post('/', authenticate, createStudent);
// router.put('/:studentId', authenticate, updateStudent);
// router.delete('/:studentId', authenticate, deleteStudent);

// export default router;


import express from 'express';
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
  getStudentTaskGrade
} from '../controllers/student.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.get('/', authenticate, getAllStudents);
router.get('/filters', authenticate, getFilters);
router.get('/stats', authenticate, getStudentStats);
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
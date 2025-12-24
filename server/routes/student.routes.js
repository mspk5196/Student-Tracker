import express from 'express';
import { 
  getAllStudents, 
  getStudentById,
  createStudent, 
  updateStudent, 
  deleteStudent,
  getStudentStats
} from '../controllers/student.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express. Router();

// All routes are protected
router.get('/', authenticate, getAllStudents);
router.get('/stats', authenticate, getStudentStats);
router.get('/:studentId', authenticate, getStudentById);
router.post('/', authenticate, createStudent);
router.put('/:studentId', authenticate, updateStudent);
router.delete('/:studentId', authenticate, deleteStudent);

export default router;
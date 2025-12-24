import express from 'express';
import { 
  getAllFaculties, 
  createFaculty, 
  updateFaculty, 
  deleteFaculty,
  getFacultyById 
} from '../controllers/faculty.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.get('/', authenticate, getAllFaculties);
router.get('/:userId', authenticate, getFacultyById);
router.post('/', authenticate, createFaculty);
router.put('/:userId', authenticate, updateFaculty);
router.delete('/:userId', authenticate, deleteFaculty);

export default router;
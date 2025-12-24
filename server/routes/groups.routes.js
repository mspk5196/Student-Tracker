import express from 'express';
import multer from 'multer';
import { 
  getAllGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  getAllVenues,
  getAllFacultiesForGroups,
  bulkUploadStudents,
  autoAllocateStudents,
  getGroupStudents,
  removeStudentFromGroup,
  getAllSkills,
  assignSkillsToVenue
} from '../controllers/groups.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// All routes are protected
router.get('/', authenticate, getAllGroups);
router.post('/', authenticate, createGroup);
router.put('/:groupId', authenticate, updateGroup);
router.delete('/:groupId', authenticate, deleteGroup);

router.get('/venues', authenticate, getAllVenues);
router.get('/faculties', authenticate, getAllFacultiesForGroups);
router.get('/skills', authenticate, getAllSkills);
router.post('/venues/:venueId/skills', authenticate, assignSkillsToVenue);

router.post('/bulk-upload', authenticate, upload. single('file'), bulkUploadStudents);
router.post('/:groupId/auto-allocate', authenticate, autoAllocateStudents);
router.get('/:groupId/students', authenticate, getGroupStudents);
router.delete('/:groupId/students/:studentId', authenticate, removeStudentFromGroup);

export default router;
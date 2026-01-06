import express from 'express';
import {
  getVenuesForFaculty,
  createTask,
  getTasksByVenue,
  getTaskDetails,
  toggleTaskStatus,
  getTaskSubmissions,
  gradeSubmission,
  submitAssignmentFile,
   getVenuesByEmail,
  upload
} from '../controllers/tasks.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express. Router();

// Faculty/Admin routes - get venues
router.get('/venues/:faculty_id', authenticate, getVenuesForFaculty);
router.get('/venues/by-email/:email', authenticate, getVenuesByEmail);
// Faculty/Admin routes - manage tasks
router.post('/create', authenticate, upload.array('files', 10), createTask);
router.get('/venue/:venue_id', authenticate, getTasksByVenue);
router.get('/details/:task_id', authenticate, getTaskDetails);
router.put('/status/:task_id', authenticate, toggleTaskStatus);

// Submissions/Reports routes - for faculty grading
router.get('/submissions/:task_id', authenticate, getTaskSubmissions);
router.put('/grade/:submission_id', authenticate, gradeSubmission);

// Student routes - submit assignment
router.put('/submit/:submission_id', authenticate, upload.single('file'), submitAssignmentFile);

export default router;
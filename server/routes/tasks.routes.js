import express from 'express';
import {
  getVenuesForFaculty,
  createTask,
  getTasksByVenue,
  getTasksAllVenues,
  getTaskDetails,
  toggleTaskStatus,
  getTaskSubmissions,
  gradeSubmission,
  submitAssignmentFile,
  getVenuesByEmail,
  getStudentTasks,
  submitTask,
  downloadSubmission,
  syncTaskSubmissions,
  upload
} from '../controllers/tasks.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// ============ STUDENT ROUTES ============
// Get all tasks for authenticated student (uses JWT)
router.get('/student', authenticate, getStudentTasks);

// Submit task assignment (file or link)
router.post('/:task_id/submit', authenticate, upload.single('file'), submitTask);

// Download own submission file
router.get('/submissions/:submission_id/download', authenticate, downloadSubmission);

// ============ FACULTY/ADMIN ROUTES ============
// Faculty/Admin routes - get venues (uses JWT to identify user)
router.get('/venues', authenticate, getVenuesForFaculty);

// Faculty/Admin routes - manage tasks
router.post('/create', authenticate, upload.array('files', 10), createTask);
router.get('/all-venues', authenticate, getTasksAllVenues);
router.get('/venue/:venue_id', authenticate, getTasksByVenue);
router.get('/details/:task_id', authenticate, getTaskDetails);
router.put('/status/:task_id', authenticate, toggleTaskStatus);

// Sync task submissions for newly added students
router.post('/sync/:venue_id', authenticate, syncTaskSubmissions);

// Submissions/Reports routes - for faculty grading
router.get('/submissions/:task_id', authenticate, getTaskSubmissions);
router.put('/grade/:submission_id', authenticate, gradeSubmission);

// Student routes - submit assignment (old route, kept for compatibility)
router.put('/submit/:submission_id', authenticate, upload.single('file'), submitAssignmentFile);

export default router;
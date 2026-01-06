import express from 'express';
import {
  getFacultyOverview,
  getTodaysClasses,
  getFacultyGroups,
  getTaskReviewQueue,
  getAttendanceSummary,
  getEngagementData,
  getQuickActions,
  getDashboardData
} from '../controllers/facultyDashboard.js';
import { authenticate} from '../middleware/auth.middleware.js';
const router = express.Router();

// All routes require authentication and faculty role
router.use(authenticate);

// Individual endpoints
router.get('/overview', getFacultyOverview);
router.get('/todays-classes', getTodaysClasses);
router.get('/groups', getFacultyGroups);
router.get('/task-review', getTaskReviewQueue);
router.get('/attendance-summary', getAttendanceSummary);
router.get('/engagement-data', getEngagementData);
router.get('/quick-actions', getQuickActions);

// Complete dashboard data (all in one)
router.get('/', getDashboardData);

export default router;
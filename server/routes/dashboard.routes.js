import express from 'express';
import { 
  getDashboardMetrics,
  getAttendanceByDepartment,
  getTaskCompletion,
  getAlerts
} from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Dashboard routes
router.get('/metrics', getDashboardMetrics);
router.get('/attendance-by-dept', getAttendanceByDepartment);
router.get('/task-completion', getTaskCompletion);
router.get('/alerts', getAlerts); // Supports pagination: /api/dashboard/alerts?page=1&limit=3

export default router;
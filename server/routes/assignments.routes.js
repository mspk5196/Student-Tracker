import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getStudentRecentAssignments } from '../controllers/studentDashboard.controller.js';

const router = express.Router();
router.use(authenticate);

// Student dashboard recent assignments
router.get('/recent', getStudentRecentAssignments);

export default router;

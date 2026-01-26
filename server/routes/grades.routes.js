import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getStudentRecentGrades } from '../controllers/studentDashboard.controller.js';

const router = express.Router();
router.use(authenticate);

// Student dashboard recent grades
router.get('/recent', getStudentRecentGrades);

export default router;

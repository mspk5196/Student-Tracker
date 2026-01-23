import express from 'express';
import { getStudentSchedule } from '../controllers/schedule.controller.js';
import { authenticate } from '../middleware/auth.middleware.js'; // Assuming you have this

const router = express.Router();

// GET /api/schedule?date=2024-10-24
router.get('/', authenticate, getStudentSchedule);

export default router;
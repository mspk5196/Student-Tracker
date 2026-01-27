import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getStudentActivityHeatmap, getStudentActivityHeatmapByStudentId } from '../controllers/activity.controller.js';

const router = express.Router();

router.use(authenticate);

// Student dashboard activity heatmap (for logged-in student)
router.get('/heatmap', getStudentActivityHeatmap);

// Admin endpoint to get activity heatmap for a specific student
router.get('/heatmap/:studentId', getStudentActivityHeatmapByStudentId);

export default router;

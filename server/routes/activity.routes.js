import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getStudentActivityHeatmap } from '../controllers/activity.controller.js';

const router = express.Router();

router.use(authenticate);

// Student dashboard activity heatmap
router.get('/heatmap', getStudentActivityHeatmap);

export default router;

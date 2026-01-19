// routes/roadmap.routes.js
import express from 'express';
import {
    getRoadmapByVenue,
    createRoadmapModule,
    updateRoadmapModule,
    deleteRoadmapModule,
    addResourceToModule,
    deleteResourceFromModule,
    getResourceFile,
    getStudentRoadmap,
    upload
} from '../controllers/roadmap.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = express.Router();

// ============ STUDENT ENDPOINTS ============
// Get roadmap for current student (based on their venue)
router.get('/student', authenticate, getStudentRoadmap);

// ============ FACULTY/ADMIN ENDPOINTS ============
// Roadmap module routes
router.get('/venue/:venue_id', authenticate, getRoadmapByVenue);
router.post('/', authenticate, createRoadmapModule);
router.put('/:roadmap_id', authenticate, updateRoadmapModule);
router.delete('/:roadmap_id', authenticate, deleteRoadmapModule);

// Resource routes
router.post('/resources', authenticate, upload.single('file'), addResourceToModule);
router.delete('/resources/:resource_id', authenticate, deleteResourceFromModule);
router.get('/resources/download/:resource_id', authenticate, getResourceFile);

export default router;
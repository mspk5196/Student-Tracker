import express from 'express';
import {
  getStudentRoadmaps,
  getRoadmapDetails,
  updateModuleProgress,
  getStudentProgress,
  createRoadmap,
  addModule,
  updateModule,
  deleteModule,
  addResource,
  deleteResource,
  getAllRoadmaps,
  getRoadmapsByGroup
} from '../controllers/roadmap.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// ============ STUDENT ENDPOINTS ============
// Get all roadmaps for a student
router.get('/student/:studentId', authenticate, getStudentRoadmaps);

// Get student's progress for a roadmap
router.get('/student/:studentId/progress/:roadmapId', authenticate, getStudentProgress);

// Get roadmap details with modules
router.get('/:roadmapId', authenticate, getRoadmapDetails);

// Update module progress (mark complete/incomplete)
router.put('/modules/:moduleId/progress', authenticate, updateModuleProgress);

// ============ FACULTY/ADMIN ENDPOINTS ============
// Get all roadmaps (with optional group filter)
router.get('/', authenticate, getAllRoadmaps);

// Get roadmaps by group code
router.get('/group/:groupCode', authenticate, getRoadmapsByGroup);

// Create a new roadmap
router.post('/', authenticate, createRoadmap);

// Add module to roadmap
router.post('/:roadmapId/modules', authenticate, addModule);

// Update module
router.put('/modules/:moduleId', authenticate, updateModule);

// Delete module
router.delete('/modules/:moduleId', authenticate, deleteModule);

// Add resource to module
router.post('/modules/:moduleId/resources', authenticate, addResource);

// Delete resource
router.delete('/resources/:resourceId', authenticate, deleteResource);

export default router;

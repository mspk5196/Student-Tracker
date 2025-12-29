import express from 'express';
import {
  getRoadmapByVenue,
  createRoadmapModule,
  updateRoadmapModule,
  deleteRoadmapModule,
  addResourceToModule,
  deleteResourceFromModule,
  getResourceFile,
  upload
} from '../controllers/roadmap.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Roadmap module routes
router.get('/venue/:venue_id', authenticate, getRoadmapByVenue);
router.post('/create', authenticate, createRoadmapModule);
router.put('/update/:roadmap_id', authenticate, updateRoadmapModule);
router.delete('/delete/:roadmap_id', authenticate, deleteRoadmapModule);

// Resource routes
router.post('/resources/add', authenticate, upload. single('file'), addResourceToModule);
router.delete('/resources/delete/:resource_id', authenticate, deleteResourceFromModule);
router.get('/resources/download/:resource_id', authenticate, getResourceFile);

export default router;
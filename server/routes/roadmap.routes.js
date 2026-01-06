// import express from 'express';
// import {
//   getRoadmapByVenue,
//   createRoadmapModule,
//   updateRoadmapModule,
//   deleteRoadmapModule,
//   addResourceToModule,
//   deleteResourceFromModule,
//   getResourceFile,
//   upload
// } from '../controllers/roadmap.controller.js';
// import { authenticate } from '../middleware/auth.middleware.js';

// const router = express.Router();

// // Roadmap module routes
// router.get('/venue/:venue_id', authenticate, getRoadmapByVenue);
// router.post('/create', authenticate, createRoadmapModule);
// router.put('/update/:roadmap_id', authenticate, updateRoadmapModule);
// router.delete('/delete/:roadmap_id', authenticate, deleteRoadmapModule);

// // Resource routes
// router.post('/resources/add', authenticate, upload. single('file'), addResourceToModule);
// router.delete('/resources/delete/:resource_id', authenticate, deleteResourceFromModule);
// router.get('/resources/download/:resource_id', authenticate, getResourceFile);

// export default router;

// routes/roadmap.routes.js
import express from 'express';
<<<<<<< HEAD
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
=======
import { 
    getRoadmapByVenue, 
    createRoadmapModule, 
    updateRoadmapModule, 
    deleteRoadmapModule,
    addResourceToModule,
    deleteResourceFromModule,
    getResourceFile,
    upload
>>>>>>> f6f0180940778d359ee742a2e0f3b40fd85657f7
} from '../controllers/roadmap.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

<<<<<<< HEAD
// ============ STUDENT ENDPOINTS ============
// Get all roadmaps for a student
router.get('/student/:studentId', authenticate, getStudentRoadmaps);

// Get student's progress for a roadmap
router.get('/student/:studentId/progress/:roadmapId', authenticate, getStudentProgress);
=======
// Get roadmap for a venue
router.get('/:venue_id', authenticate, getRoadmapByVenue);

// Create new module
router.post('/', authenticate, createRoadmapModule);

// Update module
router.put('/:roadmap_id', authenticate, updateRoadmapModule);

// Delete module
router.delete('/:roadmap_id', authenticate, deleteRoadmapModule);

// Add resource to module (with file upload for PDFs)
router.post('/resources', authenticate, upload.single('file'), addResourceToModule);

// Delete resource
router.delete('/resources/:resource_id', authenticate, deleteResourceFromModule);

// Download resource file
router.get('/resources/:resource_id/download', authenticate, getResourceFile);
>>>>>>> f6f0180940778d359ee742a2e0f3b40fd85657f7

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

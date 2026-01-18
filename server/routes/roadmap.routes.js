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

export default router;
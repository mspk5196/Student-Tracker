import express from 'express';
import multer from 'multer';
import { 
  getAllVenues,
  createVenue,
  updateVenue,
  deleteVenue,
  assignFacultyToVenue,
  bulkUploadStudentsToVenue,
  allocateStudentsByRollRange,
  getVenueStudents,
  getVenueDetails,
  removeStudentFromVenue,
  getAllFacultiesForGroups,
    getAvailableFaculties,
  searchVenues
} from '../controllers/groups.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Multer configuration for Excel uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd. ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  }
});

// Venue routes
router.get('/venues', authenticate, getAllVenues);
router.get('/venues/search', authenticate, searchVenues);
router.get('/venues/:venueId/details', authenticate, getVenueDetails);
router.post('/venues', authenticate, createVenue);
router.put('/venues/:venueId', authenticate, updateVenue);
router.delete('/venues/:venueId', authenticate, deleteVenue);
router.put('/venues/:venueId/assign-faculty', authenticate, assignFacultyToVenue);

// Student allocation routes
router.post('/venues/:venueId/bulk-upload', authenticate, upload.single('file'), bulkUploadStudentsToVenue);
router.post('/venues/:venueId/allocate-range', authenticate, allocateStudentsByRollRange);
router.get('/venues/:venueId/students', authenticate, getVenueStudents);
router.delete('/venues/:venueId/students/:studentId', authenticate, removeStudentFromVenue);

// Faculty routes
router.get('/faculties', authenticate, getAllFacultiesForGroups);
router.get('/faculties/available', authenticate, getAvailableFaculties);

export default router;
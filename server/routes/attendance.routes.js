
import express from 'express';
import { 
  getVenueAllocations,
  getStudentsForVenue,
  getOrCreateSession,
  saveAttendance,
  getLateStudents,
  getStudentAttendanceHistory,
  getStudentAttendanceDashboard,
  testAttendance,
  getSessionAttendance
} from '../controllers/attendance.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Test route
router.get('/test', testAttendance);

// Define the routes - REMOVED facultyId and studentId from params
router.get('/venues', getVenueAllocations);  // Uses JWT to get user
router.get('/students/:venueId', getStudentsForVenue);
router.post('/session', getOrCreateSession);
router.get('/session/:sessionId/:venueId', getSessionAttendance);
router.post('/save', saveAttendance);
router.get('/late-students', getLateStudents);  // Uses JWT to get faculty
router.get('/history', getStudentAttendanceHistory);  // Uses JWT to get student
router.get('/dashboard', getStudentAttendanceDashboard);  // Uses JWT to get student

export default router;
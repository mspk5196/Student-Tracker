
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

// Define the routes
router.get('/venues/:facultyId', getVenueAllocations);
router.get('/students/:venueId', getStudentsForVenue);
router.post('/session', getOrCreateSession);
router.get('/session/:sessionId/:venueId', getSessionAttendance);
router.post('/save', saveAttendance);  // Make sure this is exactly '/save'
router.get('/late-students/:facultyId', getLateStudents);
router.get('/history/:studentId', getStudentAttendanceHistory);
router.get('/dashboard/:studentId', getStudentAttendanceDashboard);

export default router;
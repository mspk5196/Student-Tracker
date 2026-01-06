// import express from 'express';
// import { 
//   getVenueAllocations,
//   getStudentsForVenue,
//   getOrCreateSession,
//   saveAttendance,
//   getLateStudents,
//   getStudentAttendanceHistory
// } from '../controllers/attendance.controller.js';
// import { authenticate } from '../middleware/auth.middleware.js';

// const router = express.Router();

// // All routes are protected
// router.get('/venues/:facultyId', authenticate, getVenueAllocations);
// router.get('/students/:venueId/:facultyId', authenticate, getStudentsForVenue);
// router.post('/session', authenticate, getOrCreateSession);
// router.post('/save', authenticate, saveAttendance);
// router.get('/late-students/:facultyId', authenticate, getLateStudents);
// router.get('/history/:studentId', authenticate, getStudentAttendanceHistory);

// export default router;

// import express from 'express';
// import { 
//   getVenueAllocations,
//   getStudentsForVenue,
//   getOrCreateSession,
//   saveAttendance,
//   getLateStudents,
//   getStudentAttendanceHistory,
//   getStudentAttendanceDashboard
// } from '../controllers/attendance.controller.js';
// import { authenticate } from '../middleware/auth.middleware.js';

// const router = express.Router();

// // All routes are protected
// router.get('/venues/:facultyId', authenticate, getVenueAllocations);
// router.get('/students/:venueId', authenticate, getStudentsForVenue);
// router.post('/session', authenticate, getOrCreateSession);
// router.post('/save', authenticate, saveAttendance);
// router.get('/late-students/:facultyId', authenticate, getLateStudents);
// router.get('/history/:studentId', authenticate, getStudentAttendanceHistory);
// router.get('/dashboard/:studentId', authenticate, getStudentAttendanceDashboard);

// export default router;


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

// // Catch-all for undefined routes
// router.all('*', (req, res) => {
//   console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.method} ${req.originalUrl} not found`
//   });
// });

export default router;
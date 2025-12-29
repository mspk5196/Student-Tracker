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

import express from 'express';
import { 
  getVenueAllocations,
  getStudentsForVenue,
  getOrCreateSession,
  saveAttendance,
  getLateStudents,
  getStudentAttendanceHistory,
  getStudentAttendanceDashboard  // NEW
} from '../controllers/attendance.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.get('/venues/:facultyId', authenticate, getVenueAllocations);
router.get('/students/:venueId/:facultyId', authenticate, getStudentsForVenue);
router.post('/session', authenticate, getOrCreateSession);
router.post('/save', authenticate, saveAttendance);
router.get('/late-students/:facultyId', authenticate, getLateStudents);
router.get('/history/:studentId', authenticate, getStudentAttendanceHistory);
router.get('/dashboard/:studentId', authenticate, getStudentAttendanceDashboard);  // NEW

export default router;
import express from 'express';
import { 
  getVenueSkillSummary,
  getNotAttemptedStudents,
  getVenueStudentSkillStatus,
  getCourseWiseCompletion,
  getStudentSkillProgress,
  getVenueGroupsWithStats,
  getGroupSkillCompletion,
  getVenueCourses,
  exportSkillCompletionData,
  getSkillCompletionAnalytics
} from '../controllers/skillCompletionController.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * =====================================================
 * SKILL COMPLETION STATUS ROUTES
 * =====================================================
 * All routes require authentication
 * Base path: /api/skill-completion
 * =====================================================
 */

// ===== VENUE-LEVEL ROUTES =====

/**
 * GET /api/skill-completion/venues/:venueId/summary
 * Get skill completion summary for a venue
 * Query params: groupId (optional), courseFilter (optional)
 */
router.get('/venues/:venueId/summary', authenticate, getVenueSkillSummary);

/**
 * GET /api/skill-completion/venues/:venueId/not-attempted
 * Get students who haven't attempted any skill in the venue
 * Query params: groupId, page, limit, search
 */
router.get('/venues/:venueId/not-attempted', authenticate, getNotAttemptedStudents);

/**
 * GET /api/skill-completion/venues/:venueId/students
 * Get all students with their skill status in a venue
 * Query params: groupId, status, courseFilter, page, limit, search, sortBy, sortOrder
 */
router.get('/venues/:venueId/students', authenticate, getVenueStudentSkillStatus);

/**
 * GET /api/skill-completion/venues/:venueId/courses
 * Get course-wise completion breakdown for a venue
 * Query params: groupId
 */
router.get('/venues/:venueId/courses', authenticate, getCourseWiseCompletion);

/**
 * GET /api/skill-completion/venues/:venueId/course-list
 * Get list of courses available in a venue (for filters)
 */
router.get('/venues/:venueId/course-list', authenticate, getVenueCourses);

/**
 * GET /api/skill-completion/venues/:venueId/groups
 * Get all groups in a venue with their skill completion stats
 */
router.get('/venues/:venueId/groups', authenticate, getVenueGroupsWithStats);

/**
 * GET /api/skill-completion/venues/:venueId/analytics
 * Get analytics/charts data for skill completion
 * Query params: groupId, dateFrom, dateTo
 */
router.get('/venues/:venueId/analytics', authenticate, getSkillCompletionAnalytics);

/**
 * GET /api/skill-completion/venues/:venueId/export
 * Export skill completion data for a venue
 * Query params: groupId, status, courseFilter
 */
router.get('/venues/:venueId/export', authenticate, exportSkillCompletionData);

// ===== GROUP-LEVEL ROUTES =====

/**
 * GET /api/skill-completion/groups/:groupId
 * Get detailed skill completion for a specific group
 * Query params: status, courseFilter, page, limit, search
 */
router.get('/groups/:groupId', authenticate, getGroupSkillCompletion);

// ===== STUDENT-LEVEL ROUTES =====

/**
 * GET /api/skill-completion/students/:studentId
 * Get individual student's skill progress
 * Query params: venueId (optional - to filter by venue)
 */
router.get('/students/:studentId', authenticate, getStudentSkillProgress);

export default router;

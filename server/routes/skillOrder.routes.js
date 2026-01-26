// routes/skillOrder.routes.js
import express from 'express';
import {
  getSkillOrders,
  getSkillOrderForVenue,
  createSkillOrder,
  updateSkillOrder,
  reorderSkills,
  deleteSkillOrder,
  getStudentSkillProgression,
  getAvailableSkillNames
} from '../controllers/skillOrder.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// ============ PUBLIC ROUTES (Authenticated) ============

// Get all skill orders (with optional filters)
router.get('/', authenticate, getSkillOrders);

// Get available skill names (for dropdowns)
router.get('/available-skills', authenticate, getAvailableSkillNames);

// Get skill order for a specific venue (with fallback to global)
router.get('/venue/:venue_id', authenticate, getSkillOrderForVenue);

// Get student's skill progression status
router.get('/student/:student_id/progression', authenticate, getStudentSkillProgression);

// ============ ADMIN/FACULTY ROUTES ============

// Create new skill order entry
router.post('/', authenticate, createSkillOrder);

// Update skill order entry
router.put('/:id', authenticate, updateSkillOrder);

// Bulk reorder skills
router.put('/reorder/bulk', authenticate, reorderSkills);

// Delete skill order entry
router.delete('/:id', authenticate, deleteSkillOrder);

export default router;

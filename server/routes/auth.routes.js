import express from 'express';
import { googleAuth, getMe, logout } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/google', googleAuth);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;

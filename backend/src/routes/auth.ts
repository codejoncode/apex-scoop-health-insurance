import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Login — public
router.post('/login', authController.login);
// Me — authenticated
router.get('/me', authMiddleware, authController.me);
// Register — LOCKED: only an existing admin can create new users
router.post('/register', authMiddleware, authController.register);

export default router;

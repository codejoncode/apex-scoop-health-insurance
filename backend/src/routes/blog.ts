import { Router } from 'express';
import { blogController } from '../controllers/blogController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', blogController.getAll);
router.get('/:slug', blogController.getBySlug);

// Protected routes - admin only
router.post('/', authMiddleware, blogController.create);
router.patch('/:id', authMiddleware, blogController.update);
router.delete('/:id', authMiddleware, blogController.delete);

export default router;

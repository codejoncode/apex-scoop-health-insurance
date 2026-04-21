import { Router } from 'express';
import { leadsController } from '../controllers/leadsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public route - create lead
router.post('/', leadsController.create);

// Protected routes - admin only
router.get('/', authMiddleware, leadsController.getAll);
router.get('/stats', authMiddleware, leadsController.getStats);
router.get('/:id', authMiddleware, leadsController.getOne);
router.patch('/:id', authMiddleware, leadsController.updateStatus);
router.delete('/:id', authMiddleware, leadsController.delete);

export default router;

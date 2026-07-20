import { Router } from 'express';
import { getPages, getPageBySlug, createPage, updatePage, deletePage } from '../controllers/contentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getPages);
router.get('/:slug', getPageBySlug);

// Protected routes (Admin only)
router.post('/', authMiddleware, createPage);
router.put('/:id', authMiddleware, updatePage);
router.delete('/:id', authMiddleware, deletePage);

export default router;

import express from 'express';
import {
  getActiveBreakingNews,
  getAllBreakingNews,
  createBreakingNews,
  toggleBreakingNewsStatus,
  deleteBreakingNews,
} from '../controllers/breakingNewsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for active breaking news ticker
router.get('/active', getActiveBreakingNews);

// Protected staff routes (Admin, Editor, Journalist)
router.get('/', protect, authorize('Admin', 'Super Admin', 'Editor', 'Journalist'), getAllBreakingNews);
router.post('/', protect, authorize('Admin', 'Super Admin', 'Editor', 'Journalist'), createBreakingNews);
router.put('/:id/toggle', protect, authorize('Admin', 'Super Admin', 'Editor'), toggleBreakingNewsStatus);
router.delete('/:id', protect, authorize('Admin', 'Super Admin', 'Editor'), deleteBreakingNews);

export default router;

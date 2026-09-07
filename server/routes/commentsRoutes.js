import express from 'express';
import {
  createComment,
  getCommentsByNews,
  toggleLikeComment,
  reportComment,
  getPendingComments,
  moderateComment,
} from '../controllers/commentsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createComment); // Anyone can post comments
router.get('/news/:newsId', getCommentsByNews);
router.post('/id/:id/like', protect, toggleLikeComment);
router.post('/id/:id/report', reportComment);

// Moderator endpoints
router.get('/pending', protect, authorize('Editor', 'Admin', 'Super Admin'), getPendingComments);
router.post('/id/:id/moderate', protect, authorize('Editor', 'Admin', 'Super Admin'), moderateComment);

export default router;

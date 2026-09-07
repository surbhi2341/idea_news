import express from 'express';
import {
  createNews,
  getNewsList,
  getNewsBySlug,
  incrementViews,
  toggleLike,
  toggleDislike,
  updateNews,
  deleteNews,
  restoreNews,
  bulkUploadCSV,
} from '../controllers/newsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadNewsMedia, attachNewsFileUrls } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(
    protect,
    authorize('Journalist', 'Editor', 'Admin', 'Super Admin'),
    uploadNewsMedia,
    attachNewsFileUrls,
    createNews
  )
  .get(getNewsList);

router.get('/slug/:slug', getNewsBySlug);
router.post('/id/:id/views', incrementViews);
router.post('/id/:id/like', protect, toggleLike);
router.post('/id/:id/dislike', protect, toggleDislike);

router.route('/id/:id')
  .put(
    protect,
    authorize('Journalist', 'Editor', 'Admin', 'Super Admin'),
    uploadNewsMedia,
    attachNewsFileUrls,
    updateNews
  )
  .delete(protect, authorize('Journalist', 'Editor', 'Admin', 'Super Admin'), deleteNews);

router.post('/id/:id/restore', protect, authorize('Editor', 'Admin', 'Super Admin'), restoreNews);
router.post('/bulk-csv', protect, authorize('Editor', 'Admin', 'Super Admin'), bulkUploadCSV);

export default router;

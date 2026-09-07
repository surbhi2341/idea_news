import express from 'express';
import {
  createVideo,
  getVideos,
  incrementVideoViews,
  deleteVideo,
} from '../controllers/mediaController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadVideoFile } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/videos')
  .get(getVideos)
  .post(protect, authorize('Journalist', 'Editor', 'Admin', 'Super Admin'), uploadVideoFile, createVideo);

router.post('/videos/:id/views', incrementVideoViews);
router.delete('/videos/:id', protect, authorize('Editor', 'Admin', 'Super Admin'), deleteVideo);

export default router;

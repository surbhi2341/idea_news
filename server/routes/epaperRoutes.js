import express from 'express';
import { createEPaper, getEPapers, deleteEPaper } from '../controllers/epaperController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadEPaper } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getEPapers);

router.post(
  '/',
  protect,
  authorize('Editor', 'Admin', 'Super Admin'),
  uploadEPaper,
  createEPaper
);

router.delete('/:id', protect, authorize('Editor', 'Admin', 'Super Admin'), deleteEPaper);

export default router;

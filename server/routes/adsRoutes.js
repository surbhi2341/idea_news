import express from 'express';
import { createAd, getAdList, getActiveAds, trackView, trackClick, deleteAd } from '../controllers/adsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('Advertiser', 'Admin', 'Super Admin'), createAd)
  .get(protect, authorize('Advertiser', 'Admin', 'Super Admin'), getAdList);

router.get('/active', getActiveAds);
router.post('/id/:id/view', trackView);
router.post('/id/:id/click', trackClick);
router.delete('/id/:id', protect, authorize('Advertiser', 'Admin', 'Super Admin'), deleteAd);

export default router;

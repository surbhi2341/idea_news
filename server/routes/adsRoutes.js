import express from 'express';
import { createAd, getAdList, getActiveAds, trackView, trackClick, updateAd, deleteAd } from '../controllers/adsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Multer storage configuration for ad images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'ads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

router.post('/upload-image', protect, authorize('Advertiser', 'Admin', 'Super Admin'), upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const imageUrl = `/uploads/ads/${req.file.filename}`;
  res.json({ success: true, url: imageUrl });
});

router.route('/')
  .post(protect, authorize('Advertiser', 'Admin', 'Super Admin'), createAd)
  .get(protect, authorize('Advertiser', 'Admin', 'Super Admin'), getAdList);

router.get('/active', getActiveAds);
router.post('/id/:id/view', trackView);
router.post('/id/:id/click', trackClick);

router.route('/id/:id')
  .put(protect, authorize('Advertiser', 'Admin', 'Super Admin'), updateAd)
  .delete(protect, authorize('Advertiser', 'Admin', 'Super Admin'), deleteAd);

export default router;

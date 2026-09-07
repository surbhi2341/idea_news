import express from 'express';
import { generateHeadline, generateSummary, suggestTags, grammarCheck, detectDuplicate } from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Journalist', 'Editor', 'Admin', 'Super Admin'));

router.post('/headline', generateHeadline);
router.post('/summary', generateSummary);
router.post('/tags', suggestTags);
router.post('/grammar', grammarCheck);
router.post('/duplicate', detectDuplicate);

export default router;

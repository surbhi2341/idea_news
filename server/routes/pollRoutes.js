import express from 'express';
import { createPoll, getPolls, getActivePoll, votePoll, deletePoll } from '../controllers/pollController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('Editor', 'Admin', 'Super Admin'), createPoll)
  .get(getPolls);

router.get('/active', getActivePoll);
router.post('/id/:id/vote', votePoll); // Anyone can vote
router.delete('/id/:id', protect, authorize('Editor', 'Admin', 'Super Admin'), deletePoll);

export default router;

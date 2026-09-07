import express from 'express';
import {
  getUsers,
  updateUserRole,
  getSystemSettings,
  updateSystemSetting,
  getActivityLogs,
  getDashboardStats,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin', 'Super Admin'));

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.route('/settings')
  .get(getSystemSettings)
  .put(updateSystemSetting);
router.get('/logs', getActivityLogs);
router.get('/stats', getDashboardStats);

export default router;

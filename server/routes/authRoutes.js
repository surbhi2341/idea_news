import express from 'express';
import { register, login, sendOTP, verifyOTP, socialLoginMock, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);
router.post('/social-login', socialLoginMock);
router.get('/me', protect, getMe);

export default router;

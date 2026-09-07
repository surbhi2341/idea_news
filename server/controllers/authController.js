import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendSMS } from '../utils/smsService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'bharat_news_secret_key_123', {
    expiresIn: '30d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || (!email && !phone)) {
      return res.status(400).json({ success: false, message: 'Please provide a name and email or phone' });
    }

    if (email) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }
    }

    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ success: false, message: 'User with this phone already exists' });
      }
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'Reader',
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ success: false, message: 'Your account is suspended' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// OTP sending for mobile login or registration
export const sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Please provide a phone number' });
    }

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        name: `User_${phone.slice(-4)}`,
        phone,
        role: 'Reader',
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = {
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
    };

    await user.save();

    // Send SMS to the actual phone number via SMS service (Fast2SMS / 2Factor / Twilio / Console)
    await sendSMS(phone, otpCode);

    res.json({
      success: true,
      message: 'OTP has been sent to your mobile number',
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ success: false, message: 'Please provide phone and OTP code' });
    }

    const user = await User.findOne({ phone });
    if (!user || !user.otp || user.otp.code !== code || new Date() > user.otp.expiresAt) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Clear OTP on successful verify
    user.otp = undefined;
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Mock Social Logins
export const socialLoginMock = async (req, res, next) => {
  try {
    const { provider, name, email, id } = req.body;
    if (!provider || !id || !name) {
      return res.status(400).json({ success: false, message: 'Missing login parameters' });
    }

    let query = {};
    if (provider === 'google') query = { googleId: id };
    else if (provider === 'facebook') query = { facebookId: id };
    else return res.status(400).json({ success: false, message: 'Unsupported provider' });

    let user = await User.findOne(query);
    if (!user && email) {
      // Check if user exists with email, then link
      user = await User.findOne({ email });
      if (user) {
        if (provider === 'google') user.googleId = id;
        else user.facebookId = id;
        await user.save();
      }
    }

    if (!user) {
      // Create new user
      const createData = { name, role: 'Reader' };
      if (email) createData.email = email;
      if (provider === 'google') createData.googleId = id;
      else createData.facebookId = id;

      user = await User.create(createData);
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current profile
export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

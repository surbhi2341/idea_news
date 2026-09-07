import User from '../models/User.js';
import News from '../models/News.js';
import Comment from '../models/Comment.js';
import { Setting, ActivityLog } from '../models/System.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role, status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (status) user.status = status;
    await user.save();

    // Log this action
    await ActivityLog.create({
      user: req.user._id,
      action: 'UPDATE_USER',
      details: `Updated role/status of user ${user.email || user.phone} to role: ${user.role}, status: ${user.status}`,
      ipAddress: req.ip,
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getSystemSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find();
    // Reduce array to easy object
    const config = {};
    settings.forEach(s => {
      config[s.key] = s.value;
    });

    // Default fallbacks if empty
    if (!config.siteName) config.siteName = 'Bharat News';
    if (!config.contactEmail) config.contactEmail = 'info@bharatnews.in';
    if (!config.allowGuestComments) config.allowGuestComments = true;
    if (!config.premiumPlanPriceMonthly) config.premiumPlanPriceMonthly = 99;

    res.json({ success: true, settings: config });
  } catch (error) {
    next(error);
  }
};

export const updateSystemSetting = async (req, res, next) => {
  try {
    const { key, value, description } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, message: 'Please provide setting key' });
    }

    let setting = await Setting.findOne({ key });
    if (setting) {
      setting.value = value;
      if (description) setting.description = description;
      await setting.save();
    } else {
      setting = await Setting.create({ key, value, description });
    }

    res.json({ success: true, setting });
  } catch (error) {
    next(error);
  }
};

export const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalNews = await News.countDocuments();
    const totalComments = await Comment.countDocuments();

    // Sum total views
    const viewStats = await News.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = viewStats[0] ? viewStats[0].totalViews : 0;

    // News by category
    const categoryStats = await News.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, views: { $sum: '$views' } } }
    ]);

    // Active users by subscription
    const subscriptionStats = await User.aggregate([
      { $group: { _id: '$subscription.plan', count: { $sum: 1 } } }
    ]);

    // Daily publication volume (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailyStats = await News.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totals: {
          users: totalUsers,
          articles: totalNews,
          comments: totalComments,
          views: totalViews,
          revenue: totalUsers * 49, // mock revenue calculation
        },
        categoryStats,
        subscriptionStats,
        dailyPublications: dailyStats,
      }
    });
  } catch (error) {
    next(error);
  }
};

import BreakingNews from '../models/BreakingNews.js';

// @desc  Get active Breaking News items for public ticker
// @route GET /api/breaking-news/active
export const getActiveBreakingNews = async (req, res, next) => {
  try {
    const items = await BreakingNews.find({ isActive: true })
      .sort({ priority: -1, createdAt: -1 })
      .limit(10);
    res.json({ success: true, count: items.length, breakingNews: items });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all Breaking News items (Admin list)
// @route GET /api/breaking-news
export const getAllBreakingNews = async (req, res, next) => {
  try {
    const items = await BreakingNews.find()
      .sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, breakingNews: items });
  } catch (error) {
    next(error);
  }
};

// @desc  Create Breaking News item
// @route POST /api/breaking-news
export const createBreakingNews = async (req, res, next) => {
  try {
    const { title, titleEn, link, isActive, priority } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Headline title is required' });
    }

    const item = await BreakingNews.create({
      title,
      titleEn: titleEn || '',
      link: link || '',
      isActive: isActive !== undefined ? isActive : true,
      priority: priority || 1,
      createdBy: req.user?._id,
    });

    // Push socket event if Socket.IO is initialized on app
    const io = req.app.get('io');
    if (io) {
      io.emit('breaking_news', item);
    }

    res.status(201).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

// @desc  Toggle active status of Breaking News
// @route PUT /api/breaking-news/:id/toggle
export const toggleBreakingNewsStatus = async (req, res, next) => {
  try {
    const item = await BreakingNews.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Breaking news item not found' });
    }

    item.isActive = !item.isActive;
    await item.save();

    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete Breaking News item
// @route DELETE /api/breaking-news/:id
export const deleteBreakingNews = async (req, res, next) => {
  try {
    const item = await BreakingNews.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Breaking news item not found' });
    }

    res.json({ success: true, message: 'Breaking news deleted successfully' });
  } catch (error) {
    next(error);
  }
};

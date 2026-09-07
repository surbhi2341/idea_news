import News from '../models/News.js';
import User from '../models/User.js';
import { emitNewsViewUpdate } from '../sockets/socketHandler.js';

// Helper to create slugs
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
};

export const createNews = async (req, res, next) => {
  try {
    const { title, subtitle, content, category, subcategory, state, city, district, tags, image, videoUrl, scheduledPublishAt, breakingNews, editorsPick, featuredStory, isPremium, seoTitle, seoDescription, seoKeywords } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ success: false, message: 'Please provide a title, content, and category' });
    }

    const slug = generateSlug(title);

    // If reporter is admin/editor, status can be Published, otherwise Draft/Pending
    let status = 'Pending';
    if (req.user.role === 'Admin' || req.user.role === 'Super Admin' || req.user.role === 'Editor') {
      status = scheduledPublishAt ? 'Draft' : 'Published';
    }

    const news = await News.create({
      title,
      subtitle,
      slug,
      content,
      category,
      subcategory,
      state,
      city,
      district,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      image,
      videoUrl,
      reporter: req.user._id,
      status,
      scheduledPublishAt,
      breakingNews: !!breakingNews,
      editorsPick: !!editorsPick,
      featuredStory: !!featuredStory,
      isPremium: !!isPremium,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || content.substring(0, 150),
      seoKeywords,
    });

    res.status(201).json({ success: true, news });
  } catch (error) {
    next(error);
  }
};

export const getNewsList = async (req, res, next) => {
  try {
    const { category, subcategory, state, city, status, search, limit = 12, page = 1, breaking, featured, editors, keyword, sortBy = 'createdAt' } = req.query;

    const query = {};

    // Filter statuses. Guest/Reader should only see 'Published'
    if (req.user && ['Admin', 'Super Admin', 'Editor', 'Journalist'].includes(req.user.role)) {
      query.status = status || 'Published';
    } else {
      query.status = 'Published';
    }

    if (category) {
      const catLower = category.toLowerCase().trim();
      if (catLower === 'bollywood' || catLower === 'entertainment') {
        query.category = { $in: ['Bollywood', 'Entertainment'] };
      } else if (catLower === 'jeevan mantra' || catLower === 'astrology') {
        query.category = { $in: ['Jeevan Mantra', 'Astrology'] };
      } else if (catLower === 'world' || catLower === 'international') {
        query.category = { $in: ['World', 'International'] };
      } else if (catLower === 'job - education' || catLower === 'education' || catLower === 'job-education') {
        query.category = { $in: ['Job - Education', 'Education'] };
      } else if (catLower === 'db original' || catLower === 'opinion') {
        query.category = { $in: ['DB Original', 'Opinion'] };
      } else if (catLower === 'special' || catLower === 'khas') {
        query.category = { $in: ['Special', 'Khas'] };
      } else {
        query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
      }
    }
    if (subcategory) query.subcategory = subcategory;
    if (state) query.state = state;
    if (city) query.city = city;

    if (breaking === 'true') query.breakingNews = true;
    if (featured === 'true') query.featuredStory = true;
    if (editors === 'true') query.editorsPick = true;

    // Search filter
    if (search || keyword) {
      const searchVal = search || keyword;
      query.$or = [
        { title: { $regex: searchVal, $options: 'i' } },
        { content: { $regex: searchVal, $options: 'i' } },
        { tags: { $regex: searchVal, $options: 'i' } }
      ];
    }

    const skipCount = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort logic
    let sortObj = { createdAt: -1 };
    if (sortBy === 'views') sortObj = { views: -1 };
    else if (sortBy === 'likes') sortObj = { 'likes.length': -1 };

    const newsList = await News.find(query)
      .populate('reporter', 'name role')
      .sort(sortObj)
      .skip(skipCount)
      .limit(parseInt(limit));

    const total = await News.countDocuments(query);

    res.json({
      success: true,
      count: newsList.length,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      news: newsList,
    });
  } catch (error) {
    next(error);
  }
};

export const getNewsBySlug = async (req, res, next) => {
  try {
    const news = await News.findOne({ slug: req.params.slug }).populate('reporter', 'name role');
    if (!news) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Check permissions if not published
    if (news.status !== 'Published') {
      if (!req.user || !['Admin', 'Super Admin', 'Editor', 'Journalist'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'You are not authorized to view this draft' });
      }
    }

    res.json({ success: true, news });
  } catch (error) {
    next(error);
  }
};

export const incrementViews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if (!news) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const io = req.app.get('io');
    if (io) {
      emitNewsViewUpdate(io, news._id.toString(), news.slug, news.views);
    }

    res.json({ success: true, views: news.views });
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const hasLiked = news.likes.includes(req.user._id);
    if (hasLiked) {
      news.likes = news.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      news.likes.push(req.user._id);
      // Remove from dislikes if present
      news.dislikes = news.dislikes.filter((id) => id.toString() !== req.user._id.toString());
    }

    await news.save();
    res.json({ success: true, likesCount: news.likes.length, dislikesCount: news.dislikes.length, hasLiked: !hasLiked });
  } catch (error) {
    next(error);
  }
};

export const toggleDislike = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const hasDisliked = news.dislikes.includes(req.user._id);
    if (hasDisliked) {
      news.dislikes = news.dislikes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      news.dislikes.push(req.user._id);
      // Remove from likes if present
      news.likes = news.likes.filter((id) => id.toString() !== req.user._id.toString());
    }

    await news.save();
    res.json({ success: true, likesCount: news.likes.length, dislikesCount: news.dislikes.length, hasDisliked: !hasDisliked });
  } catch (error) {
    next(error);
  }
};

export const updateNews = async (req, res, next) => {
  try {
    let news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Only creator or Editors/Admins can edit
    if (news.reporter.toString() !== req.user._id.toString() && !['Admin', 'Super Admin', 'Editor'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this article' });
    }

    // Keep same slug or regenerate if title changes
    if (req.body.title && req.body.title !== news.title) {
      req.body.slug = generateSlug(req.body.title);
    }

    news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.json({ success: true, news });
  } catch (error) {
    next(error);
  }
};

export const deleteNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    if (news.reporter.toString() !== req.user._id.toString() && !['Admin', 'Super Admin', 'Editor'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this article' });
    }

    // Soft delete by setting status to Archived
    news.status = 'Archived';
    await news.save();

    res.json({ success: true, message: 'Article soft-deleted/archived successfully' });
  } catch (error) {
    next(error);
  }
};

export const restoreNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    if (!['Admin', 'Super Admin', 'Editor'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to restore articles' });
    }

    news.status = 'Draft';
    await news.save();

    res.json({ success: true, message: 'Article restored to draft status' });
  } catch (error) {
    next(error);
  }
};

// Simulated CSV Bulk Upload Parser
export const bulkUploadCSV = async (req, res, next) => {
  try {
    if (!req.body.csvData) {
      return res.status(400).json({ success: false, message: 'Please provide csvData string' });
    }

    // Expected simple format: title,content,category,state,city
    const rows = req.body.csvData.split('\n');
    const createdNews = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue;
      
      const [title, content, category, state, city] = row.split(',').map(s => s.trim());
      if (title && content && category) {
        const slug = generateSlug(title);
        const news = await News.create({
          title,
          content,
          slug,
          category,
          state: state || '',
          city: city || '',
          reporter: req.user._id,
          status: 'Published'
        });
        createdNews.push(news);
      }
    }

    res.json({ success: true, count: createdNews.length, newsList: createdNews });
  } catch (error) {
    next(error);
  }
};

// Scheduler triggers: publish items whose publish time has arrived
export const checkScheduledPublish = async () => {
  try {
    const now = new Date();
    const result = await News.updateMany(
      { status: 'Draft', scheduledPublishAt: { $lte: now } },
      { $set: { status: 'Published', scheduledPublishAt: null } }
    );
    if (result.modifiedCount > 0) {
      console.log(`[CRON] Published ${result.modifiedCount} scheduled news articles.`);
    }
  } catch (error) {
    console.error(`Scheduled publication error: ${error.message}`);
  }
};

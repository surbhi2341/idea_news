import { Video } from '../models/Media.js';

// @desc  Journalist/Editor/Admin uploads a video
// @route POST /api/media/videos
export const createVideo = async (req, res, next) => {
  try {
    const { title, description, type, category } = req.body;

    if (!req.file && !req.body.url) {
      return res.status(400).json({ success: false, message: 'Video file or URL is required' });
    }
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const url = req.file ? `/uploads/videos/${req.file.filename}` : req.body.url;

    const video = await Video.create({
      title,
      description,
      url,
      type: type || 'NewsVideo',
      category: category || 'General',
      reporter: req.user._id,
    });

    res.status(201).json({ success: true, video });
  } catch (error) {
    next(error);
  }
};

// @desc  Public list of videos (latest first, optional type filter)
// @route GET /api/media/videos
export const getVideos = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const videos = await Video.find(filter).sort({ createdAt: -1 }).limit(60);
    res.json({ success: true, videos });
  } catch (error) {
    next(error);
  }
};

// @desc  Increment view count
// @route POST /api/media/videos/:id/views
export const incrementVideoViews = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete a video
// @route DELETE /api/media/videos/:id
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    next(error);
  }
};

import Advertisement from '../models/Advertisement.js';

export const createAd = async (req, res, next) => {
  try {
    const ad = await Advertisement.create(req.body);
    res.status(201).json({ success: true, ad });
  } catch (error) {
    next(error);
  }
};

export const getAdList = async (req, res, next) => {
  try {
    const ads = await Advertisement.find().sort({ createdAt: -1 });
    res.json({ success: true, ads });
  } catch (error) {
    next(error);
  }
};

export const getActiveAds = async (req, res, next) => {
  try {
    const now = new Date();
    const ads = await Advertisement.find({
      status: 'Active',
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
    res.json({ success: true, ads });
  } catch (error) {
    next(error);
  }
};

export const trackView = async (req, res, next) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Ad campaign not found' });
    }
    res.json({ success: true, views: ad.views });
  } catch (error) {
    next(error);
  }
};

export const trackClick = async (req, res, next) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } }, { new: true });
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Ad campaign not found' });
    }
    res.json({ success: true, clicks: ad.clicks });
  } catch (error) {
    next(error);
  }
};

export const updateAd = async (req, res, next) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }
    res.json({ success: true, ad });
  } catch (error) {
    next(error);
  }
};

export const deleteAd = async (req, res, next) => {
  try {
    const ad = await Advertisement.findByIdAndDelete(req.params.id);
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }
    res.json({ success: true, message: 'Ad campaign deleted' });
  } catch (error) {
    next(error);
  }
};

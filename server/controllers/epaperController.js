import EPaper from '../models/EPaper.js';

// @desc  Admin/Editor uploads a new e-paper issue
// @route POST /api/epaper
export const createEPaper = async (req, res, next) => {
  try {
    const { edition, date } = req.body;

    if (!req.files?.pdf?.[0]) {
      return res.status(400).json({ success: false, message: 'PDF file is required' });
    }
    if (!edition) {
      return res.status(400).json({ success: false, message: 'Edition name is required' });
    }

    const pdfUrl = `/uploads/epapers/${req.files.pdf[0].filename}`;
    const coverImage = req.files?.coverImage?.[0]
      ? `/uploads/images/${req.files.coverImage[0].filename}`
      : undefined;

    const epaper = await EPaper.create({
      edition,
      date: date ? new Date(date) : new Date(),
      pdfUrl,
      coverImage,
      uploadedBy: req.user._id,
    });

    res.status(201).json({ success: true, epaper });
  } catch (error) {
    next(error);
  }
};

// @desc  Public list of e-paper issues (latest first)
// @route GET /api/epaper
export const getEPapers = async (req, res, next) => {
  try {
    const epapers = await EPaper.find().sort({ date: -1 }).limit(60);
    res.json({ success: true, epapers });
  } catch (error) {
    next(error);
  }
};

// @desc  Admin deletes an e-paper issue
// @route DELETE /api/epaper/:id
export const deleteEPaper = async (req, res, next) => {
  try {
    const epaper = await EPaper.findByIdAndDelete(req.params.id);
    if (!epaper) {
      return res.status(404).json({ success: false, message: 'E-Paper not found' });
    }
    res.json({ success: true, message: 'E-Paper deleted' });
  } catch (error) {
    next(error);
  }
};

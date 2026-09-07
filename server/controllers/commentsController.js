import Comment from '../models/Comment.js';

export const createComment = async (req, res, next) => {
  try {
    const { newsId, content, parentCommentId, guestName } = req.body;

    if (!newsId || !content) {
      return res.status(400).json({ success: false, message: 'Please provide newsId and comment content' });
    }

    const commentData = {
      news: newsId,
      content,
      parentComment: parentCommentId || null,
    };

    if (req.user) {
      commentData.user = req.user._id;
    } else {
      commentData.guestName = guestName || 'Guest Reader';
    }

    const comment = await Comment.create(commentData);
    const populated = await Comment.findById(comment._id).populate('user', 'name role');

    res.status(201).json({ success: true, comment: populated });
  } catch (error) {
    next(error);
  }
};

export const getCommentsByNews = async (req, res, next) => {
  try {
    const { newsId } = req.params;
    const comments = await Comment.find({ news: newsId, status: 'Approved' })
      .populate('user', 'name role')
      .sort({ createdAt: -1 });

    // Threading logic
    const roots = [];
    const childrenMap = {};

    comments.forEach(comment => {
      if (comment.parentComment) {
        const parentId = comment.parentComment.toString();
        if (!childrenMap[parentId]) {
          childrenMap[parentId] = [];
        }
        childrenMap[parentId].push(comment);
      } else {
        roots.push(comment);
      }
    });

    res.json({ success: true, comments: roots, replies: childrenMap });
  } catch (error) {
    next(error);
  }
};

export const toggleLikeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const hasLiked = comment.likes.includes(req.user._id);
    if (hasLiked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      comment.likes.push(req.user._id);
    }

    await comment.save();
    res.json({ success: true, likesCount: comment.likes.length, hasLiked: !hasLiked });
  } catch (error) {
    next(error);
  }
};

export const reportComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { reportsCount: 1 } },
      { new: true }
    );
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    res.json({ success: true, reportsCount: comment.reportsCount });
  } catch (error) {
    next(error);
  }
};

export const getPendingComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ reportsCount: { $gt: 0 } })
      .populate('user', 'name role')
      .populate('news', 'title slug');
    res.json({ success: true, comments });
  } catch (error) {
    next(error);
  }
};

export const moderateComment = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected', 'Spam'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid comment status' });
    }

    const comment = await Comment.findByIdAndUpdate(req.params.id, { status, reportsCount: 0 }, { new: true });
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    res.json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};

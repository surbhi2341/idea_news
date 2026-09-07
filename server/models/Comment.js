import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    news: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'News',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // If authenticated
    },
    guestName: {
      type: String, // If Guest user
      trim: true,
      default: function() {
        return this.user ? undefined : 'Guest Reader';
      },
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Spam'],
      default: 'Approved', // Auto-approve by default, editable in moderation
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reportsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;

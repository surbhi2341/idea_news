import mongoose from 'mongoose';

const WebStorySlideSchema = new mongoose.Schema({
  mediaUrl: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  heading: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  ctaLink: {
    type: String,
    trim: true,
  },
});

const WebStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    slides: [WebStorySlideSchema],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const WebStory = mongoose.model('WebStory', WebStorySchema);
export default WebStory;

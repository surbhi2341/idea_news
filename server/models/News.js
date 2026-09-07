import mongoose from 'mongoose';

const LiveUpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String, // AI Generated Summary
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    image: {
      type: String, // Cover image URL
    },
    videoUrl: {
      type: String, // Optional video link (YouTube/mp4)
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Pending', 'Published', 'Archived'],
      default: 'Draft',
    },
    breakingNews: {
      type: Boolean,
      default: false,
    },
    editorsPick: {
      type: Boolean,
      default: false,
    },
    featuredStory: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    shareCount: {
      type: Number,
      default: 0,
    },
    liveUpdates: [LiveUpdateSchema], // For minute-by-minute live blog updates
    scheduledPublishAt: {
      type: Date,
    },
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
    seoKeywords: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search indexes
NewsSchema.index({ title: 'text', content: 'text', category: 'text', tags: 'text', state: 'text', city: 'text' });

const News = mongoose.model('News', NewsSchema);
export default News;

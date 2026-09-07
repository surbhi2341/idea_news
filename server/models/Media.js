import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    url: {
      type: String, // YouTube embed link, MP4 link, or Live stream stream URL
      required: true,
    },
    type: {
      type: String,
      enum: ['LiveTV', 'ShortVideo', 'NewsVideo'],
      default: 'NewsVideo',
    },
    category: {
      type: String,
      default: 'General',
    },
    views: {
      type: Number,
      default: 0,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model('Video', VideoSchema);

const PhotoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Photo = mongoose.model('Photo', PhotoSchema);

export { Video, Photo };

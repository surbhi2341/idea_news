import mongoose from 'mongoose';

const AdvertisementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    advertiser: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Banner', 'Sidebar', 'Popup', 'Video', 'Native'],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Expired'],
      default: 'Active',
    },
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Advertisement = mongoose.model('Advertisement', AdvertisementSchema);
export default Advertisement;

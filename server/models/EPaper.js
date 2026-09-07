import mongoose from 'mongoose';

const EPaperSchema = new mongoose.Schema(
  {
    edition: {
      type: String,
      required: true,
      trim: true, // e.g. "National Edition", "Uttar Pradesh Edition"
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

EPaperSchema.index({ date: -1 });

const EPaper = mongoose.model('EPaper', EPaperSchema);
export default EPaper;

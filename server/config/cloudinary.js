import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// ─── Storage Configs ───────────────────────────────────────────────────────────

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ideaciti/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ideaciti/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'webm', 'ogg', 'mov'],
  },
});

const epaperPdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ideaciti/epapers',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
  },
});

// ─── Multer Upload Instances ────────────────────────────────────────────────────

export const uploadImage = multer({ storage: imageStorage });
export const uploadVideo = multer({ storage: videoStorage });

// For e-paper: pdf (raw) + coverImage (image) - handled via separate fields
const epaperStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === 'pdf' || file.mimetype === 'application/pdf') {
      return { folder: 'ideaciti/epapers', resource_type: 'raw', allowed_formats: ['pdf'] };
    }
    return { folder: 'ideaciti/images', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] };
  },
});

export const uploadEPaperCloud = multer({ storage: epaperStorage });

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_ROOT = path.join(__dirname, '..', 'uploads');

// ─── Decide whether to use Cloudinary ──────────────────────────────────────────
const USE_CLOUDINARY = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

let imageStorage, videoStorage, epaperStorage;

if (USE_CLOUDINARY) {
  // ── Cloudinary Storage ─────────────────────────────────────────────────────
  const { v2 as cloudinary } = await import('cloudinary');
  const { CloudinaryStorage } = await import('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'ideaciti/images',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });

  videoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'ideaciti/videos',
      resource_type: 'video',
      allowed_formats: ['mp4', 'webm', 'ogg', 'mov'],
    },
  });

  epaperStorage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      if (file.fieldname === 'pdf' || file.mimetype === 'application/pdf') {
        return {
          folder: 'ideaciti/epapers',
          resource_type: 'raw',
          allowed_formats: ['pdf'],
        };
      }
      return {
        folder: 'ideaciti/images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      };
    },
  });

} else {
  // ── Local Disk Storage (fallback for local dev) ────────────────────────────
  ['images', 'videos', 'epapers'].forEach((folder) => {
    const dir = path.join(UPLOAD_ROOT, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const safeName = (originalname) => {
    const ext = path.extname(originalname);
    const base = path.basename(originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 40);
    return `${base}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  };

  imageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(UPLOAD_ROOT, 'images')),
    filename: (req, file, cb) => cb(null, safeName(file.originalname)),
  });

  videoStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(UPLOAD_ROOT, 'videos')),
    filename: (req, file, cb) => cb(null, safeName(file.originalname)),
  });

  epaperStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = (file.fieldname === 'pdf' || file.mimetype === 'application/pdf')
        ? 'epapers'
        : 'images';
      cb(null, path.join(UPLOAD_ROOT, folder));
    },
    filename: (req, file, cb) => cb(null, safeName(file.originalname)),
  });
}

// ─── Helper: get URL from uploaded file ────────────────────────────────────────
// Cloudinary returns file.path (full URL). Local disk returns just filename.
export const getUploadUrl = (file, subfolder = 'images') => {
  if (!file) return undefined;
  // Cloudinary provides a full https:// URL in file.path
  if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) {
    return file.path;
  }
  // Local disk: build relative path
  return `/uploads/${subfolder}/${file.filename}`;
};

const fileFilter = (req, file, cb) => {
  const allowed = {
    image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    video: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    pdf: ['application/pdf'],
  };
  if (file.fieldname === 'image' && allowed.image.includes(file.mimetype)) return cb(null, true);
  if (file.fieldname === 'video' && allowed.video.includes(file.mimetype)) return cb(null, true);
  if (file.fieldname === 'coverImage' && allowed.image.includes(file.mimetype)) return cb(null, true);
  if (file.fieldname === 'pdf' && allowed.pdf.includes(file.mimetype)) return cb(null, true);
  cb(new Error(`Invalid file type for field "${file.fieldname}": ${file.mimetype}`));
};

const newsUpload = multer({
  storage: imageStorage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB for images/news
});

const videoUpload = multer({
  storage: videoStorage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB for videos
});

const epaperUpload = multer({
  storage: epaperStorage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for PDFs
});

// ─── Exported Middlewares ───────────────────────────────────────────────────────
export const uploadNewsMedia = newsUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

export const uploadVideoFile = videoUpload.single('video');

export const uploadEPaper = epaperUpload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
]);

// Attaches uploaded file URLs to req.body for controllers
export const attachNewsFileUrls = (req, res, next) => {
  if (req.files?.image?.[0]) {
    req.body.image = getUploadUrl(req.files.image[0], 'images');
  }
  if (req.files?.video?.[0]) {
    req.body.videoUrl = getUploadUrl(req.files.video[0], 'videos');
  }
  next();
};

export default newsUpload;

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_ROOT = path.join(__dirname, '..', 'uploads');

// Make sure target folders exist
['images', 'videos', 'epapers'].forEach((folder) => {
  const dir = path.join(UPLOAD_ROOT, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const safeName = (originalname) => {
  const ext = path.extname(originalname);
  const base = path.basename(originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 40);
  return `${base}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'images';
    if (file.fieldname === 'video' || file.mimetype.startsWith('video/')) folder = 'videos';
    if (file.fieldname === 'pdf' || file.mimetype === 'application/pdf') folder = 'epapers';
    cb(null, path.join(UPLOAD_ROOT, folder));
  },
  filename: (req, file, cb) => cb(null, safeName(file.originalname)),
});

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

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB cap (covers video files)
});

// Reusable middlewares
export const uploadNewsMedia = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

export const uploadVideoFile = upload.single('video');

export const uploadEPaper = upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
]);

// Turns req.files into plain URL fields on req.body so controllers
// don't need to know anything about multer.
export const attachNewsFileUrls = (req, res, next) => {
  if (req.files?.image?.[0]) {
    req.body.image = `/uploads/images/${req.files.image[0].filename}`;
  }
  if (req.files?.video?.[0]) {
    req.body.videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
  }
  next();
};

export default upload;

import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { registerSocketHandlers } from './sockets/socketHandler.js';
import { startCronJobs } from './cron/scheduler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';
import adsRoutes from './routes/adsRoutes.js';
import pollRoutes from './routes/pollRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import epaperRoutes from './routes/epaperRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import breakingNewsRoutes from './routes/breakingNewsRoutes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

registerSocketHandlers(io);

// Expose io on app context so controllers can use it
app.set('io', io);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // allow inline scripts for quick developer viewing
}));
app.use(xss());
app.use(cors());

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files (images/videos/e-papers)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // max 300 requests per window
  message: 'Too many requests from this IP, please try again later',
});
app.use('/api', limiter);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/epaper', epaperRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/breaking-news', breakingNewsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Ideaciti News Portal API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start Cron Jobs
startCronJobs();

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`[Server] running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

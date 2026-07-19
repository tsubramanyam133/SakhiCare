import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { errorHandler } from './api/middlewares/errorHandler';
import authRoutes from './api/routes/auth/auth.routes';
import trackerRoutes from './api/routes/tracker.routes';
import schemeRoutes from './api/routes/scheme.routes';
import videoRoutes from './api/routes/video.routes';
import doctorRoutes from './api/routes/doctor.routes';

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

import aiRoutes from './api/routes/ai.routes';

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tracker', trackerRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/schemes', schemeRoutes);
app.use('/api/v1/videos', videoRoutes);
app.use('/api/v1/doctors', doctorRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;

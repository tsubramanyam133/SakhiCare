import { Router } from 'express';
import { createVideo, getVideos, updateVideo, deleteVideo } from '../controllers/video.controller';

const router = Router();

// Public routes
router.get('/', getVideos);

// Protected routes (Assuming no auth middleware for hackathon video upload)
router.post('/', createVideo);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

export default router;

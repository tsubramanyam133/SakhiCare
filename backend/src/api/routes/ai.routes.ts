import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authGuard } from '../middlewares/authGuard';

const router = Router();

router.post('/chat', AIController.chat);
router.get('/tts', AIController.tts);

export default router;

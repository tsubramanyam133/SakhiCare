import { Router } from 'express';
import { TrackerController } from '../controllers/tracker.controller';
import { authGuard } from '../middlewares/authGuard';

const router = Router();

router.post('/cycles', authGuard, TrackerController.logCycle);
router.get('/cycles', authGuard, TrackerController.getCycles);

export default router;

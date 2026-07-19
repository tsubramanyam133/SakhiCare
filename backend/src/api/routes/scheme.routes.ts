import { Router } from 'express';
import { SchemeController } from '../controllers/scheme.controller';
import { authGuard } from '../middlewares/authGuard';
import { roleGuard } from '../middlewares/roleGuard';
import { Role } from '../../models/User';

const router = Router();

router.get('/', SchemeController.getAllSchemes);

// Protected routes (Admin only)
router.post('/', authGuard, roleGuard([Role.ADMIN]), SchemeController.createScheme);
router.put('/:id', authGuard, roleGuard([Role.ADMIN]), SchemeController.updateScheme);

export default router;

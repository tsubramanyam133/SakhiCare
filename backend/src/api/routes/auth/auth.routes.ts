import { Router } from 'express';
import { AuthController } from '../../controllers/auth/auth.controller';
import { authGuard } from '../../middlewares/authGuard';

const router = Router();

router.post('/register', AuthController.register);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', authGuard, AuthController.logout);

export default router;

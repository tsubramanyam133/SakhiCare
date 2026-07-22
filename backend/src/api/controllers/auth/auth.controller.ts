import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthRequest } from '../../middlewares/authGuard';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, phoneNumber, name } = req.body;
      const user = await AuthService.register(email, password, phoneNumber, name);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  static async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const { accessToken, refreshToken, user } = await AuthService.verifyOTP(email, otp);
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({ success: true, accessToken, user });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, phone, phoneNumber, identifier, password } = req.body;
      const loginId = identifier || email || phone || phoneNumber;
      const { accessToken, refreshToken, user } = await AuthService.login(loginId, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({ success: true, accessToken, user });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Refresh token not found' });
      }

      const newTokens = await AuthService.refreshToken(refreshToken);
      
      res.cookie('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({ success: true, accessToken: newTokens.accessToken });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (req.user && refreshToken) {
        await AuthService.logout(req.user.userId, refreshToken);
      }
      res.clearCookie('refreshToken');
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
}

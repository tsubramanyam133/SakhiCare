import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { User, Role } from '../../models/User';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: Role;
  };
}

export const authGuard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized: No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: Role };
    
    // Check if user still exists
    const user = await User.findById(decoded.userId).select('_id status');
    
    if (!user) {
      throw new AppError('Unauthorized: User no longer exists', 401);
    }

    if (user.status !== 'active') {
      throw new AppError('Unauthorized: User account is suspended or banned', 403);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Unauthorized: Token expired', 401));
    } else {
      next(error);
    }
  }
};

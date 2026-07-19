import { Response, NextFunction } from 'express';
import { AuthRequest } from './authGuard';
import { AppError } from '../../utils/AppError';
import { Role } from '../../models/User';

export const roleGuard = (allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized: No user attached to request', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden: You do not have permission', 403));
    }

    next();
  };
};

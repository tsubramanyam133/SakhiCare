import { Request, Response, NextFunction } from 'express';
import { TrackerService } from '../../services/tracker.service';
import { AppError } from '../../utils/AppError';

export class TrackerController {
  static async logCycle(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, cycleLength, periodLength } = req.body;
      const userId = (req as any).user?.userId || (req as any).user?.id || 'demo-user-id';

      if (!startDate) {
        throw new AppError('Start date is required', 400);
      }

      const cycle = await TrackerService.logCycle(userId, new Date(startDate), cycleLength, periodLength);
      
      res.status(201).json({
        success: true,
        data: cycle
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCycles(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id;
      const data = await TrackerService.getCycles(userId);
      
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}

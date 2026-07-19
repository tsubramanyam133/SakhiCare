import { CycleTracking } from '../models/CycleTracking';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { EmailService } from './email.service';

export class TrackerService {
  /**
   * Log a new menstrual cycle
   */
  static async logCycle(userId: string, startDate: Date, cycleLength: number = 28, periodLength: number = 5) {
    // Calculate predicted next period based on averages
    const predictedNextPeriod = new Date(startDate);
    predictedNextPeriod.setDate(predictedNextPeriod.getDate() + cycleLength);

    const newCycle = await CycleTracking.create({
      userId,
      startDate,
      cycleLength,
      periodLength,
      predictedNextPeriod,
    });

    // Send AI Prediction Email
    try {
      const user = await User.findById(userId);
      if (user && user.email) {
        // High ovulation day is generally 14 days before the next period
        const ovulationDate = new Date(predictedNextPeriod);
        ovulationDate.setDate(ovulationDate.getDate() - 14);

        // We don't await this so it doesn't block the API response
        EmailService.sendCyclePredictionEmail(user.email, predictedNextPeriod, ovulationDate).catch(console.error);
      }
    } catch (e) {
      console.error('Failed to trigger cycle prediction email', e);
    }

    return newCycle;
  }

  /**
   * Get cycle history and predictions for a user
   */
  static async getCycles(userId: string) {
    const cycles = await CycleTracking.find({ userId }).sort({ startDate: -1 }).limit(12);
    
    // Calculate average cycle length dynamically if enough data points
    let avgCycleLength = 28;
    if (cycles.length > 1) {
       const sum = cycles.reduce((acc: number, curr: any) => acc + curr.cycleLength, 0);
       avgCycleLength = Math.round(sum / cycles.length);
    }

    // Determine next period from the most recent cycle
    let nextPredictedDate = null;
    let ovulationWindowStart = null;
    let ovulationWindowEnd = null;

    if (cycles.length > 0) {
      const lastCycle = cycles[0];
      nextPredictedDate = new Date(lastCycle.startDate);
      nextPredictedDate.setDate(nextPredictedDate.getDate() + avgCycleLength);

      // Ovulation usually occurs 14 days before the next period
      ovulationWindowStart = new Date(nextPredictedDate);
      ovulationWindowStart.setDate(ovulationWindowStart.getDate() - 16);
      
      ovulationWindowEnd = new Date(nextPredictedDate);
      ovulationWindowEnd.setDate(ovulationWindowEnd.getDate() - 12);
    }

    return {
      history: cycles,
      insights: {
        avgCycleLength,
        nextPredictedDate,
        ovulationWindow: {
          start: ovulationWindowStart,
          end: ovulationWindowEnd
        }
      }
    };
  }
}

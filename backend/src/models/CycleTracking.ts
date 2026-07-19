import mongoose, { Schema, Document } from 'mongoose';
import * as mongooseLib from 'mongoose';

export interface ICycleTracking extends mongooseLib.Document {
  userId: mongooseLib.Types.ObjectId;
  startDate: Date;
  cycleLength: number;
  periodLength: number;
  predictedNextPeriod: Date;
}

const CycleTrackingSchema: mongooseLib.Schema = new mongooseLib.Schema({
  userId: { type: mongooseLib.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  cycleLength: { type: Number, default: 28 },
  periodLength: { type: Number, default: 5 },
  predictedNextPeriod: { type: Date }
}, {
  timestamps: true
});

export const CycleTracking = mongooseLib.model<ICycleTracking>('CycleTracking', CycleTrackingSchema);

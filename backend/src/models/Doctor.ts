import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  consultationFee: string;
  languages: string[];
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    location: { type: String, required: true },
    distance: { type: String, default: '' },
    consultationFee: { type: String, required: true },
    languages: { type: [String], default: [] },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);

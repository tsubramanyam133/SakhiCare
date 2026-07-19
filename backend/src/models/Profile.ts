import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  bloodGroup?: string;
  language: string;
  state?: string;
  district?: string;
  emergencyContacts: { name: string; relation: string; phone: string }[];
  medicalHistory: string[];
  pregnancyStatus: boolean;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    bloodGroup: { type: String },
    language: { type: String, default: 'en' },
    state: { type: String },
    district: { type: String },
    emergencyContacts: [
      {
        name: { type: String },
        relation: { type: String },
        phone: { type: String },
      },
    ],
    medicalHistory: [{ type: String }],
    pregnancyStatus: { type: Boolean, default: false },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);

import mongoose, { Document, Schema } from 'mongoose';

export enum Role {
  GUEST = 'guest',
  USER = 'user',
  DOCTOR = 'doctor',
  NGO = 'ngo',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: Role;
  isEmailVerified: boolean;
  status: 'active' | 'suspended' | 'banned';
  refreshTokens: string[];
  phoneNumber?: string;
  otp?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active',
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
    phoneNumber: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);

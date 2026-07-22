import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Role } from '../../models/User';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';

import crypto from 'crypto';
import { EmailService } from '../email.service';

export class AuthService {
  static async register(email: string, passwordHash: string, phoneNumber?: string, name?: string) {
    let existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isEmailVerified) {
      throw new AppError('Email is already in use', 400);
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`\n==========================================`);
    console.log(`[DEV ONLY] GENERATED OTP FOR ${email}: ${otp}`);
    console.log(`==========================================\n`);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const hashedPwd = await bcrypt.hash(passwordHash, 10);
    
    let user;
    if (existingUser) {
      // update unverified user
      existingUser.passwordHash = hashedPwd;
      existingUser.otp = otp;
      existingUser.otpExpiresAt = otpExpiresAt;
      if (phoneNumber) existingUser.phoneNumber = phoneNumber;
      if (name) existingUser.name = name;
      await existingUser.save();
      user = existingUser;
    } else {
      user = await User.create({
        name,
        email,
        passwordHash: hashedPwd,
        role: Role.USER,
        phoneNumber,
        otp,
        otpExpiresAt,
        isEmailVerified: false
      });
    }

    // Send email and wait for it to ensure it goes through
    const emailSent = await EmailService.sendOTP(email, otp);
    if (!emailSent) {
      console.error("Failed to send OTP email to", email);
    }

    return {
      id: user._id,
      email: user.email,
      role: user.role,
      otp: otp, // Included for hackathon demo purposes in case email fails
      message: 'OTP sent to email. Please verify.'
    };
  }

  static async verifyOTP(email: string, otp: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    if (user.isEmailVerified) {
      throw new AppError('Email already verified', 400);
    }

    if (!user.otp || user.otp !== String(otp).trim()) {
      throw new AppError('Invalid OTP', 400);
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new AppError('OTP expired', 400);
    }

    if (!user.name || user.name === 'User') {
      if (user.email) {
        const rawPrefix = user.email.split('@')[0];
        user.name = rawPrefix.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'User';
      }
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // After verifying, we can automatically log them in
    const payload = { userId: user._id, role: user.role, name: user.name || 'User', email: user.email };
    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any });

    user.refreshTokens.push(refreshToken);
    await user.save();

    return { accessToken, refreshToken, user: payload };
  }

  static async login(identifier: string, passwordHash: string) {
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { phoneNumber: identifier.trim() },
        { name: identifier.trim() }
      ]
    });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.status !== 'active') {
      throw new AppError('Account is not active', 403);
    }

    // Auto-populate name for previously registered users missing a name
    if (!user.name || user.name === 'User') {
      if (user.email) {
        const rawPrefix = user.email.split('@')[0];
        user.name = rawPrefix.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'User';
        await user.save().catch(() => {});
      }
    }

    const payload = { userId: user._id, role: user.role, name: user.name || 'User', email: user.email };
    
    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any });

    user.refreshTokens.push(refreshToken);
    await user.save();

    return { accessToken, refreshToken, user: payload };
  }

  static async refreshToken(oldToken: string) {
    try {
      const decoded = jwt.verify(oldToken, env.JWT_REFRESH_SECRET) as { userId: string; role: Role };
      const user = await User.findById(decoded.userId);

      if (!user || !user.refreshTokens.includes(oldToken)) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Remove the old refresh token
      user.refreshTokens = user.refreshTokens.filter(t => t !== oldToken);

      const payload = { userId: user._id, role: user.role };
      const newAccessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
      const newRefreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any });

      user.refreshTokens.push(newRefreshToken);
      await user.save();

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  static async logout(userId: string, refreshToken: string) {
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: refreshToken }
    });
  }
}

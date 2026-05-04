import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
  _id?: string;
  email: string;
  robloxUsername?: string;
  purchasedItems: string[];
  aiUsageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    robloxUsername: { type: String },
    purchasedItems: [{ type: String }],
    aiUsageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>('User', UserSchema);

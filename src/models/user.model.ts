import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  profilePicture: string;
  userType?: 'user' | 'admin' | 'chaperone';
  phoneNumber?: string;
  age?: number;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  lastSeen: Date;
  isDeleted?: boolean;
  isBlocked: boolean;
  isOnline?: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: false },
    age: { type: Number, required: false, min: 0, max: 150 },
    userType: { type: String, required: false, default: 'user' },
    profilePicture: { type: String, required: false },
    // Not required: users seeded/created outside the register flow (e.g. via admin CRUD) have no password.
    password: { type: String, required: false, select: false },
    deletedAt: { type: Date, required: false },
    lastSeen: { type: Date, default: Date.now() },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ phoneNumber: 1 });
// Supports sorting/pagination of the users list by recency.
UserSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', UserSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  profilePicture: string;
  userType?: 'user' | 'admin' | 'chaperone';
  phoneNumber?: string;
  authId: string;
  password: string;
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
    email: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    userType: { type: String, required: false, default: 'user' },
    profilePicture: { type: String, required: false },
    password: { type: String, required: false },
    authId: { type: String, required: false },
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

UserSchema.index({ authId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ phoneNumber: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  googleId?: string; // Add this line for Google OAuth
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  googleId: { type: String } // Add this line for Google OAuth
});

export default mongoose.model<IUser>('User', UserSchema);
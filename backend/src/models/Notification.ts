import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  message: string;
  read: boolean;
  projectId: mongoose.Schema.Types.ObjectId;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', NotificationSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedbackMessage extends Document {
  message: string;
  rating?: number;
  createdAt: Date;
}

const FeedbackMessageSchema = new Schema<IFeedbackMessage>({
  message: { type: String, required: true },
  rating: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export const FeedbackMessage = mongoose.model<IFeedbackMessage>('FeedbackMessage', FeedbackMessageSchema);

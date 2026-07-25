import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  taste: string;
}

const MenuItemSchema = new Schema<IMenuItem>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  taste: { type: String, required: true, default: 'savory' },
});

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  quantity: number;
  customization?: string;
  unitPrice: number;
  name: string;
  image?: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  total: number;
  status: string;
  items: IOrderItem[];
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true },
  customization: { type: String, default: '' },
  unitPrice: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
});

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  total: { type: Number, required: true },
  status: { type: String, default: 'placed' },
  items: [OrderItemSchema],
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);

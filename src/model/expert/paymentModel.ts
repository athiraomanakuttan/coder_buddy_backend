import mongoose, { Schema, Document, model } from 'mongoose';

// Document Interface
export interface PaymentType extends Document {
  title: string;
  amount: number;
  userId: mongoose.Types.ObjectId;
  expertId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  status: 0 | 1;
  paymentDetails?: {
    razorpay_payment_id?: string | null;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<PaymentType>(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    expertId: { type: Schema.Types.ObjectId, ref: 'expert', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'post', required: true },
    status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    paymentDetails: {
      razorpay_payment_id: { type: String },
      razorpay_order_id: { type: String },
      razorpay_signature: { type: String },
    },
  },
  { timestamps: true }
);

// Create model using interface
const Payment = model<PaymentType>('payment', paymentSchema);

export { Payment };

import mongoose,{Types} from 'mongoose';

interface PaymentType {
    _id: string;
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
  }
  
  const paymentSchema = new mongoose.Schema<PaymentType>(
    {
      title: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      expertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'expert',
        required: true,
      },
      postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"post",
        required: true
      },
      status: {
        type: Number,
        enum: [0, 1],
        default: 0,
      },
      paymentDetails: {
        razorpay_payment_id: { type: String },
        razorpay_order_id: { type: String },
        razorpay_signature: { type: String }
    }
    },
    { timestamps: true }
  );
  
  const Payment: mongoose.Model<PaymentType> = mongoose.model('payment', paymentSchema);
  export { Payment, PaymentType };
  
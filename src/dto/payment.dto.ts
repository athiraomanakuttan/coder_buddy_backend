export interface PaymentDTO {
  id: string;
  title: string;
  amount: number;
  userId: string;
  expertId: string;
  postId: string;
  status: 0 | 1;
  paymentDetails?: {
    razorpay_payment_id?: string | null;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  };
}


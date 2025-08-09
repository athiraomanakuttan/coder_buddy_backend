import { PaymentType } from '../model/expert/paymentModel';
import { PaymentDTO } from '../dto/payment.dto';

export function toPaymentDTO(payment: PaymentType): PaymentDTO {
  return {
    id: payment._id?.toString() ?? '',
    title: payment.title,
    amount: payment.amount,
    userId: payment.userId?.toString() ?? '',
    expertId: payment.expertId?.toString() ?? '',
    postId: payment.postId?.toString() ?? '',
    status: payment.status,
    paymentDetails: payment.paymentDetails,
  };
}


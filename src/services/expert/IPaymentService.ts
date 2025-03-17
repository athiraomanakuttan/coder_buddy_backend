import { FundModelType } from "../../model/expert/fund.model"
import { PaymentType } from "../../model/expert/paymentModel"
import { WalletDataType } from "../../model/expert/wallet.model"
import { PaymentListResponseType } from "../../types/type"

interface IPaymentService {
    createMeetingLink(title:string, amount:number, userId:string, expertId:string,postId: string):Promise<PaymentType | null>
    getPaymentList(userId:string,status: number, page: number, count: number):Promise<PaymentListResponseType | null>
    getPaymentById(id:string):Promise<PaymentType | null>
    updatePaymentById(id: string, status: number, razorpayId:string | null): Promise<PaymentType | null>
    getWalletByExpertId(expertId: string):Promise<WalletDataType | null>
    createWallet(data:WalletDataType):Promise<WalletDataType | null>
    addAdminProfit(data:WalletDataType): Promise<WalletDataType | null>
    getFundAccountIdByExpertId(expertId: string):Promise<string  | null >
    saveFundAccountId(expertId: string,fundAccountId: string):Promise<FundModelType | null>
    getWalletBalance(expertId: string):Promise<number | null>
}

export default IPaymentService
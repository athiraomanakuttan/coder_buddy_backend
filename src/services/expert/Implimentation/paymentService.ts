import { FundModelType } from "../../../model/expert/fund.model";
import { PaymentType } from "../../../model/expert/paymentModel";
import { WalletDataType } from "../../../model/expert/wallet.model";
import PaymentRepository from "../../../repositories/expert/paymentRepository"
import { PaymentListResponseType } from "../../../types/type";
import IPaymentService from "../IPaymentService";

class PaymentService implements IPaymentService{
    private paymentRepository : PaymentRepository;
    constructor(paymentRepository:PaymentRepository){
        this.paymentRepository = paymentRepository
    }
    async createMeetingLink(title:string, amount:number, userId:string, expertId:string, postId : string):Promise<PaymentType | null>{
        const response = await this.paymentRepository.createPayment(title,amount,userId,expertId,postId)
        return response
    } 

    async getPaymentList(userId:string, status:number = 0, page : number = 1 , count: number = 5 ):Promise<PaymentListResponseType | null>{
        
        const paymentDetails =  await this.paymentRepository.getPaymentList(userId, status, page, count)
        return paymentDetails
    }

    async getPaymentById(id:string):Promise<PaymentType | null>{
        return await this.paymentRepository.getPaymentById(id)
    }

    async updatePaymentById(id: string, status: number, razorpayId:string | null): Promise<PaymentType | null>{
        return await this.paymentRepository.updatePaymentById(id,status,razorpayId)
    }

    async getWalletByExpertId(expertId: string): Promise<WalletDataType | null> {
        return await this.paymentRepository.getWalletByExpertId(expertId)
    }
    async createWallet(data:WalletDataType): Promise<WalletDataType | null> {
        return await this.paymentRepository.createExpertWallet(data)
    }
    async addAdminProfit(data: WalletDataType): Promise<WalletDataType | null> {
        const adminProfit  = await this.paymentRepository.addAdminProfit(data)
        return adminProfit
    }

    async getFundAccountIdByExpertId(expertId: string): Promise<string  | null> {
        const fundData =  await this.paymentRepository.getFundAccountIdByExpertId(expertId)
        return fundData
    }

    async saveFundAccountId(expertId: string, fundAccountId: string): Promise<FundModelType | null> {
        const fundData = await this.paymentRepository.createFundAccount(expertId,fundAccountId)
        return fundData
    }
    async getWalletBalance(expertId: string): Promise<number | null> {
        return await this.paymentRepository.getWalletBalance(expertId)
    }
}
export default PaymentService
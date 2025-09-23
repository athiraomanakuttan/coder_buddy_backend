import { AdminWallet } from "../../../model/admin/adminWallet";
import { FundAccount, FundModelType } from "../../../model/expert/fund.model";
import { Payment, PaymentType } from "../../../model/expert/paymentModel"
import { Wallet, WalletDataType } from "../../../model/expert/wallet.model";
import IPaymentRepository from "../../expert/paymentRepository"
import { PaymentListResponseType } from "../../../types/type";
import { BaseRepository } from "../../base";
import mongoose from "mongoose";

class PaymentRepositoryImplimentation extends BaseRepository<PaymentType> implements IPaymentRepository {
    constructor() {
        super(Payment);
    } 

    async createPayment(title: string, amount: number, userId: string, expertId: string, postId: string): Promise<PaymentType | null> {
        return await Payment.create({
            title,
            amount,
            userId: new mongoose.Types.ObjectId(userId),
            expertId: new mongoose.Types.ObjectId(expertId),
            postId: new mongoose.Types.ObjectId(postId)
        });
    }

    async getPaymentList(userId: string, status: number = 0, page: number = 1, count: number = 5): Promise<PaymentListResponseType | null> {
        const skip = (page - 1) * count;
        const paymentDetails = await this.findMany({
            status: status,
            $or: [
                { userId: userId },
                { expertId: userId },
            ]
        }, { sort: { createdAt: -1 }, skip, limit: count });
        const totalRecord = await this.count({
            $or: [
                { userId: userId },
                { expertId: userId }
            ]
        });
        return { paymentDetails, totalRecord };
    }

    async getPaymentById(paymentId: string): Promise<PaymentType | null> {
        return await this.findOne({_id:paymentId, status:0});
    }

    async updatePaymentById(paymentId: string, status: number, razorpayId: string | null): Promise<PaymentType | null> {
        return await Payment.findOneAndUpdate(
            { _id: paymentId },
            {
                status: status,
                paymentDetails: { razorpay_payment_id: razorpayId }
            },
            { new: true }
        );
    }

    async getWalletByExpertId(expertId: string): Promise<WalletDataType | null> {
        const walletDetails = await Wallet.aggregate([
            { $match: { expertId } },
            {
                $addFields: {
                    transaction: {
                        $sortArray: {
                            input: "$transaction",
                            sortBy: { _id: -1 }
                        }
                    }
                }
            }
        ]);
        return walletDetails.length ? walletDetails[0] : null;
    }

    async createExpertWallet(data: WalletDataType): Promise<WalletDataType | null> {
        const updatedWallet = await Wallet.findOneAndUpdate(
            { expertId: data.expertId },
            {
                $inc: { amount: data.amount },
                $push: {
                    transaction: {
                        paymentId: data.transaction[0].paymentId,
                        amount: data.amount,
                        dateTime: new Date(),
                        transactionType: data.transaction[0].transactionType
                    }
                }
            },
            { upsert: true, new: true }
        );
        return updatedWallet;
    }

    async addAdminProfit(data: WalletDataType): Promise<WalletDataType | null> {
        return await AdminWallet.create(data);
    }

    async getFundAccountIdByExpertId(expertId: string): Promise<string | null> {
        const fundData = await FundAccount.findOne({ expertId });
        return fundData ? fundData._id.toString() : null;
    }

    async createFundAccount(expertId: string, fundAccountId: string): Promise<FundModelType | null> {
        return await FundAccount.create({ expertId, fundAccountId });
    }

    async getWalletBalance(expertId: string): Promise<number | null> {
        const walletBalance = await Wallet.findOne({ expertId })
        return walletBalance?.amount ?? null
    }
}

export default PaymentRepositoryImplimentation;
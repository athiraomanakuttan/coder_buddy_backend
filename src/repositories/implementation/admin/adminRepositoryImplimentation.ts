import { User, UserType } from "../../../model/user/userModel";
import Expert, { ExpertDocument } from "../../../model/expert/expertModel";
import IAdminRepository from "../../admin/adminRepository";
import { AdminTransactionOutput, MonthlyAdminProfitReport, MonthlyProfitResult } from "../../../types/type";
import { AdminTransactionType, AdminWallet } from "../../../model/admin/adminWallet";
import { BaseRepository } from "../../base";

class AdminRepositoryImplimentation extends BaseRepository<UserType> implements IAdminRepository {
    constructor() {
        super(User);
    }

    async getUserDetails(skip: number = 0, limit: number = 10): Promise<UserType[]> {
        return await this.findMany({}, { skip, limit, sort: { createdAt: -1 }, select: '-password' });
    }

    async getExpertDetails(): Promise<ExpertDocument[] | ExpertDocument | null> {
        const expertData = await Expert.find({ status: { $in: [0, 2] } })
            .select('-password');
        return expertData;
    }

    async getExpertPendingDetails(status: number = 0, skip: number = 0, limit: number = 10): Promise<ExpertDocument[]> {
        try {
            return await Expert.find({ isMeetingScheduled: 0, isVerified: status })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .select('-password');
        } catch (error) {
            console.error('Error fetching expert details:', error);
            throw error;
        }
    }

    async countExpertPendingDetails(status: number = 0): Promise<number> {
        return await Expert.countDocuments({ status });
    }

    async getUserById(userId: string): Promise<UserType | null> {
        return await this.findById(userId); // select('-password') not supported by base, so fallback to model if needed
    }

    async updateUserById(userId: string, data: UserType): Promise<UserType | null> {
        return await this.updateById(userId, data); // select('-password') not supported by base, so fallback to model if needed
    }

    async getExpertById(expertId: string): Promise<ExpertDocument | null> {
        return await Expert.findOne({ _id: expertId }).select('-password');
    }

    async updateExpertById(expertId: string, data: ExpertDocument): Promise<ExpertDocument | null> {
        return await Expert.findOneAndUpdate({ _id: expertId }, data, { new: true }).select('-password');
    }

    async getUserCount(): Promise<number> {
        return await this.count({ status: { $ne: -1 } });
    }

    async updateExpertStatus(expertId: string, status: number): Promise<ExpertDocument | null> {
        return await Expert.findOneAndUpdate({ _id: expertId }, { $set: { status: status } });
    }

    async getMonthlyProfitReport(year: number): Promise<MonthlyAdminProfitReport[] | null> {
        try {
            const result = await AdminWallet.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                            $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
                        }
                    }
                },
                {
                    $group: {
                        _id: { month: { $month: "$createdAt" } },
                        totalProfit: { $sum: "$amount" }
                    }
                },
                {
                    $sort: { "_id.month": 1 }
                }
            ]) as MonthlyProfitResult[];

            return result.map((item) => ({
                month: item._id.month,
                profit: item.totalProfit
            }));
        } catch (error) {
            console.error("Error fetching monthly profit report:", error);
            return [];
        }
    }

    async getExpertCount(): Promise<number | null> {
        return await Expert.countDocuments({ status: 1 });
    }

    async getTotalProfit(): Promise<number | null> {
        const result = await AdminWallet.aggregate([
            { $group: { _id: null, sum: { $sum: "$amount" } } }
        ]);
        return result.length > 0 ? result[0].sum : 0;
    }

    async getWalletData(): Promise<AdminTransactionOutput | null> {
        try {
            const result = await AdminWallet.aggregate([
                { $group: { _id: null, sum: { $sum: "$amount" } } }
            ]);
            const amount = result.length > 0 ? result[0].sum : 0;
            const data = await AdminWallet.find({}, { transaction: 1, _id: 0 });
            const transaction: AdminTransactionType[] = [];
            data.forEach((trans) => {
                transaction.push(...trans.transaction);
            });
            return { amount, transaction };
        } catch (error) {
            console.error("Error fetching wallet data:", error);
            return null;
        }
    }
}

export default AdminRepositoryImplimentation;
import { User, UserType } from "../../../model/user/userModel";
import Expert, { ExpertDocument } from "../../../model/expert/expertModel";
import IAdminRepository from "../../admin/adminRepository";
import { AdminTransactionOutput, MonthlyAdminProfitReport, MonthlyProfitResult } from "../../../types/type";
import { AdminTransactionType, AdminWallet } from "../../../model/admin/adminWallet";

class AdminRepositoryImplimentation implements IAdminRepository{
    async getUserDetails(skip: number = 0, limit: number = 10): Promise<UserType[]> {
        return await User.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select('-password')
    }
async getExpertDetails(): Promise<ExpertDocument[] | ExpertDocument | null> {
    const expertData = await Expert.find({ status: { $in: [0, 2] } })
        .select('-password'); 
    console.log("expertData", expertData);
    return expertData;
}
async getExpertPendingDetails(status: number = 0, skip: number = 0, limit: number = 10): Promise<ExpertDocument[]> {
    try {
        return await Expert.find({ isMeetingScheduled: 0, isVerified: status })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select('-password')

    } catch (error) {
        console.error('Error fetching expert details:', error);
        throw error;
    }
}

async countExpertPendingDetails(status: number = 0): Promise<number> {
    const count = await Expert.find({status:status}).countDocuments();
    return count;
}

async getUserById(userId: string): Promise<UserType | null> {
    const userData =  await User.findOne({_id:userId}).select('-password')
    return userData
}

async updateUserById(userId: string, data: UserType): Promise<UserType | null> {
    const userData = await User.findOneAndUpdate({ _id: userId }, data, { new: true }).select('-password');
    return userData;
}

async getExpertById(expertId: string): Promise<ExpertDocument | null> {
    const expertData = await Expert.findOne({_id :  expertId}).select('-password')
        return expertData;
}
async updateExpertById(expertId: string, data: ExpertDocument): Promise<ExpertDocument | null> {
    const updateExpert = await Expert.findOneAndUpdate({_id : expertId},data,{new:true}).select('-password')
    return updateExpert
}

async getUserCount(): Promise<number> {
    const count = await User.find({status:{$ne:-1}}).countDocuments();
    return count;
}

async updateExpertStatus(expertId: string, status: number): Promise<ExpertDocument | null> {
    const response = await Expert.findOneAndUpdate({_id: expertId}, {$set: { status: status}})
    return response;
}

async  getMonthlyProfitReport(year: number): Promise<MonthlyAdminProfitReport[] | null>{
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
};

async getExpertCount(): Promise<number | null> {
    const count = await Expert.find({status: 1}).countDocuments()
    return count
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

export default AdminRepositoryImplimentation
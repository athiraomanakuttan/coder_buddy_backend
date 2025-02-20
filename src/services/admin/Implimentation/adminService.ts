import { ExpertDocument } from "../../../model/expert/expertModel";
import { User, UserType } from "../../../model/user/userModel";
import AdminRepository from "../../../repositories/admin/adminRepository";
import { basicType, MonthlyAdminProfitReport } from "../../../types/type";
import IAdminService from "../IAdminService";

class AdminService implements IAdminService {
    private adminRepository: AdminRepository;
    constructor(adminRepository: AdminRepository) {
        this.adminRepository = adminRepository;
    }
    adminSignup(
        userData: basicType,
        adminData: basicType
    ): { status: boolean; message: string } {
        if (userData.email !== adminData.email) {
            return { status: false, message: "incorrect emailid" };
        } else if (userData.password !== adminData.password)
            return { status: false, message: "incorrect password" };
        else return { status: true, message: "login success" };
    }

    async getUserData(
        skip: number,
        limit: number
    ): Promise<{
        users: UserType[];
        total: number;
    }> {
        const [userData, totalUsers] = await Promise.all([
            this.adminRepository.getUserDetails(skip, limit),
            this.adminRepository.getUserCount(),
        ]);

        return {
            users: (userData as UserType[]) || [],
            total: totalUsers,
        };
    }

    async getExpertPendingList(
        status : number,
        skip: number = 0,
        limit: number = 10
    ): Promise<{
        experts: ExpertDocument[] | null | ExpertDocument;
        total: number;
    }> {
        try {
            const totalExperts =
                await this.adminRepository.countExpertPendingDetails(status);

            const expertData = await this.adminRepository.getExpertPendingDetails(
                status,
                skip,
                limit
            );

            return {
                experts: expertData,
                total: totalExperts,
            };
        } catch (error) {
            console.error("Error in getExpertPendingList:", error);
            throw error;
        }
    }
    async getUserById(id: string): Promise<UserType | null> {
        const userData = await this.adminRepository.getUserById(id);
        return userData;
    }

    async updateUserById(id: string, data: UserType): Promise<UserType | null> {
        const userData = await this.adminRepository.updateUserById(id, data);
        return userData;
    }

    async getExpertById(id: string): Promise<ExpertDocument | null> {
        const expertData = await this.adminRepository.getExpertById(id);
        return expertData;
    }

    async updateExpertById(id: string, data: ExpertDocument): Promise<ExpertDocument | null> {
        const updatedExpert = await this.adminRepository.updateExpertById(id, data);
        return updatedExpert;
    }
    async countTotalUsers(): Promise<number> {
        const count = await this.adminRepository.getUserCount();
        return count;
    }

    async updateExpertStatus(expertId: string, status: number): Promise<ExpertDocument | null> {
        const response = await this.adminRepository.updateExpertStatus(expertId, status)
        return response;
    }
    async getMonthlyProfitReport(year: number): Promise<MonthlyAdminProfitReport[] | null> {
        const profitReport =  await this.adminRepository.getMonthlyProfitReport(year)
        return profitReport;
    }
    async getUserCount(): Promise<number | null> {
        return this.adminRepository.getUserCount()
    }

    async getExpertCount(): Promise<number | null> {
        return  await this.adminRepository.getExpertCount()
    }

    async getTotalProfit(): Promise<number | null> {
        return await this.adminRepository.getTotalProfit()
    }
}
export default AdminService;

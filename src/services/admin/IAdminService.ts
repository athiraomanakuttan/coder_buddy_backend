import { ExpertDocument } from "../../model/expert/expertModel";
import { UserType } from "../../model/user/userModel";
import { basicType, MonthlyAdminProfitReport } from "../../types/type";

interface IAdminService {
adminSignup(userData: basicType,adminData: basicType):{ status: boolean; message: string }
getUserData(skip: number,limit: number): Promise<{users: UserType[];total: number;}> 
getExpertPendingList(status:number,skip: number  , limit: number  ): Promise<{ experts: ExpertDocument[] | null | ExpertDocument; total: number; }>
getUserById(id: string): Promise<UserType | null>
updateUserById(id: string, data: UserType): Promise<UserType | null>
getExpertById(id: string): Promise<ExpertDocument | null>
updateExpertById(id: string, data: ExpertDocument): Promise<ExpertDocument | null>
countTotalUsers(): Promise<number>
updateExpertStatus(expertId: string, status: number): Promise<ExpertDocument | null>
getMonthlyProfitReport(year:number):Promise<MonthlyAdminProfitReport[] | null>
getUserCount():Promise<number | null>
getExpertCount():Promise<number | null>
getTotalProfit():Promise<number | null>
}

export default IAdminService
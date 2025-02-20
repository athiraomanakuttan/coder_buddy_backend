import { ExpertDocument } from "../../model/expert/expertModel";
import { UserType } from "../../model/user/userModel"
import { MonthlyAdminProfitReport } from "../../types/type";

interface IAdminRepository{
getUserDetails(skip: number, limit: number):Promise<UserType[] | UserType | null>;
getExpertDetails():Promise<ExpertDocument[] | ExpertDocument | null >
getExpertPendingDetails(status:number,skip: number, limit: number):Promise<ExpertDocument[] | ExpertDocument | null>
getUserById(id:string):Promise<UserType | null>;
getExpertById(id:string):Promise<ExpertDocument | null>
updateUserById(id:string,data:UserType):Promise<UserType | null>
updateExpertById(id: string,data:ExpertDocument):Promise<ExpertDocument | null>
getUserCount():Promise<number>
countExpertPendingDetails(status: number):Promise<number>
updateExpertStatus(expertId: string, status: number): Promise<ExpertDocument | null>
getMonthlyProfitReport(year: number):Promise<MonthlyAdminProfitReport[] | null>
getExpertCount():Promise<number | null>
getTotalProfit():Promise<number | null >
}

export default IAdminRepository
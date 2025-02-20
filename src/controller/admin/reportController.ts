import IAdminService from "../../services/admin/IAdminService"
import IConcernService from "../../services/admin/IConcernService"
import IMeetingService from "../../services/admin/IMeetingService"
import { Request, Response } from "express"
class ReportController {
    private _adminService :IAdminService
    private _meetingService : IMeetingService
    private _concernService : IConcernService
    constructor(adminService :IAdminService, meetingService :IMeetingService, concernService:IConcernService){
        this._adminService = adminService
        this._meetingService = meetingService
        this._concernService = concernService
    }

    async getDashboardData(req:Request, res:Response):Promise<void>{
        try {
            const totalClient = await this._adminService.getUserCount()
            const totalExpert = await this._adminService.getExpertCount()
            const scheduledMeeting = await this._meetingService.getScheduledMeeting()
            const openTicket = await this._concernService.getOpenTicketCount()
            const totalProfit = await this._adminService.getTotalProfit()
            res.status(200).json({status: true, message:"data fetched sucessfully", data:{totalClient, totalExpert,totalProfit,scheduledMeeting,openTicket}})
        } catch (error) {
            res.status(500).json({status: false, message:"error while fetching data"})
        }
    }
}

export default ReportController
import { ERROR_MESSAGES } from "../../constants/errorMessage"
import { STATUS_CODES } from "../../constants/statusCode"
import IAdminService from "../../services/admin/IAdminService"
import IConcernService from "../../services/admin/IConcernService"
import IMeetingService from "../../services/admin/IMeetingService"
import { Request, Response } from "express"
import { CustomResponse } from "../../utils/customResponse"
import { SUCESS_MESSAGE } from "../../constants/sucessMessage"
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
            res.status(STATUS_CODES.OK).json({status: true, message:SUCESS_MESSAGE.DATA_FETCH_SUCESS, data:{totalClient, totalExpert,totalProfit,scheduledMeeting,openTicket}} as CustomResponse<{}>)
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
        }
    }
}

export default ReportController
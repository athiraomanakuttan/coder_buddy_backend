import IMeetingService from "../../services/expert/IMeetingService"
import { Response } from "express"
import { CustomType } from "../../types/type"
import IPaymentService from "../../services/expert/IPaymentService"
import { STATUS_CODES } from "../../constants/statusCode"
import { ERROR_MESSAGES } from "../../constants/errorMessage"
import { CustomResponse } from "../../utils/customResponse"
import { SUCESS_MESSAGE } from "../../constants/sucessMessage"

class ReportController{
private _meetingService : IMeetingService
private _paymentService : IPaymentService
constructor (meetingService : IMeetingService, paymentService : IPaymentService){
    this._meetingService = meetingService
    this._paymentService = paymentService

}

async getExpertReport(req:CustomType, res:Response):Promise<void>{
    const expertId = req.id
    try {
        if(!expertId){
            res.status(400).json({status: false, message : ERROR_MESSAGES.UNAUTHORIZED} as CustomResponse<null>)
            return
        }
        const meetingData = await this._meetingService.getMeetingDetails(expertId)
        const meetingRating = await this._meetingService.getExpertRating(expertId)
        const walletBalance = await this._paymentService.getWalletBalance(expertId)
        res.status(STATUS_CODES.OK).json({status: true, message:SUCESS_MESSAGE.DATA_FETCH_SUCESS, data :{...meetingData, meetingRating:meetingRating?.toFixed(1), walletBalance}} as CustomResponse<{}>)
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
    }
}
}

export default ReportController

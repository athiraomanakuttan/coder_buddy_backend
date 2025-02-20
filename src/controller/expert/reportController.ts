import IMeetingService from "../../services/expert/IMeetingService"
import { Response } from "express"
import { CustomType } from "../../types/type"
import IPaymentService from "../../services/expert/IPaymentService"

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
            res.status(400).json({status: false, message : "unautherized user"})
            return
        }
        const meetingData = await this._meetingService.getMeetingDetails(expertId)
        const meetingRating = await this._meetingService.getExpertRating(expertId)
        const walletBalance = await this._paymentService.getWalletBalance(expertId)
        res.status(200).json({status: true, message:"data fetched sucessfull", data :{...meetingData, meetingRating:meetingRating?.toFixed(1), walletBalance}})
    } catch (error) {
        res.status(500).json({status: false, message:"error while fetching data"})
    }
}
}

export default ReportController

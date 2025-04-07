import { Response, Request } from "express";
import { CustomType, MonthlyReport, RatingData } from "../../types/type";
import IMeetingService from "../../services/shared/IMeetingService";
import { console } from "inspector";
import { STATUS_CODES } from "../../constants/statusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessage";
import { CustomResponse } from "../../utils/customResponse";
import { MeetingType } from "../../model/admin/meetingModel";
import { MeetingUserType } from "../../model/shared/meeting.model";
class MeetingController {
  private _meetingService: IMeetingService;
  constructor(meetingService: IMeetingService) {
    this._meetingService = meetingService;
  }

  async createMeetingLink(req:CustomType, res:Response):Promise<void>{
    
    const expertId = req.id
    const { title , meetingDate, userId, postId} =  req.body
    if(!title || !meetingDate || !userId || !expertId){
        res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:ERROR_MESSAGES.INVALID_INPUT} as CustomResponse<null>)
        return
    }

   try {
    const meetingData =  await this._meetingService.createMeetingLink(title,meetingDate,expertId,userId,postId)
    if(meetingData)
        res.status(STATUS_CODES.OK).json({status:false, message:"Meeting created", data: meetingData} as CustomResponse<MeetingUserType>)

   } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
    
   }
  }

  async getMeetingDetails(req: CustomType, res:Response):Promise<void>{
    const userId =  req.id;
    const {page, limit, status } = req.query;
    if(!userId){
      res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message: ERROR_MESSAGES.UNAUTHORIZED} as CustomResponse<null>);
      return
    }
    else if(Number(status)<0 || Number(status)>1){
      {
        res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message: ERROR_MESSAGES.INVALID_INPUT} as CustomResponse<null>);
        return
      }
    }
    try {
      const meetingData =  await this._meetingService.getMeetingsById(userId,Number(status),Number(page),Number(limit))
      if(meetingData){
        res.status(STATUS_CODES.OK).json({ status : false, message:"Sucessfully fetched data", data : {...meetingData}  } as CustomResponse<{}>) 
      }
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>);
      
    }

  }

  async getMeetingById(req:CustomType , res: Response):Promise<void>{
      const userId = req.id
      const {meetingId} = req.params
      try {
          const meetingData =  await this._meetingService.getMeetingDataById(meetingId, userId as string)
          if(meetingData){
            res.status(STATUS_CODES.OK).json({status: true ,  message:"meeting data fetched sucessfully", data:meetingData} as CustomResponse<MeetingUserType>)
          }
          else
          res.status(STATUS_CODES.OK).json({status: true ,  message:"meeting data fetched sucessfully", data:null} as CustomResponse<null>)

      } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status : false , message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
      }
  }

  async getUserMeetings(req: CustomType, res: Response):Promise<void>{
    const userId = req.id
    const {participentId}= req.query
    if(!userId || !participentId){
      res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message:ERROR_MESSAGES.INVALID_INPUT} as CustomResponse<null>)
      return
    }
try {
  const meetingData = await this._meetingService.getUserMeetings(userId,participentId as string)
  if(meetingData){
    res.status(STATUS_CODES.OK).json({status: true, message:"data fetched sucessfull", data: meetingData} as CustomResponse<MeetingUserType[]>)
  }
  
} catch (error) {
  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>) 
  
}  
}

async getMeetingReport(req:CustomType, res:Response):Promise<void>{
  const userId  = req.id
  const {year} = req.query
  if(!userId){
    res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message:ERROR_MESSAGES.UNAUTHORIZED} as CustomResponse<null>)
    return
  }
  try {
    const meetingReport  = await this._meetingService.getMeetingReport(userId,Number(year) ?? new Date().getFullYear())
   res.status(STATUS_CODES.OK).json({status: true, message:"data fetched sucessfully", data:meetingReport } as CustomResponse<MonthlyReport>)
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:"unable to get the user meeting report "} as CustomResponse<null>)
    
  }
} 

async updateMeetingStatus(req:Request, res:Response):Promise<void>{
  const {status} = req.params
  const {meetingId} = req.body
  try {
    await this._meetingService.updateMeetingStatus(meetingId,Number(status))
    res.status(STATUS_CODES.OK).json({status: true, message:"status updated sucessfully"} as CustomResponse<null>)

  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
  }
}

async updateMeetingRating(req:CustomType,res:Response):Promise<void>{
   const userId = req.id
   const { id, meetingRating, participantBehavior, feedback } = req.body
   try {
    const response = await this._meetingService.createMeetingRating(id,{userId,meetingRating,participantBehavior} as RatingData)
    res.status(STATUS_CODES.OK).json({status:true, message : "Rating added sucessfully"} as CustomResponse<null>)
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
   }
}

async getMeetingFeedback(req:CustomType,res:Response):Promise<void>{
  const {meetingId} = req.query
  const userId = req.id
  if(!meetingId || !userId){
    res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:ERROR_MESSAGES.INVALID_INPUT} as CustomResponse<null>)
    return
  }
  try {
    const feedbackData = await this._meetingService.getMeetingFeedback(meetingId as string,userId)
    res.status(STATUS_CODES.OK).json({status: true, data:feedbackData})
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
  }
}


}

export default MeetingController;

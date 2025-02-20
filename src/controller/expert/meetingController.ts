import { Request,Response } from "express"
import MeetingService from "../../services/expert/Implimentation/meetingService"
import IMeetingService from "../../services/expert/IMeetingService"
interface CustomType extends Request{
    id?:string
}

class MeetingController{
    private meetngService :IMeetingService
    constructor(meetngService : IMeetingService){
        this.meetngService = meetngService
    }
    async getAdminExpertMeeting(req:CustomType , res:Response):Promise<void>{
        const expertId = req.id;
        if(!expertId){
            res.status(400).json({status:false, message:"user is not authenticated"})
            return
        }
        try {
            const meetingDetails = await this.meetngService.getAdminExpertMeeting(expertId)
            res.status(200).json({status:true, message:"data fetched successfully ", data: meetingDetails})
            
        } catch (error) {
            res.status(500).json({status:false, message:"unable to get the details"})
            
        }
    }

    async verifyMeeting(req:CustomType, res:Response):Promise<void>{
        const {meetingId} = req.body;
        
        if( !meetingId ){
            res.status(400).json({status: false, message:"Invalid user details"});
            return; 
        }
        try {
            const getMeeting = await this.meetngService.verifymeeting(meetingId)
            if(getMeeting){
                res.status(200).json({status: true, message:"data fetched sucessfully",data:getMeeting})
                return
            }
            res.status(400).json({status: false, message:"Invalid meeting"})

        } catch (error) {
            res.status(500).json({status: false, message:"unable to access the meeting"})
        }
    }
}
export default MeetingController
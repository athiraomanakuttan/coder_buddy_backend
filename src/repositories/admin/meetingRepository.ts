import { MeetingType } from "../../model/admin/meetingModel";

interface IMeetingRepository {
    createMeeting(data : MeetingType):Promise<MeetingType | null>
    getMeetingdata( status :  number, limit : number, skip : number):Promise<MeetingType[] | null>
    getMeetingCount(status: number):Promise<number>
    updateMeetingByExpertId(expertId : string ,meetingId:string):Promise<MeetingType |null> 
}

export default IMeetingRepository
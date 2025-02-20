import { MeetingType } from "../../model/admin/meetingModel";

interface MeetingRepository {
    createMeeting(data : MeetingType):Promise<MeetingType | null>
    getMeetingdata( status :  number, limit : number, skip : number):Promise<MeetingType[] | null>
    getMeetingCount(status: number):Promise<number>
    updateMeetingByExpertId(id : string ,meetingId:string):Promise<MeetingType |null> 
}

export default MeetingRepository
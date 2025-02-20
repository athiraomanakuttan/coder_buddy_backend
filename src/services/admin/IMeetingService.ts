import { MeetingType } from "../../model/admin/meetingModel"

interface IMeetingService {
    createMeeting(data :  MeetingType):Promise<MeetingType | null>
    getMeetingData(page:number , status : number):Promise<MeetingType[] | null>
    getMeetingCount(status: number):Promise<number>
    updateMeetingByExpertId(expertId:string , meetingId:string):Promise<MeetingType | null>
    getScheduledMeeting():Promise<number | null>
}

export default IMeetingService
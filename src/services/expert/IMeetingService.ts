import { MeetingType } from "../../model/admin/meetingModel"
import { MeetingReportType } from "../../types/type"

interface IMeetingService{
getAdminExpertMeeting(expertId:string):Promise<MeetingType | null>
verifymeeting(meetingId: string): Promise<MeetingType | null>
getMeetingDetails(expertId : string):Promise<MeetingReportType | null>
getExpertRating(expertId : string):Promise <number | null>
}
export default IMeetingService
import { MeetingType } from "../../model/admin/meetingModel"
import { MeetingReportType } from "../../types/type"

interface IMeetingRepository{
     getAdminExpertMeeting(id:string):Promise<MeetingType | null>
     verifymeeting(meetingId : string):Promise<MeetingType | null>
     getMeetingReport(expertId: string):Promise<MeetingReportType | null>
     getExpertRating(expertId: string) :Promise<number | null>
}
export default IMeetingRepository 
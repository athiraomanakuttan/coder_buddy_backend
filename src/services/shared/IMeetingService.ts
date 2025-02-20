import { MeetingUserType } from "../../model/shared/meeting.model";
import { CustomMeetingDataType, MeetingDataResponseType, MonthlyReport, RatingData } from "../../types/type";

interface IMeetingService
{
    createMeetingLink(title: string, meetingDate: string, expertId: string, userId: string,postId:string) : Promise<MeetingUserType | null>;
    getMeetingsById(userId:string, status: number,page: number,limit:number):Promise<MeetingDataResponseType | null>
    getMeetingDataById(meetingId: string, userId:string):Promise<MeetingUserType |  null>
    getUserMeetings(userId: string, participantId: string): Promise<CustomMeetingDataType[] | null>
    getMeetingReport(userId: string, year: number):Promise<MonthlyReport[] | null>
    updateMeetingStatus(meetingId: string, status:number):Promise<MeetingUserType | null>
    createMeetingRating(meetingId:string, data:RatingData):Promise<MeetingUserType | null>
    getMeetingFeedback(meetingId:string,userId:string):Promise<RatingData | null>
}

export default IMeetingService
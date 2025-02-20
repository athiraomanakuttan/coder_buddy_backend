import MeetingRepositories from "../../../repositories/shared/meetingRepositories"
import { MeetingUserType } from "../../../model/shared/meeting.model";
import IMeetingService from "../IMeetingService";
import { CustomMeetingDataType, MeetingDataResponseType, MonthlyReport, RatingData } from "../../../types/type";
class MeetingService implements IMeetingService{
    private meetingRepositories : MeetingRepositories
    constructor(meetingRepositories:MeetingRepositories){
        this.meetingRepositories = meetingRepositories;
    }

    async createMeetingLink(title: string, meetingDate: string, expertId: string, userId: string,postId: string): Promise<MeetingUserType | null> {
        const data = await this.meetingRepositories.createMeeting(title,meetingDate,expertId,userId, postId)
        return data
    }

    async getMeetingsById(userId: string, status: number, page: number, limit : number): Promise<MeetingDataResponseType | null> {
        const data =  await this.meetingRepositories.getMeetingsById(userId, status, page, limit);
        return data
    }
    
    async getMeetingDataById(meetingId: string, userId: string): Promise<MeetingUserType | null> {
        const meetingData =  await this.meetingRepositories.getMeetingDetailById(meetingId, userId)
        return meetingData
    }

    async getUserMeetings(userId: string, participantId: string): Promise<CustomMeetingDataType[] | null> {
        const meetingData =  await this.meetingRepositories.getUserMeetings(userId, participantId)
        return meetingData
    }

    async getMeetingReport(userId: string, year: number): Promise<MonthlyReport[] | null> {
        const meetingData =  await this.meetingRepositories.getMeetingReport(userId, year)
        return meetingData
    }

    async updateMeetingStatus(meetingId: string, status: number): Promise<MeetingUserType | null> {
        const updatedData = await this.meetingRepositories.updateMeetingStatus(meetingId,status)
        return updatedData
    }

    async createMeetingRating(meetingId: string, data: RatingData): Promise<MeetingUserType | null> {
        const response = await this.meetingRepositories.createMeetingRate(meetingId, data)
        return response;
    }

    async getMeetingFeedback(meetingId: string, userId: string): Promise<RatingData | null> {
        const response = await this.meetingRepositories.getMeetingFeedback(userId,meetingId)
        return response
    }
}

export default MeetingService
import { MeetingType } from "../../../model/admin/meetingModel"
import MeetingRepository from "../../../repositories/expert/meetingRepository"
import { MeetingReportType } from "../../../types/type"
import IMeetingService from "../IMeetingService"

class MeetingService implements IMeetingService{
private meetingRepository : MeetingRepository
constructor(meetingRepository : MeetingRepository){
    this.meetingRepository = meetingRepository
}
async getAdminExpertMeeting(id:string):Promise<MeetingType | null>
{
    const meetingDetails = await this.meetingRepository.getAdminExpertMeeting(id)
    return meetingDetails;
}
async verifymeeting(meetingId: string): Promise<MeetingType | null> {
    const meetingData =  await this.meetingRepository.verifymeeting(meetingId)
    return meetingData;
}

async getMeetingDetails(expertId: string): Promise<MeetingReportType | null> {
    const meetingReport = await this.meetingRepository.getMeetingReport(expertId)
    return meetingReport
}

async getExpertRating(expertId: string): Promise<number | null> {
    const rating = await this.meetingRepository.getExpertRating(expertId)
    return rating
}




}
export default MeetingService
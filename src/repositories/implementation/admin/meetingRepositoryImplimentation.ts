import Meeting, { MeetingType } from '../../../model/admin/meetingModel'
import  IMeetingRepository  from '../../admin/meetingRepository'
class MeetingRepositoryImplementation implements IMeetingRepository{
    async createMeeting(data: MeetingType): Promise<MeetingType | null> {
        const createMeet =  await Meeting.create(data)
        return createMeet;
    }
    async getMeetingdata( status: number, limit: number, skip: number): Promise<MeetingType[] | null> {
        const getMeetingData =  await Meeting.find({status: status}).skip(skip).limit(limit)
        return getMeetingData;
    }
    async getMeetingCount(status: number): Promise<number> {
        const count = await Meeting.find({status :  status}).countDocuments()
        return count
    }
    async updateMeetingByExpertId(id: string, meetingId : string): Promise<MeetingType | null> {
        const updateMeeting = await Meeting.findOneAndUpdate({meetingId : meetingId , userId: id, status: 0}, {$set : { status:1}}, {next : true})
        return updateMeeting;
    }
 
}

export default MeetingRepositoryImplementation;
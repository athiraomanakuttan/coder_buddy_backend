import Meeting, { MeetingType } from '../../../model/admin/meetingModel'
import  IMeetingRepository  from '../../admin/meetingRepository'
import { BaseRepository } from '../../base'

class MeetingRepositoryImplementation extends BaseRepository<MeetingType> implements IMeetingRepository {
    constructor() {
        super(Meeting);
    }

    async createMeeting(data: MeetingType): Promise<MeetingType | null> {
        return await this.create(data);
    }

    async getMeetingdata(status: number, limit: number, skip: number): Promise<MeetingType[] | null> {
        return await this.findMany({ status }, { skip, limit });
    }

    async getMeetingCount(status: number): Promise<number> {
        return await this.count({ status });
    }

    async updateMeetingByExpertId(userId: string, meetingId: string): Promise<MeetingType | null> {
        return await Meeting.findOneAndUpdate({ meetingId: meetingId, userId: userId, status: 0 }, { $set: { status: 1 } }, { new: true });
    }
}

export default MeetingRepositoryImplementation;
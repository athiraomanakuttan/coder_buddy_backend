import { MeetingType } from "../../../model/admin/meetingModel";
import MeetingRepository from "../../../repositories/admin/meetingRepository";
import IMeetingService from "../IMeetingService";

class MeetingService implements IMeetingService{
    private meetingRepository : MeetingRepository
    constructor(meetingRepository : MeetingRepository){
        this.meetingRepository = meetingRepository
    }
    async createMeeting(data :  MeetingType):Promise<MeetingType | null>{
        const createMeeting = await  this.meetingRepository.createMeeting(data)
        return createMeeting
    }
    async getMeetingData(page:number = 1 , status : number = 0):Promise<MeetingType[] | null>{
        let limit = 10;
        let skip =  (page-1)*limit
        const meetingData =  await this.meetingRepository.getMeetingdata(status,limit,skip)
        return meetingData
    }
    async getMeetingCount(status: number):Promise<number>{
        const count =  await this.meetingRepository.getMeetingCount(status)
        return count
    }
    async updateMeetingByExpertId(expertId:string , meetingId:string):Promise<MeetingType | null>{
        const updateMeeting =  await this.meetingRepository.updateMeetingByExpertId(expertId,meetingId)
        return updateMeeting
    }
    async getScheduledMeeting(): Promise<number | null> {
        return await this.meetingRepository.getMeetingCount(0)
    }
}

export default MeetingService;
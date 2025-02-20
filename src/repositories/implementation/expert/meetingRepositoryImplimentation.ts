import { count } from "console";
import Meeting, { MeetingType } from "../../../model/admin/meetingModel";
import { MeetingUser } from "../../../model/shared/meeting.model";
import { MeetingReportType } from "../../../types/type";
import MeetingRepository from "../../expert/meetingRepository";

class MeetingRepositoryImplimentation implements MeetingRepository{

    async getAdminExpertMeeting(id: string): Promise<MeetingType | null> {
        const meetingDetails = await Meeting.findOne({userId:id,status:0})
        return meetingDetails;
    }
    async verifymeeting(meetingId: string): Promise<MeetingType | null> {
        const meetingData =  await Meeting.findOne({meetingId:meetingId,status:0})
        return meetingData;
    }

    async getMeetingReport(expertId: string): Promise<MeetingReportType | null> {
        const meetingData = await MeetingUser.aggregate([
            { $match: { expertId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
    
        let totalMeetings = 0;
        let scheduledMeeting = 0;
        
        meetingData.forEach(({ _id, count }) => {
            
            if (_id === 0)  scheduledMeeting = count;
            
            if(_id === 1) totalMeetings += count;
        });
    
        return { totalMeetings, scheduledMeeting };
    }

    async getExpertRating(expertId: string): Promise<number | null> {
        const result = await MeetingUser.aggregate([
          { $match: { expertId } },
          { $unwind: "$rating" },
          { 
            $match: { 
              $expr: { $eq: ["$rating.userId", "$userId"] } 
            } 
          },
          { 
            $group: { 
              _id: null, 
              avgRating: { $avg: "$rating.participantBehavior" }
            } 
          }
        ]);
      
        return result.length > 0 ? result[0].avgRating : null;
      }
      
}
export default MeetingRepositoryImplimentation
import { MeetingUserType, MeetingUser } from "../../../model/shared/meeting.model";
import { CustomMeetingDataType, MeetingDataResponseType, MonthlyReport, RatingData } from "../../../types/type";
import IMeetingRepositories from "../../shared/meetingRepositories";

class MeetingRepositoryImplimentation  implements IMeetingRepositories{
    async createMeeting(title: string, meetingDate: string, expertId: string, userId: string, postId :  string): Promise<MeetingUserType | null> {
        return await MeetingUser.create({title, meetingDate, expertId, userId, postId});
    }

    async getMeetingsById(userId: string, status: number,page:number = 1, limit:number = 10): Promise<MeetingDataResponseType | null> {
       const skip = (page -1 )* limit
        const meetingData =  await MeetingUser.find({$or:[{userId : userId},{expertId: userId}], status:status}).sort({createdAt:-1}).skip(skip).limit(limit)
        const dataCount = await MeetingUser.countDocuments({$or:[{userId : userId},{expertId: userId}], status:status})
        return {meetingData,dataCount};
    }

    async getMeetingDetailById(meetingId: string, userId: string): Promise<MeetingUserType | null> {
        const meetingData =  await MeetingUser.findOne({_id: meetingId, $or:[{userId : userId},{expertId: userId}]})
        return meetingData
    }

    async getUserMeetings(userId: string, participantId: string): Promise<CustomMeetingDataType[] | null> {
        const meetings = await MeetingUser.find({
            $or: [
                { expertId: userId, userId: participantId },
                { expertId: participantId, userId: userId }
            ]
        }).select('title _id');
        return meetings;
    }    
    async getMeetingReport(userId: string, year: number): Promise<MonthlyReport[] | null> {
        const report = await MeetingUser.aggregate([ {
                $match: {
                    $or: [{ userId: userId }, { expertId: userId }],
                    meetingDate: {
                        $gte: new Date(`${year}-01-01`), // Start of the year
                        $lt: new Date(`${year + 1}-01-01`) // Start of the next year
                    }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$meetingDate" } },
                    totalMeetings: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.month": 1 }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    totalMeetings: 1
                }
            }
        ]);
        return report;
    }

    async updateMeetingStatus(meetingId: string, status: number): Promise<MeetingUserType | null> {
        const updatedData = await MeetingUser.findOneAndUpdate({_id:meetingId},{$set:{status}})
        return updatedData;
    }

    async createMeetingRate(meetingId: string, data: RatingData): Promise<MeetingUserType | null> {
        const updateMeeting = await MeetingUser.findOneAndUpdate({_id:meetingId},{$push : {rating : data}},{ new: true })
        return updateMeeting;
    }

    async getMeetingFeedback(userId: string, meetingId: string): Promise<RatingData | null> {
        const meeting = await MeetingUser.findOne(
            { _id: meetingId },
            { rating: 1 } 
        );
    
        if (!meeting || !meeting.rating) return null;  
    
        const otherRating = meeting.rating.find(r => r.userId !== userId);
    
        return otherRating || null;
    }
    
}

export default MeetingRepositoryImplimentation
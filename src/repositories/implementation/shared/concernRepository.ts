import { Concern, ConcernDataType, MessageType } from "../../../model/shared/concern.model";
import IConcernRepository from "../../shared/IConcernRepository";

class ConcernRepository implements IConcernRepository{
    async createConcern(data: ConcernDataType): Promise<ConcernDataType | null> {
       const concernData = await Concern.create(data)
       return concernData
    }

    async getUserConcern(userId: string, status: number): Promise<ConcernDataType[] | null> {
        const concernData =  await Concern.find({userId: userId, status: status}).sort({createdAt: -1})
        return concernData;
    }

    async createConcernReplay(data: MessageType, meetingId: string): Promise<ConcernDataType | null> {
        try {
            const updatedConcern = await Concern.findOneAndUpdate(
                { concernMeetingId: meetingId },  
                { $push: { message: data } },  
                { new: true } 
            );
    
            return updatedConcern;
        } catch (error) {
            console.error("Error adding comment:", error);
            return null;
        }
    }
    
}

export default ConcernRepository
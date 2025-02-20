import { Concern, ConcernDataType } from "../../../model/shared/concern.model";
import IConcernRepository from "../../admin/IConcernRepository";
import {ConcernResponseDataType} from "../../../types/type"

class ConcernRepository implements IConcernRepository{
    async getConcenByStatus(status: number, page:number = 1 , limit:number = 10): Promise<ConcernResponseDataType | null> {
        const skip = (page-1) * limit
        const concernData =  await Concern.find({status: status}).sort({createdAt: -1}).skip(skip).limit(limit)
        const totalRecord = await Concern.countDocuments({status})
        return {concernData,totalRecord} 
    }
    async updateConcernById(concernId: string, status: number): Promise<ConcernDataType | null> {
        const updatedData = await Concern.findOneAndUpdate({_id: concernId}, {$set:{status}},{new:true})
        return updatedData;
    }

    async getOpenTicketCount(): Promise<number | null> {
        const ticketCount = await Concern.find({status: 0}).countDocuments()
        return ticketCount
    }
}

export default ConcernRepository;
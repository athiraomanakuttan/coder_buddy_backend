import { ConcernDataType, MessageType } from "../../model/shared/concern.model"

interface IConcernRepository{
    createConcern(data: ConcernDataType):Promise<ConcernDataType | null>
    getUserConcern(userId:string, status: number):Promise<ConcernDataType[] | null>
    createConcernReplay(data:MessageType, meetingId: string):Promise<ConcernDataType | null >
}

export default IConcernRepository
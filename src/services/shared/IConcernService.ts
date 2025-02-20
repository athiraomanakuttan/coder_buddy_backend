import { ConcernDataType , MessageType} from "../../model/shared/concern.model"

interface IConcernService{
    createConcern(data:ConcernDataType):Promise<ConcernDataType | null>
    getUserConcers(userId: string, status:Number):Promise<ConcernDataType[] | null>
    createConcernReplay(data:MessageType , meetingId: string):Promise<ConcernDataType | null>
}

export default  IConcernService

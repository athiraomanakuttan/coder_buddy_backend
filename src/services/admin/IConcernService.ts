import { ConcernDataType } from "../../model/shared/concern.model"
import { ConcernResponseDataType } from "../../types/type"

interface IConcernService{
    getConcernData(status:number,page:number , limit: number):Promise<ConcernResponseDataType | null>
    updateConcernStatus(concernId:string,status:number):Promise<ConcernDataType | null >
    getOpenTicketCount():Promise<number | null>
}

export default IConcernService
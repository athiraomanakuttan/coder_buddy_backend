import { ConcernDataType } from "../../model/shared/concern.model"
import { ConcernResponseDataType } from "../../types/type"

interface IConcernRepository{
    getConcenByStatus(status: number, page: number, limit: number):Promise<ConcernResponseDataType| null>
    updateConcernById(concernId:string, status:number):Promise<ConcernDataType | null>
    getOpenTicketCount():Promise<number | null>
}

export default IConcernRepository
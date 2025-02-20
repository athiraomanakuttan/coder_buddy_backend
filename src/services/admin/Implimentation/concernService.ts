import { ConcernDataType } from "../../../model/shared/concern.model";
import IConcernRepository from "../../../repositories/admin/IConcernRepository";
import { ConcernResponseDataType } from "../../../types/type";
import IConcernService from "../IConcernService";

class ConcernService implements IConcernService{
    private _concenRepository : IConcernRepository
    constructor(concenRepository: IConcernRepository){
        this._concenRepository = concenRepository
    }
    async getConcernData(status: number = 0,page:number=1, limit: number = 10): Promise<ConcernResponseDataType | null> {
        const responseData =  await this._concenRepository.getConcenByStatus(status,page,limit)
        return responseData
    }

    async updateConcernStatus(concernId: string, status: number): Promise<ConcernDataType | null> {
        const response = await this._concenRepository.updateConcernById(concernId,status)
        return response
    }

    async getOpenTicketCount(): Promise<number | null> {
        return await this._concenRepository.getOpenTicketCount()
    }
}

export default ConcernService
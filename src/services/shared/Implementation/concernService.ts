import {  ConcernDataType, MessageType } from "../../../model/shared/concern.model";
import IConcernRepository from "../../../repositories/shared/IConcernRepository";
import IConcernService from "../IConcernService";

class ConcernService implements IConcernService{
    private _concernRepositoty: IConcernRepository
    constructor(concernRepositoty:IConcernRepository){
        this._concernRepositoty = concernRepositoty
    }

    async createConcern(data: ConcernDataType): Promise<ConcernDataType | null> {
        const concernData = await this._concernRepositoty.createConcern(data)
        return concernData
    }
    
    async getUserConcers(userId: string, status: number): Promise<ConcernDataType[] | null> {
        const concernData = await this._concernRepositoty.getUserConcern(userId, status)
        return concernData
    }

    async createConcernReplay(data: MessageType, meetingId: string): Promise<ConcernDataType | null> {
        const concernData = await this._concernRepositoty.createConcernReplay(data,meetingId)
        return concernData
    }
}

export default ConcernService
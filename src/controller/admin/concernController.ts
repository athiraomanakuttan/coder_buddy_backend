import { ERROR_MESSAGES } from "../../constants/errorMessage"
import { STATUS_CODES } from "../../constants/statusCode"
import { ConcernDataType } from "../../model/shared/concern.model"
import IConcernService from "../../services/admin/IConcernService"
import { Request,Response } from "express"
import { CustomResponse } from "../../utils/customResponse"
import { ConcernResponseDataType } from "../../types/type"
import { SUCESS_MESSAGE } from "../../constants/sucessMessage"
class ConcernController{
    private _concernService: IConcernService
    constructor(concernService: IConcernService){
        this._concernService = concernService
    }

    async getConcernDataByStatus(req:Request , res: Response):Promise<void>{
        const {status, page,limit} = req.query
        try {
            const concernData = await this._concernService.getConcernData(Number(status),Number(page),Number(limit))
            if(concernData)
                res.status(STATUS_CODES.OK).json({status: true, message:SUCESS_MESSAGE.DATA_FETCH_SUCESS, data:concernData} as CustomResponse<ConcernResponseDataType>)
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
        }
    }

    async updateConcernStatus(req:Request, res:Response):Promise<void>{

        const {concernId,status} = req.body
        if(!concernId){
            res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:ERROR_MESSAGES.INVALID_INPUT} as CustomResponse<null>)
            return
        }

        if(!status || Number(status)<1 || Number(status)>2){
            res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:ERROR_MESSAGES.INVALID_INPUT} as CustomResponse<null>)
            return
        }

        try {
            const concenData = await this._concernService.updateConcernStatus(concernId, Number(status))
            res.status(STATUS_CODES.OK).json({status: true, message:SUCESS_MESSAGE.UPDATION_SUCESS, data: concenData} as CustomResponse<null>)
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
        }
    }
}

export default ConcernController
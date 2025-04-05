import { ERROR_MESSAGES } from "../../constants/errorMessage"
import { STATUS_CODES } from "../../constants/statusCode"
import ITechnologyService from "../../services/admin/ITechologyService"
import { Request, Response } from "express"

class TechnologyController{
    private _technolgyService : ITechnologyService
    constructor(techService:ITechnologyService){
        this._technolgyService= techService
    }
    
    async createTechnoloy(req:Request, res:Response):Promise<void>{
        const {title} = req.body
        try {
            if(!title.trim()){
                res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message:ERROR_MESSAGES.INVALID_INPUT})
                return
            }
            const techExist =  await this._technolgyService.getTechnologyByTitle(title)
            if(techExist){
                res.status(STATUS_CODES.CONFLICT).json({status: false, message:ERROR_MESSAGES.DUPLICATE_DATA})
                return
            }
            const data =  await this._technolgyService.createTechnology(title)
            if(data){
                res.status(STATUS_CODES.OK).json({status: true, message:"Create sucessfully"})
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
            
        }
    }
    
    async getAllTechnologies(req:Request, res:Response):Promise<void>{
        try {
            const { page,limit } = req.query
            const data = await this._technolgyService.getAllTechnologies(Number(page), Number(limit))
            res.status(STATUS_CODES.OK).json({status: true, message: "data fetched sucessfully", data})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
        }
    }

    async updateTechnology(req:Request, res:Response):Promise<void>{
        const {technologyId,...data} = req.body
        try {
            const updatedData = await this._technolgyService.updateTechnologies(technologyId,data)
             if(updatedData)
                res.status(STATUS_CODES.OK).json({status: true, message:"updated sucessfully",data:updatedData})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.UPDATION_FAILED})
        }
    }
}

export default TechnologyController
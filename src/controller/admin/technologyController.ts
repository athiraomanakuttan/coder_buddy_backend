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
                res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message:"invalid input"})
                return
            }
            const techExist =  await this._technolgyService.getTechnologyByTitle(title)
            if(techExist){
                res.status(STATUS_CODES.CONFLICT).json({status: false, message:"technology already exist"})
                return
            }
            const data =  await this._technolgyService.createTechnology(title)
            if(data){
                res.status(STATUS_CODES.OK).json({status: true, message:"Create sucessfully"})
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:"Error while creating new tchnology"})
            
        }
    }
    
    async getAllTechnologies(req:Request, res:Response):Promise<void>{
        try {
            const { page,limit } = req.query
            const data = await this._technolgyService.getAllTechnologies(Number(page), Number(limit))
            res.status(STATUS_CODES.OK).json({status: true, message: "data fetched sucessfully", data})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message: "error while fetching data"})
        }
    }

    async updateTechnology(req:Request, res:Response):Promise<void>{
        const {id,...data} = req.body
        try {
            const updatedData = await this._technolgyService.updateTechnologies(id,data)
             if(updatedData)
                res.status(STATUS_CODES.OK).json({status: true, message:"updated sucessfully",data:updatedData})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:"unable to update the data"})
        }
    }
}

export default TechnologyController
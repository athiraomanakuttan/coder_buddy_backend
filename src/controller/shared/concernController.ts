
import { Response, Request } from "express";
import IConcernService from "../../services/shared/IConcernService"
import { CustomType } from "../../types/type";
import { ConcernDataType, MessageType } from "../../model/shared/concern.model";
import { uploadImageToCloudinary, uploadVideoToCloudinary } from "../../utils/uploadImageToCloudinary ";
import { STATUS_CODES } from "../../constants/statusCode";

class ConcernController{
    private _concernService: IConcernService
    constructor(concernService: IConcernService){
        this._concernService = concernService;
    }

    async createConcern(req: CustomType,res: Response):Promise<void>{
        const userId= req.id
        const data = req.body;
        const file = req.file
        try {
            if(!userId){
                res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message:"userId is empty"})
                return
            }
            else if(!data.title || !data.description){
                res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message:"Title or description is empty"})
                return
            }
            if (file) {
                            console.log("File Details:", {
                                fieldname: file.fieldname,
                                originalname: file.originalname,
                                mimetype: file.mimetype,
                                size: file.size
                            });
                            
                            const cloudinaryUrl = await uploadVideoToCloudinary(file.buffer);
                            data.video = cloudinaryUrl; 
                            
                        }


            const concernData = {
                "title" : data.title,
                "description":data.description,
                "userId":userId,
                "concernUserId":data.userId,
                "concernMeetingId": data.meetingId,
                "role": data.role,
                "video": data.video
            } as ConcernDataType

            const newConcern =  await this._concernService.createConcern(concernData)
            if(newConcern){
                res.status(STATUS_CODES.OK).json({status: false, message:"concer created sucessfully"})
            }
        } catch (error) {
            console.log("error", error)
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:"error while creating concern"})
        }
    }

    //get concern data of each user 

    async getConcernData(req: CustomType, res: Response):Promise<void>{
        const userId = req.id
        const {status}= req.query

        if(!userId || Number(status)<0 || Number(status)>2){
            res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message:"userId or status is empty"})
            return;
        }
        try {
            const concernData = await this._concernService.getUserConcers(userId,Number(status))
            if(concernData){
                res.status(STATUS_CODES.OK).json({status: true, message:"data fetched suceesfully", data:concernData})
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:"unable to get the concern data"})
            
        }
    }

    async createConcernReplay(req:Request, res:Response):Promise<void>{
        const {comment,userType,meetingId} = req.body
        try {
            const data = {message: comment, userType } as MessageType
            const concernData = await this._concernService.createConcernReplay(data,meetingId)
            res.status(STATUS_CODES.OK).json({status:true, message:"comment added sucessfully", data:concernData})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:"error while adding replay"})
        }
    }
    
}

export default ConcernController
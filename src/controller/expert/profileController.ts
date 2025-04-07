import { Request , Response } from "express";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary ";
import IExpertService from "../../services/expert/IExpertService";
import { STATUS_CODES } from "../../constants/statusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessage";
import { CustomResponse } from "../../utils/customResponse";
import { UserType } from "../../model/user/userModel";
import { ExpertDocument } from "../../model/expert/expertModel";
import { SUCESS_MESSAGE } from "../../constants/sucessMessage";

class ProfileController{
    private profileService:IExpertService;
    constructor(profileService: IExpertService)
    {
        this.profileService = profileService
    }
    async getExpertDetails(req: Request | any, res:Response):Promise<void>{
        const email  =  req.user
        if(!email){   
            res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message:ERROR_MESSAGES.UNAUTHORIZED, data: null} as CustomResponse<null>)
            return;
        }
        try {
            const userData =  await this.profileService.getExpertByEmail(email)
            if (userData?.status === 1) {
          res.status(STATUS_CODES.OK).json({
            status: true,
            message: SUCESS_MESSAGE.DATA_FETCH_SUCESS,
            data: userData,
          } as CustomResponse<UserType>);
        } else {
          res.status(STATUS_CODES.BAD_REQUEST).json({
            status: false,
            message: ERROR_MESSAGES.BLOCKD_USER,
            data: null,
          } as CustomResponse<null>);
        }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
        }

    }


    async updateProfile(req: Request | any, res: Response): Promise<void> {
        const userId = req.id; 
        const data = req.body; 
        const file = req.file; 
    
        if (!userId) {
            res.status(STATUS_CODES.BAD_REQUEST).json({
                status: false,
                message: ERROR_MESSAGES.UNAUTHORIZED,
                data: null,
            } as CustomResponse<null>);
            return;
        }
        try {
            let profilePictureUrl = data.profilePicture;
            
            if (file) {
                const cloudinaryUrl = await uploadImageToCloudinary(file.buffer);
                profilePictureUrl = cloudinaryUrl; 
            }
    
            const skills = JSON.parse(data.skills || '[]');
            const experience = JSON.parse(data.experience || '[]');
            const qualification = JSON.parse(data.qualification || '[]');
    
            const updatedData = { 
                ...data, 
                skills,
                experience,
                qualification,
                profilePicture: profilePictureUrl 
            };
    
            const updatedProfile = await this.profileService.updateExpert(userId, updatedData);
    
            if (updatedProfile) {
                res.status(STATUS_CODES.OK).json({
                    status: true,
                    message: SUCESS_MESSAGE.UPDATION_SUCESS,
                    data: updatedProfile,
                } as CustomResponse<ExpertDocument>);
                return;
            } else {
                res.status(STATUS_CODES.NOT_FOUND).json({
                    status: false,
                    message: ERROR_MESSAGES.USER_NOT_FOUND,
                    data: null,
                } as CustomResponse<null>);
                return;
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
                data: null,
            } as CustomResponse<null>);
            return;
        }
    }


}
export default ProfileController;
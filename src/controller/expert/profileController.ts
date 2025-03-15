import { Request , Response } from "express";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary ";
import IExpertService from "../../services/expert/IExpertService";
import { STATUS_CODES } from "../../constants/statusCode";

class ProfileController{
    private profileService:IExpertService;
    constructor(profileService: IExpertService)
    {
        this.profileService = profileService
    }
    async getExpertDetails(req: Request | any, res:Response):Promise<void>{
        const email  =  req.user
        if(!email){   
            res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message:"user unautherized. please login", data: null})
            return;
        }
        try {
            const userData =  await this.profileService.getExpertByEmail(email)
            if (userData?.status === 1) {
          res.status(STATUS_CODES.OK).json({
            status: true,
            message: "User data fetched successfully",
            data: userData,
          });
        } else {
          res.status(STATUS_CODES.BAD_REQUEST).json({
            status: false,
            message: "User is blocked.",
            data: null,
          });
        }
        } catch (error) {
            
        }

    }


    async updateProfile(req: Request | any, res: Response): Promise<void> {
        const userId = req.id; 
        const data = req.body; 
        const file = req.file; 
    
        if (!userId) {
            res.status(STATUS_CODES.BAD_REQUEST).json({
                status: false,
                message: "User is not authorized. Please log in again.",
                data: null,
            });
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
                    message: "Profile updated successfully",
                    data: updatedProfile,
                });
                return;
            } else {
                res.status(STATUS_CODES.NOT_FOUND).json({
                    status: false,
                    message: "User profile not found",
                    data: null,
                });
                return;
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "An error occurred while updating the profile",
                data: null,
            });
            return;
        }
    }


}
export default ProfileController;
import { Request, Response } from "express";
import UserService from "../../services/user/Implimentation/userServices";
import { UserType } from "../../model/user/userModel";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary ";

class ProfileController {
  private profileService: UserService;
  constructor(userService: UserService) {
    this.profileService = userService;
  }
  async getProfile(req: Request | any, res: Response): Promise<void> {
    const email = req.user;
    if (email) {
      try {
        const userData = await this.profileService.findByEmail(email);
        if (userData?.status === 1) {
          res.status(200).json({
            status: true,
            message: "User data fetched successfully",
            data: userData,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "User is blocked.",
            data: null,
          });
        }
      } catch (error) {
        console.error("Error retrieving profile:", error);
        res.status(500).json({
          status: false,
          message: "Failed to fetch profile",
          data: null,
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message: "User is not authorized",
        data: null,
      });
    }
  }

  async updateProfile(req: Request | any, res: Response): Promise<void> {
    const { _id, ...data } = req.body;
    const file  = req.file
    if (!_id) {
      res
        .status(400)
        .json({
          status: false,
          message: "User is not authorized. Please log in again.",
          data: null,
        });
      return;
    }

    try {
      let profilePictureUrl = data.profilePicture;
            
            if (file) {
                console.log("File Details:", {
                    fieldname: file.fieldname,
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size
                });
                
                const cloudinaryUrl = await uploadImageToCloudinary(file.buffer);
                profilePictureUrl = cloudinaryUrl; 
            }
      

      const updateData = {
        qualification: data.qualification
          ? [{ qualification: data.qualification, college: data.college }]
          : undefined,
        address: data.address ?? undefined,
        experiance: data.totalExperience ?? undefined,
        job_title: data.currentJobTitle ?? undefined,
        occupation: data.occupation ?? undefined,
        employer: data.employer ?? undefined,
        start_date: data.startDate ? new Date(data.startDate) : undefined,
        end_date: data.endDate ? new Date(data.endDate) : undefined,
        first_name: data.firstName ?? undefined,
        last_name: data.lastName ?? undefined,
        status: data.status ?? undefined,
        skills: data.skills ?? undefined,
        profilePicture:profilePictureUrl,
      };

      Object.keys(updateData).forEach((key) => {
        const typedKey = key as keyof typeof updateData;
        if (updateData[typedKey] === undefined) {
          delete updateData[typedKey];
        }
      });

      const updateUser = await this.profileService.updateUserById(
        _id,
        updateData as UserType
      );

      if (updateUser) {
        res
          .status(200)
          .json({
            status: true,
            message: "Profile updated successfully",
            data: updateUser,
          });
      } else {
        res
          .status(404)
          .json({ status: false, message: "User not found", data: null });
      }
    } catch (error) {
      console.error("Error while updating", error);
      res
        .status(500)
        .json({ status: false, message: "Internal server error", data: null });
    }
  }

  async getExpertProfile(req:Request , res:Response):Promise<void>{
    const {id} = req.params
    try {
      if(!id){
        res.status(400).json({status:false, message:"Expert id is empty"});
        return
      }
      const expertData =  await this.profileService.getExpertById(id)
      if(expertData){
        res.status(200).json({status: true , message:"profile fetched successfully", data : expertData})
        return
      }
      res.status(400).json({status: false , message:"User is not active with this id"})

    } catch (error) {
      res.status(500).json({status:false, message:"error fetching profiledata"});
    }
  }
  
}
 
export default ProfileController;

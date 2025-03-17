import { Request,Response } from "express"
import ExpertService from "../../services/expert/Implimentation/expertServices"
import PasswordUtils from "../../utils/passwordUtils";
import JwtUtility from "../../utils/jwtUtility";
import { ExpertDocument } from "../../model/expert/expertModel";
import MailUtility from "../../utils/mailUtility";
import OtpUtility from "../../utils/otpUtility";
import IExpertService from "../../services/expert/IExpertService";
import IUserService from "../../services/user/IUserService";
import { STATUS_CODES } from "../../constants/statusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessage";

class ExpertController{ 
     private expertServece : IExpertService
     private _userService  : IUserService
    constructor(expertServece:IExpertService, userService : IUserService){
        this.expertServece = expertServece
        this._userService = userService
     }

    async signupPost(req: Request, res: Response):Promise<void>{
        const { email, password} =  req.body;
        if(!email.trim() || !password.trim())
        {
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false ,  message:ERROR_MESSAGES.INVALID_INPUT, data: null})
            return;
        }
        const existExpert = await this.expertServece.getExpertByEmail(email)
        if(existExpert && existExpert.status ===1)
        {
            res.status(STATUS_CODES.BAD_REQUEST).json({status: false ,  message:"user already exist. please signIn", data: null})
            return;
        }
        try {
          if(!existExpert){
            req.body.password =  await PasswordUtils.passwordHash(password)
            const createExpert= await this.expertServece.createExpert(req.body)
          }
            
                const otp = await OtpUtility.otpGenerator()
                const emailSend = await MailUtility.sendMail(email,otp,"Verifivation OTP")
                res.status(STATUS_CODES.OK).json({status:true, message:"An otp has sent to your email", data : {otp,email}})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null})
        }
     }

    async loginPost(req:Request , res:Response):Promise<void>{
        const {email,password} = req.body
        if(!email.trim() || !password.trim())
        {
            res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:"email and password is not in required format",data:null});
            return;
        } 
        const existExpert =  await this.expertServece.getExpertByEmail(email)
        if(!existExpert || !existExpert.password)
        {
            res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:"user not found. please signup",data:null});
            return;
        }else if(!existExpert.status){
          res.status(STATUS_CODES.FORBIDDEN).json({status:false, message:"user is blocked",data:null});
          return;
        }
        const checkPassword = await PasswordUtils.comparePassword(password,existExpert.password)
        if(!checkPassword)
        {
            res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:"incorrect password",data:null});
            return;
        }
        else
        {
            const accessToken = JwtUtility.generateAccessToken({email,id:existExpert._id})
            const refreshToken = JwtUtility.generateRefreshToken({email,id:existExpert._id})
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 1 * 60 * 60 * 1000,
            });
            res.status(STATUS_CODES.OK).json({status:true, message:"Login successfull",data:{accessToken,existExpert}});
        }
     }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        const {otp,storedOTP,storedEmail} = req.body;
        if (!otp) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: "OTP is required" });
          return;
        }
    
        
        if (!otp || !storedOTP || !storedEmail) {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: "OTP Timeout. Try again" });
          return;
        }
        if (storedOTP === otp) {
          const currentUser = await this.expertServece.getExpertByEmail(storedEmail);
          if (!currentUser) {
            res.status(STATUS_CODES.NOT_FOUND).json({ message: "User not found" });
            return;
          }
    
          const userData: ExpertDocument = { ...currentUser.toObject(), status: 1 };
          const updateUser = await this.expertServece.updateExpert(currentUser._id, userData);
    
          if (updateUser) {
            res
              .status(STATUS_CODES.OK)
              .json({ message: "OTP verified successfully", user: updateUser });
          } else {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.UPDATION_FAILED });
          }
        } else {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Incorrect OTP. Please try again" });
        }
     }
     async forgotPassword(req: Request, res: Response):Promise<void>{
      const {email}= req.body;
      if(!email){
        res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message : ERROR_MESSAGES.INVALID_INPUT});
        return
      }
      try {
        const userExist = await this.expertServece.getExpertByEmail(email)
      if(!userExist){
        res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message : 'User notfound. try again'});
        return
      }
      else if(userExist.status !== 1){
        res.status(STATUS_CODES.FORBIDDEN).json({status: false, message : 'Your account is blocked'});
        return
      }
      const otp = await OtpUtility.otpGenerator()
      const emailSend =  await MailUtility.sendMail(email,otp,"Reset Password")
      if(emailSend){
        res.status(STATUS_CODES.OK).json({status: true, message : 'An OTP has send to you email',data:{email, otp}});
        return
      }
      } catch (error) {
        console.log(error)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR});
      }
     }
     async updatePassword (req:Request , res : Response):Promise<void>{
      const {email,password}= req.body;
      if(!email || !password){
        res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message : 'user is not autherized'});
      }
      try {
        const existeUser =  await this.expertServece.getExpertByEmail(email)
        if(!existeUser){
          res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message : 'unbale to find the account please signup'});
          return
        }
        else if(existeUser.status !== 1){
          res.status(STATUS_CODES.FORBIDDEN).json({status: false, message : 'your account is blocked'});
          return
        }

        const hashPassword = await PasswordUtils.passwordHash(password)
        const data = {password : hashPassword} as ExpertDocument;
        const updatePassword = await this.expertServece.updateExpert(existeUser._id, data)
        if(updatePassword){
        res.status(STATUS_CODES.OK).json({status: true, message : 'password updated successfully'});
          return 
        }
        else
        res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message : ERROR_MESSAGES.UPDATION_FAILED});

      } catch (error) {
        console.log(error)
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR});
      }
     }

     async googleSignup(req:Request, res:Response):Promise<void>{
      const { name, email, image } = await req.body;
    
    if (!email) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT });
      return;
    } 
    try {
      let userData = await this.expertServece.getExpertByEmail(email)
    if(!userData){
    const data =  {email, first_name:name, profilePicture:image, status:1} as ExpertDocument
     userData =  await this.expertServece.createExpert(data)
    }
    if(userData && userData.status===1){
      const accessToken = JwtUtility.generateAccessToken({
        email: email,
        id: userData._id,
      }); 
      const refreshToken = JwtUtility.generateRefreshToken({
        email: email,
        id: userData._id,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1 * 60 * 60 * 1000,
      });
      res.status(STATUS_CODES.OK).json({status:true, message:"signup successfull", data:{userData,token: accessToken}})
      return;
    }
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false, message:"unable to signup. Try again"})
    
    } catch (error) {
      console.log("error occured during creating user", error)
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false, message:"unable to signup. Try again"})
    }
     }

     async getUserProfileById(req:Request, res: Response):Promise<void>{
      const userId = req.params.id
      try {
        if(!userId){
        res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message:ERROR_MESSAGES.INVALID_INPUT})
        return
        }

        const userData  =  await this._userService.getUserById(userId)
        if(userData)
          res.status(STATUS_CODES.OK).json({status: true, message:"data fetched sucessfull", data: userData})
      } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
      }
     }

    
}

export default ExpertController
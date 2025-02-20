import { Request,Response } from "express"
import ExpertService from "../../services/expert/Implimentation/expertServices"
import PasswordUtils from "../../utils/passwordUtils";
import JwtUtility from "../../utils/jwtUtility";
import { ExpertDocument } from "../../model/expert/expertModel";
import MailUtility from "../../utils/mailUtility";
import OtpUtility from "../../utils/otpUtility";
import IExpertService from "../../services/expert/IExpertService";
import IUserService from "../../services/user/IUserService";

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
            res.status(400).json({ status: false ,  message:"email or password isnot in required format", data: null})
            return;
        }
        const existExpert = await this.expertServece.getExpertByEmail(email)
        if(existExpert && existExpert.status ===1)
        {
            res.status(400).json({status: false ,  message:"user already exist. please signIn", data: null})
            return;
        }
        try {
          if(!existExpert){
            req.body.password =  await PasswordUtils.passwordHash(password)
            const createExpert= await this.expertServece.createExpert(req.body)
          }
            
                const otp = await OtpUtility.otpGenerator()
                const emailSend = await MailUtility.sendMail(email,otp,"Verifivation OTP")
                res.status(200).json({status:true, message:"An otp has sent to your email", data : {otp,email}})
        } catch (error) {
            res.status(500).json({status: false, message:` some eroor occured:${error}`, data: null})
        }
     }

    async loginPost(req:Request , res:Response):Promise<void>{
        const {email,password} = req.body
        if(!email.trim() || !password.trim())
        {
            res.status(400).json({status:false, message:"email and password is not in required format",data:null});
            return;
        } 
        const existExpert =  await this.expertServece.getExpertByEmail(email)
        if(!existExpert || !existExpert.password)
        {
            res.status(400).json({status:false, message:"user not found. please signup",data:null});
            return;
        }else if(!existExpert.status){
          res.status(403).json({status:false, message:"user is blocked",data:null});
          return;
        }
        const checkPassword = await PasswordUtils.comparePassword(password,existExpert.password)
        if(!checkPassword)
        {
            res.status(400).json({status:false, message:"incorrect password",data:null});
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
            res.status(200).json({status:true, message:"Login successfull",data:{accessToken,existExpert}});
        }
     }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        const {otp,storedOTP,storedEmail} = req.body;
        if (!otp) {
          res.status(400).json({ message: "OTP is required" });
          return;
        }
    
        
        if (!otp || !storedOTP || !storedEmail) {
          res.status(400).json({ message: "OTP Timeout. Try again" });
          return;
        }
        if (storedOTP === otp) {
          const currentUser = await this.expertServece.getExpertByEmail(storedEmail);
          if (!currentUser) {
            res.status(404).json({ message: "User not found" });
            return;
          }
    
          const userData: ExpertDocument = { ...currentUser.toObject(), status: 1 };
          const updateUser = await this.expertServece.updateExpert(currentUser._id, userData);
    
          if (updateUser) {
            res
              .status(200)
              .json({ message: "OTP verified successfully", user: updateUser });
          } else {
            res.status(500).json({ message: "Error updating user data" });
          }
        } else {
          res.status(400).json({ message: "Incorrect OTP. Please try again" });
        }
     }
     async forgotPassword(req: Request, res: Response):Promise<void>{
      const {email}= req.body;
      if(!email){
        res.status(400).json({status: false, message : 'email id is required'});
        return
      }
      try {
        const userExist = await this.expertServece.getExpertByEmail(email)
      if(!userExist){
        res.status(400).json({status: false, message : 'User notfound. try again'});
        return
      }
      else if(userExist.status !== 1){
        res.status(403).json({status: false, message : 'Your account is blocked'});
        return
      }
      const otp = await OtpUtility.otpGenerator()
      const emailSend =  await MailUtility.sendMail(email,otp,"Reset Password")
      if(emailSend){
        res.status(200).json({status: true, message : 'An OTP has send to you email',data:{email, otp}});
        return
      }
      } catch (error) {
        console.log(error)
        res.status(500).json({status: false, message : 'something went wrong'});
      }
     }
     async updatePassword (req:Request , res : Response):Promise<void>{
      const {email,password}= req.body;
      if(!email || !password){
        res.status(400).json({status: false, message : 'user is not autherized'});
      }
      try {
        const existeUser =  await this.expertServece.getExpertByEmail(email)
        if(!existeUser){
          res.status(400).json({status: false, message : 'unbale to find the account please signup'});
          return
        }
        else if(existeUser.status !== 1){
          res.status(403).json({status: false, message : 'your account is blocked'});
          return
        }

        const hashPassword = await PasswordUtils.passwordHash(password)
        const data = {password : hashPassword} as ExpertDocument;
        const updatePassword = await this.expertServece.updateExpert(existeUser._id, data)
        if(updatePassword){
        res.status(200).json({status: true, message : 'password updated successfully'});
          return 
        }
        else
        res.status(400).json({status: false, message : 'unable to update password. try again'});

      } catch (error) {
        console.log(error)
        res.status(500).json({status: false, message : 'something went wrong'});
      }
     }

     async googleSignup(req:Request, res:Response):Promise<void>{
      const { name, email, image } = await req.body;
    
    if (!email) {
      res.status(400).json({ status: false, message: "invalid email id " });
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
      res.status(200).json({status:true, message:"signup successfull", data:{userData,token: accessToken}})
      return;
    }
    res.status(500).json({status:false, message:"unable to signup. Try again"})
    
    } catch (error) {
      console.log("error occured during creating user", error)
      res.status(500).json({status:false, message:"unable to signup. Try again"})
    }
     }

     async getUserProfileById(req:Request, res: Response):Promise<void>{
      const userId = req.params.id
      try {
        if(!userId){
        res.status(400).json({ status: false, message:"user Id is empty"})
        return
        }

        const userData  =  await this._userService.getUserById(userId)
        if(userData)
          res.status(200).json({status: true, message:"data fetched sucessfull", data: userData})
      } catch (error) {
        res.status(500).json({ status: false, message:"unable to fetch user Data"})
      }
     }

    
}

export default ExpertController
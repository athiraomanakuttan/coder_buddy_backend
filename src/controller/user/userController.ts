import UserService from "../../services/user/Implimentation/userServices";
import { Request, Response } from "express";
import { getServerSession } from "next-auth";
import OtpUtility from "../../utils/otpUtility";
import MailUtility from "../../utils/mailUtility";
import { UserType } from "../../model/user/userModel";
import JwtUtility from "../../utils/jwtUtility";
import PasswordUtils from "../../utils/passwordUtils";
import IUserService from "../../services/user/IUserService";
import { CustomRequest } from "./postController";
import {STATUS_CODES } from '../../constants/statusCode'
import { ERROR_MESSAGES } from "../../constants/errorMessage";
import { CustomResponse } from "../../utils/customResponse";

class UserController {
  private userService: IUserService;
  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async signupPost(req: Request, res: Response): Promise<void> {
    try {
      const user = req.body;

      if (!user.email || !user.password) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_INPUT} as CustomResponse<null>);
        return;
      }

      const existingUser = await this.userService.findByEmail(user.email);

      if (existingUser) {
        if (existingUser.status === 0) {
          const otp = await OtpUtility.otpGenerator();
          try {
            await MailUtility.sendMail(user.email, otp, "Verification OTP");
            res
              .status(STATUS_CODES.OK)
              .json({
                message: "OTP resent to the email.",
                email: user.email,
                otp,
              });
          } catch (mailError) {
            console.error("Failed to resend OTP:", mailError);
            res
              .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
              .json({status:false, message: "Failed to send verification email." } as CustomResponse<null>);
          }
          return;
        } else {
          res.status(STATUS_CODES.CONFLICT).json({ status:false, message: "User already exists." }as CustomResponse<null>);
          return;
        }
      }

      user.password = await PasswordUtils.passwordHash(user.password);
      const newUser = await this.userService.createUser(user);

      const otp = await OtpUtility.otpGenerator();
      try {
        await MailUtility.sendMail(user.email, otp, "Verification OTP");
        res.status(STATUS_CODES.OK).json({
          message: "OTP sent to the email.",
          email: user.email,
          otp,
        });
      } catch (mailError) {
        console.error("Failed to send OTP:", mailError);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: "Failed to send verification email." } as CustomResponse<null>);
      }
    } catch (err: any) {
      console.error("Error during signup:", err);
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR } as CustomResponse<null>);
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const { otp, storedOTP, storedEmail } = req.body;
    if (!otp) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "OTP is required" } as CustomResponse<null>);
      return;
    }

    if (!otp || !storedOTP || !storedEmail) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "OTP Timeout. Try again" } as CustomResponse<null>);
      return;
    }
    if (storedOTP === otp) {
      const currentUser = await this.userService.getUserByEmail(storedEmail);
      if (!currentUser) {
        res.status(STATUS_CODES.NOT_FOUND).json({ status: false, message: "User not found" } as CustomResponse<null>);
        return;
      }

      const userData: UserType = { ...currentUser.toObject(), status: 1 };
      const updateUser = await this.userService.updateUser(
        storedEmail,
        userData
      );

      if (updateUser) {
        res
          .status(STATUS_CODES.OK)
          .json({status:false, message: "OTP verified successfully", data: updateUser } as CustomResponse<UserType>);
      } else {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.UPDATION_FAILED } as CustomResponse<null>);
      }
    } else {
      res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: "Incorrect OTP. Please try again" } as CustomResponse<null>);
    }
  }

  async loginPost(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({
          status: false,
          message: "Email and password required",
          data: null,
        } as CustomResponse<null>);
      return;
    }

    try {
      const existUser = await this.userService.getUserByEmail(email);
      if (!existUser) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({
            status: false,
            message: "User not found. Please sign up.",
            data: null,
          } as CustomResponse<null>);
        return;
      }

      if (!existUser.password) {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({
            status: false,
            message: "Password not set for this account",
            data: null,
          } as CustomResponse<null>);
        return;
      }

      if (!existUser.status) {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ status: false, message: "Account is blocked", data: null } as CustomResponse<null>);
        return;
      }

      const comparePassword = await PasswordUtils.comparePassword(
        password,
        existUser.password
      );

      if (!comparePassword) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({
            status: false,
            message: "Invalid email or password",
            data: null,
          } as CustomResponse<null>);
        return;
      }

      const accessToken = JwtUtility.generateAccessToken({
        email: email,
        id: existUser._id,
      });
      const refreshToken = JwtUtility.generateRefreshToken({
        email: email,
        id: existUser._id,
      });

      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1 * 60 * 60 * 1000,
      });

      const filteredData = {
        id: existUser._id,
        email: existUser.email,
      };

      res.status(STATUS_CODES.OK).json({
        status: true,
        message: "Login successful",
        data: { accessToken, refreshToken, user: filteredData },
      } as CustomResponse<{accessToken: string,user:{}}>);
    } catch (error) {
      console.error("Login Error:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        data: null,
      }as CustomResponse<null> );
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    if (!email) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT } as CustomResponse<null>);
      return;
    }
    const getUserData = await this.userService.findByEmail(email);
    if (!getUserData) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ status: false, message: "user not found. please signup" } as CustomResponse<null>);
      return;
    } else if (getUserData.status !== 1) { 
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ status: false, message: "Your account is blocked." } as CustomResponse<null>);
      return;
    }
    const otp = await OtpUtility.otpGenerator();
    const generateEmail = await MailUtility.sendMail(
      email,
      otp,
      "Password Reset"
    );
    if (generateEmail) {
      res
        .status(STATUS_CODES.OK)
        .json({
          status: true,
          message: "An OTP is send to your email",
          data: { email, otp },
        } as CustomResponse<{email: string,otp:number}>);
      return;
    } else
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({
          status: false,
          message: "not able to generate OTP. Please try again",
        } as CustomResponse<null>);
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT } as CustomResponse<null>);
      return;
    }
    try {
      const existUser = await this.userService.getUserByEmail(email);
      if (!existUser) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ status: false, message: "user not exist. please signup" });
        return;
      } else if (existUser.status !== 1) {
        res.status(STATUS_CODES.FORBIDDEN).json({ status: false, message: "user is blocked" } as CustomResponse<null>);
        return;
      }
      const hashPassword = (await PasswordUtils.passwordHash(
        password
      )) as string;
      const data = { password: hashPassword } as UserType;
      const updateUser = await this.userService.updateUserById(
        existUser._id as string,
        data
      );
      if (updateUser)
        res
          .status(STATUS_CODES.OK)
          .json({ status: true, message: "password updated sucessfully" } as CustomResponse<null>);
      else
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ status: false, message: "unable to update password" } as CustomResponse<null>);
    } catch (error) {
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR } as CustomResponse<null>);
    }
  }
  async googleSinup(req: Request, res: Response): Promise<void> {
    const { name, email, image } = await req.body;
    if (!email) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT } as CustomResponse<null>);
      return;
    } 
    try {
      let userData = await this.userService.findByEmail(email)
    if(!userData){
    const data =  {email, first_name:name, profilePicture:image, status:1} as UserType
     userData =  await this.userService.createUser(data)
    }

    if(!userData || userData.status!==1){
      res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:"account is blocked "} as CustomResponse<null>)
      return;
    }
    const accessToken = JwtUtility.generateAccessToken({
      email: email,
      id: userData._id,
    });
    const refreshToken = JwtUtility.generateRefreshToken({
      email: email,
      id: userData._id,
    });

    res.cookie("userRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1 * 60 * 60 * 1000,
    });
    res.status(STATUS_CODES.OK).json({status:true, message:"signup successfull", data:{userData,token: accessToken}})
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
    }
  }

  async getDashboardReport(req:CustomRequest,res:Response):Promise<void>{
    const userId = req.id
    try {
      if(!userId){
        res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message:ERROR_MESSAGES.UNAUTHORIZED} as CustomResponse<null>)
        return
      }
      const totalPost = await this.userService.getPostCount(userId)
      const meetingData = await this.userService.getMeetingDetails(userId)
      res.status(STATUS_CODES.OK).json({status: true, message:"data fetched sucessfull", data : {...totalPost,...meetingData}})
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
    }
  }

  async getAllTechnologies(req:Request, res:Response):Promise<void>{
    try {
      const data = await this.userService.getAllTechnologies()
      res.status(STATUS_CODES.OK).json({status: true, message:"data fetched sucssfully", data})
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.userRefreshToken;
      if (!refreshToken) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          status: false,
          message: 'Refresh token not found',
          data: null,
        } as CustomResponse<null>);
        return;
      }
  
      try {
        const decoded = JwtUtility.verifyToken(refreshToken, true) as { email: string; id: string };
  
        const accessToken = JwtUtility.generateAccessToken({
          email: decoded.email,
          id: decoded.id,
        });
  
        // Optionally, you can also rotate (generate a new) refresh token for better security
        const newRefreshToken = JwtUtility.generateRefreshToken({
          email: decoded.email,
          id: decoded.id,
        });
  
        // Set the new refresh token as an HTTP-only cookie
        res.cookie('userRefreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60 * 1000, // 1 day, matching your JWT expiry
        });
  
        // Return the new access token to the client
        res.status(STATUS_CODES.OK).json({
          status: true,
          message: 'Token refreshed successfully',
          data: {
            accessToken,
          },
        } as CustomResponse<{accessToken:string}>);
      } catch (tokenError) {
        // Token verification failed
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          status: false,
          message: 'Invalid refresh token',
          data: null,
        } as CustomResponse<null>);
      }
    } catch (error) {
      console.error('Refresh Token Error:', error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        data: null,
      } as CustomResponse<null>);
    }
  }
  
}

export default UserController;

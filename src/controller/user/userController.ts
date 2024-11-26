import UserService from "../../services/user/userServices";
import { Request, Response } from "express";
import PasswordUtils from "../../utils/passwordUtils";
import OtpUtility from "../../utils/otpUtility";
import MailUtility from '../../utils/mailUtility'
import { UserType } from "../../model/user/userModel";
class UserController {
    private userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService;
    }


    async signupPost(req: Request, res: Response): Promise<void> {
        try {
            const user = req.body;
            if (!user.email || !user.password) {
                res.status(400).json({ message: "Email and password are required." });
                return;
            }
            const existingUser = await this.userService.findByEmail(user.email);
            if (existingUser) {
                res.status(409).json({ message: "User already exists." });
                return;
            }
            user.password = await PasswordUtils.passwordHash(user.password);
            const newUser = await this.userService.createUser(user);
            if (newUser) {
                const otp = await OtpUtility.otpGenerator();
                if (!req.session) {
                    res.status(500).json({ message: "Session not initialized." });
                    return;
                }
                (req.session as any).OTP = otp;
                (req.session as any).email = user.email;
                try {
                    const mailSend = await MailUtility.sendMail(user.email, otp, "Verification OTP");
                    res.status(200).json("otp send to the email")
                } catch (mailError) {
                    res.status(500).json({ message: "Failed to send verification email." });
                    return;
                }
            }
        } catch (err: any) {
            console.error("Error during signup:", err);
            res.status(500).json({ message: `Error while adding: ${err.message}` }); 
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        const data = req.body;
        const otp = Number(data.otp)
        if (!otp) {
            res.status(400).json({ message: "OTP is required" });
            return;
        }
    
        const sessionOTP = (req.session as any).OTP;
        const userEmail = (req.session as any).email;
        
        if (!sessionOTP || !userEmail) {
            res.status(400).json({ message: "OTP Timeout. Try again" });
            return;
        }
        if (sessionOTP === otp) {
            // Fetch the current user data first
            const currentUser = await this.userService.getUserByEmail(userEmail);
            if (!currentUser) {
                res.status(404).json({ message: "User not found" });
                return;
            }
    
            // Update only the status field
            const userData: UserType = { ...currentUser.toObject(), status: 1 };
            const updateUser = await this.userService.updateUser(userEmail, userData);
    
            if (updateUser) {
                res.status(200).json({ message: "OTP verified successfully", user: updateUser });
            } else {
                res.status(500).json({ message: "Error updating user data" });
            }
        } else {
            res.status(400).json({ message: "Incorrect OTP. Please try again" });
        }
    }

    async loginPost(req:Request,res:Response):Promise<void>{
        const {email, password} = req.body;

        if(!email || !password)
        {
            res.status(400).json({ message : "email and password required"})
            return;
        }
        try {
            const existUser = await this.userService.getUserByEmail(email);
            if(!existUser){
                res.status(200).json({message:"user not found. Please signup"})
                return;
            }
            else if (!existUser.password) {
                res.status(400).json({ message: "Password not set for this account" });
                return;
            }
            const comparePassword = await PasswordUtils.comparePassword(existUser.password, password)
            if (!comparePassword) {
                res.status(401).json({ message: "Invalid email or password" });
                return;
            }
            res.status(200).json({ message: "Login successful", user: existUser });
        } catch (error) {
            res.status(500).json({"message":"failed to login. Try again", error})
        }
    }
    
    

}

export default UserController;

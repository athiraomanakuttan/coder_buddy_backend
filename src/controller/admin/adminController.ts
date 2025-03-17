import { Request,Response } from "express"
import JwtUtility from "../../utils/jwtUtility"
import { UserType } from "../../model/user/userModel"
import { ExpertDocument } from "../../model/expert/expertModel"
import IAdminService from "../../services/admin/IAdminService"
import { STATUS_CODES } from "../../constants/statusCode"
import { ERROR_MESSAGES } from "../../constants/errorMessage"

class AdminController{
    private adminService: IAdminService  
    constructor(adminService : IAdminService)
    {
        this.adminService = adminService
    }
    async signupPost(req:Request, res: Response):Promise<void>{
        const {email, password}= req.body
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD
        if(!email || !password){
            res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:ERROR_MESSAGES.INVALID_INPUT})
            return
        }
        else if(!adminEmail || !adminPassword ){
            res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:ERROR_MESSAGES.INVALID_INPUT})
            return
        }
        const checkCredentails = this.adminService.adminSignup({email,password},{email:adminEmail,password:adminPassword})
        if(!checkCredentails.status){
            res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:checkCredentails.message})
            return
        }
        const accessToken =  JwtUtility.generateAccessToken({email,role:"admin"})
        const refreshToken =  JwtUtility.generateRefreshToken({email,role:"admin"})
        res.cookie('refreshToken',refreshToken,{ 
            httpOnly: true,
            secure: false,
            maxAge: 1 * 60 * 60 * 1000,})
        res.status(STATUS_CODES.OK).json({status: true,message:"login successfull", accessToken})
    }

    async getUserData(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;
    
            const totalUsers = await this.adminService.countTotalUsers(); 
            const userData = await this.adminService.getUserData(skip, limit);

            res.status(STATUS_CODES.OK).json({ 
                status: true, 
                message: "Data fetched successfully", 
                data: userData,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalUsers / limit),
                    totalUsers: totalUsers,
                    limit: limit,
                    userData
                }
            });
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 
                data: null
            });
        }
    }


    async getExpertData(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = parseInt(req.query.status as string) || 0
    
            const skip = (page - 1) * limit;
    
            const { experts, total } = await this.adminService.getExpertPendingList(status,skip, limit);
    
            const totalPages = Math.ceil(total / limit);
    
            res.status(STATUS_CODES.OK).json({ 
                status: true, 
                message: "Data fetched successfully", 
                data: {
                    experts,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalExperts: total,
                        limit
                    }
                }
            });
        } catch (error) {
            console.error(error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 
                data: null
            });
        }
    }

    async changeUserStatus(req:Request , res:Response):Promise<void>{
        const {id, status} = req.body
        if(!id || status===undefined){
            res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
            return;
        }
        const checkUser =  await this.adminService.getUserById(id)
        if(!checkUser){
            res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:"user not found"})
            return
        }
        try {
            const data ={ status: status} as UserType
            const updateUser =  await this.adminService.updateUserById(id,data)
            res.status(STATUS_CODES.OK).json({status:true, message:"user status updated successfully"})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
        }

    }

    async getExpertDetails(req:Request , res: Response):Promise<void>{
        const { id } = req.params
        try {
            const expertData =  await this.adminService.getExpertById(id)
            res.status(STATUS_CODES.OK).json({status: true, message:"data fetched successfully", data:expertData})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR})

        }
    }

    async changeExpertStatus(req:Request, res:Response):Promise<void>{
        const {id} = req.body
        if(!id ){
            res.status(STATUS_CODES.BAD_REQUEST).json({status: false, message : ERROR_MESSAGES.INVALID_INPUT})
            return;
        }
        try {
            const data = {status : 0 } as ExpertDocument 
            const updateExpert = await this.adminService.updateExpertById(id,data) 
            res.status(STATUS_CODES.OK).json({status:true, message:"expert rejected",data:updateExpert})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR})

        }
    }

    //enable and disable expert
    async enableDisableStatus(req: Request,res: Response):Promise<void>{
        const {expertId, status}= req.body
        if(!expertId || Number(status)>1 || Number(status)<0){
            res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message:"expert id is empty or invalid status" })
            return
        }

        try {
            const changedStatus =  await this.adminService.updateExpertStatus(expertId, Number(status))
            if(changedStatus)
                res.status(STATUS_CODES.OK).json({status: true, message:"status updated", data:changedStatus})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message:"unable to change status" })
        }
    }

    async getUserDataById(req:Request, res:Response):Promise<void>{
        const userId = req.params.id
        try {
            const userData =  await this.adminService.getUserById(userId)
            if(userData)
                res.status(STATUS_CODES.OK).json({status:true, message:"user data fetched sucessfully", data:userData})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:"unable to fetch user data"})
        }
    }    
    
    async getAdminProfitReport(req:Request,res:Response):Promise<void>{
        const {year} =  req.query
        try {
            const profitReport = await this.adminService.getMonthlyProfitReport(Number(year) ?? new Date().getFullYear())
            res.status(STATUS_CODES.OK).json({status: true, data: profitReport})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:"unable to fetch the data"})
        }
    }

    async getWalletData(req:Request, res:Response):Promise<void>{
        try {
            const data = await this.adminService.getWalletData()
            res.status(STATUS_CODES.OK).json({status: true, message: "data fetched sucessfully", data})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:"unable to get the data"})
        }
    }
}
export default AdminController
import PaymentService from "../../services/expert/Implimentation/paymentService";
import {Request,Response } from "express";
import {CustomType, PaymentListResponseType} from '../../types/type'
import Razorpay from 'razorpay';
import crypto from 'crypto';
import IPaymentService from "../../services/expert/IPaymentService";
import axios from "axios";
import IExpertService from "../../services/expert/IExpertService";
import { STATUS_CODES } from "../../constants/statusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessage";
import { CustomResponse } from "../../utils/customResponse";
import { PaymentType } from "../../model/expert/paymentModel";
import { WalletDataType } from "../../model/expert/wallet.model";
import { SUCESS_MESSAGE } from "../../constants/sucessMessage";


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID !,
    key_secret: process.env.RAZORPAY_SECRET_KEY !
});


class PaymentController{
    private paymentService:IPaymentService;
    private _expertService :IExpertService
    constructor(paymentService:IPaymentService, expertService:IExpertService){
        this.paymentService = paymentService
        this._expertService = expertService;
    }

    async createPayment(req:CustomType,res:Response):Promise<void>{
        const expertId = req.id
        const {title , amount , userId, postId} = req.body
        if(!title || !userId || !expertId){
             res.status(STATUS_CODES.BAD_REQUEST).json({status:false,message:ERROR_MESSAGES.UNABLE_TO_CREATE} as  CustomResponse<null>)
             return 
        }
        if(!amount || Number(amount)>10000 || Number(amount)<=0){
            res.status(STATUS_CODES.BAD_REQUEST).json({status:false,message:"Amount range should be between 1 - 10000"} as  CustomResponse<null>)
            return
        }
        try {
            const response =  await this.paymentService.createMeetingLink(title,Number(amount),userId,expertId, postId)
            if(!response){
                res.status(STATUS_CODES.BAD_REQUEST).json({status:false,message:ERROR_MESSAGES.UNABLE_TO_CREATE} as  CustomResponse<null>)
                return
            }
            res.status(STATUS_CODES.OK).json({status:true,message:SUCESS_MESSAGE.CREATION_SUCESS, data:response} as  CustomResponse<PaymentType>)
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as  CustomResponse<null>)
        }   
    }

    async getPaymentsList(req:CustomType, res:Response):Promise<void>{
        const userId = req.id
        const {status ,page, count}= req.query
        
        if(!userId){
            res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:ERROR_MESSAGES.UNAUTHORIZED} as  CustomResponse<null>)
            return
        }
        try {
            const paymentDetails =  await this.paymentService.getPaymentList(userId, Number(status), Number(page), Number(count))
            if(paymentDetails)
            res.status(STATUS_CODES.OK).json({status:true, message:SUCESS_MESSAGE.DATA_FETCH_SUCESS, data:paymentDetails} as  CustomResponse<PaymentListResponseType>)
                
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as  CustomResponse<null>)
            
        }
    }

    async getPaymentDetails(req:Request,res:Response):Promise<void>{
        const {id} = req.params
        try {
            const paymentDetails = await this.paymentService.getPaymentById(id) 
            if(paymentDetails){
                res.status(STATUS_CODES.OK).json({status:true, message:SUCESS_MESSAGE.DATA_FETCH_SUCESS,data:paymentDetails}  as  CustomResponse<PaymentType>)
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR}  as  CustomResponse<null>)
            
        }
    }

    async createRazorpayOrder(req: CustomType, res: Response): Promise<void> {
        try {
            const { amount, orderId } = req.body;
    
            const options = {
                amount: amount * 100, // Convert to paise
                currency: 'INR',
                receipt: orderId,
                payment_capture: 1
            };
    
            const order = await razorpay.orders.create(options);
    
            res.status(STATUS_CODES.OK).json({
                id: order.id,
                amount: order.amount,
                key: process.env.RAZORPAY_KEY_ID
            });
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false,message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }  as  CustomResponse<null>);
        }
    }
    
    async verifyPayment(req: Request, res: Response): Promise<void> {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, paymentId } = req.body;
    
        console.log("razorpay_payment_id", razorpay_signature);
    
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY!)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');
    
        console.log("generated_signature", generated_signature);
    
        if (generated_signature === razorpay_signature) {
            // Update payment status to success
            await this.paymentService.updatePaymentById(paymentId, 1, razorpay_payment_id);
    
            const paymentDetails = await this.paymentService.getPaymentById(paymentId);
            if (paymentDetails) {
                const expertId = paymentDetails.expertId;
                const amountToAdd = paymentDetails.amount * 0.7;  
                const adminAmount = paymentDetails.amount - amountToAdd
                   const  walletDetails = await this.paymentService.createWallet({
                        expertId: expertId.toString(),
                        amount: amountToAdd,
                        transaction: [{
                            paymentId: paymentId,
                            amount: amountToAdd,
                            dateTime: new Date()
                        }]
                    });
                    const adminProfitData =  await this.paymentService.addAdminProfit({
                        expertId: expertId.toString(),
                        amount: adminAmount,
                        transaction: [{
                            paymentId: paymentId,
                            amount: amountToAdd,
                            dateTime: new Date()
                        }]
                    })
               
            }
    
            res.status(STATUS_CODES.OK).json({
                status: true,
                message: SUCESS_MESSAGE.PAYMENT_VERIFIED
            } as  CustomResponse<null>);
        } else {
            await this.paymentService.updatePaymentById(paymentId, 0, null);
            res.status(STATUS_CODES.BAD_REQUEST).json({
                status: false,
                message: ERROR_MESSAGES.PAYMENT_VERIFICATION_FAILED
            }  as  CustomResponse<null>);
        }
    };


    //======================== walllet related  functions =================================
    async getExpertWallet(req:CustomType, res:Response):Promise<void>{
        const expertId   =  req.id
        try {
            if(!expertId){
                res.status(STATUS_CODES.UNAUTHORIZED).json({status: false, message: ERROR_MESSAGES.UNAUTHORIZED}  as  CustomResponse<null>)
                return;
            }

            const walletData = await this.paymentService.getWalletByExpertId(expertId)
            if(walletData){
                res.status(STATUS_CODES.OK).json({status: true, message:SUCESS_MESSAGE.DATA_FETCH_SUCESS, data:walletData}  as  CustomResponse<WalletDataType>)
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR}  as  CustomResponse<null>)
        }
    }
    
    async expertPayout(req: CustomType, res: Response): Promise<void> {
        try {
            const expertId = req.id;
            const { amount, UPIid } = req.body;
    
            if (!expertId) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_INPUT }  as  CustomResponse<null>);
                return;
            }
    
            const walletData = await this.paymentService.getWalletByExpertId(expertId);
            if (!walletData) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.WALLET_EMPTY }  as  CustomResponse<null>);
                return;
            }
    
            if (amount <= 0 || amount > walletData.amount) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INVALID_AMOUNT }  as  CustomResponse<null>);
                return;
            }
     
    
            await this.paymentService.createWallet({
                expertId,
                amount: -amount,
                transaction: [{
                    paymentId: "",
                    amount: amount,
                    dateTime: new Date(),
                    transactionType: "debited"
                }]
            });
    
            res.status(STATUS_CODES.OK).json({
                status: true,
                message: SUCESS_MESSAGE.PAYOUT_INITIATED,
            }  as  CustomResponse<null>);
    
        } catch (error: any) {
            console.error(" Payout Error:", error.response?.data || error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: error.response?.data?.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR
            }  as  CustomResponse<null>);
        }
    }
    
    
}

export default PaymentController
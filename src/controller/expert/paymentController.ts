import PaymentService from "../../services/expert/Implimentation/paymentService";
import {Request,Response } from "express";
import {CustomType} from '../../types/type'
import Razorpay from 'razorpay';
import crypto from 'crypto';
import IPaymentService from "../../services/expert/IPaymentService";
import axios from "axios";
import IExpertService from "../../services/expert/IExpertService";


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
             res.status(400).json({status:false,message:"unable to create meeting link"})
             return 
        }
        if(!amount || Number(amount)>10000 || Number(amount)<=0){
            res.status(400).json({status:false,message:"Amount range should be between 1 - 10000"})
            return
        }
        try {
            const response =  await this.paymentService.createMeetingLink(title,Number(amount),userId,expertId, postId)
            if(!response){
                res.status(400).json({status:false,message:"unable to create meeting link"})
                return
            }
            res.status(200).json({status:true,message:"meeting link created sucessfully", data:response})
        } catch (error) {
            console.log("error", error)
            res.status(500).json({status:false,message:"unable to create meeting link"})
        }   
    }

    async getPaymentsList(req:CustomType, res:Response):Promise<void>{
        const userId = req.id
        const {status ,page, count}= req.query
        
        if(!userId){
            res.status(400).json({status:false, message:"user id is empty try again"})
            return
        }
        try {
            const paymentDetails =  await this.paymentService.getPaymentList(userId, Number(status), Number(page), Number(count))
            if(paymentDetails)
            res.status(200).json({status:true, message:"data fetched sucessfully", data:paymentDetails})
                
        } catch (error) {
            res.status(500).json({status:false, message:"unable to fetch data "})
            
        }
    }

    async getPaymentDetails(req:Request,res:Response):Promise<void>{
        const {id} = req.params
        try {
            const paymentDetails = await this.paymentService.getPaymentById(id) 
            if(paymentDetails){
                res.status(200).json({status:true, message:"data fetched sucessfull",data:paymentDetails})
            }
        } catch (error) {
            res.status(500).json({status:false, message:"unable to fetch details"})
            
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
    
            res.status(200).json({
                id: order.id,
                amount: order.amount,
                key: process.env.RAZORPAY_KEY_ID
            });
        } catch (error) {
            res.status(500).json({ error: 'Order creation failed' });
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
    
            res.status(200).json({
                status: 'success',
                message: 'Payment verified successfully'
            });
        } else {
            await this.paymentService.updatePaymentById(paymentId, 0, null);
            res.status(400).json({
                status: 'failed',
                message: 'Payment verification failed'
            });
        }
    };


    //======================== walllet related  functions =================================
    async getExpertWallet(req:CustomType, res:Response):Promise<void>{
        const expertId   =  req.id
        try {
            if(!expertId){
                res.status(401).json({status: false, message: "expert id is empty"})
                return;
            }

            const walletData = await this.paymentService.getWalletByExpertId(expertId)
            if(walletData){
                res.status(200).json({status: true, message:"data fetched sucessfull", data:walletData})
            }
        } catch (error) {
            
        }
    }
    
    async expertPayout(req: CustomType, res: Response): Promise<void> {
        try {
            const expertId = req.id;
            const { amount, UPIid } = req.body;
    
            if (!expertId) {
                res.status(400).json({ status: false, message: "Invalid user ID" });
                return;
            }
    
            const walletData = await this.paymentService.getWalletByExpertId(expertId);
            if (!walletData) {
                res.status(400).json({ status: false, message: "Your wallet is empty" });
                return;
            }
    
            if (amount <= 0 || amount > walletData.amount) {
                res.status(400).json({ status: false, message: "Invalid amount" });
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
    
            res.status(200).json({
                status: true,
                message: "Test payout initiated successfully",
            });
    
        } catch (error: any) {
            console.error("Test Payout Error:", error.response?.data || error);
            res.status(500).json({
                status: false,
                message: error.response?.data?.message || "Something went wrong"
            });
        }
    }
    
    
}

export default PaymentController
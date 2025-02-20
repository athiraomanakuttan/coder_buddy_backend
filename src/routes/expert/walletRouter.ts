import { Router } from "express";
import PaymentRepositoryImplimentation from "../../repositories/implementation/expert/paymentRepositoryImplimentation";
import ExpertRepositoryImplementation from "../../repositories/implementation/expert/expertRepositoryImplimentation";
import PaymentService from "../../services/expert/Implimentation/paymentService";
import PaymentController from "../../controller/expert/paymentController";
import authenticationMiddleware from "../../middleware/authenticationMiddleware";
import ExpertService from "../../services/expert/Implimentation/expertServices";
const router = Router()

// Repository 
const paymentRepositoryImplimentation = new PaymentRepositoryImplimentation()
const expertRepositoryImplementation = new ExpertRepositoryImplementation()

// Service
const paymentService =  new PaymentService(paymentRepositoryImplimentation)
const expertService = new ExpertService(expertRepositoryImplementation)

// controller
const walletController =  new PaymentController(paymentService,expertService)

router.get('/get-wallet', authenticationMiddleware as any , (req,res)=> walletController.getExpertWallet(req,res))
router.post('/expert-payout', authenticationMiddleware as any, (req,res)=>walletController.expertPayout(req,res))
export default router
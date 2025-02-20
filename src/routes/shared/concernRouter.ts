import { Router } from "express";
import ConcernRepository from '../../repositories/implementation/shared/concernRepository'
import ConcernService from "../../services/shared/Implementation/concernService";
import ConcernController from "../../controller/shared/concernController";
import authenticationMiddleware from "../../middleware/authenticationMiddleware";
import {uploadVideo} from "../../config/multerVideoConfig"
const router = Router()
 
const concernRepository = new ConcernRepository()
const concernService = new ConcernService(concernRepository)
const concernController = new ConcernController(concernService)


router.post('/create-concern', authenticationMiddleware as any, uploadVideo.single("video"), (req,res)=>concernController.createConcern(req,res))
router.get('/get-user-concern', authenticationMiddleware as any, (req,res)=>concernController.getConcernData(req,res))
router.post("/add-concern-replay", authenticationMiddleware as any, (req,res)=> concernController.createConcernReplay(req,res))

export default router;
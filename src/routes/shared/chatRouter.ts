import { Router } from "express";
import ChatRepositoryImplimenation from "../../repositories/implementation/shared/chatRepositoryImplimentation";
import ChatService from "../../services/shared/Implementation/chatService";
import ChatController from "../../controller/shared/chatController";
import authenticationMiddleware from '../../middleware/authenticationMiddleware'
import UserService from "../../services/user/Implimentation/userServices";
import UserRepositoryImplementation from "../../repositories/implementation/user/userRepositoryImplemenatation";
import ExpertService from "../../services/expert/Implimentation/expertServices";
import ExpertRepositoryImplementation from "../../repositories/implementation/expert/expertRepositoryImplimentation";

const chatRepositoryImplimentation = new ChatRepositoryImplimenation()
const userRepositoryImplementation = new UserRepositoryImplementation();
const expertRepositoryImplementation = new ExpertRepositoryImplementation();


const chatService = new ChatService(chatRepositoryImplimentation)
const userService = new UserService(userRepositoryImplementation)
const experService = new ExpertService(expertRepositoryImplementation)

const chatController =  new ChatController(chatService , userService , experService)

const router = Router();

router.get('/get-chat-list', authenticationMiddleware as any , (req,res)=>chatController.getChatList(req,res))
router.post('/new-chat', authenticationMiddleware as any,(req,res)=> chatController.newMessage(req,res))
router.get('/:chatId',authenticationMiddleware as any, (req,res)=>chatController.getChatMessage(req,res))
router.post('/expert-chat', authenticationMiddleware as any, (req,res)=>chatController.createNewChat(req,res))
export default router